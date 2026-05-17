'use client';

import { notFound } from 'next/navigation';
import { quizzes, lessons } from '@/lib/lessons-data';
import QuizClient from './quiz-client';
import React, { use } from 'react';

interface PageProps {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export default function QuizPage({ params: paramsProp, searchParams: searchParamsProp }: PageProps) {
  const params = use(paramsProp);
  const searchParams = use(searchParamsProp);

  const quiz = quizzes.find(q => q.lessonId === params.lessonId);
  const lesson = lessons.find(l => l.id === params.lessonId);
  const lang = (searchParams.lang === 'hi' ? 'hi' : 'en') as 'en' | 'hi';

  if (!quiz || !lesson) {
    notFound();
  }

  return (
      <QuizClient quiz={quiz} lesson={lesson} lang={lang} />
  );
}