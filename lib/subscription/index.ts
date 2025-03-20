import { SupabaseClient } from '@supabase/supabase-js';
import { SubscriptionService, SupabaseSubscriptionService } from './subscription-service';
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Re-export types and utilities
export * from './plans';

/**
 * Get a subscription service instance for server components
 */
export function getServerSubscriptionService(): SubscriptionService {
  const supabase = createServerComponentClient({ cookies });
  return new SupabaseSubscriptionService(supabase);
}

/**
 * Get a subscription service instance for client components
 */
export function getClientSubscriptionService(): SubscriptionService {
  const supabase = createClientComponentClient();
  return new SupabaseSubscriptionService(supabase);
}

/**
 * Create a subscription service with a specific Supabase client
 */
export function createSubscriptionService(supabase: SupabaseClient): SubscriptionService {
  return new SupabaseSubscriptionService(supabase);
} 