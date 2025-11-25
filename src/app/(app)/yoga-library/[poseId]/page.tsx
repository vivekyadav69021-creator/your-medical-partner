'use client';

import { useSearchParams, notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { yogaLibrary } from '@/lib/yoga-data';
import { Badge } from '@/components/ui/badge';

const InfoSection = ({ title, items }: { title: string, items: string[] }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <ol className="list-decimal list-inside space-y-2">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ol>
        </CardContent>
    </Card>
);

const BenefitsSection = ({ title, items }: { title: string, items: string[] }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
    </Card>
);


export default function YogaPoseDetailPage({ params }: { params: { poseId: string } }) {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') === 'hi' ? 'hi' : 'en';
  
  const pose = yogaLibrary.find(p => p.id === params.poseId);

  if (!pose) {
    notFound();
  }
  
  const name = lang === 'en' ? pose.name.en : pose.name.hi;
  const description = lang === 'en' ? pose.description.en : pose.description.hi;
  const instructions = lang === 'en' ? pose.instructions.en : pose.instructions.hi;
  const benefits = lang === 'en' ? pose.benefits.en : pose.benefits.hi;

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/yoga-library?lang=${lang}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {lang === 'en' ? 'Back to Yoga Library' : 'योग लाइब्रेरी पर वापस जाएं'}
          </Link>
        </Button>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6">
            <div>
              <Badge>{pose.category}</Badge>
              <h1 className="text-4xl font-bold tracking-tight font-headline mt-2">{name}</h1>
            </div>
            <p className="text-muted-foreground text-lg">{description}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid md:grid-cols-2 gap-8">
        <InfoSection 
            title={lang === 'en' ? 'Instructions' : 'निर्देश'} 
            items={instructions}
        />
         <BenefitsSection 
            title={lang === 'en' ? 'Benefits' : 'लाभ'} 
            items={benefits} 
        />
      </div>
    </div>
  );
}
