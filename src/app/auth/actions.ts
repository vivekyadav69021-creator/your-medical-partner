'use server';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { redirect } from 'next/navigation';

async function getFirebaseAuth() {
  const { auth } = initializeFirebase();
  return auth;
}

export async function signUpWithEmail(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Please enter a valid email and password.' };
  }

  try {
    const auth = await getFirebaseAuth();
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (e: any) {
    return { message: e.message };
  }
  redirect('/dashboard');
}

export async function signInWithEmail(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Please enter a valid email and password.' };
  }
  try {
    const auth = await getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e: any) {
    if (e.code === 'auth/invalid-credential') {
      return { message: 'Invalid email or password.' };
    }
    return { message: 'An unknown error occurred.' };
  }
  redirect('/dashboard');
}

export async function signInWithGoogle() {
  try {
    const auth = await getFirebaseAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  } catch (e: any) {
    console.error(e);
    return { message: e.message };
  }
  redirect('/dashboard');
}

export async function logout() {
  const auth = await getFirebaseAuth();
  await signOut(auth);
  redirect('/login');
}

    