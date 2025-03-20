import { SupabaseClient } from '@supabase/supabase-js';
import { SubscriptionService, SupabaseSubscriptionService, InMemorySubscriptionService } from './subscription-service';
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Re-export types and utilities
export * from './plans';

// Flag to control whether to use the database or in-memory implementation
// Set to true to use the database (requires user_subscriptions table)
// Set to false to use the in-memory implementation
const USE_DATABASE = false;

/**
 * Get a subscription service instance for server components
 */
export function getServerSubscriptionService(): SubscriptionService {
  if (USE_DATABASE) {
    const supabase = createServerComponentClient({ cookies });
    return new SupabaseSubscriptionService(supabase);
  } else {
    return new InMemorySubscriptionService();
  }
}

/**
 * Get a subscription service instance for client components
 */
export function getClientSubscriptionService(): SubscriptionService {
  if (USE_DATABASE) {
    const supabase = createClientComponentClient();
    return new SupabaseSubscriptionService(supabase);
  } else {
    return new InMemorySubscriptionService();
  }
}

/**
 * Create a subscription service with a specific Supabase client
 */
export function createSubscriptionService(supabase: SupabaseClient): SubscriptionService {
  if (USE_DATABASE) {
    return new SupabaseSubscriptionService(supabase);
  } else {
    return new InMemorySubscriptionService();
  }
} 