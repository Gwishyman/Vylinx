import { db, auth } from './firebase-config.js';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messagesContainer = document.getElementById("messages");
const clearBtn = document.getElementById("clear-chat");

// Send Message
messageForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  const user = auth.currentUser;
  if (!text || !user) return;
  await addDoc(collection(db, "messages"), {
    text,
    uid: user.uid,
    email: user.email,
    timestamp: new Date()
  });
  messageInput.value = "";
});

// Load Messages
onAuthStateChanged(auth, (user) => {
  if (user) {
    const q = query(collection(db, "messages"), orderBy("timestamp"));
    onSnapshot(q, (snapshot) => {
      messagesContainer.innerHTML = "";
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const msgEl = document.createElement("div");
        msgEl.textContent = `${data.email}: ${data.text}`;

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.onclick = async () => {
          if (confirm("Delete this message?")) {
            await deleteDoc(doc(db, "messages", docSnap.id));
          }
        };
        msgEl.appendChild(delBtn);
        messagesContainer.appendChild(msgEl);
      });
    });
  }
});

// Clear Chat (only for current user’s messages)
clearBtn?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;
  const q = query(collection(db, "messages"), orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    snapshot.forEach(async (docSnap) => {
      if (docSnap.data().uid === user.uid) {
        await deleteDoc(doc(db, "messages", docSnap.id));
      }
    });
  });
});
