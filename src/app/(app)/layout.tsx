
'use client';

import MainLayout from '@/components/layout/main-layout';
import { CartProvider } from '@/context/cart-context';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <CartProvider>
        <MainLayout>{children}</MainLayout>
      </CartProvider>
  );
}
