"use client";

import { HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-gradient-to-br from-[#E6F0FF] via-[#FDFBFF] to-[#FFE9F0] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b]">
      <div className="relative flex flex-col items-center justify-center text-center px-6">
        
        {/* Modern Medical Logo with Pulsing Glow */}
        <div className="relative mb-10">
          {/* Soft Glowing Aura behind the logo */}
          <div className="absolute inset-0 bg-[#2488E8]/20 rounded-full blur-[60px] animate-pulse scale-[2.5]" />
          
          <div className="relative z-10 flex items-center justify-center animate-splash-pop-in">
            <div className="relative p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-[3rem] shadow-2xl border border-white dark:border-slate-800">
              <HeartPulse className="h-24 w-24 md:h-32 md:w-32 text-[#2488E8] drop-shadow-[0_0_20px_rgba(36,136,232,0.4)] animate-pulse" />
              
              {/* Unique Corner Badge */}
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#2488E8] to-[#14CFBD] rounded-2xl border-4 border-white dark:border-slate-950 flex items-center justify-center shadow-xl rotate-12">
                <div className="w-5 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-5 bg-white rounded-full absolute"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Staggered Brand Typography */}
        <div className="relative flex flex-col items-center gap-1">
          <div className="font-headline flex flex-wrap items-center justify-center gap-x-3 text-4xl md:text-7xl font-black tracking-tighter uppercase overflow-hidden">
            {/* "Your" slides from Left */}
            <span 
              className="opacity-0 animate-splash-slide-in-left inline-block"
              style={{ animationDelay: '400ms', color: '#1A365D' }}
            >
              Your
            </span>
            
            {/* "Medical" pops from Bottom */}
            <span 
              className="opacity-0 animate-splash-slide-in-bottom text-[#2488E8] inline-block"
              style={{ animationDelay: '800ms' }}
            >
              Medical
            </span>
            
            {/* "Partner" slides from Right */}
            <span 
              className="opacity-0 animate-splash-slide-in-right inline-block"
              style={{ animationDelay: '1200ms', color: '#1A365D' }}
            >
              Partner
            </span>
          </div>

          {/* New Robust Animated Indicator Bar */}
          <div 
            className="w-full h-1.5 mt-6 rounded-full bg-slate-100 dark:bg-slate-800/50 overflow-hidden relative opacity-0 animate-in fade-in duration-1000 fill-mode-forwards"
            style={{ animationDelay: '1800ms' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#2488E8] via-[#14CFBD] to-[#2488E8] w-1/2 rounded-full animate-splash-gradient" />
          </div>
        </div>

        {/* Dynamic Tagline */}
        <p 
          className="mt-12 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-slate-400 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-1000 fill-mode-forwards" 
          style={{ animationDelay: '2200ms' }}
        >
          Your Reliable Digital Health Companion
        </p>
      </div>
    </div>
  );
}