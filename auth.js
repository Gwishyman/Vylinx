// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getDatabase, ref, set, get, child, remove } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHY0RBY3jK7ZnuM2anIbKzFDd65xwMiyg",
  authDomain: "vylinx-11e87.firebaseapp.com",
  projectId: "vylinx-11e87",
  storageBucket: "vylinx-11e87.appspot.com", // fixed domain
  messagingSenderId: "710300713760",
  appId: "1:710300713760:web:c4ee8f53be614f5869cd45",
  databaseURL: "https://vylinx-11e87-default-rtdb.firebaseio.com" // this is the required line
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
