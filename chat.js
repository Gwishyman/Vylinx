import { auth, db } from './firebase-config.js';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

const chatBox = document.getElementById('chat-box');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const messagesRef = collection(db, 'messages');
const q = query(messagesRef, orderBy('timestamp'));

messageForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  await addDoc(messagesRef, {
    text,
    user: auth.currentUser.email,
    timestamp: serverTimestamp()
  });
  messageInput.value = '';
});

onSnapshot(q, (snapshot) => {
  chatBox.innerHTML = '';
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `
      <strong>${data.user}:</strong> ${data.text}
      <button data-id="${docSnap.id}" class="delete-btn">🗑️</button>
    `;
    chatBox.appendChild(msgDiv);
  });

  // Attach delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-id');
      await deleteDoc(doc(db, 'messages', id));
    };
  });
});
