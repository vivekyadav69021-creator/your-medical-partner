
'use server';
import { getFirebaseAuth } from 'next-firebase-auth-edge/lib/auth';
import { cookies } from 'next/headers';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const { auth } = getFirebaseAuth({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  cookieName: 'token',
  cookieSignatureKeys: ['secret1', 'secret2'],
  cookieSerializeOptions: {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 12 * 60 * 60 * 24, // 12 days
  },
  serviceAccount: {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!,
  },
});

export const handleLogin = async (idToken: string) => {
  const tokens = await getTokens(idToken, {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    serviceAccount: {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!,
    },
  });

  cookies().set('token', tokens.token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 12 * 60 * 60 * 24,
  });
};
