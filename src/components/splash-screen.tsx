
"use client";

import { HeartPulse } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-gradient-to-br from-[#E6F0FF] via-[#FDFBFF] to-[#FFE9F0] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b]">
      <div className="relative flex flex-col items-center justify-center text-center">
        
        {/* Modern Medical Logo with Glow */}
        <div className="relative mb-6 group">
          {/* Pulsing Aura behind the logo */}
          <div className="absolute inset-0 bg-[#2488E8]/20 rounded-full blur-3xl animate-pulse scale-150" />
          
          <div className="relative z-10 p-4 flex items-center justify-center animate-splash-pop-in">
            <div className="relative">
              <HeartPulse className="h-20 w-20 md:h-24 md:w-24 text-[#2488E8] drop-shadow-[0_0_15px_rgba(36,136,232,0.5)] animate-pulse" />
              
              {/* Integrated Medical Plus Symbol */}
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#2488E8] rounded-xl border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-xl">
                <div className="w-4 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-4 bg-white rounded-full absolute"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Premium Brand Typography Container */}
        <div className="relative flex flex-col items-center">
          <div className="font-headline flex flex-wrap items-center justify-center gap-x-2 text-4xl md:text-6xl font-black tracking-tight uppercase relative pb-4">
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

            {/* Continuous Heartbeat Line Underline - Positioned precisely at the bottom of the text */}
            <div className="absolute bottom-0 left-0 w-full px-1 opacity-0 animate-in fade-in duration-1000 fill-mode-forwards" style={{ animationDelay: '1000ms' }}>
              <div className="w-full overflow-hidden">
                  <svg 
                    width="100%" 
                    height="30" 
                    viewBox="0 0 400 40" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full drop-shadow-[0_0_8px_rgba(36,136,232,0.6)]"
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
          </div>
        </div>

        {/* Dynamic Tagline */}
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-1000 fill-mode-forwards" style={{ animationDelay: '1800ms' }}>
          Your Reliable Digital Health Companion
        </p>
      </div>
    </div>
  );
}
