// DO NOT EDIT, this file is auto-generated
import {initializeApp, getApp, getApps} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  "apiKey": "your-api-key",
  "authDomain": "your-auth-domain",
  "projectId": "your-project-id",
  "storageBucket": "your-storage-bucket",
  "messagingSenderId": "your-messaging-sender-id",
  "appId": "your-app-id"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export {app, db};
