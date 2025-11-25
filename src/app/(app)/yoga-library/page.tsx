'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Wind } from 'lucide-react';
import { yogaLibrary, YogaPose } from '@/lib/yoga-data';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const YogaCard = ({ pose, lang }: { pose: YogaPose, lang: 'en' | 'hi' }) => {
  const name = lang === 'en' ? pose.name.en : pose.name.hi;
  const description = lang === 'en' ? pose.description.en : pose.description.hi;

  return (
    <Link href={`/yoga-library/${pose.id}?lang=${lang}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
        <CardHeader>
           <p className="text-xs font-semibold uppercase text-primary">{pose.category}</p>
          <CardTitle className="text-lg font-semibold line-clamp-2">{name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <CardDescription className="text-sm mt-1 line-clamp-3">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}


export default function YogaLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const filteredPoses = yogaLibrary.filter(pose => {
    const name = lang === 'en' ? pose.name.en : pose.name.hi;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const t = {
    en: {
        title: "Yoga Library",
        description: "Explore various yoga poses with detailed instructions and benefits.",
        searchPlaceholder: "Search for a yoga pose...",
    },
    hi: {
        title: "योग लाइब्रेरी",
        description: "विस्तृत निर्देशों और लाभों के साथ विभिन्न योग आसनों का अन्वेषण करें।",
        searchPlaceholder: "एक योग आसन खोजें...",
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {t[lang].title}
          </h1>
          <p className="text-muted-foreground">
            {t[lang].description}
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Label htmlFor="lang-toggle">English</Label>
            <Switch id="lang-toggle" checked={lang === 'hi'} onCheckedChange={(checked) => setLang(checked ? 'hi' : 'en')} />
            <Label htmlFor="lang-toggle">हिंदी</Label>
        </div>
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder={t[lang].searchPlaceholder}
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPoses.length > 0 ? (
          filteredPoses.map(pose => (
            <YogaCard key={pose.id} pose={pose} lang={lang} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No poses found.</p>
        )}
      </div>
    </div>
  );
}
