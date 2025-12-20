
'use server';

import { getFirebaseAuth } from 'next-firebase-auth-edge/lib/auth';
import { cookies } from 'next/headers';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { z } from 'zod';
import { auth } from '@/firebase-server';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

async function handleAuth(
  formData: FormData,
  authFn: typeof createUserWithEmailAndPassword | typeof signInWithEmailAndPassword
) {
  const validatedFields = authSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      error:
        validatedFields.error.flatten().fieldErrors.email?.[0] ??
        validatedFields.error.flatten().fieldErrors.password?.[0] ??
        'Invalid input.',
      success: false,
    };
  }

  try {
    const userCredential = await authFn(
      auth,
      validatedFields.data.email,
      validatedFields.data.password
    );

    const tokens = await userCredential.user.getIdTokenResult();
    cookies().set('token', tokens.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { error: null, success: true };
  } catch (e: any) {
    let errorMessage = 'An unknown error occurred.';
    if (e.code) {
      switch (e.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            errorMessage = 'Invalid email or password.';
            break;
        case 'auth/too-many-requests':
            errorMessage = 'Too many attempts. Please try again later.';
            break;
        default:
          errorMessage = e.message;
          break;
      }
    }
    return { error: errorMessage, success: false };
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  return handleAuth(formData, signInWithEmailAndPassword);
}

export async function signupAction(prevState: any, formData: FormData) {
  return handleAuth(formData, createUserWithEmailAndPassword);
}
