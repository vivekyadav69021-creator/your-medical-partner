'use client';

import { useSearchParams } from 'next/navigation';
import { diseases, Disease } from '@/lib/disease-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookHeart, AlertTriangle, Pill, UserMd } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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

export default function DiseaseDetailPage({ params }: { params: { diseaseId: string } }) {
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
            icon={UserMd}
        />
      </div>

    </div>
  );
}

// Dummy UserMd icon as it may not be in lucide-react
const UserMd = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
        <path d="M18.39 16.26C17.29 15.09 15.73 14 12 14s-5.29 1.09-6.39 2.26"/>
        <path d="M9 19H5v-2l2-2"/>
        <path d="M15 19h4v-2l-2-2"/>
        <path d="M12 6V4m0 16v-2"/>
    </svg>
);
