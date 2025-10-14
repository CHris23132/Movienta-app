import { NextRequest, NextResponse } from 'next/server';
import { createCall, addMessageToCall } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { landingPageId, openingMessage } = await request.json();

    if (!landingPageId) {
      return NextResponse.json(
        { error: 'Landing page ID is required' },
        { status: 400 }
      );
    }

    // Create new call
    const callId = await createCall(landingPageId);

    // Add opening message
    if (openingMessage) {
      await addMessageToCall(callId, {
        role: 'assistant',
        content: openingMessage,
      });
    }

    return NextResponse.json({ 
      callId,
      message: 'Call created successfully' 
    });
  } catch (error) {
    console.error('Error creating call:', error);
    return NextResponse.json(
      { error: 'Failed to create call' },
      { status: 500 }
    );
  }
}

