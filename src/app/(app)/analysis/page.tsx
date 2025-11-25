'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart2, Calendar, Clock, Smile } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const weeklyData = [
  { day: 'Mon', minutes: 10 },
  { day: 'Tue', minutes: 15 },
  { day: 'Wed', minutes: 10 },
  { day: 'Thu', minutes: 20 },
  { day: 'Fri', minutes: 15 },
  { day: 'Sat', minutes: 30 },
  { day: 'Sun', minutes: 25 },
];

const summaryStats = {
    totalSessions: 42,
    totalTime: '7h 30m',
    currentStreak: '12 days',
    averageMood: 'Relaxed',
};

export default function AnalysisPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Practice Analysis
        </h1>
        <p className="text-muted-foreground">
          Track your meditation journey and progress over time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Stats</CardTitle>
          <CardDescription>
            An overview of your meditation practice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold">{summaryStats.totalSessions}</p>
                    <p className="text-sm text-muted-foreground">Total Sessions</p>
                </div>
                 <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold">{summaryStats.totalTime}</p>
                    <p className="text-sm text-muted-foreground">Total Time</p>
                </div>
                 <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold">{summaryStats.currentStreak}</p>
                    <p className="text-sm text-muted-foreground">Current Streak</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-2xl font-bold">{summaryStats.averageMood}</p>
                    <p className="text-sm text-muted-foreground">Avg. Mood</p>
                </div>
            </div>
            <div id="analyticsSummary">
                {/* Analytics summary will be loaded here */}
            </div>
             <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Report (PDF)
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 />
            Weekly Graphs
          </CardTitle>
          <CardDescription>
            Your practice minutes over the last week.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={{}} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}/>
                        <Tooltip
                            cursor={{fill: "hsl(var(--muted))"}}
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                          Minutes
                                        </span>
                                        <span className="font-bold text-foreground">
                                          {payload[0].value}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            }}
                        />
                        <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
            <div id="breakdown">
                {/* Further breakdowns can be loaded here */}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
