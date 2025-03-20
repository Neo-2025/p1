const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing environment variables. Please check your .env.local file.');
  console.log('Required variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

console.log('🔑 Environment variables found');

// Create Supabase client with anon key (public client)
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

async function testAuth() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test connection
    const { data: connectionTest, error: connectionError } = await supabase.from('profiles').select('count').limit(1);
    
    if (connectionError) {
      console.error('❌ Connection test failed:', connectionError.message);
      return;
    }
    
    console.log('✅ Connection to Supabase successful');
    
    // Check if our test user exists
    console.log('🔍 Checking if test user exists...');
    
    const { data: user, error: userError } = await adminClient.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Failed to list users:', userError.message);
      return;
    }
    
    const testUser = user.users.find(u => u.email === 'bracketmaster@proton.me');
    
    if (testUser) {
      console.log('✅ Test user found:', testUser.email);
    } else {
      console.log('❌ Test user not found. Running seed script...');
      
      // Create test user
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email: 'bracketmaster@proton.me',
        password: 'Episode1!',
        email_confirm: true,
        user_metadata: {
          full_name: 'Bracket Master',
          role: 'admin'
        }
      });
      
      if (createError) {
        console.error('❌ Failed to create test user:', createError.message);
        return;
      }
      
      console.log('✅ Test user created:', newUser.user.email);
    }
    
    // Test sign in
    console.log('🔑 Testing sign in with test user...');
    
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'bracketmaster@proton.me',
      password: 'Episode1!'
    });
    
    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message);
      return;
    }
    
    console.log('✅ Sign in successful!');
    console.log('🔒 Session:', signInData.session ? 'Valid' : 'Invalid');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

testAuth(); 