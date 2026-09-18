'use client';

import MainLayout from '@/components/layout/main-layout';
import { CartProvider } from '@/context/cart-context';
import { UserProfileProvider } from '@/context/user-profile-context';
import { SplashScreen } from '@/components/splash-screen';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true); 
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Reduced splash delay from 2.5s to 1.0s for a significantly faster startup
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && !isUserLoading && !user) {
      router.replace('/login');
    }
  }, [mounted, user, isUserLoading, router]);

  // If still determining auth status or during the branding period, show splash
  if (!mounted || isUserLoading || showSplash) {
    return <SplashScreen />;
  }

  if (!user) {
    return null;
  }
  
  return (
    <UserProfileProvider>
      <CartProvider>
        <MainLayout>
          {children}
        </MainLayout>
      </CartProvider>
    </UserProfileProvider>
  );
}
