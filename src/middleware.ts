
import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from 'next-firebase-auth-edge';
import { firebaseConfig } from './firebase/config';

const PUBLIC_PATHS = ['/login', '/signup', '/'];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    loginPath: '/login',
    logoutPath: '/api/logout',
    apiKey: firebaseConfig.apiKey,
    cookieName: 'token',
    cookieSignatureKeys: ['secret1', 'secret2'], // Replace with your own secrets
    cookieSerializeOptions: {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 12 * 60 * 60 * 24, // 12 days
    },
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!,
    },
    handleInvalidToken: async () => {
        // This is the default behavior.
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('token');
        return response;
    },
    handleValidToken: async ({ token, decodedToken }, headers) => {
        if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        return NextResponse.next({
            request: {
                headers
            }
        });
    },
    handleError: async (error) => {
        console.error('Auth Middleware Error:', error);
        // This is the default behavior.
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('token');
        return response;
    }
  });
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico|api|.*\\.).*)'],
};
