
'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, Send, Loader2, RefreshCw, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FloatingButton } from './floating-button';
import { featureAssistant } from '@/ai/flows/feature-assistant-flow';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const welcomeMessage: Message = {
  role: 'assistant',
  content: "Hi 👋 I'm your AI Flow Assistant. You can ask me to:\n- Book a doctor\n- Start a scan\n- Order medicine\n- Open any feature\n\nHow can I help you today?",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} className="flex-shrink-0">
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
    </Button>
  );
}

export function AssistantSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [isPending, setIsPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  const handleFormAction = async (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setIsPending(true);

    try {
      const result = await featureAssistant({ query });
      
      let assistantResponse = result.answer;

      if (result.path) {
        // Navigate and then update the message
        router.push(result.path);
        setIsOpen(false); // Close the sheet on successful navigation
      }
      
       if (query.toLowerCase().includes('what can you do')) {
        assistantResponse = `I can help you navigate the app. You can ask me to:
- Book doctors
- Start disease scans
- Open medical store
- Show health tools
- Help navigate features`;
      } else if (result.path && !result.answer.includes('Navigating')) {
         const feature = result.featureId ? `the ${result.featureId.replace(/-/g, ' ')} page` : 'that page';
         assistantResponse = `Sure, navigating to ${feature} now.`;
      } else if (!result.path && query.match(/(pain|fever|headache|sick|symptom)/i)) {
         assistantResponse = "For medical questions, I recommend using the AI Health Assistant. Would you like me to open it for you?";
         if (query.toLowerCase().includes('yes')) {
            router.push('/health-assistant');
            setIsOpen(false);
         }
      }


      setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);

    } catch (error) {
      const errorMessage = "Sorry, I couldn't understand that. Please try rephrasing, or ask me to 'open challenges' or 'find a doctor'.";
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsPending(false);
      formRef.current?.reset();
    }
  };

  const handleClearChat = () => {
    setMessages([welcomeMessage]);
  };

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isPending]);

  return (
    <>
      <FloatingButton onClick={() => setIsOpen(true)} />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="h-4/5 flex flex-col p-0">
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
                {isPending && (
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
          <SheetFooter className="p-4 border-t">
            <form ref={formRef} action={handleFormAction} className="flex w-full items-center gap-2">
              <Input
                name="query"
                placeholder="e.g., Book a doctor..."
                autoComplete="off"
                disabled={isPending}
              />
              <SubmitButton />
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
