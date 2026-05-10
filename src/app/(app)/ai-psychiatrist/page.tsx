'use client';

import React, { useActionState, useRef, useEffect, useState, useCallback } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    Send, 
    User, 
    Loader2, 
    Heart, 
    PlusCircle, 
    Trash2, 
    Activity, 
    History,
    Sparkles,
    ShieldCheck,
    MessageCircle,
    ChevronLeft
} from 'lucide-react';
import { aiPsychiatristAction } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

type Session = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  mood?: string;
};

const initialState = {
  result: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
        type="submit" 
        size="icon" 
        disabled={pending} 
        className="rounded-full h-12 w-12 bg-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0 border-none"
    >
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Send className="h-5 w-5" />
      )}
      <span className="sr-only">Send message</span>
    </Button>
  );
}

export default function AIPsychiatristPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [suggestionChips, setSuggestedChips] = useState<string[]>([]);
  const [state, formAction, isPending] = useActionState(aiPsychiatristAction, initialState);
  
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  const handleNewChat = useCallback(() => {
    const newSession: Session = {
      id: `mind-${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setSuggestedChips([]);
  }, []);

  // Fresh Entry Policy
  useEffect(() => {
    const saved = localStorage.getItem('mindCompanionSessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
    setActiveSessionId(null);
  }, []);

  // Persistence
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('mindCompanionSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Handle Response
  useEffect(() => {
    if (!isPending && state.result) {
        const { response_parts, suggested_chips, mood } = state.result;
        setSuggestedChips(suggested_chips || []);
        
        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                const newMessages = [...s.messages];
                response_parts.forEach((part: string) => {
                    newMessages.push({ role: 'assistant', content: part, timestamp: Date.now() });
                });
                return { ...s, messages: newMessages, mood: mood };
            }
            return s;
        }));
    }
    if (state.error) {
        toast({ variant: 'destructive', title: 'Mind Companion Error', description: state.error });
    }
  }, [state, isPending, activeSessionId, toast]);

  // Auto Scroll
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, isPending]);

  const handleFormAction = (formData: FormData | string) => {
    let query = '';
    if (typeof formData === 'string') {
        query = formData;
    } else {
        query = formData.get('query') as string;
    }

    if (!query) return;

    let sid = activeSessionId;
    if (!sid) {
        sid = `mind-${Date.now()}`;
        const newSession: Session = {
            id: sid,
            title: query.length > 25 ? query.substring(0, 25) + '...' : query,
            messages: [{ role: 'user', content: query, timestamp: Date.now() }],
            createdAt: Date.now(),
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(sid);
    } else {
        setSessions(prev => prev.map(s => {
          if (s.id === sid) {
            const newTitle = s.messages.length === 0 ? (query.length > 25 ? query.substring(0, 25) + '...' : query) : s.title;
            return { ...s, title: newTitle, messages: [...s.messages, { role: 'user', content: query, timestamp: Date.now() }] };
          }
          return s;
        }));
    }

    const payload = new FormData();
    payload.set('query', query);
    const history = messages.map(m => ({ role: m.role, content: m.content }));
    payload.set('history', JSON.stringify(history));
    formAction(payload);
    
    setSuggestedChips([]);
    formRef.current?.reset();
    if(queryInputRef.current) {
        queryInputRef.current.value = '';
        queryInputRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-[#F8FAFF] dark:bg-[#0B0F1A] font-body overflow-hidden">
      
      {/* Header - Native App Style */}
      <header className="h-16 flex items-center justify-between px-4 bg-white/80 dark:bg-[#161B22]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 z-50 shrink-0">
          <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-2xl">
                  <Heart className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <div className="flex flex-col -space-y-0.5">
                  <h1 className="text-sm font-black text-[#2D3A5D] dark:text-slate-100 tracking-tight">Mind Companion</h1>
                  <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Your Personal Best Friend</p>
              </div>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <History className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] p-0 border-none rounded-l-[2.5rem] shadow-2xl bg-white dark:bg-[#0B0F1A]">
                <SheetHeader className="p-8 pb-4">
                    <SheetTitle className="text-xs font-black text-primary uppercase tracking-[0.3em]">Conversation Journal</SheetTitle>
                </SheetHeader>
                <div className="px-6 pb-4">
                    <Button variant="outline" className="w-full rounded-2xl h-12 font-bold bg-primary/5 border-primary/20 text-primary hover:bg-primary/10" onClick={() => { handleNewChat(); }}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Start Fresh Talk
                    </Button>
                </div>
                <ScrollArea className="flex-1 px-4">
                    <div className="space-y-2 pb-20">
                        {sessions.map(session => (
                            <div 
                                key={session.id} 
                                className={cn(
                                    "p-4 rounded-[1.8rem] cursor-pointer group flex items-center justify-between transition-all border",
                                    activeSessionId === session.id 
                                        ? "bg-primary/5 border-primary/20 shadow-sm" 
                                        : "bg-slate-50 dark:bg-[#161B22] border-transparent hover:border-slate-200"
                                )}
                                onClick={() => { setActiveSessionId(session.id); setSuggestedChips([]); }}
                            >
                                <div className="flex-1 overflow-hidden">
                                    <p className={cn("text-xs font-bold truncate", activeSessionId === session.id ? "text-primary" : "text-[#2D3A5D] dark:text-slate-200")}>{session.title}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => {
                                    e.stopPropagation(); 
                                    setSessions(prev => prev.filter(s => s.id !== session.id));
                                    if(activeSessionId === session.id) setActiveSessionId(null);
                                }}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
          <ScrollArea className="h-full w-full px-4 pt-6 pb-32" ref={scrollAreaRef}>
              <div className="max-w-2xl mx-auto space-y-6">
                  
                  {!activeSessionId && !isPending && (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in zoom-in-95 duration-700">
                          <div className="p-10 bg-white dark:bg-[#161B22] rounded-[3.5rem] shadow-2xl border border-white/50 relative">
                              <Sparkles className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(36,136,232,0.3)]" />
                              <div className="absolute inset-0 bg-primary/5 rounded-[3.5rem] animate-pulse" />
                          </div>
                          <div className="space-y-2">
                            <h2 className="text-3xl font-black text-[#1A365D] dark:text-white tracking-tight">How's your heart?</h2>
                            <p className="text-sm font-bold text-slate-400 max-w-[280px] leading-relaxed mx-auto">
                              I'm right here to listen. Share whatever is on your mind today, friend.
                            </p>
                          </div>
                          <Button className="rounded-full h-14 px-10 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 active:scale-95 transition-all" onClick={handleNewChat}>
                            Start Talking to Me
                          </Button>
                      </div>
                  )}
                  
                  {messages.map((message, index) => (
                      <div
                          key={index}
                          className={cn("flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500", message.role === 'user' ? 'flex-row-reverse' : '')}
                      >
                          {message.role === 'user' ? (
                              <Avatar className="h-8 w-8 border-2 border-white dark:border-slate-800 shadow-md shrink-0 mb-1">
                                  <AvatarImage src="https://picsum.photos/seed/user/100/100" />
                                  <AvatarFallback className="bg-primary text-white"><User className="w-4 h-4"/></AvatarFallback>
                              </Avatar>
                          ) : null}
                          <div
                              className={cn(
                                  "max-w-[85%] rounded-[1.8rem] px-5 py-3.5 shadow-sm border border-transparent",
                                  message.role === 'user' 
                                      ? "bg-primary text-white rounded-br-sm shadow-primary/10" 
                                      : "bg-white dark:bg-[#161B22] text-[#2D3A5D] dark:text-[#E3E3E3] rounded-bl-sm border-white/50 dark:border-slate-800/50 shadow-slate-100"
                              )}
                              style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                          >
                              <article className="prose prose-sm dark:prose-invert max-w-full text-inherit leading-relaxed font-bold text-[15px]">
                                  <ReactMarkdown>{message.content}</ReactMarkdown>
                              </article>
                          </div>
                      </div>
                  ))}

                  {isPending && (
                      <div className="flex items-end gap-2 animate-in fade-in duration-300">
                          <div className="bg-white dark:bg-[#161B22] rounded-[1.8rem] rounded-bl-sm px-6 py-4 border border-white/50 dark:border-slate-800/50 flex items-center gap-3 shadow-inner">
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Companion is listening...</span>
                          </div>
                      </div>
                  )}

                  {/* Suggestion Chips */}
                  {suggestionChips.length > 0 && !isPending && (
                    <div className="flex flex-wrap gap-2 pt-6 justify-start pl-2 animate-in fade-in slide-in-from-left-4 duration-700">
                        {suggestionChips.map((chip, idx) => (
                            <Button 
                                key={idx} 
                                variant="outline" 
                                size="sm" 
                                className="rounded-full border-primary/20 bg-white/80 dark:bg-[#161B22] hover:bg-primary/10 hover:border-primary text-[10px] font-black text-primary px-6 h-10 transition-all active:scale-95 shadow-md"
                                onClick={() => handleFormAction(chip)}
                            >
                                <MessageCircle className="w-3.5 h-3.5 mr-2 opacity-70" />
                                {chip}
                            </Button>
                        ))}
                    </div>
                  )}
              </div>
          </ScrollArea>
      </main>
      
      {/* Input Area - Modern Floating PWA Style */}
      <footer className="shrink-0 p-4 pb-10 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#0B0F1A] dark:via-[#0B0F1A]/90 dark:to-transparent z-50">
          <div className="max-w-2xl mx-auto space-y-4">
              
              <div className="flex items-center justify-between px-4 mb-2">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    Private Space
                </div>
                {activeSession?.mood && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                        <Activity className="w-3 h-3 text-primary" />
                        <span className="text-[9px] font-black uppercase text-primary tracking-widest">{activeSession.mood}</span>
                    </div>
                )}
              </div>

              <form
                  ref={formRef}
                  action={handleFormAction}
                  className="flex items-end gap-3 bg-white dark:bg-[#161B22] rounded-[2.5rem] p-2 shadow-2xl border border-white/50 dark:border-slate-800/50 shadow-primary/5 focus-within:ring-2 focus-within:ring-primary/10 transition-all"
              >
                  <div className="flex-1 overflow-hidden">
                    <Textarea
                        id="chatInput"
                        ref={queryInputRef}
                        name="query"
                        placeholder="Say whatever's on your heart..."
                        className="w-full min-h-[48px] max-h-[120px] p-4 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-[15px] resize-none scrollbar-hide dark:placeholder:text-slate-600"
                        autoComplete="off"
                        disabled={isPending}
                        rows={1}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = `${target.scrollHeight}px`;
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                formRef.current?.requestSubmit();
                            }
                        }}
                    />
                  </div>
                  <SubmitButton />
              </form>
          </div>
      </footer>
    </div>
  );
}
