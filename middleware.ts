import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // CURRENT: Simple session check for single user
  const { data: { session } } = await supabase.auth.getSession();

  // Get URL information
  const requestUrl = new URL(req.url);
  const isAuthRoute = requestUrl.pathname.startsWith('/auth');
  const isDashboardRoute = requestUrl.pathname.startsWith('/dashboard');
  const isSubscriptionRoute = requestUrl.pathname.startsWith('/subscription');

  // FUTURE AUTH EXPANSION:
  // 1. Role-based access control
  // session?.user.user_metadata.role
  
  // 2. Multi-tenant support
  // session?.user.user_metadata.organization_id
  
  // 3. Custom claims verification
  // session?.user.app_metadata.permissions
  
  // 4. OAuth provider handling
  // session?.provider_token
  
  // 5. Token refresh logic
  // await supabase.auth.refreshSession()
  
  // 6. Rate limiting
  // implement token bucket algorithm
  
  // 7. API key authentication
  // check req.headers for API keys

  // Current simple logic: Single user check
  if (!session && (isDashboardRoute || isSubscriptionRoute)) {
    // FUTURE: Add return URL for post-login redirect
    // const returnUrl = encodeURIComponent(requestUrl.pathname);
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // CURRENT: Protected routes for single user
    '/dashboard/:path*',
    '/subscription/:path*',
    '/auth/:path*',

    // FUTURE ROUTES:
    // '/api/protected/:path*',
    // '/admin/:path*',
    // '/settings/:path*',
    // '/organization/:path*',
  ],
}; 