'use client';

import React, { useActionState, useRef, useEffect, useState, useCallback, useMemo, startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
    SendHorizonal, 
    Loader2, 
    Plus, 
    Mic, 
    MicOff, 
    X, 
    Volume2, 
    Heart,
    History,
    Menu,
    Trash2,
    Sparkles,
    Activity,
    BrainCircuit,
    Copy,
    ThumbsUp,
    ThumbsDown,
    Globe,
    Clock,
    ShieldCheck,
    MessageCircle
} from 'lucide-react';
import { aiPsychiatristAction, speechToTextAction } from './actions';
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
import { SidebarTrigger } from '@/components/ui/sidebar';

// Types
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

const mentalHealthSources = [
  "American Psychological Association (APA)",
  "Mental Health Foundation",
  "National Institute of Mental Health (NIMH)",
  "Cognitive Behavioral Guidelines",
  "World Federation for Mental Health",
  "Mindful Awareness Research Center",
  "Counseling & Support Experts"
];

const initialState = { result: null, error: null };
const initialSpeechState = { transcript: null, error: null };

export default function AIPsychiatristPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [suggestionChips, setSuggestedChips] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // UI Enhancements
  const [isInputVisible, setIsInputVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

  const [state, formAction, isPending] = useActionState(aiPsychiatristAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const hasMessages = (activeSession?.messages?.length || 0) > 0;

  // Initial Data Load
  useEffect(() => {
    const saved = localStorage.getItem('mindCompanionSessions_v2');
    if (saved) setSessions(JSON.parse(saved));
    setActiveSessionId(null);
  }, []);

  // Sync Persistent Storage
  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('mindCompanionSessions_v2', JSON.stringify(sessions));
  }, [sessions]);

  // Handle Response Logic
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
        toast({ variant: 'destructive', title: 'Connection Issue', description: state.error });
    }
  }, [state, isPending, activeSessionId, toast]);

  // Thinking Animation Logic
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    let sourceInterval: NodeJS.Timeout;

    if (isPending) {
      setLoadingTimer(0);
      setCurrentSourceIndex(0);
      timerInterval = setInterval(() => setLoadingTimer(prev => prev + 1), 1000);
      sourceInterval = setInterval(() => setCurrentSourceIndex(prev => (prev + 1) % mentalHealthSources.length), 2500);
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(sourceInterval);
    };
  }, [isPending]);

  // Immersive Reading Logic
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || !hasMessages) { setIsInputVisible(true); return; }
    const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
    if (!viewport) return;

    const handleScroll = () => {
        const currentTop = viewport.scrollTop;
        const isAtBottom = Math.abs(viewport.scrollHeight - viewport.clientHeight - currentTop) < 20;
        if (currentTop > lastScrollTop.current && currentTop > 100 && !isAtBottom) setIsInputVisible(false);
        else setIsInputVisible(true);
        lastScrollTop.current = currentTop;
    };

    viewport.addEventListener('scroll', handleScroll);
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [hasMessages]);

  const handleNewChat = useCallback(() => {
    const id = `mind-${Date.now()}`;
    const newSession: Session = {
      id,
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(id);
    setSuggestedChips([]);
    setIsInputVisible(true);
  }, []);

  const onFormAction = (formData: FormData | string) => {
    let query = '';
    if (typeof formData === 'string') query = formData;
    else query = formData.get('query') as string || '';

    if (!query) return;

    let sid = activeSessionId;
    const userMsg: Message = { role: 'user', content: query, timestamp: Date.now() };

    if (!sid) {
        sid = `mind-${Date.now()}`;
        const newSession: Session = {
            id: sid,
            title: query.length > 30 ? query.substring(0, 30) + '...' : query,
            messages: [userMsg],
            createdAt: Date.now(),
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(sid);
    } else {
        setSessions(prev => prev.map(s => s.id === sid ? {
            ...s, 
            messages: [...s.messages, userMsg],
            title: s.messages.length === 0 ? (query.length > 30 ? query.substring(0, 30) + '...' : query) : s.title
        } : s));
    }

    const payload = new FormData();
    payload.set('query', query);
    const history = activeSession ? [...activeSession.messages, userMsg].map(m => ({ role: m.role, content: m.content })) : [userMsg];
    payload.set('history', JSON.stringify(history));
    
    startTransition(() => {
        formAction(payload);
    });

    if (queryInputRef.current) {
        queryInputRef.current.value = '';
        queryInputRef.current.style.height = 'auto';
    }
    setSuggestedChips([]);
    setIsTyping(false);
    setIsInputVisible(true);
  };

  // Auto Scroll
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [activeSession?.messages, isPending]);

  // Speech to Text
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [speechState, speechFormAction] = useActionState(speechToTextAction, initialSpeechState);

  useEffect(() => {
    if (speechState.transcript && queryInputRef.current) {
        queryInputRef.current.value = speechState.transcript;
        setIsTyping(true);
    }
  }, [speechState]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const formData = new FormData();
          formData.append('audioDataUri', base64Audio);
          startTransition(() => { speechFormAction(formData); });
        };
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (e) { toast({ variant: 'destructive', title: 'Mic Error' }); }
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#f8f9fa] dark:bg-[#131314] overflow-hidden fixed inset-0 font-body">
        {/* Gemini Header */}
        <header className="h-14 border-b border-gray-200 dark:border-[#3c4043] flex items-center justify-between px-4 shrink-0 bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-md z-50">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043]">
                    <Menu className="w-5 h-5 text-gray-600 dark:text-[#c4c7c5]" />
                </SidebarTrigger>
                <div className="h-6 w-px bg-gray-200 dark:bg-[#3c4043] mx-1" />
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        <BrainCircuit className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col -space-y-0.5">
                        <h1 className="text-[11px] font-black text-[#2D3A5D] dark:text-slate-100 uppercase tracking-tighter leading-none">Mind</h1>
                        <p className="text-[8px] font-black text-primary uppercase tracking-[0.25em]">Companion</p>
                    </div>
                </div>
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                        <History className="w-5 h-5 text-gray-500 dark:text-[#9aa0a6]" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-sm p-0 border-none rounded-l-[2rem] shadow-2xl flex flex-col bg-white dark:bg-[#1e1f20]">
                    <SheetHeader className="p-6 pb-2">
                        <SheetTitle className="text-primary uppercase font-black text-xs tracking-[0.2em]">Journal</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="flex-1 p-6 pt-0">
                        <Button variant="outline" className="w-full h-11 rounded-2xl mb-6 font-black uppercase text-[10px] tracking-widest" onClick={handleNewChat}>
                            <Plus className="mr-2 h-4 w-4" /> Start Fresh
                        </Button>
                        <div className="space-y-2.5 pb-20">
                            {sessions.map(session => (
                                <div key={session.id} 
                                     onClick={() => { setActiveSessionId(session.id); setSuggestedChips([]); }}
                                     className={cn("group p-4 rounded-[1.5rem] border shadow-sm cursor-pointer transition-all active:scale-[0.98] relative", activeSessionId === session.id ? "bg-primary/5 border-primary/30" : "bg-white/40 dark:bg-[#282a2c] border-transparent hover:bg-gray-50")}>
                                    <div className="pr-8">
                                        <p className="text-xs font-bold truncate dark:text-[#e3e3e3]">{session.title}</p>
                                        <p className="text-[8px] font-black text-gray-400 uppercase mt-1">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-300 hover:text-red-500 rounded-full" onClick={(e) => { e.stopPropagation(); setSessions(prev => prev.filter(s => s.id !== session.id)); if(activeSessionId === session.id) setActiveSessionId(null); }}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </header>

        <main className="flex-1 overflow-hidden relative flex flex-col w-full max-w-3xl mx-auto">
            {!hasMessages && !isPending ? (
                <ScrollArea className="flex-1 w-full">
                    <div className="flex flex-col justify-center items-center px-6 pt-20 pb-32 space-y-10 text-center max-w-sm mx-auto animate-in fade-in duration-1000">
                        <div className="space-y-6 flex flex-col items-center">
                            <div className="p-5 bg-white dark:bg-[#1e1f20] rounded-[2.5rem] shadow-xl border border-white/50 relative">
                                <Sparkles className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(36,136,232,0.3)]" />
                                <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">How is your heart?</h2>
                                <p className="text-sm font-bold text-gray-400 leading-relaxed">I'm right here to listen. Share whatever is on your mind, friend.</p>
                            </div>
                        </div>
                        <Button className="rounded-full h-14 px-10 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/20 active:scale-95 transition-all" onClick={handleNewChat}>
                           Talk to Me
                        </Button>
                    </div>
                </ScrollArea>
            ) : (
                <ScrollArea className="flex-1 px-4 md:px-6 py-6" ref={scrollAreaRef}>
                    <div className="max-w-2xl mx-auto space-y-8 pb-32">
                        {activeSession?.messages.map((m, i) => (
                            <div key={i} className={cn("animate-in fade-in slide-in-from-bottom-2 duration-500", m.role === 'user' ? "flex flex-col items-end" : "flex flex-col items-start")}>
                                {m.role === 'user' ? (
                                    <div 
                                        className="max-w-[90%] rounded-[1.5rem] rounded-tr-sm bg-primary text-white px-4 py-2.5 shadow-sm overflow-hidden" 
                                        style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                                    >
                                        <p className="text-sm font-bold leading-relaxed">{m.content}</p>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3 w-full group min-w-0">
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <div 
                                                className="bg-white dark:bg-[#1e1f20] p-4 rounded-[1.5rem] rounded-tl-sm shadow-sm border border-gray-100 dark:border-[#3c4043]" 
                                                style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                                            >
                                                <article className="prose prose-sm dark:prose-invert max-w-full text-gray-800 dark:text-[#e3e3e3] leading-relaxed font-bold text-[15px]">
                                                    <ReactMarkdown>{m.content}</ReactMarkdown>
                                                </article>
                                            </div>
                                            
                                            <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => {
                                                    if (window.speechSynthesis) {
                                                        window.speechSynthesis.cancel();
                                                        const u = new SpeechSynthesisUtterance(m.content.replace(/[*#_`]/g, ''));
                                                        window.speechSynthesis.speak(u);
                                                    }
                                                }}>
                                                    <Volume2 className="w-3.5 h-3.5 text-gray-400" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => { navigator.clipboard.writeText(m.content); toast({title: "Copied"}); }}>
                                                    <Copy className="w-3.5 h-3.5 text-gray-400" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><ThumbsUp className="w-3.5 h-3.5 text-gray-400" /></Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><ThumbsDown className="w-3.5 h-3.5 text-gray-400" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isPending && (
                             <div className="flex items-start gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex-1 pt-1 min-w-0">
                                    <div className="bg-white dark:bg-[#1e1f20] p-4 rounded-[1.8rem] rounded-tl-sm shadow-sm border border-gray-100 dark:border-[#3c4043] space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em]">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                <span>Companion is listening...</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                                                <Clock className="w-2.5 h-2.5 text-primary" />
                                                <span className="text-[10px] font-black tabular-nums text-primary">{loadingTimer}s</span>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-100 dark:bg-[#3c4043]" />

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-3 h-3 text-emerald-500 animate-pulse" />
                                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Applying Psychological Logic</span>
                                            </div>
                                            
                                            <div className="relative h-10 overflow-hidden bg-gray-50 dark:bg-[#131314] rounded-2xl border border-dashed border-gray-200 dark:border-[#3c4043] flex items-center px-4">
                                                <div key={currentSourceIndex} className="flex items-center gap-2 animate-in slide-in-from-bottom-4 fade-in duration-500 w-full">
                                                    <Sparkles className="w-3 h-3 text-yellow-500 shrink-0" />
                                                    <p className="text-[10px] font-bold text-gray-700 dark:text-[#c4c7c5] truncate">
                                                        Checking: <span className="text-primary">{mentalHealthSources[currentSourceIndex]}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Suggestion Chips */}
                        {suggestionChips.length > 0 && !isPending && (
                            <div className="flex flex-wrap gap-2 pt-4 justify-start animate-in fade-in slide-in-from-left-4 duration-700">
                                {suggestionChips.map((chip, idx) => (
                                    <Button 
                                        key={idx} 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-full border-primary/20 bg-white/80 dark:bg-[#1e1f20] hover:bg-primary/10 hover:border-primary text-[10px] font-black text-primary px-6 h-10 transition-all active:scale-95 shadow-md"
                                        onClick={() => onFormAction(chip)}
                                    >
                                        <MessageCircle className="w-3.5 h-3.5 mr-2 opacity-70" />
                                        {chip}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            )}
        </main>

        {/* Input Footer */}
        <footer className={cn(
            "px-4 pb-8 pt-2 z-40 shrink-0 transition-transform duration-500 ease-in-out",
            !isInputVisible && hasMessages ? "translate-y-[150%]" : "translate-y-0"
        )}>
            <form ref={formRef} action={onFormAction} className="max-w-2xl mx-auto flex flex-col gap-3">
                <div className="relative flex flex-col rounded-[28px] bg-white dark:bg-[#1e1f20] shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] transition-all p-2 border border-transparent focus-within:border-gray-200 dark:focus-within:border-[#3c4043]">
                    <div className="flex items-center justify-between px-4 mb-1">
                        <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3 text-primary" />
                            Private Space
                        </div>
                        {activeSession?.mood && (
                            <div className="flex items-center gap-2 px-2 py-0.5 bg-primary/10 rounded-full">
                                <Activity className="w-2.5 h-2.5 text-primary" />
                                <span className="text-[8px] font-black uppercase text-primary tracking-widest">{activeSession.mood}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 max-h-48 overflow-y-auto">
                        <Textarea
                            ref={queryInputRef}
                            name="query"
                            placeholder="Tell me whatever's on your heart..."
                            className="w-full min-h-[44px] max-h-[160px] px-3 py-2 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-[15px] text-gray-800 dark:text-[#e3e3e3] placeholder:text-gray-500 resize-none"
                            rows={1}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                                setIsTyping(target.value.length > 0);
                            }}
                            onKeyDown={(e) => { 
                                if (e.key === 'Enter' && !e.shiftKey) { 
                                    e.preventDefault(); 
                                    onFormAction(new FormData(formRef.current!));
                                } 
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-50 dark:border-[#3c4043]">
                        <div className="flex items-center gap-1">
                             <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={handleNewChat}>
                                <Plus className="h-5 w-5 text-gray-400" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                             {!isTyping && !isRecording && (
                                <Button type="button" variant="ghost" size="icon" onClick={startRecording} className="h-9 w-9 rounded-full">
                                    <Mic className="w-4 h-4 text-gray-400" />
                                </Button>
                            )}
                            {(isTyping || isRecording) && (
                                <div className="flex items-center gap-2">
                                    {isRecording && (
                                        <Button type="button" size="icon" onClick={() => { if(mediaRecorderRef.current) mediaRecorderRef.current.stop(); setIsRecording(false); }} className="h-9 w-9 rounded-full bg-red-500 text-white animate-pulse">
                                            <MicOff className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button 
                                        type="submit"
                                        disabled={isPending} 
                                        className="h-9 w-9 rounded-full bg-[#d3e3fd] text-gray-900 dark:bg-[#1f3760] dark:text-white transition-all hover:bg-primary hover:text-white"
                                    >
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizonal className="w-4 h-4" />}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <p className="text-[7px] text-center text-gray-400 uppercase tracking-widest mt-1">Companion is here to support, not diagnose.</p>
            </form>
        </footer>
    </div>
  );
}
