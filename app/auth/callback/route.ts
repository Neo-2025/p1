import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This route handles the callback from Supabase Auth when using magic links.
 * When a user clicks the magic link in their email, they'll be redirected to this route.
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // If there's no code, this is not a valid magic link callback
  if (!code) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  try {
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code);
    
    // Redirect to dashboard after successful login
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Error processing magic link:', error);
    
    // Redirect to login page with error
    return NextResponse.redirect(
      new URL('/auth/login?error=Could+not+authenticate+with+magic+link', request.url)
    );
  }
} 