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
      className="fixed bottom-10 right-8 h-16 w-16 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 z-40 border-4 border-white overflow-hidden group p-0"
    >
      <div className="w-full h-full bg-gradient-to-br from-[#4A90E2] to-[#357ABD] flex items-center justify-center relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Bot className="h-8 w-8 text-white drop-shadow-md" />
      </div>
      <span className="sr-only">Open AI Assistant</span>
    </Button>
  );
}