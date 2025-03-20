import { SubscriptionPlan } from '@/types/subscription';

// Define the feature sets for different tiers
const features = {
  free: {
    maxProjects: 3,
    maxCollaborators: 1,
    maxStorage: 5,
    advancedAnalytics: false,
    prioritySupport: false,
    customDomain: false,
    apiAccess: false,
    whiteLabeling: false
  },
  basic: {
    maxProjects: 10,
    maxCollaborators: 5,
    maxStorage: 20,
    advancedAnalytics: false,
    prioritySupport: false,
    customDomain: false,
    apiAccess: true,
    whiteLabeling: false
  },
  pro: {
    maxProjects: 50,
    maxCollaborators: 20,
    maxStorage: 100,
    advancedAnalytics: true,
    prioritySupport: true,
    customDomain: true,
    apiAccess: true,
    whiteLabeling: false
  },
  enterprise: {
    maxProjects: 1000,
    maxCollaborators: 100,
    maxStorage: 500,
    advancedAnalytics: true,
    prioritySupport: true,
    customDomain: true,
    apiAccess: true,
    whiteLabeling: true
  }
};

// Define all subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'price_free_monthly',
    name: 'Freemium',
    description: 'Basic features for personal use',
    tier: 'free',
    price: 0,
    interval: 'monthly',
    features: features.free,
    isPopular: false,
    isAvailable: true
  },
  {
    id: 'price_basic_monthly',
    name: 'Basic',
    description: 'Essential features for small teams',
    tier: 'basic',
    price: 1900, // $19.00
    interval: 'monthly',
    features: features.basic,
    isPopular: false,
    isAvailable: false // Not available yet
  },
  {
    id: 'price_pro_monthly',
    name: 'Professional',
    description: 'Advanced features for growing businesses',
    tier: 'pro',
    price: 4900, // $49.00
    interval: 'monthly',
    features: features.pro,
    isPopular: true,
    isAvailable: false // Not available yet
  },
  {
    id: 'price_enterprise_monthly',
    name: 'Enterprise',
    description: 'Complete solution for large organizations',
    tier: 'enterprise',
    price: 9900, // $99.00
    interval: 'monthly',
    features: features.enterprise,
    isPopular: false,
    isAvailable: false // Not available yet
  },
  // Yearly plans (usually with discount)
  {
    id: 'price_basic_yearly',
    name: 'Basic',
    description: 'Essential features for small teams',
    tier: 'basic',
    price: 19000, // $190.00 (equivalent to 10 months)
    interval: 'yearly',
    features: features.basic,
    isPopular: false,
    isAvailable: false // Not available yet
  },
  {
    id: 'price_pro_yearly',
    name: 'Professional',
    description: 'Advanced features for growing businesses',
    tier: 'pro',
    price: 49000, // $490.00 (equivalent to 10 months)
    interval: 'yearly',
    features: features.pro,
    isPopular: false,
    isAvailable: false // Not available yet
  },
  {
    id: 'price_enterprise_yearly',
    name: 'Enterprise',
    description: 'Complete solution for large organizations',
    tier: 'enterprise',
    price: 99000, // $990.00 (equivalent to 10 months)
    interval: 'yearly',
    features: features.enterprise,
    isPopular: false,
    isAvailable: false // Not available yet
  }
];

// Helper to get available plans
export function getAvailablePlans(): SubscriptionPlan[] {
  return subscriptionPlans.filter(plan => plan.isAvailable);
}

// Helper to get a plan by ID
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return subscriptionPlans.find(plan => plan.id === planId);
}

// Helper to get the free plan
export function getFreePlan(): SubscriptionPlan {
  return subscriptionPlans.find(plan => plan.tier === 'free' && plan.interval === 'monthly')!;
} 