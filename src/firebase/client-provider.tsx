'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// Extend the Window interface for the global firebase object
declare global {
  interface Window {
    firebase?: {
      app?: any;
      firestore?: any;
      auth?: any;
    };
  }
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    const services = initializeFirebase();
    
    // Bridge for legacy scripts expecting a global firebase object
    if (typeof window !== 'undefined') {
      window.firebase = window.firebase || {};
      window.firebase.app = services.firebaseApp;
      window.firebase.firestore = () => services.firestore;
      window.firebase.auth = () => services.auth;
    }
    
    return services;
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
