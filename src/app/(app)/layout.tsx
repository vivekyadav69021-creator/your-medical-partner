
'use client';

import MainLayout from '@/components/layout/main-layout';
import { UserProfileProvider } from '@/context/user-profile-context';
import { CartProvider } from '@/context/cart-context';
import { FirebaseClientProvider } from '@/firebase';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FirebaseClientProvider>
      <UserProfileProvider>
        <CartProvider>
          <MainLayout>{children}</MainLayout>
        </CartProvider>
      </UserProfileProvider>
    </FirebaseClientProvider>
  );
}
