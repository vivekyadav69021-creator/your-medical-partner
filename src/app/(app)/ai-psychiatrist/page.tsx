'use client';

import React, { useActionState, useRef, useEffect, useState, useCallback, startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
    SendHorizonal, 
    Loader2, 
    Plus, 
    Mic, 
    MicOff, 
    Volume2, 
    History,
    Menu,
    BrainCircuit,
    Copy,
    ShieldCheck,
    MessageCircle,
    Heart,
    Wind,
    CloudRain,
    Smile,
    MessageSquareQuote,
    StopCircle,
    ChevronLeft,
    Sparkles
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
import Link from 'next/link';

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
    { label: "Feeling Anxious", query: "I've been feeling quite anxious lately and I need someone to talk to.", icon: CloudRain, color: "text-blue-500", bg: "bg-blue-50/50" },
    { label: "Stress at Work", query: "Work is getting very stressful and I'm finding it hard to manage.", icon: Wind, color: "text-teal-500", bg: "bg-teal-50/50" },
    { label: "Just Need to Talk", query: "I just need a safe space to share what's on my mind today.", icon: MessageSquareQuote, color: "text-purple-500", bg: "bg-purple-50/50" },
    { label: "Feeling Happy", query: "I'm having a great day and wanted to share my positive energy!", icon: Smile, color: "text-amber-500", bg: "bg-amber-50/50" },
];

const initialState = { result: null, error: null };
const initialSpeechState = { transcript: null, error: null };

export default function AIPsychiatristPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [suggestionChips, setSuggestedChips] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  // Voice Recording Logic
  const [isRecording, setIsRecording] = useState(false);
  const [speechState, speechFormAction] = useActionState(speechToTextAction, initialSpeechState);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // UI States
  const [isInputVisible, setIsInputVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);
  const [isManuallyStopped, setIsManuallyStopped] = useState(false);

  const [state, formAction, isPendingActual] = useActionState(aiPsychiatristAction, initialState);
  const isPending = isPendingActual && !isManuallyStopped;

  const { toast } = useToast();
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const hasMessages = (activeSession?.messages?.length || 0) > 0;

  // Initial Load
  useEffect(() => {
    const saved = localStorage.getItem('mindCompanionSessions_v4');
    if (saved) setSessions(JSON.parse(saved));
  }, []);

  // Sync Persistence
  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('mindCompanionSessions_v4', JSON.stringify(sessions));
  }, [sessions]);

  // Handle Speech Transcription
  useEffect(() => {
    if (speechState.transcript && queryInputRef.current) {
        queryInputRef.current.value = speechState.transcript;
        setIsTyping(true);
        queryInputRef.current.style.height = 'auto';
        queryInputRef.current.style.height = `${Math.min(queryInputRef.current.scrollHeight, 180)}px`;
    }
    if (speechState.error) {
        toast({ variant: 'destructive', title: 'Mic Error', description: speechState.error });
    }
  }, [speechState, toast]);

  // Handle AI Responses
  useEffect(() => {
    if (!isPendingActual && state.result) {
        if (!isManuallyStopped) {
            const { response_parts, suggested_chips, mood } = state.result;
            setSuggestedChips(suggested_chips || []);
            setSessions(prev => prev.map(s => s.id === activeSessionId ? {
                ...s, 
                messages: [...s.messages, ...response_parts.map((p: string) => ({ role: 'assistant' as const, content: p, timestamp: Date.now() }))],
                mood: mood,
                title: s.messages.length === 0 ? s.title : s.title 
            } : s));
        }
    }
    if (state.error && !isManuallyStopped) toast({ variant: 'destructive', description: state.error });
  }, [state, isPendingActual, activeSessionId, toast, isManuallyStopped]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || !hasMessages) { setIsInputVisible(true); return; }
    const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
    if (!viewport) return;

    const handleScroll = () => {
        const currentTop = viewport.scrollTop;
        if (Math.abs(currentTop - lastScrollTop.current) < 15) return;
        const isAtBottom = Math.abs(viewport.scrollHeight - viewport.clientHeight - currentTop) < 40;
        
        if (currentTop > lastScrollTop.current && currentTop > 80 && !isAtBottom) {
            setIsInputVisible(false);
        } else {
            setIsInputVisible(true);
        }
        lastScrollTop.current = currentTop;
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [hasMessages]);

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
    setSessions(prev => [{ id, title: 'New Reflection', messages: [], createdAt: Date.now() }, ...prev]);
    setActiveSessionId(id);
    setSuggestedChips([]);
    setIsInputVisible(true);
    setIsFocused(false);
  }, []);

  const onFormAction = (inputValue: string) => {
    const query = inputValue.trim();
    if (!query) return;

    setIsManuallyStopped(false);
    const userMsg: Message = { role: 'user', content: query, timestamp: Date.now() };

    let sid = activeSessionId;
    if (!sid) {
        sid = `mind-${Date.now()}`;
        setSessions(prev => [{ id: sid!, title: query.substring(0, 30), messages: [userMsg], createdAt: Date.now() }, ...prev]);
        setActiveSessionId(sid);
    } else {
        setSessions(prev => prev.map(s => s.id === sid ? { ...s, messages: [...s.messages, userMsg], title: s.messages.length === 0 ? query.substring(0, 30) : s.title } : s));
    }

    const payload = new FormData();
    payload.set('query', query);
    payload.set('history', JSON.stringify(activeSession ? [...activeSession.messages, userMsg] : [userMsg]));
    startTransition(() => { formAction(payload); });

    if (queryInputRef.current) { queryInputRef.current.value = ''; queryInputRef.current.style.height = 'auto'; }
    setSuggestedChips([]);
    setIsTyping(false);
    setIsInputVisible(true);
    setIsFocused(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          const formData = new FormData();
          formData.append('audioDataUri', base64Audio);
          startTransition(() => { speechFormAction(formData); });
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (e) {
      toast({ variant: 'destructive', title: 'Mic Access Required' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
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
    <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] overflow-hidden fixed inset-0 font-body safe-top">
        <header className="h-16 px-4 bg-white/60 dark:bg-[#1e1f20]/60 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 z-50">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="h-11 w-11 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center transition-all">
                    <Menu className="w-5 h-5 text-gray-600 dark:text-[#c4c7c5]" />
                </SidebarTrigger>
                <Link href="/dashboard">
                    <div className="h-11 w-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm active:scale-95 transition-all">
                        <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-slate-100" />
                    </div>
                </Link>
                <div className="flex flex-col -space-y-0.5">
                    <h1 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tighter leading-none">Mind</h1>
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.25em]">Companion</p>
                </div>
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="rounded-2xl h-11 w-11 p-0 bg-white/50 dark:bg-slate-800/50 border-white/40 shadow-sm">
                        <History className="w-4.5 h-4.5 text-primary" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-sm p-0 border-none rounded-l-[2.5rem] shadow-2xl flex flex-col bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl">
                    <SheetHeader className="p-8 pb-4">
                        <SheetTitle className="text-primary uppercase font-black text-xs tracking-[0.2em]">Journal Entries</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="flex-1 p-8 pt-0">
                        <Button variant="outline" className="w-full h-12 rounded-2xl mb-8 font-black uppercase text-[10px] tracking-widest border-primary/20" onClick={handleNewChat}>
                            <Plus className="mr-2 h-4 w-4" /> Start Reflection
                        </Button>
                        <div className="space-y-3 pb-20">
                            {sessions.map(session => (
                                <div key={session.id} 
                                     onClick={() => { setActiveSessionId(session.id); setSuggestedChips([]); }}
                                     className={cn("group p-5 rounded-[2rem] border shadow-sm cursor-pointer transition-all", activeSessionId === session.id ? "bg-primary/5 border-primary/30" : "bg-white/40 border-transparent hover:border-slate-200")}>
                                    <p className="text-xs font-bold truncate dark:text-slate-200">{session.title}</p>
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
                    <div className="flex flex-col justify-center items-center px-6 pt-10 pb-48 space-y-12 text-center max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-1000">
                        <div className="space-y-6 flex flex-col items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse scale-150" />
                                <div className="relative p-8 bg-white/70 dark:bg-[#1e1f20]/70 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-800">
                                    <BrainCircuit className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(36,136,232,0.4)]" />
                                    <div className="absolute -top-2 -right-2 bg-pink-500 p-2.5 rounded-2xl shadow-xl border-4 border-white rotate-12">
                                        <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase leading-none">Safe Haven</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] opacity-80 leading-relaxed max-w-[280px]">Whatever is in your heart stays here, private and protected.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 w-full">
                            {mentalPrompts.map((prompt, idx) => (
                                <button key={idx} onClick={() => onFormAction(prompt.query)} className="flex items-center gap-4 p-5 bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-md rounded-[2.5rem] text-left border border-white/40 hover:border-primary/30 transition-all active:scale-[0.98] shadow-sm w-full group">
                                    <div className={cn("p-3 rounded-2xl shrink-0 group-hover:scale-110 transition-transform", prompt.bg)}>
                                        <prompt.icon className={cn("w-5 h-5", prompt.color)} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[11px] font-black text-slate-700 dark:text-[#c4c7c5] uppercase tracking-widest block mb-0.5">{prompt.label}</span>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase truncate">Tap to open safe session</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            ) : (
                <ScrollArea className="flex-1 px-4 md:px-8 py-10" ref={scrollAreaRef}>
                    <div className="max-w-4xl mx-auto space-y-12 pb-80">
                        {activeSession?.messages.map((m, i) => (
                            <div key={i} className={cn("animate-in fade-in slide-in-from-bottom-6 duration-700", m.role === 'user' ? "flex flex-col items-end" : "flex flex-col items-start")}>
                                {m.role === 'user' ? (
                                    <div className="max-w-[85%] md:max-w-[70%] bg-primary text-white px-7 py-5 shadow-xl rounded-[2.5rem] rounded-tr-sm">
                                        <p className="text-[15px] md:text-[17px] font-bold leading-relaxed">{m.content}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start w-full group">
                                        <div className="flex items-center gap-3 mb-5">
                                            <div className="size-10 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800">
                                                <BrainCircuit className="w-5 h-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col -space-y-0.5">
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Mind Companion</span>
                                                <div className="flex items-center gap-1">
                                                    <Sparkles className="w-2.5 h-2.5 text-primary" />
                                                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Empathetic Response</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full min-w-0">
                                            <article className="prose prose-sm md:prose-lg dark:prose-invert max-w-full text-slate-800 dark:text-[#e3e3e3] leading-relaxed font-medium px-2 selection:bg-pink-100">
                                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                            </article>
                                            <div className="mt-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-2xl bg-slate-50 dark:bg-slate-800" onClick={() => handleToggleSpeech(m.content, i)}>
                                                    <Volume2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-2xl bg-slate-50 dark:bg-slate-800" onClick={() => { navigator.clipboard.writeText(m.content); toast({title: "Copied"}); }}><Copy className="w-4 h-4" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isPending && (
                             <div className="flex flex-col items-start gap-6 w-full animate-in fade-in mt-4">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 flex items-center justify-center bg-rose-50 dark:bg-rose-950/20 rounded-[1.5rem] animate-pulse">
                                            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.25em]">Companion Listening...</span>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-10 bg-rose-200 dark:bg-rose-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-rose-500 animate-splash-gradient w-1/2" />
                                                </div>
                                                <span className="tabular-nums text-[9px] font-black text-slate-400">{loadingTimer}s</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setIsManuallyStopped(true)} className="rounded-full h-9 px-4 border-red-100 dark:border-red-900/50 text-red-500 font-black text-[10px] uppercase tracking-widest shadow-sm">
                                        <StopCircle className="w-3.5 h-3.5 mr-2" /> Stop
                                    </Button>
                                </div>
                            </div>
                        )}

                        {suggestionChips.length > 0 && !isPending && (
                            <div className="flex flex-wrap gap-3 pt-6 justify-start">
                                {suggestionChips.map((chip, idx) => (
                                    <Button key={idx} variant="outline" size="sm" className="rounded-full border-primary/10 bg-white/80 dark:bg-slate-900/80 h-11 px-6 font-black text-[10px] text-primary shadow-xl shadow-primary/5 hover:bg-primary hover:text-white transition-all" onClick={() => onFormAction(chip)}>
                                        <MessageCircle className="w-3.5 h-3.5 mr-2 opacity-70" /> {chip}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            )}
        </main>

        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-40 transition-all duration-700 ease-in-out px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]",
            !isInputVisible && hasMessages ? "translate-y-[130%] opacity-0" : "translate-y-0 opacity-100"
        )}>
            <div className="max-w-3xl mx-auto">
                <div className="relative flex flex-col rounded-[2.8rem] bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] p-2.5 border border-white dark:border-[#3c4043] focus-within:ring-[8px] focus-within:ring-primary/5 transition-all duration-500">
                    
                    <div className="flex items-center px-5 py-2 mb-1 gap-2.5 opacity-60">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Encrypted Peer Session</span>
                    </div>

                    <div className="flex-1">
                        <Textarea
                            ref={queryInputRef}
                            name="query"
                            placeholder="Type what's on your heart..."
                            className={cn(
                                "w-full px-5 py-2 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-[17px] text-slate-800 dark:text-[#e3e3e3] resize-none transition-all duration-500 overflow-y-auto",
                                (isFocused || isTyping) ? "min-h-[60px] max-h-[180px]" : "min-h-[46px] max-h-[46px]"
                            )}
                            rows={1}
                            onFocus={() => setIsFocused(true)}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${Math.min(target.scrollHeight, 180)}px`;
                                setIsTyping(target.value.length > 0);
                                target.scrollTop = target.scrollHeight;
                            }}
                            onKeyDown={(e) => { 
                                if (e.key === 'Enter' && !e.shiftKey) { 
                                    e.preventDefault(); 
                                    onFormAction(queryInputRef.current?.value || "");
                                } 
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100/50 dark:border-slate-800/50">
                        <Button type="button" variant="ghost" size="icon" className="h-11 w-11 rounded-full hover:bg-slate-50 transition-colors" onClick={handleNewChat}>
                            <Plus className="h-6 w-6 text-slate-400" />
                        </Button>

                        <div className="flex items-center gap-3">
                             {!isTyping && !isRecording && (
                                <Button type="button" variant="ghost" size="icon" onClick={startRecording} className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800/50 transition-all active:scale-90">
                                    <Mic className="w-5.5 h-5.5 text-primary" />
                                </Button>
                            )}
                            {isRecording && (
                                <Button type="button" variant="ghost" size="icon" onClick={stopRecording} className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-950/50 animate-pulse">
                                    <MicOff className="w-5.5 h-5.5 text-red-500" />
                                </Button>
                            )}
                            {(isTyping) && !isRecording && (
                                <Button onClick={() => onFormAction(queryInputRef.current?.value || "")} disabled={isPending} className="h-14 w-14 rounded-full bg-primary text-white shadow-xl shadow-primary/30 active:scale-90 transition-all duration-300">
                                    {isPending ? <Loader2 className="w-7 h-7 animate-spin" /> : <SendHorizonal className="w-7 h-7" />}
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
