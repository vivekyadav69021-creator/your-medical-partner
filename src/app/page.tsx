
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/splash-screen';
import { useUser } from '@/firebase';

function Home() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // We wait until Firebase has checked the auth state.
    if (!isUserLoading) {
      if (user) {
        // If user is logged in, go to the dashboard.
        router.replace('/dashboard');
      } else {
        // If no user, go to the login page.
        router.replace('/login');
      }
    }
  }, [router, user, isUserLoading]);

  // Show splash screen while loading/redirecting.
  return <SplashScreen />;
}


export default function HomePage() {
    return (
        <Home />
    )
}
