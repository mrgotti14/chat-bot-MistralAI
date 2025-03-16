import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/app/lib/mongoose';
import Conversation from '@/models/Conversation';
import User from '@/models/User';
import { 
  updateUserUsage, 
  hasReachedActiveConversationsLimit,
  hasReachedDailyMessageLimit,
  getCurrentPlanLimits
} from '@/app/lib/subscription-utils';
import { getSubscriptionPlan, SUBSCRIPTION_PLANS } from '@/app/lib/subscription-plans';
import { authOptions } from '../auth/[...nextauth]/auth-options';

if (!process.env.MISTRAL_API_KEY && !process.env.OLLAMA_API_URL) {
  throw new Error('Missing API configuration: either MISTRAL_API_KEY or OLLAMA_API_URL must be set');
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
 *   "modelProvider": "mistral" | "ollama" // Optional, defaults to "mistral"
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
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    /**
     * Check message limit before proceeding
     * Returns 429 if daily message limit is reached
     */
    if (hasReachedDailyMessageLimit(user)) {
      const limits = getCurrentPlanLimits(user);
      return NextResponse.json(
        { 
          error: 'Daily message limit reached',
          limits
        },
        { status: 429 }
      );
    }

    const { message, conversationId: existingConversationId, modelProvider = 'mistral' } = await request.json();

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    /**
     * Check active conversations limit for new conversations
     * Returns 429 if limit is reached
     */
    if (!existingConversationId && hasReachedActiveConversationsLimit(user)) {
      return NextResponse.json(
        { error: 'Active conversations limit reached' },
        { status: 429 }
      );
    }

    /**
     * Check if user has access to premium models (Ollama)
     * Only Pro and Business tiers can use Ollama
     */
    const userTier = user.subscriptionTier || 'free';
    const hasPremiumAccess = userTier === 'pro' || userTier === 'business';
    
    // Force using Mistral API if user doesn't have premium access
    const finalModelProvider = (!hasPremiumAccess && modelProvider === 'ollama') 
      ? 'mistral' 
      : modelProvider;
    
    // If user tried to use Ollama without permission, return an error
    if (modelProvider === 'ollama' && !hasPremiumAccess) {
      return NextResponse.json(
        { error: 'Premium model access requires Pro or Business subscription' },
        { status: 403 }
      );
    }

    const userMessage = {
      role: 'user',
      content: message.trim(),
      createdAt: new Date()
    };

    /**
     * Get response length limit based on user's subscription plan
     */
    const plan = getSubscriptionPlan(userTier);
    const maxLength = plan.limits.maxResponseLength;
    
    // Debug log for monitoring
    console.log(`Plan: ${plan.name}, Tier: ${userTier}, MaxLength: ${maxLength}, Provider: ${finalModelProvider}`);

    /**
     * System message to enforce response length limits
     * Instructs the AI to provide concise responses within character limits
     */
    const systemMessage = maxLength > 0 
      ? `You are an AI assistant that must strictly respect a ${maxLength} character limit per response. If you cannot provide a complete answer within this limit, give a concise response and suggest the user to ask a more specific question. Do not mention this limit in your responses unless explicitly asked. IMPORTANT: Always respond in French.`
      : `You are an AI assistant. IMPORTANT: Always respond in French.`;

    /**
     * Gets AI response with retry mechanism for length compliance
     * @param {string} currentMessage - The user's message to process
     * @param {number} retryCount - Number of attempts to get a compliant response
     * @returns {Promise<string>} The AI's response
     */
    async function getAIResponse(currentMessage: string, retryCount = 0): Promise<string> {
      if (retryCount >= 3) {
        return `Je dois fournir une réponse plus courte. Pourriez-vous reformuler votre question de manière plus spécifique ?`;
      }

      // Retrieve message history for existing conversations
      let messageHistory: Array<{role: string, content: string}> = [];
      if (existingConversationId) {
        try {
          const conversation = await Conversation.findOne({
            _id: existingConversationId,
            userId: session?.user?.id
          });
          
          if (conversation) {
            // Convert conversation messages to the format expected by the API
            messageHistory = conversation.messages.map((msg: any) => ({
              role: msg.role as string,
              content: msg.content as string
            }));
          }
        } catch (err) {
          console.error('Error fetching conversation history:', err);
        }
      }

      // Add current message to history
      const finalMessages = [
        ...(systemMessage ? [{ role: 'system', content: systemMessage }] : []),
        ...messageHistory,
        { role: 'user', content: `${currentMessage}\n\nIMPORTANT: Réponds toujours en français.` }
      ];

      // Use Ollama if specified
      if (finalModelProvider === 'ollama') {
        if (!process.env.OLLAMA_API_URL) {
          throw new Error('Ollama API URL not configured');
        }

        const ollamaModel = process.env.OLLAMA_MODEL || 'mistral';
        const ollamaUrl = `${process.env.OLLAMA_API_URL}/api/chat`;
        
        try {
          const response = await fetch(ollamaUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: ollamaModel,
              messages: finalMessages,
              stream: false
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Ollama API Error:', errorData);
            throw new Error(`Ollama API Error: ${errorData.error || 'Unknown error'}`);
          }

          const data = await response.json();
          const content = data.message?.content?.trim();

          if (!content) {
            throw new Error('Invalid response from Ollama API');
          }

          /**
           * Retry with stricter instructions if response exceeds length limit
           */
          if (maxLength > 0 && content.length > maxLength) {
            console.log(`Response too long (${content.length} chars), retrying...`);
            const updatedMessage = `${currentMessage}\n\nNOTE: Your last response was ${content.length} characters. It MUST be less than ${maxLength} characters.`;
            return getAIResponse(updatedMessage, retryCount + 1);
          }

          return content;
        } catch (error: any) {
          console.error('Ollama API Error:', error);
          throw new Error(`Failed to get response from Ollama: ${error.message}`);
        }
      } else {
        // Use Mistral API by default
        if (!process.env.MISTRAL_API_KEY) {
          throw new Error('Mistral API key not configured');
        }

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
          },
          body: JSON.stringify({
            model: 'mistral-tiny',
            messages: finalMessages,
            temperature: 0.7,
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Mistral API Error:', errorData);
          throw new Error(`Mistral API Error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();

        if (!content) {
          throw new Error('Invalid response from Mistral API');
        }

        /**
         * Retry with stricter instructions if response exceeds length limit
         */
        if (maxLength > 0 && content.length > maxLength) {
          console.log(`Response too long (${content.length} chars), retrying...`);
          const updatedMessage = `${currentMessage}\n\nNOTE: Your last response was ${content.length} characters. It MUST be less than ${maxLength} characters.`;
          return getAIResponse(updatedMessage, retryCount + 1);
        }

        return content;
      }
    }

    const aiResponse = await getAIResponse(message.trim());
    
    const assistantMessage = {
      role: 'assistant',
      content: aiResponse,
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
      
      /**
       * Update active conversations counter for new conversations
       */
      user.activeConversations = (user.activeConversations || 0) + 1;
    }

    /**
     * Update user's daily message usage counter
     */
    await updateUserUsage(user);

    return NextResponse.json({
      response: assistantMessage.content,
      conversationId: resultConversationId,
      modelProvider: finalModelProvider
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Error processing message' },
      { status: 500 }
    );
  }
} 