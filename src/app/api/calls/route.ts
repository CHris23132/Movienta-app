import { NextRequest, NextResponse } from 'next/server';
import { createCall, addMessageToCall } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received request body:', body);
    
    const { landingPageId, userId, openingMessage } = body;

    if (!landingPageId) {
      console.error('Missing landingPageId');
      return NextResponse.json(
        { error: 'Landing page ID is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      console.error('Missing userId');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('Creating call for landing page:', landingPageId, 'User:', userId);
    
    // Create new call
    const callId = await createCall(landingPageId, userId);
    console.log('Call created with ID:', callId);

    // Add opening message
    if (openingMessage) {
      console.log('Adding opening message');
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
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: `Failed to create call: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

