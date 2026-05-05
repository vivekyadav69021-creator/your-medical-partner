'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share, PlusSquare, Smartphone, Download, X, MoreVertical, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PWAInstallGuide() {
  const [showBanner, setShowBanner] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    }

    // 2. Intercept Android Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    });

    // 3. Fallback for iOS and already intercepted Android
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || (window.navigator as any).standalone;

    if (!isStandalone) {
      const timer = setTimeout(() => {
        if (!deferredPrompt) setShowBanner(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Direct install for Android
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowBanner(false);
      }
    } else {
      // Manual instructions for iOS
      setShowInstructions(true);
    }
  };

  if (!showBanner && !showInstructions) return null;

  return (
    <>
      {/* Premium Bottom Banner */}
      {showBanner && !showInstructions && (
        <div className="fixed bottom-6 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10 duration-700">
          <div className="bg-[#1A1A1A] text-white p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between gap-4 border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-primary h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black tracking-tight flex items-center gap-2">
                  Use as Native App <Sparkles className="w-3 h-3 text-yellow-400" />
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Zero Lag • Full Screen • Fast Access</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <Button size="sm" onClick={handleInstallClick} className="rounded-full h-10 px-6 bg-white text-black hover:bg-slate-100 font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-xl">
                {deferredPrompt ? 'Direct Install' : 'Get App'}
              </Button>
              <button onClick={() => setShowBanner(false)} className="h-8 w-8 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Manual Instructions Modal */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md rounded-[3rem] border-none p-8 overflow-hidden bg-white dark:bg-slate-900">
          <DialogHeader className="space-y-4">
            <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 p-5 rounded-[2.5rem] w-fit shadow-inner">
               <Download className="w-10 h-10 text-primary animate-bounce" />
            </div>
            <DialogTitle className="text-3xl font-black text-center text-[#2D3A5D] dark:text-slate-100 tracking-tight">Add to Home Screen</DialogTitle>
            <DialogDescription className="text-center font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] leading-relaxed">
              Apple requires a manual step to install web apps. Follow these 2 taps:
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 space-y-6">
            <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="bg-white dark:bg-slate-700 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                <Share className="w-6 h-6 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">1. Tap 'Share' Button</p>
                <p className="text-[11px] font-medium text-slate-400">Found in your Safari bottom bar.</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="bg-white dark:bg-slate-700 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                <PlusSquare className="w-6 h-6 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">2. 'Add to Home Screen'</p>
                <p className="text-[11px] font-medium text-slate-400">Scroll down to find this option.</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowInstructions(false)} className="w-full rounded-2xl h-14 bg-primary text-white font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all">
              Done, Let's go!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}