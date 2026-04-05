'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bot,
  Stethoscope,
  Scan,
  Store,
  Calendar,
  ChevronRight,
  User as UserIcon,
  Search,
  FileText,
  LayoutGrid,
} from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { AssistantSheet } from '@/components/ai-flow-assistant/assistant-sheet';
import { cn } from '@/lib/utils';

type UserProfile = {
  name: string;
  image: string;
};

const healthChartData = [
  { day: '20', bpt: 40 },
  { day: '01', bpt: 60 },
  { day: '02', bpt: 45 },
  { day: '23', bpt: 70 },
  { day: 'Today', bpt: 55 },
];

export default function DashboardPage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user) return;
    try {
      const savedProfile = localStorage.getItem(`userMedicalProfile_${user.uid}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.error("Failed to load profile", e);
    }
  }, [user]);

  const greetingName = profile?.name || user?.displayName || 'Guest';
  const userAvatar = profile?.image || user?.photoURL || 'https://picsum.photos/seed/user/100/100';

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700 bg-background min-h-screen pt-4">
      {/* Header Section */}
      <div className="flex items-center justify-between px-2">
        <div className="space-y-0.5">
          <p className="text-slate-400 text-sm font-medium">Welcome back!</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-headline">
            {greetingName}
          </h1>
        </div>
        <Avatar className="h-14 w-14 border-4 border-white shadow-sm">
          <AvatarImage src={userAvatar} alt={greetingName} data-ai-hint="person face" />
          <AvatarFallback><UserIcon className="h-7 w-7" /></AvatarFallback>
        </Avatar>
      </div>

      {/* Main Feature Grid 2x2 */}
      <div className="grid grid-cols-2 gap-5 px-1">
        {/* AI Health Assistant */}
        <FeatureCard
          title="AI Health Assistant"
          icon={<Bot className="w-10 h-10 text-[#4A90E2]" />}
          href="/health-assistant"
          btnText="Ask away"
          btnColor="bg-[#E6F0FF] text-[#4A90E2]"
        />
        {/* Doctor Consult */}
        <FeatureCard
          title="Doctor Consult"
          icon={<Stethoscope className="w-10 h-10 text-[#FF85A1]" />}
          href="/consultation"
          btnText="Book appointment"
          btnColor="bg-[#FFF0F5] text-[#FF85A1]"
        />
        {/* Medical Store */}
        <FeatureCard
          title="Medical Store"
          icon={<Store className="w-10 h-10 text-[#9D50BB]" />}
          href="/store"
          btnText="Order medicine"
          btnColor="bg-[#F3E8FF] text-[#9D50BB]"
        />
        {/* Disease Scanner */}
        <FeatureCard
          title="Disease Scanner"
          icon={<Scan className="w-10 h-10 text-[#20B2AA]" />}
          href="/disease-scanner"
          btnText="Scan health"
          btnColor="bg-[#E0FDF4] text-[#20B2AA]"
        />
      </div>

      {/* Health Plan Large Card */}
      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900 mx-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 pt-6">
          <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">Health Plan</CardTitle>
          <Button variant="ghost" size="sm" className="text-slate-400 gap-1 rounded-full bg-slate-50 px-3 h-8">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase">Today</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-8">
          {/* Chart placeholder style */}
          <div className="h-28 w-full mt-2">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthChartData}>
                  <defs>
                    <linearGradient id="colorBpt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="bpt" stroke="#4A90E2" strokeWidth={3} fillOpacity={1} fill="url(#colorBpt)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#CBD5E1', fontSize: 10}} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Steps Metric */}
            <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800 space-y-3 border border-white/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Steps</p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xl font-black text-slate-800">7,550 <span className="text-[10px] text-slate-400 font-bold">/ 8,000</span></p>
                <Progress value={94} className="h-1.5 bg-slate-200" />
              </div>
            </div>
            {/* Sleep Metric */}
            <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800 space-y-3 border border-white/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sleep</p>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-indigo-500" />
                <p className="text-xl font-black text-slate-800">7 <span className="text-[10px] text-slate-400 font-bold">hours</span></p>
              </div>
              <Progress value={70} className="h-1.5 bg-slate-200" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Dock style Navigation */}
      <div className="flex justify-between items-center gap-4 px-2">
        <DockButton icon={<Calendar className="w-6 h-6 text-orange-400" />} label="Planner" href="/planner" />
        <DockButton icon={<FileText className="w-6 h-6 text-cyan-400" />} label="Reports" href="/analysis" />
        <DockButton icon={<LayoutGrid className="w-6 h-6 text-slate-400" />} label="More" href="/challenges" />
      </div>

      <AssistantSheet />
    </div>
  );
}

// Sub-components for cleaner structure
function FeatureCard({ title, icon, href, btnText, btnColor }: { title: string, icon: any, href: string, btnText: string, btnColor: string }) {
  return (
    <Card className="rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-slate-900 group hover:scale-[1.02] transition-all duration-300">
      <Link href={href} className="p-6 flex flex-col h-full space-y-4">
        <div className="p-3 w-fit rounded-[1.25rem] bg-slate-50 dark:bg-slate-800 group-hover:bg-white group-hover:shadow-inner transition-colors">
          {icon}
        </div>
        <CardTitle className="text-[17px] font-bold leading-tight pr-2 text-slate-800 dark:text-slate-100">{title}</CardTitle>
        <div className={cn("mt-auto py-2 px-4 rounded-full flex items-center justify-between text-[11px] font-black tracking-tight transition-all group-hover:shadow-md", btnColor)}>
          {btnText}
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </Link>
    </Card>
  );
}

function DockButton({ icon, label, href }: { icon: any, label: string, href: string }) {
  return (
    <Link href={href} className="flex-1">
      <Card className="rounded-[2rem] border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900 overflow-hidden">
        <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
          <div className="p-2.5 rounded-[1rem] bg-slate-50 dark:bg-slate-800">
            {icon}
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}