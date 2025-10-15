import Stripe from "stripe";
import * as admin from "firebase-admin";

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Initialize Firebase Admin if not already initialized
const app = !admin.apps.length 
  ? admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    })
  : admin.app();

export const db = admin.firestore();

/**
 * Get or create a Stripe customer for a Firebase user
 */
export async function getOrCreateCustomer(uid: string, email?: string): Promise<string> {
  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();
  const existing = snap.data()?.billing?.stripe?.customerId as string | undefined;
  
  if (existing) {
    return existing;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({ 
    email, 
    metadata: { firebaseUid: uid } 
  });
  
  // Save customer ID to Firestore
  await ref.set(
    { 
      billing: { 
        stripe: { 
          customerId: customer.id 
        } 
      } 
    }, 
    { merge: true }
  );
  
  return customer.id;
}

/**
 * Check if user has an active subscription
 */
export async function hasActiveSubscription(uid: string): Promise<boolean> {
  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();
  const subscriptionId = snap.data()?.billing?.stripe?.subscriptionId as string | undefined;
  
  if (!subscriptionId) {
    return false;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription.status === 'active' || subscription.status === 'trialing';
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
}

/**
 * Get user's current credit balance
 */
export async function getUserCredits(uid: string): Promise<number> {
  const ref = db.collection("users").doc(uid);
  const snap = await ref.get();
  return snap.data()?.credits?.current ?? 0;
}

