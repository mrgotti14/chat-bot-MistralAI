import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongoose';
import Conversation from '@/models/Conversation';
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
        { error: 'Non autorisé' },
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
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Erreur lors de la récupération de la conversation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la conversation' },
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
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    const conversation = await Conversation.findOneAndDelete({
      _id: id,
      userId: session.user.id
    }).exec();
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Conversation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la conversation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la conversation' },
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
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const { title } = await request.json();
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Titre invalide' },
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
        { error: 'Conversation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la conversation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la conversation' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 