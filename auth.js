// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHY0RBY3jK7ZnuM2anIbKzFDd65xwMiyg",
  authDomain: "vylinx-11e87.firebaseapp.com",
  projectId: "vylinx-11e87",
  storageBucket: "vylinx-11e87.appspot.com",
  messagingSenderId: "710300713760",
  appId: "1:710300713760:web:c4ee8f53be614f5869cd45",
  databaseURL: "https://vylinx-11e87-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app); // For Realtime Database (user data)

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
      const snapshot = await get(ref(rtdb, "users"));
      const existingUsers = snapshot.exists() ? snapshot.val() : {};
      const usernameExists = Object.values(existingUsers).some(u => u.username === username);

      if (usernameExists) {
        alert("Username already taken.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await set(ref(rtdb, "users/" + uid), {
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
        const snapshot = await get(ref(rtdb, "users"));
        const users = snapshot.exists() ? snapshot.val() : {};
        const match = Object.values(users).find(u => u.username === input);
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

// EXPORTS
export async function deleteCurrentUser() {
  const user = auth.currentUser;
  if (!user) return;

  const serversSnap = await getDocs(collection(db, "servers"));
  const deletions = [];
  serversSnap.forEach((doc) => {
    if (doc.data().createdBy === user.uid) {
      deletions.push(deleteDoc(doc.ref));
    }
  });

  await Promise.all(deletions);
  await deleteUser(user);
  alert("Account and your servers deleted.");
  window.location.href = "index.html";
}
