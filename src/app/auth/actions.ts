
'use server';

import {
  Auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { redirect } from 'next/navigation';
import { signOut as firebaseSignOut } from 'firebase/auth';


// This function is for server-side initialization, which is limited in this context.
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


export async function logout() {
  // This function is safe to run on the server.
  try {
    const auth = await getFirebaseAuth();
    await firebaseSignOut(auth);
  } catch (e) {
    console.error("Error signing out: ", e);
  }
  redirect('/login');
}
