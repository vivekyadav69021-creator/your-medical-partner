
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  HeartPulse,
  Bot,
  Stethoscope,
  Scan,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  UserCheck,
  Video,
  FileText,
  Lock,
  UserCog,
} from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { SplashScreen } from '@/components/splash-screen';
import { cn } from '@/lib/utils';

const onboardingSteps = [
  {
    icon: HeartPulse,
    title: 'Welcome to Your Medical Partner',
    subtitle: 'Your AI-powered health companion designed to provide reliable information, smart guidance, and medical support in one place.',
    tagline: 'Built with AI + Structured Medical Knowledge',
    highlights: [],
  },
  {
    icon: Bot,
    title: 'Smart AI Health Assistant',
    subtitle: 'Ask any health-related question in Hindi or English. Get structured, easy-to-understand answers with verified medical sources.',
    tagline: '',
    highlights: [
      { text: 'Symptom guidance', icon: Sparkles },
      { text: 'Medicine information', icon: Sparkles },
      { text: 'Health education', icon: Sparkles },
      { text: 'Emergency awareness alerts', icon: Sparkles },
    ],
  },
  {
    icon: Stethoscope,
    title: 'Connect with Verified Doctors',
    subtitle: 'Book appointments, consult online, and manage prescriptions securely.',
    tagline: '',
    highlights: [
      { text: 'Doctor profiles with specialization', icon: UserCheck },
      { text: 'Appointment booking', icon: UserCheck },
      { text: 'Video consultation support', icon: Video },
      { text: 'Digital prescription access', icon: FileText },
    ],
  },
  {
    icon: Scan,
    title: 'Scan & Analyze Smartly',
    subtitle: 'Use AI-powered tools to analyze medical reports, X-rays, and health images.',
    tagline: 'This tool provides AI-based assistance and does not replace professional medical diagnosis.',
    highlights: [
      { text: 'Face scanner', icon: Scan },
      { text: 'Injury scanner', icon: Scan },
      { text: 'X-ray analysis', icon: Scan },
      { text: 'Report upload & review', icon: Scan },
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Your Health. Your Privacy.',
    subtitle: 'Your data is encrypted and securely stored. We never share your medical information without permission.',
    tagline: '',
    highlights: [
      { text: 'Encrypted user data', icon: Lock },
      { text: 'Secure authentication', icon: Lock },
      { text: 'No unauthorized data sharing', icon: Lock },
      { text: 'Designed for responsible health assistance', icon: UserCog },
    ],
  },
];

export default function OnboardingPage() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [agreed, setAgreed] = useState(false);
  
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  const handleNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleSkip = () => {
    api?.scrollTo(onboardingSteps.length - 1);
  };
  
  const handleCompleteOnboarding = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to continue.' });
      router.push('/login');
      return;
    }
    try {
      const userProfileRef = doc(firestore, 'users', user.uid, 'userProfiles', user.uid);
      await setDoc(userProfileRef, { onboardingCompleted: true }, { merge: true });
      toast({ title: 'Welcome to Your Medical Partner!' });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
      toast({ variant: 'destructive', title: 'Setup Failed', description: 'Could not save your setup progress. Please try again.' });
    }
  };

  if (isUserLoading) {
    return <SplashScreen />;
  }
  
  if (!isUserLoading && !user) {
    router.replace('/login');
    return <SplashScreen />;
  }

  const isLastSlide = current === onboardingSteps.length - 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-blue-950 p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl rounded-2xl overflow-hidden">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <CarouselItem key={index}>
                  <CardContent className="flex flex-col items-center justify-center text-center p-8 space-y-4 min-h-[500px]">
                    <div className={cn("bg-primary/10 p-4 rounded-full", index === 0 && "animate-splash-pop-in")}>
                      <Icon className="w-16 h-16 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold font-headline">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.subtitle}</p>

                    {step.highlights.length > 0 && (
                      <ul className="text-left space-y-2 pt-4">
                        {step.highlights.map((highlight, hIndex) => {
                          const HighlightIcon = highlight.icon;
                          return (
                          <li key={hIndex} className="flex items-center gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900 p-1.5 rounded-full">
                                <HighlightIcon className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                            </div>
                            <span className="text-sm font-medium">{highlight.text}</span>
                          </li>
                        )})}
                      </ul>
                    )}

                    {step.tagline && (
                      <p className={cn("text-xs text-muted-foreground pt-4", step.id === 'scanner' && "italic")}>
                        {step.tagline}
                      </p>
                    )}
                  </CardContent>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        
        <div className="p-6 bg-muted/50 border-t">
          <div className="flex justify-center gap-2 mb-6">
            {onboardingSteps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === i ? 'w-6 bg-primary' : 'w-2 bg-primary/30'
                }`}
              />
            ))}
          </div>

          {isLastSlide ? (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox id="terms" checked={agreed} onCheckedChange={c => setAgreed(c as boolean)} className="mt-1" />
                <Label htmlFor="terms" className="text-xs text-muted-foreground">
                  I understand that this app provides informational assistance and does not replace a licensed doctor.
                </Label>
              </div>
              <Button className="w-full" size="lg" disabled={!agreed} onClick={handleCompleteOnboarding}>
                Get Started
              </Button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={handleSkip}>
                Skip
              </Button>
              <Button onClick={handleNext}>
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
