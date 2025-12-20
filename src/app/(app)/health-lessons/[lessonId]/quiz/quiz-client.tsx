
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Award, Download, ArrowLeft } from 'lucide-react';
import { type Quiz, type Lesson } from '@/lib/lessons-data';
import { jsPDF } from 'jspdf';
import { useToast } from '@/hooks/use-toast';

type Language = 'en' | 'hi';

interface QuizClientProps {
  quiz: Quiz;
  lesson: Lesson;
  lang: Language;
}

export default function QuizClient({ quiz, lesson, lang }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    Array(quiz.questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const score = selectedAnswers.reduce((total, answer, index) => {
    return answer === quiz.questions[index].answer ? total + 1 : total;
  }, 0);
  
  const percentage = Math.round((score / quiz.questions.length) * 100);

  const downloadCertificate = () => {
    try {
        const doc = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });
        const userName = 'Guest';

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Background
        doc.setFillColor(248, 250, 252); // bg-slate-50
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Border
        doc.setDrawColor(203, 213, 225); // border-slate-300
        doc.setLineWidth(10);
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);
        doc.setLineWidth(2);
        doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
        
        // Title
        doc.setFontSize(40);
        doc.setFont('times', 'bold');
        doc.setTextColor(29, 78, 216); // text-blue-700
        doc.text('Certificate of Completion', pageWidth / 2, 80, { align: 'center' });

        // Subtitle
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139); // text-slate-500
        doc.text('This certificate is proudly presented to', pageWidth / 2, 110, { align: 'center' });
        
        // User Name
        doc.setFontSize(36);
        doc.setFont('times', 'italic');
        doc.setTextColor(15, 23, 42); // text-slate-900
        doc.text(userName || 'Valued Learner', pageWidth / 2, 160, { align: 'center' });

        // Line
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(1);
        doc.line(100, 180, pageWidth - 100, 180);

        // Completion text
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text(`For successfully completing the course`, pageWidth / 2, 210, { align: 'center' });
        
        // Lesson Title
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(lesson.title[lang], pageWidth / 2, 240, { align: 'center' });

        // Date
        const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date of Completion: ${date}`, pageWidth / 2, 280, { align: 'center' });
        
        // Signature line
        doc.line(pageWidth / 2 - 80, 320, pageWidth / 2 + 80, 320);
        doc.setFontSize(12);
        doc.text('Authorized Signature', pageWidth / 2, 335, { align: 'center' });

        doc.save(`${userName}_${lesson.id}_Certificate.pdf`);

        toast({ title: "Certificate Downloaded!", description: "Your certificate has been saved as a PDF." });

    } catch (error) {
        console.error("Failed to generate PDF:", error);
        toast({ variant: "destructive", title: "Download Failed", description: "Could not generate the certificate." });
    }
  };

  if (showResults) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
          <CardDescription>Lesson: {lesson.title[lang]}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg text-muted-foreground">You scored</p>
          <p className="text-6xl font-bold my-2">
            {score} / {quiz.questions.length}
          </p>
           <Progress value={percentage} className="w-full h-4 my-4" />
          {percentage >= 50 ? (
            <div className="flex flex-col items-center gap-2 text-green-600">
              <CheckCircle className="w-12 h-12" />
              <p className="font-semibold">Congratulations! You passed!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-destructive">
              <XCircle className="w-12 h-12" />
              <p className="font-semibold">You can do better! Please try again.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/health-lessons/${lesson.id}?lang=${lang}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {lang === 'en' ? 'Back to Lesson' : 'पाठ पर वापस'}
            </Link>
          </Button>
          {percentage >= 50 && (
             <Button onClick={downloadCertificate}>
              <Download className="mr-2 h-4 w-4" />
              {lang === 'en' ? 'Download Certificate' : 'प्रमाणपत्र डाउनलोड करें'}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {lang === 'en' ? `Question ${currentQuestionIndex + 1} of ${quiz.questions.length}` : `प्रश्न ${currentQuestionIndex + 1} का ${quiz.questions.length}`}
        </CardTitle>
        <CardDescription>{lesson.title[lang]}</CardDescription>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-lg font-semibold">
          {lang === 'en' ? currentQuestion.q : currentQuestion.q_hi}
        </p>
        <RadioGroup
          value={String(selectedAnswers[currentQuestionIndex])}
          onValueChange={(value) => handleAnswerSelect(Number(value))}
          className="space-y-2"
        >
          {(lang === 'en' ? currentQuestion.options : currentQuestion.options_hi).map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 border rounded-md has-[:checked]:bg-primary/20 has-[:checked]:border-primary">
              <RadioGroupItem value={String(index)} id={`q${currentQuestionIndex}-opt${index}`} />
              <Label htmlFor={`q${currentQuestionIndex}-opt${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button onClick={handleNext} disabled={selectedAnswers[currentQuestionIndex] === null}>
          {currentQuestionIndex < quiz.questions.length - 1 ? (lang === 'en' ? 'Next Question' : 'अगला प्रश्न') : (lang === 'en' ? 'Finish Quiz' : 'प्रश्नोत्तरी समाप्त करें')}
        </Button>
      </CardFooter>
    </Card>
  );
}
