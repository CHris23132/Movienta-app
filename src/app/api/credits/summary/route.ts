import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromHeaders, adminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    // Get and verify Firebase ID token
    const userId = await getUserIdFromHeaders(req.headers);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    const snap = await adminDb
      .collection("users")
      .doc(userId)
      .get();
    
    const userData = snap.data();
    const current = userData?.credits?.current ?? 0;
    const subscriptionId = userData?.billing?.stripe?.subscriptionId;
    const hasSubscription = !!subscriptionId;

    console.log('Credits Summary:', { 
      userId, 
      credits: current, 
      hasSubscription,
      userData: JSON.stringify(userData)
    });

    return NextResponse.json({ 
      credits: current,
      hasSubscription,
      subscriptionId 
    });
  } catch (error) {
    console.error("Error fetching credits summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch credits" }, 
      { status: 500 }
    );
  }
}

