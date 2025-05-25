import { auth, db } from './firebase-config.js';
import {
  collection,
  addDoc,
  onSnapshot,
  doc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const serversRef = collection(db, 'servers');
const list = document.getElementById('servers');
const createBtn = document.getElementById('create-server-btn');

createBtn?.addEventListener('click', async () => {
  const name = prompt("Server name:");
  if (!name) return;
  await addDoc(serversRef, {
    name,
    createdBy: auth.currentUser.uid
  });
});

onSnapshot(serversRef, snapshot => {
  list.innerHTML = '';
  snapshot.forEach(docSnap => {
    const li = document.createElement('li');
    li.textContent = docSnap.data().name;
    li.onclick = () => {
      location.href = `server.html?id=${docSnap.id}`;
    };
    list.appendChild(li);
  });
});
