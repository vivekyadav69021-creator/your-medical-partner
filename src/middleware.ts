
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Allow access to public paths
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // For all other paths, we will rely on client-side checks.
  // This middleware becomes a simple pass-through for non-public routes.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\.).*)'],
};
