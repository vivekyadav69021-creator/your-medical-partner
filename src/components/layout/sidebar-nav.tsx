'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Stethoscope,
  Store,
  Bot,
  HeartPulse,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/consultation', label: 'Consultations', icon: Stethoscope },
  { href: '/store', label: 'Medical Store', icon: Store },
  { href: '/symptom-checker', label: 'Symptom Checker', icon: Bot },
  { href: '/health-score', label: 'Health Score', icon: HeartPulse },
  { href: '/health-assistant', label: 'AI Assistant', icon: Bot },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
