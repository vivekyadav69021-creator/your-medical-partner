
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { learnCollectionsData, LearnCollectionItem, Chapter, Sutra, Verse } from '@/lib/learn-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, BookOpen, Sparkles, Brain, Star, Languages, MessageCircle, ChevronsRight } from 'lucide-react';
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
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export default function LearnPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const router = useRouter();
  
  const collectionId = Array.isArray(params.collectionId) ? params.collectionId[0] : params.collectionId;
  const chapterId = searchParams.get('chapter');
  
  const firestore = useFirestore();
  const { user } = useUser();

  const [collection, setCollection] = useState<LearnCollectionItem | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
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
      if (chapterId) {
        const foundChapter = foundCollection.chapters.find(ch => ch.id === chapterId);
        setActiveChapter(foundChapter || null);
      } else {
        // If no chapterId is specified, default to the first chapter in the collection
        setActiveChapter(foundCollection.chapters[0] || null);
      }
    } else {
        router.push('/meditation-hub');
    }
  }, [collectionId, chapterId, router]);
  
  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'hi' : 'en';
    setLang(newLang);
    const newUrl = chapterId 
        ? `/learn/${collectionId}?chapter=${chapterId}&lang=${newLang}`
        : `/learn/${collectionId}?lang=${newLang}`;
    router.push(newUrl, { scroll: false });
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
            collectionId: collection?.id,
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

  if (!collection || !activeChapter) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Content not found</h1>
        <Button variant="link" asChild>
          <Link href="/meditation-hub">Back to Hub</Link>
        </Button>
      </div>
    );
  }

  const renderKeyItems = (items: Sutra[] | Verse[] | undefined, type: 'sutra' | 'verse') => {
    if (!items || items.length === 0) return null;
    return (
      <Card>
        <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
                <Star className="text-yellow-500" /> 
                {type === 'sutra' ? (lang === 'en' ? 'Key Sutras' : 'प्रमुख सूत्र') : (lang === 'en' ? 'Key Verses' : 'प्रमुख श्लोक')}
            </CardTitle>
        </CardHeader>
        <CardContent>
             <Accordion type="single" collapsible className="w-full">
                {items.map((item, index) => {
                    const ref = type === 'sutra' ? (item as Sutra).sutra : (item as Verse).verse_ref;
                    return (
                        <AccordionItem value={ref} key={index}>
                            <AccordionTrigger className="text-left">
                                {lang === 'en' ? item.en : item.hi}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-2">
                                <p className="font-mono text-sm text-muted-foreground">{ref}</p>
                                <p className="italic">"{lang === 'en' ? item.explanation.en : item.explanation.hi}"</p>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </CardContent>
    </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{collection.title}</CardTitle>
              <CardDescription>Chapters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {collection.chapters.map(ch => (
                <Link href={`/learn/${collectionId}?chapter=${ch.id}&lang=${lang}`} key={ch.id}>
                   <div className={cn(
                      "p-3 rounded-md text-sm",
                      activeChapter.id === ch.id ? "bg-primary/20 text-primary-foreground font-semibold" : "hover:bg-muted"
                   )}>
                     {lang === 'en' ? ch.title.en : ch.title.hi}
                   </div>
                </Link>
              ))}
            </CardContent>
          </Card>
      </div>
      <div className="md:col-span-3 space-y-6">
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

      <Card className="overflow-hidden">
        <Image 
            src={activeChapter.image} 
            alt={lang === 'en' ? activeChapter.title.en : activeChapter.title.hi}
            width={1200}
            height={400}
            className="w-full h-48 object-cover"
            data-ai-hint="meditation spiritual"
        />
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3"><BookOpen /> {lang === 'en' ? activeChapter.title.en : activeChapter.title.hi}</CardTitle>
          <CardDescription>{lang === 'en' ? activeChapter.summary.en : activeChapter.summary.hi}</CardDescription>
        </CardHeader>
      </Card>
      
      <div className="space-y-4">
        {renderKeyItems(activeChapter.key_sutras, 'sutra')}
        {renderKeyItems(activeChapter.key_verses, 'verse')}

        {/* Main Points */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="text-primary"/> {lang === 'en' ? 'Main Points' : 'मुख्य बिंदु'}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                    {(lang === 'en' ? activeChapter.main_points.en : activeChapter.main_points.hi).map((point, i) => (
                        <li key={i}>{point}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>

        {/* Practice Tips */}
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Brain className="text-primary"/> {lang === 'en' ? 'Practice Tips' : 'अभ्यास के लिए सुझाव'}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="list-disc space-y-2 pl-5">
                    {(lang === 'en' ? activeChapter.practice_tips.en : activeChapter.practice_tips.hi).map((tip, i) => (
                        <li key={i}>{tip}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>

        {activeChapter.notes && (
            <Alert>
                <MessageCircle className="h-4 w-4" />
                <AlertTitle>{lang === 'en' ? 'Note' : 'टिप्पणी'}</AlertTitle>
                <AlertDescription>
                    {lang === 'en' ? activeChapter.notes.en : activeChapter.notes.hi}
                </AlertDescription>
            </Alert>
        )}
        
        <div className="mt-4 pt-4 border-t">
            <Button onClick={() => handleMarkComplete(activeChapter.id, lang === 'en' ? activeChapter.title.en : activeChapter.title.hi)}>
                <CheckCircle className="mr-2 h-4 w-4"/>
                {lang === 'en' ? 'Mark as Complete' : 'पूर्ण के रूप में चिह्नित करें'}
            </Button>
        </div>
      </div>
    </div>
    </div>
  );
}
