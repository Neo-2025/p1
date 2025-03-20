import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * TEMPORARY WORKAROUND: Static HTML Redirection
 * 
 * This redirection to static HTML files is a temporary solution to bypass 
 * server-side rendering errors in the dashboard and subscription pages.
 * 
 * TODO: Future improvements needed:
 * - Reimplement using Next.js server components once issues are resolved
 * - Add proper authentication checks for these routes
 * - Implement dynamic data fetching for user-specific content
 * - Remove this redirection once a proper solution is in place
 */
export async function middleware(req: NextRequest) {
  // Get URL information
  const requestUrl = new URL(req.url);
  const path = requestUrl.pathname;
  
  // Simple redirects to static HTML files
  if (path === '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard.html', req.url));
  }
  
  if (path === '/subscription') {
    return NextResponse.redirect(new URL('/subscription.html', req.url));
  }
  
  // For other routes, proceed normally
  const res = NextResponse.next();
  
  // Handle auth pages
  const isAuthPage = path.startsWith('/auth');
  
  // Basic session check for protected routes
  if (!isAuthPage && (path.startsWith('/dashboard/') || path.startsWith('/subscription/'))) {
    try {
      const supabase = createMiddlewareClient({ req, res });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
    } catch (error) {
      // If auth check fails, redirect to login
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }
  
  return res;
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/subscription',
    '/subscription/:path*',
    '/auth/:path*',
  ],
}; 