
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
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
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
