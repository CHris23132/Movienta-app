import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getLandingPageBySlug, getCall, addMessageToCall, updateCallClientInfo } from '@/lib/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use AI to intelligently extract name and phone number from natural language
async function extractContactInfo(text: string): Promise<{ name: string | null; phone: string | null }> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a data extraction assistant. Extract the person's name and phone number from the user's message.
Rules:
- Extract ONLY the person's name (first and last name if provided)
- Extract ONLY the phone number (digits only, no formatting)
- Ignore all filler words, greetings, and conversational phrases
- If name is not clearly provided, return null for name
- If phone is not clearly provided, return null for phone
- Names should be properly capitalized
- Phone numbers should be digits only (remove all dashes, spaces, parentheses)

Respond ONLY with valid JSON in this exact format:
{"name": "First Last", "phone": "1234567890"}
or
{"name": null, "phone": "1234567890"}
or
{"name": "First Last", "phone": null}
or
{"name": null, "phone": null}

Do not include any other text, explanation, or markdown formatting.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 100,
    });

    const responseText = completion.choices[0].message.content?.trim() || '{}';
    
    // Parse the JSON response
    const parsed = JSON.parse(responseText);
    
    return {
      name: parsed.name || null,
      phone: parsed.phone || null
    };
  } catch (error) {
    console.error('Error extracting contact info with AI:', error);
    // Fallback to basic regex if AI fails
    const phoneMatch = text.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})|(\d{10})/);
    return {
      name: null,
      phone: phoneMatch ? phoneMatch[0].replace(/\D/g, '') : null
    };
  }
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

    // Check if this is the first user response (name and phone number collection)
    const hasPhoneNumber = !!call.phoneNumber;
    
    if (!hasPhoneNumber) {
      // Use AI to intelligently extract both name and phone number from the message
      const { name: clientName, phone: phoneNumber } = await extractContactInfo(message);
      
      if (phoneNumber) {
        // Save phone number and name
        await updateCallClientInfo(callId, phoneNumber, clientName || undefined);
        
        // Build conversation history for context
        const messages = [
          {
            role: 'system' as const,
            content: `You are a helpful sales assistant for ${landingPage.brandName}. The customer has just provided their ${clientName ? 'name (' + clientName + ') and ' : ''}phone number: ${phoneNumber}. Thank them briefly${clientName ? ' using their name' : ''} and then ask a relevant follow-up question based on these instructions: ${landingPage.customPrompt}. Keep responses concise and conversational.`
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

        const aiResponse = completion.choices[0].message.content || `Thank you${clientName ? ' ' + clientName : ''} for providing your information. How can I help you further?`;

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
        // Phone number not found, ask again politely
        const response = "I didn't quite catch your phone number. Could you please share it again?";
        
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

      const customerInfo = call.clientName 
        ? `the customer's name (${call.clientName}) and phone number (${call.phoneNumber})`
        : `the customer's phone number (${call.phoneNumber})`;

      const messages = [
        {
          role: 'system' as const,
          content: `You are a helpful sales assistant for ${landingPage.brandName}. You already have ${customerInfo}. ${call.clientName ? 'Use their name naturally in the conversation. ' : ''}Continue the conversation based on these instructions: ${landingPage.customPrompt}. Keep responses concise, helpful, and conversational. Gather relevant information about their needs.`
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

