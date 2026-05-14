
import React, { useState, useEffect, useRef } from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { HeartPulse, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide global header for focused AI chat pages
  const isHealthAssistant = pathname === '/health-assistant';
  const isPsychiatrist = pathname === '/ai-psychiatrist';
  const hideGlobalHeader = isHealthAssistant || isPsychiatrist;

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-slate-100 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 transition-colors duration-300">
        <SidebarHeader className="pt-10 px-6 pb-6 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-4 p-2">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-3 transition-transform hover:rotate-0">
                <HeartPulse className="w-7 h-7 text-white" />
            </div>
            <div className="group-data-[state=collapsed]:hidden">
                <h1 className="text-sm font-black font-headline text-[#2D3A5D] dark:text-slate-100 uppercase tracking-tighter leading-none">Your Medical</h1>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.35em] mt-1">Partner</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="scrollbar-hide bg-white dark:bg-slate-900">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-6 border-t border-slate-100 dark:border-slate-800 group-data-[state=collapsed]:hidden bg-white dark:bg-slate-900">
            <div className="p-4 rounded-3xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100/50 dark:border-slate-700 shadow-inner">
                <p className="text-[9px] font-black text-primary uppercase tracking-widest text-center">Version 2.0.1 Stable</p>
            </div>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarInset className="flex flex-col relative h-[100dvh] overflow-hidden w-full" style={{ background: 'var(--dashboard-bg)', backgroundAttachment: 'fixed' }}>
        {/* Only show global header if not on specialized AI pages */}
        {!hideGlobalHeader && (
          <header className="flex h-16 items-center justify-between px-4 sticky top-0 z-40 bg-white/10 backdrop-blur-lg border-b border-white/20 shrink-0 safe-top">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-11 w-11 rounded-full bg-white dark:bg-slate-800 shadow-md border border-white/30 dark:border-slate-700/50">
                  <Menu className="w-5 h-5 text-primary" />
              </SidebarTrigger>
              <div className="px-3 hidden md:block">
                  <span className="text-[11px] font-black tracking-[0.3em] text-primary font-headline uppercase opacity-70">Digital Health Companion</span>
              </div>
            </div>
          </header>
        )}

        <main className={cn("flex-1 overflow-y-auto scroll-smooth w-full scrollbar-hide", hideGlobalHeader && "p-0 max-w-full")}>
          <div className={cn("min-h-full w-full", hideGlobalHeader ? "p-0" : "p-4 md:p-6 lg:p-10 pb-32 max-w-screen-2xl mx-auto")}>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
