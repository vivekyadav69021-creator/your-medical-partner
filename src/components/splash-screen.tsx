"use client";

import { HeartPulse } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-gradient-to-br from-[#E6F0FF] via-[#FDFBFF] to-[#FFE9F0] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] animate-in fade-in duration-1000">
      <div className="relative flex flex-col items-center justify-center text-center">
        
        {/* Unique Medical Logo with Aura */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-primary/25 rounded-full blur-3xl animate-pulse scale-150" />
          <div className="relative z-10 p-7 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(36,136,232,0.2)] border border-white dark:border-slate-800 animate-splash-pop-in">
            <div className="relative">
              <HeartPulse className="h-20 w-20 md:h-24 md:w-24 text-primary animate-pulse" />
              {/* Subtle Medical Plus Icon integrated visually */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
                <div className="w-2.5 h-0.5 bg-white rounded-full"></div>
                <div className="w-0.5 h-2.5 bg-white rounded-full absolute"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Refined Brand Typography */}
        <div className="relative flex flex-col items-start">
          <div className="font-headline flex items-center justify-center gap-x-3 text-4xl md:text-6xl font-black tracking-tighter uppercase">
            <span 
              className="opacity-0 animate-splash-slide-in-left block"
              style={{ animationDelay: '200ms', color: '#2D3A5D' }}
            >
              Your
            </span>
            <span 
              className="opacity-0 animate-splash-slide-in-bottom text-primary block"
              style={{ animationDelay: '400ms' }}
            >
              Medical
            </span>
            <span 
              className="opacity-0 animate-splash-slide-in-right block"
              style={{ animationDelay: '600ms', color: '#2D3A5D' }}
            >
              Partner
            </span>
          </div>

          {/* Corrected Heartbeat Line - Starts from 'Your' */}
          <div className="w-full mt-2 opacity-0 animate-in fade-in duration-1000 fill-mode-forwards" style={{ animationDelay: '1000ms' }}>
            <svg 
              width="100%" 
              height="40" 
              viewBox="0 0 400 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              preserveAspectRatio="none"
            >
              <path 
                d="M0 20H60L75 10L90 30L105 20H160L175 5L195 35L215 20H260L275 15L290 25L305 20H400" 
                stroke="url(#ekg-premium-gradient)" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="animate-ekg-infinite"
              />
              <defs>
                <linearGradient id="ekg-premium-gradient" x1="0" y1="20" x2="400" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#2488E8" />
                  <stop offset="0.5" stopColor="#14CFBD" />
                  <stop offset="1" stopColor="#2488E8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Dynamic Tagline */}
        <p className="mt-10 text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-1000 fill-mode-forwards" style={{ animationDelay: '1800ms' }}>
          Reliable Digital Health Companion
        </p>
      </div>
    </div>
  );
}
