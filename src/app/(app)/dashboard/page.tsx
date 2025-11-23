import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, HeartPulse, Stethoscope, Activity, BedDouble, Droplets, Flame } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"

const quickAccessItems = [
  {
    title: 'Health Score',
    description: 'View your personalized health score.',
    href: '/health-score',
    icon: HeartPulse,
  },
  {
    title: 'Book Appointment',
    description: 'Consult with a doctor.',
    href: '/consultation',
    icon: Stethoscope,
  },
  {
    title: 'Symptom Checker',
    description: 'Use our AI to check your symptoms.',
    href: '/symptom-checker',
    icon: Bot,
  },
];

const chartData = [
  { date: "Mon", steps: 8543 },
  { date: "Tue", steps: 7302 },
  { date: "Wed", steps: 9210 },
  { date: "Thu", steps: 6123 },
  { date: "Fri", steps: 10293 },
  { date: "Sat", steps: 12045 },
  { date: "Sun", steps: 8876 },
]

const chartConfig = {
  steps: {
    label: "Steps",
    color: "hsl(var(--primary))",
  },
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome back, User!
        </h1>
        <p className="text-muted-foreground">
          Here's a snapshot of your health and activities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {quickAccessItems.map((item) => (
          <Card key={item.title} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
              <item.icon className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
              <Link href={item.href} className="mt-4">
                <Button className="w-full">
                  Go to {item.title} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Smartwatch Data</CardTitle>
            <CardDescription>
              Your latest health metrics from your connected device.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6">
            <div className="flex items-center p-4 rounded-lg bg-secondary">
              <Activity className="w-8 h-8 mr-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Heart Rate</p>
                <p className="text-2xl font-bold">72 bpm</p>
              </div>
            </div>
            <div className="flex items-center p-4 rounded-lg bg-secondary">
              <BedDouble className="w-8 h-8 mr-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Sleep</p>
                <p className="text-2xl font-bold">7h 45m</p>
              </div>
            </div>
             <div className="flex items-center p-4 rounded-lg bg-secondary">
              <Droplets className="w-8 h-8 mr-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Blood Oxygen</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
            </div>
            <div className="flex items-center p-4 rounded-lg bg-secondary">
              <Flame className="w-8 h-8 mr-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Calories Burned</p>
                <p className="text-2xl font-bold">1,820 kcal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Steps</CardTitle>
            <CardDescription>Your step count over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="steps" fill="var(--color-steps)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
