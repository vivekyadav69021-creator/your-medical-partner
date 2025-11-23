'use client';

import { useState } from 'react';
import Link from 'next/link';
import { diseases, Disease } from '@/lib/disease-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookHeart, Search } from 'lucide-react';

export default function DiseaseLibraryPage() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDiseases = diseases.filter(disease => {
    const name = language === 'en' ? disease.nameEn : disease.nameHi;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {language === 'en' ? 'Disease Library' : 'रोग पुस्तकालय'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'en'
              ? 'A comprehensive library of diseases and conditions.'
              : 'रोगों और स्थितियों का एक व्यापक पुस्तकालय।'}
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'hi')}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={language === 'en' ? 'Search diseases...' : 'रोग खोजें...'}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredDiseases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDiseases.map((disease) => (
            <Card key={disease.id} className="hover:shadow-md transition-shadow">
              <Link href={`/disease-library/${disease.id}?lang=${language}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookHeart className="w-6 h-6 text-primary" />
                    <span className="flex-1">{language === 'en' ? disease.nameEn : disease.nameHi}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {language === 'en' ? disease.overviewEn : disease.overviewHi}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
         <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
                {language === 'en' ? 'No diseases found.' : 'कोई रोग नहीं मिला।'}
            </p>
        </div>
      )}
    </div>
  );
}
