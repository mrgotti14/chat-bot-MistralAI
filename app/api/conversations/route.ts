import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Conversation from '@/models/Conversation';

export async function GET() {
  try {
    await dbConnect();
    const conversations = await Conversation.find()
      .sort({ updatedAt: -1 })
      .exec();

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des conversations' },
      { status: 500 }
    );
  }
} 