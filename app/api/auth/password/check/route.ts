import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { authOptions } from '../../[...nextauth]/auth-options';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // On vérifie si c'est un nouvel utilisateur Google sans mot de passe
    const isNewGoogleUser = user.password === undefined || user.password === null;
    const needsPassword = isNewGoogleUser;

    return NextResponse.json({
      hasPassword: !needsPassword
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification du mot de passe' },
      { status: 500 }
    );
  }
} 