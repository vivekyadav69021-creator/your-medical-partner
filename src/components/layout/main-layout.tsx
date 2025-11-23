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
import { UserNav } from './user-nav';
import { ThemeToggle } from '../theme-toggle';
import { HeartPulse } from 'lucide-react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <HeartPulse className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold font-headline text-primary">Your Medical Partner</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter>
          {/* Footer content if any */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 overflow-y-auto md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
