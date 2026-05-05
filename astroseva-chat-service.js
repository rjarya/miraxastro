// AstroSeva — Real-time Chat Service  (src/services/chat.service.js)
// Firebase Realtime Database for instant messaging

import {
  ref, push, onValue, off, set, serverTimestamp,
  onDisconnect, update, get,
} from "firebase/database";
import {
  doc, setDoc, updateDoc, getDoc,
  collection, addDoc, serverTimestamp as fsTimestamp,
} from "firebase/firestore";
import { rtdb, db } from "./firebase.config";

// ── Start a session ───────────────────────────────────────────────
export async function startSession({ customerId, astrologerId, ratePerMin }) {
  const sessionId = `${customerId}_${astrologerId}_${Date.now()}`;
  const sessionRef = doc(db, "sessions", sessionId);

  await setDoc(sessionRef, {
    sessionId,
    customerId,
    astrologerId,
    ratePerMin,
    status: "active",
    startedAt: fsTimestamp(),
    endedAt: null,
    duration: 0,
    coinsUsed: 0,
    rated: false,
    rating: null,
  });

  // Set online status in RTDB
  const presenceRef = ref(rtdb, `sessions/${sessionId}/status`);
  await set(presenceRef, {
    active: true,
    startedAt: serverTimestamp(),
    customerId,
    astrologerId,
  });

  return sessionId;
}

// ── Send a message ────────────────────────────────────────────────
export async function sendMessage({ sessionId, senderId, text, type = "text" }) {
  const msgRef = ref(rtdb, `chats/${sessionId}/messages`);
  await push(msgRef, {
    senderId,
    text,
    type,                 // "text" | "image" | "voice"
    timestamp: serverTimestamp(),
    read: false,
  });

  // Update last message (for chat list preview)
  const metaRef = ref(rtdb, `chats/${sessionId}/meta`);
  await update(metaRef, {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
    lastSenderId: senderId,
  });
}

// ── Listen to messages ────────────────────────────────────────────
export function listenToMessages(sessionId, callback) {
  const msgRef = ref(rtdb, `chats/${sessionId}/messages`);
  onValue(msgRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) return callback([]);
    const messages = Object.entries(data).map(([id, msg]) => ({ id, ...msg }));
    messages.sort((a, b) => a.timestamp - b.timestamp);
    callback(messages);
  });
  // Return unsubscribe function
  return () => off(msgRef);
}

// ── Typing indicator ──────────────────────────────────────────────
export async function setTyping(sessionId, userId, isTyping) {
  const typingRef = ref(rtdb, `chats/${sessionId}/typing/${userId}`);
  await set(typingRef, isTyping ? true : null);
}

export function listenToTyping(sessionId, otherUserId, callback) {
  const typingRef = ref(rtdb, `chats/${sessionId}/typing/${otherUserId}`);
  onValue(typingRef, (snap) => callback(!!snap.val()));
  return () => off(typingRef);
}

// ── Online presence ───────────────────────────────────────────────
export async function setOnlineStatus(userId, isOnline) {
  const presRef = ref(rtdb, `presence/${userId}`);
  if (isOnline) {
    await set(presRef, { online: true, lastSeen: serverTimestamp() });
    // Auto set offline on disconnect
    onDisconnect(presRef).set({ online: false, lastSeen: serverTimestamp() });
  } else {
    await set(presRef, { online: false, lastSeen: serverTimestamp() });
  }
}

export function listenToPresence(userId, callback) {
  const presRef = ref(rtdb, `presence/${userId}`);
  onValue(presRef, (snap) => callback(snap.val()?.online || false));
  return () => off(presRef);
}

// ── End session ───────────────────────────────────────────────────
export async function endSession({ sessionId, customerId, astrologerId, duration, coinsUsed }) {
  // Update Firestore session
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, {
    status: "completed",
    endedAt: fsTimestamp(),
    duration,
    coinsUsed,
  });

  // Update astrologer earnings in Firestore
  const astroRef = doc(db, "astrologers", astrologerId);
  const earning = Math.floor(coinsUsed * 0.7); // 70% to astrologer
  await updateDoc(astroRef, {
    totalEarnings: { increment: earning },
    pendingEarnings: { increment: earning },
    totalSessions: { increment: 1 },
    totalMinutes: { increment: Math.floor(duration / 60) },
  });

  // Clean up RTDB
  const statusRef = ref(rtdb, `sessions/${sessionId}/status`);
  await set(statusRef, { active: false, endedAt: serverTimestamp() });
}

// ── Submit rating ─────────────────────────────────────────────────
export async function submitRating({ sessionId, astrologerId, rating, review, tags }) {
  const sessionRef = doc(db, "sessions", sessionId);
  await updateDoc(sessionRef, { rated: true, rating, review, tags });

  // Add to astrologer reviews subcollection
  await addDoc(collection(db, "astrologers", astrologerId, "reviews"), {
    sessionId,
    rating,
    review,
    tags,
    createdAt: fsTimestamp(),
  });

  // Recompute astrologer average rating
  const astroRef = doc(db, "astrologers", astrologerId);
  const snap = await getDoc(astroRef);
  const data = snap.data() || {};
  const count = (data.reviewCount || 0) + 1;
  const avg = ((data.rating || 0) * (count - 1) + rating) / count;
  await updateDoc(astroRef, {
    rating: Math.round(avg * 10) / 10,
    reviewCount: count,
  });
}
