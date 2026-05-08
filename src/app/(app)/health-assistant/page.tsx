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
    Stethoscope,
    Activity,
    Pill,
    BrainCircuit,
    ThumbsUp,
    ThumbsDown,
    Copy,
    Image as ImageIcon,
    Lightbulb
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    { label: "Check symptoms", query: "I have a headache and mild fever, what should I do?", icon: Activity },
    { label: "Explain medicine", query: "What are the common side effects of Paracetamol 500mg?", icon: Pill },
    { label: "Heart health tips", query: "Give me 5 daily habits to keep my heart healthy.", icon: Sparkles },
    { label: "First aid guide", query: "What are the first aid steps for a minor burn?", icon: Zap },
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
  const lastProcessedTimestamp = useRef<number>(0);

  const isPending = activeMode === 'general' ? isGeneralPending : isDoctorPending;
  const currentSessionId = activeMode === 'general' ? activeGeneralId : activeDoctorId;
  const activeSession = (activeMode === 'general' ? generalSessions : doctorSessions).find(s => s.id === currentSessionId);
  const hasMessages = activeSession && activeSession.messages.length > 0;

  const currentSuggestions = useMemo(() => {
    return [...suggestionPool].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, []);

  // Handle Response Sync
  useEffect(() => {
    const currentState = activeMode === 'general' ? generalState : doctorState;
    if (!isPending && currentState.timestamp > lastProcessedTimestamp.current) {
      lastProcessedTimestamp.current = currentState.timestamp;
      if (currentState.response || currentState.error) {
        const content = currentState.response || `Error: ${currentState.error}`;
        const setter = activeMode === 'general' ? setGeneralSessions : setDoctorSessions;
        setter(prev => prev.map(s => s.id === currentSessionId ? {
          ...s, messages: [...s.messages, { role: 'assistant', content, timestamp: Date.now() }]
        } : s));
      }
    }
  }, [generalState, doctorState, isPending, activeMode, currentSessionId]);

  const handleNewChat = useCallback(() => {
    const id = `session-${Date.now()}`;
    const newSession: Session = {
      id,
      title: activeMode === 'doctor' ? `${specialty}` : 'New Health Chat',
      messages: [],
      createdAt: Date.now(),
      ...(activeMode === 'doctor' && { specialty }),
    };
    if (activeMode === 'general') { 
        setGeneralSessions(prev => [newSession, ...prev]); 
        setActiveGeneralId(id); 
    } else { 
        setDoctorSessions(prev => [newSession, ...prev]); 
        setActiveDoctorId(id); 
    }
    setAttachedImage(null);
  }, [activeMode, specialty]);

  // Load Sessions
  useEffect(() => {
    const saved_gen = localStorage.getItem('healthAssistantSessions_general');
    const saved_doc = localStorage.getItem('healthAssistantSessions_doctor');
    
    if (saved_gen) {
        const parsed = JSON.parse(saved_gen);
        setGeneralSessions(parsed);
        if (activeMode === 'general' && parsed.length && !activeGeneralId) setActiveGeneralId(parsed[0].id);
    }
    if (saved_doc) {
        const parsed = JSON.parse(saved_doc);
        setDoctorSessions(parsed);
        if (activeMode === 'doctor' && parsed.length && !activeDoctorId) setActiveDoctorId(parsed[0].id);
    }

    if (!saved_gen && activeMode === 'general' && !activeGeneralId) handleNewChat();
    if (!saved_doc && activeMode === 'doctor' && !activeDoctorId) handleNewChat();
  }, [handleNewChat, activeMode]);

  // Save Sessions
  useEffect(() => {
    localStorage.setItem('healthAssistantSessions_general', JSON.stringify(generalSessions));
    localStorage.setItem('healthAssistantSessions_doctor', JSON.stringify(doctorSessions));
  }, [generalSessions, doctorSessions]);

  const onFormAction = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query && !attachedImage) return;

    const userMessage: Message = { 
        role: 'user', 
        content: query || 'Analyze attached image',
        mode: activeMode === 'general' ? pulseMode : undefined,
        image: attachedImage || undefined,
        timestamp: Date.now()
    };
    
    const sessionId = currentSessionId;
    if (!sessionId) return;

    const setter = activeMode === 'general' ? setGeneralSessions : setDoctorSessions;
    setter(prev => prev.map(s => s.id === sessionId ? {
        ...s, 
        messages: [...s.messages, userMessage], 
        title: s.messages.length === 0 ? query.substring(0, 30) : s.title
    } : s));
    
    formData.set('history', JSON.stringify(activeSession?.messages || []));
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
    
    if (formRef.current) formRef.current.reset();
    if (queryInputRef.current) {
        queryInputRef.current.value = '';
        queryInputRef.current.style.height = 'auto';
    }
    setAttachedImage(null);
    setIsTyping(false);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
        }
    }
  }, [activeSession?.messages, isPending]);

  // Voice logic
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

  const handleSpeak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, ''));
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#f8f9fa] dark:bg-[#131314] overflow-hidden fixed inset-0">
        <header className="h-14 border-b border-gray-200 dark:border-[#3c4043] flex items-center justify-between px-4 shrink-0 bg-white/80 dark:bg-[#1e1f20]/80 backdrop-blur-md z-30">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043]">
                    <Menu className="w-5 h-5 text-gray-600 dark:text-[#c4c7c5]" />
                </SidebarTrigger>
                <div className="h-6 w-px bg-gray-200 dark:bg-[#3c4043] mx-1" />
                <div className="flex items-center gap-2">
                    <ShieldPlus className="w-4 h-4 text-primary" />
                    <h1 className="text-xs font-bold text-gray-800 dark:text-[#e3e3e3]">Partner</h1>
                </div>
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                        <History className="w-5 h-5 text-gray-500 dark:text-[#9aa0a6]" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] p-0 border-none rounded-l-[2rem] shadow-2xl flex flex-col bg-white dark:bg-[#1e1f20]">
                    <SheetHeader className="p-6 pb-2">
                        <SheetTitle className="text-primary uppercase font-black text-sm tracking-widest">Recents</SheetTitle>
                    </SheetHeader>
                    <div className="px-6 pb-4">
                         <Tabs value={historyTab} onValueChange={(v) => setHistoryTab(v as any)} className="w-full">
                            <TabsList className="grid grid-cols-2 h-10 p-1 bg-gray-100 dark:bg-[#131314] rounded-xl">
                                <TabsTrigger value="general" className="rounded-lg font-bold text-[10px] uppercase">Assistant</TabsTrigger>
                                <TabsTrigger value="doctor" className="rounded-lg font-bold text-[10px] uppercase">Specialists</TabsTrigger>
                            </TabsList>
                         </Tabs>
                    </div>
                    <ScrollArea className="flex-1 p-6 pt-0">
                        <Button variant="outline" className="w-full h-12 rounded-2xl mb-6 font-bold uppercase text-[10px] tracking-widest" onClick={handleNewChat}>
                            <Plus className="mr-2 h-4 w-4" /> New Chat
                        </Button>
                        <div className="space-y-3 pb-20">
                            {(historyTab === 'general' ? generalSessions : doctorSessions).map(session => (
                                <div key={session.id} 
                                     onClick={() => {
                                         setActiveMode(historyTab);
                                         if (historyTab === 'general') setActiveGeneralId(session.id);
                                         else { setActiveDoctorId(session.id); setSpecialty(session.specialty || "General Physician"); }
                                     }}
                                     className={cn("group p-4 rounded-2xl border shadow-sm cursor-pointer transition-all active:scale-[0.98] relative", (historyTab === 'general' ? activeGeneralId : activeDoctorId) === session.id ? "bg-primary/5 border-primary/30" : "bg-white/40 dark:bg-[#282a2c] border-transparent hover:bg-gray-50")}>
                                    <div className="pr-8">
                                        <p className="text-xs font-bold truncate dark:text-[#e3e3e3]">{session.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[8px] font-bold text-gray-400 uppercase">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</p>
                                        </div>
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

        <main className="flex-1 overflow-hidden relative flex flex-col w-full max-w-4xl mx-auto">
            {!hasMessages && !isPending ? (
                <ScrollArea className="flex-1 w-full">
                    <div className="flex flex-col justify-center px-6 pt-16 space-y-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <ShieldPlus className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-lg font-medium text-gray-900 dark:text-white">Hello there</p>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-medium text-gray-800 dark:text-[#e3e3e3] leading-tight">
                                How can I help <br className="sm:hidden" /> you today?
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5 max-w-3xl">
                            {currentSuggestions.map((suggestion, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => {
                                        const fd = new FormData();
                                        fd.set('query', suggestion.query);
                                        onFormAction(fd);
                                    }}
                                    className="flex items-center gap-3.5 p-3.5 bg-white dark:bg-[#1e1f20] rounded-2xl text-left border border-gray-100 dark:border-transparent hover:border-primary/30 transition-all active:scale-[0.98] group shadow-sm"
                                >
                                    <div className="p-2 bg-gray-50 dark:bg-[#131314] rounded-xl">
                                        <suggestion.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-700 dark:text-[#c4c7c5]">{suggestion.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-3">
                             <div className="flex items-center gap-2 px-1">
                                <BrainCircuit className="w-4 h-4 text-primary/60" />
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect with Specialists</p>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                                {doctorSpecialties.map(spec => (
                                    <Button key={spec} variant="ghost" onClick={() => { setSpecialty(spec); setActiveMode('doctor'); handleNewChat(); }}
                                            className="h-9 px-4 rounded-full bg-white dark:bg-[#1e1f20] text-[10px] font-black uppercase tracking-widest shadow-sm border border-gray-100 dark:border-[#3c4043] dark:text-[#e3e3e3]">
                                        {spec}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            ) : (
                <ScrollArea className="flex-1 px-4 md:px-8 py-8" ref={scrollAreaRef}>
                    <div className="max-w-3xl mx-auto space-y-8 pb-32">
                        {activeSession?.messages.map((m, i) => (
                            <div key={i} className={cn("animate-in fade-in slide-in-from-bottom-2 duration-500", m.role === 'user' ? "flex flex-col items-end" : "flex flex-col items-start")}>
                                {m.role === 'user' ? (
                                    <div className="max-w-[85%] rounded-[24px] rounded-tr-sm bg-[#e9eef6] dark:bg-[#282a2c] px-4 py-3 text-gray-900 dark:text-[#e3e3e3] shadow-sm">
                                        {m.image && (
                                            <div className="mb-2 rounded-xl overflow-hidden border border-gray-200">
                                                <Image src={m.image} alt="Report" width={250} height={250} className="w-full h-auto" />
                                            </div>
                                        )}
                                        <p className="text-sm font-medium leading-relaxed">{m.content}</p>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-3.5 w-full group">
                                        <div className="mt-1 size-6 shrink-0 flex items-center justify-center bg-primary rounded-lg shadow-sm">
                                            <ShieldPlus className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <article className="prose prose-base dark:prose-invert max-w-none text-gray-800 dark:text-[#e3e3e3] leading-relaxed">
                                                <ReactMarkdown>{m.content}</ReactMarkdown>
                                            </article>
                                            
                                            <div className="mt-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-2">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleSpeak(m.content)}>
                                                    <Volume2 className="w-4 h-4 text-gray-400" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => { navigator.clipboard.writeText(m.content); toast({title: "Copied"}); }}>
                                                    <Copy className="w-4 h-4 text-gray-400" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isPending && (
                             <div className="flex items-start gap-4 w-full">
                                <div className="mt-1 size-6 shrink-0 flex items-center justify-center bg-primary/20 rounded-lg animate-pulse">
                                    <ShieldPlus className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div className="space-y-2 flex-1 pt-1">
                                    <div className="h-2.5 bg-gray-200 dark:bg-[#3c4043] rounded-full w-3/4 animate-pulse" />
                                    <div className="h-2.5 bg-gray-200 dark:bg-[#3c4043] rounded-full w-1/2 animate-pulse" />
                                    <div className="flex items-center gap-2 mt-4">
                                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            )}
        </main>

        <footer className="px-4 pb-8 pt-2 z-40 shrink-0 bg-transparent">
            <form ref={formRef} action={onFormAction} className="max-w-3xl mx-auto flex flex-col gap-3">
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

                <div className="relative flex flex-col rounded-[28px] bg-white dark:bg-[#1e1f20] shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08)] transition-all p-2.5 border border-transparent focus-within:border-gray-200 dark:focus-within:border-[#3c4043]">
                    <div className="flex-1 max-h-48 overflow-y-auto">
                        <Textarea
                            ref={queryInputRef}
                            name="query"
                            placeholder="Ask Medical Partner"
                            className="w-full min-h-[44px] max-h-[160px] px-3 py-2 border-none bg-transparent shadow-none focus-visible:ring-0 font-medium text-[16px] text-gray-800 dark:text-[#e3e3e3] placeholder:text-gray-500 resize-none"
                            rows={1}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                                setIsTyping(target.value.length > 0);
                            }}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); formRef.current?.requestSubmit(); } }}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-50 dark:border-[#3c4043]">
                        <div className="flex items-center gap-1">
                            <Button type="button" variant="ghost" size="icon" onClick={() => queryInputRef.current?.closest('body')?.querySelector<HTMLInputElement>('#file-upload')?.click()} className="h-9 w-9 rounded-full">
                                <Plus className="h-5 w-5 text-gray-500" />
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
                                        <Button type="button" variant="ghost" className="h-9 px-3 rounded-full gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            <Zap className="h-4 w-4 text-primary" />
                                            <span className="hidden sm:inline">Modes</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-60 rounded-2xl p-2 mb-4 bg-white dark:bg-[#1e1f20]" side="top" align="start">
                                        <RadioGroup value={pulseMode} onValueChange={(v) => setPulseMode(v as PulseMode)} className="gap-1">
                                            <PulseModeItem value="standard" label="Balanced" icon={<ShieldPlus className="w-3.5 h-3.5"/>} />
                                            <PulseModeItem value="websearch" label="Deep Search" icon={<Search className="w-3.5 h-3.5"/>} />
                                            <PulseModeItem value="deepthink" label="Logic Think" icon={<BrainCircuit className="w-3.5 h-3.5"/>} />
                                            <PulseModeItem value="proanalysis" label="Pharmacist" icon={<Pill className="w-3.5 h-3.5"/>} />
                                        </RadioGroup>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                             {!isTyping && !isRecording && (
                                <Button type="button" variant="ghost" size="icon" onClick={startRecording} className="h-9 w-9 rounded-full">
                                    <Mic className="w-4 h-4 text-gray-500" />
                                </Button>
                            )}
                            {(isTyping || isRecording) && (
                                <div className="flex items-center gap-2">
                                    {isRecording && (
                                        <Button type="button" size="icon" onClick={stopRecording} className="h-9 w-9 rounded-full bg-red-500 text-white animate-pulse">
                                            <MicOff className="w-4 h-4" />
                                        </Button>
                                    )}
                                    <Button type="submit" disabled={isPending} className="h-9 w-9 rounded-full bg-[#d3e3fd] text-gray-900 dark:bg-[#1f3760] dark:text-white transition-all">
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <SendHorizonal className="w-4 h-4" />}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest mt-1">Medical Partner may display inaccurate info.</p>
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
            <Label htmlFor={value} className="flex-1 cursor-pointer font-bold text-[10px] text-gray-700 dark:text-[#e3e3e3] uppercase tracking-wider">
                {label}
            </Label>
        </div>
    )
}
