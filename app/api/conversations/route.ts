import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongoose';
import Conversation from '@/models/Conversation';
import { authOptions } from '../auth/[...nextauth]/auth-options';

/**
 * Retrieves all conversations for the authenticated user
 * @route GET /api/conversations
 * 
 * @returns {Promise<NextResponse>} List of user's conversations sorted by last update
 * @throws {Error} If user is not authenticated
 * @throws {Error} If database connection fails
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const conversations = await Conversation.find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .exec();

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Error fetching conversations' },
      { status: 500 }
    );
  }
} 