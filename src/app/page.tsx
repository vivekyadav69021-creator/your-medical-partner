'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { SplashScreen } from '@/components/splash-screen';

export default function HomePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isUserLoading) {
      if (user) {
        if (user.email === 'yourmedicalpartner6972@gmail.com') {
          router.replace('/admin');
        } else {
          router.replace('/dashboard');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router, mounted]);

  return <SplashScreen />;
}