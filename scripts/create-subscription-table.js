require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

// Create Supabase client with service role key (admin access)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSubscriptionTable() {
  console.log('Creating user_subscriptions table...');

  // Create the user_subscriptions table if it doesn't exist
  const { error } = await supabase.rpc('create_subscription_table');

  if (error) {
    console.error('Error creating table through RPC:', error);
    
    // Fall back to manual SQL execution if RPC isn't available
    console.log('Attempting to create table with SQL query...');
    
    // Execute SQL to create the subscription table
    const { error: sqlError } = await supabase.from('_exec_sql').select('*').eq('query', `
      CREATE TABLE IF NOT EXISTS public.user_subscriptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        plan_id TEXT NOT NULL,
        tier TEXT NOT NULL CHECK (tier IN ('free', 'basic', 'pro', 'enterprise')),
        status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
        current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
        current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
        cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        
        UNIQUE(user_id)
      );
      
      -- Add index for faster lookups
      CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
      
      -- Create RLS policies
      ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
      
      -- Create policy for users to read their own subscription
      CREATE POLICY "Users can view their own subscription"
        ON public.user_subscriptions
        FOR SELECT
        USING (auth.uid() = user_id);
        
      -- Only allow server-side operations to insert/update/delete
      CREATE POLICY "Only server can insert subscriptions"
        ON public.user_subscriptions
        FOR INSERT
        USING (false);
        
      CREATE POLICY "Only server can update subscriptions"
        ON public.user_subscriptions
        FOR UPDATE
        USING (false);
        
      CREATE POLICY "Only server can delete subscriptions"
        ON public.user_subscriptions
        FOR DELETE
        USING (false);
    `);
    
    if (sqlError) {
      console.error('Error creating table with SQL query:', sqlError);
      process.exit(1);
    }
  }
  
  console.log('Successfully created user_subscriptions table and policies!');
}

// Run the migration
createSubscriptionTable()
  .catch(error => {
    console.error('Error in migration:', error);
    process.exit(1);
  }); 