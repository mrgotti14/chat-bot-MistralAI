import { IUser } from '@/models/User';
import { SUBSCRIPTION_PLANS, getSubscriptionPlan, type SubscriptionTier } from './subscription-plans';

/**
 * Check if the user has reached their daily message limit
 * Resets counter if it's a new day
 * 
 * @param {IUser} user - The user to check
 * @returns {boolean} True if limit is reached, false otherwise
 */
export const hasReachedDailyMessageLimit = (user: IUser): boolean => {
  const plan = getSubscriptionPlan(user.subscriptionTier as SubscriptionTier || 'free');
  const messageCount = user.dailyMessageCount || 0;
  
  const today = new Date();
  const lastMessageDate = user.lastMessageDate ? new Date(user.lastMessageDate) : null;
  
  /**
   * Check if it's a new day by comparing complete dates
   */
  if (!lastMessageDate || 
      lastMessageDate.getDate() !== today.getDate() ||
      lastMessageDate.getMonth() !== today.getMonth() ||
      lastMessageDate.getFullYear() !== today.getFullYear()) {
    return false;
  }

  return messageCount >= plan.limits.messagesPerDay;
};

/**
 * Check if the user has reached their active conversations limit
 * 
 * @param {IUser} user - The user to check
 * @returns {boolean} True if limit is reached, false otherwise
 */
export const hasReachedActiveConversationsLimit = (user: IUser): boolean => {
  const plan = getSubscriptionPlan(user.subscriptionTier as SubscriptionTier || 'free');
  return (user.activeConversations || 0) >= plan.limits.maxActiveConversations;
};

/**
 * Check if the user has access to a specific feature
 * 
 * @param {IUser} user - The user to check
 * @param {keyof typeof SUBSCRIPTION_PLANS.FREE.limits.features} feature - The feature to check
 * @returns {boolean} True if user has access to the feature, false otherwise
 */
export const hasFeatureAccess = (user: IUser, feature: keyof typeof SUBSCRIPTION_PLANS.FREE.limits.features): boolean => {
  const plan = getSubscriptionPlan(user.subscriptionTier as SubscriptionTier || 'free');
  const featureAccess = plan.limits.features[feature];
  return featureAccess === true || (typeof featureAccess === 'object' && featureAccess.enabled === true);
};

/**
 * Update user usage counters
 * Handles daily message count and last message date
 * Resets counter on new day
 * 
 * @param {IUser & { save: () => Promise<void> }} user - The user to update
 * @returns {Promise<void>}
 */
export const updateUserUsage = async (user: IUser & { save: () => Promise<void> }): Promise<void> => {
  const today = new Date();
  const lastMessageDate = user.lastMessageDate ? new Date(user.lastMessageDate) : null;
  const plan = getSubscriptionPlan(user.subscriptionTier as SubscriptionTier || 'free');

  if (hasReachedDailyMessageLimit(user)) {
    return;
  }

  if (!lastMessageDate || 
      lastMessageDate.getDate() !== today.getDate() ||
      lastMessageDate.getMonth() !== today.getMonth() ||
      lastMessageDate.getFullYear() !== today.getFullYear()) {
    user.dailyMessageCount = 1;
  } else {
    user.dailyMessageCount = (user.dailyMessageCount || 0) + 1;
  }

  user.lastMessageDate = today;
  await user.save();
};

/**
 * Check if the user has an active subscription
 * Verifies subscription status and expiration date
 * 
 * @param {IUser} user - The user to check
 * @returns {boolean} True if subscription is active, false otherwise
 */
export const hasActiveSubscription = (user: IUser): boolean => {
  return user.subscriptionStatus === 'active' && 
         (!user.subscriptionEnd || new Date(user.subscriptionEnd) > new Date());
};

/**
 * Get current plan limits for the user
 * Includes daily message limit, active conversations limit,
 * response length limit, features, and remaining counts
 * 
 * @param {IUser} user - The user to get limits for
 * @returns {Object} Object containing all plan limits and remaining counts
 */
export const getCurrentPlanLimits = (user: IUser) => {
  const plan = getSubscriptionPlan(user.subscriptionTier as SubscriptionTier || 'free');
  const messageCount = user.dailyMessageCount || 0;
  
  const remainingMessages = Math.max(0, plan.limits.messagesPerDay - messageCount);
  const remainingConversations = Math.max(0, plan.limits.maxActiveConversations - (user.activeConversations || 0));
  
  return {
    dailyMessageLimit: plan.limits.messagesPerDay,
    maxActiveConversations: plan.limits.maxActiveConversations,
    maxResponseLength: plan.limits.maxResponseLength,
    features: plan.limits.features,
    remaining: {
      dailyMessages: remainingMessages,
      activeConversations: remainingConversations
    }
  };
}; 