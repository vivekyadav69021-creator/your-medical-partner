
import React from 'react';
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
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfile } from '@/context/user-profile-context';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { cart } = useCart();
  const { userImage, userName } = useUserProfile();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged out successfully" });
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Logout Failed', description: 'An error occurred while logging out.' });
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
          {/* Footer content if any */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="flex h-16 items-center justify-between p-4 border-b">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/store/cart" className="relative">
                <ShoppingCart />
                {itemCount > 0 && (
                   <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{itemCount}</Badge>
                )}
              </Link>
            </Button>
            
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                      <AvatarImage src={user?.photoURL || userImage} alt={user?.displayName || userName} data-ai-hint="person face" />
                      <AvatarFallback>
                          <UserIcon />
                      </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                 <DropdownMenuItem asChild>
                   <Link href="/profile">
                    Profile
                   </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme('light')}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('system')}>
                        <Laptop className="mr-2 h-4 w-4" />
                        <span>System</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>
        <main className="flex-1 p-4 overflow-y-auto md:p-6 lg:p-8 bg-secondary/50 dark:bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
