'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  PlayCircle,
  Timer,
  PlusCircle,
  BookOpen,
  Leaf,
  BrainCircuit,
  BarChart2,
  Download,
  Star,
  Wind,
  ShieldCheck,
  Heart,
  Zap,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const heroContent = {
  en: 'Learn meditation, ancient Indian techniques, Patanjali Yoga-Sutras, Bhagavad Gita insights, and personalized practice plans. Download plans and add reminders.',
  hi: 'ध्यान सीखें — प्राचीन भारतीय तकनीकें, पतंजलि योग-सूत्र, भगवद गीता के विचार, और व्यक्तिगत अभ्यास योजनाएँ। प्लान डाउनलोड करें और रिमाइंडर जोड़ें।',
};

const quickIntroContent = {
  en: 'Start with a 5–10 minute guided meditation. Choose a technique, press play, follow instructions, and record how you felt.',
  hi: '5–10 मिनट के गाइडेड ध्यान से शुरू करें। एक तकनीक चुनें, प्ले दबाएँ, निर्देशों का पालन करें और अनुभव नोट करें।',
};

const guidedMeditations = [
  {
    id: 'gm1',
    title: { en: 'Breath Awareness (5 min)', hi: 'श्वास-सचेतना (5 मिनट)' },
    description: {
      en: 'Simple breathing attention practice — focus on inhale & exhale to calm the mind.',
      hi: 'सादा श्वास पर ध्यान — श्वास-प्रश्वास पर ध्यान देकर मन को शांत करें।',
    },
    tags: ['breath', 'beginner'],
  },
  {
    id: 'gm2',
    title: { en: 'Body Scan (10 min)', hi: 'बॉडी स्कैन (10 मिनट)' },
    description: {
      en: 'Progressive attention from toes to head — great for sleep and stress reduction.',
      hi: 'पैरों से सिर तक क्रमिक ध्यान — नींद और तनाव कम करने के लिए अच्छा।',
    },
    tags: ['body-scan', 'intermediate'],
  },
  {
    id: 'gm3',
    title: { en: 'Mantra Meditation (Om)', hi: 'मंत्र ध्यान (ॐ)' },
    description: {
      en: 'Use a short mantra (ॐ) or a protective chant. Repeat gently with breath.',
      hi: 'संक्षिप्त मंत्र (ॐ) का उपयोग करें। श्वास के साथ धीरे-धीरे दोहराएँ।',
    },
    tags: ['mantra', 'ancient'],
  },
];

const ancientTechniques = [
    {
        heading: { en: 'Dhyana (ध्याना)', hi: 'ध्यान (Dhyana)' },
        body: { en: 'Sustained attention on a single object or breath leading to deep concentration (dharana) and absorption (samadhi). Core of Patanjali\'s eight-limbs.', hi: 'किसी एक वस्तु या श्वास पर निरंतर ध्यान — धारण और समाधि की ओर ले जाने वाली स्थिति। पतंजलि के अष्टांग योग का मूल।' }
    },
    {
        heading: { en: 'Mantra (मंत्र)', hi: 'मंत्र' },
        body: { en: 'Repeating a sacred syllable or verse (e.g., Om, Gayatri) to steady the mind and tune subtle awareness.', hi: 'पवित्र शब्द या श्लोक दोहराना (जैसे ॐ, गायत्री) — मन को स्थिर करना और सूक्ष्म चेतना को जगाना।' }
    },
    {
        heading: { en: 'Trataka (त्राटक)', hi: 'त्राटक' },
        body: { en: 'Steady gazing on a candle flame or small object to train focus and soothe the nervous system.', hi: 'मोमबत्ती की लौ या किसी छोटे बिंदु पर स्थिर दृष्टि — एकाग्रता का प्रशिक्षण और तंत्रिका तंत्र को शान्त करना।' }
    },
    {
        heading: { en: 'Pranayama (प्राणायाम)', hi: 'प्राणायाम' },
        body: { en: 'Breath control practices (Nadi Shodhana, Bhramari) that regulate prana and prepare mind for meditation.', hi: 'श्वास-नियंत्रण (नाड़ी शोधन, भ्रामरी) जो प्राण को नियंत्रित कर के ध्यान के लिए मन तैयार करते हैं।' }
    }
];

const benefits = {
  en: ['Reduces stress and anxiety', 'Improves sleep quality', 'Enhances attention & memory', 'Supports emotional regulation', 'Lowers resting heart rate and blood pressure'],
  hi: ['तनाव और चिन्ता कम करता है', 'नींद की गुणवत्ता सुधारता है', 'एकाग्रता और स्मृति बढ़ाता है', 'भावनात्मक संतुलन में मदद करता है', 'हृदय गति और रक्तचाप घटता है']
};

const patanjaliSutras = [
    {
        id: 's1',
        heading: { en: 'Overview', hi: 'परिचय' },
        body: { en: "Patanjali's Yoga-Sutras present an 8-limb (Ashtanga) system: Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, Samadhi. Practicing these systematically leads to mental clarity and liberation.", hi: 'पतंजलि योगसूत्र अष्टांग (यम, नियम, आसन, प्राणायाम, प्रत्याहार, धारण, ध्यान, समाधि) प्रणाली बताते हैं। इन्हें नियमित अभ्यास से मानसिक स्पष्टता मिलती है।' }
    },
    {
        id: 's2',
        heading: { en: 'Chapter: Samadhi Pada (Sample excerpt)', hi: 'समाधि पाद (उदाहरण अंश)' },
        body: { en: 'Sutra 1.2: Yogash chitta vritti nirodhah — Yoga is the cessation of the fluctuations of the mind. (Practice note: focus on reducing mental chatter.)', hi: 'सूत्र 1.2: योगश् चित्त-वृत्ती निरोधः — योग मन की वृत्तियों का निरोध है। (अभ्यास: मानसिक विचारों की संख्या घटाने पर ध्यान दें।)' }
    },
    {
        id: 's3',
        heading: { en: 'Chapter Summaries (All 4 books)', hi: 'पाठ सारांश (चार अध्याय)' },
        body: { en: '1) Samadhi Pada: theory of mind & goal of yoga. 2) Sadhana Pada: practice methods. 3) Vibhuti Pada: powers & concentration results. 4) Kaivalya Pada: liberation.', hi: '1) समाधि पाद: मन का सिद्धांत व योग का लक्ष्य. 2) साधन पाद: अभ्यास विधियाँ। 3) विभूति पाद: एकाग्रता के फल व शक्तियाँ. 4) कैवल्य पाद: पुरुष की स्वतंत्रता।' }
    }
];

const bhagavadGita = {
    en: "The Bhagavad Gita emphasizes action with detachment (karma-yoga), devotion (bhakti) and knowledge (jnana). Its teachings complement meditation by providing ethical and motivational context. Key: equanimity (samatva) and focus on duty.",
    hi: "भगवद गीता त्यागयुक्त कर्म (कर्मयोग), भक्ति और ज्ञान को महत्व देती है। यह ध्यान के अभ्यास को नैतिक और प्रेरक संदर्भ देती है। मुख्य: समत्व और कर्तव्य पर ध्यान।"
};

const practicePlans = [
    {
        id: 'plan1',
        title: { en: 'Beginner — 2 weeks', hi: 'शुरुआती — 2 सप्ताह' },
        features: {
            en: ["Daily 10 min breath awareness", "3 days/week body-scan", "Weekly reflection note"],
            hi: ["रोज़ 10 मिनट श्वास-सचेतना", "सप्ताह में 3 बार बॉडी-स्कैन", "साप्ताहिक रिकॉर्ड"]
        }
    },
    {
        id: 'plan2',
        title: { en: 'Intermediate — 4 weeks', hi: 'मध्यम — 4 सप्ताह' },
        features: {
            en: ["Daily 20 min guided meditations", "Alternate pranayama", "Weekly longer practice"],
            hi: ["रोज़ 20 मिनट गाइडेड ध्यान", "वैकल्पिक प्राणायाम", "साप्ताहिक लंबा अभ्यास"]
        }
    }
];

export default function MeditationHubPage() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const heroImage = PlaceHolderImages.find(p => p.id === 'meditation-hero');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end space-x-2">
        <Label htmlFor="langToggle" className={lang === 'en' ? 'font-bold' : ''}>English</Label>
        <Switch
            id="langToggle"
            checked={lang === 'hi'}
            onCheckedChange={(checked) => setLang(checked ? 'hi' : 'en')}
            aria-label="Toggle language"
        />
        <Label htmlFor="langToggle" className={lang === 'hi' ? 'font-bold' : ''}>हिंदी</Label>
      </div>

      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-6 md:p-8">
            <CardHeader className="p-0">
              <CardTitle className="text-3xl font-bold font-headline">{lang === 'en' ? 'Meditation Hub' : 'ध्यान हब'}</CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-4">
              <p className="text-muted-foreground">{heroContent[lang]}</p>
            </CardContent>
          </div>
          <div className="relative min-h-[200px] md:min-h-0">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                layout="fill"
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />
            )}
          </div>
        </div>
      </Card>
      
      <p className="text-center text-muted-foreground italic">{quickIntroContent[lang]}</p>
      
      <Separator />

      <Tabs defaultValue="guided">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
          <TabsTrigger value="guided">{lang === 'en' ? 'Guided Meditations' : 'गाइडेड मेडिटेशन'}</TabsTrigger>
          <TabsTrigger value="types">{lang === 'en' ? 'Ancient Techniques' : 'प्राचीन तकनीकें'}</TabsTrigger>
          <TabsTrigger value="benefits">{lang === 'en' ? 'Benefits' : 'लाभ'}</TabsTrigger>
          <TabsTrigger value="patanjali">{lang === 'en' ? 'Patanjali' : 'पतंजलि'}</TabsTrigger>
          <TabsTrigger value="bhagavad">{lang === 'en' ? 'Gita' : 'गीता'}</TabsTrigger>
          <TabsTrigger value="practicePlans">{lang === 'en' ? 'Practice Plans' : 'अभ्यास योजनाएँ'}</TabsTrigger>
          <TabsTrigger value="analysis">{lang === 'en' ? 'Analytics' : 'विश्लेषण'}</TabsTrigger>
        </TabsList>

        <TabsContent value="guided" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guidedMeditations.map(med => (
              <Card key={med.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{med.title[lang]}</CardTitle>
                  <div className="flex gap-2 pt-1">
                    {med.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm">{med.description[lang]}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm"><PlayCircle className="mr-2" />{lang === 'en' ? 'Play' : 'प्ले'}</Button>
                  <Button variant="ghost" size="sm"><Timer className="mr-2" />{lang === 'en' ? 'Timer' : 'टाइमर'}</Button>
                  <Button variant="ghost" size="sm"><PlusCircle className="mr-2" />{lang === 'en' ? 'Add' : 'जोड़ें'}</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="types" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
                {ancientTechniques.map(tech => (
                    <Card key={tech.heading.en}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Leaf className="w-5 h-5 text-primary"/>{tech.heading[lang]}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{tech.body[lang]}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
        
        <TabsContent value="benefits" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Heart className="w-6 h-6 text-red-500"/>{lang === 'en' ? 'Key Benefits of Regular Practice' : 'नियमित अभ्यास के मुख्य लाभ'}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {benefits[lang].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-primary"/>
                            <p>{benefit}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="patanjali" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen className="w-6 h-6 text-primary"/>{lang === 'en' ? "Patanjali's Yoga-Sutras" : "पतंजलि योगसूत्र"}</CardTitle>
                    <CardDescription>{lang === 'en' ? 'Core principles of classical yoga philosophy.' : 'शास्त्रीय योग दर्शन के मूल सिद्धांत।'}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {patanjaliSutras.map(sutra => (
                            <AccordionItem value={sutra.id} key={sutra.id}>
                                <AccordionTrigger>{sutra.heading[lang]}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="prose prose-sm dark:prose-invert max-w-none">{sutra.body[lang]}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="bhagavad" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen className="w-6 h-6 text-amber-600"/>{lang === 'en' ? 'Insights from the Bhagavad Gita' : 'भगवद गीता के विचार'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{bhagavadGita[lang]}</p>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="practicePlans" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
                {practicePlans.map(plan => (
                    <Card key={plan.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{plan.title[lang]}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-2">
                            {plan.features[lang].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm">
                                    <Zap className="w-4 h-4 text-primary"/>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">{lang === 'en' ? 'Start Plan' : 'प्लान शुरू करें'}</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
             <Card className="text-center">
                 <CardHeader>
                     <CardTitle className="flex items-center justify-center gap-2"><BarChart2 className="w-6 h-6"/>{lang === 'en' ? 'Practice Analytics' : 'अभ्यास विश्लेषण'}</CardTitle>
                 </CardHeader>
                 <CardContent className="flex flex-col items-center gap-4 py-8">
                     <BarChart2 className="w-12 h-12 text-muted-foreground"/>
                    <p className="text-muted-foreground">{lang === 'en' ? 'Coming Soon: Track streaks, session duration, and mood.' : 'जल्द आ रहा है: अपनी स्ट्रीक्स, सत्र की अवधि और मूड को ट्रैक करें।'}</p>
                 </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
      
      <Separator />

      <Card>
        <CardHeader>
            <CardTitle>{lang === 'en' ? 'Controls & Utilities' : 'नियंत्रण और सुविधाएँ'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
                <Button><Download className="mr-2"/>{lang === 'en' ? 'Download Practice PDF' : 'प्रैक्टिस पीडीएफ डाउनलोड करें'}</Button>
                <Button variant="outline"><Star className="mr-2"/>{lang === 'en' ? 'Save Favorite' : 'पसंदीदा जोड़ें'}</Button>
            </div>
            <p className="text-xs text-muted-foreground pt-4">{lang === 'en' ? 'Disclaimer: This Hub provides educational and spiritual material. It is not a substitute for medical or psychiatric care.' : 'यह हब शैक्षिक और आध्यात्मिक सामग्री देता है। यह चिकित्सा या मनोरोगीय देखभाल का विकल्प नहीं है।'}</p>
        </CardContent>
      </Card>
    </div>
  );
}
