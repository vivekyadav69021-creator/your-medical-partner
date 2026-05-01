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
import { HeartPulse, ShoppingCart, User as UserIcon, Moon, Sun, Laptop, LogOut } from 'lucide-react';
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

      // Only toggle if scrolled more than a small threshold
      if (scrollDistance > 5) {
        if (isScrollingDown && currentScrollY > 80) {
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
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-3">
            <HeartPulse className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary group-data-[state=collapsed]:hidden">Your Medical Partner</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="group-data-[state=collapsed]:hidden">
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col relative" style={{ background: 'var(--dashboard-bg)', backgroundAttachment: 'fixed' }}>
        <header 
          className={cn(
            "flex h-16 items-center justify-between p-4 sticky top-0 z-40 bg-white/10 backdrop-blur-md border-b border-white/10 transition-all duration-500 ease-in-out",
            showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
        >
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1 px-4 hidden md:block">
             <div className="inline-block glowing-underline pb-1 pr-4">
                <span className="text-lg font-black tracking-tighter text-[#2488E8] font-headline uppercase">Your Medical Partner</span>
             </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild title="Cart" className="rounded-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-md shadow-sm border border-white/20">
              <Link href="/store/cart" className="relative">
                <ShoppingCart className="w-5 h-5 text-[#2D3A5D] dark:text-slate-200" />
                {itemCount > 0 && (
                   <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0 text-[10px]">{itemCount}</Badge>
                )}
              </Link>
            </Button>
            
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-12 w-12 p-0 rounded-full border-2 border-white/50 dark:border-slate-700/50 shadow-sm overflow-hidden flex items-center justify-center" title="Settings">
                  <Avatar className="h-full w-full">
                      <AvatarImage src={userImage} alt={userName} className="object-cover" data-ai-hint="person face" />
                      <AvatarFallback>
                          <UserIcon />
                      </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl border-none shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                 <DropdownMenuItem asChild className="rounded-xl cursor-pointer">
                   <Link href="/profile" className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    My Profile
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="rounded-xl">
                    Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="rounded-2xl border-none shadow-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
                      <DropdownMenuItem onClick={() => setTheme('light')} className="rounded-xl cursor-pointer">
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')} className="rounded-xl cursor-pointer">
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('system')} className="rounded-xl cursor-pointer">
                        <Laptop className="mr-2 h-4 w-4" />
                        <span>System</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem 
                  onClick={handleSignOut} 
                  className="rounded-xl cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>
        
        <main ref={mainRef} className="flex-1 overflow-y-auto scroll-smooth">
          <div className="p-4 md:p-6 lg:p-8 min-h-full pb-20">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
