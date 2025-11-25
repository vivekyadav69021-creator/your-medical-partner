
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
import { useUser, useFirestore } from '@/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type Session = {
    id: string;
    duration_min: number;
    medId: string;
    title: string;
    mood: string;
    createdAt: Date;
};

type AnalyticsData = {
    totalSessions: number;
    totalTime: string;
    currentStreak: number;
    averageMood: string;
    byTypeData: { name: string; minutes: number }[];
};

export default function AnalysisPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (!user || !firestore) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const sessionsCol = collection(firestore, 'users', user.uid, 'sessions');
        const q = query(sessionsCol, orderBy('createdAt', 'desc'));
        const sessionsSnap = await getDocs(q);

        let totalMin = 0;
        const byType: { [key: string]: number } = {};
        const moods: string[] = [];

        sessionsSnap.forEach(doc => {
            const session = doc.data();
            const duration = session.duration_min || 0;
            totalMin += duration;
            if (session.medId) {
                byType[session.title] = (byType[session.title] || 0) + duration;
            }
            if (session.mood) {
                moods.push(session.mood);
            }
        });
        
        const totalHours = Math.floor(totalMin / 60);
        const remainingMins = totalMin % 60;

        const byTypeData = Object.entries(byType).map(([name, minutes]) => ({ name, minutes }));

        // Simplified mood calculation
        const moodCounts: {[key: string]: number} = moods.reduce((acc, mood) => {
            acc[mood] = (acc[mood] || 0) + 1;
            return acc;
        }, {} as {[key: string]: number});

        const averageMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, 'N/A');

        // Streak calculation would be complex here, so we use a placeholder
        // A proper streak calculation is in the meditation hub summary
        setAnalytics({
            totalSessions: sessionsSnap.size,
            totalTime: `${totalHours}h ${remainingMins}m`,
            currentStreak: 12, // Placeholder
            averageMood,
            byTypeData,
        });

      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user, firestore]);

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
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
            ) : analytics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold">{analytics.totalSessions}</p>
                        <p className="text-sm text-muted-foreground">Total Sessions</p>
                    </div>
                     <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold">{analytics.totalTime}</p>
                        <p className="text-sm text-muted-foreground">Total Time</p>
                    </div>
                     <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold">{analytics.currentStreak} days</p>
                        <p className="text-sm text-muted-foreground">Current Streak</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold">{analytics.averageMood}</p>
                        <p className="text-sm text-muted-foreground">Avg. Mood</p>
                    </div>
                </div>
            )}
             <Button disabled>
                <Download className="mr-2 h-4 w-4" />
                Download Report (PDF)
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 />
            Practice Breakdown
          </CardTitle>
          <CardDescription>
            Your practice minutes by meditation type.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? <Skeleton className="h-[300px] w-full" /> : analytics && analytics.byTypeData.length > 0 ? (
                <ChartContainer config={{}} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.byTypeData}>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}/>
                            <Tooltip
                                cursor={{fill: "hsl(var(--muted))"}}
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="grid grid-cols-2 gap-2">
                                          <div className="flex flex-col">
                                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                                              {payload[0].payload.name}
                                            </span>
                                            <span className="font-bold text-foreground">
                                              {payload[0].value} mins
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
            ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No practice data to display.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
