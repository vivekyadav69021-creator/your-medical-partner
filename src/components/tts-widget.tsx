'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, StopCircle, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TTSWidgetProps {
  textToSpeak: string;
  initialLang?: string;
}

export function TTSWidget({ textToSpeak, initialLang = 'en-IN' }: TTSWidgetProps) {
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedLang, setSelectedLang] = useState(initialLang);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Ensure synthesis is cancelled on component unmount
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);
  
  useEffect(() => {
      // If language changes while speaking, stop the speech
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
      }
  }, [selectedLang])

  const getBestVoice = (lang: string): SpeechSynthesisVoice | null => {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang === lang);
    if (voice) return voice;
    // Fallback to a voice with the same language code (e.g., 'en' for 'en-GB')
    voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    
    // Add specific fallback for Hindi
    if (!voice && lang.startsWith('hi')) {
      voice = voices.find(v => v.lang.startsWith('hi'));
    }
    
    return voice || voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  };

  const handlePlay = () => {
    if (!window.speechSynthesis) {
      toast({ variant: 'destructive', title: 'TTS Not Supported', description: 'Your browser does not support text-to-speech.' });
      return;
    }

    if (isPaused && speechSynthesis.speaking) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }
    
    speechSynthesis.cancel(); // Stop any previous speech

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voice = getBestVoice(selectedLang);
    
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
       toast({ variant: 'destructive', title: 'Voice not found', description: `No voice available for language: ${selectedLang}` });
       return;
    }
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = (e) => {
      toast({ variant: 'destructive', title: 'Speech Error', description: e.error || 'An unknown error occurred.' });
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-muted-foreground" />
            <Label className="font-semibold">Listen to this page</Label>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePlay} disabled={isSpeaking}>
            <Play className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handlePause} disabled={!isSpeaking || isPaused}>
            <Pause className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleStop} disabled={!isSpeaking && !isPaused}>
            <StopCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="lang-select">Voice Language</Label>
          <Select value={selectedLang} onValueChange={setSelectedLang}>
            <SelectTrigger id="lang-select" className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-IN">English (India)</SelectItem>
              <SelectItem value="hi-IN">हिन्दी (भारत)</SelectItem>
              <SelectItem value="en-US">English (US)</SelectItem>
              <SelectItem value="en-GB">English (UK)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
