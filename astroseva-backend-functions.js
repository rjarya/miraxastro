// AstroSeva — Firebase Cloud Functions  (functions/index.js)
// Deploy: firebase deploy --only functions
// Install: npm install firebase-functions firebase-admin razorpay stripe

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const Stripe = require("stripe");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

// ── Config (set via: firebase functions:config:set) ──────────────
// firebase functions:config:set razorpay.key_id="rzp_live_xxx" razorpay.key_secret="xxx"
// firebase functions:config:set stripe.secret_key="sk_live_xxx"
const rzp = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret,
});
const stripe = new Stripe(functions.config().stripe.secret_key);

// ══════════════════════════════════════════════════════════════
// RAZORPAY FUNCTIONS
// ══════════════════════════════════════════════════════════════

// Create Razorpay Order
exports.createRazorpayOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login required");
  const { amount, currency, planId } = data;
  const order = await rzp.orders.create({
    amount: Math.round(amount * 100), // paise
    currency: currency || "INR",
    receipt: `receipt_${Date.now()}`,
    notes: { planId, userId: context.auth.uid },
  });
  return { orderId: order.id };
});

// Verify Razorpay Payment + Credit Coins
exports.verifyRazorpayPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login required");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, coinsToAdd, planId, planName, amount } = data;

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", functions.config().razorpay.key_secret)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    throw new functions.https.HttpsError("invalid-argument", "Payment verification failed");
  }

  // Credit coins in a transaction
  await db.runTransaction(async (txn) => {
    const userRef = db.collection("users").doc(context.auth.uid);
    const userSnap = await txn.get(userRef);
    if (!userSnap.exists) throw new Error("User not found");

    txn.update(userRef, {
      coins: admin.firestore.FieldValue.increment(coinsToAdd),
      totalRecharges: admin.firestore.FieldValue.increment(1),
      lastRecharge: admin.firestore.FieldValue.serverTimestamp(),
    });

    txn.set(db.collection("users").doc(context.auth.uid).collection("transactions").doc(), {
      type: "credit",
      coins: coinsToAdd,
      amount,
      currency: "INR",
      planId,
      planName,
      gateway: "razorpay",
      txnId: razorpay_payment_id,
      status: "success",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    txn.set(db.collection("revenue").doc(), {
      userId: context.auth.uid,
      amount,
      currency: "INR",
      planId,
      gateway: "razorpay",
      txnId: razorpay_payment_id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  // Send success notification
  await sendNotificationToUser(context.auth.uid, {
    title: "Recharge Successful 🪙",
    body: `${coinsToAdd} coins added to your wallet!`,
  });

  return { success: true };
});

// ══════════════════════════════════════════════════════════════
// STRIPE FUNCTIONS
// ══════════════════════════════════════════════════════════════

// Create Stripe Payment Intent
exports.createStripeIntent = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login required");
  const { amountUSD, currency } = data;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amountUSD * 100),  // cents
    currency: currency || "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { userId: context.auth.uid, planId: data.planId },
  });

  return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
});

// Stripe Webhook (handles successful payments server-side)
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = functions.config().stripe.webhook_secret;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    return res.status(400).send("Webhook Error: " + err.message);
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    const { userId, planId } = pi.metadata;
    // Look up plan and credit coins
    const plans = { trial:30, basic:110, value:370, power:650, elite:1500, vip:4000 };
    const coins = plans[planId] || 0;
    if (userId && coins) {
      await db.collection("users").doc(userId).update({
        coins: admin.firestore.FieldValue.increment(coins),
        lastRecharge: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }
  res.json({ received: true });
});

// ══════════════════════════════════════════════════════════════
// ADMIN FUNCTIONS
// ══════════════════════════════════════════════════════════════

// Approve astrologer
exports.approveAstrologer = functions.https.onCall(async (data, context) => {
  await verifyAdmin(context);
  const { astrologerId } = data;
  await db.collection("astrologers").doc(astrologerId).update({
    status: "approved",
    approvedAt: admin.firestore.FieldValue.serverTimestamp(),
    approvedBy: context.auth.uid,
  });
  await db.collection("users").doc(astrologerId).update({ role: "astrologer" });
  await sendNotificationToUser(astrologerId, {
    title: "Profile Approved! 🎉",
    body: "Congratulations! Your profile is now live on AstroSeva.",
  });
  return { success: true };
});

// Reject astrologer
exports.rejectAstrologer = functions.https.onCall(async (data, context) => {
  await verifyAdmin(context);
  const { astrologerId, reason } = data;
  await db.collection("astrologers").doc(astrologerId).update({
    status: "rejected",
    rejectionReason: reason,
    rejectedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  await sendNotificationToUser(astrologerId, {
    title: "Profile Needs Updates",
    body: reason || "Please review and resubmit your profile.",
  });
  return { success: true };
});

// Process withdrawal
exports.processWithdrawal = functions.https.onCall(async (data, context) => {
  await verifyAdmin(context);
  const { withdrawalId, astrologerId, amount } = data;
  await db.collection("withdrawals").doc(withdrawalId).update({
    status: "processed",
    processedAt: admin.firestore.FieldValue.serverTimestamp(),
    processedBy: context.auth.uid,
  });
  await db.collection("astrologers").doc(astrologerId).update({
    pendingEarnings: admin.firestore.FieldValue.increment(-amount),
    totalWithdrawn: admin.firestore.FieldValue.increment(amount),
  });
  await sendNotificationToUser(astrologerId, {
    title: "Withdrawal Processed 💰",
    body: `₹${amount} has been transferred to your bank account.`,
  });
  return { success: true };
});

// ── Helpers ───────────────────────────────────────────────────────
async function verifyAdmin(context) {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Login required");
  const userDoc = await db.collection("users").doc(context.auth.uid).get();
  if (userDoc.data()?.role !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "Admin only");
  }
}

async function sendNotificationToUser(userId, notification) {
  const userDoc = await db.collection("users").doc(userId).get();
  const fcmToken = userDoc.data()?.fcmToken;
  if (!fcmToken) return;
  await admin.messaging().send({
    token: fcmToken,
    notification,
    android: { priority: "high" },
    apns: { payload: { aps: { sound: "default" } } },
  });
}

// ── Scheduled: daily earnings summary to astrologers ─────────────
exports.dailyEarningsSummary = functions.pubsub.schedule("0 21 * * *")
  .timeZone("Asia/Kolkata")
  .onRun(async () => {
    const astrologers = await db.collection("astrologers")
      .where("status", "==", "approved").get();
    for (const doc of astrologers.docs) {
      const data = doc.data();
      if (data.fcmToken && data.todayEarnings > 0) {
        await admin.messaging().send({
          token: data.fcmToken,
          notification: {
            title: "Today's Earnings 💰",
            body: `You earned ₹${data.todayEarnings} today from ${data.todaySessions} sessions.`,
          },
        });
      }
    }
  });
