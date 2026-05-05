// AstroSeva — Auth Service  (src/services/auth.service.js)
// Handles all Firebase Authentication operations

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, appleProvider } from "./firebase.config";

// ── Register with email ───────────────────────────────────────────
export async function registerWithEmail(email, password, fullName) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: fullName });
  await createUserDoc(cred.user, { fullName, email, method: "email" });
  return cred.user;
}

// ── Login with email ──────────────────────────────────────────────
export async function loginWithEmail(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// ── Google Sign-in ────────────────────────────────────────────────
export async function loginWithGoogle() {
  const cred = await signInWithPopup(auth, googleProvider);
  await createUserDoc(cred.user, {
    fullName: cred.user.displayName,
    email: cred.user.email,
    photoURL: cred.user.photoURL,
    method: "google",
  });
  return cred.user;
}

// ── Apple Sign-in ─────────────────────────────────────────────────
export async function loginWithApple() {
  const cred = await signInWithPopup(auth, appleProvider);
  await createUserDoc(cred.user, {
    fullName: cred.user.displayName || "Apple User",
    email: cred.user.email,
    method: "apple",
  });
  return cred.user;
}

// ── Phone OTP ─────────────────────────────────────────────────────
export function setupRecaptcha(elementId) {
  window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
    size: "invisible",
    callback: () => {},
  });
  return window.recaptchaVerifier;
}
export async function sendOTP(phoneNumber) {
  const confirmationResult = await signInWithPhoneNumber(
    auth, phoneNumber, window.recaptchaVerifier
  );
  window.confirmationResult = confirmationResult;
  return confirmationResult;
}
export async function verifyOTP(otp) {
  const result = await window.confirmationResult.confirm(otp);
  await createUserDoc(result.user, { method: "phone" });
  return result.user;
}

// ── Password reset ────────────────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// ── Sign out ──────────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
}

// ── Auth state listener ───────────────────────────────────────────
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Create/update user doc in Firestore ──────────────────────────
async function createUserDoc(user, extra = {}) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      fullName: extra.fullName || user.displayName || "",
      email: extra.email || user.email || "",
      phone: user.phoneNumber || "",
      photoURL: extra.photoURL || user.photoURL || "",
      role: "customer",           // "customer" | "astrologer" | "admin"
      coins: 50,                  // welcome coins
      totalSpent: 0,
      totalSessions: 0,
      authMethod: extra.method || "email",
      currency: "IN",             // auto-detected on first open
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      fcmToken: null,
      notifications: true,
    });
  } else {
    // update last seen
    await setDoc(ref, { lastSeen: serverTimestamp() }, { merge: true });
  }
}

// ── Get user profile ──────────────────────────────────────────────
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
