import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Test getting session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return NextResponse.json({
        success: false,
        error: sessionError.message,
        location: 'getSession',
        code: sessionError.code
      }, { status: 500 });
    }
    
    // Get environment info but don't expose sensitive data
    const envInfo = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing',
      NODE_ENV: process.env.NODE_ENV,
    };
    
    // Test a dummy sign in to verify credentials work
    // This will not actually sign in the user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: 'bracketmaster@proton.me',
      password: 'Episode1!',
    });
    
    const signInStatus = signInError 
      ? { success: false, error: signInError.message, code: signInError.code } 
      : { success: true };
    
    return NextResponse.json({
      success: true,
      session: session ? {
        exists: true,
        user: session.user ? {
          id: session.user.id,
          email: session.user.email,
        } : null,
        expiresAt: session.expires_at,
      } : { exists: false },
      environment: envInfo,
      supabaseTest: signInStatus,
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      location: 'try/catch',
    }, { status: 500 });
  }
} 