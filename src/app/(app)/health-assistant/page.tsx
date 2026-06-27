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
    ThumbsUp,
    ArrowLeft,
    Globe,
    Clock,
    Square,
    Stethoscope,
    ChevronRight,
    HeartPulse,
    StopCircle,
    UserCircle2,
    CheckCircle2,
    ShieldCheck
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
    standard: { label: "Balanced Expert", icon: ShieldPlus, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    websearch: { label: "Deep Web Search", icon: Search, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    deepthink: { label: "Logical Reasoning", icon: BrainCircuit, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    proanalysis: { label: "Pharmacist Analysis", icon: Pill, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
};

const doctorSpecialties = [
  { name: "General Physician", icon: Stethoscope, desc: "Primary health & wellness" },
  { name: "Cardiologist", icon: HeartPulse, desc: "Heart & blood circulation" },
  { name: "Dermatologist", icon: Sparkles, desc: "Skin, hair & nail care" },
  { name: "Pediatrician", icon: UserCircle2, desc: "Infant & child health" },
  { name: "Neurologist", icon: BrainCircuit, desc: "Brain & nervous system" },
  { name: "Orthopedist", icon: Activity, desc: "Bones & joint mobility" },
];

const suggestionPool = [
    { label: "Minor burn first aid", query: "What are the first aid steps for a minor burn?", icon: Zap },
    { label: "Keep heart healthy", query: "Give me 5 daily habits to keep my heart healthy.", icon: Sparkles },
    { label: "Check my symptoms", query: "I have a headache and mild fever, what should I do?", icon: Activity },
    { label: "Explain medicine", query: "What are the common side effects of Paracetamol 500mg?", icon: Pill },
];

const medicalSources = [
  "WHO", "Mayo Clinic", "Harvard Health", "Johns Hopkins", "AIIMS India", "NHS UK", "The Lancet", "Cleveland Clinic"
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
  const formRef = useRef<HTMLFormElement>(null);
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const isPending = (activeMode === 'general' ? isGeneralPending : isDoctorPending) && !isManuallyStopped;
  const currentSessionId = activeMode === 'general' ? activeGeneralId : activeDoctorId;
  const currentSessions = activeMode === 'general' ? generalSessions : doctorSessions;
  const activeSession = currentSessions.find(s => s.id === currentSessionId);
  const hasMessages = (activeSession?.messages?.length || 0) > 0;

  // Immersive Scroll Logic - Performance optimized
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || !hasMessages) { setIsInputVisible(true); return; }
    const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
    if (!viewport) return;

    const handleScroll = () => {
        const currentTop = viewport.scrollTop;
        const isAtBottom = Math.abs(viewport.scrollHeight - viewport.clientHeight - currentTop) < 40;
        
        if (Math.abs(currentTop - lastScrollTop.current) < 10) return;

        if (currentTop > lastScrollTop.current && currentTop > 120 && !isAtBottom) {
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

  useEffect(() => {
    const savedGen = localStorage.getItem('healthAssistantSessions_general');
    const savedDoc = localStorage.getItem('healthAssistantSessions_doctor');
    if (savedGen) setGeneralSessions(JSON.parse(savedGen));
    if (savedDoc) setDoctorSessions(JSON.parse(savedDoc));
  }, []);

  useEffect(() => {
    if (generalSessions.length > 0) localStorage.setItem('healthAssistantSessions_general', JSON.stringify(generalSessions));
    if (doctorSessions.length > 0) localStorage.setItem('healthAssistantSessions_doctor', JSON.stringify(doctorSessions));
  }, [generalSessions, doctorSessions]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let source: NodeJS.Timeout;
    if (isPending) {
      setLoadingTimer(0);
      timer = setInterval(() => setLoadingTimer(prev => prev + 1), 1000);
      source = setInterval(() => setCurrentSourceIndex(prev => (prev + 1) % medicalSources.length), 2500);
    }
    return () => { clearInterval(timer); clearInterval(source); };
  }, [isPending]);

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
    setIsFocused(false);
  }, [activeMode, specialty]);

  const onFormAction = (formData: FormData | string) => {
    let query = typeof formData === 'string' ? formData : formData.get('query') as string || '';
    if (!query && !attachedImage) return;

    setIsManuallyStopped(false);
    const userMsg: Message = {
        role: 'user',
        content: query || (attachedImage ? 'Analyze attached image' : ''),
        image: attachedImage || undefined,
        mode: activeMode === 'general' ? pulseMode : undefined,
        timestamp: Date.now()
    };

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
        if (activeMode === 'general') { setGeneralSessions(prev => [newSession, ...prev]); setActiveGeneralId(sid); }
        else { setDoctorSessions(prev => [newSession, ...prev]); setActiveDoctorId(sid); }
    } else {
        const setter = activeMode === 'general' ? setGeneralSessions : setDoctorSessions;
        setter(prev => prev.map(s => s.id === sid ? {
            ...s, messages: [...s.messages, userMsg],
            title: s.messages.length === 0 ? (query.length > 30 ? query.substring(0, 30) + '...' : query) : s.title
        } : s));
    }

    const payload = new FormData();
    payload.set('query', query);
    const history = activeSession ? [...activeSession.messages, userMsg] : [userMsg];
    payload.set('history', JSON.stringify(history));
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
      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorder.onstop = () => {
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
      mediaRecorder.start();
      setIsRecording(true);
    } catch (e) { toast({ variant: 'destructive', title: 'Mic Error' }); }
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
    const clean = text.replace(/[*#_`]/g, '').trim();
    const u = new SpeechSynthesisUtterance(clean);
    u.onstart = () => setSpeakingMsgId(msgId); u.onend = () => setSpeakingMsgId(null);
    window.speechSynthesis.speak(u);
  };

  const shouldShowInput = (activeMode === 'general') || (activeMode === 'doctor' && activeDoctorId !== null);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] overflow-hidden fixed inset-0 font-body">
        <header className="h-16 border-b border-gray-100 dark:border-[#3c4043] flex items-center justify-between px-4 shrink-0 bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-xl z-50">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="h-10 w-10 rounded-2xl hover:bg-white/50 shadow-sm border border-white/20">
                    <Menu className="w-5 h-5 text-gray-600 dark:text-[#c4c7c5]" />
                </SidebarTrigger>
                <div className="flex items-center gap-2.5 ml-2">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <ShieldPlus className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex flex-col -space-y-0.5">
                        <h1 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tighter leading-none">AI Health</h1>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.25em]">Assistant</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-100/60 dark:bg-[#131314]/60 p-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                <button onClick={() => { setActiveMode('general'); setActiveGeneralId(null); }}
                  className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", activeMode === 'general' ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400")}>
                  Assistant
                </button>
                <button onClick={() => { setActiveMode('doctor'); setActiveDoctorId(null); }}
                  className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all", activeMode === 'doctor' ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-400")}>
                  Specialists
                </button>
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-[#3c4043]/40 border border-white/20">
                        <History className="w-4 h-4 text-gray-500" />
                    </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-sm p-0 border-none rounded-l-[2rem] shadow-2xl flex flex-col bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl">
                    <SheetHeader className="p-8 pb-4">
                        <SheetTitle className="text-primary uppercase font-black text-xs tracking-[0.2em]">Medical Records</SheetTitle>
                    </SheetHeader>
                    <div className="px-8 pb-4">
                         <Tabs value={historyTab} onValueChange={(v) => setHistoryTab(v as any)} className="w-full">
                            <TabsList className="grid grid-cols-2 h-10 p-1 bg-gray-100/50 dark:bg-[#131314]/50 rounded-xl">
                                <TabsTrigger value="general" className="rounded-lg font-bold text-[10px] uppercase">Assistant</TabsTrigger>
                                <TabsTrigger value="doctor" className="rounded-lg font-bold text-[10px] uppercase">Specialists</TabsTrigger>
                            </TabsList>
                         </Tabs>
                    </div>
                    <ScrollArea className="flex-1 p-8 pt-0">
                        <Button variant="outline" className="w-full h-12 rounded-2xl mb-8 font-black uppercase text-[10px] tracking-widest border-primary/20" onClick={() => handleNewChat(historyTab === 'general' ? 'general' : 'doctor')}>
                            <Plus className="mr-2 h-4 w-4" /> Start Fresh
                        </Button>
                        <div className="space-y-3 pb-20">
                            {(historyTab === 'general' ? generalSessions : doctorSessions).map(session => (
                                <div key={session.id} 
                                     onClick={() => {
                                         if (historyTab === 'general') { setActiveMode('general'); setActiveGeneralId(session.id); } 
                                         else { setActiveMode('doctor'); setActiveDoctorId(session.id); setSpecialty(session.specialty || "General Physician"); }
                                     }}
                                     className={cn("group p-5 rounded-[2rem] border shadow-sm cursor-pointer transition-all", (historyTab === 'general' ? activeGeneralId : activeDoctorId) === session.id ? "bg-primary/5 border-primary/30" : "bg-white/40 border-transparent")}>
                                    <p className="text-xs font-bold truncate dark:text-[#e3e3e3]">{session.title}</p>
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
                <ScrollArea className="flex-1 w-full" ref={scrollAreaRef}>
                    <div className="flex flex-col justify-center items-center px-6 pt-10 pb-40 space-y-10 text-center max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-700">
                        <div className="space-y-4 flex flex-col items-center">
                            <div className="p-6 bg-white dark:bg-[#1e1f20] rounded-[2.8rem] shadow-2xl border border-white/50">
                                {activeMode === 'general' ? (
                                    <ShieldPlus className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(36,136,232,0.4)]" />
                                ) : (
                                    <Stethoscope className="w-10 h-10 text-primary drop-shadow-[0_0_15px_rgba(36,136,232,0.4)]" />
                                )}
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase">
                                    {activeMode === 'doctor' ? `Select Specialist` : "Global Health AI"}
                                </h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
                                    {activeMode === 'doctor' ? 'AI-Powered Clinical Consultation' : 'Medically Vetted Intelligence'}
                                </p>
                            </div>
                        </div>

                        {activeMode === 'general' ? (
                             <div className="flex flex-col gap-3 w-full">
                                {suggestionPool.map((suggestion, idx) => (
                                    <button key={idx} onClick={() => onFormAction(suggestion.query)}
                                        className="flex items-center gap-4 p-5 bg-white/60 dark:bg-[#1e1f20]/60 backdrop-blur-md rounded-3xl text-left border border-white/40 hover:border-primary/30 transition-all active:scale-[0.98] group shadow-sm w-full">
                                        <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                                            <suggestion.icon className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-700 dark:text-[#c4c7c5] flex-1 truncate">{suggestion.label}</span>
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
                                          "flex flex-col items-center justify-center p-6 rounded-[2.5rem] text-center border transition-all active:scale-95 group",
                                          specialty === spec.name 
                                          ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
                                          : "bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800"
                                      )}
                                    >
                                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-3", specialty === spec.name ? "bg-white/20" : "bg-primary/10")}>
                                            <spec.icon className={cn("h-6 w-6", specialty === spec.name ? "text-white" : "text-primary")} />
                                        </div>
                                        <p className="text-[11px] font-black uppercase tracking-tight leading-none mb-1">{spec.name}</p>
                                        <p className={cn("text-[8px] font-bold uppercase tracking-widest opacity-60", specialty === spec.name ? "text-white" : "text-slate-400")}>{spec.desc}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            ) : (
                <ScrollArea className="flex-1 px-4 md:px-8 py-6" ref={scrollAreaRef}>
                    <div className="max-w-4xl mx-auto space-y-14 pb-80">
                        {activeSession?.messages.map((m, i) => (
                            <div key={i} className={cn("animate-in fade-in slide-in-from-bottom-6 duration-700", m.role === 'user' ? "flex flex-col items-end" : "flex flex-col items-start")}>
                                {m.role === 'user' ? (
                                    <div className="max-w-[85%] md:max-w-[70%] rounded-[2.2rem] rounded-tr-sm bg-primary text-white px-7 py-4 shadow-xl">
                                        {m.image && (
                                            <div className="mb-4 rounded-[1.5rem] overflow-hidden border-2 border-white/20">
                                                <Image src={m.image} alt="Attachment" width={300} height={300} className="w-full h-auto" />
                                            </div>
                                        )}
                                        <p className="text-[15px] md:text-[17px] font-bold leading-relaxed">{m.content}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-start w-full group">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="size-9 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100">
                                                {activeMode === 'doctor' ? <Stethoscope className="w-4.5 h-4.5 text-primary" /> : <ShieldPlus className="w-4.5 h-4.5 text-primary" />}
                                            </div>
                                            <div className="flex flex-col -space-y-1">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeMode === 'doctor' ? specialty : 'Expert Insight'}</span>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                     <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                                     <span className="text-[7px] font-black uppercase text-emerald-600 tracking-widest">Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 w-full min-w-0">
                                            <article className="prose prose-sm md:prose-lg dark:prose-invert max-w-full text-slate-800 dark:text-[#e3e3e3] leading-relaxed font-medium px-1">
                                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                            </article>
                                            <div className="mt-8 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity px-1">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/40 shadow-sm" onClick={() => handleToggleSpeech(m.content, i)}>
                                                    <Volume2 className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/40 shadow-sm" onClick={() => { navigator.clipboard.writeText(m.content); toast({title: "Copied"}); }}><Copy className="w-3.5 h-3.5" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isPending && (
                             <div className="flex flex-col items-start gap-6 w-full animate-in fade-in">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-9 flex items-center justify-center bg-primary/10 rounded-full animate-pulse">
                                            {activeMode === 'doctor' ? <Stethoscope className="w-4.5 h-4.5 text-primary" /> : <ShieldPlus className="w-4.5 h-4.5 text-primary" />}
                                        </div>
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Thinking... <span className="tabular-nums ml-2">{loadingTimer}s</span></span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setIsManuallyStopped(true)} className="rounded-full h-8 px-3 gap-2 border-red-200 text-red-500 hover:bg-red-50 font-black text-[9px] uppercase tracking-widest">
                                        <StopCircle className="w-3 h-3" /> Stop
                                    </Button>
                                </div>
                                <div className="h-14 bg-white/40 dark:bg-[#131314]/40 rounded-2xl border border-dashed border-slate-200 flex items-center px-5 max-w-xs">
                                    <div key={currentSourceIndex} className="flex items-center gap-3 animate-in slide-in-from-bottom-3 duration-500 w-full">
                                        <Sparkles className="w-4 h-4 text-yellow-500 shrink-0" />
                                        <p className="text-[11px] font-bold text-slate-600 dark:text-[#c4c7c5] truncate">Consulting <span className="text-primary">{medicalSources[currentSourceIndex]}</span></p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            )}
        </main>

        <div className={cn(
            "fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out px-4 pb-10",
            (!isInputVisible && hasMessages) || !shouldShowInput ? "translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"
        )}>
            <form ref={formRef} action={onFormAction} className="max-w-3xl mx-auto flex flex-col gap-4">
                {attachedImage && (
                    <div className="mx-4 mb-1 flex animate-in zoom-in-95">
                        <div className="relative group/thumb">
                            <Image src={attachedImage} alt="Preview" width={100} height={100} className="rounded-[1.5rem] border-4 border-white dark:border-[#3c4043] shadow-2xl object-cover" />
                            <Button variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7 rounded-full shadow-lg" onClick={() => setAttachedImage(null)}><X className="h-4 w-4" /></Button>
                        </div>
                    </div>
                )}
                <div className="relative flex flex-col rounded-[2.5rem] bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-2xl shadow-2xl p-3 border border-white dark:border-[#3c4043] focus-within:ring-4 focus-within:ring-primary/10">
                    <div className="flex-1">
                        <Textarea 
                            ref={queryInputRef} 
                            name="query" 
                            placeholder={activeMode === 'doctor' ? `Consult Dr. ${specialty.split(' ').pop()}...` : "Analyze report or ask anything..."}
                            className={cn(
                                "w-full px-5 py-3 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-[17px] text-slate-800 dark:text-[#e3e3e3] resize-none transition-all duration-300 overflow-y-auto", 
                                (isFocused || isTyping || attachedImage) ? "min-h-[60px] max-h-[200px]" : "min-h-[46px] max-h-[46px]"
                            )}
                            rows={1} onFocus={() => setIsFocused(true)}
                            onInput={(e) => { 
                                const target = e.target as HTMLTextAreaElement; 
                                target.style.height = 'auto'; 
                                target.style.height = `${Math.min(target.scrollHeight, 200)}px`; 
                                setIsTyping(target.value.length > 0); 
                                target.scrollTop = target.scrollHeight;
                            }}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onFormAction(new FormData(formRef.current!)); } }} />
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/80">
                        <div className="flex items-center gap-1.5">
                            <Button type="button" variant="ghost" size="icon" onClick={() => queryInputRef.current?.closest('body')?.querySelector<HTMLInputElement>('#file-upload')?.click()} className="h-11 w-11 rounded-full">
                                <Plus className="h-6 w-6 text-slate-500" />
                            </Button>
                            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const r = new FileReader(); r.onload = (ev) => setAttachedImage(ev.target?.result as string); r.readAsDataURL(file); } }} />
                            {activeMode === 'general' ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button type="button" variant="ghost" className={cn("h-11 px-5 rounded-full gap-2.5 text-[10px] font-black uppercase tracking-widest", modeConfig[pulseMode].bg, modeConfig[pulseMode].color)}>
                                            {React.createElement(modeConfig[pulseMode].icon, { className: "h-3.5 w-3.5" })}
                                            <span className="hidden sm:inline">{modeConfig[pulseMode].label}</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-72 rounded-[2.5rem] p-4 mb-6 bg-white/95 dark:bg-[#1e1f20]/95 backdrop-blur-xl border-none shadow-2xl" side="top" align="start">
                                        <RadioGroup value={pulseMode} onValueChange={(v) => setPulseMode(v as PulseMode)} className="gap-2">
                                            {Object.entries(modeConfig).map(([val, cfg]) => (
                                                <div key={val} className="flex items-center space-x-4 p-3.5 rounded-2xl hover:bg-slate-50 transition-all has-[:checked]:bg-primary/10 group cursor-pointer border border-transparent has-[:checked]:border-primary/20">
                                                    <RadioGroupItem value={val} id={val} className="sr-only" />
                                                    <div className="p-2.5 rounded-xl bg-slate-50 group-has-[:checked]:bg-white shadow-sm">
                                                        {React.createElement(cfg.icon, { className: cn("w-4 h-4", cfg.color) })}
                                                    </div>
                                                    <Label htmlFor={val} className="flex-1 cursor-pointer font-black text-[11px] text-slate-600 dark:text-[#e3e3e3] uppercase tracking-widest">{cfg.label}</Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Badge className="h-9 px-4 rounded-full bg-primary/5 text-primary border-primary/20 uppercase font-black text-[8px] tracking-widest">Clinic: {specialty}</Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                             {!isTyping && !isRecording && !attachedImage && (
                                <Button type="button" variant="ghost" size="icon" onClick={startRecording} className="h-12 w-12 rounded-full bg-slate-50"><Mic className="w-5 h-5 text-primary" /></Button>
                            )}
                            {(isTyping || isRecording || attachedImage) && (
                                <Button type="submit" disabled={isPending} className="h-12 w-12 rounded-full bg-primary text-white shadow-lg">
                                    {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <SendHorizonal className="w-6 h-6" />}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
  );
}
