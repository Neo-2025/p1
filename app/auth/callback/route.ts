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
  
  // Get the site URL from the request or environment
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 
                  process.env.VERCEL_URL ? 
                  `https://${process.env.VERCEL_URL}` : 
                  requestUrl.origin;
  
  // If there's an error, redirect to login with the error
  if (error) {
    const errorMsg = errorDescription || 'Authentication failed';
    return NextResponse.redirect(
      `${baseUrl}/auth/login?error=${encodeURIComponent(errorMsg)}`
    );
  }
  
  // If there's no code, this is not a valid callback
  if (!code) {
    return NextResponse.redirect(`${baseUrl}/auth/login`);
  }
  
  try {
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies });
    
    // Exchange the code for a session (works for both OAuth and magic links)
    await supabase.auth.exchangeCodeForSession(code);
    
    // Redirect to dashboard after successful login
    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (error) {
    console.error('Error processing authentication callback:', error);
    
    // Redirect to login page with error
    return NextResponse.redirect(
      `${baseUrl}/auth/login?error=Authentication+failed`
    );
  }
} 