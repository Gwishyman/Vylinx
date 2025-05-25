// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDz-0nN1i3DZfOvFiOtDaBrTVE3V9osU8g",
  authDomain: "chat-app-2f6a8.firebaseapp.com",
  projectId: "chat-app-2f6a8",
  storageBucket: "chat-app-2f6a8.appspot.com",
  messagingSenderId: "973274893092",
  appId: "1:973274893092:web:700c85bb5c4f1b0f187d29",
  databaseURL: "https://chat-app-2f6a8-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// SIGNUP
const signupBtn = document.getElementById("signup");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const username = document.getElementById("username")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!username || !email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      // Ensure username is unique
      const snapshot = await get(ref(db, "users"));
      const existingUsers = snapshot.exists() ? snapshot.val() : {};
      const usernameExists = Object.values(existingUsers).some(user => user.username === username);
      if (usernameExists) {
        alert("Username already taken.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await set(ref(db, "users/" + uid), {
        username,
        email
      });

      alert("Signup successful!");
      window.location.href = "servers.html";
    } catch (error) {
      alert("Signup error: " + error.message);
    }
  });
}

// LOGIN
const loginBtn = document.getElementById("login");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const input = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (!input || !password) {
      alert("Please enter both email/username and password.");
      return;
    }

    try {
      let emailToUse = input;
      if (!input.includes("@")) {
        // Assume it's a username, look up email
        const snapshot = await get(ref(db, "users"));
        const users = snapshot.exists() ? snapshot.val() : {};
        const match = Object.values(users).find(user => user.username === input);
        if (!match) {
          alert("Username not found.");
          return;
        }
        emailToUse = match.email;
      }

      await signInWithEmailAndPassword(auth, emailToUse, password);
      alert("Login successful!");
      window.location.href = "servers.html";
    } catch (error) {
      alert("Login error: " + error.message);
    }
  });
}
