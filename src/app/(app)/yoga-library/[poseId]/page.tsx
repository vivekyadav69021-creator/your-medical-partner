'use client';

import { useSearchParams, notFound } from 'next/navigation';
import Image from 'next/image';
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
import { ArrowLeft, CheckCircle, Info } from 'lucide-react';
import { yogaLibrary } from '@/lib/yoga-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

const InfoSection = ({ title, items, lang }: { title: string, items: string[], lang: 'en' | 'hi' }) => (
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

  const image = PlaceHolderImages.find(img => img.id === pose.imageId);

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
          <div>
            {image && (
              <Card>
                <CardContent className="p-0">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    width={600}
                    height={600}
                    className="rounded-lg object-cover w-full aspect-square"
                    data-ai-hint={image.imageHint}
                  />
                </CardContent>
              </Card>
            )}
          </div>
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
            lang={lang}
        />
         <BenefitsSection 
            title={lang === 'en' ? 'Benefits' : 'लाभ'} 
            items={benefits} 
        />
      </div>
    </div>
  );
}
