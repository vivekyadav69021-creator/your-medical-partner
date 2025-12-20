"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Stethoscope, Bot, ShieldCheck, HeartPulse } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import Image from 'next/image';

const onboardingSteps = [
  {
    icon: HeartPulse,
    image: { url: "https://picsum.photos/seed/welcome-doc/600/400", hint: "friendly doctor character" },
    title: "Welcome to Your Medical Partner",
    description: "Your all-in-one health companion. Let's take a quick tour of what you can do.",
  },
  {
    icon: Bot,
    image: { url: "https://picsum.photos/seed/ai-bot/600/400", hint: "AI robot stethoscope" },
    title: "AI Health Assistant",
    description: "Get instant answers to your health questions, analyze lab reports, and get AI-powered first-aid guidance.",
  },
  {
    icon: Stethoscope,
    image: { url: "https://picsum.photos/seed/telemedicine/600/400", hint: "telemedicine doctor consultation" },
    title: "Expert Doctor Consultations",
    description: "Find and book appointments with top specialists from India and abroad. Your health is in trusted hands.",
  },
  {
    icon: ShieldCheck,
    image: { url: "https://picsum.photos/seed/disclaimer-shield/600/400", hint: "health shield protection" },
    title: "Important Disclaimer",
    description: "This app is for informational purposes only and is not a substitute for professional medical advice. Always consult a qualified doctor for any health concerns.",
  },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {onboardingSteps.map((step, index) => {
              return (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-0 shadow-none">
                       <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4 aspect-video">
                        <Image
                            src={step.image.url}
                            alt={step.title}
                            width={200}
                            height={200}
                            className="w-48 h-48 object-contain rounded-full"
                            data-ai-hint={step.image.hint}
                        />
                        <h3 className="text-2xl font-semibold font-headline">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        <div className="flex justify-center gap-2 mb-4">
            {onboardingSteps.map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full transition-all ${current === i ? 'p-1.5 bg-primary' : 'bg-primary/30'}`} />
            ))}
        </div>
        <DialogFooter className="p-6 pt-0 flex-col sm:flex-col sm:space-x-0 gap-2">
            <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                <Label htmlFor="terms" className="text-xs text-muted-foreground">
                    I have read the information and agree to use this app for informational purposes only.
                </Label>
            </div>
            <Button type="button" className="w-full" onClick={onClose} disabled={!agreed}>
                Get Started
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
