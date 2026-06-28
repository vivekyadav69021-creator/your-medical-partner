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
    X, 
    Volume2, 
    ShieldPlus,
    Search,
    History,
    Menu,
    Sparkles,
    Activity,
    Pill,
    BrainCircuit,
    Copy,
    Stethoscope,
    HeartPulse,
    StopCircle,
    UserCircle2,
    CheckCircle2,
    ChevronLeft,
    ShieldCheck,
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
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Types
type Message = {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  mode?: PulseMode;
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

const modeConfig = {
    standard: { label: "Standard", icon: ShieldPlus, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    websearch: { label: "Web Search", icon: Search, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    deepthink: { label: "Deep Think", icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    proanalysis: { label: "Pro Analysis", icon: Pill, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
};

const doctorSpecialties = [
  { name: "General Physician", icon: Stethoscope, desc: "Primary health & wellness", color: "text-blue-500", bg: "bg-blue-50/50" },
  { name: "Cardiologist", icon: HeartPulse, desc: "Heart & blood circulation", color: "text-red-500", bg: "bg-red-50/50" },
  { name: "Dermatologist", icon: Sparkles, desc: "Skin, hair & nail care", color: "text-pink-500", bg: "bg-pink-50/50" },
  { name: "Pediatrician", icon: UserCircle2, desc: "Infant & child health", color: "text-orange-500", bg: "bg-orange-50/50" },
  { name: "Neurologist", icon: BrainCircuit, desc: "Brain & nervous system", color: "text-purple-500", bg: "bg-purple-50/50" },
  { name: "Orthopedist", icon: Activity, desc: "Bones, joints & muscles", color: "text-emerald-500", bg: "bg-emerald-50/50" },
];

const suggestionPool = [
    { label: "Minor burn steps", query: "What are the first aid steps for a minor burn?", icon: Activity },
    { label: "Heart health tips", query: "Give me daily habits for a healthy heart.", icon: Sparkles },
    { label: "Check symptoms", query: "I have a headache and mild fever, advice?", icon: Stethoscope },
    { label: "Explain medicine", query: "What are common side effects of Paracetamol?", icon: Pill },
];

const medicalSources = ["World Health Organization", "Mayo Clinic", "Harvard Health", "Johns Hopkins", "AIIMS India", "NHS UK"];

const initialState = { response: null, error: null, timestamp: 0 };
const initialSpeechState = { transcript: null, error: null };

export default function HealthAssistantPage() {
  const [activeMode, setActiveMode] = useState<'general' | 'doctor'>('general');
  const [historyTab, setHistoryTab] = useState<'general' | 'doctor'>('general');
  const [specialty, setSpecialty] = useState<string>("General Physician");
  const [pulseMode, setPulseMode] = useState<PulseMode>('standard');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const [isInputVisible, setIsInputVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const [loadingTimer, setLoadingTimer] = useState(0);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);
  const [isManuallyStopped, setIsManuallyStopped] = useState(false);

  const [generalSessions, setGeneralSessions] = useState<Session[]>([]);
  const [doctorSessions, setDoctorSessions] = useState<Session[]>([]);
  const [activeGeneralId, setActiveGeneralId] = useState<string | null>(null);
  const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);

  const [generalState, generalFormAction, isGeneralPending] = useActionState(healthAssistantAction, initialState);
  const [doctorState, doctorFormAction, isDoctorPending] = useActionState(aiDoctorChatAction, initialState);

  const { toast } = useToast();
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const isPending = (activeMode === 'general' ? isGeneralPending : isDoctorPending) && !isManuallyStopped;
  const currentSessionId = activeMode === 'general' ? activeGeneralId : activeDoctorId;
  const currentSessions = activeMode === 'general' ? generalSessions : doctorSessions;
  const activeSession = currentSessions.find(s => s.id === currentSessionId);
  const hasMessages = (activeSession?.messages?.length || 0) > 0;

  // Immersive Scroll Logic
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || !hasMessages) { setIsInputVisible(true); return; }
    const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
    if (!viewport) return;

    const handleScroll = () => {
        const currentTop = viewport.scrollTop;
        if (Math.abs(currentTop - lastScrollTop.current) < 20) return;
        
        const isAtBottom = Math.abs(viewport.scrollHeight - viewport.clientHeight - currentTop) < 60;
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

  // Sync state to message list when action completes
  useEffect(() => {
    if (!isGeneralPending && generalState.timestamp > 0) {
        if (!isManuallyStopped && (generalState.response || generalState.error)) {
            const content = generalState.response || `Error: ${generalState.error}`;
            setGeneralSessions(prev => prev.map(s => s.id === activeGeneralId ? {
                ...s, messages: [...s.messages, { role: 'assistant', content, timestamp: Date.now(), mode: pulseMode }]
            } : s));
        }
    }
  }, [generalState, isGeneralPending, activeGeneralId, pulseMode, isManuallyStopped]);

  useEffect(() => {
    if (!isDoctorPending && doctorState.timestamp > 0) {
        if (!isManuallyStopped && (doctorState.response || doctorState.error)) {
            const content = doctorState.response || `Error: ${doctorState.error}`;
            setDoctorSessions(prev => prev.map(s => s.id === activeDoctorId ? {
                ...s, messages: [...s.messages, { role: 'assistant', content, timestamp: Date.now() }]
            } : s));
        }
    }
  }, [doctorState, isDoctorPending, activeDoctorId, isManuallyStopped]);

  // Persist sessions
  useEffect(() => {
    const savedGen = localStorage.getItem('health_assistant_gen_v2');
    const savedDoc = localStorage.getItem('health_assistant_doc_v2');
    if (savedGen) setGeneralSessions(JSON.parse(savedGen));
    if (savedDoc) setDoctorSessions(JSON.parse(savedDoc));
  }, []);

  useEffect(() => {
    if (generalSessions.length > 0) localStorage.setItem('health_assistant_gen_v2', JSON.stringify(generalSessions));
    if (doctorSessions.length > 0) localStorage.setItem('health_assistant_doc_v2', JSON.stringify(doctorSessions));
  }, [generalSessions, doctorSessions]);

  // Loading timers
  useEffect(() => {
    let timer: NodeJS.Timeout;
    let source: NodeJS.Timeout;
    if (isPending) {
      setLoadingTimer(0);
      timer = setInterval(() => setLoadingTimer(prev => prev + 1), 1000);
      source = setInterval(() => setCurrentSourceIndex(prev => (prev + 1) % medicalSources.length), 2000);
    }
    return () => { clearInterval(timer); clearInterval(source); };
  }, [isPending]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [activeSession?.messages, isPending]);

  const handleNewChat = useCallback((modeOverride?: 'general' | 'doctor') => {
    const targetMode = modeOverride || activeMode;
    const id = `session-${Date.now()}`;
    const newSession: Session = {
      id,
      title: 'New Health Chat',
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
    setIsFocused(false);
  }, [activeMode, specialty]);

  const onFormAction = (formData: FormData | string) => {
    let query = typeof formData === 'string' ? formData : (formData instanceof FormData ? formData.get('query') as string || '' : '');
    if (!query && !attachedImage) return;

    setIsManuallyStopped(false);
    const userMsg: Message = {
        role: 'user',
        content: query || 'Analyze attached image',
        image: attachedImage || undefined,
        mode: activeMode === 'general' ? pulseMode : undefined,
        timestamp: Date.now()
    };

    // UPDATE UI IMMEDIATELY
    let sid = currentSessionId;
    if (!sid) {
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

    // Trigger Server Action
    const payload = new FormData();
    payload.set('query', query);
    const updatedHistory = activeSession ? [...activeSession.messages, userMsg] : [userMsg];
    payload.set('history', JSON.stringify(updatedHistory));
    if (attachedImage) payload.set('photoDataUri', attachedImage);

    startTransition(() => {
        if (activeMode === 'doctor') {
            payload.set('specialty', specialty);
            doctorFormAction(payload);
        } else {
            payload.set('mode', pulseMode);
            generalFormAction(payload);
        }
    });

    // Reset inputs
    if (queryInputRef.current) { queryInputRef.current.value = ''; queryInputRef.current.style.height = 'auto'; }
    setAttachedImage(null);
    setIsTyping(false);
    setIsInputVisible(true);
    setIsFocused(false);
  };

  const [isRecording, setIsRecording] = useState(false);
  const [speechState, speechFormAction] = useActionState(speechToTextAction, initialSpeechState);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          const formData = new FormData();
          formData.append('audioDataUri', reader.result as string);
          startTransition(() => speechFormAction(formData));
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
      toast({ title: "Listening..." });
    } catch (e) { toast({ variant: 'destructive', title: 'Mic Access Required' }); }
  };

  useEffect(() => {
    if (speechState.transcript && queryInputRef.current) {
        queryInputRef.current.value = speechState.transcript;
        setIsTyping(true);
    }
  }, [speechState]);

  const handleToggleSpeech = (text: string, msgId: number) => {
    if (!window.speechSynthesis) return;
    if (speakingMsgId === msgId) { window.speechSynthesis.cancel(); setSpeakingMsgId(null); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, '').trim());
    u.onstart = () => setSpeakingMsgId(msgId); u.onend = () => setSpeakingMsgId(null);
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] overflow-hidden fixed inset-0 font-body safe-top">
        
        {/* HEADER: Premium Branded Layout */}
        <header className="h-16 px-4 bg-white/60 dark:bg-[#1e1f20]/60 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 z-50">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="h-11 w-11 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center transition-all">
                    <Menu className="w-5 h-5 text-[#1A365D] dark:text-slate-100" />
                </SidebarTrigger>
                <div className="flex flex-col -space-y-0.5">
                    <h1 className="text-[12px] font-black text-[#1A365D] dark:text-white uppercase tracking-tighter leading-none">Your</h1>
                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.25em]">Health Partner</p>
                </div>
            </div>

            <div className="bg-slate-100/60 dark:bg-slate-800/60 p-1 rounded-full flex items-center gap-1 backdrop-blur-md border border-white/40 dark:border-slate-700/50">
                <button onClick={() => { setActiveMode('general'); setActiveGeneralId(null); }}
                  className={cn("px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300", activeMode === 'general' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400 hover:text-slate-500")}>
                  Assistant
                </button>
                <button onClick={() => { setActiveMode('doctor'); setActiveDoctorId(null); }}
                  className={cn("px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-300", activeMode === 'doctor' ? "bg-white dark:bg-slate-700 text-primary shadow-sm" : "text-slate-400 hover:text-slate-500")}>
                  Clinic
                </button>
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <button className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:scale-105 active:scale-95">
                        <History className="w-4.5 h-4.5 text-slate-400" />
                    </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-sm p-0 border-none rounded-l-[2rem] shadow-2xl flex flex-col bg-white/95 dark:bg-[#020617]/95 backdrop-blur-xl">
                    <SheetHeader className="p-8 pb-4">
                        <SheetTitle className="text-primary uppercase font-black text-xs tracking-[0.2em]">Record History</SheetTitle>
                    </SheetHeader>
                    <div className="px-8 pb-4">
                         <Tabs value={historyTab} onValueChange={(v) => setHistoryTab(v as any)} className="w-full">
                            <TabsList className="grid grid-cols-2 h-11 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                                <TabsTrigger value="general" className="rounded-lg font-black text-[10px] uppercase tracking-widest">General AI</TabsTrigger>
                                <TabsTrigger value="doctor" className="rounded-lg font-black text-[10px] uppercase tracking-widest">Specialist</TabsTrigger>
                            </TabsList>
                         </Tabs>
                    </div>
                    <ScrollArea className="flex-1 p-8 pt-0">
                        <Button variant="outline" className="w-full h-12 rounded-2xl mb-8 font-black uppercase text-[10px] tracking-widest border-primary/20 hover:bg-primary/5" onClick={() => handleNewChat(historyTab === 'general' ? 'general' : 'doctor')}>
                            <Plus className="mr-2 h-4 w-4" /> Start Fresh Session
                        </Button>
                        <div className="space-y-3 pb-20">
                            {(historyTab === 'general' ? generalSessions : doctorSessions).map(session => (
                                <div key={session.id} 
                                     onClick={() => {
                                         if (historyTab === 'general') { setActiveMode('general'); setActiveGeneralId(session.id); } 
                                         else { setActiveMode('doctor'); setActiveDoctorId(session.id); setSpecialty(session.specialty || "General Physician"); }
                                     }}
                                     className={cn("group p-5 rounded-[2rem] border shadow-sm cursor-pointer transition-all duration-300", (historyTab === 'general' ? activeGeneralId : activeDoctorId) === session.id ? "bg-primary/5 border-primary/30" : "bg-white/40 dark:bg-slate-800/40 border-transparent hover:border-slate-200")}>
                                    <p className="text-xs font-bold truncate dark:text-[#e3e3e3]">{session.title}</p>
                                    <p className="text-[8px] font-black text-gray-400 uppercase mt-1.5">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </header>

        {/* MAIN: Chat / Welcome Segment */}
        <main className="flex-1 overflow-hidden relative flex flex-col w-full max-w-4xl mx-auto">
            {!hasMessages && !isPending ? (
                <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
                    <div className="flex flex-col justify-center items-center px-6 pt-12 pb-48 space-y-12 text-center max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-1000">
                        
                        <div className="space-y-6 flex flex-col items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse scale-150" />
                                <div className="relative p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-800">
                                    {activeMode === 'general' ? (
                                        <ShieldPlus className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(36,136,232,0.5)]" />
                                    ) : (
                                        <Stethoscope className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(36,136,232,0.5)]" />
                                    )}
                                    <div className="absolute -top-1 -right-1 h-7 w-7 bg-pink-500 rounded-full border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center">
                                        <Sparkles className="h-3 w-3 text-white fill-white animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase leading-none">
                                    {activeMode === 'doctor' ? `Digital Specialist` : "Global Health AI"}
                                </h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.35em] max-w-[280px] mx-auto opacity-80 leading-relaxed">
                                    {activeMode === 'doctor' ? 'Professional clinical inquiry & specialized guidance' : 'Elite intelligence vetted by global medical institutions'}
                                </p>
                            </div>
                        </div>

                        {activeMode === 'general' ? (
                             <div className="grid grid-cols-1 gap-3 w-full">
                                {suggestionPool.map((s, idx) => (
                                    <button key={idx} onClick={() => onFormAction(s.query)}
                                        className="flex items-center gap-4 p-5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-[2rem] text-left border border-white/40 dark:border-slate-800 hover:border-primary/30 transition-all active:scale-[0.98] shadow-sm w-full group">
                                        <div className="p-3 bg-primary/10 rounded-2xl shrink-0 group-hover:bg-primary/20 transition-colors">
                                            <s.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[11px] font-black text-slate-700 dark:text-[#c4c7c5] uppercase tracking-widest block mb-0.5">{s.label}</span>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase truncate">Ask AI Assistant Now</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 w-full">
                                {doctorSpecialties.map((spec) => (
                                    <button 
                                      key={spec.name} 
                                      onClick={() => { setSpecialty(spec.name); handleNewChat('doctor'); }}
                                      className={cn(
                                          "flex flex-col items-center justify-center p-6 rounded-[2.5rem] text-center border transition-all active:scale-95 group relative overflow-hidden",
                                          specialty === spec.name && activeDoctorId
                                          ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
                                          : "bg-white/40 dark:bg-slate-900/40 border-white/40 dark:border-slate-800 hover:bg-white"
                                      )}
                                    >
                                        <div className={cn("h-14 w-14 rounded-3xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110", specialty === spec.name ? "bg-white/20 shadow-inner" : spec.bg)}>
                                            <spec.icon className={cn("h-7 w-7", specialty === spec.name ? "text-white" : spec.color)} />
                                        </div>
                                        <p className="text-[11px] font-black uppercase tracking-tight leading-none mb-1.5">{spec.name}</p>
                                        <p className={cn("text-[8px] font-bold uppercase tracking-widest opacity-60 px-2 line-clamp-1", specialty === spec.name ? "text-white" : "text-slate-400")}>{spec.desc}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            ) : (
                <ScrollArea className="flex-1 px-4 md:px-8 py-8" ref={scrollAreaRef}>
                    <div className="max-w-4xl mx-auto space-y-12 pb-80">
                        {activeSession?.messages.map((m, i) => (
                            <div key={i} className={cn("animate-in fade-in slide-in-from-bottom-6 duration-700", m.role === 'user' ? "flex flex-col items-end" : "flex flex-col items-start")}>
                                {m.role === 'user' ? (
                                    <div className="max-w-[85%] md:max-w-[70%] rounded-[2.5rem] rounded-tr-sm bg-primary text-white px-7 py-5 shadow-xl shadow-primary/10">
                                        {m.image && (
                                            <div className="mb-4 rounded-[1.8rem] overflow-hidden border-4 border-white/20 shadow-inner">
                                                <Image src={m.image} alt="Attachment" width={400} height={400} className="w-full h-auto" />
                                            </div>
                                        )}
                                        <p className="text-[15px] md:text-[17px] font-bold leading-relaxed">{m.content}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start w-full group">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="size-11 flex items-center justify-center bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800">
                                                {activeMode === 'doctor' ? <Stethoscope className="w-5 h-5 text-primary" /> : <ShieldPlus className="w-5 h-5 text-primary" />}
                                            </div>
                                            <div className="flex flex-col -space-y-1">
                                                <span className="text-[11px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-widest">{activeMode === 'doctor' ? specialty : 'Expert Analysis'}</span>
                                                <div className="flex items-center gap-1.5 mt-1.5">
                                                     <CheckCircle2 className="h-3 w-3 text-emerald-500 fill-emerald-500/20" />
                                                     <span className="text-[8px] font-black uppercase text-emerald-600 tracking-[0.2em]">Medically Vetted</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full min-w-0">
                                            <article className="prose prose-sm md:prose-lg dark:prose-invert max-w-full text-slate-800 dark:text-slate-200 leading-relaxed font-medium px-2 selection:bg-primary/10">
                                                <ReactMarkdown 
                                                    components={{
                                                        a: ({node, ...props}) => <a {...props} className="text-primary font-black underline decoration-2 underline-offset-4 hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer" />,
                                                        h2: ({node, ...props}) => <h2 {...props} className="text-xl font-black uppercase text-[#1A365D] dark:text-white tracking-tight mt-10 mb-5 border-l-[6px] border-primary pl-5" />,
                                                        p: ({node, ...props}) => <p {...props} className="mb-5" />,
                                                        ul: ({node, ...props}) => <ul {...props} className="space-y-2 mb-6 list-none pl-2" />,
                                                        li: ({node, ...props}) => <li {...props} className="flex gap-3 items-start before:content-[''] before:h-2 before:w-2 before:bg-primary/40 before:rounded-full before:mt-2.5" />
                                                    }}
                                                >
                                                    {m.content}
                                                </ReactMarkdown>
                                            </article>
                                            <div className="mt-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity px-2">
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-800" onClick={() => handleToggleSpeech(m.content, i)}>
                                                    <Volume2 className="w-4.5 h-4.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-800" onClick={() => { navigator.clipboard.writeText(m.content); toast({title: "Copied"}); }}><Copy className="w-4.5 h-4.5" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isPending && (
                             <div className="flex flex-col items-start gap-6 w-full animate-in fade-in">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 flex items-center justify-center bg-primary/10 rounded-[1.5rem] animate-pulse">
                                            {activeMode === 'doctor' ? <Stethoscope className="w-6 h-6 text-primary" /> : <ShieldPlus className="w-6 h-6 text-primary" />}
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Health AI Thinking...</span>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-12 bg-primary/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary animate-splash-gradient w-1/2" />
                                                </div>
                                                <span className="tabular-nums text-[9px] font-black text-slate-400">{loadingTimer}s</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setIsManuallyStopped(true)} className="rounded-full h-9 px-5 gap-2 border-red-100 dark:border-red-900/50 text-red-500 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest shadow-sm">
                                        <StopCircle className="w-3.5 h-3.5" /> Stop
                                    </Button>
                                </div>
                                <div className="h-14 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center px-6 max-w-sm shadow-inner">
                                    <div key={currentSourceIndex} className="flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300 w-full">
                                        <Sparkles className="w-4 h-4 text-yellow-500 shrink-0" />
                                        <p className="text-[9px] font-black uppercase text-slate-500 truncate tracking-[0.15em]">Sourcing: <span className="text-primary">{medicalSources[currentSourceIndex]}</span></p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            )}
        </main>

        {/* INPUT: Fixed Floating Bar with Advanced Logic */}
        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-40 transition-all duration-700 ease-in-out px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]",
            (!isInputVisible && hasMessages) || (activeMode === 'doctor' && !activeDoctorId) ? "translate-y-[130%] opacity-0" : "translate-y-0 opacity-100"
        )}>
            <div className="max-w-3xl mx-auto flex flex-col gap-4">
                {attachedImage && (
                    <div className="mx-4 mb-1 flex animate-in zoom-in-95 duration-500">
                        <div className="relative">
                            <Image src={attachedImage} alt="Preview" width={100} height={100} className="rounded-3xl border-[6px] border-white dark:border-slate-800 shadow-2xl object-cover ring-1 ring-slate-100" />
                            <Button variant="destructive" size="icon" className="absolute -top-3 -right-3 h-8 w-8 rounded-full shadow-lg border-2 border-white" onClick={() => setAttachedImage(null)}><X className="h-4 w-4" /></Button>
                        </div>
                    </div>
                )}
                
                <div className="relative flex flex-col rounded-[2.8rem] bg-white/95 dark:bg-[#020617]/95 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] p-3 border border-white dark:border-slate-800 focus-within:ring-[8px] focus-within:ring-primary/5 transition-all duration-500">
                    
                    <div className="flex items-center px-5 py-2 gap-2.5 opacity-60">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">HIPAA Secure Session</span>
                    </div>

                    <div className="flex-1">
                        <Textarea 
                            ref={queryInputRef} 
                            name="query" 
                            placeholder={activeMode === 'doctor' ? `Inquiry for the ${specialty}...` : "Describe symptoms or upload a medical report..."}
                            className={cn(
                                "w-full px-5 py-3 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-[17px] text-slate-800 dark:text-slate-200 resize-none transition-all duration-500 overflow-y-auto", 
                                (isFocused || isTyping || attachedImage) ? "min-h-[70px] max-h-[220px]" : "min-h-[48px] max-h-[48px]"
                            )}
                            rows={1} onFocus={() => setIsFocused(true)}
                            onInput={(e) => { 
                                const target = e.target as HTMLTextAreaElement; 
                                target.style.height = 'auto'; 
                                target.style.height = `${Math.min(target.scrollHeight, 220)}px`; 
                                setIsTyping(target.value.length > 0); 
                                target.scrollTop = target.scrollHeight;
                            }}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onFormAction(queryInputRef.current!.value); } }} />
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100/50 dark:border-slate-800/50">
                        <div className="flex items-center gap-1.5">
                            <Button type="button" variant="ghost" size="icon" onClick={() => queryInputRef.current?.closest('body')?.querySelector<HTMLInputElement>('#file-upload')?.click()} className="h-12 w-12 rounded-full hover:bg-slate-50 transition-colors">
                                <Plus className="h-6 w-6 text-slate-400" />
                            </Button>
                            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const r = new FileReader(); r.onload = (ev) => setAttachedImage(ev.target?.result as string); r.readAsDataURL(file); } }} />
                            
                            {activeMode === 'general' ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button type="button" variant="ghost" className={cn("h-10 px-5 rounded-full gap-3 text-[10px] font-black uppercase tracking-widest transition-all", modeConfig[pulseMode].bg, modeConfig[pulseMode].color, "border border-transparent hover:border-current/20")}>
                                            {React.createElement(modeConfig[pulseMode].icon, { className: "h-4 w-4" })}
                                            <span className="hidden sm:inline">{modeConfig[pulseMode].label}</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-72 rounded-[2.8rem] p-5 mb-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]" side="top" align="start">
                                        <div className="space-y-5">
                                            <div className="px-2">
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.25em] mb-1">Intelligence Mode</p>
                                                <p className="text-[8px] font-bold text-slate-300 uppercase">Change AI behavior and data depth</p>
                                            </div>
                                            <RadioGroup value={pulseMode} onValueChange={(v) => setPulseMode(v as PulseMode)} className="gap-2.5">
                                                {Object.entries(modeConfig).map(([val, cfg]) => (
                                                    <div key={val} className="flex items-center space-x-4 p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all has-[:checked]:bg-primary/10 group cursor-pointer border border-transparent has-[:checked]:border-primary/20">
                                                        <RadioGroupItem value={val} id={val} className="sr-only" />
                                                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 group-has-[:checked]:bg-white dark:group-has-[:checked]:bg-slate-700 shadow-sm transition-colors">
                                                            {React.createElement(cfg.icon, { className: cn("w-4 h-4", cfg.color) })}
                                                        </div>
                                                        <Label htmlFor={val} className="flex-1 cursor-pointer font-black text-[11px] text-slate-600 dark:text-[#e3e3e3] uppercase tracking-widest">{cfg.label}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <div className="flex items-center gap-2 px-4 h-10 rounded-full bg-primary/5 border border-primary/10">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.15em]">{specialty}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                             {!isTyping && !isRecording && !attachedImage && (
                                <Button type="button" variant="ghost" size="icon" onClick={startRecording} className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 transition-all active:scale-90"><Mic className="w-5.5 h-5.5 text-primary" /></Button>
                            )}
                            {(isTyping || isRecording || attachedImage) && (
                                <Button onClick={() => onFormAction(queryInputRef.current!.value)} disabled={isPending} className="h-14 w-14 rounded-full bg-primary text-white shadow-xl shadow-primary/30 active:scale-90 transition-all duration-300">
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
