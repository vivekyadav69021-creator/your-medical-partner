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
import { Send, User, Bot, Sparkles, Paperclip, Mic, MicOff, X } from 'lucide-react';
import { healthAssistantAction, speechToTextAction } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUserProfile } from '@/context/user-profile-context';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';


type Message = {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
};

const initialState = {
  response: null,
  error: null,
};

const initialSpeechState = {
  transcript: null,
  error: null,
};


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

export default function HealthAssistantPage() {
  const { userName, userImage } = useUserProfile();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, formAction, isPending] = useActionState(healthAssistantAction, initialState);
  const [speechState, speechAction, isTranscribing] = useActionState(speechToTextAction, initialSpeechState);
  
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFormAction = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query && !attachedImage) return;

    let userMessage: Message = { role: 'user', content: query || 'Image analysis' };
    if (attachedImage) {
      userMessage.image = attachedImage;
      formData.append('photoDataUri', attachedImage);
    }
    
    setMessages(prev => [...prev, userMessage]);
    formAction(formData);
    formRef.current?.reset();
    setAttachedImage(null);
  };
  
  useEffect(() => {
    if (!isPending) {
        if (state.response) {
          setMessages(prev => [...prev, { role: 'assistant', content: state.response! }]);
        }
        if (state.error) {
          setMessages(prev => [...prev, { role: 'assistant', content: state.error! }]);
        }
    }
  }, [state, isPending]);

   useEffect(() => {
    if (speechState?.transcript && inputRef.current) {
      inputRef.current.value = speechState.transcript;
      toast({ title: 'Transcription complete', description: 'Your message is ready to send.' });
    }
    if (speechState?.error) {
      toast({ variant: 'destructive', title: 'Transcription Failed', description: speechState.error });
    }
  }, [speechState, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isPending]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
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
          speechAction(formData);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({ title: 'Recording started...', description: 'Speak your query now.' });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({ variant: 'destructive', title: 'Recording Error', description: 'Could not access microphone.' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const assistantImage = PlaceHolderImages.find(img => img.id === 'assistant-avatar');

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Health Assistant</h1>
        <p className="text-muted-foreground">
          Ask me anything about health, medicines, or diseases.
        </p>
      </div>
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot />
            Chat with Health Assistant
          </CardTitle>
          <CardDescription>
            This is an AI assistant. Information may be inaccurate.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && !isPending && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                  <Bot className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">I am your AI Health Assistant.</p>
                  <p>Ask me a question to get started!</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'justify-end' : ''
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
                     {message.image && (
                      <Image
                        src={message.image}
                        alt="User upload"
                        width={200}
                        height={200}
                        className="rounded-md mb-2"
                      />
                    )}
                    {message.role === 'assistant' ? (
                        <article className="prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown>{message.content}</ReactMarkdown></article>
                    ) : (
                        <p>{message.content}</p>
                    )}
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
                        <span className="text-sm italic">Assistant is typing...</span>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
           {attachedImage && (
            <div className="relative p-2 border rounded-md">
              <Image
                src={attachedImage}
                alt="Preview"
                width={80}
                height={80}
                className="rounded-md"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground"
                onClick={() => setAttachedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <form
            ref={formRef}
            action={handleFormAction}
            className="flex w-full items-center gap-2"
          >
            <Input
              ref={inputRef}
              name="query"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              disabled={isPending || isTranscribing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
             <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isPending || isTranscribing}>
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>
             <Button type="button" size="icon" variant={isRecording ? 'destructive' : 'outline'} onClick={isRecording ? stopRecording : startRecording} disabled={isTranscribing || isPending}>
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              {isTranscribing && <Sparkles className="h-5 w-5 animate-pulse" />}
              <span className="sr-only">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </Button>
            <SubmitButton />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
