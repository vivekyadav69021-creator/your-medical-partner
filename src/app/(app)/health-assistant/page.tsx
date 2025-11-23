'use client';

import { useState, useActionState } from 'react';
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
import { Send, User, Bot, Sparkles, AlertTriangle } from 'lucide-react';
import { healthAssistantAction } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const initialState = {
  response: null,
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [formState, formAction] = useActionState(healthAssistantAction, initialState);

  const handleFormAction = async (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query) return;

    const form = (document.querySelector('form[action]') as HTMLFormElement);
    form.reset();

    setMessages(prev => [...prev, { role: 'user', content: query }]);

    const result = await healthAssistantAction(formState, formData);

    if (result.response) {
      setMessages(prev => [...prev, { role: 'assistant', content: result.response! }]);
    }
    if (result.error) {
      setMessages(prev => [...prev, { role: 'assistant', content: result.error! }]);
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
            Chat
          </CardTitle>
          <CardDescription>
            This is an AI assistant. Information may be inaccurate.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
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
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-9 w-9">
                       <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="@user" data-ai-hint="person face" />
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {useFormStatus().pending && (
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
        <CardFooter>
          <form
            action={handleFormAction}
            className="flex w-full items-center gap-2"
          >
            <Input
              name="query"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  (e.target as HTMLInputElement).form?.requestSubmit();
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
