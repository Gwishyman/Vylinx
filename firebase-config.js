import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHY0RBY3jK7ZnuM2anIbKzFDd65xwMiyg",
  authDomain: "vylinx-11e87.firebaseapp.com",
  projectId: "vylinx-11e87",
  storageBucket: "vylinx-11e87.appspot.com",
  messagingSenderId: "710300713760",
  appId: "1:710300713760:web:c4ee8f53be614f5869cd45"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
