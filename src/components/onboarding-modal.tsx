
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

const onboardingSteps = [
  {
    icon: HeartPulse,
    title: "Welcome to Your Medical Partner",
    description: "Your all-in-one AI-powered health companion. Let's take a quick tour of our key features.",
  },
  {
    icon: Bot,
    title: "AI Health Assistant",
    description: "Get instant, detailed answers to your health questions, analyze lab reports, and receive AI-powered first-aid guidance.",
  },
  {
    icon: Stethoscope,
    title: "Expert Doctor Consultations",
    description: "Find and book virtual appointments with top specialists from India and abroad. Your health is in trusted hands.",
  },
  {
    icon: ShieldCheck,
    title: "Important Disclaimer",
    description: "This application provides AI-generated information for educational purposes ONLY. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified doctor for any health concerns.",
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

  const handleClose = () => {
    if (agreed) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-0 shadow-none">
                       <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4 h-96">
                        <div className="bg-primary/10 p-4 rounded-full">
                          <Icon className="w-12 h-12 text-primary" />
                        </div>
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
        <div className="flex justify-center gap-2 pb-4">
            {onboardingSteps.map((_, i) => (
                <div key={i} className={`h-2 w-2 rounded-full transition-all ${current === i ? 'p-1.5 bg-primary' : 'bg-primary/30'}`} />
            ))}
        </div>
        <DialogFooter className="bg-muted/50 p-4 flex-col sm:flex-col sm:space-x-0 gap-3 border-t">
            <div className="flex items-start space-x-3">
                <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} className="mt-1" />
                <Label htmlFor="terms" className="text-xs text-muted-foreground">
                    I have read the information and I understand that this app is for informational purposes and not a substitute for professional medical advice.
                </Label>
            </div>
            <Button type="button" className="w-full" onClick={handleClose} disabled={!agreed}>
                Get Started
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
