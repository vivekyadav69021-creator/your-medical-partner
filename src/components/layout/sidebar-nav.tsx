'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Stethoscope,
  Store,
  BrainCircuit,
  HeartPulse,
  Hospital,
  BookHeart,
  ListTodo,
  Trophy,
  Wind,
  Video,
  GraduationCap,
  Settings,
  Scan,
} from 'lucide-react';

const mainNav = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const smartToolsNav = [
    { href: '/health-assistant', label: 'AI Health Assistant', icon: BrainCircuit },
    { href: '/ai-psychiatrist', label: 'AI Psychiatrist', icon: BrainCircuit },
    { href: '/disease-scanner', label: 'Disease Scanner', icon: Scan },
];

const yourHealthNav = [
    { href: '/consultation', label: 'Doctor Consultation', icon: Stethoscope },
    { href: '/store', label: 'Medical Store', icon: Store },
    { href: '/planner', label: 'My Planner', icon: ListTodo },
    { href: '/nearby-hospital', label: 'Nearby Hospitals', icon: Hospital },
    { href: '/disease-library', label: 'Disease Library', icon: BookHeart },
];

const learnNav = [
    { href: '/challenges', label: 'Health Challenges', icon: Trophy },
    { href: '/meditation-hub', label: 'Meditation Hub', icon: Wind },
    { href: '/yoga-library', label: 'Yoga Library', icon: Wind },
    { href: '/video-tutorials', label: 'Video Tutorials', icon: Video },
    { href: '/health-lessons', label: 'Health Lessons', icon: GraduationCap },
];

const settingsNav = [
    { href: '/profile', label: 'Settings', icon: Settings },
];

const NavSection = ({ title, items, onLinkClick }: { title: string, items: {href: string, label: string, icon: React.ElementType}[], onLinkClick?: () => void}) => {
    const pathname = usePathname();

    return (
        <div className="px-3 py-2">
            <h2 className="mb-2 px-2 text-sm font-semibold tracking-tight text-muted-foreground group-data-[state=collapsed]:hidden">
                {title}
            </h2>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.href)}
                        onClick={onLinkClick}
                        tooltip={item.label}
                    >
                        <Link href={item.href}>
                        <item.icon />
                        <span className="group-data-[state=expanded]:inline-flex">{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </div>
    )
}


export function SidebarNav() {
  const { setOpenMobile } = useSidebar();
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setOpenMobile(false);
    }
  };

  return (
    <div className="space-y-2 py-2">
        <NavSection title="Main" items={mainNav} onLinkClick={handleLinkClick} />
        <NavSection title="Smart Tools" items={smartToolsNav} onLinkClick={handleLinkClick} />
        <NavSection title="Your Health" items={yourHealthNav} onLinkClick={handleLinkClick} />
        <NavSection title="Learn & Practice" items={learnNav} onLinkClick={handleLinkClick} />
        <NavSection title="Configuration" items={settingsNav} onLinkClick={handleLinkClick} />
    </div>
  );
}
