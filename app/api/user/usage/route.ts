import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { getCurrentPlanLimits } from '@/app/lib/subscription-utils';
import { authOptions } from '../../auth/[...nextauth]/auth-options';

/**
 * Get user usage statistics
 * @route GET /api/user/usage
 * 
 * @returns User's current usage statistics and limits
 * @throws {401} Unauthorized
 * @throws {404} User not found
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
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const planLimits = getCurrentPlanLimits(user);

    return NextResponse.json({
      tier: user.subscriptionTier || 'free',
      usage: {
        dailyMessageCount: user.dailyMessageCount || 0,
        lastMessageDate: user.lastMessageDate,
        activeConversations: user.activeConversations || 0
      },
      limits: planLimits
    });
  } catch (error) {
    console.error('Error fetching user usage:', error);
    return NextResponse.json(
      { error: 'Error fetching user usage' },
      { status: 500 }
    );
  }
} 