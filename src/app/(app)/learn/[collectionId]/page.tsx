
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

export default function LearnPage() {
  const params = useParams();
  const { toast } = useToast();
  const { collectionId } = params;

  const [collection, setCollection] = useState<LearnCollectionItem | null>(null);

  useEffect(() => {
    const foundCollection = learnCollectionsData.find(c => c.id === collectionId);
    if (foundCollection) {
      setCollection(foundCollection);
    }
  }, [collectionId]);

  const handleMarkComplete = (chapterTitle: string) => {
    toast({
        title: 'Chapter Marked as Complete!',
        description: `You've completed "${chapterTitle}".`,
    });
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
                        <Button onClick={() => handleMarkComplete(chapter.title)}>
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
