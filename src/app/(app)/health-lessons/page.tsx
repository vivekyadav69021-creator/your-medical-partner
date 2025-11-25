'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import { lessons, quizzes, topics, type Lesson, type Quiz } from '@/lib/lessons-data';
import { GraduationCap, BookOpen, Download, Trophy, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { jsPDF } from 'jspdf';


type Language = 'en' | 'hi';

export default function HealthLessonsPage() {
  const [lang, setLang] = useState<Language>('en');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizLesson, setQuizLesson] = useState<Lesson | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const filteredLessons = lessons.filter(
    (lesson) => selectedTopic === 'All' || lesson.topic === selectedTopic
  );
  
  const startQuiz = (lesson: Lesson) => {
    if (!user) {
        toast({variant: "destructive", title: "Authentication Required", description: "You need to be logged in to take a quiz."});
        return;
    }
    const quiz = quizzes.find(q => q.id === lesson.quizId);
    if (quiz) {
      setQuizLesson(lesson);
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

  const submitQuiz = async () => {
    if (userAnswers.includes(-1)) {
        toast({variant: "destructive", title: "Incomplete Quiz", description: "Please answer all questions."});
        return;
    }
    if (!activeQuiz || !user || !firestore) return;

    const { score, total } = getQuizResult();
    const percentage = Math.round((score / total) * 100);
    
    try {
        const progressRef = doc(firestore, 'users', user.uid, 'progress', activeQuiz.lessonId);
        await setDoc(progressRef, {
            lessonId: activeQuiz.lessonId,
            quizId: activeQuiz.id,
            score,
            total,
            percentage,
            completedAt: serverTimestamp(),
        }, { merge: true });
    } catch(e) {
        console.error("Failed to save progress", e);
        toast({variant: "destructive", title: "Error", description: "Could not save your progress."});
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

  const downloadCertificate = () => {
    if (!quizLesson || !user) return;

    const { score, total } = getQuizResult();
    const date = new Date().toLocaleDateString();
    const userName = user.displayName || user.email || 'Learner';

    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4'
    });

    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    
    doc.setFontSize(28);
    doc.setTextColor(34, 34, 34);
    doc.text("Certificate of Completion", doc.internal.pageSize.getWidth() / 2, 120, { align: 'center' });

    doc.setFontSize(16);
    doc.text("This certifies that", doc.internal.pageSize.getWidth() / 2, 160, { align: 'center' });

    doc.setFontSize(22);
    doc.text(userName, doc.internal.pageSize.getWidth() / 2, 200, { align: 'center' });

    doc.setFontSize(14);
    doc.text(`has successfully completed the lesson: "${quizLesson.title[lang]}"`, doc.internal.pageSize.getWidth() / 2, 240, { align: 'center' });

    doc.text(`Score: ${score} out of ${total}`, doc.internal.pageSize.getWidth() / 2, 270, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Issued: ${date}`, doc.internal.pageSize.getWidth() / 2, 300, { align: 'center' });

    doc.save(`Certificate-${quizLesson.id}.pdf`);
  }


  const resetQuiz = () => {
    setActiveQuiz(null);
    setQuizLesson(null);
    setUserAnswers([]);
    setShowResult(false);
  }

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
      
       <Card>
        <CardHeader>
            <CardTitle>{lang === 'en' ? 'Filters & Language' : 'फ़िल्टर और भाषा'}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{lesson.title[lang]}</CardTitle>
                <CardDescription>{lesson.summary[lang]}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                 <p className="text-sm text-muted-foreground">Topic: {lesson.topic}</p>
              </CardContent>
              <CardContent className="flex gap-2">
                <Button size="sm" asChild>
                    <Link href={`/health-lessons/${lesson.id}?lang=${lang}`}>
                        <BookOpen className="mr-2 h-4 w-4"/>
                        {lang === 'en' ? 'Open Lesson' : 'पाठ खोलें'}
                    </Link>
                </Button>
                <Button size="sm" variant="outline" onClick={() => startQuiz(lesson)}>
                    <HelpCircle className="mr-2 h-4 w-4"/>
                    {lang === 'en' ? 'Take Quiz' : 'क्विज़ दें'}
                </Button>
              </CardContent>
            </Card>
          ))}
      </div>

       <Dialog open={!!activeQuiz} onOpenChange={(isOpen) => !isOpen && resetQuiz()}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{lang === 'en' ? 'Quiz' : 'क्विज़'}: {quizLesson?.title[lang]}</DialogTitle>
            </DialogHeader>
             <div className="space-y-6 max-h-[70vh] overflow-y-auto p-4">
                {!showResult ? (
                    activeQuiz?.questions.map((q, qIndex) => (
                        <div key={qIndex} className="space-y-2">
                            <p className="font-semibold">{qIndex + 1}. {q[lang === 'en' ? 'q' : 'q_hi']}</p>
                            <div className="space-y-2">
                                {q[lang === 'en' ? 'options' : 'options_hi'].map((opt, oIndex) => (
                                    <div 
                                        key={oIndex} 
                                        className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${userAnswers[qIndex] === oIndex ? 'bg-primary/20 border-primary' : 'hover:bg-muted'}`}
                                        onClick={() => handleAnswerSelect(qIndex, oIndex)}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 ${userAnswers[qIndex] === oIndex ? 'border-primary bg-primary' : 'border-muted-foreground'}`} />
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
                                <p className="text-green-600 font-semibold mt-2">{lang === 'en' ? 'Congratulations! You passed.' : 'बधाई हो! आप पास हो गए।'}</p>
                                <Button className="mt-4" onClick={downloadCertificate}><Download className="mr-2 h-4 w-4"/>{lang === 'en' ? 'Download Certificate' : 'प्रमाणपत्र डाउनलोड करें'}</Button>
                            </>
                        ) : (
                            <p className="text-red-600 font-semibold mt-2">{lang === 'en' ? 'Keep trying! You can retake the quiz.' : 'कोशिश करते रहें! आप फिर से क्विज़ दे सकते हैं।'}</p>
                        )}
                    </div>
                )}
            </div>
            <DialogFooter>
                {!showResult ? (
                    <Button onClick={submitQuiz} className="w-full">{lang === 'en' ? 'Submit Quiz' : 'क्विज़ जमा करें'}</Button>
                ) : (
                    <Button onClick={resetQuiz} variant="outline" className="w-full">{lang === 'en' ? 'Close' : 'बंद करें'}</Button>
                )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
