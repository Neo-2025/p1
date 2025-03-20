const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🌱 Preparing to seed database...');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log('🔗 Supabase URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  try {
    console.log('🔍 Checking if user already exists...');
    
    // Try to find existing user
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error('❌ Error checking users:', listError.message);
      throw listError;
    }
    
    const existingUser = existingUsers.users.find(u => u.email === 'bracketmaster@proton.me');
    
    if (existingUser) {
      console.log('🔄 User already exists, updating password...');
      
      // Update existing user
      const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { 
          password: 'Episode1!',
          email_confirm: true,
          user_metadata: {
            full_name: 'Bracket Master',
            role: 'admin'
          }
        }
      );
      
      if (updateError) {
        console.error('❌ Error updating user:', updateError.message);
        throw updateError;
      }
      
      console.log('✅ User updated successfully:', updatedUser.user.email);
    } else {
      console.log('➕ Creating new user...');
      
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: 'bracketmaster@proton.me',
        password: 'Episode1!',
        email_confirm: true,
        user_metadata: {
          full_name: 'Bracket Master',
          role: 'admin'
        }
      });
      
      if (createError) {
        console.error('❌ Error creating user:', createError.message);
        throw createError;
      }
      
      console.log('✅ User created successfully:', newUser.user.email);
      
      // Create user profile in public schema
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: newUser.user.id,
          email: 'bracketmaster@proton.me',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error('❌ Error creating profile:', profileError.message);
        throw profileError;
      }
      
      console.log('✅ User profile created');
    }
    
    // Verify the user can sign in
    console.log('🔐 Testing sign in...');
    
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: 'bracketmaster@proton.me',
      password: 'Episode1!'
    });
    
    if (signInError) {
      console.error('❌ Sign in test failed:', signInError.message);
      throw signInError;
    }
    
    console.log('✅ Sign in test successful');
    console.log('✅ Database seeding completed successfully');
    
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedDatabase(); 