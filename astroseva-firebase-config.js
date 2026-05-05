// AstroSeva Firebase Config — src/firebase/config.js
// Setup: console.firebase.google.com → New Project → "AstroSeva"
// Enable: Auth, Firestore, Realtime DB, Storage, FCM, Analytics

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// REPLACE with your Firebase project credentials
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "astroseva.firebaseapp.com",
  databaseURL:       "https://astroseva-default-rtdb.firebaseio.com",
  projectId:         "astroseva",
  storageBucket:     "astroseva.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
  measurementId:     "YOUR_MEASUREMENT_ID",
};

const app = initializeApp(firebaseConfig);
export const auth      = getAuth(app);
export const db        = getFirestore(app);
export const rtdb      = getDatabase(app);
export const storage   = getStorage(app);
export const messaging = getMessaging(app);
export const analytics = getAnalytics(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider  = new OAuthProvider("apple.com");
export default app;
