
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { learnCollectionsData, LearnCollectionItem, Chapter } from '@/lib/learn-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, BookOpen, Sparkles, Brain, Star, Languages } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';

export default function LearnPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { collectionId } = params;
  const router = useRouter();
  
  const firestore = useFirestore();
  const { user } = useUser();

  const [collection, setCollection] = useState<LearnCollectionItem | null>(null);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  useEffect(() => {
    const langParam = searchParams.get('lang');
    if (langParam === 'hi') {
        setLang('hi');
    } else {
        setLang('en');
    }
  }, [searchParams]);

  useEffect(() => {
    const foundCollection = learnCollectionsData.find(c => c.id === collectionId);
    if (foundCollection) {
      setCollection(foundCollection);
    } else {
        router.push('/meditation-hub');
    }
  }, [collectionId, router]);
  
  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    router.push(`/learn/${collectionId}?lang=${newLang}`, { scroll: false });
  };

  const handleMarkComplete = async (chapterId: string, chapterTitle: string) => {
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save progress.'});
        return;
    }
    try {
        const progressRef = doc(firestore, 'users', user.uid, 'progress', chapterId);
        await setDoc(progressRef, {
            completedAt: serverTimestamp(),
            chapterId: chapterId,
            title: chapterTitle,
        });
        toast({
            title: lang === 'en' ? 'Chapter Marked as Complete!' : 'अध्याय पूर्ण के रूप में चिह्नित!',
            description: `${lang === 'en' ? "You've completed" : "आपने पूरा कर लिया है"} "${chapterTitle}".`,
        });
    } catch (error) {
        console.error("Error marking as complete:", error);
        toast({ variant: 'destructive', title: lang === 'en' ? 'Save Failed' : 'सहेजें विफल', description: lang === 'en' ? 'Could not save your progress.' : 'आपकी प्रगति सहेजी नहीं जा सकी।'});
    }
  }

  if (!collection) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Content not found</h1>
        <Button variant="link" asChild>
          <Link href="/meditation-hub">Back to Hub</Link>
        </Button>
      </div>
    );
  }

  const ChapterCard = ({ chapter }: { chapter: Chapter }) => (
    <Card>
      <CardHeader>
        <CardTitle>{lang === 'en' ? chapter.title.en : chapter.title.hi}</CardTitle>
        <CardDescription>{lang === 'en' ? chapter.summary.en : chapter.summary.hi}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Sutras */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Star className="text-yellow-500" /> {lang === 'en' ? 'Key Sutras' : 'प्रमुख सूत्र'}</CardTitle>
            </CardHeader>
            <CardContent>
                 <Accordion type="single" collapsible className="w-full">
                    {chapter.key_sutras.map(sutra => (
                        <AccordionItem value={sutra.sutra} key={sutra.sutra}>
                            <AccordionTrigger className="text-left">
                                {lang === 'en' ? sutra.en : sutra.hi}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2">
                                <p className="font-mono text-sm text-muted-foreground">{sutra.sutra}</p>
                                <p className="italic">"{lang === 'en' ? sutra.explanation.en : sutra.explanation.hi}"</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>

        {/* Main Points */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><BookOpen /> {lang === 'en' ? 'Main Points' : 'मुख्य बिंदु'}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                    {(lang === 'en' ? chapter.main_points.en : chapter.main_points.hi).map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>

        {/* Practice Tips */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Brain /> {lang === 'en' ? 'Practice Tips' : 'अभ्यास के लिए सुझाव'}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                    {(lang === 'en' ? chapter.practice_tips.en : chapter.practice_tips.hi).map((tip, i) => (
                        <li key={i}>{tip}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
        
        <div className="mt-4 pt-4 border-t">
            <Button onClick={() => handleMarkComplete(chapter.id, lang === 'en' ? chapter.title.en : chapter.title.hi)}>
                <CheckCircle className="mr-2 h-4 w-4"/>
                {lang === 'en' ? 'Mark as Complete' : 'पूर्ण के रूप में चिह्नित करें'}
            </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
            <Button variant="ghost" asChild>
                <Link href="/meditation-hub">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {lang === 'en' ? 'Back to Meditation Hub' : 'ध्यान हब पर वापस जाएं'}
                </Link>
            </Button>
            <Button variant="outline" onClick={toggleLanguage}>
                <Languages className="mr-2 h-4 w-4" />
                {lang === 'en' ? 'हिंदी में पढ़ें' : 'Read in English'}
            </Button>
        </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3"><BookOpen /> {collection.title}</CardTitle>
          <CardDescription>{collection.summary}</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="space-y-4">
        {collection.chapters.map(chapter => (
          <ChapterCard key={chapter.id} chapter={chapter} />
        ))}
      </div>

    </div>
  );
}
