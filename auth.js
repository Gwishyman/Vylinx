import { auth } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js';

const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const logoutBtn = document.getElementById('logout-btn');
const chatSection = document.getElementById('chat-section');

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert(err.message);
  }
});

signupForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    alert(err.message);
  }
});

logoutBtn?.addEventListener('click', async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginForm?.classList.add('hidden');
    signupForm?.classList.add('hidden');
    chatSection?.classList.remove('hidden');
  } else {
    loginForm?.classList.remove('hidden');
    signupForm?.classList.remove('hidden');
    chatSection?.classList.add('hidden');
  }
});
