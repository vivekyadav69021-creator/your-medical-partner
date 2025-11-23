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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
