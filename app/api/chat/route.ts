import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongoose';
import Conversation from '@/models/Conversation';
import { authOptions } from '../auth/[...nextauth]/auth-options';

if (!process.env.MISTRAL_API_KEY) {
  throw new Error('Missing Mistral API key');
}

/**
 * Chat API endpoint for message processing
 * @route POST /api/chat
 * 
 * Request body:
 * ```json
 * {
 *   "message": "User's message",
 *   "conversationId": "existing-id" // Optional
 * }
 * ```
 * 
 * @throws {401} Unauthorized
 * @throws {400} Message is required
 * @throws {404} Conversation not found
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { message, conversationId: existingConversationId } = await request.json();

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const userMessage = {
      role: 'user',
      content: message.trim(),
      createdAt: new Date()
    };

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mistral API Error:', errorData);
      throw new Error(`Mistral API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Mistral API');
    }

    const assistantMessage = {
      role: 'assistant',
      content: data.choices[0].message.content.trim(),
      createdAt: new Date()
    };

    let resultConversationId;
    if (existingConversationId) {
      const conversation = await Conversation.findOne({
        _id: existingConversationId,
        userId: session.user.id
      });
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }
      
      conversation.messages.push(userMessage, assistantMessage);
      await conversation.save();
      resultConversationId = conversation._id;
    } else {
      const title = message.slice(0, 30) + '...';
      const newConversation = await Conversation.create({
        title,
        messages: [userMessage, assistantMessage],
        userId: session.user.id
      });
      resultConversationId = newConversation._id;
    }

    return NextResponse.json({
      response: assistantMessage.content,
      conversationId: resultConversationId
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Error processing message' },
      { status: 500 }
    );
  }
} 