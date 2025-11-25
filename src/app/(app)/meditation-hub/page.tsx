
'use client';

import { useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import {
  PlayCircle,
  BookOpen,
  BarChart2,
  PlusCircle,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const guidedMeditations = [
  { id: 'breath_5', title: 'Breath Awareness (5 min)', duration_min: 5, icon: 'wind' },
  { id: 'body_10', title: 'Body Scan (10 min)', duration_min: 10, icon: 'scan' },
  { id: 'mantra_8', title: 'Mantra (8 min)', duration_min: 8, icon: 'repeat' },
];

const learnCollections = [
  { id: 'patanjali_overview', title: 'Patanjali Yoga-Sutras', desc: '4 chapters: Samadhi, Sadhana, Vibhuti, Kaivalya' },
  { id: 'gita_overview', title: 'Bhagavad Gita', desc: '18 chapters: Core teachings of karma, bhakti, jnana' },
];

const quickActions = [
    { label: "Start 10-min Breath", action: "/practice/breath_10" },
    { label: "View Patanjali Chapters", action: "/learn/patanjali" },
    { label: "Open Analysis", action: "/analysis" },
];

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
            <div className="space-y-6">
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
                                        <p className="text-sm text-muted-foreground">{med.duration_min} minutes</p>
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
            <div className="space-y-6">
                 <Card className="overflow-hidden">
                    {heroImage && (
                      <div className="relative h-48 w-full">
                        <Image
                            src={heroImage.imageUrl}
                            alt={heroImage.description}
                            layout="fill"
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
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart2 />Your Practice Summary</CardTitle>
                        <CardDescription>Quick stats of your practice.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center text-muted-foreground space-y-4">
                        <p>Loading practice summary...</p>
                        <Button asChild>
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
