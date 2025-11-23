"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeartPulse } from 'lucide-react';

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-gradient-to-br from-[#E3F2FD] to-[#BBDEFB] dark:from-[#0D1117] dark:to-[#161B22] bg-pan-subtle bg-[length:200%_200%]">
      <div className="relative flex flex-col items-center justify-center text-center">
        <div 
          className="animate-splash-pop-in" 
          style={{ animationDelay: '200ms' }}
        >
          <HeartPulse className="h-32 w-32 text-primary" style={{ filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.25))' }}/>
        </div>
        
        <div className="mt-8 font-headline grid grid-cols-3 items-center justify-center gap-x-2 text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide" style={{ textShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <div 
            className="opacity-0 animate-splash-slide-in-left text-right"
            style={{ animationDelay: '300ms', color: '#1565C0' }}
          >
            Your
          </div>
          <div 
            className="opacity-0 animate-splash-slide-in-bottom"
            style={{ animationDelay: '500ms', color: '#1E88E5' }}
          >
            Medical
          </div>
          <div 
            className="opacity-0 animate-splash-slide-in-right text-left"
            style={{ animationDelay: '700ms', color: '#42A5F5' }}
          >
            Partner
          </div>
        </div>
      </div>
    </div>
  );
}
