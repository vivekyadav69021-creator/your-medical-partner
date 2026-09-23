'use client';

import MainLayout from '@/components/layout/main-layout';
import { CartProvider } from '@/context/cart-context';
import { UserProfileProvider } from '@/context/user-profile-context';
import { SplashScreen } from '@/components/splash-screen';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isUserLoading && !user) {
      router.replace('/login');
    }
  }, [mounted, user, isUserLoading, router]);

  // Show splash only during initial load or while waiting for auth
  if (!mounted || isUserLoading) {
    return <SplashScreen />;
  }

  // Prevent UI flash for unauthorized users
  if (!user) {
    return <SplashScreen />;
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