
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
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';


type Session = {
    id: string;
    duration_min: number;
    medId: string;
    title: string;
    mood: string;
    createdAt: any;
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
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setAnalytics({
        totalSessions: 0,
        totalTime: '0h 0m',
        currentStreak: 0,
        averageMood: 'N/A',
        mostPracticed: 'N/A',
        byTypeData: [],
        recentSessions: [],
    });
    setLoading(false);
  }, []);
  
  const downloadReport = () => {
    if (!analytics) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "No analytics data to download.",
        });
        return;
    }
    
    const doc = new jsPDF();
    const userName = 'Guest';
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
                        No practice data to display. Please log in to see your analytics.
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
                        No recent sessions found. Please log in to see your sessions.
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
