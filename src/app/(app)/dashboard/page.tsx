
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
  Stethoscope,
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
} from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
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
    // Fetch Data from LocalStorage
    const savedAppts = localStorage.getItem('appointments');
    if (savedAppts) setAppointments(JSON.parse(savedAppts).slice(0, 1));

    const savedTasks = localStorage.getItem('guest_planner_tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks).slice(0, 4));

    const hasGreeted = sessionStorage.getItem('hasGreeted');
    if (!hasGreeted && userName !== 'Guest') {
      toast({
        title: `Welcome, ${userName.split(' ')[0]}! 👋`,
        description: "Your health command center is ready.",
      });
      sessionStorage.setItem('hasGreeted', 'true');
    }
  }, [userName, toast]);

  return (
    <div className="animate-in fade-in duration-700 space-y-10 pb-32">
      
      {/* Premium Branded Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-6 p-6 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-sm mx-1">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 mb-1">
            <HeartPulse className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest font-headline">Medical Partner v2.0</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#1A365D] leading-tight truncate">
            Hi, <span className="text-primary">{userName.split(' ')[0]}</span>
          </h1>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Digital Health Companion</p>
        </div>

        <Link href="/profile" className="shrink-0">
          <div className="relative group">
            <Avatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-white shadow-2xl transition-all duration-500 group-hover:scale-105 active:scale-95 bg-slate-100">
              <AvatarImage src={userImage} className="object-cover" />
              <AvatarFallback className="bg-primary text-white font-black text-2xl uppercase">
                {userName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-white rounded-full shadow-lg flex items-center justify-center border border-slate-100 transition-transform group-hover:rotate-45">
              <Settings className="w-4 h-4 text-primary" />
            </div>
          </div>
        </Link>
      </div>

      {/* Essential Health Services Grid */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-black text-[12px] text-[#2D3A5D]/60 uppercase tracking-[0.3em]">Essential Health Services</h3>
          <div className="h-px bg-slate-200 flex-1 ml-6 hidden md:block" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          <ServiceCard 
            title="AI Assistant" 
            slogan="24/7 Expert Help" 
            icon={ShieldPlus} 
            href="/health-assistant" 
            color="from-blue-500 to-blue-600" 
            bg="bg-blue-50/50" 
          />
          <ServiceCard 
            title="Expert Doctor" 
            slogan="Video Consult" 
            icon={Stethoscope} 
            href="/consultation" 
            color="from-pink-500 to-rose-600" 
            bg="bg-pink-50/50" 
          />
          <ServiceCard 
            title="Medical Store" 
            slogan="Order Medicine" 
            icon={Store} 
            href="/store" 
            color="from-purple-500 to-indigo-600" 
            bg="bg-purple-50/50" 
          />
          <ServiceCard 
            title="AI Psychiatrist" 
            slogan="Mental Balance" 
            icon={BrainCircuit} 
            href="/ai-psychiatrist" 
            color="from-teal-500 to-emerald-600" 
            bg="bg-emerald-50/50" 
          />
          <ServiceCard 
            title="Health Scanner" 
            slogan="X-ray & Reports" 
            icon={Scan} 
            href="/disease-scanner" 
            color="from-amber-500 to-orange-600" 
            bg="bg-orange-50/50" 
          />
          <ServiceCard 
            title="Emergency" 
            slogan="Instant Support" 
            icon={PhoneCall} 
            href="/nearby-hospital" 
            color="from-red-500 to-red-700" 
            bg="bg-red-50/50" 
          />
        </div>
      </div>

      {/* Main Agenda Section */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 px-1">
        
        {/* Left Column: Health Pulse */}
        <div className="lg:col-span-7 space-y-8">
           <Card className="rounded-[3rem] border-none shadow-sm neumorphic-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-8 pt-8">
              <div>
                <CardTitle className="text-xl font-black text-[#2D3A5D]">Health Pulse</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly Activity Tracking</CardDescription>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-8 px-8 pb-10">
              <div className="h-44 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthChartData}>
                    <defs>
                      <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2488E8" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2488E8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="score" stroke="#2488E8" strokeWidth={5} fill="url(#pulseGrad)" animationDuration={2000} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 900}} />
                    <Tooltip content={<ChartTooltip />} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <MetricSmall label="Steps" value="7.5k" target="8k" progress={92} />
                <MetricSmall label="Sleep" value="7.2h" target="8h" progress={88} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Bookings & Planner */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Upcoming Booking Card */}
          <div className="space-y-4">
            <h3 className="font-black text-[10px] text-[#2D3A5D]/60 uppercase tracking-[0.2em] px-4">Upcoming Booking</h3>
            {appointments.length > 0 ? (
              appointments.map((appt, i) => (
                <Card key={i} className="rounded-[2.5rem] border-none shadow-md bg-white p-5 flex items-center gap-5 border border-blue-50 group hover:scale-[1.02] transition-all">
                  <div className="h-14 w-14 rounded-[1.5rem] bg-blue-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-black text-[#2D3A5D]">{appt.doctorName}</p>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {appt.time}</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Confirmed</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 border border-slate-100" asChild>
                    <Link href="/consultation"><ChevronRight className="w-4 h-4" /></Link>
                  </Button>
                </Card>
              ))
            ) : (
              <Card className="rounded-[2.5rem] border-dashed border-2 border-slate-100 bg-white/40 p-8 text-center flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active Bookings</p>
                <Button variant="link" size="sm" className="text-[10px] font-black uppercase text-primary" asChild>
                  <Link href="/consultation">Book Doctor</Link>
                </Button>
              </Card>
            )}
          </div>

          {/* Daily Planner Card */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
              <h3 className="font-black text-[10px] text-[#2D3A5D]/60 uppercase tracking-[0.2em]">Health Planner</h3>
              <Button variant="ghost" size="sm" className="h-6 rounded-full text-[9px] font-black uppercase text-primary bg-primary/5 px-3" asChild>
                <Link href="/planner">View All</Link>
              </Button>
            </div>
            <Card className="rounded-[2.5rem] border-none shadow-sm p-2 bg-white/80 backdrop-blur-sm">
              <div className="p-4 space-y-3">
                {tasks.length > 0 ? (
                  tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-4 p-3.5 rounded-[1.5rem] bg-white border border-slate-50 shadow-sm">
                      <div className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center border-2 transition-all shrink-0",
                        task.completed ? "bg-primary border-primary text-white" : "border-slate-200"
                      )}>
                        {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-slate-200" />}
                      </div>
                      <p className={cn(
                        "text-xs font-bold flex-1 truncate",
                        task.completed ? "text-slate-300 line-through decoration-primary/50 decoration-2" : "text-[#2D3A5D]"
                      )}>
                        {task.title}
                      </p>
                    </div>
                  ))
                ) : (
                   <div className="py-6 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">No Schedule Found</p>
                   </div>
                )}
                <Button className="w-full rounded-2xl h-12 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-black text-[11px] uppercase tracking-widest border-none shadow-none mt-2" asChild>
                  <Link href="/planner"><Plus className="w-4 h-4 mr-2" /> Add Task</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Emergency Red Button (Footer) */}
      <div className="max-w-5xl mx-auto px-1">
        <Link href="tel:112" className="block active:scale-95 transition-all">
          <div className="p-6 rounded-[2.5rem] bg-red-500 shadow-2xl shadow-red-200 flex items-center justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 h-full w-32 bg-white/10 skew-x-[30deg] translate-x-16 group-hover:translate-x-0 transition-transform duration-700" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="p-4 bg-white/20 rounded-[1.8rem] backdrop-blur-md border border-white/30">
                <AlertCircle className="w-7 h-7 text-white animate-bounce" />
              </div>
              <div className="text-white">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Immediate Help</p>
                <p className="text-2xl font-black leading-none mt-1 font-headline">EMERGENCY 112</p>
              </div>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center relative z-10">
               <ChevronRight className="w-6 h-6 text-white" />
            </div>
          </div>
        </Link>
      </div>

      <AssistantSheet />
    </div>
  );
}

function ServiceCard({ title, slogan, icon: Icon, href, color, bg }: any) {
  return (
    <Link href={href} className="group active:scale-95 transition-all duration-300">
      <Card className={cn("rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full flex flex-col", bg)}>
        <div className="p-5 flex flex-col items-center text-center space-y-3 relative">
          <div className={cn("p-4 rounded-[1.8rem] shadow-lg text-white bg-gradient-to-br transition-transform duration-500 group-hover:rotate-6", color)}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[12px] font-black text-[#2D3A5D] uppercase tracking-tight">{title}</h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter opacity-80">{slogan}</p>
          </div>
          <div className={cn("mt-2 py-2 px-4 w-full rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md", color)}>
            Explore
          </div>
        </div>
      </Card>
    </Link>
  );
}

function MetricSmall({ label, value, target, progress }: any) {
  return (
    <div className="p-5 rounded-[2.2rem] bg-slate-50/80 space-y-4 border border-white">
      <div className="flex justify-between items-center">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
        <span className="text-[10px] font-black text-primary">{progress}%</span>
      </div>
      <div className="space-y-2.5">
        <p className="text-xl font-black text-[#1A365D] tracking-tight">{value} <span className="text-[10px] text-slate-400">/ {target}</span></p>
        <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A365D]/95 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-white/10 text-center animate-in zoom-in-95 duration-200">
        <p className="text-[8px] font-black text-blue-300 uppercase tracking-widest mb-1">{payload[0].payload.day}</p>
        <p className="text-sm font-black text-white">{payload[0].value}% Health</p>
      </div>
    );
  }
  return null;
}
