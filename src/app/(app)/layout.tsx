
'use client';

import MainLayout from '@/components/layout/main-layout';
import { CartProvider } from '@/context/cart-context';
import { UserProfileProvider } from '@/context/user-profile-context';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';
import { doc } from 'firebase/firestore';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid, 'userProfiles', user.uid) : null),
    [user, firestore]
  );

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<{ onboardingCompleted?: boolean }>(userProfileRef);

  useEffect(() => {
    // Wait for initial user loading to complete.
    if (isUserLoading) {
      return;
    }

    // If no user is logged in, redirect to the login page.
    if (!user) {
      router.replace('/login');
      return;
    }
    
    // If user is authenticated, but we are still loading their profile, wait.
    if (isProfileLoading) {
        return;
    }

    // Once profile is loaded, check the onboarding status.
    // If onboarding is not completed (or the profile doesn't exist yet), redirect.
    if (!userProfile?.onboardingCompleted) {
      router.replace('/onboarding');
    }

  }, [user, isUserLoading, userProfile, isProfileLoading, router]);

  // Determine if we are in a state to render the main app content.
  const canRenderContent = user && userProfile?.onboardingCompleted;

  // While loading or redirecting, show the splash screen to prevent UI flickering.
  if (!canRenderContent) {
    return <SplashScreen />;
  }
  
  // Once everything is loaded and verified, render the main application layout.
  return (
    <UserProfileProvider>
      <CartProvider>
        <MainLayout>{children}</MainLayout>
      </CartProvider>
    </UserProfileProvider>
  );
}
