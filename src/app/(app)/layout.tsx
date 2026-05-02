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
  const [showSplash, setShowSplash] = useState(true); // Control splash visibility
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Optimized splash delay to 2.5 seconds for a snappier yet premium feel
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && !isUserLoading && !user) {
      router.replace('/login');
    }
  }, [mounted, user, isUserLoading, router]);

  // Show splash if still mounting, checking auth, or during the mandatory period
  if (!mounted || isUserLoading || showSplash) {
    return <SplashScreen />;
  }

  if (!user) {
    return null;
  }
  
  return (
    <UserProfileProvider>
      <CartProvider>
        <MainLayout>{children}</MainLayout>
      </CartProvider>
    </UserProfileProvider>
  );
}
