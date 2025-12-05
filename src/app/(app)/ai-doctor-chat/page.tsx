'use client';

import React, { useActionState, useRef, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, User, Sparkles, BrainCircuit, Bot } from 'lucide-react';
import { aiDoctorChatAction } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUserProfile } from '@/context/user-profile-context';
import ReactMarkdown from 'react-markdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const initialState = {
  response: null,
  error: null,
};

const doctorSpecialties = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "Oncologist",
  "Gynecologist",
  "Orthopedist",
  "Endocrinologist",
  "Psychiatrist",
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending}>
      {pending ? (
        <Sparkles className="h-5 w-5 animate-pulse" />
      ) : (
        <Send className="h-5 w-5" />
      )}
      <span className="sr-only">Send message</span>
    </Button>
  );
}

export default function AIDoctorChatPage() {
  const { userName, userImage } = useUserProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [specialty, setSpecialty] = useState<string>("General Physician");
  const [state, formAction, isPending] = useActionState(aiDoctorChatAction, initialState);
  
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleFormAction = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);

    formData.set('history', JSON.stringify(messages));
    formData.set('specialty', specialty);
    formAction(formData);
    formRef.current?.reset();
  };
  
  useEffect(() => {
    if (!isPending) {
        if (state.response) {
          setMessages(prev => [...prev, { role: 'assistant', content: state.response! }]);
        }
        if (state.error) {
          const errorMessage = `Sorry, I encountered an error: ${state.error}`;
          setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
        }
    }
  }, [state, isPending]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isPending]);
  
   const handleSpecialtyChange = (newSpecialty: string) => {
    setSpecialty(newSpecialty);
    setMessages([]); // Clear chat history when specialty changes
    if (formRef.current) formRef.current.reset();
  };

  const assistantImage = PlaceHolderImages.find(img => img.id === 'assistant-avatar');

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Doctor Chat</h1>
        <p className="text-muted-foreground">
          Chat with an AI specialist about your health concerns.
        </p>
      </div>
      
      <Card className="mb-4">
        <CardContent className="p-4">
          <Label htmlFor="specialty-select">Select a Specialty</Label>
          <Select value={specialty} onValueChange={handleSpecialtyChange}>
            <SelectTrigger id="specialty-select">
              <SelectValue placeholder="Select a doctor specialty" />
            </SelectTrigger>
            <SelectContent>
              {doctorSpecialties.map(spec => (
                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot />
            Chat with AI {specialty}
          </CardTitle>
          <CardDescription>
            This is an AI simulation and not a substitute for real medical advice.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && !isPending && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-4">
                  <BrainCircuit className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">Hello! I'm your AI {specialty}.</p>
                  <p>How can I help you today?</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'items-end'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-9 w-9">
                      {assistantImage && <AvatarImage src={assistantImage.imageUrl} alt="AI Assistant" data-ai-hint={assistantImage.imageHint}/>}
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                     <article className="prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown>{message.content}</ReactMarkdown></article>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-9 w-9">
                       <AvatarImage src={userImage} alt="@user" data-ai-hint="person face" />
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isPending && (
                <div className="flex items-start gap-3">
                   <Avatar className="h-9 w-9">
                      {assistantImage && <AvatarImage src={assistantImage.imageUrl} alt="AI Assistant" data-ai-hint={assistantImage.imageHint} />}
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 bg-muted flex items-center gap-2">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm italic">AI is thinking...</span>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form
            ref={formRef}
            id="chatForm"
            action={handleFormAction}
            className="flex w-full items-center gap-2"
          >
            <Input
              id="chatInput"
              name="query"
              placeholder={`Ask the AI ${specialty}...`}
              className="flex-1"
              autoComplete="off"
              disabled={isPending}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
            />
            <SubmitButton />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
