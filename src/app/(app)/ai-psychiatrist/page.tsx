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
    Mic, 
    MicOff, 
    Volume2, 
    StopCircle, 
    PlusCircle, 
    Trash2, 
    Activity, 
    History,
    Sparkles,
    ShieldCheck,
    MessageCircle
} from 'lucide-react';
import { aiPsychiatristAction, speechToTextAction } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
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
  isChip?: boolean;
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

const initialSpeechState = {
  transcript: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} className="rounded-2xl h-12 w-12 bg-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0">
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

  // Sync state response to session messages
  useEffect(() => {
    if (!isPending && state.result) {
        const { response_parts, suggested_chips, mood } = state.result;
        
        setSuggestedChips(suggested_chips || []);
        
        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                const newMessages = [...s.messages];
                response_parts.forEach((part: string) => {
                    newMessages.push({ role: 'assistant', content: part });
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

  useEffect(() => {
    const saved = localStorage.getItem('mindCompanionSessions');
    if (saved) {
      setSessions(JSON.parse(saved));
    }
    setActiveSessionId(null); // Fresh start policy
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('mindCompanionSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

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
            title: query.substring(0, 30),
            messages: [{ role: 'user', content: query }],
            createdAt: Date.now(),
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(sid);
    } else {
        setSessions(prev => prev.map(s => {
          if (s.id === sid) {
            const newTitle = s.messages.length === 0 ? query.substring(0, 30) : s.title;
            return { ...s, title: newTitle, messages: [...s.messages, { role: 'user', content: query }] };
          }
          return s;
        }));
    }

    const payload = new FormData();
    payload.set('query', query);
    payload.set('history', JSON.stringify(messages.filter(m => !m.isChip)));
    formAction(payload);
    
    setSuggestedChips([]);
    formRef.current?.reset();
    if(queryInputRef.current) {
        queryInputRef.current.value = '';
        queryInputRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] w-full gap-6 animate-in fade-in duration-500 overflow-hidden font-body">
      {/* Sidebar - Desktop */}
      <Card className="hidden md:flex md:w-1/4 flex-col rounded-[2.5rem] border-none shadow-xl bg-white/50 backdrop-blur-sm p-4 overflow-hidden shrink-0">
          <CardHeader className="flex-row items-center justify-between pb-4 px-4">
              <CardTitle className="text-[10px] font-black text-[#2D3A5D] uppercase tracking-[0.3em]">Your Journal</CardTitle>
              <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20" onClick={handleNewChat}>
                  <PlusCircle className="h-5 w-5" />
              </Button>
          </CardHeader>
          <ScrollArea className="flex-1 px-2">
              <div className="space-y-3">
                  {sessions.map(session => (
                      <div 
                          key={session.id} 
                          className={cn(
                              "p-4 rounded-3xl cursor-pointer group flex items-center justify-between transition-all border border-transparent",
                              activeSessionId === session.id ? "bg-white shadow-md border-blue-50" : "hover:bg-white/40"
                          )}
                          onClick={() => { setActiveSessionId(session.id); setSuggestedChips([]); }}
                      >
                          <div className="flex-1 overflow-hidden">
                            <p className={cn("text-xs font-black truncate tracking-tight", activeSessionId === session.id ? "text-primary" : "text-[#2D3A5D]")}>{session.title}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 rounded-full hover:bg-red-50 text-red-400" onClick={(e) => {
                            e.stopPropagation();
                            setSessions(prev => prev.filter(s => s.id !== session.id));
                            if(activeSessionId === session.id) setActiveSessionId(null);
                          }}>
                              <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                      </div>
                  ))}
              </div>
          </ScrollArea>
      </Card>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full w-full min-w-0 overflow-hidden space-y-4">
        
        <Card className="flex-1 flex flex-col rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden min-h-0 w-full h-full relative">
          <CardHeader className="px-6 pt-8 pb-4 shrink-0 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="p-4 bg-primary/10 rounded-[1.5rem] relative">
                          <Heart className="w-6 h-6 text-primary animate-pulse" />
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div className="min-w-0">
                          <CardTitle className="text-xl font-black text-[#2D3A5D] dark:text-slate-100 tracking-tight">Mind Companion</CardTitle>
                          <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Your Best Friend AI</CardDescription>
                      </div>
                  </div>
                  
                  <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden rounded-full h-11 w-11 bg-slate-50 dark:bg-slate-800 border-none shadow-sm">
                            <History className="h-5 w-5 text-primary" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[85vw] p-0 border-none rounded-l-[2rem]">
                        <SheetHeader className="p-6 border-b">
                            <SheetTitle className="text-sm font-black text-primary uppercase tracking-widest">Chat Journal</SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="h-full p-4">
                            <Button variant="outline" className="w-full rounded-2xl mb-6 font-bold h-12" onClick={handleNewChat}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Start Fresh
                            </Button>
                            <div className="space-y-4">
                                {sessions.map(session => (
                                    <div 
                                        key={session.id} 
                                        className={cn(
                                            "p-4 rounded-3xl cursor-pointer group flex items-center justify-between transition-all border",
                                            activeSessionId === session.id ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-slate-50 dark:bg-slate-800/50 border-transparent"
                                        )}
                                        onClick={() => { setActiveSessionId(session.id); setSuggestedChips([]); }}
                                    >
                                        <div className="flex-1 overflow-hidden">
                                            <p className={cn("text-xs font-black truncate tracking-tight", activeSessionId === session.id ? "text-primary" : "text-[#2D3A5D] dark:text-slate-200")}>{session.title}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={(e) => {e.stopPropagation(); setSessions(prev => prev.filter(s => s.id !== session.id));}}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
              </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full px-6 py-6" ref={scrollAreaRef}>
                  <div className="space-y-6">
                      {!activeSessionId && !isPending && (
                          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in zoom-in-95 duration-700">
                              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] shadow-inner relative">
                                  <Sparkles className="w-12 h-12 text-primary" />
                                  <div className="absolute inset-0 bg-primary/5 rounded-[3rem] animate-pulse" />
                              </div>
                              <div className="space-y-2">
                                <h2 className="text-2xl font-black text-[#2D3A5D] dark:text-slate-100">Mind Companion</h2>
                                <p className="text-sm font-bold text-slate-400 tracking-tight max-w-[280px] leading-relaxed mx-auto">
                                  Hey friend! I'm here to listen, support, and keep you company. How's everything going with "Tu" today?
                                </p>
                              </div>
                              <Button className="rounded-full h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20" onClick={handleNewChat}>
                                Start Talking
                              </Button>
                          </div>
                      )}
                      
                      {messages.map((message, index) => (
                          <div
                              key={index}
                              className={cn("flex items-end gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300", message.role === 'user' ? 'flex-row-reverse' : '')}
                          >
                              {message.role === 'user' ? (
                                  <Avatar className="h-8 w-8 border-2 border-white shadow-sm shrink-0 mb-1">
                                      <AvatarImage src="https://picsum.photos/seed/user/100/100" alt="User" />
                                      <AvatarFallback className="bg-slate-200"><User className="w-4 h-4"/></AvatarFallback>
                                  </Avatar>
                              ) : (
                                  <div className="w-8 shrink-0" />
                              )}
                              <div
                                  className={cn(
                                      "max-w-[85%] rounded-[1.8rem] px-5 py-3.5 shadow-sm",
                                      message.role === 'user' 
                                          ? "bg-primary text-white rounded-br-sm" 
                                          : "bg-slate-100 dark:bg-slate-800 text-[#2D3A5D] dark:text-slate-100 rounded-bl-sm border border-white/50"
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
                          <div className="flex items-end gap-3">
                              <div className="w-8 shrink-0" />
                              <div className="bg-slate-100 dark:bg-slate-800 rounded-[1.8rem] rounded-bl-sm px-6 py-4 border border-white/50 flex items-center gap-3 shadow-inner">
                                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Companion is listening...</span>
                              </div>
                          </div>
                      )}

                      {/* Suggestion Chips */}
                      {suggestionChips.length > 0 && !isPending && (
                        <div className="flex flex-wrap gap-2 pt-4 justify-start pl-11 animate-in fade-in slide-in-from-left-4 duration-500">
                            {suggestionChips.map((chip, idx) => (
                                <Button 
                                    key={idx} 
                                    variant="outline" 
                                    size="sm" 
                                    className="rounded-full border-primary/20 bg-white/50 dark:bg-slate-800 hover:bg-primary/10 hover:border-primary text-[11px] font-black text-primary px-5 h-9 transition-all active:scale-95 shadow-sm"
                                    onClick={() => handleFormAction(chip)}
                                >
                                    <MessageCircle className="w-3 h-3 mr-1.5 opacity-60" />
                                    {chip}
                                </Button>
                            ))}
                        </div>
                      )}
                  </div>
              </ScrollArea>
          </CardContent>
          
          <CardFooter className="px-6 pb-8 pt-4 flex-col items-stretch gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-50 dark:border-slate-800 shrink-0">
              <form
                  ref={formRef}
                  action={handleFormAction}
                  className="flex w-full items-end gap-3"
              >
                  <div className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-[2rem] shadow-inner overflow-hidden border border-slate-100 dark:border-slate-800 transition-all focus-within:ring-2 focus-within:ring-primary/20">
                    <Textarea
                        id="chatInput"
                        ref={queryInputRef}
                        name="query"
                        placeholder="Say whatever's on your heart..."
                        className="w-full min-h-[56px] max-h-[150px] p-5 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-[15px] resize-none scrollbar-hide"
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
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    Private & Safe Workspace
                </div>
                {activeSession?.mood && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full">
                        <Activity className="w-3 h-3 text-primary" />
                        <span className="text-[9px] font-black uppercase text-primary tracking-widest">{activeSession.mood}</span>
                    </div>
                )}
              </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}