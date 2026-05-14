
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
    ThumbsUp,
    Globe,
    Clock,
    ShieldCheck,
    MessageCircle,
    NotebookPen,
    Square,
    ThumbsDown
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
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);

  const [state, formAction, isPending] = useActionState(aiPsychiatristAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const hasMessages = (activeSession?.messages?.length || 0) > 0;

  // Initial Data Load
  useEffect(() => {
    const saved = localStorage.getItem('mindCompanionSessions_v3');
    if (saved) setSessions(JSON.parse(saved));
    setActiveSessionId(null);
  }, []);

  // Sync Persistent Storage
  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('mindCompanionSessions_v3', JSON.stringify(sessions));
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

  const handleToggleSpeech = (text: string, msgId: number) => {
    if (!window.speechSynthesis) return;
    if (speakingMsgId === msgId) { window.speechSynthesis.cancel(); setSpeakingMsgId(null); return; }
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*#_`]/g, '').trim();
    const u = new SpeechSynthesisUtterance(clean);
    u.onstart = () => setSpeakingMsgId(msgId); u.onend = () => setSpeakingMsgId(null);
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] overflow-hidden fixed inset-0 font-body">
        <header className="h-16 border-b border-gray-100 dark:border-[#3c4043] flex items-center justify-between px-4 shrink-0 bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-xl z-50">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="h-10 w-10 rounded-2xl hover:bg-white/50 dark:hover:bg-[#3c4043] shadow-sm border border-white/20">
                    <Menu className="w-5 h-5 text-gray-600 dark:text-[#c4c7c5]" />
                </SidebarTrigger>
                <div className="h-6 w-px bg-gray-200 dark:bg-[#3c4043] mx-1" />
                <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 rounded-xl shadow-inner">
                        <BrainCircuit className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col -space-y-0.5">
                        <h1 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tighter leading-none">Mind</h1>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.25em]">Companion</p>
                    </div>
                </div>
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="rounded-full h-10 px-4 gap-2 bg-white/50 dark:bg-slate-800/50 border-white/40 shadow-sm group">
                        <History className="w-4 h-4 text-primary group-hover:rotate-[-10deg] transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Journal</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-sm p-0 border-none rounded-l-[2.5rem] shadow-2xl flex flex-col bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl">
                    <SheetHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3">
                            <NotebookPen className="w-5 h-5 text-primary" />
                            <SheetTitle className="text-primary uppercase font-black text-xs tracking-[0.2em]">Personal Journal</SheetTitle>
                        </div>
                    </SheetHeader>
                    <ScrollArea className="flex-1 p-8 pt-0">
                        <Button variant="outline" className="w-full h-12 rounded-2xl mb-8 font-black uppercase text-[10px] tracking-widest border-primary/20 hover:bg-primary/5 transition-all" onClick={handleNewChat}>
                            <Plus className="mr-2 h-4 w-4" /> Start Fresh
                        </Button>
                        <div className="space-y-3 pb-20">
                            {sessions.length > 0 ? (
                                sessions.map(session => (
                                    <div key={session.id} 
                                         onClick={() => { setActiveSessionId(session.id); setSuggestedChips([]); }}
                                         className={cn("group p-5 rounded-[2rem] border shadow-sm cursor-pointer transition-all active:scale-[0.98] relative overflow-hidden", activeSessionId === session.id ? "bg-primary/5 border-primary/30" : "bg-white/40 dark:bg-[#282a2c]/40 border-transparent hover:bg-white/60")}>
                                        <div className="pr-8">
                                            <p className="text-xs font-bold truncate dark:text-[#e3e3e3]">{session.title}</p>
                                            <p className="text-[8px] font-black text-gray-400 uppercase mt-1.5 flex items-center gap-1.5">
                                                <Clock className="w-2.5 h-2.5" />
                                                {formatDistanceToNow(session.createdAt, { addSuffix: true })}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-300 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors" onClick={(e) => { e.stopPropagation(); setSessions(prev => prev.filter(s => s.id !== session.id)); if(activeSessionId === session.id) setActiveSessionId(null); }}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 opacity-40">
                                    <p className="text-[10px] font-black uppercase tracking-widest">No entries yet</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </header>

        <main className="flex-1 overflow-hidden relative flex flex-col w-full max-w-4xl mx-auto">
            {!hasMessages && !isPending ? (
                <ScrollArea className="flex-1 w-full">
                    <div className="flex flex-col justify-center items-center px-6 pt-24 pb-32 space-y-12 text-center max-w-sm mx-auto animate-in fade-in duration-1000">
                        <div className="space-y-8 flex flex-col items-center">
                            <div className="p-6 bg-white dark:bg-[#1e1f20] rounded-[3rem] shadow-2xl border border-white/50 relative group">
                                <Sparkles className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(36,136,232,0.4)] group-hover:rotate-12 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-primary/5 rounded-[3rem] animate-pulse" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-4xl font-black text-[#1A365D] dark:text-white tracking-tight leading-tight">How is your <span className="text-primary">heart?</span></h2>
                                <p className="text-sm font-bold text-slate-400 leading-relaxed px-4">I'm right here in your private space, ready to listen without judgment.</p>
                            </div>
                        </div>
                        <Button className="rounded-full h-16 px-12 font-black uppercase text-[11px] tracking-[0.2em] shadow-[0_15px_30px_-5px_rgba(36,136,232,0.3)] active:scale-95 transition-all bg-primary hover:bg-primary/90" onClick={handleNewChat}>
                           Open My Heart
                        </Button>
                    </div>
                </ScrollArea>
            ) : (
                <ScrollArea className="flex-1 px-4 md:px-8 py-10" ref={scrollAreaRef}>
                    <div className="max-w-4xl mx-auto space-y-16 pb-64">
                        {activeSession?.messages.map((m, i) => {
                            return (
                                <div 
                                    key={i} 
                                    className={cn(
                                        "animate-in fade-in slide-in-from-bottom-6 duration-700", 
                                        m.role === 'user' ? "flex flex-col items-end" : "flex flex-col items-start"
                                    )}
                                >
                                    {m.role === 'user' ? (
                                        <div 
                                            className="max-w-[85%] md:max-w-[70%] bg-primary text-white px-7 py-4 shadow-xl shadow-primary/10 overflow-hidden rounded-[2.2rem] rounded-tr-sm" 
                                            style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                                        >
                                            <p className="text-[15px] md:text-[17px] font-bold leading-relaxed">{m.content}</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-start w-full group">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="size-9 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-700">
                                                    <Sparkles className="w-4.5 h-4.5 text-primary" />
                                                </div>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mind Companion</span>
                                            </div>

                                            <div className="flex-1 w-full min-w-0">
                                                <article className="prose prose-sm md:prose-lg dark:prose-invert max-w-full text-slate-800 dark:text-[#e3e3e3] leading-loose font-medium px-1" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                                                    <ReactMarkdown>{m.content}</ReactMarkdown>
                                                </article>
                                                
                                                <div className="mt-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-1">
                                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-full transition-all border border-slate-100 dark:border-slate-800", speakingMsgId === i ? "bg-primary text-white" : "bg-white/40 dark:bg-slate-800/40 shadow-sm")} onClick={() => handleToggleSpeech(m.content, i)}>
                                                        {speakingMsgId === i ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white/40 dark:bg-slate-800/40 shadow-sm border border-slate-100 dark:border-slate-800" onClick={() => { navigator.clipboard.writeText(m.content); toast({title: "Copied to clipboard"}); }}>
                                                        <Copy className="w-4 h-4 text-slate-400" />
                                                    </Button>
                                                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white/40 dark:bg-slate-800/40 shadow-sm border border-slate-100 dark:border-slate-800"><ThumbsUp className="w-4 h-4 text-slate-400" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white/40 dark:bg-slate-800/40 shadow-sm border border-slate-100 dark:border-slate-800"><ThumbsDown className="w-4 h-4 text-slate-400" /></Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {isPending && (
                             <div className="flex flex-col items-start gap-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="size-9 flex items-center justify-center bg-primary/10 rounded-full animate-pulse">
                                        <Sparkles className="w-4.5 h-4.5 text-primary" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Listening...</span>
                                        <div className="flex items-center gap-1.5 bg-blue-50/50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                                            <Clock className="w-2.5 h-2.5 text-primary" />
                                            <span className="text-[10px] font-black tabular-nums text-primary">{loadingTimer}s</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 w-full max-w-lg">
                                    <div className="flex items-center gap-2 px-1">
                                        <Globe className="w-4 h-4 text-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Cross-checking Empathy Data</span>
                                    </div>
                                    
                                    <div className="relative h-14 overflow-hidden bg-white/40 dark:bg-[#131314]/40 rounded-2xl border border-dashed border-slate-200 dark:border-[#3c4043] flex items-center px-5">
                                        <div key={currentSourceIndex} className="flex items-center gap-3 animate-in slide-in-from-bottom-3 fade-in duration-500 w-full">
                                            <Sparkles className="w-4 h-4 text-yellow-500 shrink-0" />
                                            <p className="text-[11px] md:text-sm font-bold text-slate-600 dark:text-[#c4c7c5] truncate">
                                                Checking: <span className="text-primary">{mentalHealthSources[currentSourceIndex]}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 pt-2">
                                        <div className="h-3 bg-slate-200/50 dark:bg-slate-800/50 rounded-full w-full animate-pulse" />
                                        <div className="h-3 bg-slate-200/50 dark:bg-slate-800/50 rounded-full w-2/3 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Suggestion Chips */}
                        {suggestionChips.length > 0 && !isPending && (
                            <div className="flex flex-wrap gap-3 pt-10 justify-start animate-in fade-in slide-in-from-left-6 duration-700">
                                {suggestionChips.map((chip, idx) => (
                                    <Button 
                                        key={idx} 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-full border-primary/10 bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-sm hover:bg-primary hover:text-white hover:border-primary text-[11px] font-black text-primary px-8 h-12 transition-all active:scale-95 shadow-xl shadow-primary/5"
                                        onClick={() => onFormAction(chip)}
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2.5 opacity-70" />
                                        {chip}
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            )}
        </main>

        {/* Floating Input Footer - Absolute Positioning to prevent layout ghost space */}
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out px-4 pb-10",
            !isInputVisible && hasMessages ? "translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"
        )}>
            <form ref={formRef} action={onFormAction} className="max-w-3xl mx-auto flex flex-col gap-4">
                <div className="relative flex flex-col rounded-[2.5rem] bg-white/90 dark:bg-[#1e1f20]/90 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] transition-all p-3 border border-white dark:border-[#3c4043] focus-within:ring-4 focus-within:ring-primary/10">
                    <div className="flex items-center justify-between px-5 mb-2">
                        <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            Private Safe Space
                        </div>
                        {activeSession?.mood && (
                            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 rounded-full border border-primary/10 shadow-sm">
                                <Activity className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest">{activeSession.mood}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 max-h-48 overflow-y-auto">
                        <Textarea
                            ref={queryInputRef}
                            name="query"
                            placeholder="Tell me whatever's on your heart..."
                            className="w-full min-h-[50px] max-h-[160px] px-5 py-3 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-[17px] text-slate-800 dark:text-[#e3e3e3] placeholder:text-slate-400 resize-none"
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

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/80 dark:border-[#3c4043]">
                        <div className="flex items-center gap-1.5">
                             <Button type="button" variant="ghost" size="icon" className="h-11 w-11 rounded-full hover:bg-primary/5" onClick={handleNewChat}>
                                <Plus className="h-6 w-6 text-slate-500" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-3">
                             {!isTyping && !isRecording && (
                                <Button type="button" variant="ghost" size="icon" onClick={startRecording} className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800">
                                    <Mic className="w-5 h-5 text-primary" />
                                </Button>
                            )}
                            {(isTyping || isRecording) && (
                                <div className="flex items-center gap-3">
                                    {isRecording && (
                                        <Button type="button" size="icon" onClick={() => { if(mediaRecorderRef.current) mediaRecorderRef.current.stop(); setIsRecording(false); }} className="h-12 w-12 rounded-full bg-red-500 text-white animate-pulse border-4 border-red-100">
                                            <MicOff className="w-5 h-5" />
                                        </Button>
                                    )}
                                    <Button 
                                        type="submit"
                                        disabled={isPending} 
                                        className="h-12 w-12 rounded-full bg-primary text-white transition-all hover:scale-105 shadow-lg shadow-primary/20"
                                    >
                                        {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <SendHorizonal className="w-6 h-6" />}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <p className="text-[9px] text-center text-slate-400 font-black uppercase tracking-widest mt-2">Mind Companion is here to support, not diagnose.</p>
            </form>
        </div>
    </div>
  );
}
