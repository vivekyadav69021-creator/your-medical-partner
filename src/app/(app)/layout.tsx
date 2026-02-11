
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
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) {
      return;
    }

    if (user) {
        if (!userProfile || userProfile.onboardingCompleted !== true) {
            router.replace('/onboarding');
        }
    }
  }, [user, isUserLoading, userProfile, isProfileLoading, router]);

  const shouldShowSplash = isUserLoading || !user || isProfileLoading || (user && (!userProfile || userProfile.onboardingCompleted !== true));

  if (shouldShowSplash) {
    return <SplashScreen />;
  }

  return (
    <UserProfileProvider>
      <CartProvider>
        <MainLayout>{children}</MainLayout>
      </CartProvider>
    </UserProfileProvider>
  );
}
