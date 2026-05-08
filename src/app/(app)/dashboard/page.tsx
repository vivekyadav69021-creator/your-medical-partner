'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Calendar,
  Stethoscope,
  Store,
  Scan,
  BrainCircuit,
  PhoneCall,
  Activity,
  HeartPulse,
  ShieldPlus,
  Settings,
} from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AssistantSheet } from '@/components/ai-flow-assistant/assistant-sheet';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/context/user-profile-context';
import { useToast } from '@/hooks/use-toast';

const healthChartData = [
  { day: '20', bpt: 40 },
  { day: '01', bpt: 60 },
  { day: '02', bpt: 45 },
  { day: '23', bpt: 70 },
  { day: 'Today', bpt: 55 },
];

export default function DashboardPage() {
  const { userName, userImage } = useUserProfile();
  const { toast } = useToast();

  useEffect(() => {
    const hasGreeted = sessionStorage.getItem('hasGreeted');
    if (!hasGreeted && userName !== 'Guest') {
      toast({
        title: `Welcome, ${userName.split(' ')[0]}! 👋`,
        description: "Your health journey starts here.",
        duration: 5000,
      });
      sessionStorage.setItem('hasGreeted', 'true');
    }
  }, [userName, toast]);

  return (
    <div className="animate-in fade-in duration-500 space-y-8 px-2 md:px-0">
      
      {/* Premium Profile Header Section */}
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between gap-6 p-4 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/40 shadow-sm">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50/80 rounded-full border border-blue-100 shadow-sm mb-1">
              <HeartPulse className="w-3 h-3 text-[#2488E8] animate-pulse" />
              <p className="text-[#2488E8] text-[8px] font-black uppercase tracking-widest">Medical Partner</p>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#2D3A5D] leading-tight truncate">
              Hi, <span className="text-primary">{userName.split(' ')[0]}</span>
            </h1>
          </div>

          <Link href="/profile" className="shrink-0">
            <div className="relative group">
              <Avatar className="h-16 w-16 md:h-18 md:w-18 border-4 border-white shadow-xl transition-all duration-300 group-hover:scale-105 active:scale-95">
                <AvatarImage src={userImage} className="object-cover" />
                <AvatarFallback className="bg-primary text-white font-black text-xl uppercase">
                  {userName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-white rounded-full shadow-md flex items-center justify-center border border-slate-100 transition-transform group-hover:rotate-12">
                <Settings className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Essential Services Grid */}
        <div className="space-y-4">
          <h3 className="font-black text-[11px] text-[#2D3A5D]/50 uppercase tracking-widest px-2">Health Center</h3>
          <div className="grid grid-cols-2 gap-4">
            <FeatureCard title="AI Assistant" description="24/7 Expert Help" icon={ShieldPlus} iconColor="text-blue-500" href="/health-assistant" btnText="Ask" btnGradient="from-blue-500/10 to-blue-600/10" />
            <FeatureCard title="Doctor" description="Expert Booking" icon={Stethoscope} iconColor="text-pink-500" href="/consultation" btnText="Book" btnGradient="from-pink-500/10 to-pink-600/10" />
            <FeatureCard title="Pharmacy" description="Medicine Store" icon={Store} iconColor="text-purple-500" href="/store" btnText="Order" btnGradient="from-purple-500/10 to-purple-600/10" />
            <FeatureCard title="Scanner" description="Instant Analysis" icon={Scan} iconColor="text-teal-500" href="/disease-scanner" btnText="Scan" btnGradient="from-teal-500/10 to-teal-600/10" />
          </div>
        </div>

        {/* Daily Score Section */}
        <Card className="rounded-[3rem] border-none shadow-sm neumorphic-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-8 pt-8">
            <CardTitle className="text-xl font-black text-[#2D3A5D]">Health Pulse</CardTitle>
            <div className="px-3 py-1 bg-primary/10 rounded-full">
               <span className="text-[9px] font-black text-primary uppercase">Oct 2024</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-10">
            <div className="h-40 w-full mt-2">
              <ChartContainer config={{}} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthChartData}>
                    <defs>
                      <linearGradient id="colorBpt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2488E8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2488E8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="bpt" stroke="#2488E8" strokeWidth={4} fill="url(#colorBpt)" animationDuration={1500} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 900}} />
                    <Tooltip content={<CustomTooltip />} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <MetricBox label="Steps" val="7,5k" total="8k" percent={94} gradient="from-blue-500 to-teal-400" />
              <MetricBox label="Sleep" val="7h" total="8h" percent={87} gradient="from-purple-500 to-indigo-500" />
            </div>
          </CardContent>
        </Card>

        {/* Red Emergency Action */}
        <Link href="tel:112" className="block">
          <div className="p-6 rounded-[2.5rem] bg-red-500 shadow-xl shadow-red-200 flex items-center justify-between group active:scale-95 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <PhoneCall className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div className="text-white">
                <p className="text-xs font-black uppercase tracking-widest opacity-80">Emergency</p>
                <p className="text-lg font-black leading-none">Instant Help 112</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white/50 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      <AssistantSheet />
    </div>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-blue-50 text-[10px] font-black text-primary uppercase">
        {payload[0].value}% Health
      </div>
    );
  }
  return null;
}

function FeatureCard({ title, description, icon: Icon, iconColor, href, btnText, btnGradient }: any) {
  return (
    <Card className="rounded-[2.5rem] border border-white/40 bg-white/50 backdrop-blur-md hover:scale-[1.03] transition-all duration-300 shadow-sm">
      <Link href={href} className="p-5 flex flex-col items-center text-center space-y-3">
        <div className="p-3.5 bg-white rounded-2xl shadow-inner">
          <Icon className={cn("w-8 h-8", iconColor)} />
        </div>
        <div className="space-y-0.5">
          <CardTitle className="text-xs font-black text-[#2D3A5D] uppercase tracking-tight">{title}</CardTitle>
          <p className="text-[9px] text-slate-400 font-bold">{description}</p>
        </div>
        <div className={cn("mt-2 py-2 w-full rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm", btnGradient)}>
          {btnText}
        </div>
      </Link>
    </Card>
  );
}

function MetricBox({ label, val, total, percent, gradient }: any) {
  return (
    <div className="p-5 rounded-[2rem] bg-slate-50/50 space-y-3 border border-white">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="space-y-2">
        <p className="text-xl font-black text-[#2D3A5D]">{val} <span className="text-[9px] text-slate-400">/ {total}</span></p>
        <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
          <div className={cn("h-full bg-gradient-to-r rounded-full transition-all duration-1000", gradient)} style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
