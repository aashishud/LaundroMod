// =============================================================================
// FILE: src/renderer/src/firebase.js (Firebase Configuration)
//
// This file now ONLY configures the client-side Firebase services.
// =============================================================================
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'FIREBASE API KEY HERE',
  authDomain: 'your.firebaseapp.com',
  projectId: 'PROJECT NAME HERE',
  storageBucket: 'your.appspot.com',
  messagingSenderId: 'messaging ID here',
  appId: 'APP ID HERE',
  measurementId: 'MEASUREMENT ID HERE',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the necessary Firebase services for the frontend
export const auth = getAuth(app);

