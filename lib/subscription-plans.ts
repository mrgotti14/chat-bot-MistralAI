export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Découverte',
    tier: 'free',
    limits: {
      messagesPerDay: 20,
      maxResponseLength: 300,
      maxActiveConversations: 1,
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
      messagesPerDay: 150,
      maxResponseLength: 1000,
      maxActiveConversations: 5,
      features: {
        export: true,
        customization: true,
        api: {
          enabled: true,
          rateLimit: 1000 // requêtes par mois
        },
        prioritySupport: false
      }
    }
  },
  BUSINESS: {
    name: 'Entreprise',
    tier: 'business',
    limits: {
      messagesPerDay: -1, // illimité
      maxResponseLength: -1, // illimité
      maxActiveConversations: -1, // illimité
      features: {
        export: true,
        customization: true,
        api: {
          enabled: true,
          rateLimit: -1 // illimité
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