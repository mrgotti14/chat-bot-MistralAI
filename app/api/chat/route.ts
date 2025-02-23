import { NextResponse } from 'next/server';

if (!process.env.MISTRAL_API_KEY) {
  throw new Error('La clé API Mistral est manquante');
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const messages = [
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages
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

    return NextResponse.json({
      response: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Erreur API Mistral:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors du traitement de la requête' },
      { status: 500 }
    );
  }
} 