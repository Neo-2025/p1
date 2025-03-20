import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Get URL information
  const requestUrl = new URL(req.url);
  const isAuthRoute = requestUrl.pathname.startsWith('/auth');
  const isDashboardRoute = requestUrl.pathname === '/dashboard';
  const isSubscriptionRoute = requestUrl.pathname === '/subscription';

  // Redirect to static HTML files for these routes
  if (isDashboardRoute) {
    return NextResponse.redirect(new URL('/dashboard.html', req.url));
  }

  if (isSubscriptionRoute) {
    return NextResponse.redirect(new URL('/subscription.html', req.url));
  }

  // For all other protected routes, perform auth checks
  try {
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    // Check session for nested dashboard routes
    if (!session && requestUrl.pathname.startsWith('/dashboard/')) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    if (session && isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard.html', req.url));
    }
  } catch (error) {
    console.error('Middleware error:', error);
    // Fall back to allowing the request through on errors
    return res;
  }

  return res;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // CURRENT: Protected routes for single user
    '/dashboard',
    '/dashboard/:path*',
    '/subscription',
    '/subscription/:path*',
    '/auth/:path*',

    // FUTURE ROUTES:
    // '/api/protected/:path*',
    // '/admin/:path*',
    // '/settings/:path*',
    // '/organization/:path*',
  ],
}; 