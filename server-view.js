import { auth, db } from './firebase-config.js';
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const urlParams = new URLSearchParams(location.search);
const serverId = urlParams.get('id');

const serverName = document.getElementById('server-name');
const messagesEl = document.getElementById('messages');
const msgInput = document.getElementById('msg-input');
const sendBtn = document.getElementById('send-msg');

const serverDoc = doc(db, 'servers', serverId);
const msgRef = collection(serverDoc, 'messages');

getDoc(serverDoc).then(snap => {
  serverName.textContent = snap.data().name;
});

sendBtn.onclick = async () => {
  const msg = msgInput.value.trim();
  if (!msg) return;
  await addDoc(msgRef, {
    text: msg,
    user: auth.currentUser.email,
    timestamp: serverTimestamp()
  });
  msgInput.value = '';
};

onSnapshot(msgRef, snap => {
  messagesEl.innerHTML = '';
  snap.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement('div');
    div.innerHTML = `<strong>${data.user}</strong>: ${data.text}`;
    messagesEl.appendChild(div);
  });
});
