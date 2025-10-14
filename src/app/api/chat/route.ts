import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getLandingPageBySlug, getCall, addMessageToCall, updateCallPhoneNumber } from '@/lib/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Extract phone number from text using pattern matching
function extractPhoneNumber(text: string): string | null {
  // Various phone number patterns
  const patterns = [
    /(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/,  // 123-456-7890, 123.456.7890, 123 456 7890
    /(\(\d{3}\)\s*\d{3}[-.\s]?\d{4})/,   // (123) 456-7890
    /(\d{10})/,                           // 1234567890
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0].replace(/\D/g, ''); // Return digits only
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { message, callId, landingPageSlug } = await request.json();

    if (!message || !callId || !landingPageSlug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get landing page configuration
    const landingPage = await getLandingPageBySlug(landingPageSlug);
    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }

    // Get call data
    const call = await getCall(callId);
    if (!call) {
      return NextResponse.json(
        { error: 'Call not found' },
        { status: 404 }
      );
    }

    // Save user message
    await addMessageToCall(callId, {
      role: 'user',
      content: message,
    });

    // Check if this is the first user response (phone number collection)
    const hasPhoneNumber = !!call.phoneNumber;
    
    if (!hasPhoneNumber) {
      // Try to extract phone number from the message
      const phoneNumber = extractPhoneNumber(message);
      
      if (phoneNumber) {
        // Save phone number
        await updateCallPhoneNumber(callId, phoneNumber);
        
        // Build conversation history for context
        const messages = [
          {
            role: 'system' as const,
            content: `You are a helpful sales assistant for ${landingPage.brandName}. The customer has just provided their phone number: ${phoneNumber}. Thank them briefly and then ask a relevant follow-up question based on these instructions: ${landingPage.customPrompt}. Keep responses concise and conversational.`
          },
          {
            role: 'user' as const,
            content: message
          }
        ];

        // Get AI response
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 150,
          temperature: 0.7,
        });

        const aiResponse = completion.choices[0].message.content || 'Thank you for providing your number. How can I help you further?';

        // Save AI response
        await addMessageToCall(callId, {
          role: 'assistant',
          content: aiResponse,
        });

        return NextResponse.json({ 
          response: aiResponse,
          phoneNumberCaptured: true,
        });
      } else {
        // Phone number not found, ask again
        const response = "I'm sorry, I didn't catch your phone number. Could you please provide it again? You can say it digit by digit or all together.";
        
        await addMessageToCall(callId, {
          role: 'assistant',
          content: response,
        });

        return NextResponse.json({ 
          response,
          phoneNumberCaptured: false,
        });
      }
    } else {
      // Follow-up conversation
      const conversationHistory = call.messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const messages = [
        {
          role: 'system' as const,
          content: `You are a helpful sales assistant for ${landingPage.brandName}. You already have the customer's phone number (${call.phoneNumber}). Continue the conversation based on these instructions: ${landingPage.customPrompt}. Keep responses concise, helpful, and conversational. Gather relevant information about their needs.`
        },
        ...conversationHistory,
        {
          role: 'user' as const,
          content: message
        }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 150,
        temperature: 0.7,
      });

      const aiResponse = completion.choices[0].message.content || 'I understand. Is there anything else you\'d like to share?';

      // Save AI response
      await addMessageToCall(callId, {
        role: 'assistant',
        content: aiResponse,
      });

      return NextResponse.json({ 
        response: aiResponse,
        phoneNumberCaptured: true,
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

