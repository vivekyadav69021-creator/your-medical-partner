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
  Hospital,
  BookHeart,
  BrainCircuit,
  ListTodo,
  Trophy,
  Scan,
  Wind,
  Video,
  GraduationCap,
  FileText,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/consultation', label: 'Consultations', icon: Stethoscope },
  { href: '/store', label: 'Medical Store', icon: Store },
  { href: '/planner', label: 'My Planner', icon: ListTodo },
  { href: '/challenges', label: 'Challenges', icon: Trophy },
  { href: '/meditation-hub', label: 'Meditation Hub', icon: Wind },
  { href: '/yoga-library', label: 'Yoga Library', icon: Wind },
  { href: '/video-tutorials', label: 'Video Tutorials', icon: Video },
  { href: '/health-lessons', label: 'Health Lessons', icon: GraduationCap },
  { href: '/health-assistant', label: 'AI Health Assistant', icon: Bot },
  { href: '/ai-psychiatrist', label: 'AI Psychiatrist', icon: BrainCircuit },
  { href: '/disease-scanner', label: 'Disease Scanner', icon: Scan },
  { href: '/nearby-hospital', label: 'Nearby Hospitals', icon: Hospital },
  { href: '/disease-library', label: 'Disease Library', icon: BookHeart },
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
