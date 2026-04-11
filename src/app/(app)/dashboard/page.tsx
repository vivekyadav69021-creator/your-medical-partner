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
  ChevronRight,
  Clock,
  CheckCircle2,
  MoreHorizontal,
  Calendar,
  Bot,
  Stethoscope,
  Store,
  Scan,
  BrainCircuit,
  PhoneCall,
} from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Area, AreaChart, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { AssistantSheet } from '@/components/ai-flow-assistant/assistant-sheet';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/context/user-profile-context';

const healthChartData = [
  { day: '20', bpt: 40 },
  { day: '01', bpt: 60 },
  { day: '02', bpt: 45 },
  { day: '23', bpt: 70 },
  { day: 'Today', bpt: 55 },
];

export default function DashboardPage() {
  const { userName } = useUserProfile();

  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      
      {/* Header Section */}
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <div className="space-y-4 flex-1">
          <div className="space-y-1">
            <p className="text-[#2488E8] text-[10px] font-black uppercase tracking-[0.3em]">Your Digital Health Companion</p>
            <div className="inline-block glowing-underline pb-1 pr-4">
              <h1 className="text-4xl font-black tracking-tighter text-[#2D3A5D] dark:text-slate-100 font-headline leading-none">
                Welcome, <br />
                <span className="text-[#2488E8]">{userName.split(' ')[0]}</span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Main Feature Grid */}
        <div className="space-y-4">
          <h3 className="font-black text-[13px] text-[#2D3A5D]/60 dark:text-slate-400 uppercase tracking-widest px-2">Essential Services</h3>
          <div className="grid grid-cols-2 gap-5">
            <FeatureCard
              title="AI Assistant"
              description="Symptom checker"
              icon={Bot}
              iconColor="text-blue-500"
              href="/health-assistant"
              btnText="Ask away"
              btnGradient="from-[#E6F0FF] to-[#D1E4FF] dark:from-blue-900/40 dark:to-blue-800/40"
            />
            <FeatureCard
              title="Doctor Consult"
              description="Expert video calls"
              icon={Stethoscope}
              iconColor="text-pink-500"
              href="/consultation"
              btnText="Book Now"
              btnGradient="from-[#FFF0F5] to-[#FFE1EB] dark:from-pink-900/40 dark:to-pink-800/40"
            />
            <FeatureCard
              title="Medical Store"
              description="Pharmacy door"
              icon={Store}
              iconColor="text-purple-500"
              href="/store"
              btnText="Order Now"
              btnGradient="from-[#F3E8FF] to-[#E9D5FF] dark:from-purple-900/40 dark:to-purple-800/40"
            />
            <FeatureCard
              title="Disease Scanner"
              description="X-ray & Reports"
              icon={Scan}
              iconColor="text-teal-500"
              href="/disease-scanner"
              btnText="Scan Now"
              btnGradient="from-[#E0FDF4] to-[#BBF7ED] dark:from-teal-900/40 dark:to-teal-800/40"
            />
            <FeatureCard
              title="AI Psychiatrist"
              description="Mental wellbeing"
              icon={BrainCircuit}
              iconColor="text-indigo-500"
              href="/ai-psychiatrist"
              btnText="Talk to AI"
              btnGradient="from-[#EEF2FF] to-[#E0E7FF] dark:from-indigo-900/40 dark:to-indigo-800/40"
            />
            <FeatureCard
              title="Emergency"
              description="24/7 Medical support"
              icon={PhoneCall}
              iconColor="text-red-500"
              href="tel:112"
              btnText="Call 112"
              btnGradient="from-[#FEF2F2] to-[#FEE2E2] dark:from-red-900/40 dark:to-red-800/40"
            />
          </div>
        </div>

        {/* Daily Progress Card */}
        <Card className="rounded-[3rem] border-none shadow-sm neumorphic-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-8 pt-8">
            <CardTitle className="text-xl font-black text-[#2D3A5D] dark:text-slate-100">Daily Progress</CardTitle>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F0F7FF] dark:bg-slate-800 rounded-full">
               <Calendar className="w-3.5 h-3.5 text-[#2488E8]" />
               <span className="text-[10px] font-black text-[#2488E8] uppercase">Oct 24</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-10">
            <div className="h-40 w-full mt-4">
              <ChartContainer config={{}} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthChartData}>
                    <defs>
                      <linearGradient id="colorBpt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2488E8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#14CFBD" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-blue-50 dark:border-slate-800 text-[10px] font-bold text-[#2D3A5D] dark:text-slate-100">
                              {payload[0].value}% Health Score
                            </div>
                          )
                        }
                        return null;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="bpt" 
                      stroke="#2488E8" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorBpt)" 
                      animationDuration={1000}
                    />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 900}} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <MetricBox label="Steps" val="7,550" total="8,000" percent={94} gradient="from-[#2488E8] to-[#14CFBD]" />
              <MetricBox label="Sleep" val="7" total="8h" percent={87} gradient="from-[#9D50BB] to-[#6E48AA]" />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Bookings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-[13px] text-[#2D3A5D]/60 dark:text-slate-400 uppercase tracking-widest">Upcoming Bookings</h3>
            <Link href="/consultation">
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0 hover:bg-white/50 dark:hover:bg-slate-800/50">
                <ChevronRight className="w-4 h-4 text-[#2D3A5D] dark:text-slate-100" />
              </Button>
            </Link>
          </div>
          <Card className="rounded-[2.5rem] border-none neumorphic-card overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <BookingItem 
                name="Dr. Shivam Yadav" 
                time="Today, 04:30 PM" 
                type="Video Call" 
                image="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=100&h=100&auto=format&fit=crop" 
              />
              <div className="h-px bg-[#F0F7FF] dark:bg-slate-800 w-full" />
              <BookingItem 
                name="Dr. Ananya Sharma" 
                time="Tomorrow, 10:00 AM" 
                type="In-Person" 
                image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=100&h=100&auto=format&fit=crop" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-[13px] text-[#2D3A5D]/60 dark:text-slate-400 uppercase tracking-widest">Today's Schedule</h3>
            <Link href="/planner">
              <Button variant="ghost" size="sm" className="text-[#2488E8] text-[10px] font-black uppercase tracking-wider">Manage</Button>
            </Link>
          </div>
          <div className="space-y-3 pb-10">
            <PlannerTaskItem title="Take Vitamin C Tablet" category="Medication" time="09:00 AM" completed={true} />
            <PlannerTaskItem title="Morning Jog (30 min)" category="Fitness" time="07:30 AM" completed={true} />
            <PlannerTaskItem title="Drink 2L Water" category="General" time="Throughout day" completed={false} />
          </div>
        </div>
      </div>

      <AssistantSheet />
    </div>
  );
}

// Sub-components
function FeatureCard({ title, description, icon: Icon, iconColor, href, btnText, btnGradient }: { title: string, description: string, icon: any, iconColor: string, href: string, btnText: string, btnGradient: string }) {
  return (
    <Card className="rounded-[2.5rem] border-none neumorphic-card group hover:scale-[1.03] transition-all duration-500 overflow-hidden">
      <Link href={href} className="p-6 flex flex-col h-full space-y-4">
        <div className="mx-auto transform group-hover:rotate-6 transition-transform duration-500 p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl">
          <Icon className={cn("w-10 h-10 drop-shadow-sm", iconColor)} />
        </div>
        <div className="space-y-1 text-center">
          <CardTitle className="text-sm font-black text-[#2D3A5D] dark:text-slate-100 tracking-tight">{title}</CardTitle>
          <p className="text-[10px] text-slate-400 font-bold leading-tight">{description}</p>
        </div>
        <div className={cn(
          "mt-auto py-2.5 px-4 rounded-2xl flex items-center justify-between text-[10px] font-black tracking-tight transition-all bg-gradient-to-r shadow-inner text-[#2D3A5D] dark:text-slate-100",
          btnGradient
        )}>
          {btnText}
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        </div>
      </Link>
    </Card>
  );
}

function MetricBox({ label, val, total, percent, gradient }: { label: string, val: string, total: string, percent: number, gradient: string }) {
  return (
    <div className="p-6 rounded-[2rem] bg-[#FDFBFF] dark:bg-slate-900/50 space-y-4 border border-white dark:border-slate-800 shadow-inner">
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full bg-gradient-to-r shadow-sm", gradient)} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-black text-[#2D3A5D] dark:text-slate-100">{val} <span className="text-[10px] text-slate-400 font-bold">/ {total}</span></p>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={cn("h-full bg-gradient-to-r rounded-full transition-all duration-1000", gradient)} 
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function BookingItem({ name, time, type, image }: { name: string, time: string, type: string, image: string }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-14 w-14 rounded-2xl border-2 border-white dark:border-slate-800 shadow-md">
        <AvatarImage src={image} />
        <AvatarFallback className="bg-blue-50">{name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-[#2D3A5D] dark:text-slate-100 truncate tracking-tight">{name}</p>
        <div className="flex items-center gap-3 mt-0.5">
          <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> {time}
          </p>
          <div className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
          <p className="text-[10px] font-black text-[#2488E8] uppercase tracking-wider">{type}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-[#F0F7FF] dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700">
        <ChevronRight className="w-4 h-4 text-[#2488E8]" />
      </Button>
    </div>
  );
}

function PlannerTaskItem({ title, category, time, completed }: { title: string, category: string, time: string, completed: boolean }) {
  return (
    <div className={cn(
      "p-5 rounded-[2rem] flex items-center gap-4 border transition-all duration-300",
      completed ? "bg-white/40 dark:bg-slate-900/40 border-transparent opacity-60" : "bg-white dark:bg-slate-900 neumorphic-card"
    )}>
      <div className={cn(
        "h-7 w-7 rounded-xl border-2 flex items-center justify-center transition-all",
        completed ? "bg-[#2488E8] border-[#2488E8] text-white" : "border-slate-100 dark:border-slate-800"
      )}>
        {completed && <CheckCircle2 className="w-4 h-4" />}
      </div>
      <div className="flex-1">
        <p className={cn("text-[13px] font-black tracking-tight", completed ? "line-through text-slate-400" : "text-[#2D3A5D] dark:text-slate-100")}>{title}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">{category} • {time}</p>
      </div>
      < MoreHorizontal className="w-4 h-4 text-slate-300 dark:text-slate-600" />
    </div>
  );
}