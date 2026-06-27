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
    History,
    Menu,
    Trash2,
    Sparkles,
    Activity,
    BrainCircuit,
    Copy,
    Clock,
    ShieldCheck,
    MessageCircle,
    NotebookPen,
    Square,
    Heart,
    Wind,
    CloudRain,
    Smile,
    MessageSquareQuote,
    StopCircle
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

const mentalPrompts = [
    { label: "Feeling Anxious", query: "I've been feeling quite anxious lately and I need someone to talk to.", icon: CloudRain, color: "text-blue-400" },
    { label: "Stress at Work", query: "Work is getting very stressful and I'm finding it hard to manage.", icon: Wind, color: "text-teal-400" },
    { label: "Just Need to Talk", query: "I just need a safe space to share what's on my mind today.", icon: MessageSquareQuote, color: "text-purple-400" },
    { label: "Feeling Happy", query: "I'm having a great day and wanted to share my positive energy!", icon: Smile, color: "text-yellow-400" },
];

const initialState = { result: null, error: null };
const initialSpeechState = { transcript: null, error: null };

export default function AIPsychiatristPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [suggestionChips, setSuggestedChips] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // UI States
  const [isInputVisible, setIsInputVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);
  const [isManuallyStopped, setIsManuallyStopped] = useState(false);

  const [state, formAction, isPendingActual] = useActionState(aiPsychiatristAction, initialState);
  const isPending = isPendingActual && !isManuallyStopped;

  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const hasMessages = (activeSession?.messages?.length || 0) > 0;

  // Initial Load
  useEffect(() => {
    const saved = localStorage.getItem('mindCompanionSessions_v3');
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  // Sync Persistence
  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('mindCompanionSessions_v3', JSON.stringify(sessions));
  }, [sessions]);

  // Immersive Reading Logic
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || !hasMessages) { setIsInputVisible(true); return; }
    const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
    if (!viewport) return;

    const handleScroll = () => {
        const currentTop = viewport.scrollTop;
        const isAtBottom = Math.abs(viewport.scrollHeight - viewport.clientHeight - currentTop) < 30;
        
        if (currentTop > lastScrollTop.current && currentTop > 100 && !isAtBottom) {
            setIsInputVisible(false);
        } else {
            setIsInputVisible(true);
        }
        lastScrollTop.current = currentTop;
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [hasMessages]);

  // Handle AI Responses
  useEffect(() => {
    if (!isPendingActual && state.result) {
        if (!isManuallyStopped) {
            const { response_parts, suggested_chips, mood } = state.result;
            setSuggestedChips(suggested_chips || []);
            setSessions(prev => prev.map(s => s.id === activeSessionId ? {
                ...s, 
                messages: [...s.messages, ...response_parts.map((p: string) => ({ role: 'assistant' as const, content: p, timestamp: Date.now() }))],
                mood: mood
            } : s));
        }
    }
    if (state.error && !isManuallyStopped) toast({ variant: 'destructive', description: state.error });
  }, [state, isPendingActual, activeSessionId, toast, isManuallyStopped]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPending) {
      setLoadingTimer(0);
      interval = setInterval(() => setLoadingTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPending]);

  const handleNewChat = useCallback(() => {
    const id = `mind-${Date.now()}`;
    setSessions(prev => [{ id, title: 'New Conversation', messages: [], createdAt: Date.now() }, ...prev]);
    setActiveSessionId(id);
    setSuggestedChips([]);
    setIsInputVisible(true);
    setIsFocused(false);
  }, []);

  const onFormAction = (formData: FormData | string) => {
    let query = typeof formData === 'string' ? formData : formData.get('query') as string || '';
    if (!query) return;

    setIsManuallyStopped(false);
    const userMsg: Message = { role: 'user', content: query, timestamp: Date.now() };

    let sid = activeSessionId;
    if (!sid) {
        sid = `mind-${Date.now()}`;
        setSessions(prev => [{ id: sid!, title: query.substring(0, 30), messages: [userMsg], createdAt: Date.now() }, ...prev]);
        setActiveSessionId(sid);
    } else {
        setSessions(prev => prev.map(s => s.id === sid ? { ...s, messages: [...s.messages, userMsg] } : s));
    }

    const payload = new FormData();
    payload.set('query', query);
    payload.set('history', JSON.stringify(activeSession ? [...activeSession.messages, userMsg] : [userMsg]));
    startTransition(() => formAction(payload));

    if (queryInputRef.current) { queryInputRef.current.value = ''; queryInputRef.current.style.height = 'auto'; }
    setSuggestedChips([]);
    setIsTyping(false);
    setIsInputVisible(true);
    setIsFocused(false);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [activeSession?.messages, isPending]);

  const handleToggleSpeech = (text: string, msgId: number) => {
    if (!window.speechSynthesis) return;
    if (speakingMsgId === msgId) { window.speechSynthesis.cancel(); setSpeakingMsgId(null); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ''));
    utterance.onstart = () => setSpeakingMsgId(msgId); utterance.onend = () => setSpeakingMsgId(null);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] overflow-hidden fixed inset-0 font-body">
        <header className="h-16 border-b border-gray-100 dark:border-[#3c4043] flex items-center justify-between px-4 shrink-0 bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-xl z-50">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="h-10 w-10 rounded-2xl hover:bg-white/50 shadow-sm border border-white/20">
                    <Menu className="w-5 h-5 text-gray-600 dark:text-[#c4c7c5]" />
                </SidebarTrigger>
                <div className="flex items-center gap-2.5 ml-2">
                    <div className="p-2 bg-primary/10 rounded-xl shadow-inner">
                        <BrainCircuit className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col -space-y-0.5">
                        <h1 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tighter leading-none">AI</h1>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.25em]">Psychiatrist</p>
                    </div>
                </div>
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="rounded-full h-10 px-4 gap-2 bg-white/50 dark:bg-slate-800/50 border-white/40 shadow-sm">
                        <History className="w-4 h-4 text-primary" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-sm p-0 border-none rounded-l-[2.5rem] shadow-2xl flex flex-col bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl">
                    <SheetHeader className="p-8 pb-4">
                        <SheetTitle className="text-primary uppercase font-black text-xs tracking-[0.2em]">Personal Journal</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="flex-1 p-8 pt-0">
                        <Button variant="outline" className="w-full h-12 rounded-2xl mb-8 font-black uppercase text-[10px] tracking-widest border-primary/20" onClick={handleNewChat}>
                            <Plus className="mr-2 h-4 w-4" /> Start Fresh
                        </Button>
                        <div className="space-y-3 pb-20">
                            {sessions.map(session => (
                                <div key={session.id} 
                                     onClick={() => { setActiveSessionId(session.id); setSuggestedChips([]); }}
                                     className={cn("group p-5 rounded-[2rem] border shadow-sm cursor-pointer transition-all", activeSessionId === session.id ? "bg-primary/5 border-primary/30" : "bg-white/40 border-transparent")}>
                                    <p className="text-xs font-bold truncate">{session.title}</p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase mt-1.5">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </header>

        <main className="flex-1 overflow-hidden relative flex flex-col w-full max-w-4xl mx-auto">
            {!hasMessages && !isPending ? (
                <ScrollArea className="flex-1 w-full">
                    <div className="flex flex-col justify-center items-center px-6 pt-10 pb-40 space-y-12 text-center max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-1000">
                        <div className="relative flex flex-col items-center">
                            <div className="p-8 bg-white dark:bg-[#1e1f20] rounded-[3.5rem] shadow-2xl border border-white/50">
                                <BrainCircuit className="w-16 h-16 text-primary" />
                                <div className="absolute -top-2 -right-2 bg-pink-500 p-2.5 rounded-2xl shadow-xl border-4 border-white rotate-12">
                                    <Heart className="w-4 h-4 text-white fill-white" />
                                </div>
                            </div>
                            <div className="mt-10 space-y-4">
                                <h2 className="text-4xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase">Your Safe Space</h2>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Whatever you share stays here, private and protected.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            {mentalPrompts.map((prompt, idx) => (
                                <button key={idx} onClick={() => onFormAction(prompt.query)} className="flex flex-col items-start gap-4 p-6 bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-md rounded-[2.5rem] text-left border border-white/40 hover:border-primary/30 transition-all active:scale-[0.95] shadow-sm">
                                    <div className={cn("p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-md", prompt.color)}>
                                        <prompt.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-[12px] font-black text-slate-700 dark:text-[#e3e3e3] uppercase tracking-widest">{prompt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            ) : (
                <ScrollArea className="flex-1 px-4 md:px-8 py-10" ref={scrollAreaRef}>
                    <div className="max-w-4xl mx-auto pb-64">
                        {activeSession?.messages.map((m, i) => (
                            <div key={i} className={cn("animate-in fade-in slide-in-from-bottom-6 duration-700", m.role === 'user' ? "flex flex-col items-end mt-10" : "flex flex-col items-start mt-12")}>
                                {m.role === 'user' ? (
                                    <div className="max-w-[85%] md:max-w-[70%] bg-primary text-white px-7 py-4 shadow-xl rounded-[2.2rem] rounded-tr-sm">
                                        <p className="text-[15px] md:text-[17px] font-bold leading-relaxed">{m.content}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start w-full group">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="size-9 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100">
                                                <BrainCircuit className="w-4.5 h-4.5 text-primary" />
                                            </div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mind Companion</span>
                                        </div>
                                        <div className="flex-1 w-full min-w-0">
                                            <article className="prose prose-sm md:prose-lg dark:prose-invert max-w-full text-slate-800 dark:text-[#e3e3e3] leading-relaxed font-medium px-1">
                                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                            </article>
                                            <div className="mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shadow-sm" onClick={() => handleToggleSpeech(m.content, i)}>
                                                    <Volume2 className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full shadow-sm" onClick={() => { navigator.clipboard.writeText(m.content); toast({title: "Copied"}); }}><Copy className="w-3.5 h-3.5" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isPending && (
                             <div className="flex flex-col items-start gap-6 w-full mt-12 animate-in fade-in">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-12 flex items-center justify-center bg-rose-50 rounded-2xl shadow-inner">
                                            <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-pulse" />
                                        </div>
                                        <span className="text-[11px] font-black text-rose-500 uppercase tracking-[0.2em]">Listening... <span className="ml-2 tabular-nums">{loadingTimer}s</span></span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setIsManuallyStopped(true)} className="rounded-full h-8 px-3 text-red-500 font-black text-[9px] uppercase tracking-widest">
                                        <StopCircle className="w-3 h-3 mr-2" /> Stop
                                    </Button>
                                </div>
                            </div>
                        )}

                        {suggestionChips.length > 0 && !isPending && (
                            <div className="flex flex-wrap gap-3 pt-10 justify-start">
                                {suggestionChips.map((chip, idx) => (
                                    <Button key={idx} variant="outline" size="sm" className="rounded-full border-primary/10 bg-white/80 h-12 px-8 font-black text-[11px] text-primary shadow-xl" onClick={() => onFormAction(chip)}>
                                        <MessageCircle className="w-4 h-4 mr-2.5 opacity-70" /> {chip}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            )}
        </main>

        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 px-4 pb-10",
            !isInputVisible && hasMessages ? "translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"
        )}>
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
                <div className="relative flex flex-col rounded-[2.5rem] bg-white/90 dark:bg-[#1e1f20]/90 backdrop-blur-2xl shadow-2xl p-3 border border-white dark:border-[#3c4043] focus-within:ring-4 focus-within:ring-primary/10">
                    <div className="flex items-center px-5 mb-2 gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-primary" /> Private Safe Session
                    </div>

                    <div className="flex-1">
                        <Textarea
                            ref={queryInputRef}
                            name="query"
                            placeholder="Tell me whatever's on your heart..."
                            className={cn(
                                "w-full px-5 py-3 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-[17px] text-slate-800 dark:text-[#e3e3e3] resize-none transition-all duration-300 overflow-y-auto",
                                (isFocused || isTyping) ? "min-h-[60px] max-h-[200px]" : "min-h-[46px] max-h-[46px]"
                            )}
                            rows={1}
                            onFocus={() => setIsFocused(true)}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
                                setIsTyping(target.value.length > 0);
                                target.scrollTop = target.scrollHeight;
                            }}
                            onKeyDown={(e) => { 
                                if (e.key === 'Enter' && !e.shiftKey) { 
                                    e.preventDefault(); 
                                    onFormAction(new FormData(formRef.current!));
                                } 
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/80">
                        <Button type="button" variant="ghost" size="icon" className="h-11 w-11 rounded-full" onClick={handleNewChat}>
                            <Plus className="h-6 w-6 text-slate-500" />
                        </Button>

                        <div className="flex items-center gap-3">
                             {!isTyping && !isRecording && (
                                <Button type="button" variant="ghost" size="icon" onClick={() => toast({title: "Feature Coming Soon"})} className="h-12 w-12 rounded-full bg-slate-50">
                                    <Mic className="w-5 h-5 text-primary" />
                                </Button>
                            )}
                            {(isTyping || isRecording) && (
                                <Button onClick={() => onFormAction(new FormData(formRef.current!))} disabled={isPending} className="h-12 w-12 rounded-full bg-primary text-white shadow-lg">
                                    {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <SendHorizonal className="w-6 h-6" />}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
