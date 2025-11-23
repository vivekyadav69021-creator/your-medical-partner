'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, Stethoscope, Hospital, ScanLine, BookHeart, BrainCircuit } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Line, LineChart, Area, AreaChart } from "recharts"
import { useUserProfile } from '@/context/user-profile-context';
import { HealthScoreDisplay } from '@/components/health-score-display';

const quickAccessItems = [
  {
    title: 'AI Health Assistant',
    description: 'Ask our AI anything about health.',
    href: '/health-assistant',
    icon: Bot,
  },
  {
    title: 'AI Psychiatrist',
    description: 'Talk to our AI about your mental health.',
    href: '/ai-psychiatrist',
    icon: BrainCircuit,
  },
  {
    title: 'Doctor Consult',
    description: 'Book an appointment with a doctor.',
    href: '/consultation',
    icon: Stethoscope,
  },
   {
    title: 'Nearby Hospital',
    description: 'Find hospitals and clinics near you.',
    href: '/nearby-hospital',
    icon: Hospital,
  },
   {
    title: 'Disease Scanner',
    description: 'Scan your symptoms to find causes.',
    href: '/symptom-checker',
    icon: ScanLine,
  },
   {
    title: 'Disease Library',
    description: 'Learn about various diseases.',
    href: '/disease-library',
    icon: BookHeart,
  },
];

const heartRateData = [
  { time: "12:00", value: 72 },
  { time: "13:00", value: 75 },
  { time: "14:00", value: 78 },
  { time: "15:00", value: 70 },
  { time: "16:00", value: 82 },
  { time: "17:00", value: 79 },
  { time: "18:00", value: 85 },
];

const sleepData = [
    { day: 'Mon', hours: 7.5 },
    { day: 'Tue', hours: 6.8 },
    { day: 'Wed', hours: 8.2 },
    { day: 'Thu', hours: 7.1 },
    { day: 'Fri', hours: 6.5 },
    { day: 'Sat', hours: 9.0 },
    { day: 'Sun', hours: 8.5 },
]

export default function DashboardPage() {
  const { userName } = useUserProfile();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Hi, {userName}!
        </h1>
        <p className="text-muted-foreground">
          Welcome to your personal health dashboard.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Your healthcare tools, just a click away.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quickAccessItems.map((item) => (
                <Card key={item.title} className="group hover:shadow-lg transition-shadow duration-300">
                  <Link href={item.href} className="flex flex-col h-full">
                    <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                        <item.icon className="w-8 h-8 text-primary" />
                        <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between pt-2">
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <div className="flex items-center text-sm font-medium text-primary mt-4">
                          <span>Go to {item.title}</span>
                          <ArrowRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Health Score</CardTitle>
            <CardDescription>Your current estimated health score.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <HealthScoreDisplay score={88} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Heart Rate (Today)</CardTitle>
            <CardDescription>Your heart rate throughout the day.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-[200px] w-full">
                <AreaChart
                    data={heartRateData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <ChartTooltip 
                        content={<ChartTooltipContent />}
                        cursor={{ fill: 'hsl(var(--secondary))' }}
                    />
                    <defs>
                        <linearGradient id="colorHeart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorHeart)" />
                </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Sleep Pattern</CardTitle>
            <CardDescription>Your sleep duration over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[200px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sleepData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                         <ChartTooltip 
                            content={<ChartTooltipContent />}
                            cursor={{ fill: 'hsl(var(--secondary))' }}
                        />
                        <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
