'use client';

import { BrainCircuit } from 'lucide-react';

export default function AIPsychiatristPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Psychiatrist</h1>
        <p className="text-muted-foreground">
          A safe space to talk about your mental health. This feature is coming soon.
        </p>
      </div>
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
        <BrainCircuit className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Coming Soon</p>
      </div>
    </div>
  );
}
