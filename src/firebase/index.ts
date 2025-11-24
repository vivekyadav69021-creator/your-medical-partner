
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (!getApps().length) {
    const firebaseApp = initializeApp(firebaseConfig);
    return getSdks(firebaseApp);
  }
  // If already initialized, return the SDKs with the already initialized App
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
// non-blocking-login is not used and can be removed if desired
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

// This file is the single source of truth for Firebase client-side services.
// It should be used in client components to access Firebase.
// Example: import { useUser, useFirestore, useAuth } from '@/firebase';

// Re-export `useUser` from provider, but specifically for client components
import { useUser as useUserFromProvider } from './provider';
export const useUser = useUserFromProvider;
