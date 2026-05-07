// MiraXAstro Firebase Integration
// Connects all app features to Firebase
// Version: 1.0 | May 2026

// ─────────────────────────────────────────
// STEP 1: Add this to your index.html <head>
// ─────────────────────────────────────────
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js"></script>

// ─────────────────────────────────────────
// FIREBASE CONFIG — YOUR REAL KEYS
// ─────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDiyfAm1yLZJ3GZxOe5ISG8ZJ4sMEtGRqA",
  authDomain: "miraxastro.firebaseapp.com",
  databaseURL: "https://miraxastro-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "miraxastro",
  storageBucket: "miraxastro.firebasestorage.app",
  messagingSenderId: "1049579955690",
  appId: "1:1049579955690:web:987a78d34cd3ff07a7fe93",
  measurementId: "G-XY6C995DVW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const rtdb = firebase.database();

// ─────────────────────────────────────────
// AUTH FUNCTIONS
// ─────────────────────────────────────────

// Register with email/password
async function registerUser(email, password, name, phone) {
  const cred = await auth.createUserWithEmailAndPassword(email, password);
  await cred.user.updateProfile({ displayName: name });
  await db.collection("users").doc(cred.user.uid).set({
    name, email, phone,
    coins: 50,
    status: "active",
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return cred.user;
}

// Login with email/password
async function loginUser(email, password) {
  const cred = await auth.signInWithEmailAndPassword(email, password);
  const doc = await db.collection("users").doc(cred.user.uid).get();
  if (doc.exists && doc.data().status === "blocked") {
    await auth.signOut();
    throw new Error("blocked");
  }
  return { ...cred.user, ...doc.data() };
}

// Google Sign In
async function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const cred = await auth.signInWithPopup(provider);
  const userRef = db.collection("users").doc(cred.user.uid);
  const doc = await userRef.get();
  if (!doc.exists) {
    await userRef.set({
      name: cred.user.displayName,
      email: cred.user.email,
      coins: 50,
      status: "active",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  return cred.user;
}

// Logout
async function logoutUser() {
  await auth.signOut();
}

// Auth state observer
function onAuthChange(callback) {
  return auth.onAuthStateChanged(callback);
}

// ─────────────────────────────────────────
// USER FUNCTIONS
// ─────────────────────────────────────────

// Get user data
async function getUser(uid) {
  const doc = await db.collection("users").doc(uid).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

// Update user coins
async function updateCoins(uid, coins) {
  await db.collection("users").doc(uid).update({ coins });
}

// Deduct coins after session
async function deductSessionCoins(uid, coinsUsed, astrologerName) {
  const userRef = db.collection("users").doc(uid);
  await db.runTransaction(async (t) => {
    const doc = await t.get(userRef);
    const current = doc.data().coins || 0;
    const newCoins = Math.max(0, current - coinsUsed);
    t.update(userRef, { coins: newCoins });
  });
  // Record transaction
  await db.collection("transactions").add({
    userId: uid,
    type: "debit",
    coins: coinsUsed,
    title: "Session with " + astrologerName,
    date: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// ─────────────────────────────────────────
// ASTROLOGER FUNCTIONS
// ─────────────────────────────────────────

// Get all astrologers
async function getAstrologers() {
  const snap = await db.collection("astrologers").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Update astrologer online status (realtime)
function setAstrologerStatus(uid, status) {
  rtdb.ref("presence/" + uid).set({
    status, // "online" | "offline" | "busy"
    lastSeen: Date.now()
  });
}

// Listen to astrologer status
function listenAstrologerStatus(uid, callback) {
  return rtdb.ref("presence/" + uid).on("value", snap => {
    callback(snap.val()?.status || "offline");
  });
}

// ─────────────────────────────────────────
// SESSION FUNCTIONS
// ─────────────────────────────────────────

// Start a session
async function startSession(customerId, astrologerId, astrologerName, ppm) {
  const session = await db.collection("sessions").add({
    customerId, astrologerId, astrologerName, ppm,
    status: "active",
    startTime: firebase.firestore.FieldValue.serverTimestamp()
  });
  // Mark astrologer as busy
  setAstrologerStatus(astrologerId, "busy");
  return session.id;
}

// End a session
async function endSession(sessionId, customerId, astrologerId, coinsUsed, astrologerName) {
  await db.collection("sessions").doc(sessionId).update({
    status: "completed",
    endTime: firebase.firestore.FieldValue.serverTimestamp(),
    coinsUsed
  });
  // Deduct coins from customer
  await deductSessionCoins(customerId, coinsUsed, astrologerName);
  // Mark astrologer back online
  setAstrologerStatus(astrologerId, "online");
}

// ─────────────────────────────────────────
// CHAT FUNCTIONS (Realtime)
// ─────────────────────────────────────────

// Send a chat message
async function sendChatMessage(sessionId, senderId, text, type = "text") {
  await rtdb.ref("chats/" + sessionId).push({
    senderId, text, type,
    timestamp: Date.now()
  });
}

// Listen to chat messages
function listenToChat(sessionId, callback) {
  const ref = rtdb.ref("chats/" + sessionId);
  ref.on("child_added", snap => {
    callback({ id: snap.key, ...snap.val() });
  });
  return () => ref.off();
}

// ─────────────────────────────────────────
// REPORT FUNCTIONS
// ─────────────────────────────────────────

// Submit a report
async function submitReport(reportedBy, reportedUser, reason) {
  await db.collection("reports").add({
    reportedBy, reportedUser, reason,
    status: "pending",
    date: firebase.firestore.FieldValue.serverTimestamp()
  });
}

// ─────────────────────────────────────────
// REVIEW FUNCTIONS
// ─────────────────────────────────────────

// Submit a review
async function submitReview(sessionId, customerId, astrologerId, rating, comment) {
  await db.collection("reviews").add({
    sessionId, customerId, astrologerId,
    rating, comment,
    date: firebase.firestore.FieldValue.serverTimestamp()
  });
  // Update astrologer average rating
  const reviews = await db.collection("reviews")
    .where("astrologerId", "==", astrologerId).get();
  const avg = reviews.docs.reduce((s, d) => s + d.data().rating, 0) / reviews.size;
  await db.collection("astrologers").doc(astrologerId).update({ rating: avg.toFixed(1) });
}

export {
  auth, db, rtdb,
  registerUser, loginUser, loginWithGoogle, logoutUser, onAuthChange,
  getUser, updateCoins, deductSessionCoins,
  getAstrologers, setAstrologerStatus, listenAstrologerStatus,
  startSession, endSession,
  sendChatMessage, listenToChat,
  submitReport, submitReview
};
