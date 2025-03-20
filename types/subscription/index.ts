// Subscription tier identifiers
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

// Feature flags for subscription tiers
export interface SubscriptionFeatures {
  maxProjects: number;
  maxCollaborators: number;
  maxStorage: number; // in GB
  advancedAnalytics: boolean;
  prioritySupport: boolean;
  customDomain: boolean;
  apiAccess: boolean;
  whiteLabeling: boolean;
}

// Subscription plan structure
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  price: number; // in cents
  interval: 'monthly' | 'yearly';
  features: SubscriptionFeatures;
  isPopular?: boolean;
  isAvailable: boolean; // Whether the plan is available for selection
}

// User subscription status
export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  tier: SubscriptionTier;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Billing information
export interface BillingInfo {
  customerId: string;
  email: string;
  name?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  paymentMethod?: {
    id: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
}

// Subscription management actions
export type SubscriptionAction = 
  | 'upgrade'
  | 'downgrade'
  | 'cancel'
  | 'reactivate'
  | 'update_payment'
  | 'update_billing_info'; 