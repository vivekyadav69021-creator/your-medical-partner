
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { UserProfileProvider } from '@/context/user-profile-context';
import { useUser } from '@/firebase';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { SplashScreen } from '@/components/splash-screen';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If user data has loaded and there is no user, redirect to login.
    if (!isUserLoading && !user) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [user, isUserLoading, router, pathname]);

  // While checking for user, show a loading screen.
  if (isUserLoading || !user) {
    return <SplashScreen />;
  }

  // If user is logged in, render the main layout.
  return (
    <UserProfileProvider>
      <MainLayout>{children}</MainLayout>
    </UserProfileProvider>
  );
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FirebaseClientProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </FirebaseClientProvider>
  );
}

    