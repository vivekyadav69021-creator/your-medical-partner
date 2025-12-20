
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
  Sparkles,
  Heart,
  Footprints,
  Wind,
  Scan,
  Repeat,
  Image as ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import { guidedMeditations } from '@/lib/meditation-data';
import { learnCollectionsData } from '@/lib/learn-data';
import { useEffect, useState, useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { getMoodSuggestionAction } from './actions';
import { useToast } from '@/hooks/use-toast';

const quickActions = [
    { label: "Start 10-min Breath", action: "/practice/body_10" },
    { label: "View Patanjali Chapters", action: "/learn/patanjali_overview?lang=en" },
    { label: "Open Analysis", action: "/analysis" },
];

const initialSuggestionState = {
  suggestion: null,
  error: null,
};


function PracticeSummary() {
    const [summary, setSummary] = useState<{ sessions: number; totalMin: number; streak: number; } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
        setSummary({ sessions: 0, totalMin: 0, streak: 0 });
    }, []);

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
        return <p>No practice data found. Log in to see your stats.</p>
    }

    return (
        <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Total sessions:</span> <strong>{summary.sessions}</strong></div>
            <div className="flex justify-between"><span>Total minutes:</span> <strong>{summary.totalMin}</strong></div>
            <div className="flex justify-between"><span>Current streak:</span> <strong>{summary.streak} days</strong></div>
        </div>
    );
}

function SuggestionButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Get Suggestion
        </Button>
    );
}


function AiMoodTracker() {
    const [state, formAction] = useActionState(getMoodSuggestionAction, initialSuggestionState);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if(state.error) {
            toast({
                variant: 'destructive',
                title: 'AI Suggestion Failed',
                description: state.error,
            });
        }
    }, [state, toast]);

    const suggestedMeditation = state.suggestion 
        ? guidedMeditations.find(m => m.id === state.suggestion?.meditationId)
        : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Heart/> AI Mood Tracker</CardTitle>
                <CardDescription>Tell me how you feel, and I'll suggest a meditation.</CardDescription>
            </CardHeader>
            <form action={(formData) => {
                formAction(formData);
                formRef.current?.reset();
            }} ref={formRef}>
                <CardContent className="space-y-4">
                    <Input name="mood" placeholder="e.g., stressed, tired, anxious..." required />
                    {state.suggestion && suggestedMeditation && (
                        <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle className="text-lg">My Suggestion For You</CardTitle>
                                <CardDescription>{state.suggestion.reasoning}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <p className="font-semibold">{suggestedMeditation.title}</p>
                                 <p className="text-sm text-muted-foreground">{suggestedMeditation.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild size="sm">
                                    <Link href={`/practice/${suggestedMeditation.id}`}>
                                        <PlayCircle className="mr-2 h-4 w-4" />
                                        Start Practice
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </CardContent>
                <CardFooter>
                    <SuggestionButton />
                </CardFooter>
            </form>
        </Card>
    );
}

const iconMap: { [key: string]: React.ElementType } = {
    wind: Wind,
    scan: Scan,
    repeat: Repeat,
    heart: Heart,
    footprints: Footprints,
    image: ImageIcon,
    default: PlayCircle,
};


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
                <AiMoodTracker />
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
            </div>

            {/* Right Column (Main Content) */}
            <div className="lg:col-span-2 space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Start Practice</CardTitle>
                        <CardDescription>Choose a guided meditation and begin your session.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {guidedMeditations.map(med => {
                            const Icon = iconMap[med.icon] || iconMap.default;
                            return (
                                <Card key={med.id} className="hover:bg-muted/50">
                                    <CardContent className="p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="font-semibold">{med.title}</p>
                                                <p className="text-sm text-muted-foreground">{med.description}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={`/practice/${med.id}`}><PlayCircle className="w-6 h-6"/></Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BookOpen/>Learn — Patanjali Yoga-Sutras</CardTitle>
                        <CardDescription>Click to open full chapter pages.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         {learnCollectionsData.map(item => {
                            const firstChapterId = (item.chapters && item.chapters.length > 0) ? item.chapters[0]?.id : undefined;
                            const href = firstChapterId
                              ? `/learn/${item.id}?chapter=${firstChapterId}&lang=en`
                              : `/learn/${item.id}?lang=en`;
                            
                            return (
                                <Link href={href} key={item.id} className="block p-3 rounded-lg hover:bg-muted">
                                    <p className="font-semibold">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">{item.summary}</p>
                                </Link>
                            );
                         })}
                    </CardContent>
                </Card>
            </div>
            
        </div>
    </div>
  );
}
