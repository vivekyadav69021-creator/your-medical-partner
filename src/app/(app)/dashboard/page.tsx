'use client';

import { useEffect, useState } from 'react';
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
  Store,
  Scan,
  BrainCircuit,
  PhoneCall,
  Activity,
  ShieldPlus,
  Calendar,
  Clock,
  CheckCircle2,
  Apple,
  Hospital,
  UserCheck,
  Stethoscope,
  Sparkles,
  Zap
} from 'lucide-react';
import { Area, AreaChart, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AssistantSheet } from '@/components/ai-flow-assistant/assistant-sheet';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/context/user-profile-context';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const healthChartData = [
  { day: 'Mon', score: 40 },
  { day: 'Tue', score: 60 },
  { day: 'Wed', score: 45 },
  { day: 'Thu', score: 75 },
  { day: 'Fri', score: 55 },
  { day: 'Sat', score: 90 },
  { day: 'Sun', score: 70 },
];

export default function DashboardPage() {
  const { userName, userImage } = useUserProfile();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    setCurrentTime(format(new Date(), 'EEEE, dd MMM'));
    
    const savedAppts = localStorage.getItem('appointments');
    if (savedAppts) setAppointments(JSON.parse(savedAppts).slice(0, 2));

    const savedTasks = localStorage.getItem('guest_planner_tasks_v2');
    if (savedTasks) setTasks(JSON.parse(savedTasks).slice(0, 3));

    const hasGreeted = sessionStorage.getItem('hasGreeted');
    if (!hasGreeted && userName !== 'Guest') {
      toast({
        title: `Hi, ${userName.split(' ')[0]}! 👋`,
        description: "Your health center is active.",
      });
      sessionStorage.setItem('hasGreeted', 'true');
    }
  }, [userName, toast]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-9 pb-32 font-body safe-top overflow-x-hidden">
      
      {/* COMPACT & BALANCED WELCOME BANNER - REDUCED SIZE & WIDTH */}
      <div className="mx-auto max-w-lg px-4 relative z-10">
        <div className="relative p-3.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[2rem] border border-white dark:border-slate-800 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.1)] flex items-center justify-between gap-4 transition-all hover:shadow-primary/5">
          
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link href="/profile" className="shrink-0">
              <div className="p-0.5 rounded-full border border-primary/20 bg-slate-50 dark:bg-slate-800 shadow-sm transition-all hover:scale-105">
                <Avatar className="h-11 w-11 border-2 border-white dark:border-slate-900 shadow-inner">
                  <AvatarImage src={userImage} className="object-cover" />
                  <AvatarFallback className="bg-primary text-white font-black text-sm">
                    {userName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                 <p className="text-[7px] font-black text-primary uppercase tracking-[0.2em] opacity-80">Connected</p>
                 <Sparkles className="w-2 h-2 text-yellow-500" />
              </div>
              <h1 className="text-lg font-black text-[#1A365D] dark:text-slate-100 tracking-tighter truncate leading-none">
                {userName.split(' ')[0]}
              </h1>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{currentTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
             <div className="flex flex-col items-end gap-1">
                <div className="h-5 px-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800 flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[7px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">PULSE OK</span>
                </div>
                <div className="flex items-center gap-1 mr-1">
                    <Zap className="w-2 h-2 text-primary fill-primary" />
                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">v2.0.1</span>
                </div>
             </div>
             
             <Link href="/profile">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner active:scale-90 transition-transform">
                    <ChevronRight className="w-4 h-4 text-primary" />
                </Button>
             </Link>
          </div>
        </div>
      </div>

      {/* Services Grid - Added Top Margin to fix overlap */}
      <div className="space-y-4 px-2 mt-4 relative z-0">
        <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
                <div className="h-1.5 w-6 bg-primary rounded-full" />
                <h3 className="font-black text-[11px] text-[#1A365D] dark:text-slate-400 uppercase tracking-[0.25em]">Health Center</h3>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <MiniServiceCard 
            title="AI Assistant" 
            slogan="Health Intel"
            icon={ShieldPlus} 
            href="/health-assistant" 
            color="text-blue-500" 
            bg="bg-blue-50/60 dark:bg-blue-900/10" 
            delay="delay-0"
          />
          <MiniServiceCard 
            title="Food Scan" 
            slogan="Nutrition AI"
            icon={Apple} 
            href="/food-scanner" 
            color="text-pink-500" 
            bg="bg-pink-50/60 dark:bg-pink-900/10" 
            delay="delay-75"
          />
          <MiniServiceCard 
            title="Disease Scan" 
            slogan="Diagnostics"
            icon={Scan} 
            href="/disease-scanner" 
            color="text-amber-500" 
            bg="bg-orange-50/60 dark:bg-orange-900/10" 
            delay="delay-100"
          />
          <MiniServiceCard 
            title="Pharmacy" 
            slogan="Smart Store"
            icon={Store} 
            href="/store" 
            color="text-purple-500" 
            bg="bg-purple-50/60 dark:bg-purple-900/10" 
            delay="delay-150"
          />
          <MiniServiceCard 
            title="AI Psychiatrist" 
            slogan="Mind Guide"
            icon={BrainCircuit} 
            href="/ai-psychiatrist" 
            color="text-teal-500" 
            bg="bg-teal-50/60 dark:bg-teal-900/10" 
            delay="delay-200"
          />
          <MiniServiceCard 
            title="Emergency" 
            slogan="Nearby Care"
            icon={Hospital} 
            href="/nearby-hospital" 
            color="text-red-500" 
            bg="bg-red-50/60 dark:bg-red-900/10" 
            delay="delay-300"
          />
        </div>
      </div>

      {/* Main Agenda Section */}
      <div className="grid grid-cols-1 gap-8 px-2">
        <Card className="rounded-[2.8rem] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden animate-in zoom-in-95 duration-1000">
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-7 pt-7">
              <div>
                <CardTitle className="text-xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Health Pulse</CardTitle>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Activity Tracking</p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                <Activity className="w-5 h-5 text-primary animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="px-7 pb-7">
              <div className="h-40 w-full mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthChartData}>
                    <defs>
                      <linearGradient id="pulseGrad" x1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2488E8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2488E8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#2488E8" 
                      strokeWidth={5} 
                      fill="url(#pulseGrad)" 
                      animationDuration={2500}
                    />
                    <XAxis dataKey="day" hide />
                    <Tooltip content={<ChartTooltip />} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <MetricTiny label="Daily Goal" value="86%" progress={86} icon={CheckCircle2} />
                <MetricTiny label="Wellness" value="92%" progress={92} icon={Activity} />
              </div>
            </CardContent>
          </Card>

        {/* Doctor Consultations */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    <h3 className="font-black text-[11px] text-[#1A365D] dark:text-slate-100 uppercase tracking-[0.2em]">Consultations</h3>
                </div>
                <Link href="/consultation" className="text-[9px] font-black uppercase text-primary tracking-widest hover:underline">Manage All</Link>
            </div>
            
            <div className="space-y-3">
                {appointments.length > 0 ? (
                    appointments.map((appt, i) => (
                        <Link href="/consultation" key={i} className="block active:scale-[0.98] transition-all group">
                            <div className="p-5 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-5 relative overflow-hidden">
                                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full" />
                                <div className="h-14 w-14 rounded-3xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary shadow-inner shrink-0 relative">
                                    <Stethoscope className="w-7 h-7" />
                                    <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 truncate uppercase tracking-tight">{appt.doctorName}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">{appt.specialty}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <Calendar className="w-3 h-3 text-primary" />
                                            <span className="text-[9px] font-black text-slate-600 dark:text-slate-300">{appt.date}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                            <Clock className="w-3 h-3 text-primary" />
                                            <span className="text-[9px] font-black text-slate-600 dark:text-slate-300">{appt.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white transition-all">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30 text-center">
                        <Calendar className="h-8 w-8 text-slate-200 mx-auto mb-3" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No Active Sessions</p>
                    </div>
                )}
            </div>
        </div>

        {/* Daily Routine Planner */}
        <Card className="rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-slate-900 mx-1 p-2">
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-primary rounded-full" />
                  <h3 className="font-black text-[11px] text-[#1A365D] dark:text-slate-100 uppercase tracking-[0.2em]">Daily Routine</h3>
              </div>
              <Link href="/planner" className="text-[9px] font-black uppercase text-primary tracking-widest hover:underline">View All</Link>
            </div>
            <div className="space-y-2.5">
              {tasks.length > 0 ? (
                tasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/60 dark:bg-slate-800/60 border border-white dark:border-slate-800 shadow-sm">
                    <div className={cn(
                      "h-6 w-6 rounded-xl flex items-center justify-center border-2 shrink-0",
                      task.completed ? "bg-primary border-primary text-white" : "border-slate-200 dark:border-slate-700 bg-white"
                    )}>
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <p className={cn(
                      "text-xs font-bold flex-1 truncate uppercase tracking-tight",
                      task.completed ? "text-slate-300 line-through" : "text-[#1A365D] dark:text-slate-200"
                    )}>
                      {task.title}
                    </p>
                  </div>
                ))
              ) : (
                  <div className="py-4 text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Planner Standby</p>
                  </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Emergency Quick Action */}
      <div className="px-3 pt-2">
        <Link href="/nearby-hospital" className="block active:scale-[0.96] transition-all duration-300">
          <div className="p-5 rounded-[2.5rem] bg-gradient-to-r from-red-500 to-rose-600 shadow-2xl shadow-red-500/30 flex items-center justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-32 bg-white/10 skew-x-[-20deg] translate-x-16 group-hover:translate-x-12 transition-transform duration-1000" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="h-14 w-14 bg-white/20 rounded-[1.8rem] flex items-center justify-center text-white border border-white/30 backdrop-blur-md">
                <PhoneCall className="w-7 h-7 animate-pulse" />
              </div>
              <div className="text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-0.5">Need Care Now?</p>
                <p className="text-lg font-black uppercase tracking-tight">Emergency Hub</p>
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-transform group-hover:translate-x-1">
               <ChevronRight className="w-6 h-6" />
            </div>
          </div>
        </Link>
      </div>

      <AssistantSheet />
    </div>
  );
}

function MiniServiceCard({ title, slogan, icon: Icon, href, color, bg, delay }: any) {
  return (
    <Link href={href} className={cn("group active:scale-95 transition-all duration-500 block h-full animate-in fade-in slide-in-from-bottom-2", delay)}>
      <div className={cn(
        "rounded-[2.2rem] border shadow-lg transition-all duration-500 h-full flex flex-col items-center text-center justify-center p-5 relative overflow-hidden",
        bg,
        "border-white/80 dark:border-slate-800/80 hover:bg-white dark:hover:bg-slate-800"
      )}>
        <div className={cn("h-14 w-14 rounded-3xl shadow-xl flex items-center justify-center bg-white dark:bg-slate-900 transition-all duration-700 group-hover:rotate-12 mb-4", color)}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="w-full">
          <h4 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tighter leading-tight mb-1">{title}</h4>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none opacity-80">{slogan}</p>
        </div>
      </div>
    </Link>
  );
}

function MetricTiny({ label, value, progress, icon: Icon }: any) {
  return (
    <div className="p-4 rounded-[1.8rem] bg-slate-50 dark:bg-slate-800 border border-white dark:border-slate-700 shadow-inner flex flex-col gap-2 transition-all hover:bg-white active:scale-95">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3 h-3 text-primary" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-[9px] font-black text-primary">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
        <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(36,136,232,0.4)] transition-all duration-1000" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A365D] dark:bg-slate-900 p-3 rounded-2xl border border-white/10 text-center shadow-2xl animate-in zoom-in-95 duration-200">
        <p className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{payload[0].value}% Score</p>
      </div>
    );
  }
  return null;
}
