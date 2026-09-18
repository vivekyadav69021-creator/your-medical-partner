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
import { Share, PlusSquare, Download, X, Sparkles, Loader2, HeartPulse } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PWAInstallGuide() {
  const [showBanner, setShowBanner] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const { toast } = useToast();

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
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Show banner after a slight delay for visibility
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        setIsPreparing(true);
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          setShowBanner(false);
          toast({ title: "Starting Installation..." });
        }
        setIsPreparing(false);
      } catch (err) {
        setIsPreparing(false);
        setShowInstructions(true);
      }
    } else {
      setShowInstructions(true);
    }
  };

  if (!showBanner && !showInstructions) return null;

  return (
    <>
      {/* Premium Fixed Banner - Improved positioning for PWA/Mobile */}
      {showBanner && !showInstructions && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom-10 duration-700 ease-out pointer-events-none">
          <div className="max-w-lg mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl p-4 rounded-[2.5rem] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.3)] flex items-center justify-between gap-4 border border-white dark:border-slate-800 pointer-events-auto relative overflow-hidden group">
            {/* Soft Ambient Background Pulse */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-primary/10 dark:bg-primary/20 h-11 w-11 rounded-2xl flex items-center justify-center shadow-inner border border-white/50 dark:border-slate-700">
                <HeartPulse className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-black text-[#1A365D] dark:text-slate-100 tracking-tight flex items-center gap-1">
                  Install App <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Native Experience</p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <Button 
                size="sm" 
                onClick={handleInstallClick} 
                disabled={isPreparing}
                className="rounded-full h-9 px-5 bg-primary text-white hover:bg-primary/90 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-primary/20 border-none"
              >
                {isPreparing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Get Now'}
              </Button>
              <button 
                onClick={() => setShowBanner(false)} 
                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-300 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Instructions Dialog (Themed) */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md rounded-[3rem] border-none p-8 overflow-hidden bg-white dark:bg-slate-900 shadow-2xl">
          <DialogHeader className="space-y-4">
            <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[2.5rem] w-fit shadow-inner">
               <Download className="w-12 h-12 text-primary animate-bounce" />
            </div>
            <DialogTitle className="text-2xl font-black text-center text-[#2D3A5D] dark:text-slate-100 tracking-tight">
              {platform === 'ios' ? 'Install on iPhone' : 'Add to Home Screen'}
            </DialogTitle>
            <DialogDescription className="text-center font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] leading-relaxed">
              Your Medical Partner
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 space-y-5">
            {platform === 'ios' ? (
              <>
                <div className="flex items-center gap-5 p-5 rounded-[2.2rem] bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100/50 dark:border-slate-800">
                  <div className="bg-white dark:bg-slate-700 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shrink-0 border border-slate-100">
                    <Share className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">1. Tap 'Share' Button</p>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">Bottom of your browser</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-5 rounded-[2.2rem] bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100/50 dark:border-slate-800">
                  <div className="bg-white dark:bg-slate-700 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shrink-0 border border-slate-100">
                    <PlusSquare className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">2. 'Add to Home Screen'</p>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">Scroll down to find this</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center p-8 space-y-6 bg-slate-50/50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100/50">
                <div className="bg-white dark:bg-slate-700 h-20 w-20 rounded-3xl flex items-center justify-center shadow-xl border border-slate-100">
                  <PlusSquare className="h-10 w-10 text-primary" />
                </div>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed px-2">
                  Tap the browser menu (⋮) and select <b className="text-primary">"Install App"</b> or <b>"Add to Home Screen"</b>.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowInstructions(false)} className="w-full rounded-2xl h-14 bg-primary text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 active:scale-95 transition-all">
              Got it, thanks!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
