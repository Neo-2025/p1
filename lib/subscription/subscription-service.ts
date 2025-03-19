import { SupabaseClient } from '@supabase/supabase-js';
import { UserSubscription, SubscriptionTier } from '@/types/subscription';
import { getFreePlan, getPlanById } from './plans';

export interface SubscriptionService {
  getUserSubscription(userId: string): Promise<UserSubscription | null>;
  createFreeSubscription(userId: string): Promise<UserSubscription>;
  updateSubscription(subscriptionId: string, data: Partial<UserSubscription>): Promise<UserSubscription>;
}

export class SupabaseSubscriptionService implements SubscriptionService {
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Get a user's subscription details
   */
  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    const { data, error } = await this.supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    return this.mapSubscriptionData(data);
  }

  /**
   * Create a free subscription for a new user
   */
  async createFreeSubscription(userId: string): Promise<UserSubscription> {
    const freePlan = getFreePlan();
    const now = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 100); // Essentially "forever" for free tier

    const subscriptionData = {
      user_id: userId,
      plan_id: freePlan.id,
      tier: 'free' as SubscriptionTier,
      status: 'active',
      current_period_start: now.toISOString(),
      current_period_end: endDate.toISOString(),
      cancel_at_period_end: false,
      created_at: now.toISOString(),
      updated_at: now.toISOString()
    };

    const { data, error } = await this.supabase
      .from('user_subscriptions')
      .insert(subscriptionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating free subscription:', error);
      throw new Error('Failed to create subscription');
    }

    return this.mapSubscriptionData(data);
  }

  /**
   * Update an existing subscription
   */
  async updateSubscription(subscriptionId: string, updates: Partial<UserSubscription>): Promise<UserSubscription> {
    const updateData: Record<string, any> = {};

    // Map from camelCase to snake_case for database
    if (updates.planId) updateData.plan_id = updates.planId;
    if (updates.tier) updateData.tier = updates.tier;
    if (updates.status) updateData.status = updates.status;
    if (updates.currentPeriodStart) updateData.current_period_start = updates.currentPeriodStart.toISOString();
    if (updates.currentPeriodEnd) updateData.current_period_end = updates.currentPeriodEnd.toISOString();
    if (updates.cancelAtPeriodEnd !== undefined) updateData.cancel_at_period_end = updates.cancelAtPeriodEnd;
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from('user_subscriptions')
      .update(updateData)
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }

    return this.mapSubscriptionData(data);
  }

  /**
   * Map database snake_case to camelCase TypeScript types
   */
  private mapSubscriptionData(data: any): UserSubscription {
    return {
      id: data.id,
      userId: data.user_id,
      planId: data.plan_id,
      tier: data.tier,
      status: data.status,
      currentPeriodStart: new Date(data.current_period_start),
      currentPeriodEnd: new Date(data.current_period_end),
      cancelAtPeriodEnd: data.cancel_at_period_end,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  /**
   * Check if a user has an active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);
    return !!subscription && subscription.status === 'active';
  }

  /**
   * Get a user's current subscription tier
   */
  async getUserTier(userId: string): Promise<SubscriptionTier> {
    const subscription = await this.getUserSubscription(userId);
    return subscription?.tier || 'free';
  }
} 