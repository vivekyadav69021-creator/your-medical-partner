
'use client';

import { useEffect, useState } from 'react';
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
  ChevronRight,
  Store,
  Scan,
  BrainCircuit,
  PhoneCall,
  Activity,
  HeartPulse,
  ShieldPlus,
  Settings,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  Apple,
  Sparkles
} from 'lucide-react';
import { Area, AreaChart, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AssistantSheet } from '@/components/ai-flow-assistant/assistant-sheet';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/context/user-profile-context';
import { useToast } from '@/hooks/use-toast';

const healthChartData = [
  { day: 'Mon', score: 40 },
  { day: 'Tue', score: 60 },
  { day: 'Wed', score: 45 },
  { day: 'Thu', score: 70 },
  { day: 'Fri', score: 55 },
  { day: 'Sat', score: 80 },
  { day: 'Sun', score: 65 },
];

export default function DashboardPage() {
  const { userName, userImage } = useUserProfile();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const savedAppts = localStorage.getItem('appointments');
    if (savedAppts) setAppointments(JSON.parse(savedAppts).slice(0, 1));

    const savedTasks = localStorage.getItem('guest_planner_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks).slice(0, 3));

    const hasGreeted = sessionStorage.getItem('hasGreeted');
    if (!hasGreeted && userName !== 'Guest') {
      toast({
        title: `Welcome, ${userName.split(' ')[0]}! 👋`,
        description: "Your health center is ready.",
      });
      sessionStorage.setItem('hasGreeted', 'true');
    }
  }, [userName, toast]);

  return (
    <div className="animate-in fade-in duration-700 space-y-6 pb-32 font-body safe-top">
      
      {/* Compact Native-Style Header */}
      <div className="mx-2 p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] border border-white/40 dark:border-slate-800/40 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/profile" className="shrink-0">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-md">
                <AvatarImage src={userImage} className="object-cover" />
                <AvatarFallback className="bg-primary text-white font-black text-lg">
                  {userName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-white dark:bg-slate-700 rounded-full shadow-md flex items-center justify-center border border-slate-100 dark:border-slate-600">
                <Settings className="w-2.5 h-2.5 text-primary" />
              </div>
            </div>
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight leading-tight truncate">
              Hi, <span className="text-primary">{userName.split(' ')[0]}</span>
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Health Guardian v2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
            <div className="h-8 px-3 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-primary uppercase tracking-widest">Active</span>
            </div>
        </div>
      </div>

      {/* Grid: Essential Health Services (Compact Mini Cards) */}
      <div className="space-y-4 px-2">
        <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.25em]">Smart Services</h3>
            <Sparkles className="w-3 h-3 text-primary/40" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <MiniServiceCard 
            title="AI Assistant" 
            icon={ShieldPlus} 
            href="/health-assistant" 
            color="text-blue-500" 
            bg="bg-blue-50/50 dark:bg-blue-900/10" 
          />
          <MiniServiceCard 
            title="Food Scan" 
            icon={Apple} 
            href="/food-scanner" 
            color="text-pink-500" 
            bg="bg-pink-50/50 dark:bg-pink-900/10" 
          />
          <MiniServiceCard 
            title="Records" 
            icon={Scan} 
            href="/disease-scanner" 
            color="text-amber-500" 
            bg="bg-orange-50/50 dark:bg-orange-900/10" 
          />
          <MiniServiceCard 
            title="Pharmacy" 
            icon={Store} 
            href="/store" 
            color="text-purple-500" 
            bg="bg-purple-50/50 dark:bg-purple-900/10" 
          />
        </div>
      </div>

      {/* Main Agenda Section */}
      <div className="grid grid-cols-1 gap-6 px-2">
        
        {/* Health Pulse (Refined Chart) */}
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 overflow-hidden border border-slate-50 dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 pt-6">
              <div>
                <CardTitle className="text-lg font-black text-[#2D3A5D] dark:text-slate-100">Health Pulse</CardTitle>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Weekly Status</p>
              </div>
              <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="h-32 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthChartData}>
                    <defs>
                      <linearGradient id="pulseGrad" x1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2488E8" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2488E8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="score" stroke="#2488E8" strokeWidth={4} fill="url(#pulseGrad)" animationDuration={2000} />
                    <XAxis dataKey="day" hide />
                    <Tooltip content={<ChartTooltip />} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <MetricTiny label="Steps" value="7.5k" progress={92} />
                <MetricTiny label="Sleep" value="7.2h" progress={88} />
              </div>
            </CardContent>
          </Card>

        {/* Dynamic Column for Bookings and Tasks */}
        <div className="space-y-6">
          
          {/* Upcoming Booking (Sleek Inline Card) */}
          <div className="space-y-3">
            <h3 className="font-black text-[9px] text-slate-400 uppercase tracking-[0.2em] px-4">Active Appointment</h3>
            {appointments.length > 0 ? (
              appointments.map((appt, i) => (
                <Link href="/consultation" key={i} className="block active:scale-[0.98] transition-all">
                    <div className="mx-1 p-4 rounded-[1.8rem] bg-white dark:bg-slate-900 border border-blue-50 dark:border-blue-900/30 shadow-lg flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-[#2D3A5D] dark:text-slate-100 truncate">{appt.doctorName}</p>
                            <div className="flex items-center gap-3 text-[8px] font-black text-slate-400 uppercase mt-0.5">
                                <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {appt.time}</span>
                                <span className="text-emerald-500">Confirmed</span>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                </Link>
              ))
            ) : (
                <div className="mx-1 p-5 rounded-[1.8rem] border-dashed border-2 border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-center">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">No Active Bookings</p>
                </div>
            )}
          </div>

          {/* Daily Schedule (Native List Style) */}
          <Card className="rounded-[2.2rem] border-none shadow-xl bg-white dark:bg-slate-900 mx-1 p-2">
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-black text-[10px] text-[#2D3A5D] dark:text-slate-400 uppercase tracking-[0.2em]">Today's Plan</h3>
                <Link href="/planner" className="text-[8px] font-black uppercase text-primary">View All</Link>
              </div>
              <div className="space-y-2">
                {tasks.length > 0 ? (
                  tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-white dark:border-slate-800">
                      <div className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center border-2 shrink-0",
                        task.completed ? "bg-primary border-primary text-white" : "border-slate-200 dark:border-slate-700"
                      )}>
                        {task.completed && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <p className={cn(
                        "text-[11px] font-bold flex-1 truncate",
                        task.completed ? "text-slate-300 dark:text-slate-600 line-through" : "text-[#2D3A5D] dark:text-slate-200"
                      )}>
                        {task.title}
                      </p>
                    </div>
                  ))
                ) : (
                   <p className="text-[9px] text-center text-slate-400 py-2">No tasks scheduled</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Emergency Quick Action */}
      <div className="px-3 pt-2">
        <Link href="/nearby-hospital" className="block active:scale-[0.97] transition-all">
          <div className="p-4 rounded-[1.8rem] bg-red-500 shadow-xl shadow-red-500/20 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-white/20 rounded-2xl flex items-center justify-center text-white border border-white/30 backdrop-blur-md">
                <PhoneCall className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-white">
                <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80">Need Help?</p>
                <p className="text-sm font-black uppercase">Emergency Hub</p>
              </div>
            </div>
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
               <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>

      <AssistantSheet />
    </div>
  );
}

function MiniServiceCard({ title, icon: Icon, href, color, bg }: any) {
  return (
    <Link href={href} className="group active:scale-95 transition-all duration-300 block h-full">
      <div className={cn(
        "rounded-[1.8rem] border shadow-sm transition-all duration-500 h-full flex items-center gap-3 p-3.5 relative overflow-hidden",
        bg,
        "border-white/50 dark:border-slate-800/50"
      )}>
        <div className={cn("h-10 w-10 rounded-2xl shadow-sm flex items-center justify-center bg-white dark:bg-slate-800 transition-transform duration-500 group-hover:rotate-6", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">{title}</h4>
          <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Explore</p>
        </div>
      </div>
    </Link>
  );
}

function MetricTiny({ label, value, progress }: any) {
  return (
    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-white dark:border-slate-700 shadow-inner">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-[8px] font-black text-primary">{progress}%</span>
      </div>
      <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 tracking-tight">{value}</p>
      <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
        <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A365D] dark:bg-slate-900 p-2 rounded-xl border border-white/10 text-center shadow-xl">
        <p className="text-[7px] font-black text-white uppercase">{payload[0].value}% Health</p>
      </div>
    );
  }
  return null;
}
