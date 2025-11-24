
'use server';

import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { redirect } from 'next/navigation';

function initializeFirebaseOnServer(): { auth: Auth } {
  if (!getApps().length) {
    const firebaseApp = initializeApp(firebaseConfig);
    return { auth: getAuth(firebaseApp) };
  }
  const firebaseApp = getApp();
  return { auth: getAuth(firebaseApp) };
}

async function getFirebaseAuth() {
  const { auth } = initializeFirebaseOnServer();
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
  // This function will be called on the client side after the fix.
  // For now, we leave it as is, but it will be wrapped in a client component action.
  // The server-side logic for Google Sign-In is more complex and typically handled
  // via client-side popups. I will adjust the calling components to handle this.
  redirect('/dashboard');
}

export async function logout() {
  const auth = await getFirebaseAuth();
  await signOut(auth);
  redirect('/login');
}
