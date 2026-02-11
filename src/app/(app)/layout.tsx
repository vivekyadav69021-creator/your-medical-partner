'use client';

import MainLayout from '@/components/layout/main-layout';
import { CartProvider } from '@/context/cart-context';
import { UserProfileProvider } from '@/context/user-profile-context';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SplashScreen } from '@/components/splash-screen';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait for initial user loading to complete.
    if (isUserLoading) {
      return;
    }

    // If no user is logged in, redirect to the login page.
    if (!user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  // While loading or if there's no user, show a splash screen.
  if (isUserLoading || !user) {
    return <SplashScreen />;
  }
  
  // Once user is confirmed, render the main application layout.
  return (
    <UserProfileProvider>
      <CartProvider>
        <MainLayout>{children}</MainLayout>
      </CartProvider>
    </UserProfileProvider>
  );
}
