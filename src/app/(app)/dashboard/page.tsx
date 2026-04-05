'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Bot,
  Stethoscope,
  Scan,
  Store,
  Calendar,
  ChevronRight,
  User as UserIcon,
  Search,
  Activity,
  BedDouble,
  FileText,
  LayoutGrid,
} from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
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
  { day: '20', bpt: 40, asb: 20 },
  { day: '01', bpt: 60, asb: 30 },
  { day: '02', bpt: 45, asb: 45 },
  { day: '23', bpt: 70, asb: 25 },
  { day: 'Today', bpt: 55, asb: 50 },
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
    <div className="max-w-xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <p className="text-slate-400 text-lg font-medium">Welcome back!</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-headline">
            {greetingName}
          </h1>
        </div>
        <Avatar className="h-16 w-16 border-4 border-white shadow-sm">
          <AvatarImage src={userAvatar} alt={greetingName} data-ai-hint="person face" />
          <AvatarFallback><UserIcon className="h-8 w-8" /></AvatarFallback>
        </Avatar>
      </div>

      {/* Main Feature Grid 2x2 */}
      <div className="grid grid-cols-2 gap-5">
        {/* AI Health Assistant */}
        <FeatureCard
          title="AI Health Assistant"
          icon={<Bot className="w-12 h-12 text-blue-500" />}
          href="/health-assistant"
          btnText="Ask away"
          btnColor="bg-[#E6F0FF] text-[#4A90E2]"
        />
        {/* Doctor Consult */}
        <FeatureCard
          title="Doctor Consult"
          icon={<Stethoscope className="w-12 h-12 text-pink-500" />}
          href="/consultation"
          btnText="Book appointment"
          btnColor="bg-[#FFF0F5] text-[#FF85A1]"
        />
        {/* Medical Store */}
        <FeatureCard
          title="Medical Store"
          icon={<Store className="w-12 h-12 text-purple-500" />}
          href="/store"
          btnText="Order medicine"
          btnColor="bg-[#F3E8FF] text-[#9D50BB]"
        />
        {/* Disease Scanner */}
        <FeatureCard
          title="Disease Scanner"
          icon={<Scan className="w-12 h-12 text-teal-500" />}
          href="/disease-scanner"
          btnText="Scan health"
          btnColor="bg-[#E0FDF4] text-[#20B2AA]"
        />
      </div>

      {/* Health Plan Large Card */}
      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">Health Plan</CardTitle>
          <Button variant="ghost" size="sm" className="text-slate-400 gap-1 rounded-full bg-slate-50 px-3">
            <Search className="w-4 h-4" />
            <span className="text-xs">Today</span>
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Chart placeholder style */}
          <div className="h-32 w-full mt-2">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthChartData}>
                  <defs>
                    <linearGradient id="colorBpt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="bpt" stroke="#4A90E2" strokeWidth={3} fillOpacity={1} fill="url(#colorBpt)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Steps Metric */}
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Steps</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">7,550 <span className="text-xs text-slate-400 font-normal">8,000</span></p>
                <Progress value={94} className="h-1.5 bg-slate-200" />
              </div>
            </div>
            {/* Sleep Metric */}
            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sleep</p>
              </div>
              <div className="flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-indigo-500" />
                <p className="text-2xl font-bold">7 <span className="text-xs text-slate-400 font-normal">hours</span></p>
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
    <Card className="rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-slate-900 group hover:scale-[1.02] transition-all">
      <Link href={href} className="p-6 flex flex-col h-full space-y-4">
        <div className="p-2 w-fit rounded-2xl bg-slate-50 dark:bg-slate-800">
          {icon}
        </div>
        <CardTitle className="text-lg font-bold leading-tight pr-4">{title}</CardTitle>
        <div className={cn("mt-auto py-2 px-4 rounded-full flex items-center justify-between text-xs font-bold transition-opacity group-hover:opacity-90", btnColor)}>
          {btnText}
          <ChevronRight className="w-4 h-4" />
        </div>
      </Link>
    </Card>
  );
}

function DockButton({ icon, label, href }: { icon: any, label: string, href: string }) {
  return (
    <Link href={href} className="flex-1">
      <Card className="rounded-3xl border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
        <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
          <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800">
            {icon}
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        </CardContent>
      </Card>
    </Link>
  );
}