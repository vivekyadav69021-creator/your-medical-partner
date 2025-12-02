'use client';

import { useSearchParams } from 'next/navigation';
import { diseases } from '@/lib/disease-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookHeart, AlertTriangle, Pill, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TTSWidget } from '@/components/tts-widget';
import React from 'react';

const InfoCard = ({ title, content, icon: Icon }: { title: string, content: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-primary"/>
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="prose prose-sm max-w-full dark:prose-invert" dangerouslySetInnerHTML={{ __html: content }} />
        </CardContent>
    </Card>
);

export default function DiseaseDetailPage({ params: paramsProp }: { params: { diseaseId: string } }) {
  const params = React.use(paramsProp);
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') === 'hi' ? 'hi' : 'en';

  const disease = diseases.find(d => d.id === params.diseaseId);

  if (!disease) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">
            {lang === 'en' ? 'Disease not found' : 'रोग नहीं मिला'}
        </h1>
        <Link href="/disease-library">
            <Button variant="link">
                {lang === 'en' ? 'Back to library' : 'पुस्तकालय पर वापस जाएं'}
            </Button>
        </Link>
      </div>
    );
  }
  
  const textToSpeak = `
    ${lang === 'en' ? disease.nameEn : disease.nameHi}.
    ${lang === 'en' ? 'Overview' : 'अवलोकन'}. ${lang === 'en' ? disease.overviewEn : disease.overviewHi}.
    ${lang === 'en' ? 'Symptoms' : 'लक्षण'}. ${lang === 'en' ? disease.symptomsEn : disease.symptomsHi}.
    ${lang === 'en' ? 'Treatment' : 'इलाज'}. ${lang === 'en' ? disease.treatmentEn : disease.treatmentHi}.
    ${lang === 'en' ? 'When to See a Doctor' : 'डॉक्टर से कब मिलें'}. ${lang === 'en' ? disease.whenToSeeDoctorEn : disease.whenToSeeDoctorHi}.
  `.replace(/<[^>]+>/g, ''); // Strip HTML tags

  return (
    <div className="space-y-8">
       <div>
         <Button variant="ghost" asChild>
            <Link href="/disease-library" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {lang === 'en' ? 'Back to Library' : 'पुस्तकालय पर वापस जाएं'}
            </Link>
         </Button>
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          {lang === 'en' ? disease.nameEn : disease.nameHi}
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
            {lang === 'en' ? disease.overviewEn : disease.overviewHi}
        </p>
      </div>

      <TTSWidget textToSpeak={textToSpeak} initialLang={lang === 'en' ? 'en-IN' : 'hi-IN'} />

      <div className="grid gap-6">
        <InfoCard 
            title={lang === 'en' ? 'Symptoms' : 'लक्षण'} 
            content={lang === 'en' ? disease.symptomsEn : disease.symptomsHi}
            icon={AlertTriangle}
        />
        <InfoCard 
            title={lang === 'en' ? 'Treatment' : 'इलाज'}
            content={lang === 'en' ? disease.treatmentEn : disease.treatmentHi}
            icon={Pill}
        />
        <InfoCard 
            title={lang === 'en' ? 'When to See a Doctor' : 'डॉक्टर से कब मिलें'}
            content={lang === 'en' ? disease.whenToSeeDoctorEn : disease.whenToSeeDoctorHi}
            icon={User}
        />
      </div>

    </div>
  );
}
