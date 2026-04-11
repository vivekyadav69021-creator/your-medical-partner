'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from '@/components/splash-screen';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Force immediate redirect to dashboard, skipping any auth checks
    router.replace('/dashboard');
  }, [router]);

  return <SplashScreen />;
}
