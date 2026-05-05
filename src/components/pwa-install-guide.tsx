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
import { Share, PlusSquare, Smartphone, Download, X, Sparkles } from 'lucide-react';

export function PWAInstallGuide() {
  const [showBanner, setShowBanner] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // 2. Detect platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    }

    // 3. Capture Native Install Prompt (Android/Chrome/Edge)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true); // Show banner as soon as browser is ready to install
    };

    window.addEventListener('beforeinstallprompt', handler);

    // 4. Fallback: If no native prompt after 4 seconds (common on iOS or if event was missed)
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isStandalone) {
        setShowBanner(true);
      }
    }, 4000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // ANDROID / CHROME LOGIC: Direct one-click prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowBanner(false);
      }
    } else if (platform === 'ios') {
      // IOS LOGIC: Show manual instructions as Apple blocks direct install
      setShowInstructions(true);
    } else {
      // OTHER: Basic instruction fallback
      alert("To install: Use your browser's 'Add to Home Screen' option.");
    }
  };

  if (!showBanner && !showInstructions) return null;

  return (
    <>
      {/* Dynamic Action Banner */}
      {showBanner && !showInstructions && (
        <div className="fixed bottom-6 left-4 right-4 z-[100] animate-in slide-in-from-bottom-10 duration-700">
          <div className="bg-[#1A1A1A] text-white p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex items-center justify-between gap-4 border border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent opacity-40" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-primary h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black tracking-tight flex items-center gap-2">
                  Install MediMate <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Full Screen • Offline Access</p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <Button 
                size="sm" 
                onClick={handleInstallClick} 
                className="rounded-full h-10 px-6 bg-white text-black hover:bg-slate-100 font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-xl"
              >
                {deferredPrompt ? 'Install Now' : 'Get App'}
              </Button>
              <button 
                onClick={() => setShowBanner(false)} 
                className="h-8 w-8 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Only Instructions (Apple limitation) */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md rounded-[3rem] border-none p-8 overflow-hidden bg-white dark:bg-slate-900">
          <DialogHeader className="space-y-4">
            <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 p-5 rounded-[2.5rem] w-fit">
               <Download className="w-10 h-10 text-primary animate-bounce" />
            </div>
            <DialogTitle className="text-3xl font-black text-center text-[#2D3A5D] dark:text-slate-100 tracking-tight">Add to iPhone</DialogTitle>
            <DialogDescription className="text-center font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] leading-relaxed">
              Safari requires these 2 quick steps:
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 space-y-6">
            <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="bg-white dark:bg-slate-700 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                <Share className="w-6 h-6 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">1. Tap 'Share'</p>
                <p className="text-[11px] font-medium text-slate-400">Bottom center of Safari</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="bg-white dark:bg-slate-700 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                <PlusSquare className="w-6 h-6 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">2. 'Add to Home Screen'</p>
                <p className="text-[11px] font-medium text-slate-400">Scroll down to find this option</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowInstructions(false)} className="w-full rounded-2xl h-14 bg-primary text-white font-black uppercase text-xs tracking-widest shadow-2xl">
              Done, Open App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
