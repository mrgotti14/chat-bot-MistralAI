import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/app/lib/mongoose';
import User from '@/models/User';
import { authOptions } from '../../[...nextauth]/auth-options';

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

    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isNewOAuthUser = user.password === undefined || user.password === null;
    const needsPassword = isNewOAuthUser;

    return NextResponse.json({
      hasPassword: !needsPassword
    });
  } catch (error) {
    console.error('Error checking password:', error);
    return NextResponse.json(
      { error: 'Error checking password' },
      { status: 500 }
    );
  }
} 