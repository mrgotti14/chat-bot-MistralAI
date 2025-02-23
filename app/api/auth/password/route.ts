import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { authOptions } from '../[...nextauth]/auth-options';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
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

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Mettre à jour l'utilisateur avec le nouveau mot de passe
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Mot de passe ajouté avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du mot de passe:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout du mot de passe' },
      { status: 500 }
    );
  }
} 