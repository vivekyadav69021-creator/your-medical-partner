"use client";

import { HeartPulse } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-gradient-to-br from-[#E6F0FF] via-[#FDFBFF] to-[#FFE9F0] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] animate-in fade-in duration-1000">
      <div className="relative flex flex-col items-center justify-center text-center">
        
        {/* Animated Logo with Glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse scale-150" />
          <div className="relative z-10 p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-primary/20 border border-white dark:border-slate-800 animate-splash-pop-in">
            <HeartPulse className="h-20 w-20 md:h-24 md:w-24 text-primary animate-pulse" />
          </div>
        </div>
        
        {/* Animated Text */}
        <div className="relative space-y-4">
          <div className="font-headline flex items-center justify-center gap-x-3 text-4xl md:text-6xl font-black tracking-tighter uppercase">
            <div 
              className="opacity-0 animate-splash-slide-in-left"
              style={{ animationDelay: '200ms', color: '#2D3A5D' }}
            >
              Your
            </div>
            <div 
              className="opacity-0 animate-splash-slide-in-bottom text-primary"
              style={{ animationDelay: '400ms' }}
            >
              Medical
            </div>
            <div 
              className="opacity-0 animate-splash-slide-in-right"
              style={{ animationDelay: '600ms', color: '#2D3A5D' }}
            >
              Partner
            </div>
          </div>

          {/* Infinite Heartbeat Line Underline */}
          <div className="flex justify-center pt-2">
            <svg 
              width="280" 
              height="40" 
              viewBox="0 0 280 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-[200px] md:max-w-[300px]"
            >
              <path 
                d="M0 20H40L50 10L60 30L70 20H110L120 5L135 35L145 20H180L190 15L200 25L210 20H280" 
                stroke="url(#ekg-gradient)" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-ekg-infinite"
                style={{ animationDelay: '1000ms' }}
              />
              <defs>
                <linearGradient id="ekg-gradient" x1="0" y1="20" x2="280" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2488E8" />
                  <stop offset="0.5" stopColor="#14CFBD" />
                  <stop offset="1" stopColor="#2488E8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-1000 fill-mode-forwards" style={{ animationDelay: '1800ms' }}>
          Your Digital Health Companion
        </p>
      </div>
    </div>
  );
}