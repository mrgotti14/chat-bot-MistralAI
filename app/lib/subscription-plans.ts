export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Découverte',
    tier: 'free',
    limits: {
      messagesPerDay: parseInt(process.env.DEFAULT_DAILY_MESSAGE_LIMIT || '20'),
      maxResponseLength: 12000,  // ~3000 tokens - allows for a complete story
      maxActiveConversations: parseInt(process.env.DEFAULT_MAX_ACTIVE_CONVERSATIONS || '1'),
      features: {
        export: false,
        customization: false,
        api: false,
        prioritySupport: false
      }
    }
  },
  PRO: {
    name: 'Pro',
    tier: 'pro',
    limits: {
      messagesPerDay: parseInt(process.env.PRO_DAILY_MESSAGE_LIMIT || '150'),
      maxResponseLength: 40000,  // ~10000 tokens - detailed stories
      maxActiveConversations: parseInt(process.env.PRO_MAX_ACTIVE_CONVERSATIONS || '5'),
      features: {
        export: true,
        customization: true,
        api: {
          enabled: true,
          rateLimit: 1000 // requests per month
        },
        prioritySupport: false
      }
    }
  },
  BUSINESS: {
    name: 'Entreprise',
    tier: 'business',
    limits: {
      messagesPerDay: parseInt(process.env.BUSINESS_DAILY_MESSAGE_LIMIT || '-1'), // unlimited
      maxResponseLength: 100000, // ~25000 tokens - virtually unlimited
      maxActiveConversations: parseInt(process.env.BUSINESS_MAX_ACTIVE_CONVERSATIONS || '-1'), // unlimited
      features: {
        export: true,
        customization: true,
        api: {
          enabled: true,
          rateLimit: -1 // unlimited
        },
        prioritySupport: true
      }
    }
  }
};

export type SubscriptionTier = 'free' | 'pro' | 'business';

export function getSubscriptionPlan(tier: SubscriptionTier) {
  switch (tier) {
    case 'free':
      return SUBSCRIPTION_PLANS.FREE;
    case 'pro':
      return SUBSCRIPTION_PLANS.PRO;
    case 'business':
      return SUBSCRIPTION_PLANS.BUSINESS;
    default:
      return SUBSCRIPTION_PLANS.FREE;
  }
}

export function hasFeatureAccess(tier: SubscriptionTier, feature: keyof typeof SUBSCRIPTION_PLANS.FREE.limits.features): boolean {
  const plan = getSubscriptionPlan(tier);
  return plan.limits.features[feature] === true || 
         (typeof plan.limits.features[feature] === 'object' && plan.limits.features[feature].enabled === true);
}

export function getLimit(tier: SubscriptionTier, limit: keyof typeof SUBSCRIPTION_PLANS.FREE.limits): number {
  const plan = getSubscriptionPlan(tier);
  const value = plan.limits[limit];
  return typeof value === 'number' ? value : -1;
} 