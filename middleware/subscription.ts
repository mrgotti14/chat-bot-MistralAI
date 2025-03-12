import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '@/lib/mongoose';
import User from '@/models/User';
import { 
  hasReachedDailyMessageLimit, 
  hasReachedActiveConversationsLimit,
  hasFeatureAccess,
  hasActiveSubscription,
  getCurrentPlanLimits
} from '@/lib/subscription-utils';

export async function subscriptionMiddleware(request: NextRequest) {
  try {
    // Check authentication
    const token = await getToken({ req: request });
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401 }
      );
    }


    await dbConnect();
    const user = await User.findOne({ email: token.email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        { status: 404 }
      );
    }


    if (user.subscriptionTier !== 'free' && !hasActiveSubscription(user)) {
      return new NextResponse(
        JSON.stringify({ error: 'Subscription expired or inactive' }),
        { status: 402 }
      );
    }


    if (request.nextUrl.pathname.startsWith('/api/chat')) {
      if (hasReachedDailyMessageLimit(user)) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Daily message limit reached',
            limits: getCurrentPlanLimits(user)
          }),
          { status: 429 }
        );
      }
    }


    if (request.nextUrl.pathname.startsWith('/api/chat/new')) {
      if (hasReachedActiveConversationsLimit(user)) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Active conversations limit reached',
            limits: getCurrentPlanLimits(user)
          }),
          { status: 429 }
        );
      }
    }


    if (request.nextUrl.pathname.startsWith('/api/export')) {
      if (!hasFeatureAccess(user, 'export')) {
        return new NextResponse(
          JSON.stringify({ error: 'Feature not available in your plan' }),
          { status: 403 }
        );
      }
    }

    if (request.nextUrl.pathname.startsWith('/api/customization')) {
      if (!hasFeatureAccess(user, 'customization')) {
        return new NextResponse(
          JSON.stringify({ error: 'Feature not available in your plan' }),
          { status: 403 }
        );
      }
    }

    const response = NextResponse.next();
    const planLimits = getCurrentPlanLimits(user);
    response.headers.set('X-Subscription-Tier', user.subscriptionTier || 'free');
    response.headers.set('X-Daily-Messages-Remaining', planLimits.remaining.dailyMessages.toString());
    response.headers.set('X-Active-Conversations-Remaining', planLimits.remaining.activeConversations.toString());

    return response;
  } catch (error) {
    console.error('Subscription middleware error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

export const config = {
  matcher: [
    '/api/chat/:path*',
    '/api/export/:path*',
    '/api/customization/:path*'
  ]
}; 