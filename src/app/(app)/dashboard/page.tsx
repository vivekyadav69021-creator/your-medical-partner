
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
  BrainCircuit,
  PhoneCall,
  Clock,
  CheckCircle2,
  Bell,
  MoreHorizontal,
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
    <div className="max-w-xl mx-auto space-y-8 pb-32 animate-in fade-in duration-700 bg-background min-h-screen pt-6">
      
      {/* Unique Header Section */}
      <div className="flex items-center justify-between px-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-primary/40 animate-pulse" />
            <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Medical Partner</p>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white font-headline leading-none">
            Hello, <br />
            <span className="text-primary">{greetingName.split(' ')[0]}</span>
          </h1>
        </div>
        <div className="relative">
          <Avatar className="h-16 w-16 border-4 border-white shadow-xl">
            <AvatarImage src={userAvatar} alt={greetingName} data-ai-hint="person face" />
            <AvatarFallback><UserIcon className="h-8 w-8" /></AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-green-500 h-5 w-5 rounded-full border-4 border-white shadow-sm" />
        </div>
      </div>

      {/* Main Feature Grid 2x2 */}
      <div className="grid grid-cols-2 gap-5 px-4">
        <FeatureCard
          title="AI Health Assistant"
          icon={<Bot className="w-10 h-10 text-[#4A90E2]" />}
          href="/health-assistant"
          btnText="Ask away"
          btnColor="bg-[#E6F0FF] text-[#4A90E2]"
        />
        <FeatureCard
          title="Doctor Consult"
          icon={<Stethoscope className="w-10 h-10 text-[#FF85A1]" />}
          href="/consultation"
          btnText="Book appointment"
          btnColor="bg-[#FFF0F5] text-[#FF85A1]"
        />
        <FeatureCard
          title="Medical Store"
          icon={<Store className="w-10 h-10 text-[#9D50BB]" />}
          href="/store"
          btnText="Order medicine"
          btnColor="bg-[#F3E8FF] text-[#9D50BB]"
        />
        <FeatureCard
          title="Disease Scanner"
          icon={<Scan className="w-10 h-10 text-[#20B2AA]" />}
          href="/disease-scanner"
          btnText="Scan health"
          btnColor="bg-[#E0FDF4] text-[#20B2AA]"
        />
      </div>

      {/* Quick Access Tools (Horizontal Scroll) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-6">
          <h3 className="font-black text-[13px] text-slate-400 uppercase tracking-widest">Quick Access</h3>
          <Button variant="ghost" size="sm" className="text-primary text-[10px] font-bold">View all</Button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-hide">
          <QuickToolLink 
            icon={<BrainCircuit className="w-5 h-5" />} 
            label="AI Psychiatrist" 
            href="/ai-psychiatrist" 
            color="bg-indigo-500"
          />
          <QuickToolLink 
            icon={<PhoneCall className="w-5 h-5" />} 
            label="Emergency Doctor" 
            href="tel:112" 
            color="bg-red-500"
          />
          <QuickToolLink 
            icon={<LayoutGrid className="w-5 h-5" />} 
            label="More Tools" 
            href="/challenges" 
            color="bg-slate-800"
          />
        </div>
      </div>

      {/* Health Plan Large Card */}
      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900 mx-4">
        <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 pt-6">
          <CardTitle className="text-lg font-black text-slate-800 dark:text-slate-100">Daily Progress</CardTitle>
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-full">
             <Calendar className="w-3 h-3 text-slate-400" />
             <span className="text-[9px] font-black text-slate-400 uppercase">Oct 24</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-6 pb-8">
          <div className="h-32 w-full mt-2">
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={healthChartData}>
                  <defs>
                    <linearGradient id="colorBpt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#4A90E2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="bpt" stroke="#4A90E2" strokeWidth={4} fillOpacity={1} fill="url(#colorBpt)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#CBD5E1', fontSize: 10, fontWeight: 900}} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MetricBox label="Steps" val="7,550" total="8,000" percent={94} color="bg-teal-400" />
            <MetricBox label="Sleep" val="7" total="8h" percent={87} color="bg-indigo-400" />
          </div>
        </CardContent>
      </Card>

      {/* Upcoming & History Preview */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-[13px] text-slate-400 uppercase tracking-widest">Upcoming Bookings</h3>
          <Link href="/consultation">
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Button>
          </Link>
        </div>
        <Card className="rounded-[2rem] border-none shadow-sm bg-white dark:bg-slate-900 overflow-hidden">
          <CardContent className="p-4 space-y-3">
            <BookingItem 
              name="Dr. Shivam Yadav" 
              time="Today, 04:30 PM" 
              type="Video Call" 
              image="https://picsum.photos/seed/doc1/100/100" 
            />
            <div className="h-px bg-slate-50 w-full" />
            <BookingItem 
              name="Dr. Ananya Sharma" 
              time="Tomorrow, 10:00 AM" 
              type="In-Person" 
              image="https://picsum.photos/seed/doc2/100/100" 
            />
          </CardContent>
        </Card>
      </div>

      {/* Planner Preview Section */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-[13px] text-slate-400 uppercase tracking-widest">Today's Schedule</h3>
          <Link href="/planner">
            <Button variant="ghost" size="sm" className="text-primary text-[10px] font-bold">Manage</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <PlannerTaskItem title="Take Vitamin C Tablet" category="Medication" time="09:00 AM" completed={true} />
          <PlannerTaskItem title="Morning Jog (30 min)" category="Fitness" time="07:30 AM" completed={true} />
          <PlannerTaskItem title="Drink 2L Water" category="General" time="Throughout day" completed={false} />
        </div>
      </div>

      <AssistantSheet />
    </div>
  );
}

// Sub-components
function FeatureCard({ title, icon, href, btnText, btnColor }: { title: string, icon: any, href: string, btnText: string, btnColor: string }) {
  return (
    <Card className="rounded-[2.5rem] border-none shadow-sm bg-white dark:bg-slate-900 group hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      <Link href={href} className="p-6 flex flex-col h-full space-y-4">
        <div className="p-3 w-fit rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 group-hover:bg-white group-hover:shadow-inner transition-colors">
          {icon}
        </div>
        <CardTitle className="text-[17px] font-black leading-tight pr-2 text-slate-800 dark:text-slate-100 tracking-tight">{title}</CardTitle>
        <div className={cn("mt-auto py-2.5 px-4 rounded-full flex items-center justify-between text-[10px] font-black tracking-tight transition-all group-hover:shadow-lg", btnColor)}>
          {btnText}
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </Link>
    </Card>
  );
}

function QuickToolLink({ icon, label, href, color }: { icon: any, label: string, href: string, color: string }) {
  return (
    <Link href={href} className="flex-shrink-0 group">
      <div className="flex flex-col items-center gap-2">
        <div className={cn("h-14 w-14 rounded-[1.25rem] flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all", color)}>
          {icon}
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{label}</span>
      </div>
    </Link>
  );
}

function MetricBox({ label, val, total, percent, color }: { label: string, val: string, total: string, percent: number, color: string }) {
  return (
    <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800 space-y-3 border border-white/50">
      <div className="flex items-center gap-2">
        <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", color)} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <div className="space-y-1.5">
        <p className="text-xl font-black text-slate-800">{val} <span className="text-[10px] text-slate-400 font-bold">/ {total}</span></p>
        <Progress value={percent} className="h-2 bg-slate-200" />
      </div>
    </div>
  );
}

function BookingItem({ name, time, type, image }: { name: string, time: string, type: string, image: string }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-12 w-12 rounded-2xl border-2 border-slate-50">
        <AvatarImage src={image} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-slate-800 truncate tracking-tight">{name}</p>
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> {time}
          </p>
          <div className="h-1 w-1 rounded-full bg-slate-200" />
          <p className="text-[10px] font-black text-primary uppercase">{type}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-slate-50">
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </Button>
    </div>
  );
}

function PlannerTaskItem({ title, category, time, completed }: { title: string, category: string, time: string, completed: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded-[1.5rem] flex items-center gap-4 border transition-all",
      completed ? "bg-white/50 border-slate-100 opacity-60" : "bg-white border-white shadow-sm"
    )}>
      <div className={cn(
        "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
        completed ? "bg-primary border-primary text-white" : "border-slate-200"
      )}>
        {completed && <CheckCircle2 className="w-4 h-4" />}
      </div>
      <div className="flex-1">
        <p className={cn("text-xs font-black tracking-tight", completed ? "line-through text-slate-400" : "text-slate-800")}>{title}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{category} • {time}</p>
      </div>
      <MoreHorizontal className="w-4 h-4 text-slate-300" />
    </div>
  );
}
