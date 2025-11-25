
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  PlayCircle,
  BookOpen,
  BarChart2,
  PlusCircle,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { guidedMeditations, learnCollections } from '@/lib/meditation-data';
import { useUser, useFirestore } from '@/firebase';
import { collection, getDocs, query, where, Timestamp, limit } from 'firebase/firestore';
import { useEffect, useState }from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const quickActions = [
    { label: "Start 10-min Breath", action: "/practice/body_10" },
    { label: "View Patanjali Chapters", action: "/learn/patanjali_overview" },
    { label: "Open Analysis", action: "/analysis" },
];

function PracticeSummary() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [summary, setSummary] = useState<{ sessions: number; totalMin: number; streak: number; } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !firestore) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch sessions
                const sessionsCol = collection(firestore, 'users', user.uid, 'sessions');
                const sessionsSnap = await getDocs(sessionsCol);
                let totalMin = 0;
                let sessions = 0;
                sessionsSnap.forEach(doc => {
                    const s = doc.data();
                    if (s.duration_min) totalMin += s.duration_min;
                    sessions++;
                });

                // Compute streak
                let streak = 0;
                const today = new Date();
                for (let i = 0; i < 30; i++) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - i);
                    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
                    
                    const q = query(
                        collection(firestore, 'users', user.uid, 'sessions'),
                        where('createdAt', '>=', Timestamp.fromDate(dayStart)),
                        where('createdAt', '<', Timestamp.fromDate(dayEnd)),
                        limit(1)
                    );
                    const streakSnap = await getDocs(q);
                    if (streakSnap.empty) break;
                    streak++;
                }

                setSummary({ sessions, totalMin, streak });
            } catch (error) {
                console.error("Error fetching practice summary:", error);
                setSummary({ sessions: 0, totalMin: 0, streak: 0 }); // Show zeros on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, firestore]);

    if (loading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        );
    }
    
    if (!summary) {
        return <p>No practice data found.</p>
    }

    return (
        <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Total sessions:</span> <strong>{summary.sessions}</strong></div>
            <div className="flex justify-between"><span>Total minutes:</span> <strong>{summary.totalMin}</strong></div>
            <div className="flex justify-between"><span>Current streak:</span> <strong>{summary.streak} days</strong></div>
        </div>
    );
}


export default function MeditationHubPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'meditation-hero');

  return (
    <div className="space-y-6">
       <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Meditation Hub</h1>
            <p className="text-muted-foreground">Your center for mindfulness and ancient wisdom.</p>
       </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Start Practice</CardTitle>
                        <CardDescription>Choose a guided meditation and start a timed session.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {guidedMeditations.map(med => (
                            <Card key={med.id} className="hover:bg-muted/50">
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">{med.title}</p>
                                        <p className="text-sm text-muted-foreground">{med.description}</p>
                                    </div>
                                    <div className="flex gap-2">
                                         <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/practice/${med.id}`}><PlayCircle className="w-5 h-5"/></Link>
                                         </Button>
                                         <Button variant="ghost" size="icon"><PlusCircle className="w-5 h-5"/></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Center Column */}
            <div className="lg:col-span-1 space-y-6">
                 <Card className="overflow-hidden">
                    {heroImage && (
                      <div className="relative h-48 w-full">
                        <Image
                            src={heroImage.imageUrl}
                            alt={heroImage.description}
                            fill
                            className="object-cover"
                            data-ai-hint={heroImage.imageHint}
                        />
                      </div>
                    )}
                    <CardHeader>
                        <CardTitle>Welcome to the Hub</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">
                           Learn ancient Indian techniques, Patanjali Yoga-Sutras, Bhagavad Gita chapters & build a practice. Tap any lesson to open the dedicated Learn page.
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BookOpen/>Learn — Patanjali & Gita</CardTitle>
                        <CardDescription>Click to open full chapter pages.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         {learnCollections.map(item => (
                            <Link href={`/learn/${item.id}`} key={item.id} className="block p-3 rounded-lg hover:bg-muted">
                                <p className="font-semibold">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </Link>
                         ))}
                    </CardContent>
                </Card>
            </div>
            
            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart2 />Your Practice Summary</CardTitle>
                        <CardDescription>Quick stats of your practice.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-4">
                        <PracticeSummary />
                        <Button asChild className="w-full">
                            <Link href="/analysis">Open Analysis</Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Zap/>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {quickActions.map(action => (
                            <Button key={action.label} variant="outline" className="w-full justify-start" asChild>
                                <Link href={action.action}>{action.label}</Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
