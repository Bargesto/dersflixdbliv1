import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqtUS5QbtyxGbFEOBf0ROgIzNVugsSuPI",
  authDomain: "dersflix-9864e.firebaseapp.com",
  projectId: "dersflix-9864e",
  storageBucket: "dersflix-9864e.firebasestorage.app",
  messagingSenderId: "496507044912",
  appId: "1:496507044912:web:421bdeee77c94b05c5d9f5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);