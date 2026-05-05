// AstroSeva — Payment Service  (src/services/payment.service.js)
// Razorpay (India) + Stripe (Global) unified payment handler

import {
  collection, addDoc, updateDoc, doc,
  serverTimestamp, increment, runTransaction,
} from "firebase/firestore";
import { db } from "./firebase.config";

// ══════════════════════════════════════════════════════
// RAZORPAY — India (UPI, Cards, Net Banking, Wallets)
// ══════════════════════════════════════════════════════
// Setup: https://razorpay.com → Create Account → Get Key ID & Secret
// Add to .env:
//   VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
//   RAZORPAY_KEY_SECRET=XXXXXXXXXX   (server-side only!)

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export async function initiateRazorpayPayment({ amount, currency = "INR", planId, userId, planName, coinsToAdd }) {
  // Step 1: Create order on your backend (Node.js/Firebase Function)
  // Your backend calls: razorpay.orders.create({ amount: amount*100, currency })
  const orderResponse = await fetch("/api/payments/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, planId, userId }),
  });
  const { orderId } = await orderResponse.json();

  return new Promise((resolve, reject) => {
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100,        // paise
      currency,
      name: "AstroSeva",
      description: planName + " Coin Pack",
      image: "/logo.png",
      order_id: orderId,
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#ffd700" },
      modal: {
        ondismiss: () => reject(new Error("Payment cancelled")),
      },
      handler: async (response) => {
        // Step 2: Verify payment on your backend
        const verify = await fetch("/api/payments/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            userId,
            coinsToAdd,
            planId,
          }),
        });
        const result = await verify.json();
        if (result.success) {
          await creditCoins(userId, coinsToAdd, {
            txnId: response.razorpay_payment_id,
            amount,
            currency,
            planId,
            planName,
            gateway: "razorpay",
          });
          resolve({ success: true, txnId: response.razorpay_payment_id });
        } else {
          reject(new Error("Payment verification failed"));
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (resp) => reject(new Error(resp.error.description)));
    rzp.open();
  });
}

// ══════════════════════════════════════════════════════
// STRIPE — Global (135+ countries, all currencies)
// ══════════════════════════════════════════════════════
// Setup: https://stripe.com → Get Publishable + Secret keys
// Add to .env:
//   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_XXXXXXXXXX
//   STRIPE_SECRET_KEY=sk_live_XXXXXXXXXX   (server-side only!)

export async function initiateStripePayment({ amountUSD, planId, userId, planName, coinsToAdd, currency }) {
  // Your backend creates a PaymentIntent and returns clientSecret
  const response = await fetch("/api/payments/stripe/create-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amountUSD, planId, userId, currency }),
  });
  const { clientSecret, paymentIntentId } = await response.json();

  // Use Stripe.js on the frontend to confirm payment
  const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: window.stripeCardElement, // mounted Stripe Card Element
      billing_details: { name: "" },
    },
  });

  if (error) throw new Error(error.message);

  // Credit coins after successful Stripe payment
  await creditCoins(userId, coinsToAdd, {
    txnId: paymentIntentId,
    amount: amountUSD,
    currency,
    planId,
    planName,
    gateway: "stripe",
  });

  return { success: true, txnId: paymentIntentId };
}

// ══════════════════════════════════════════════════════
// SHARED — Credit coins + record transaction
// ══════════════════════════════════════════════════════
export async function creditCoins(userId, coins, meta = {}) {
  await runTransaction(db, async (txn) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await txn.get(userRef);
    if (!userSnap.exists()) throw new Error("User not found");

    // Update user coin balance
    txn.update(userRef, {
      coins: increment(coins),
      totalRecharges: increment(1),
      lastRecharge: serverTimestamp(),
    });

    // Write transaction record
    const txnRef = doc(collection(db, "users", userId, "transactions"));
    txn.set(txnRef, {
      type: "credit",
      coins,
      amount: meta.amount || 0,
      currency: meta.currency || "INR",
      planId: meta.planId || "",
      planName: meta.planName || "",
      gateway: meta.gateway || "",
      txnId: meta.txnId || "",
      status: "success",
      createdAt: serverTimestamp(),
    });

    // Global revenue record (for admin analytics)
    const revenueRef = doc(collection(db, "revenue"));
    txn.set(revenueRef, {
      userId,
      amount: meta.amount || 0,
      currency: meta.currency || "INR",
      amountUSD: meta.amountUSD || meta.amount || 0,
      planId: meta.planId || "",
      gateway: meta.gateway || "",
      txnId: meta.txnId || "",
      createdAt: serverTimestamp(),
    });
  });
}

// Deduct coins after session
export async function deductCoins(userId, coins, sessionId, astrologerId) {
  await runTransaction(db, async (txn) => {
    const userRef = doc(db, "users", userId);
    const userSnap = await txn.get(userRef);
    const current = userSnap.data()?.coins || 0;
    if (current < coins) throw new Error("Insufficient coins");

    txn.update(userRef, {
      coins: increment(-coins),
      totalSpent: increment(coins),
      totalSessions: increment(1),
    });

    const txnRef = doc(collection(db, "users", userId, "transactions"));
    txn.set(txnRef, {
      type: "debit",
      coins,
      sessionId,
      astrologerId,
      status: "completed",
      createdAt: serverTimestamp(),
    });
  });
}
