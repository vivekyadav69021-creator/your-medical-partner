
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
    ArrowLeft,
    Globe,
    Clock,
    Square
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

const medicalSources = [
  "WHO",
  "Mayo Clinic",
  "Harvard Health",
  "Johns Hopkins",
  "AIIMS India",
  "NHS UK",
  "The Lancet",
  "Cleveland Clinic"
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
  
  // TTS State
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);

  // Immersive Reading Mode State
  const [isInputVisible, setIsInputVisible] = useState(true);
  const lastScrollTop = useRef(0);

  // Loading UI Enhancement States
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

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

  // Sync AI responses
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

  // Loading UI Logic
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    let sourceInterval: NodeJS.Timeout;

    if (isPending) {
      setLoadingTimer(0);
      setCurrentSourceIndex(0);
      timerInterval = setInterval(() => setLoadingTimer(prev => prev + 1), 1000);
      sourceInterval = setInterval(() => setCurrentSourceIndex(prev => (prev + 1) % medicalSources.length), 2500);
    }

    return () => {
      clearInterval(timerInterval);
      clearInterval(sourceInterval);
    };
  }, [isPending]);

  // Initial Data Load
  useEffect(() => {
    const savedGen = localStorage.getItem('healthAssistantSessions_general');
    const savedDoc = localStorage.getItem('healthAssistantSessions_doctor');
    if (savedGen) setGeneralSessions(JSON.parse(savedGen));
    if (savedDoc) setDoctorSessions(JSON.parse(savedDoc));
    setActiveGeneralId(null);
    setActiveDoctorId(null);
  }, []);

  // Sync Persistent Storage
  useEffect(() => {
    if (generalSessions.length > 0) localStorage.setItem('healthAssistantSessions_general', JSON.stringify(generalSessions));
    if (doctorSessions.length > 0) localStorage.setItem('healthAssistantSessions_doctor', JSON.stringify(doctorSessions));
  }, [generalSessions, doctorSessions]);

  // Immersive Reading Mode: Detect Scroll
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
    const clean = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1').replace(/[*#_`]/g, '').trim();
    const u = new SpeechSynthesisUtterance(clean);
    u.rate = 0.95; u.onstart = () => setSpeakingMsgId(msgId); u.onend = () => setSpeakingMsgId(null);
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
                        <ShieldPlus className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col -space-y-0.5">
                        <h1 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tighter leading-none">AI Health</h1>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.25em]">Assistant</p>
                    </div>
                </div>
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 hover:bg-white/50 dark:hover:bg-slate-800/50">
                        <History className="w-5 h-5 text-gray-500 dark:text-[#9aa0a6]" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-sm p-0 border-none rounded-l-[2rem] shadow-2xl flex flex-col bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl">
                    <SheetHeader className="p-8 pb-2">
                        <SheetTitle className="text-primary uppercase font-black text-xs tracking-[0.2em]">Medical Records</SheetTitle>
                    </SheetHeader>
                    <div className="px-8 pb-4">
                         <Tabs value={historyTab} onValueChange={(v) => setHistoryTab(v as any)} className="w-full">
                            <TabsList className="grid grid-cols-2 h-10 p-1 bg-gray-100/50 dark:bg-[#131314]/50 rounded-xl backdrop-blur-md">
                                <TabsTrigger value="general" className="rounded-lg font-bold text-[10px] uppercase">Assistant</TabsTrigger>
                                <TabsTrigger value="doctor" className="rounded-lg font-bold text-[10px] uppercase">Specialists</TabsTrigger>
                            </TabsList>
                         </Tabs>
                    </div>
                    <ScrollArea className="flex-1 p-8 pt-0">
                        <Button variant="outline" className="w-full h-12 rounded-2xl mb-8 font-black uppercase text-[10px] tracking-widest border-primary/20 hover:bg-primary/5 transition-all" onClick={() => handleNewChat()}>
                            <Plus className="mr-2 h-4 w-4" /> Start Fresh
                        </Button>
                        <div className="space-y-3 pb-20">
                            {(historyTab === 'general' ? generalSessions : doctorSessions).map(session => (
                                <div key={session.id} 
                                     onClick={() => {
                                         setActiveMode(historyTab);
                                         if (historyTab === 'general') setActiveGeneralId(session.id);
                                         else { setActiveDoctorId(session.id); setSpecialty(session.specialty || "General Physician"); }
                                     }}
                                     className={cn("group p-5 rounded-[2rem] border shadow-sm cursor-pointer transition-all active:scale-[0.98] relative", (historyTab === 'general' ? activeGeneralId : activeDoctorId) === session.id ? "bg-primary/5 border-primary/30" : "bg-white/40 dark:bg-[#282a2c]/40 border-transparent hover:bg-white/60")}>
                                    <div className="pr-8">
                                        <p className="text-xs font-bold truncate dark:text-[#e3e3e3]">{session.title}</p>
                                        <p className="text-[8px] font-black text-gray-400 uppercase mt-1.5 flex items-center gap-1.5">
                                            <Clock className="w-2.5 h-2.5" />
                                            {formatDistanceToNow(session.createdAt, { addSuffix: true })}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-300 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors" onClick={(e) => { e.stopPropagation(); (historyTab === 'general' ? setGeneralSessions : setDoctorSessions)(prev => prev.filter(s => s.id !== session.id)); }}>
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
                    <div className="flex flex-col justify-center items-center px-6 pt-10 pb-32 space-y-12 text-center max-w-sm mx-auto">
                        <div className="space-y-6 flex flex-col items-center">
                            <div className="p-6 bg-white dark:bg-[#1e1f20] rounded-[3rem] shadow-2xl border border-white/50 relative group">
                                <ShieldPlus className="w-12 h-12 text-primary drop-shadow-[0_0_15px_rgba(36,136,232,0.4)] transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-primary/5 rounded-[3rem] animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-[#1A365D] dark:text-white tracking-tight">How can I help?</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Global Medical Intelligence</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            {currentSuggestions.map((suggestion, idx) => (
                                <button key={idx} onClick={() => { const fd = new FormData(); fd.set('query', suggestion.query); onFormAction(fd); }}
                                    className="flex items-center gap-4 p-5 bg-white/60 dark:bg-[#1e1f20]/60 backdrop-blur-md rounded-[2rem] text-left border border-white/40 dark:border-[#3c4043] hover:border-primary/30 hover:bg-white/80 transition-all active:scale-[0.98] group shadow-sm w-full">
                                    <div className="p-2 bg-primary/10 dark:bg-[#131314] rounded-xl shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <suggestion.icon className="w-4 h-4 text-primary group-hover:text-white" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-700 dark:text-[#c4c7c5] flex-1 line-clamp-1">{suggestion.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-6 w-full pt-4">
                             <div className="flex items-center justify-center gap-4 px-8">
                                <div className="h-px bg-slate-200 dark:bg-[#3c4043] flex-1" />
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] whitespace-nowrap">Expert Specialists</p>
                                <div className="h-px bg-slate-200 dark:bg-[#3c4043] flex-1" />
                            </div>
                            <div className="flex gap-2.5 overflow-x-auto pb-4 px-2 scrollbar-hide">
                                {doctorSpecialties.map(spec => (
                                    <Button key={spec} variant="outline" onClick={() => { setSpecialty(spec); setActiveMode('doctor'); }}
                                            className="h-10 px-6 rounded-full bg-white/60 dark:bg-[#1e1f20]/60 text-[10px] font-black uppercase tracking-widest shadow-sm border-white/50 dark:border-[#3c4043] dark:text-[#e3e3e3] whitespace-nowrap active:scale-95 transition-all hover:bg-primary hover:text-white hover:border-primary">
                                        {spec}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            ) : (
                <ScrollArea className="flex-1 px-4 md:px-6 py-8" ref={scrollAreaRef}>
                    <div className="max-w-3xl mx-auto space-y-12 pb-48">
                        {activeSession?.messages.map((m, i) => (
                            <div key={i} className={cn("animate-in fade-in slide-in-from-bottom-4 duration-700", m.role === 'user' ? "flex flex-col items-end" : "flex flex-col items-start")}>
                                {m.role === 'user' ? (
                                    <div className="max-w-[85%] rounded-[2.2rem] rounded-tr-sm bg-primary text-white px-7 py-4 shadow-xl shadow-primary/10 overflow-hidden" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                                        {m.image && (
                                            <div className="mb-4 rounded-[1.5rem] overflow-hidden border-2 border-white/20 shadow-lg">
                                                <Image src={m.image} alt="Attached" width={300} height={300} className="w-full h-auto object-cover" />
                                            </div>
                                        )}
                                        <p className="text-[15px] font-bold leading-relaxed">{m.content}</p>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-4 w-full group min-w-0">
                                        <div className="mt-2 size-8 shrink-0 flex items-center justify-center bg-primary rounded-xl shadow-lg shadow-primary/20">
                                            <ShieldPlus className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <article className="prose prose-sm md:prose-base dark:prose-invert max-w-full text-slate-800 dark:text-[#e3e3e3] leading-relaxed font-bold text-[16px] py-1 px-2" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                            </article>
                                            
                                            <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-2">
                                                <Button variant="ghost" size="icon" className={cn("h-9 w-9 rounded-full transition-all", speakingMsgId === i ? "bg-primary text-white" : "bg-white/40 dark:bg-slate-800/40 shadow-sm")} onClick={() => handleToggleSpeech(m.content, i)}>
                                                    {speakingMsgId === i ? <Square className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/40 dark:bg-slate-800/40 shadow-sm" onClick={() => { navigator.clipboard.writeText(m.content); toast({title: "Copied to clipboard"}); }}>
                                                    <Copy className="w-4 h-4 text-slate-400" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/40 dark:bg-slate-800/40 shadow-sm"><ThumbsUp className="w-4 h-4 text-slate-400" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isPending && (
                             <div className="flex items-start gap-4 w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="mt-1.5 size-8 shrink-0 flex items-center justify-center bg-primary/20 rounded-xl animate-pulse">
                                    <ShieldPlus className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 pt-1 min-w-0">
                                    <div className="bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-xl p-5 rounded-[2rem] rounded-tl-sm border border-white dark:border-[#3c4043] space-y-4 max-w-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.1em]">
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                <span>Assistant processing...</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-blue-50/50 dark:bg-blue-900/20 px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800">
                                                <Clock className="w-2.5 h-2.5 text-primary" />
                                                <span className="text-[10px] font-black tabular-nums text-primary">{loadingTimer}s</span>
                                            </div>
                                        </div>

                                        <div className="h-px bg-gray-100/50 dark:bg-[#3c4043]" />

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                                                <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.1em]">Verifying Evidence</span>
                                            </div>
                                            
                                            <div className="relative h-10 overflow-hidden bg-white/40 dark:bg-[#131314]/40 rounded-xl border border-dashed border-slate-200 dark:border-[#3c4043] flex items-center px-4">
                                                <div key={currentSourceIndex} className="flex items-center gap-2.5 animate-in slide-in-from-bottom-2 fade-in duration-500 w-full">
                                                    <Sparkles className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                                                    <p className="text-[10px] font-bold text-slate-600 dark:text-[#c4c7c5] truncate">
                                                        Checking: <span className="text-primary">{medicalSources[currentSourceIndex]}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            )}
        </main>

        {/* Floating Input Footer - Absolute Positioning to prevent layout ghost space */}
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ease-in-out px-4 pb-10",
            !isInputVisible && hasMessages ? "translate-y-[120%]" : "translate-y-0"
        )}>
            <form ref={formRef} action={onFormAction} className="max-w-2xl mx-auto flex flex-col gap-4">
                {attachedImage && (
                    <div className="mx-4 mb-1 flex animate-in zoom-in-95">
                        <div className="relative group/thumb">
                            <Image src={attachedImage} alt="Preview" width={100} height={100} className="rounded-[1.5rem] border-4 border-white dark:border-[#3c4043] shadow-2xl object-cover" />
                            <Button variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7 rounded-full shadow-lg" onClick={() => setAttachedImage(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
                <div className="relative flex flex-col rounded-[2.5rem] bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.12)] transition-all p-3 border border-white dark:border-[#3c4043] focus-within:ring-4 focus-within:ring-primary/5">
                    <div className="flex-1 max-h-48 overflow-y-auto">
                        <Textarea ref={queryInputRef} name="query" placeholder={activeMode === 'doctor' ? `Discuss with ${specialty}...` : "Ask health questions..."}
                            className="w-full min-h-[50px] max-h-[160px] px-4 py-2 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-[16px] text-slate-800 dark:text-[#e3e3e3] placeholder:text-slate-400 resize-none" rows={1}
                            onInput={(e) => { const target = e.target as HTMLTextAreaElement; target.style.height = 'auto'; target.style.height = `${target.scrollHeight}px`; setIsTyping(target.value.length > 0); }}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onFormAction(new FormData(formRef.current!)); } }} />
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50 dark:border-[#3c4043]">
                        <div className="flex items-center gap-1.5">
                            <Button type="button" variant="ghost" size="icon" onClick={() => queryInputRef.current?.closest('body')?.querySelector<HTMLInputElement>('#file-upload')?.click()} className="h-10 w-10 rounded-full hover:bg-primary/5">
                                <Plus className="h-6 w-6 text-slate-400" />
                            </Button>
                            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const r = new FileReader(); r.onload = (ev) => setAttachedImage(ev.target?.result as string); r.readAsDataURL(file); } }} />
                            {activeMode === 'general' && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button type="button" variant="ghost" className="h-10 px-4 rounded-full gap-2.5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/50">
                                            <Zap className="h-4 w-4 text-primary" />
                                            <span className="hidden sm:inline">Advanced Modes</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-64 rounded-[2rem] p-3 mb-6 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl border-none shadow-2xl" side="top" align="start">
                                        <RadioGroup value={pulseMode} onValueChange={(v) => setPulseMode(v as PulseMode)} className="gap-1.5">
                                            <PulseModeItem value="standard" label="Balanced Expert" icon={<ShieldPlus className="w-4 h-4"/>} />
                                            <PulseModeItem value="websearch" label="Deep Web Search" icon={<Search className="w-4 h-4"/>} />
                                            <PulseModeItem value="deepthink" label="Logical Reasoning" icon={<BrainCircuit className="w-4 h-4"/>} />
                                            <PulseModeItem value="proanalysis" label="Pharmacist Analysis" icon={<Pill className="w-4 h-4"/>} />
                                        </RadioGroup>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                        <div className="flex items-center gap-2.5">
                             {!isTyping && !isRecording && !attachedImage && (
                                <Button type="button" variant="ghost" size="icon" onClick={startRecording} className="h-11 w-11 rounded-full bg-slate-50 dark:bg-slate-800">
                                    <Mic className="w-5 h-5 text-primary" />
                                </Button>
                            )}
                            {(isTyping || isRecording || attachedImage) && (
                                <div className="flex items-center gap-2.5">
                                    {isRecording && (
                                        <Button type="button" size="icon" onClick={() => { if(mediaRecorderRef.current) mediaRecorderRef.current.stop(); setIsRecording(false); }} className="h-11 w-11 rounded-full bg-red-500 text-white animate-pulse border-4 border-red-100">
                                            <MicOff className="w-5 h-5" />
                                        </Button>
                                    )}
                                    <Button type="submit" disabled={isPending} className="h-11 w-11 rounded-full bg-primary text-white transition-all hover:scale-105 shadow-lg shadow-primary/20">
                                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <SendHorizonal className="w-5 h-5" />}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
}

function PulseModeItem({ value, label, icon }: { value: PulseMode, label: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center space-x-3.5 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#282a2c] transition-all has-[:checked]:bg-primary/10 group cursor-pointer border border-transparent has-[:checked]:border-primary/20">
            <RadioGroupItem value={value} id={value} className="sr-only" />
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#131314] shadow-sm group-has-[:checked]:bg-white dark:group-has-[:checked]:bg-slate-900">
                {icon}
            </div>
            <Label htmlFor={value} className="flex-1 cursor-pointer font-black text-[10px] text-slate-600 dark:text-[#e3e3e3] uppercase tracking-widest">
                {label}
            </Label>
        </div>
    )
}
