'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { lessons, quizzes, topics, Lesson, Quiz } from '@/lib/lessons-data';
import { GraduationCap, BookOpen, Download, Trophy, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type Language = 'en' | 'hi';

export default function HealthLessonsPage() {
  const [lang, setLang] = useState<Language>('en');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();

  const filteredLessons = lessons.filter(
    (lesson) => selectedTopic === 'All' || lesson.topic === selectedTopic
  );

  const openLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setActiveQuiz(null);
    setShowResult(false);
    setUserAnswers([]);
  };
  
  const startQuiz = (lesson: Lesson) => {
    const quiz = quizzes.find(q => q.id === lesson.quizId);
    if (quiz) {
      setSelectedLesson(lesson);
      setActiveQuiz(quiz);
      setShowResult(false);
      setUserAnswers(Array(quiz.questions.length).fill(-1));
    } else {
        toast({variant: "destructive", title: "Quiz not found", description: "This lesson does not have a quiz yet."});
    }
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const submitQuiz = () => {
    if (userAnswers.includes(-1)) {
        toast({variant: "destructive", title: "Incomplete Quiz", description: "Please answer all questions."});
        return;
    }
    setShowResult(true);
  };
  
  const getQuizResult = () => {
    if (!activeQuiz) return { score: 0, total: 0 };
    let correct = 0;
    activeQuiz.questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) {
        correct++;
      }
    });
    return { score: correct, total: activeQuiz.questions.length };
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {lang === 'en' ? 'Health Lessons' : 'स्वास्थ्य पाठ'}
        </h1>
        <p className="text-muted-foreground">
          {lang === 'en'
            ? 'Learn, take quizzes, and earn certificates.'
            : 'सीखें, क्विज़ दें, और प्रमाणपत्र अर्जित करें।'}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
           <Card>
            <CardHeader>
                <CardTitle>{lang === 'en' ? 'Filters & Language' : 'फ़िल्टर और भाषा'}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Label htmlFor="filter-topic">{lang === 'en' ? 'Topic' : 'विषय'}</Label>
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                        <SelectTrigger id="filter-topic" className="w-[180px]">
                            <SelectValue placeholder="Select topic" />
                        </SelectTrigger>
                        <SelectContent>
                            {topics.map(topic => (
                                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
                 <div className="flex items-center space-x-2">
                    <Label htmlFor="lang-toggle">English</Label>
                    <Switch id="lang-toggle" checked={lang === 'hi'} onCheckedChange={(checked) => setLang(checked ? 'hi' : 'en')} />
                    <Label htmlFor="lang-toggle">हिंदी</Label>
                </div>
            </CardContent>
           </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {lang === 'en' ? 'Lessons' : 'पाठ'}
              </CardTitle>
              <CardDescription>{lang === 'en' ? 'Select a topic to start learning' : 'सीखना शुरू करने के लिए एक विषय चुनें'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredLessons.map((lesson) => (
                <Card key={lesson.id} className="p-4 flex flex-col sm:flex-row gap-4">
                   <Image 
                      src={lesson.image} 
                      alt={lesson.title[lang]} 
                      width={150} height={100} 
                      className="rounded-md object-cover"
                      data-ai-hint="lesson illustration"
                    />
                  <div className="flex-1">
                    <h3 className="font-semibold">{lesson.title[lang]}</h3>
                    <p className="text-sm text-muted-foreground">{lesson.summary[lang]}</p>
                     <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => openLesson(lesson)}><BookOpen className="mr-2 h-4 w-4"/>{lang === 'en' ? 'Open Lesson' : 'पाठ खोलें'}</Button>
                        <Button size="sm" variant="outline" onClick={() => startQuiz(lesson)}><HelpCircle className="mr-2 h-4 w-4"/>{lang === 'en' ? 'Take Quiz' : 'क्विज़ दें'}</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedLesson ? selectedLesson.title[lang] : (lang === 'en' ? 'Lesson Viewer' : 'पाठ दर्शक')}</CardTitle>
              <CardDescription>{selectedLesson ? selectedLesson.summary[lang] : (lang === 'en' ? 'Lesson details will appear here.' : 'पाठ का विवरण यहाँ दिखाई देगा।')}</CardDescription>
            </CardHeader>
            <CardContent>
                {!selectedLesson && (
                    <div className="text-center text-muted-foreground p-8">
                        <GraduationCap className="mx-auto h-12 w-12" />
                        <p className="mt-4">{lang === 'en' ? 'Select a lesson to view its content.' : 'सामग्री देखने के लिए एक पाठ चुनें।'}</p>
                    </div>
                )}
                {selectedLesson && !activeQuiz && (
                    <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: selectedLesson.content[lang] }}></div>
                )}
                {activeQuiz && (
                    <div className="space-y-6">
                        {!showResult ? (
                            activeQuiz.questions.map((q, qIndex) => (
                                <div key={qIndex} className="space-y-2">
                                    <p className="font-semibold">{qIndex + 1}. {q[lang === 'en' ? 'q' : 'q_hi']}</p>
                                    <div className="space-y-1">
                                        {q[lang === 'en' ? 'options' : 'options_hi'].map((opt, oIndex) => (
                                            <div 
                                                key={oIndex} 
                                                className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer ${userAnswers[qIndex] === oIndex ? 'bg-primary/20 border-primary' : 'hover:bg-muted'}`}
                                                onClick={() => handleAnswerSelect(qIndex, oIndex)}
                                            >
                                                <input type="radio" name={`q-${qIndex}`} checked={userAnswers[qIndex] === oIndex} readOnly className="h-4 w-4"/>
                                                <Label className="flex-1 cursor-pointer">{opt}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                             <div className="text-center p-4 rounded-lg bg-secondary">
                                <Trophy className={`mx-auto h-12 w-12 ${getQuizResult().score / getQuizResult().total >= 0.8 ? 'text-yellow-500' : 'text-muted-foreground'}`}/>
                                <h3 className="text-xl font-bold mt-2">{lang === 'en' ? 'Quiz Result' : 'क्विज़ परिणाम'}</h3>
                                <p className="text-2xl font-bold">{getQuizResult().score} / {getQuizResult().total}</p>
                                {getQuizResult().score / getQuizResult().total >= 0.8 ? (
                                    <>
                                        <p className="text-green-600 font-semibold">{lang === 'en' ? 'Congratulations! You passed.' : 'बधाई हो! आप पास हो गए।'}</p>
                                        <Button className="mt-4"><Download className="mr-2 h-4 w-4"/>{lang === 'en' ? 'Download Certificate' : 'प्रमाणपत्र डाउनलोड करें'}</Button>
                                    </>
                                ) : (
                                    <p className="text-red-600 font-semibold">{lang === 'en' ? 'Keep trying! You can retake the quiz.' : 'कोशिश करते रहें! आप फिर से क्विज़ दे सकते हैं।'}</p>
                                )}
                            </div>
                        )}

                        {!showResult && <Button onClick={submitQuiz} className="w-full">{lang === 'en' ? 'Submit Quiz' : 'क्विज़ जमा करें'}</Button>}
                    </div>
                )}
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
                <CardTitle>{lang === 'en' ? 'Your Progress' : 'आपकी प्रगति'}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Progress summary will be available soon.</p>
                 <Button disabled className="mt-2"><Download className="mr-2 h-4 w-4"/>{lang === 'en' ? 'Download Certificates' : 'प्रमाणपत्र डाउनलोड करें'}</Button>
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
