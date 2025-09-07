
// DO NOT EDIT, this file is auto-generated
import {initializeApp, getApp, getApps} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  "apiKey": "AIzaSyDoFdMwOUQFt-_Y3e4324TXXm-N47yKtzY",
  "authDomain": "resumeforge-vzsvr.firebaseapp.com",
  "projectId": "resumeforge-vzsvr",
  "storageBucket": "resumeforge-vzsvr.firebasestorage.app",
  "messagingSenderId": "775778251373",
  "appId": "1:775778251373:web:562284976d095e625b4564"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export {app, db};
