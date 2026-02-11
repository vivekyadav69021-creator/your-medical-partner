
'use client';

import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface FloatingButtonProps {
    onClick: () => void;
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary/80 backdrop-blur-sm shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-40 animate-splash-pop-in"
      style={{
        background: 'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)))',
      }}
    >
      <Bot className="h-7 w-7 text-primary-foreground" />
      <span className="sr-only">Open AI Assistant</span>
    </Button>
  );
}
