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
import { HeartPulse, Menu, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import Link from 'next/link';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  
  const isAdmin = user?.email === 'yourmedicalpartner07@gmail.com';
  
  // SECURE GATEWAY & INTERCEPTION
  useEffect(() => {
    if (isAdmin && (pathname === '/dashboard' || pathname === '/')) {
        router.replace('/admin');
    }
    // Prevent standard users from entering admin zone
    if (!isAdmin && pathname === '/admin') {
        router.replace('/dashboard');
    }
  }, [isAdmin, pathname, router]);

  // Immersive Pages (Full Screen)
  const isHealthAssistant = pathname === '/health-assistant';
  const isPsychiatrist = pathname === '/ai-psychiatrist';
  const isDiseaseScanner = pathname === '/disease-scanner';
  const isFoodScanner = pathname === '/food-scanner';
  const isVideoLibrary = pathname === '/video-tutorials';
  const isNearbyHospital = pathname === '/nearby-hospital';
  const isAdminPanel = pathname === '/admin';
  
  const hideGlobalHeader = isHealthAssistant || isPsychiatrist || isDiseaseScanner || isFoodScanner || isVideoLibrary || isNearbyHospital || isAdminPanel;
  const hideSidebar = isDiseaseScanner || isFoodScanner || isVideoLibrary || (isAdminPanel && !isAdmin); 

  return (
    <SidebarProvider defaultOpen={!hideSidebar}>
      {!hideSidebar && (
        <Sidebar className="border-r border-slate-100 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 transition-colors duration-300">
          <SidebarHeader className="pt-10 px-6 pb-6 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-4 p-2">
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg rotate-3 transition-transform hover:rotate-0", isAdmin ? "bg-primary" : "bg-primary")}>
                  {isAdmin ? <ShieldCheck className="w-7 h-7 text-white" /> : <HeartPulse className="w-7 h-7 text-white" />}
              </div>
              <div className="group-data-[state=collapsed]:hidden">
                  <h1 className="text-sm font-black font-headline text-[#2D3A5D] dark:text-slate-100 uppercase tracking-tighter leading-none">{isAdmin ? 'Admin' : 'Your Medical'}</h1>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.35em] mt-1">{isAdmin ? 'Terminal' : 'Partner'}</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="scrollbar-hide bg-white dark:bg-slate-900">
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter className="p-6 border-t border-slate-100 dark:border-slate-800 group-data-[state=collapsed]:hidden bg-white dark:bg-slate-900">
              <div className="p-4 rounded-3xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100/50 dark:border-slate-700 shadow-inner text-center">
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest">{isAdmin ? 'Root Access Active' : 'v2.0.1 Stable'}</p>
              </div>
          </SidebarFooter>
        </Sidebar>
      )}
      
      <SidebarInset 
        className={cn(
          "flex flex-col relative h-[100dvh] overflow-hidden w-full transition-all duration-300", 
          hideSidebar && "ml-0",
          hideGlobalHeader ? "bg-white dark:bg-[#020617] !bg-none" : ""
        )} 
        style={{ 
          backgroundImage: hideGlobalHeader ? 'none' : 'var(--dashboard-bg)', 
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover'
        }}
      >
        {!hideGlobalHeader && (
          <header className="flex h-16 items-center justify-between px-4 sticky top-0 z-40 bg-white/10 backdrop-blur-lg border-b border-white/20 shrink-0 safe-top">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-11 w-11 rounded-full bg-white dark:bg-slate-800 shadow-md border border-white/30 dark:border-slate-700/50">
                  <Menu className="w-5 h-5 text-primary" />
              </SidebarTrigger>
              <div className="px-3 hidden md:block">
                  <span className="text-[11px] font-black tracking-[0.3em] text-primary font-headline uppercase opacity-70">
                    {isAdmin ? 'System Management Mode' : 'Digital Health Companion'}
                  </span>
              </div>
            </div>
            
            {/* Functional Profile Access in Header */}
            <Link href="/profile">
              <div className="flex items-center gap-4 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95 group">
                   <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden shadow-inner group-hover:border-primary/40">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="User" className="object-cover h-full w-full" />
                      ) : (
                        <User className="w-5 h-5 text-primary" />
                      )}
                   </div>
              </div>
            </Link>
          </header>
        )}

        <main className={cn("flex-1 overflow-y-auto scroll-smooth w-full scrollbar-hide", hideGlobalHeader && "p-0 max-w-full")}>
          <div className={cn("min-h-full w-full", hideGlobalHeader ? "p-0" : "p-4 md:p-6 lg:p-10 pb-32 max-screen-2xl mx-auto")}>
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
