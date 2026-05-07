// MiraXAstro Firebase Configuration
// Generated: May 2026
// Project: miraxastro

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  databaseURL: "https://miraxastro-default-rtdb.asia-southeast1.firebasedatabase.app",
  apiKey: "AIzaSyDiyfAm1yLZJ3GZxOe5ISG8ZJ4sMEtGRqA",
  authDomain: "miraxastro.firebaseapp.com",
  projectId: "miraxastro",
  storageBucket: "miraxastro.firebasestorage.app",
  messagingSenderId: "1049579955690",
  appId: "1:1049579955690:web:987a78d34cd3ff07a7fe93",
  measurementId: "G-XY6C995DVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

export default app;
