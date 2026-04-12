"use client";

import { HeartPulse } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-gradient-to-br from-[#E6F0FF] via-[#FDFBFF] to-[#FFE9F0] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b]">
      <div className="relative flex flex-col items-center justify-center text-center">
        
        {/* Modern Medical Logo with Glow */}
        <div className="relative mb-12 group">
          <div className="absolute inset-0 bg-[#2488E8]/20 rounded-[2.5rem] blur-3xl animate-pulse scale-150" />
          <div className="relative z-10 p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(36,136,232,0.15)] border border-white dark:border-slate-800 animate-splash-pop-in overflow-hidden">
            <div className="relative">
              <HeartPulse className="h-20 w-20 md:h-24 md:w-24 text-[#2488E8] animate-pulse" />
              {/* Integrated Medical Plus Symbol */}
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-[#2488E8] rounded-lg border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-lg">
                <div className="w-3 h-0.5 bg-white rounded-full"></div>
                <div className="w-0.5 h-3 bg-white rounded-full absolute"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Premium Brand Typography */}
        <div className="relative flex flex-col items-center">
          <div className="font-headline flex flex-wrap items-center justify-center gap-x-2.5 text-4xl md:text-6xl font-black tracking-tight uppercase">
            <span 
              className="opacity-0 animate-splash-slide-in-left"
              style={{ animationDelay: '200ms', color: '#2D3A5D' }}
            >
              Your
            </span>
            <span 
              className="opacity-0 animate-splash-slide-in-bottom text-[#2488E8]"
              style={{ animationDelay: '400ms' }}
            >
              Medical
            </span>
            <span 
              className="opacity-0 animate-splash-slide-in-right"
              style={{ animationDelay: '600ms', color: '#2D3A5D' }}
            >
              Partner
            </span>
          </div>

          {/* Continuous Heartbeat Line - Aligned from the start of "Your" */}
          <div className="w-full mt-6 px-2 animate-in fade-in duration-1000 fill-mode-forwards" style={{ animationDelay: '1000ms' }}>
            <svg 
              width="100%" 
              height="40" 
              viewBox="0 0 400 40" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="w-full drop-shadow-[0_0_12px_rgba(36,136,232,0.4)]"
              preserveAspectRatio="none"
            >
              <path 
                d="M0 20 H40 L55 10 L70 30 L85 20 H130 L145 5 L165 35 L185 20 H230 L245 15 L260 25 L275 20 H400" 
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
        <p className="mt-12 text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-1000 fill-mode-forwards" style={{ animationDelay: '1800ms' }}>
          Your Reliable Digital Health Companion
        </p>
      </div>
    </div>
  );
}