
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/splash-screen';
import { useUser } from '@/firebase';

function Home() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  // Show splash screen while loading/redirecting.
  return <SplashScreen />;
}


export default function HomePage() {
    return (
        <Home />
    )
}
