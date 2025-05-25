// auth.js
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
  query,
  collection,
  where,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHY0RBY3jK7ZnuM2anIbKzFDd65xwMiyg",
  authDomain: "vylinx-11e87.firebaseapp.com",
  projectId: "vylinx-11e87",
  storageBucket: "vylinx-11e87.firebasestorage.app",
  messagingSenderId: "710300713760",
  appId: "1:710300713760:web:c4ee8f53be614f5869cd45"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const loginBtn = document.getElementById("login");
const signupBtn = document.getElementById("signup");

// LOGIN
if (loginBtn) {
  loginBtn.onclick = async () => {
    const emailOrUsername = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    let email = emailOrUsername;

    if (!emailOrUsername.includes("@")) {
      const q = query(collection(db, "users"), where("username", "==", emailOrUsername));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return alert("Username not found");
      email = snapshot.docs[0].data().email;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      location.href = "servers.html";
    } catch (e) {
      alert("Login failed: " + e.message);
    }
  };
}

// SIGNUP
if (signupBtn) {
  signupBtn.onclick = async () => {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const q1 = query(collection(db, "users"), where("username", "==", username));
    const q2 = query(collection(db, "users"), where("email", "==", email));
    const res1 = await getDocs(q1);
    const res2 = await getDocs(q2);

    if (!username || !email || !password) return alert("Fill all fields");
    if (!email.includes("@")) return alert("Invalid email");
    if (!password || password.length < 6) return alert("Password too short");
    if (!res1.empty) return alert("Username already in use");
    if (!res2.empty) return alert("Email already in use");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), { username, email });
      location.href = "servers.html";
    } catch (e) {
      alert("Signup failed: " + e.message);
    }
  };
}

// DELETE ACCOUNT
export async function deleteCurrentUser() {
  const user = auth.currentUser;
  if (!user) return;
  await deleteDoc(doc(db, "users", user.uid));
  await deleteUser(user);
  alert("Account deleted");
  location.href = "index.html";
}
