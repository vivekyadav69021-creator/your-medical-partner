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
import { Share, PlusSquare, Smartphone, Download, X, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PWAInstallGuide() {
  const [showBanner, setShowBanner] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    // Check if already in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || (window.navigator as any).standalone 
                         || document.referrer.includes('android-app://');

    if (!isStandalone) {
      // Detect Platform
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        setPlatform('ios');
      } else if (/android/.test(userAgent)) {
        setPlatform('android');
      }

      // Show banner after 3 seconds
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showBanner && !showInstructions) return null;

  return (
    <>
      {/* Small Floating Banner at bottom */}
      {showBanner && !showInstructions && (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-blue-100 dark:border-slate-800 p-4 rounded-[1.5rem] shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-black text-[#2D3A5D] dark:text-slate-100 leading-tight">Install Our App</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Access features faster from home screen</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button size="sm" onClick={() => setShowInstructions(true)} className="rounded-full h-8 px-4 text-[10px] font-black uppercase tracking-widest">
                Install
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowBanner(false)} className="h-8 w-8 rounded-full">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Full Instructions Modal */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none p-6 overflow-hidden">
          <DialogHeader className="space-y-3">
            <div className="mx-auto bg-primary/10 p-4 rounded-[2rem] w-fit">
               <Download className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-black text-center text-[#2D3A5D] dark:text-slate-100 tracking-tight">Install as App</DialogTitle>
            <DialogDescription className="text-center font-bold text-slate-400 text-xs uppercase tracking-widest">
              Follow these simple steps to add "Your Medical Partner" to your phone.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-8">
            {platform === 'ios' ? (
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="bg-white dark:bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
                    <Share className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">1. Tap Share</p>
                    <p className="text-xs font-medium text-slate-400">Click the share icon in your Safari browser bottom bar.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="bg-white dark:bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
                    <PlusSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">2. Add to Home Screen</p>
                    <p className="text-xs font-medium text-slate-400">Scroll down and select the 'Add to Home Screen' option.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                 <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="bg-white dark:bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
                    <MoreVertical className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">1. Tap Menu</p>
                    <p className="text-xs font-medium text-slate-400">Tap the three dots (menu) in the top-right corner of Chrome.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                  <div className="bg-white dark:bg-slate-700 h-10 w-10 rounded-full flex items-center justify-center shadow-sm shrink-0">
                    <Download className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-200">2. Install App</p>
                    <p className="text-xs font-medium text-slate-400">Tap 'Install App' or 'Add to Home screen' from the menu.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setShowInstructions(false)} className="w-full rounded-2xl h-12 font-black uppercase text-[10px] tracking-widest shadow-lg">
              Got it, thanks!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
