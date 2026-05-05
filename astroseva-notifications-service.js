// AstroSeva — Push Notifications Service  (src/services/notifications.service.js)
// Firebase Cloud Messaging (FCM) for all push notifications

import { getToken, onMessage } from "firebase/messaging";
import { doc, updateDoc } from "firebase/firestore";
import { messaging, db } from "./firebase.config";

// VAPID key from Firebase Console → Project Settings → Cloud Messaging
const VAPID_KEY = "YOUR_VAPID_KEY_FROM_FIREBASE_CONSOLE";

// ── Request permission + get FCM token ───────────────────────────
export async function initNotifications(userId) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (token && userId) {
      // Save token to user's Firestore doc
      await updateDoc(doc(db, "users", userId), { fcmToken: token });
    }
    return token;
  } catch (err) {
    console.warn("FCM init failed:", err);
    return null;
  }
}

// ── Listen for foreground messages ───────────────────────────────
export function onForegroundMessage(callback) {
  return onMessage(messaging, (payload) => {
    const { title, body, image } = payload.notification || {};
    callback({ title, body, image, data: payload.data });
  });
}

// ── Send notification via backend (Firebase Function / Node.js) ──
// These are called from your server, not the frontend
// Include in your Firebase Functions (functions/index.js):

export const SERVER_NOTIFICATION_TEMPLATES = {
  // New booking
  newBooking: (customerName, astrologerName) => ({
    title: "New Consultation Request 🔮",
    body: `${customerName} wants to chat with you. Tap to accept.`,
    data: { type: "new_booking" },
  }),

  // Session starting
  sessionStart: (astrologerName) => ({
    title: "Session Started ⏱",
    body: `Your session with ${astrologerName} has begun.`,
    data: { type: "session_start" },
  }),

  // Low balance warning
  lowBalance: (coins) => ({
    title: "Low Balance ⚠️",
    body: `Only ${coins} coins left. Recharge to continue your session.`,
    data: { type: "low_balance" },
  }),

  // Session reminder
  sessionReminder: (astrologerName, time) => ({
    title: "Upcoming Session 📅",
    body: `Your session with ${astrologerName} starts in ${time} minutes.`,
    data: { type: "reminder" },
  }),

  // Payment success
  paymentSuccess: (coins, amount) => ({
    title: "Recharge Successful 🪙",
    body: `${coins} coins added to your wallet. Amount: ${amount}`,
    data: { type: "payment_success" },
  }),

  // Astrologer approved
  astrologerApproved: (name) => ({
    title: "Profile Approved! 🎉",
    body: `Congratulations ${name}! Your profile is now live on AstroSeva.`,
    data: { type: "approved" },
  }),

  // Astrologer rejected
  astrologerRejected: () => ({
    title: "Profile Needs Updates",
    body: "Your profile needs a few changes. Tap to see feedback.",
    data: { type: "rejected" },
  }),

  // New review received
  newReview: (stars) => ({
    title: `New ${stars}⭐ Review Received`,
    body: "A customer left you a review. Tap to read it.",
    data: { type: "new_review" },
  }),

  // Withdrawal processed
  withdrawalProcessed: (amount) => ({
    title: "Withdrawal Processed 💰",
    body: `₹${amount} has been transferred to your bank account.`,
    data: { type: "withdrawal" },
  }),
};
