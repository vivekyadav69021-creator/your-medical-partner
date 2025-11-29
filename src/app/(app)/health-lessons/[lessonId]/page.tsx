
'use client';

import { useSearchParams, useParams, notFound } from 'next/navigation';
import { lessons } from '@/lib/lessons-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookHeart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LessonDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') === 'hi' ? 'hi' : 'en';

  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;
  const lesson = lessons.find(l => l.id === lessonId);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div>
         <Button variant="ghost" asChild>
            <Link href="/health-lessons" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {lang === 'en' ? 'Back to All Lessons' : 'सभी पाठों पर वापस जाएं'}
            </Link>
         </Button>
        <h1 className="text-4xl font-bold tracking-tight font-headline mt-2">
          {lang === 'en' ? lesson.title.en : lesson.title.hi}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
            {lang === 'en' ? lesson.summary.en : lesson.summary.hi}
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <BookHeart className="w-6 h-6 text-primary"/>
                {lang === 'en' ? 'Lesson Content' : 'पाठ सामग्री'}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="prose prose-lg max-w-full dark:prose-invert" dangerouslySetInnerHTML={{ __html: lang === 'en' ? lesson.content.en : lesson.content.hi }} />
        </CardContent>
    </Card>
    
    <Alert>
      <AlertTitle>{lang === 'en' ? 'Next Step' : 'अगला कदम'}</AlertTitle>
      <AlertDescription>
        {lang === 'en' ? 'Ready to test your knowledge? Go back to the lessons page to take the quiz and earn your certificate!' : 'क्या आप अपना ज्ञान परखने के लिए तैयार हैं? क्विज़ देने और अपना प्रमाणपत्र अर्जित करने के लिए पाठ पृष्ठ पर वापस जाएं!'}
      </AlertDescription>
    </Alert>

    </div>
  );
}
