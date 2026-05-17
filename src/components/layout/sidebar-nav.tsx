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
  Flower,
  Video,
  GraduationCap,
  Settings,
  Scan,
  ShieldPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mainNav = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const smartToolsNav = [
    { href: '/health-assistant', label: 'AI Health Assistant', icon: ShieldPlus },
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
    { href: '/yoga-library', label: 'Yoga Library', icon: Flower },
    { href: '/video-tutorials', label: 'Video Library', icon: Video },
    { href: '/health-lessons', label: 'Health Lessons', icon: GraduationCap },
];

const settingsNav = [
    { href: '/profile', label: 'Settings', icon: Settings },
];

const NavSection = ({ title, items, onLinkClick }: { title: string, items: {href: string, label: string, icon: React.ElementType}[], onLinkClick?: () => void}) => {
    const pathname = usePathname();

    return (
        <div className="px-3 py-4">
            <h2 className={cn(
                "mb-3 px-4 text-[11px] font-black uppercase tracking-[0.25em] text-[#2D3A5D]/60 dark:text-primary/80",
                "group-data-[state=collapsed]:hidden"
            )}>
                {title}
            </h2>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                onClick={onLinkClick}
                                tooltip={item.label}
                                className={cn(
                                    "transition-all duration-300 rounded-2xl px-4 py-6 mb-1 h-12 border border-transparent",
                                    isActive 
                                        ? "bg-primary text-white shadow-lg shadow-primary/25 border-none scale-[1.02]" 
                                        : "hover:bg-primary/10 hover:border-primary/20 text-[#2D3A5D] dark:text-slate-300 font-bold"
                                )}
                            >
                                <Link href={item.href} className="flex items-center gap-4">
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-primary")} />
                                    <span className={cn(
                                        "text-sm tracking-tight",
                                        "group-data-[state=collapsed]:hidden"
                                    )}>
                                        {item.label}
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
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
    <div className="space-y-1 pb-10 bg-white dark:bg-slate-900">
        <NavSection title="Main" items={mainNav} onLinkClick={handleLinkClick} />
        <NavSection title="Smart AI Tools" items={smartToolsNav} onLinkClick={handleLinkClick} />
        <NavSection title="Your Health" items={yourHealthNav} onLinkClick={handleLinkClick} />
        <NavSection title="Learn & Practice" items={learnNav} onLinkClick={handleLinkClick} />
        <NavSection title="Configuration" items={settingsNav} onLinkClick={handleLinkClick} />
    </div>
  );
}