import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * This route handles callbacks from Supabase Auth for both OAuth and magic links.
 * For OAuth: When a user signs in with GitHub, they'll be redirected here
 * For magic links: When a user clicks the magic link in their email, they'll be redirected here
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  
  // If there's an error, redirect to login with the error
  if (error) {
    const errorMsg = errorDescription || 'Authentication failed';
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorMsg)}`, request.url)
    );
  }
  
  // If there's no code, this is not a valid callback
  if (!code) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  try {
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the code for a session (works for both OAuth and magic links)
    await supabase.auth.exchangeCodeForSession(code);
    
    // Redirect to dashboard after successful login
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error) {
    console.error('Error processing authentication callback:', error);
    
    // Redirect to login page with error
    return NextResponse.redirect(
      new URL('/auth/login?error=Authentication+failed', request.url)
    );
  }
} 