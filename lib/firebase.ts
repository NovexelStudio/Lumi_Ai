import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD2EMDFXrmz-iJvEHH2pM3Jf8oLZluEWDo",
  authDomain: "lumi-ai-afe63.firebaseapp.com",
  databaseURL: "https://lumi-ai-afe63-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lumi-ai-afe63",
  storageBucket: "lumi-ai-afe63.firebasestorage.app",
  messagingSenderId: "257238628936",
  appId: "1:257238628936:web:e868c49db1e040e8f1b67d",
  measurementId: "G-6Q1Q14TWB8"
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let realtimeDb: Database | undefined;

// Only initialize if we have an API key (prevents build-time crashes)
if (firebaseConfig.apiKey) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    realtimeDb = getDatabase(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

export { auth, db, realtimeDb };
export default app;