
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
  Activity,
  BedDouble,
  Flame,
} from 'lucide-react';
import { Separator } from '../ui/separator';

const mainNav = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const aiToolsNav = [
    { href: '/health-assistant', label: 'AI Health Assistant', icon: Bot },
    { href: '/ai-psychiatrist', label: 'AI Psychiatrist', icon: BrainCircuit },
    { href: '/disease-scanner', label: 'Disease Scanner', icon: Scan },
];

const servicesNav = [
    { href: '/consultation', label: 'Doctors Consult', icon: Stethoscope },
    { href: '/store', label: 'Medical Store', icon: Store },
    { href: '/planner', label: 'My Planner', icon: ListTodo },
    { href: '/nearby-hospital', label: 'Nearby Hospitals', icon: Hospital },
];

const learnNav = [
    { href: '/challenges', label: 'Challenges', icon: Trophy },
    { href: '/meditation-hub', label: 'Meditation Hub', icon: Wind },
    { href: '/yoga-library', label: 'Yoga Library', icon: Wind },
    { href: '/video-tutorials', label: 'Video Tutorials', icon: Video },
    { href: '/health-lessons', label: 'Health Lessons', icon: GraduationCap },
];

const resourcesNav = [
    { href: '/disease-library', label: 'Disease Library', icon: BookHeart },
]

const NavSection = ({ title, items, onLinkClick }: { title: string, items: {href: string, label: string, icon: React.ElementType}[], onLinkClick?: () => void}) => {
    const pathname = usePathname();
    return (
        <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                {title}
            </h2>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.href)}
                        onClick={onLinkClick}
                    >
                        <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
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
    setOpenMobile(false);
  };

  return (
    <div className="space-y-4 py-4">
        <NavSection title="Main" items={mainNav} onLinkClick={handleLinkClick} />
        <NavSection title="AI Tools" items={aiToolsNav} onLinkClick={handleLinkClick} />
        <NavSection title="Services" items={servicesNav} onLinkClick={handleLinkClick} />
        <NavSection title="Learn & Practice" items={learnNav} onLinkClick={handleLinkClick} />
        <NavSection title="Resources" items={resourcesNav} onLinkClick={handleLinkClick} />
    </div>
  );
}
