/**
 * Credit consumption helper for Firebase Functions
 */

import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * Consume one credit from user's balance
 * Throws "NO_CREDITS" error if user has insufficient credits
 * 
 * @param uid - Firebase user ID
 * @param landingPageId - Optional landing page ID for tracking
 * @throws Error with message "NO_CREDITS" if balance is insufficient
 */
export async function consumeCreditOrThrow(
  uid: string,
  landingPageId?: string
): Promise<void> {
  const userRef = db.collection("users").doc(uid);
  const ledgerRef = userRef.collection("credits_ledger").doc();

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const current = (snap.data()?.credits?.current ?? 0) as number;

    if (current <= 0) {
      throw new Error("NO_CREDITS");
    }

    // Create ledger entry for debit
    tx.set(ledgerRef, {
      type: "debit",
      amount: -1,
      reason: landingPageId ? `api_call:${landingPageId}` : "api_call",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Update user credits
    tx.set(
      userRef,
      {
        credits: {
          current: current - 1,
          lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      },
      { merge: true }
    );
  });
}

/**
 * Check if user has sufficient credits
 * 
 * @param uid - Firebase user ID
 * @param requiredCredits - Number of credits required (default: 1)
 * @returns true if user has sufficient credits
 */
export async function hasCredits(
  uid: string,
  requiredCredits = 1
): Promise<boolean> {
  const userRef = db.collection("users").doc(uid);
  const snap = await userRef.get();
  const current = (snap.data()?.credits?.current ?? 0) as number;
  return current >= requiredCredits;
}

/**
 * Get user's current credit balance
 * 
 * @param uid - Firebase user ID
 * @returns Current credit balance
 */
export async function getUserCredits(uid: string): Promise<number> {
  const userRef = db.collection("users").doc(uid);
  const snap = await userRef.get();
  return (snap.data()?.credits?.current ?? 0) as number;
}

/**
 * Grant credits to a user (with idempotency)
 * This should typically only be called from webhook handlers
 * 
 * @param uid - Firebase user ID
 * @param amount - Number of credits to grant
 * @param reason - Reason for granting credits
 * @param idempotencyKey - Unique key to prevent duplicate grants
 */
export async function grantCredits(
  uid: string,
  amount: number,
  reason: string,
  idempotencyKey: string
): Promise<void> {
  const userRef = db.collection("users").doc(uid);
  const ledgerRef = userRef.collection("credits_ledger").doc(idempotencyKey);

  // Check if already processed
  const ledgerSnap = await ledgerRef.get();
  if (ledgerSnap.exists) {
    return; // Already granted
  }

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const current = (snap.data()?.credits?.current ?? 0) as number;

    tx.set(ledgerRef, {
      type: "grant",
      amount,
      reason,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

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
}

