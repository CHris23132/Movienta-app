import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";
import { stripe, getOrCreateCustomer } from "@/lib/stripe";

// Initialize Firebase Admin if not already initialized
const app = !admin.apps.length 
  ? admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    })
  : admin.app();

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();
    
    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" }, 
        { status: 400 }
      );
    }

    // Get and verify Firebase ID token
    const auth = req.headers.get("authorization") ?? "";
    const idToken = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    
    if (!idToken) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = decoded.email || undefined;

    // Get or create Stripe customer
    const customerId = await getOrCreateCustomer(uid, email);

    // Create Stripe Checkout session for one-time payment
    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { 
        firebaseUid: uid, 
        purpose: "credits_topup" 
      },
      success_url: `${origin}/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/credits/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" }, 
      { status: 500 }
    );
  }
}

