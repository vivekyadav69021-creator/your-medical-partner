
import { notFound } from 'next/navigation';
import { quizzes, lessons } from '@/lib/lessons-data';
import QuizClient from './quiz-client';

export default function QuizPage({ params, searchParams }: { params: { lessonId: string }, searchParams: { lang?: string }}) {
  const quiz = quizzes.find(q => q.lessonId === params.lessonId);
  const lesson = lessons.find(l => l.id === params.lessonId);
  const lang = searchParams.lang === 'hi' ? 'hi' : 'en';

  if (!quiz || !lesson) {
    notFound();
  }

  return (
      <QuizClient quiz={quiz} lesson={lesson} lang={lang} />
  );
}
