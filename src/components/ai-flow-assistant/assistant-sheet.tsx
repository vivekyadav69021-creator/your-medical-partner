'use client';

import { useState, useRef, useEffect, useCallback, useActionState, startTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Loader2, RefreshCw, X, Mic } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FloatingButton } from './floating-button';
import { getAssistantResponseAction, speechToTextAction } from './actions';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const welcomeMessage: Message = {
  role: 'assistant',
  content: "Hi 👋 I'm your AI Flow Assistant. Tap the mic and tell me how I can help you today.",
};

const initialAssistantState = { result: null, error: null };
const initialSpeechState = { transcript: null, error: null };

export function AssistantSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isRecording, setIsRecording] = useState(false);
  
  const [assistantState, getAssistantResponse, isAssistantPending] = useActionState(getAssistantResponseAction, initialAssistantState);
  const [speechState, transcribeSpeech, isSttPending] = useActionState(speechToTextAction, initialSpeechState);
  
  const router = useRouter();
  const { toast } = useToast();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Effect to handle transcription result
  useEffect(() => {
    if (speechState.transcript) {
        const userMessage = { role: 'user', content: speechState.transcript };
        setMessages(prev => [...prev, userMessage]);
        
        const formData = new FormData();
        formData.append('query', speechState.transcript);
        formData.append('history', JSON.stringify([...messages, userMessage]));
        getAssistantResponse(formData);
    }
    if (speechState.error) {
        toast({ variant: 'destructive', title: 'Transcription Failed', description: speechState.error });
    }
  }, [speechState, getAssistantResponse, messages, toast]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ''));
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  // Effect to handle AI assistant response
  useEffect(() => {
    if (assistantState.result) {
        setMessages(prev => [...prev, { role: 'assistant', content: assistantState.result!.answer }]);
        speak(assistantState.result!.answer);
        if (assistantState.result!.path) {
            router.push(assistantState.result!.path);
            setIsOpen(false);
        }
    }
    if (assistantState.error) {
        const errorMsg = "Sorry, I encountered an issue. Please try again.";
        setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
        speak(errorMsg);
    }
  }, [assistantState, router]);


  const startRecording = async () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const formData = new FormData();
          formData.append('audioDataUri', base64Audio);
          startTransition(() => {
            transcribeSpeech(formData);
          });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Microphone Error', description: 'Could not access the microphone.' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const handleClearChat = () => {
    setMessages([welcomeMessage]);
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  };

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isAssistantPending]);

  const isProcessing = isSttPending || isAssistantPending;

  return (
    <>
      <FloatingButton onClick={() => setIsOpen(true)} />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="h-4/5 flex flex-col p-0" onInteractOutside={(e) => e.preventDefault()}>
          <SheetHeader className="p-4 border-b">
            <div className="flex justify-between items-center">
              <SheetTitle className="flex items-center gap-2">
                <Bot /> AI Flow Assistant
              </SheetTitle>
              <div className="flex gap-2">
                 <Button variant="ghost" size="icon" onClick={handleClearChat}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {message.role === 'assistant' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 whitespace-pre-wrap ${
                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs md:max-w-md rounded-lg px-4 py-2 bg-muted flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="p-4 border-t flex flex-col items-center justify-center gap-2">
            <Button
              size="icon"
              className={`h-16 w-16 rounded-full transition-all duration-300 ${isRecording ? 'bg-red-500 hover:bg-red-600 scale-110' : 'bg-primary hover:bg-primary/90'}`}
              onClick={handleMicClick}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="h-7 w-7 animate-spin" /> : <Mic className="h-7 w-7" />}
            </Button>
             <p className="text-xs text-muted-foreground">
                {isRecording ? "Tap to stop recording" : (isProcessing ? "Processing..." : "Tap to speak")}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
