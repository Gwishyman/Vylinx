import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

// SIGN UP
document.getElementById('signup')?.addEventListener('click', async () => {
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Check uniqueness
  const usernames = await getDocs(query(collection(db, 'usernames'), where("username", "==", username)));
  if (!usernames.empty) return alert("Username taken");

  const emails = await getDocs(query(collection(db, 'usernames'), where("email", "==", email)));
  if (!emails.empty) return alert("Email taken");

  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await addDoc(collection(db, 'usernames'), {
    uid: userCred.user.uid,
    email,
    username
  });

  location.href = 'servers.html';
});

// LOGIN
document.getElementById('login')?.addEventListener('click', async () => {
  const identifier = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  let email = identifier;

  // If username was used, convert to email
  if (!identifier.includes('@')) {
    const usernameSnap = await getDocs(query(collection(db, 'usernames'), where("username", "==", identifier)));
    if (usernameSnap.empty) return alert("Invalid username");
    email = usernameSnap.docs[0].data().email;
  }

  await signInWithEmailAndPassword(auth, email, password);
  location.href = 'servers.html';
});

// DELETE ACCOUNT
document.getElementById('delete-account')?.addEventListener('click', async () => {
  const user = auth.currentUser;
  const usernameSnap = await getDocs(query(collection(db, 'usernames'), where("uid", "==", user.uid)));

  for (const docSnap of usernameSnap.docs) {
    await deleteDoc(doc(db, 'usernames', docSnap.id));
  }

  await deleteUser(user);
  alert("Account deleted");
  location.href = 'login.html';
});
