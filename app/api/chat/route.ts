import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Conversation from '@/models/Conversation';

if (!process.env.MISTRAL_API_KEY) {
  throw new Error('La clé API Mistral est manquante');
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { message, conversationId: existingConversationId } = await request.json();

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Le message est requis' },
        { status: 400 }
      );
    }

    const userMessage = {
      role: 'user',
      content: message.trim(),
      createdAt: new Date()
    };

    // Appel à l'API Mistral
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur API Mistral:', errorData);
      throw new Error(`Erreur API Mistral: ${errorData.error?.message || 'Erreur inconnue'}`);
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Réponse invalide de l\'API Mistral');
    }

    const assistantMessage = {
      role: 'assistant',
      content: data.choices[0].message.content.trim(),
      createdAt: new Date()
    };

    // Sauvegarder dans MongoDB avec Mongoose
    let resultConversationId;
    if (existingConversationId) {
      const conversation = await Conversation.findById(existingConversationId);
      if (!conversation) {
        throw new Error('Conversation non trouvée');
      }
      conversation.messages.push(userMessage, assistantMessage);
      await conversation.save();
      resultConversationId = conversation._id;
    } else {
      const title = message.slice(0, 30) + '...';
      const newConversation = await Conversation.create({
        title,
        messages: [userMessage, assistantMessage]
      });
      resultConversationId = newConversation._id;
    }

    return NextResponse.json({
      response: assistantMessage.content,
      conversationId: resultConversationId
    });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du traitement de la requête' },
      { status: 500 }
    );
  }
} 