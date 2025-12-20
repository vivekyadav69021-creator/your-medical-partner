
import { NextRequest, NextResponse } from 'next/server';

// This middleware is now a pass-through.
// All auth logic has been moved to the client-side.
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico|api|.*\\.).*)'],
};
