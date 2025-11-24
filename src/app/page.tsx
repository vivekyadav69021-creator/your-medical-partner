'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { SplashScreen } from '@/components/splash-screen';
import { FirebaseClientProvider } from '@/firebase/client-provider';

function Home() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  return <SplashScreen />;
}


export default function HomePage() {
    return (
        <FirebaseClientProvider>
            <Home />
        </FirebaseClientProvider>
    )
}

    