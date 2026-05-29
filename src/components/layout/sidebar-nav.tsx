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
  LogOut,
  Info,
  Apple
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';

const mainNav = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const smartToolsNav = [
    { href: '/health-assistant', label: 'AI Health Assistant', icon: ShieldPlus },
    { href: '/ai-psychiatrist', label: 'AI Psychiatrist', icon: BrainCircuit },
    { href: '/disease-scanner', label: 'Disease Scanner', icon: Scan },
    { href: '/food-scanner', label: 'Food AI Scanner', icon: Apple },
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
    { href: '/about', label: 'About & Privacy', icon: Info },
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
  const auth = useAuth();
  
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setOpenMobile(false);
    }
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('userMedicalProfile_local');
    } catch (e) {
        console.error("Logout Error:", e);
    }
  };

  return (
    <div className="space-y-1 pb-10 flex flex-col h-full bg-white dark:bg-slate-900">
        <NavSection title="Main" items={mainNav} onLinkClick={handleLinkClick} />
        <NavSection title="Smart AI Tools" items={smartToolsNav} onLinkClick={handleLinkClick} />
        <NavSection title="Your Health" items={yourHealthNav} onLinkClick={handleLinkClick} />
        <NavSection title="Learn & Practice" items={learnNav} onLinkClick={handleLinkClick} />
        <NavSection title="Configuration" items={settingsNav} onLinkClick={handleLinkClick} />
        
        <div className="px-3 py-4 mt-auto">
            <Button 
                variant="ghost" 
                className="w-full justify-start gap-4 px-4 py-6 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 font-bold border border-transparent hover:border-red-100 dark:hover:border-red-900/30 transition-all"
                onClick={handleLogout}
            >
                <LogOut className="w-5 h-5" />
                <span className="group-data-[state=collapsed]:hidden tracking-tight">Sign Out</span>
            </Button>
        </div>
    </div>
  );
}
