import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/checkout',
    '/success',
    '/terms',
    '/privacy',
    '/refund',
    '/auth',
    '/api/webhooks/stripe'
  ];

  // Routes that should be client-only and not statically generated
  const dynamicRoutes = [
    '/dashboard/my-accounts',
    '/dashboard/my-accounts/',
    '/dashboard/trading-arena',
    '/dashboard/trading-arena/'
  ];

  // If it's a dynamic route, set no-cache headers
  if (dynamicRoutes.includes(pathname)) {
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    response.headers.set('cache-control', 'no-store, max-age=0');
    
    // Return the response if it's already authenticated
    if (authCookie) return response;
  }

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Protected API routes
  if (pathname.startsWith('/api/')) {
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Protected pages
  if (!authCookie) {
    const loginUrl = new URL('/auth', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/webhooks/stripe (webhook requests)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /robots.txt (static files)
     */
    '/((?!api/webhooks/stripe|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
}; 