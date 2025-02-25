import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { authOptions } from '../[...nextauth]/auth-options';

/**
 * Password management endpoint
 * @route POST /api/auth/password
 * 
 * Request body:
 * ```json
 * {
 *   "password": "newpassword123"
 * }
 * ```
 * 
 * @throws {401} Unauthorized
 * @throws {400} Password too short (min 6 characters)
 * @throws {404} User not found
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

    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
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

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password successfully added'
    });
  } catch (error) {
    console.error('Error adding password:', error);
    return NextResponse.json(
      { error: 'Error adding password' },
      { status: 500 }
    );
  }
} 