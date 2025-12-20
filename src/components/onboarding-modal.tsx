"use client";

import React, { useState } from 'react';
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
    description: "Your all-in-one health companion. Let's take a quick tour of what you can do.",
  },
  {
    icon: Bot,
    title: "AI Health Assistant",
    description: "Get instant answers to your health questions, analyze lab reports, and get AI-powered first-aid guidance. Our AI is here to inform, not diagnose.",
  },
  {
    icon: Stethoscope,
    title: "Expert Doctor Consultations",
    description: "Find and book appointments with top specialists from India and abroad. Your health is in trusted hands.",
  },
  {
    icon: ShieldCheck,
    title: "Important Disclaimer",
    description: "This app provides health information for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified doctor for any health concerns.",
  },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {onboardingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-0 shadow-none">
                       <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4 aspect-square">
                        <Icon className="w-16 h-16 text-primary" />
                        <h3 className="text-2xl font-semibold font-headline">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
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
        <DialogFooter className="p-6 pt-0 flex-col sm:flex-col sm:space-x-0 gap-2">
            <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
                <Label htmlFor="terms" className="text-sm text-muted-foreground">
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
