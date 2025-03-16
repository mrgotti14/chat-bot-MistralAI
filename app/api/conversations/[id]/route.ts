import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/app/lib/mongoose';
import Conversation from '@/models/Conversation';
import User from '@/models/User';
import { authOptions } from '../../auth/[...nextauth]/auth-options';

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(
  _request: NextRequest,
  { params }: Props
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const conversation = await Conversation.findOne({
      _id: id,
      userId: session.user.id
    }).exec();
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Error fetching conversation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: Props
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Get user first to update conversation count
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const conversation = await Conversation.findOneAndDelete({
      _id: id,
      userId: session.user.id
    }).exec();
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Decrement active conversations count
    if (user.activeConversations && user.activeConversations > 0) {
      user.activeConversations--;
      await user.save();
    }

    return NextResponse.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'Error deleting conversation' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: Props
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title } = await request.json();
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Invalid title' },
        { status: 400 }
      );
    }

    await dbConnect();
    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id
      },
      { title: title.trim() },
      { new: true }
    ).exec();
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la conversation:', error);
    return NextResponse.json(
      { error: 'Error updating conversation' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 