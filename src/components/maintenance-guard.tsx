'use client';

import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Hammer, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MaintenanceGuardProps {
  featureId: string;
  children: React.ReactNode;
}

/**
 * MaintenanceGuard listens to Firestore feature flags.
 * If a feature is disabled by admin, it shows a premium maintenance screen.
 */
export function MaintenanceGuard({ featureId, children }: MaintenanceGuardProps) {
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    const unsub = onSnapshot(doc(firestore, 'system_settings', 'features'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsEnabled(data[featureId] !== false); // Default to true if not found
      } else {
        setIsEnabled(true);
      }
    }, () => {
      setIsEnabled(true); // Fallback on error
    });

    return () => unsub();
  }, [featureId, firestore]);

  if (isEnabled === null) return <div className="p-20 text-center animate-pulse text-slate-400">Loading Configuration...</div>;

  if (!isEnabled) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        <div className="relative">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-3xl animate-pulse scale-150" />
            <div className="relative h-32 w-32 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl flex items-center justify-center border border-amber-100 dark:border-amber-900/50">
                <Hammer className="h-16 w-16 text-amber-500" />
            </div>
            <div className="absolute -top-2 -right-2 bg-red-500 p-2 rounded-xl shadow-lg border-4 border-white dark:border-slate-950">
                <AlertTriangle className="h-4 w-4 text-white" />
            </div>
        </div>
        
        <div className="space-y-3 max-w-sm">
            <h2 className="text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Feature Update</h2>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-tighter">
                We are currently enhancing this module for a better experience. Please check back shortly.
            </p>
        </div>

        <Button 
            onClick={() => window.location.reload()}
            variant="outline" 
            className="rounded-full px-8 h-12 gap-2 border-slate-200 dark:border-slate-800 font-black text-[10px] uppercase tracking-widest shadow-sm active:scale-95 transition-all"
        >
            <RotateCcw className="h-4 w-4" /> Try Refreshing
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
