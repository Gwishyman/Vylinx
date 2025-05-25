import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc
} from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

const serversList = document.getElementById('servers');
const createServerBtn = document.getElementById('create-server-btn');

createServerBtn?.addEventListener('click', async () => {
  const serverName = prompt("Enter server name:");
  if (serverName) {
    await addDoc(collection(db, 'servers'), {
      name: serverName
    });
  }
});

const serversRef = collection(db, 'servers');
onSnapshot(serversRef, (snapshot) => {
  serversList.innerHTML = '';
  snapshot.forEach((docSnap) => {
    const li = document.createElement('li');
    li.textContent = docSnap.data().name;
    li.onclick = () => {
      // Load the selected server's messages
      loadServerMessages(docSnap.id);
    };
    serversList.appendChild(li);
  });
});
