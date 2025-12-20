
import { NextRequest, NextResponse } from 'next/server';
import { getTokens } from 'next-firebase-auth-edge/lib/next/tokens';
import { cookies } from 'next/headers';
import { auth } from '@/firebase-server';

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  try {
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    cookies().set('token', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
      path: '/',
    });
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Session cookie creation failed:', error);
    return NextResponse.json({ status: 'error' }, { status: 401 });
  }
}
