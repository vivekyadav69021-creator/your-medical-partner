
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
import { lessons, topics, type Lesson } from '@/lib/lessons-data';
import { BookOpen } from 'lucide-react';


type Language = 'en' | 'hi';

export default function HealthLessonsPage() {
  const [lang, setLang] = useState<Language>('en');
  const [selectedTopic, setSelectedTopic] = useState('All');
  
  const filteredLessons = lessons.filter(
    (lesson) => selectedTopic === 'All' || lesson.topic === selectedTopic
  );
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {lang === 'en' ? 'Health Lessons' : 'स्वास्थ्य पाठ'}
        </h1>
        <p className="text-muted-foreground">
          {lang === 'en'
            ? 'Learn about important health topics.'
            : 'महत्वपूर्ण स्वास्थ्य विषयों के बारे में जानें।'}
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
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
