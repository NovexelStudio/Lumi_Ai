'use client';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Replace these with your Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '',
};

// Log which env vars are available
if (typeof window !== 'undefined') {
  console.log('Firebase Config Status:', {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    hasAppId: !!firebaseConfig.appId,
  });
}

let app: any;
let auth: any;
let db: any;
let realtimeDb: any;
let initError: Error | null = null;

try {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API key not found. Check NEXT_PUBLIC_FIREBASE_API_KEY environment variable.');
  }
  
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  realtimeDb = getDatabase(app);
  
  if (typeof window !== 'undefined') {
    console.log('Firebase initialized successfully');
  }
} catch (error) {
  initError = error as Error;
  console.error('Firebase initialization error:', error);
  if (typeof window !== 'undefined') {
    console.error('Firebase config:', {
      apiKey: firebaseConfig.apiKey?.substring(0, 10) + '...',
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
    });
  }
}

export { auth, db, realtimeDb, initError };
export default app;
