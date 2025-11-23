'use client';

import { cn } from "@/lib/utils";

export function HealthScoreDisplay({ score, className }: { score: number, className?: string }) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'text-green-500';
  if (score < 75) colorClass = 'text-yellow-500';
  if (score < 50) colorClass = 'text-red-500';

  return (
    <div className={cn("relative w-48 h-48", className)}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-secondary"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        {/* Foreground circle (progress) */}
        <circle
          className={cn("transform -rotate-90 origin-center transition-all duration-1000 ease-out", colorClass)}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          style={{ filter: `drop-shadow(0 0 5px currentColor)` }}
        />
      </svg>
      <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full">
        <span className="text-4xl font-bold text-foreground">{score}</span>
        <span className="text-sm text-muted-foreground">Health Score</span>
      </div>
    </div>
  );
}
