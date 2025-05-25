alert("auth.js loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBHY0RBY3jK7ZnuM2anIbKzFDd65xwMiyg",
  authDomain: "vylinx-11e87.firebaseapp.com",
  projectId: "vylinx-11e87",
  storageBucket: "vylinx-11e87.appspot.com",
  messagingSenderId: "710300713760",
  appId: "1:710300713760:web:c4ee8f53be614f5869cd45"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup Logic
const signupBtn = document.getElementById("signup");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
      alert("All fields are required.");
      return;
    }

    // Check for duplicate email or username
    const usersRef = collection(db, "users");

    const qUsername = query(usersRef, where("username", "==", username));
    const qEmail = query(usersRef, where("email", "==", email));
    const [usernameSnapshot, emailSnapshot] = await Promise.all([
      getDocs(qUsername),
      getDocs(qEmail)
    ]);

    if (!usernameSnapshot.empty) {
      alert("Username already in use.");
      return;
    }
    if (!emailSnapshot.empty) {
      alert("Email already in use.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        username,
        email,
        createdAt: Date.now()
      });
      window.location.href = "servers.html";
    } catch (err) {
      console.error("Signup Error:", err);
      alert(err.message);
    }
  });
}

// Login Logic
const loginBtn = document.getElementById("login");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const identifier = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!identifier || !password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      let email = identifier;

      // Check if it's a username
      if (!identifier.includes("@")) {
        const q = query(collection(db, "users"), where("username", "==", identifier));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          alert("Username not found.");
          return;
        }
        email = snapshot.docs[0].data().email;
      }

      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "servers.html";
    } catch (err) {
      console.error("Login Error:", err);
      alert("Invalid login.");
    }
  });
}

// Account deletion logic (for servers.html)
const deleteBtn = document.getElementById("delete-account");
if (deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      alert("Account deleted.");
      window.location.href = "index.html";
    } catch (err) {
      console.error("Account Deletion Error:", err);
      alert("Failed to delete account. Try logging in again.");
    }
  });
}
