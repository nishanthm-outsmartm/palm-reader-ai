import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RateLimiter } from 'limiter';

// Create a Map to store rate limiters for each IP
const limiters = new Map<string, RateLimiter>();

export async function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const ip = request.ip ?? '127.0.0.1';
    
    // Get or create a rate limiter for this IP
    let limiter = limiters.get(ip);
    if (!limiter) {
      limiter = new RateLimiter({
        tokensPerInterval: 10,
        interval: 'minute',
        fireImmediately: true,
      });
      limiters.set(ip, limiter);
    }

    // Apply rate limiting
    const remaining = await limiter.removeTokens(1);
    
    if (remaining < 0) {
      return new NextResponse(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Adjust this for production
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Apply CORS
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust this for production
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  }
}

export const config = {
  matcher: '/api/:path*',
};