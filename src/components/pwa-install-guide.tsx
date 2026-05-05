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
import { Share, PlusSquare, Smartphone, Download, X, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function PWAInstallGuide() {
  const [showBanner, setShowBanner] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPreparing, setIsPreparing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // 1. Check if already installed (standalone mode)
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
      console.log('Native install prompt is ready');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // 4. Show banner anyway after 5 seconds if not standalone (for iOS instructions)
    const timer = setTimeout(() => {
      if (!isStandalone) {
        setShowBanner(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // ANDROID / CHROME NATIVE PROMPT
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          setShowBanner(false);
          toast({ title: "Installing...", description: "Your Medical Partner is being added to your phone." });
        }
      } catch (err) {
        console.error("Install prompt error:", err);
        setShowInstructions(true); // Fallback to manual guide
      }
    } else {
      // IOS or Android without direct prompt availability
      setShowInstructions(true);
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
                <p className="text-sm font-black tracking-tight flex items-center gap-1">
                  Get The App <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Full Screen • Faster Access</p>
              </div>
            </div>

            <div className="flex items-center gap-2 relative z-10">
              <Button 
                size="sm" 
                onClick={handleInstallClick} 
                disabled={isPreparing}
                className="rounded-full h-10 px-6 bg-white text-black hover:bg-slate-100 font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-xl"
              >
                {isPreparing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get App'}
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

      {/* Manual Instructions Dialog (For iOS and Fallback) */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md rounded-[3rem] border-none p-8 overflow-hidden bg-white dark:bg-slate-900">
          <DialogHeader className="space-y-4">
            <div className="mx-auto bg-blue-50 dark:bg-blue-900/20 p-5 rounded-[2.5rem] w-fit">
               <Download className="w-10 h-10 text-primary animate-bounce" />
            </div>
            <DialogTitle className="text-2xl font-black text-center text-[#2D3A5D] dark:text-slate-100 tracking-tight">
              {platform === 'ios' ? 'Install on iPhone' : 'Add to Home Screen'}
            </DialogTitle>
            <DialogDescription className="text-center font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] leading-relaxed">
              Follow these simple steps:
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-5">
            {platform === 'ios' ? (
              <>
                <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="bg-white dark:bg-slate-700 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                    <Share className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">1. Tap 'Share'</p>
                    <p className="text-[11px] font-medium text-slate-400">At the bottom of Safari</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="bg-white dark:bg-slate-700 h-12 w-12 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                    <PlusSquare className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">2. 'Add to Home Screen'</p>
                    <p className="text-[11px] font-medium text-slate-400">Find it in the share menu</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center text-center p-6 space-y-4">
                <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center">
                  <PlusSquare className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed">
                  Tap the three dots (⋮) in your browser menu and select <b>"Install App"</b> or <b>"Add to Home Screen"</b> to continue.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowInstructions(false)} className="w-full rounded-2xl h-14 bg-primary text-white font-black uppercase text-xs tracking-widest shadow-2xl">
              I'll do it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
