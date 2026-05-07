
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
import { HeartPulse, ShoppingCart, User as UserIcon, Moon, Sun, Laptop, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfile } from '@/context/user-profile-context';
import { cn } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { cart } = useCart();
  const { userImage, userName } = useUserProfile();
  const { setTheme } = useTheme();
  const auth = useAuth();
  const [showHeader, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;
      
      const currentScrollY = mainRef.current.scrollTop;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const scrollDistance = Math.abs(currentScrollY - lastScrollY.current);

      if (scrollDistance > 10) {
        if (isScrollingDown && currentScrollY > 100) {
          setHeaderVisible(false);
        } else {
          setHeaderVisible(true);
        }
      }
      
      lastScrollY.current = currentScrollY;
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

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
        <header 
          className={cn(
            "flex h-16 items-center justify-between px-4 sticky top-0 z-40 bg-white/10 backdrop-blur-lg border-b border-white/20 transition-all duration-500 ease-in-out shrink-0 safe-top",
            showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
        >
          <div className="flex items-center gap-2">
            <SidebarTrigger className="h-11 w-11 rounded-full bg-white dark:bg-slate-800 shadow-md border border-white/30 dark:border-slate-700/50 hover:scale-105 active:scale-95 transition-all">
                <Menu className="w-5 h-5 text-primary" />
            </SidebarTrigger>
            <div className="px-3 hidden md:block">
                <span className="text-[11px] font-black tracking-[0.3em] text-primary font-headline uppercase opacity-70">Digital Health Companion</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild title="Cart" className="rounded-full h-11 w-11 bg-white dark:bg-slate-800 shadow-md border border-white/30 hover:scale-105 active:scale-95 transition-all">
              <Link href="/store/cart" className="relative">
                <ShoppingCart className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                {itemCount > 0 && (
                   <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0 text-[10px] animate-in zoom-in border-2 border-white dark:border-slate-900 shadow-sm font-black">{itemCount}</Badge>
                )}
              </Link>
            </Button>
            
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-11 w-11 p-0 rounded-full border-2 border-white dark:border-slate-700 shadow-lg overflow-hidden flex items-center justify-center hover:scale-105 active:scale-95 transition-all" title="Settings">
                  <Avatar className="h-full w-full">
                      <AvatarImage src={userImage} alt={userName} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary">
                          <UserIcon className="w-5 h-5" />
                      </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-[2rem] border-none shadow-2xl bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl p-2 border border-white/20">
                 <DropdownMenuItem asChild className="rounded-2xl cursor-pointer py-3 px-4 font-bold text-slate-700 dark:text-slate-200">
                   <Link href="/profile" className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-primary shadow-sm">
                        <UserIcon className="w-4 h-4" />
                    </div>
                    My Profile
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="rounded-2xl py-3 px-4 font-bold text-slate-700 dark:text-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-purple-50 dark:bg-purple-900/40 rounded-xl flex items-center justify-center text-purple-500 shadow-sm">
                            <Sun className="w-4 h-4" />
                        </div>
                        Theme Mode
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="rounded-[2rem] border-none shadow-2xl bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl p-2 min-w-[160px] border border-white/20">
                      <DropdownMenuItem onClick={() => setTheme('light')} className="rounded-2xl cursor-pointer font-bold py-2.5">
                        <Sun className="mr-3 h-4 w-4 text-orange-400" />
                        <span>Light</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')} className="rounded-2xl cursor-pointer font-bold py-2.5">
                        <Moon className="mr-3 h-4 w-4 text-blue-400" />
                        <span>Dark</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('system')} className="rounded-2xl cursor-pointer font-bold py-2.5">
                        <Laptop className="mr-3 h-4 w-4 text-slate-400" />
                        <span>System</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-4" />
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="rounded-2xl cursor-pointer text-red-500 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/30 py-3 px-4 font-bold flex items-center gap-3"
                >
                  <div className="h-8 w-8 bg-red-50 dark:bg-red-900/40 rounded-xl flex items-center justify-center shadow-sm">
                    <LogOut className="w-4 h-4" />
                  </div>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>
        
        <main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth w-full scrollbar-hide">
          <div className="p-4 md:p-6 lg:p-10 min-h-full pb-32 w-full max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
