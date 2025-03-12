import { IUser } from '@/models/User';
import { SUBSCRIPTION_PLANS, getSubscriptionPlan, type SubscriptionTier } from './subscription-plans';

/**
 * Check if the user has reached their daily message limit
 */
export const hasReachedDailyMessageLimit = (user: IUser): boolean => {
  const plan = getSubscriptionPlan(user.subscriptionTier as SubscriptionTier || 'free');
  
  // Reset counter if it's a new day
  const today = new Date();
  const lastMessageDate = user.lastMessageDate ? new Date(user.lastMessageDate) : null;
  if (!lastMessageDate || lastMessageDate.getDate() !== today.getDate()) {
    return false;
  }

  return (user.dailyMessageCount || 0) >= plan.limits.messagesPerDay;
};

/**
 * Check if the user has reached their active conversations limit
 */
export const hasReachedActiveConversationsLimit = (user: IUser): boolean => {
  const plan = getSubscriptionPlan(user.subscriptionTier as SubscriptionTier || 'free');
  return (user.activeConversations || 0) >= plan.limits.maxActiveConversations;
};

/**
 * Check if the user has access to a specific feature
 */
export const hasFeatureAccess = (user: IUser, feature: keyof typeof SUBSCRIPTION_PLANS.FREE.limits.features): boolean => {
  const plan = getSubscriptionPlan(user.subscriptionTier as SubscriptionTier || 'free');
  const featureAccess = plan.limits.features[feature];
  return featureAccess === true || (typeof featureAccess === 'object' && featureAccess.enabled === true);
};

/**
 * Update user usage counters
 */
export const updateUserUsage = async (user: IUser & { save: () => Promise<void> }): Promise<void> => {
  const today = new Date();
  const lastMessageDate = user.lastMessageDate ? new Date(user.lastMessageDate) : null;

  // Reset counter for new day
  if (!lastMessageDate || lastMessageDate.getDate() !== today.getDate()) {
    user.dailyMessageCount = 1;
  } else {
    user.dailyMessageCount = (user.dailyMessageCount || 0) + 1;
  }

  user.lastMessageDate = today;
  await user.save();
};

/**
 * Check if the user has an active subscription
 */
export const hasActiveSubscription = (user: IUser): boolean => {
  return user.subscriptionStatus === 'active' && 
         (!user.subscriptionEnd || new Date(user.subscriptionEnd) > new Date());
};

/**
 * Get current plan limits for the user
 */
export const getCurrentPlanLimits = (user: IUser) => {
  const plan = getSubscriptionPlan(user.subscriptionTier as SubscriptionTier || 'free');
  return {
    dailyMessageLimit: plan.limits.messagesPerDay,
    maxActiveConversations: plan.limits.maxActiveConversations,
    maxResponseLength: plan.limits.maxResponseLength,
    features: plan.limits.features,
    remaining: {
      dailyMessages: plan.limits.messagesPerDay - (user.dailyMessageCount || 0),
      activeConversations: plan.limits.maxActiveConversations - (user.activeConversations || 0)
    }
  };
}; 