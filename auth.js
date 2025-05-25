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

  if (!username || !email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    // Check if username is taken
    const usernameQuery = query(collection(db, 'usernames'), where("username", "==", username));
    const usernamesSnap = await getDocs(usernameQuery);
    if (!usernamesSnap.empty) {
      alert("Username taken");
      return;
    }

    // Check if email is taken
    const emailQuery = query(collection(db, 'usernames'), where("email", "==", email));
    const emailsSnap = await getDocs(emailQuery);
    if (!emailsSnap.empty) {
      alert("Email taken");
      return;
    }

    // Create user
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    // Save username + email linked to uid in Firestore
    await addDoc(collection(db, 'usernames'), {
      uid: userCred.user.uid,
      email,
      username
    });

    alert("Signup successful! Redirecting...");
    location.href = 'servers.html';

  } catch (err) {
    alert("Signup error: " + err.message);
  }
});

// LOGIN
document.getElementById('login')?.addEventListener('click', async () => {
  const identifier = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!identifier || !password) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    let email = identifier;

    // If username was entered instead of email, lookup email by username
    if (!identifier.includes('@')) {
      const usernameQuery = query(collection(db, 'usernames'), where("username", "==", identifier));
      const usernameSnap = await getDocs(usernameQuery);
      if (usernameSnap.empty) {
        alert("Invalid username");
        return;
      }
      email = usernameSnap.docs[0].data().email;
    }

    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful! Redirecting...");
    location.href = 'servers.html';

  } catch (err) {
    alert("Login error: " + err.message);
  }
});

// DELETE ACCOUNT (optional, add a button with id 'delete-account' on your servers.html)
document.getElementById('delete-account')?.addEventListener('click', async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      alert("No user logged in");
      return;
    }

    const usernameQuery = query(collection(db, 'usernames'), where("uid", "==", user.uid));
    const usernameSnap = await getDocs(usernameQuery);

    for (const docSnap of usernameSnap.docs) {
      await deleteDoc(doc(db, 'usernames', docSnap.id));
    }

    await deleteUser(user);
    alert("Account deleted");
    location.href = 'login.html';

  } catch (err) {
    alert("Delete account error: " + err.message);
  }
});
