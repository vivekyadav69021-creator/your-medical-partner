
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { learnCollectionsData, LearnCollectionItem } from '@/lib/learn-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LearnPage() {
  const params = useParams();
  const { toast } = useToast();
  const { collectionId } = params;
  const router = useRouter();
  
  const firestore = useFirestore();
  const { user } = useUser();

  const [collection, setCollection] = useState<LearnCollectionItem | null>(null);

  useEffect(() => {
    const foundCollection = learnCollectionsData.find(c => c.id === collectionId);
    if (foundCollection) {
      setCollection(foundCollection);
    } else {
        router.push('/meditation-hub');
    }
  }, [collectionId, router]);

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
            title: 'Chapter Marked as Complete!',
            description: `You've completed "${chapterTitle}".`,
        });
    } catch (error) {
        console.error("Error marking as complete:", error);
        toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save your progress.'});
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" asChild>
            <Link href="/meditation-hub">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Meditation Hub
            </Link>
        </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3"><BookOpen /> {collection.title}</CardTitle>
          <CardDescription>{collection.summary}</CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {collection.chapters.map(chapter => (
                <AccordionItem value={chapter.id} key={chapter.id}>
                  <AccordionTrigger>{chapter.title}</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{chapter.summary}</p>
                    <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: chapter.full_text || '' }} />
                    <div className="mt-4">
                        <Button onClick={() => handleMarkComplete(chapter.id, chapter.title)}>
                            <CheckCircle className="mr-2 h-4 w-4"/>
                            Mark as Complete
                        </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </CardContent>
      </Card>

    </div>
  );
}
