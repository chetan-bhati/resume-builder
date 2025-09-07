
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "apiKey": "AIzaSyDoFdMwOUQFt-_Y3e4324TXXm-N47yKtzY",
  "authDomain": "resumeforge-vzsvr.firebaseapp.com",
  "projectId": "resumeforge-vzsvr",
  "storageBucket": "resumeforge-vzsvr.firebasestorage.app",
  "messagingSenderId": "775778251373",
  "appId": "1:775778251373:web:562284976d095e625b4564"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
