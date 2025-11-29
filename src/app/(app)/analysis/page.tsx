'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart2, Calendar, Clock, Smile, History, Star } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useUser, useFirestore } from '@/firebase';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { jsPDF } from 'jspdf';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';


type Session = {
    id: string;
    duration_min: number;
    medId: string;
    title: string;
    mood: string;
    createdAt: Timestamp;
};

type AnalyticsData = {
    totalSessions: number;
    totalTime: string;
    currentStreak: number;
    averageMood: string;
    mostPracticed: string;
    byTypeData: { name: string; minutes: number }[];
    recentSessions: Session[];
};

export default function AnalysisPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!user || !firestore) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const sessionsCol = collection(firestore, 'users', user.uid, 'sessions');
        const q = query(sessionsCol, orderBy('createdAt', 'desc'));
        const sessionsSnap = await getDocs(q);
        
        const sessions: Session[] = sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Session));

        let totalMin = 0;
        const byType: { [key: string]: number } = {};
        const moods: string[] = [];
        const titles: string[] = [];

        sessions.forEach(session => {
            const duration = session.duration_min || 0;
            totalMin += duration;
            if (session.medId) {
                byType[session.title] = (byType[session.title] || 0) + duration;
                titles.push(session.title);
            }
            if (session.mood) {
                moods.push(session.mood);
            }
        });
        
        const totalHours = Math.floor(totalMin / 60);
        const remainingMins = totalMin % 60;

        const byTypeData = Object.entries(byType).map(([name, minutes]) => ({ name, minutes }));

        const moodCounts: {[key: string]: number} = moods.reduce((acc, mood) => {
            acc[mood] = (acc[mood] || 0) + 1;
            return acc;
        }, {} as {[key: string]: number});
        const averageMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, 'N/A');

        const titleCounts: {[key: string]: number} = titles.reduce((acc, title) => {
            acc[title] = (acc[title] || 0) + 1;
            return acc;
        }, {} as {[key: string]: number});
        const mostPracticed = Object.keys(titleCounts).reduce((a, b) => titleCounts[a] > titleCounts[b] ? a : b, 'N/A');


        let streak = 0;
        if (sessions.length > 0) {
            const uniqueSortedDays = [...new Set(sessions.map(s => s.createdAt.toDate().toDateString()))]
                .map(ds => new Date(ds))
                .sort((a, b) => b.getTime() - a.getTime());
            
            if (uniqueSortedDays.length > 0) {
                const today = new Date();
                const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const lastSessionDateOnly = new Date(uniqueSortedDays[0].getFullYear(), uniqueSortedDays[0].getMonth(), uniqueSortedDays[0].getDate());
                const diffWithToday = (todayDateOnly.getTime() - lastSessionDateOnly.getTime()) / (1000 * 60 * 60 * 24);

                if (diffWithToday <= 1) {
                    streak = 1;
                    for (let i = 0; i < uniqueSortedDays.length - 1; i++) {
                        const diff = (uniqueSortedDays[i].getTime() - uniqueSortedDays[i+1].getTime()) / (1000 * 60 * 60 * 24);
                        if (diff === 1) streak++;
                        else break;
                    }
                }
            }
        }

        setAnalytics({
            totalSessions: sessions.length,
            totalTime: `${totalHours}h ${remainingMins}m`,
            currentStreak: streak,
            averageMood,
            mostPracticed,
            byTypeData,
            recentSessions: sessions.slice(0, 10),
        });

      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user, firestore]);
  
  const downloadReport = () => {
    if (!analytics || !user) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No analytics data to download.",
        });
        return;
    }
    
    const doc = new jsPDF();
    const userName = user.displayName || user.email || 'User';
    const reportDate = new Date().toLocaleDateString();

    doc.setFontSize(22);
    doc.text("Meditation Practice Report", 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`User: ${userName}`, 20, 30);
    doc.text(`Date: ${reportDate}`, 150, 30);
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(16);
    doc.text("Summary", 20, 45);
    
    doc.setFontSize(12);
    const summaryText = `
        Total Sessions: ${analytics.totalSessions}
        Total Time Meditated: ${analytics.totalTime}
        Current Streak: ${analytics.currentStreak} days
        Most Common Mood: ${analytics.averageMood}
        Most Practiced Meditation: ${analytics.mostPracticed}
    `;
    doc.text(summaryText, 25, 55);

    doc.setFontSize(16);
    doc.text("Recent Sessions", 20, 100);
    
    const tableData = analytics.recentSessions.map(s => [
        s.createdAt ? format(s.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A',
        s.title,
        `${s.duration_min} min`,
        s.mood,
    ]);

    (doc as any).autoTable({
        startY: 105,
        head: [['Date', 'Title', 'Duration', 'Mood']],
        body: tableData,
        headStyles: { fillColor: [76, 129, 190] }
    });

    doc.save(`Meditation-Report-${userName}.pdf`);
    toast({ title: "Report Downloaded", description: "Your PDF report has been successfully generated." });
  };
  
  // You need to install `jspdf-autotable`
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://unpkg.com/jspdf-autotable@3.5.23/dist/jspdf.plugin.autotable.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    }
  }, []);

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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}
                </div>
            ) : analytics && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold">{analytics.totalSessions}</p>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><History/>Total Sessions</p>
                    </div>
                     <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold">{analytics.totalTime}</p>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Clock/>Total Time</p>
                    </div>
                     <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold">{analytics.currentStreak} days</p>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Calendar/>Current Streak</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-2xl font-bold">{analytics.averageMood}</p>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Smile/>Avg. Mood</p>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                        <p className="text-lg font-bold truncate" title={analytics.mostPracticed}>{analytics.mostPracticed}</p>
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Star/>Favorite</p>
                    </div>
                </div>
            )}
        </CardContent>
        <CardFooter>
             <Button onClick={downloadReport} disabled={loading || !analytics}>
                <Download className="mr-2 h-4 w-4" />
                Download Report (PDF)
            </Button>
        </CardFooter>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
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

        <Card>
            <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Your last 10 meditation sessions.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-[300px]" /> : analytics && analytics.recentSessions.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Mood</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analytics.recentSessions.map(session => (
                                <TableRow key={session.id}>
                                    <TableCell>{session.createdAt ? format(session.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                                    <TableCell className="font-medium">{session.title}</TableCell>
                                    <TableCell>{session.duration_min} min</TableCell>
                                    <TableCell>{session.mood}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                     <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        No recent sessions found.
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
