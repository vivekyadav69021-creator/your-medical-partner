"use client";

import { HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SplashScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-gradient-to-br from-[#E6F0FF] via-[#FDFBFF] to-[#FFE9F0] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b]">
      <div className="relative flex flex-col items-center justify-center text-center px-6">
        
        {/* Modern Medical Logo with Pulsing Glow */}
        <div className="relative mb-8">
          {/* Soft Glowing Aura behind the logo */}
          <div className="absolute inset-0 bg-[#2488E8]/20 rounded-full blur-[50px] animate-pulse scale-[2.2]" />
          
          <div className="relative z-10 flex items-center justify-center animate-splash-pop-in">
            <div className="relative p-5 md:p-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-800">
              <HeartPulse className="h-20 w-20 md:h-28 md:w-28 text-[#2488E8] drop-shadow-[0_0_15px_rgba(36,136,232,0.4)] animate-pulse" />
              
              {/* Unique Corner Badge */}
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-[#2488E8] to-[#14CFBD] rounded-xl border-2 border-white dark:border-slate-950 flex items-center justify-center shadow-lg rotate-12">
                <div className="w-4 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-4 bg-white rounded-full absolute"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Staggered Brand Typography */}
        <div className="relative flex flex-col items-center gap-1">
          <div className="font-headline flex flex-wrap items-center justify-center gap-x-3 text-3xl md:text-6xl font-black tracking-tighter uppercase overflow-hidden">
            {/* Faster animations for a more responsive feel */}
            <span 
              className="opacity-0 animate-splash-slide-in-left inline-block"
              style={{ animationDelay: '200ms', color: '#1A365D' }}
            >
              Your
            </span>
            
            <span 
              className="opacity-0 animate-splash-slide-in-bottom text-[#2488E8] inline-block"
              style={{ animationDelay: '400ms' }}
            >
              Medical
            </span>
            
            <span 
              className="opacity-0 animate-splash-slide-in-right inline-block"
              style={{ animationDelay: '600ms', color: '#1A365D' }}
            >
              Partner
            </span>
          </div>

          <div 
            className="w-full h-1 mt-5 rounded-full bg-slate-100 dark:bg-slate-800/50 overflow-hidden relative opacity-0 animate-in fade-in duration-700 fill-mode-forwards"
            style={{ animationDelay: '900ms' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#2488E8] via-[#14CFBD] to-[#2488E8] w-1/2 rounded-full animate-splash-gradient" />
          </div>
        </div>

        {/* Dynamic Tagline */}
        <p 
          className="mt-10 text-[9px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400 opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-700 fill-mode-forwards" 
          style={{ animationDelay: '1100ms' }}
        >
          Your Reliable Digital Health Companion
        </p>
      </div>
    </div>
  );
}
