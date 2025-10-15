/**
 * Firebase Cloud Functions for Movienta
 * - Stripe webhook handling
 * - Credit management
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Set global options
setGlobalOptions({ maxInstances: 10 });

// Lazy-load Stripe (only when function is called, not at module load)
function getStripe(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2025-02-24.acacia" as Stripe.LatestApiVersion,
  });
}

/**
 * Grant credits to a user (idempotent)
 */
async function grantCredits(
  uid: string,
  amount: number,
  reason: string,
  stripeEventId: string
): Promise<void> {
  const userRef = db.collection("users").doc(uid);
  const ledgerRef = userRef.collection("credits_ledger").doc(stripeEventId);

  // Check if already processed (idempotent)
  const ledgerSnap = await ledgerRef.get();
  if (ledgerSnap.exists) {
    logger.info(`Credits already granted for event ${stripeEventId}`);
    return;
  }

  // Run transaction to grant credits
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const current = (snap.data()?.credits?.current ?? 0) as number;

    // Create ledger entry
    tx.set(ledgerRef, {
      type: "grant",
      amount,
      reason,
      stripeEventId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update user credits
    tx.set(
      userRef,
      {
        credits: {
          current: current + amount,
          lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      },
      { merge: true }
    );
  });

  logger.info(`Granted ${amount} credits to user ${uid} for ${reason}`);
}

/**
 * Stripe webhook handler
 */
export const stripeWebhook = onRequest(
  {
    secrets: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"],
  },
  async (req, res) => {
    const stripe = getStripe();
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  // Verify webhook signature
  let event: Stripe.Event;
  try {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      res.status(400).send("Missing stripe-signature header");
      return;
    }

    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature as string,
      endpointSecret
    );
  } catch (e: any) {
    logger.error("Webhook signature verification failed:", e.message);
    res.status(400).send(`Webhook Error: ${e.message}`);
    return;
  }

  logger.info(`Received webhook event: ${event.type}`);

  try {
    switch (event.type) {
      // One-time credit top-up completed
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Only process payment mode (not subscription mode)
        if (session.mode !== "payment") {
          logger.info(`Skipping subscription checkout session ${session.id}`);
          break;
        }

        const uid = session.metadata?.firebaseUid as string | undefined;
        if (!uid) {
          logger.warn(`No firebaseUid in session metadata for ${session.id}`);
          break;
        }

        // Retrieve full session with line items
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items.data.price"],
        });

        const price = fullSession.line_items?.data?.[0]?.price as Stripe.Price | undefined;
        if (!price) {
          logger.warn(`No price found for session ${session.id}`);
          break;
        }

        // Get credits from price metadata
        const credits = parseInt((price.metadata as any)?.credits || "0", 10);
        if (credits > 0) {
          await grantCredits(
            uid,
            credits,
            `topup:${price.id}`,
            event.id
          );
        } else {
          logger.warn(`No credits metadata on price ${price.id}`);
        }
        break;
      }

      // Monthly subscription payment succeeded
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.subscription as string | undefined;
        
        if (!subId) {
          logger.info(`Invoice ${invoice.id} has no subscription`);
          break;
        }

        // Retrieve subscription with expanded line items
        const sub = await stripe.subscriptions.retrieve(subId, {
          expand: ["items.data.price"],
        });

        // Find Firebase UID from subscription metadata or customer lookup
        let uid = (sub.metadata?.firebaseUid as string | undefined) || null;
        if (!uid) {
          const customerId = sub.customer as string;
          const usersQuery = await db
            .collection("users")
            .where("billing.stripe.customerId", "==", customerId)
            .limit(1)
            .get();

          if (!usersQuery.empty) {
            uid = usersQuery.docs[0].id;
          }
        }

        if (!uid) {
          logger.warn(`No Firebase UID found for subscription ${subId}`);
          break;
        }

        // Calculate total monthly credits from all subscription items
        const totalMonthlyCredits = sub.items.data.reduce((sum, item) => {
          const monthlyCredits = parseInt(
            (item.price.metadata as any)?.monthlyCredits || "0",
            10
          );
          return sum + monthlyCredits;
        }, 0);

        if (totalMonthlyCredits > 0) {
          await grantCredits(
            uid,
            totalMonthlyCredits,
            `monthly_reset:${sub.id}`,
            event.id
          );

          // Update subscription ID in user document
          await db.collection("users").doc(uid).set(
            {
              billing: {
                stripe: {
                  subscriptionId: sub.id,
                },
              },
            },
            { merge: true }
          );
        } else {
          logger.warn(`No monthly credits metadata on subscription ${subId}`);
        }
        break;
      }

      // Subscription deleted
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;

        // Find user by customer ID
        const usersQuery = await db
          .collection("users")
          .where("billing.stripe.customerId", "==", customerId)
          .limit(1)
          .get();

        if (!usersQuery.empty) {
          const uid = usersQuery.docs[0].id;
          // Remove subscription ID (user can still use remaining credits)
          await db.collection("users").doc(uid).set(
            {
              billing: {
                stripe: {
                  subscriptionId: admin.firestore.FieldValue.delete(),
                },
              },
            },
            { merge: true }
          );
          logger.info(`Removed subscription for user ${uid}`);
        }
        break;
      }

      // Payment failed
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logger.warn(`Payment failed for invoice ${invoice.id}`);
        // Could send notification to user here
        break;
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
    return;
  } catch (err) {
    logger.error("Webhook handler failed:", err);
    res.status(500).send("Webhook handler failed");
    return;
  }
}
);
