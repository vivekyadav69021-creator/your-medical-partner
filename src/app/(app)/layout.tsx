
'use client';

import MainLayout from '@/components/layout/main-layout';
import { UserProfileProvider } from '@/context/user-profile-context';
import { CartProvider } from '@/context/cart-context';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProfileProvider>
      <CartProvider>
        <MainLayout>{children}</MainLayout>
      </CartProvider>
    </UserProfileProvider>
  );
}
