const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');

    // Create single user
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: 'bracketmaster@proton.me',
      password: 'Episode1!',
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: 'Bracket Master',
        role: 'admin'
      }
    });

    if (userError) throw userError;
    console.log('✅ Single user account created');

    // Create user profile in public schema
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: 'bracketmaster@proton.me',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (profileError) throw profileError;
    console.log('✅ User profile created');

    // Keep table structure for future auth expansion
    console.log('ℹ️ Database structure preserved for future auth expansion');

    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seedDatabase(); 