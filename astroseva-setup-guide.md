# AstroSeva — Stage 5 & 6 Setup Guide

## Project Structure
```
astroseva/
├── src/
│   ├── firebase/
│   │   └── config.js              ← firebase.config.js
│   ├── services/
│   │   ├── auth.service.js        ← auth.service.js
│   │   ├── payment.service.js     ← payment.service.js
│   │   ├── chat.service.js        ← chat.service.js
│   │   └── notifications.service.js
│   └── components/
│       ├── astroseva-customer.jsx ← Customer App
│       ├── astroseva-astrologer.jsx ← Astrologer Portal
│       └── astroseva-admin.jsx    ← Admin Panel (Stage 6)
├── functions/
│   └── index.js                   ← backend.functions.js
├── firestore.rules
└── database.rules.json
```

---

## Step 1 — Firebase Setup (10 minutes)

1. Go to https://console.firebase.google.com
2. Click "Create Project" → name it "AstroSeva"
3. Enable Google Analytics → Continue
4. In the dashboard, click "Web" icon → Register app → "astroseva"
5. Copy the config object → paste into `src/firebase/config.js`

### Enable Firebase Services:
| Service | Where | Notes |
|---|---|---|
| Authentication | Build → Authentication → Get Started | Enable Email, Google, Apple, Phone |
| Firestore | Build → Firestore → Create Database | Start in production mode |
| Realtime Database | Build → Realtime Database → Create | Start in locked mode |
| Storage | Build → Storage → Get Started | For astrologer photos |
| Cloud Messaging | Project Settings → Cloud Messaging | Copy VAPID key |
| Functions | Build → Functions → Get Started | Requires Blaze plan |

---

## Step 2 — Razorpay Setup (India Payments)

1. Sign up at https://razorpay.com
2. Complete KYC (business docs needed, takes 1-2 days)
3. Dashboard → Settings → API Keys → Generate Key
4. Copy Key ID and Key Secret
5. Add to Firebase Functions config:
```bash
firebase functions:config:set razorpay.key_id="rzp_live_xxx"
firebase functions:config:set razorpay.key_secret="xxx"
```
6. Add to your `.env`:
```
VITE_RAZORPAY_KEY_ID=rzp_live_xxx
```
7. Add Razorpay script to `index.html`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

**Test mode:** Use `rzp_test_xxx` keys first. Test cards: 4111 1111 1111 1111

---

## Step 3 — Stripe Setup (Global Payments)

1. Sign up at https://stripe.com
2. Dashboard → Developers → API Keys
3. Copy Publishable Key and Secret Key
4. Add to Firebase Functions:
```bash
firebase functions:config:set stripe.secret_key="sk_live_xxx"
firebase functions:config:set stripe.webhook_secret="whsec_xxx"
```
5. Add to `.env`:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```
6. Install Stripe.js:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```
7. Set up webhook in Stripe Dashboard → Developers → Webhooks
   - Endpoint: `https://us-central1-astroseva.cloudfunctions.net/stripeWebhook`
   - Events: `payment_intent.succeeded`, `payment_intent.failed`

**Test mode:** Use `pk_test_xxx` / `sk_test_xxx` keys first.

---

## Step 4 — Deploy Firebase Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Init project
firebase init

# Deploy security rules
firebase deploy --only firestore:rules
firebase deploy --only database

# Deploy Cloud Functions
cd functions
npm install firebase-functions firebase-admin razorpay stripe
cd ..
firebase deploy --only functions
```

---

## Step 5 — Install npm packages

```bash
npm install firebase
npm install @stripe/stripe-js @stripe/react-stripe-js
npm install razorpay  # server-side only
```

---

## Step 6 — Make yourself Admin

After first login, go to Firebase Console → Firestore → users → your UID → Edit:
```json
{ "role": "admin" }
```

Then access the Admin Panel from the app.

---

## Environment Variables (.env)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=astroseva.firebaseapp.com
VITE_FIREBASE_DB_URL=https://astroseva-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=astroseva
VITE_FIREBASE_STORAGE_BUCKET=astroseva.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_RAZORPAY_KEY_ID=rzp_live_xxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
VITE_FCM_VAPID_KEY=your_vapid_key
```

---

## Cost Estimate (monthly, at 1000 active users)

| Service | Free Tier | Paid (est.) |
|---|---|---|
| Firebase Auth | 10K/month free | $0 |
| Firestore | 1GB + 50K reads/day free | ~$5-20 |
| Realtime DB | 1GB free | ~$5 |
| Storage | 5GB free | ~$2 |
| Functions | 2M calls/month free | ~$0-5 |
| Razorpay | 2% per transaction | Revenue dependent |
| Stripe | 2.9% + 30¢ per transaction | Revenue dependent |
| **Total infra** | | **~$12-32/month** |

