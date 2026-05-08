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
    ShieldPlus,
    Search,
    Zap,
    History,
    Menu,
    Trash2,
    Sparkles,
    Activity,
    Pill,
    BrainCircuit,
    Copy,
    Image as ImageIcon,
    Lightbulb,
    ThumbsUp,
    ThumbsDown,
    ArrowLeft
} from 'lucide-react';
import { healthAssistantAction, speechToTextAction, aiDoctorChatAction } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SidebarTrigger } from '@/components/ui/sidebar';

// Types
type Message = {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  mode?: string;
  timestamp: number;
};

type Session = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  specialty?: string;
};

type PulseMode = 'standard' | 'websearch' | 'deepthink' | 'proanalysis';

const doctorSpecialties = [
  "General Physician", "Cardiologist", "Dermatologist", "Pediatrician",
  "Neurologist", "Oncologist", "Gynecologist", "Orthopedist"
];

const suggestionPool = [
    { label: "Minor burn first aid", query: "What are the first aid steps for a minor burn?", icon: Zap },
    { label: "Keep heart healthy", query: "Give me 5 daily habits to keep my heart healthy.", icon: Sparkles },
    { label: "Check my symptoms", query: "I have a headache and mild fever, what should I do?", icon: Activity },
    { label: "Explain medicine", query: "What are the common side effects of Paracetamol 500mg?", icon: Pill },
];

const initialState = { response: null, error: null, timestamp: 0 };
const initialSpeechState = { transcript: null, error: null };

export default function HealthAssistantPage() {
  const [activeMode, setActiveMode] = useState<'general' | 'doctor'>('general');
  const [historyTab, setHistoryTab] = useState<'general' | 'doctor'>('general');
  const [specialty, setSpecialty] = useState<string>("General Physician");
  const [pulseMode, setPulseMode] = useState<PulseMode>('standard');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  // Immersive Reading Mode State
  const [isInputVisible, setIsInputVisible] = useState(true);
  const lastScrollTop = useRef(0);

  const [generalSessions, setGeneralSessions] = useState<Session[]>([]);
  const [doctorSessions, setDoctorSessions] = useState<Session[]>([]);
  const [activeGeneralId, setActiveGeneralId] = useState<string | null>(null);
  const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);

  const [generalState, generalFormAction, isGeneralPending] = useActionState(healthAssistantAction, initialState);
  const [doctorState, doctorFormAction, isDoctorPending] = useActionState(aiDoctorChatAction, initialState);

  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Track processed timestamps to avoid loops
  const lastProcessedGeneralTime = useRef<number>(0);
  const lastProcessedDoctorTime = useRef<number>(0);

  const isPending = activeMode === 'general' ? isGeneralPending : isDoctorPending;
  const currentSessionId = activeMode === 'general' ? activeGeneralId : activeDoctorId;
  const currentSessions = activeMode === 'general' ? generalSessions : doctorSessions;
  const activeSession = currentSessions.find(s => s.id === currentSessionId);
  const hasMessages = (activeSession?.messages?.length || 0) > 0;

  const currentSuggestions = useMemo(() => {
    return [...suggestionPool].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, []);

  // Sync AI responses with Atomic Timestamps
  useEffect(() => {
    if (!isGeneralPending && generalState.timestamp > lastProcessedGeneralTime.current) {
        lastProcessedGeneralTime.current = generalState.timestamp;
        if (generalState.response || generalState.error) {
            const content = generalState.response || `Error: ${generalState.error}`;
            setGeneralSessions(prev => prev.map(s => s.id === activeGeneralId ? {
                ...s, messages: [...s.messages, { role: 'assistant', content, timestamp: Date.now() }]
            } : s));
        }
    }
  }, [generalState, isGeneralPending, activeGeneralId]);

  useEffect(() => {
    if (!isDoctorPending && doctorState.timestamp > lastProcessedDoctorTime.current) {
        lastProcessedDoctorTime.current = doctorState.timestamp;
        if (doctorState.response || doctorState.error) {
            const content = doctorState.response || `Error: ${doctorState.error}`;
            setDoctorSessions(prev => prev.map(s => s.id === activeDoctorId ? {
                ...s, messages: [...s.messages, { role: 'assistant', content, timestamp: Date.now() }]
            } : s));
        }
    }
  }, [doctorState, isDoctorPending, activeDoctorId]);

  // Initial Data Load (Once on mount)
  useEffect(() => {
    const savedGen = localStorage.getItem('healthAssistantSessions_general');
    const savedDoc = localStorage.getItem('healthAssistantSessions_doctor');
    
    if (savedGen) {
        const parsed = JSON.parse(savedGen);
        setGeneralSessions(parsed);
        if (parsed.length > 0) setActiveGeneralId(parsed[0].id);
    }
    if (savedDoc) {
        const parsed = JSON.parse(savedDoc);
        setDoctorSessions(parsed);
        if (parsed.length > 0) setActiveDoctorId(parsed[0].id);
    }
  }, []);

  // Sync Persistent Storage
  useEffect(() => {
    if (generalSessions.length > 0) localStorage.setItem('healthAssistantSessions_general', JSON.stringify(generalSessions));
    if (doctorSessions.length > 0) localStorage.setItem('healthAssistantSessions_doctor', JSON.stringify(doctorSessions));
  }, [generalSessions, doctorSessions]);

  // Immersive Reading Mode: Hide/Show Footer on Scroll
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || !hasMessages) {
        setIsInputVisible(true);
        return;
    }

    const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
    if (!viewport) return;

    const handleScroll = () => {
        const currentTop = viewport.scrollTop;
        const isAtBottom = Math.abs(viewport.scrollHeight - viewport.clientHeight - currentTop) < 20;

        if (currentTop > lastScrollTop.current && currentTop > 100 && !isAtBottom) {
            setIsInputVisible(false);
        } else {
            setIsInputVisible(true);
        }
        lastScrollTop.current = currentTop;
    };

    viewport.addEventListener('scroll', handleScroll);
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [hasMessages]);

  const handleNewChat = useCallback((modeOverride?: 'general' | 'doctor') => {
    const targetMode = modeOverride || activeMode;
    const id = `session-${Date.now()}`;
    const newSession: Session = {
      id,
      title: targetMode === 'doctor' ? `${specialty}` : 'New Health Chat',
      messages: [],
      createdAt: Date.now(),
      ...(targetMode === 'doctor' && { specialty }),
    };

    if (targetMode === 'general') { 
        setGeneralSessions(prev => [newSession, ...prev]); 
        setActiveGeneralId(id); 
    } else { 
        setDoctorSessions(prev => [newSession, ...prev]); 
        setActiveDoctorId(id); 
    }
    setAttachedImage(null);
    setIsInputVisible(true);
  }, [activeMode, specialty]);

  const onFormAction = (formData: FormData) => {
    const query = (formData.get('query') as string) || '';
    if (!query && !attachedImage) return;

    const userMsg: Message = {
        role: 'user',
        content: query || 'Analyze attached image',
        image: attachedImage || undefined,
        mode: activeMode === 'general' ? pulseMode : undefined,
        timestamp: Date.now()
    };

    let sid = currentSessionId;

    if (!sid || (activeMode === 'doctor' && activeSession?.specialty !== specialty)) {
        sid = `session-${Date.now()}`;
        const newSession: Session = {
            id: sid,
            title: query ? (query.length > 30 ? query.substring(0, 30) + '...' : query) : 'New Chat',
            messages: [userMsg],
            createdAt: Date.now(),
            ...(activeMode === 'doctor' && { specialty }),
        };

        if (activeMode === 'general') {
            setGeneralSessions(prev => [newSession, ...prev]);
            setActiveGeneralId(sid);
        } else {
            setDoctorSessions(prev => [newSession, ...prev]);
            setActiveDoctorId(sid);
        }
    } else {
        const setter = activeMode === 'general' ? setGeneralSessions : setDoctorSessions;
        setter(prev => prev.map(s => s.id === sid ? {
            ...s, 
            messages: [...s.messages, userMsg],
            title: s.messages.length === 0 ? (query.length > 30 ? query.substring(0, 30) + '...' : query) : s.title
        } : s));
    }

    const historyForAi = activeSession ? [...activeSession.messages, userMsg] : [userMsg];
    formData.set('history', JSON.stringify(historyForAi));
    if (attachedImage) formData.set('photoDataUri', attachedImage);

    startTransition(() => {
        if (activeMode === 'doctor') {
            formData.set('specialty', specialty);
            doctorFormAction(formData);
        } else {
            formData.set('mode', pulseMode);
            generalFormAction(formData);
        }
    });

    if (queryInputRef.current) {
        queryInputRef.current.value = '';
        queryInputRef.current.style.height = 'auto';
    }
    setAttachedImage(null);
    setIsTyping(false);
    setIsInputVisible(true);
  };

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [speechState, speechFormAction, isTranscribing] = useActionState(speechToTextAction, initialSpeechState);

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
      mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
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
    } catch (e) { toast({ variant: 'destructive', title: 'Mic Access Denied' }); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [activeSession?.messages, isPending]);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#f8f9fa] dark:bg-[#131314] overflow-hidden fixed inset-0">
        <header className="h-14 border-b border-gray-200 dark:border-[#3c4043] flex items-center justify-between px-4 shrink-0 bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-md z-50">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043]">
                    <Menu className="w-5 h-5 text-gray-600 dark:text-[#c4c7c5]" />
                </SidebarTrigger>
                <div className="h-6 w-px bg-gray-200 dark:bg-[#3c4043] mx-1" />
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg shadow-inner">
                        <ShieldPlus className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex flex-col -space-y-0.5">
                        <h1 className="text-[11px] font-black text-[#2D3A5D] dark:text-slate-100 uppercase tracking-tighter leading-none">AI Health</h1>
                        <p className="text-[8px] font-black text-primary uppercase tracking-[0.25em]">Assistant</p>
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
                        <SheetTitle className="text-primary uppercase font-black text-xs tracking-[0.2em]">History</SheetTitle>
                    </SheetHeader>
                    <div className="px-6 pb-4">
                         <Tabs value={historyTab} onValueChange={(v) => setHistoryTab(v as any)} className="w-full">
                            <TabsList className="grid grid-cols-2 h-9 p-1 bg-gray-100 dark:bg-[#131314] rounded-xl">
                                <TabsTrigger value="general" className="rounded-lg font-bold text-[9px] uppercase">Assistant</TabsTrigger>
                                <TabsTrigger value="doctor" className="rounded-lg font-bold text-[9px] uppercase">Specialists</TabsTrigger>
                            </TabsList>
                         </Tabs>
                    </div>
                    <ScrollArea className="flex-1 p-6 pt-0">
                        <Button variant="outline" className="w-full h-11 rounded-2xl mb-6 font-black uppercase text-[10px] tracking-widest" onClick={() => handleNewChat()}>
                            <Plus className="mr-2 h-4 w-4" /> New Chat
                        </Button>
                        <div className="space-y-2.5 pb-20">
                            {(historyTab === 'general' ? generalSessions : doctorSessions).map(session => (
                                <div key={session.id} 
                                     onClick={() => {
                                         setActiveMode(historyTab);
                                         if (historyTab === 'general') setActiveGeneralId(session.id);
                                         else { setActiveDoctorId(session.id); setSpecialty(session.specialty || "General Physician"); }
                                     }}
                                     className={cn("group p-4 rounded-[1.5rem] border shadow-sm cursor-pointer transition-all active:scale-[0.98] relative", (historyTab === 'general' ? activeGeneralId : activeDoctorId) === session.id ? "bg-primary/5 border-primary/30" : "bg-white/40 dark:bg-[#282a2c] border-transparent hover:bg-gray-50")}>
                                    <div className="pr-8">
                                        <p className="text-xs font-bold truncate dark:text-[#e3e3e3]">{session.title}</p>
                                        <p className="text-[8px] font-black text-gray-400 uppercase mt-1">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-300 hover:text-red-500 rounded-full" onClick={(e) => { e.stopPropagation(); (historyTab === 'general' ? setGeneralSessions : setDoctorSessions)(prev => prev.filter(s => s.id !== session.id)); }}>
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
                    <div className="flex flex-col justify-center items-center px-6 pt-10 pb-32 space-y-10 text-center max-w-sm mx-auto">
                        <div className="space-y-4 flex flex-col items-center">
                            <div className="p-3 bg-white dark:bg-[#1e1f20] rounded-[1.8rem] shadow-xl border border-white/50 animate-in zoom-in-50 duration-700">
                                <ShieldPlus className="w-6 h-6 text-primary drop-shadow-[0_0_10px_rgba(36,136,232,0.3)]" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Hello there</h2>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">AI Health Assistant</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2.5 w-full">
                            {currentSuggestions.map((suggestion, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => {
                                        const fd = new FormData();
                                        fd.set('query', suggestion.query);
                                        onFormAction(fd);
                                    }}
                                    className="flex items-center gap-3 p-3.5 bg-white dark:bg-[#1e1f20] rounded-2xl text-left border border-gray-100 dark:border-transparent hover:border-primary/20 transition-all active:scale-[0.98] group shadow-sm w-full"
                                >
                                    <div className="p-1.5 bg-primary/5 dark:bg-[#131314] rounded-full shrink-0">
                                        <suggestion.icon className="w-3 h-3 text-primary" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-700 dark:text-[#c4c7c5] flex-1 line-clamp-1">{suggestion.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4 w-full">
                             <div className="flex items-center justify-center gap-3">
                                <div className="h-px bg-gray-100 dark:bg-[#3c4043] flex-1" />
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">CONSULT SPECIALISTS</p>
                                <div className="h-px bg-gray-100 dark:bg-[#3c4043] flex-1" />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-4 px-1 scrollbar-hide">
                                {doctorSpecialties.map(spec => (
                                    <Button key={spec} variant="ghost" onClick={() => { setSpecialty(spec); setActiveMode('doctor'); }}
                                            className="h-8 px-4 rounded-full bg-white dark:bg-[#1e1f20] text-[9px] font-black uppercase tracking-widest shadow-sm border border-gray-100 dark:border-[#3c4043] dark:text-[#e3e3e3] whitespace-nowrap active:scale-95 transition-all">
                                        {spec}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            ) : (
                <ScrollArea className="flex-1 px-4 md:px-6 py-6" ref={scrollAreaRef}>
                    <div className="max-w-2xl mx-auto space-y-8 pb-32">
                        {activeSession?.messages.map((m, i) => (
                            <div key={i} className={cn("animate-in fade-in slide-in-from-bottom-2 duration-500", m.role === 'user' ? "flex flex-col items-end" : "flex flex-col items-start")}>
                                {m.role === 'user' ? (
                                    <div className="max-w-[85%] rounded-[1.5rem] rounded-tr-sm bg-[#e9eef6] dark:bg-[#282a2c] px-4 py-2.5 text-gray-900 dark:text-[#e3e3e3] shadow-sm break-words">
                                        {m.image && (
                                            <div className="mb-2 rounded-xl overflow-hidden border border-gray-200">
                                                <Image src={m.image} alt="Attached" width={200} height={200} className="w-full h-auto object-cover" />
                                            </div>
                                        )}
                                        <p className="text-sm font-medium leading-relaxed break-words">{m.content}</p>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3 w-full group">
                                        <div className="mt-1 size-5 shrink-0 flex items-center justify-center bg-primary rounded-lg shadow-sm">
                                            <ShieldPlus className="w-3 h-3 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <article className="prose prose-sm dark:prose-invert max-w-full break-words text-gray-800 dark:text-[#e3e3e3] leading-relaxed font-medium text-[15px]">
                                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                            </article>
                                            
                                            <div className="mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-2">
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
                             <div className="flex items-start gap-3 w-full">
                                <div className="mt-1 size-5 shrink-0 flex items-center justify-center bg-primary/20 rounded-lg animate-pulse">
                                    <ShieldPlus className="w-3 h-3 text-primary" />
                                </div>
                                <div className="space-y-2 flex-1 pt-1 min-w-0">
                                    <div className="h-2 bg-gray-100 dark:bg-[#3c4043] rounded-full w-3/4 animate-pulse" />
                                    <div className="h-2 bg-gray-100 dark:bg-[#3c4043] rounded-full w-1/2 animate-pulse" />
                                    <div className="flex items-center gap-2 mt-4">
                                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                        <span className="text-[8px] font-black uppercase text-gray-400 tracking-[0.2em]">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            )}
        </main>

        <footer className={cn(
            "px-4 pb-8 pt-2 z-40 shrink-0 transition-transform duration-500 ease-in-out",
            !isInputVisible && hasMessages ? "translate-y-[150%]" : "translate-y-0"
        )}>
            <form 
                ref={formRef} 
                action={onFormAction} 
                className="max-w-2xl mx-auto flex flex-col gap-3"
            >
                {attachedImage && (
                    <div className="mx-2 mb-1 flex animate-in zoom-in-95">
                        <div className="relative group/thumb">
                            <Image src={attachedImage} alt="Preview" width={80} height={80} className="rounded-xl border border-gray-200 dark:border-[#3c4043] shadow-lg object-cover" />
                            <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg" onClick={() => setAttachedImage(null)}>
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                )}

                <div className="relative flex flex-col rounded-[28px] bg-white dark:bg-[#1e1f20] shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] transition-all p-2 border border-transparent focus-within:border-gray-200 dark:focus-within:border-[#3c4043]">
                    <div className="flex-1 max-h-48 overflow-y-auto">
                        <Textarea
                            ref={queryInputRef}
                            name="query"
                            placeholder={activeMode === 'doctor' ? `Ask ${specialty}` : "Ask Medical Partner"}
                            className="w-full min-h-[44px] max-h-[160px] px-3 py-2 border-none bg-transparent shadow-none focus-visible:ring-0 font-medium text-[15px] text-gray-800 dark:text-[#e3e3e3] placeholder:text-gray-500 resize-none"
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
                                    const formData = new FormData(formRef.current!);
                                    onFormAction(formData);
                                } 
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-50 dark:border-[#3c4043]">
                        <div className="flex items-center gap-1">
                            <Button type="button" variant="ghost" size="icon" onClick={() => queryInputRef.current?.closest('body')?.querySelector<HTMLInputElement>('#file-upload')?.click()} className="h-9 w-9 rounded-full">
                                <Plus className="h-5 w-5 text-gray-400" />
                            </Button>
                            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const r = new FileReader();
                                    r.onload = (ev) => setAttachedImage(ev.target?.result as string);
                                    r.readAsDataURL(file);
                                }
                            }} />

                            {activeMode === 'general' && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button type="button" variant="ghost" className="h-9 px-3 rounded-full gap-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                            <Zap className="h-3.5 w-3.5 text-primary" />
                                            <span className="hidden sm:inline">Modes</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-56 rounded-2xl p-2 mb-4 bg-white dark:bg-[#1e1f20] border-none shadow-2xl" side="top" align="start">
                                        <RadioGroup value={pulseMode} onValueChange={(v) => setPulseMode(v as PulseMode)} className="gap-1">
                                            <PulseModeItem value="standard" label="Balanced" icon={<ShieldPlus className="w-3 h-3"/>} />
                                            <PulseModeItem value="websearch" label="Deep Search" icon={<Search className="w-3 h-3"/>} />
                                            <PulseModeItem value="deepthink" label="Logic Think" icon={<BrainCircuit className="w-3 h-3"/>} />
                                            <PulseModeItem value="proanalysis" label="Pharmacist" icon={<Pill className="w-3 h-3"/>} />
                                        </RadioGroup>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                             {!isTyping && !isRecording && !attachedImage && (
                                <Button type="button" variant="ghost" size="icon" onClick={startRecording} className="h-9 w-9 rounded-full">
                                    <Mic className="w-4 h-4 text-gray-400" />
                                </Button>
                            )}
                            {(isTyping || isRecording || attachedImage) && (
                                <div className="flex items-center gap-2">
                                    {isRecording && (
                                        <Button type="button" size="icon" onClick={stopRecording} className="h-9 w-9 rounded-full bg-red-500 text-white animate-pulse">
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
                <p className="text-[7px] text-center text-gray-400 uppercase tracking-widest mt-1">Medical Partner may display inaccurate info.</p>
            </form>
        </footer>
    </div>
  );
}

function PulseModeItem({ value, label, icon }: { value: PulseMode, label: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#282a2c] transition-all has-[:checked]:bg-primary/5 group cursor-pointer border border-transparent has-[:checked]:border-primary/20">
            <RadioGroupItem value={value} id={value} className="sr-only" />
            <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-[#131314] shadow-sm">
                {icon}
            </div>
            <Label htmlFor={value} className="flex-1 cursor-pointer font-bold text-[9px] text-gray-700 dark:text-[#e3e3e3] uppercase tracking-wider">
                {label}
            </Label>
        </div>
    )
}
