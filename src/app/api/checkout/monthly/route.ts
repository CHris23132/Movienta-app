import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { stripe, getOrCreateCustomer } from "@/lib/stripe";

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

    const decoded = await adminAuth.verifyIdToken(idToken);
    const uid = decoded.uid;
    const email = decoded.email || undefined;

    // Get or create Stripe customer
    const customerId = await getOrCreateCustomer(uid, email);

    // Create Stripe Checkout session
    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin;
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { 
        firebaseUid: uid, 
        purpose: "monthly_credits" 
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

