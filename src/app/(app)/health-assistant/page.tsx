
'use client';

import React, { useActionState, useRef, useEffect, useState, useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
    Send, 
    Loader2, 
    Paperclip, 
    Mic, 
    MicOff, 
    X, 
    Volume2, 
    PlusCircle, 
    BrainCircuit, 
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
    ArrowRight,
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
  "Neurologist", "Oncologist", "Gynecologist", "Orthopedist",
  "Endocrinologist", "Psychiatrist",
];

const smartSuggestions = [
    { label: "Check Symptoms", query: "I have a sudden headache and dizziness, what could it be?", icon: Activity },
    { label: "Identify Medicine", query: "What are the common uses and side effects of Paracetamol 500mg?", icon: Pill },
    { label: "Health Tips", query: "Give me 5 daily habits to improve heart health.", icon: Sparkles },
    { label: "Understand Disease", query: "Explain Type 2 Diabetes in simple terms.", icon: Stethoscope },
];

const initialState = { response: null, error: null };
const initialSpeechState = { transcript: null, error: null };

export default function HealthAssistantPage() {
  const [activeMode, setActiveMode] = useState<'general' | 'doctor'>('general');
  const [historyTab, setHistoryTab] = useState<'general' | 'doctor'>('general');
  const [specialty, setSpecialty] = useState<string>("General Physician");
  const [pulseMode, setPulseMode] = useState<PulseMode>('standard');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showControls, setShowControls] = useState(true);
  
  const [generalSessions, setGeneralSessions] = useState<Session[]>([]);
  const [doctorSessions, setDoctorSessions] = useState<Session[]>([]);
  const [activeGeneralId, setActiveGeneralId] = useState<string | null>(null);
  const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);

  const [generalState, generalAction, isGeneralPending] = useActionState(healthAssistantAction, initialState);
  const [doctorState, doctorAction, isDoctorPending] = useActionState(aiDoctorChatAction, initialState);

  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const isPending = activeMode === 'general' ? isGeneralPending : isDoctorPending;
  const currentSessionId = activeMode === 'general' ? activeGeneralId : activeDoctorId;
  const currentSessions = activeMode === 'general' ? generalSessions : doctorSessions;
  const activeSession = (activeMode === 'general' ? generalSessions : doctorSessions).find(s => s.id === currentSessionId);
  const hasMessages = (activeSession?.messages.length ?? 0) > 0;

  // Sync Logic
  const syncResponse = useCallback((state: typeof initialState) => {
    if ((state.response || state.error) && currentSessionId) {
        const content = state.response || `Error: ${state.error}`;
        const setter = activeMode === 'general' ? setGeneralSessions : setDoctorSessions;
        setter(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...s.messages, { role: 'assistant', content }] } : s));
    }
  }, [currentSessionId, activeMode]);

  useEffect(() => { if (!isGeneralPending) syncResponse(generalState); }, [generalState, isGeneralPending, syncResponse]);
  useEffect(() => { if (!isDoctorPending) syncResponse(doctorState); }, [doctorState, isDoctorPending, syncResponse]);

  // History & Session Management
  const handleNewChat = useCallback(() => {
    const id = `session-${Date.now()}`;
    const newSession: Session = {
      id,
      title: activeMode === 'doctor' ? `${specialty}` : 'New Health Chat',
      messages: [],
      createdAt: Date.now(),
      ...(activeMode === 'doctor' && { specialty }),
    };
    if (activeMode === 'general') { setGeneralSessions(prev => [newSession, ...prev]); setActiveGeneralId(id); }
    else { setDoctorSessions(prev => [newSession, ...prev]); setActiveDoctorId(id); }
    setAttachedImage(null);
  }, [activeMode, specialty]);

  useEffect(() => {
    const key_gen = 'healthAssistantSessions_general';
    const key_doc = 'healthAssistantSessions_doctor';
    const saved_gen = localStorage.getItem(key_gen);
    const saved_doc = localStorage.getItem(key_doc);
    
    if (saved_gen) {
        const parsed = JSON.parse(saved_gen);
        setGeneralSessions(parsed);
        if (activeMode === 'general' && parsed.length) setActiveGeneralId(parsed[0].id);
    }
    if (saved_doc) {
        const parsed = JSON.parse(saved_doc);
        setDoctorSessions(parsed);
        if (activeMode === 'doctor' && parsed.length) setActiveDoctorId(parsed[0].id);
    }

    if (!saved_gen && activeMode === 'general') handleNewChat();
    if (!saved_doc && activeMode === 'doctor') handleNewChat();

  }, [handleNewChat]);

  useEffect(() => {
    localStorage.setItem('healthAssistantSessions_general', JSON.stringify(generalSessions));
    localStorage.setItem('healthAssistantSessions_doctor', JSON.stringify(doctorSessions));
  }, [generalSessions, doctorSessions]);

  const onFormAction = (formData: FormData | string) => {
    let query: string;
    let finalFormData: FormData;

    if (typeof formData === 'string') {
        query = formData;
        finalFormData = new FormData();
        finalFormData.set('query', query);
    } else {
        query = formData.get('query') as string;
        finalFormData = formData;
    }

    if (!query && !attachedImage) return;

    const userMessage: Message = { 
        role: 'user', 
        content: query || 'Analyze attached image',
        mode: activeMode === 'general' ? pulseMode : undefined,
        image: attachedImage || undefined
    };
    
    const setter = activeMode === 'general' ? setGeneralSessions : setDoctorSessions;
    setter(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...s.messages, userMessage], title: (s.messages.length === 0 && query) ? query.substring(0, 30) : s.title } : s));
    
    finalFormData.set('history', JSON.stringify(activeSession?.messages || []));
    if (attachedImage) finalFormData.set('photoDataUri', attachedImage);

    if (activeMode === 'doctor') { finalFormData.set('specialty', specialty); doctorAction(finalFormData); }
    else { finalFormData.set('mode', pulseMode); generalAction(finalFormData); }
    
    formRef.current?.reset();
    if(queryInputRef.current) {
        queryInputRef.current.value = '';
        queryInputRef.current.style.height = 'auto';
    }
    setAttachedImage(null);
    setIsTyping(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    if (scrollTop > lastScrollTop.current && scrollTop > 100) {
        setShowControls(false);
    } else {
        setShowControls(true);
    }
    lastScrollTop.current = scrollTop;
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [activeSession?.messages, isPending]);

  const deleteSession = (e: React.MouseEvent, sessionId: string, mode: 'general' | 'doctor') => {
    e.stopPropagation();
    const setter = mode === 'general' ? setGeneralSessions : setDoctorSessions;
    setter(prev => prev.filter(s => s.id !== sessionId));
    if (sessionId === currentSessionId) {
        if (mode === 'general') setActiveGeneralId(null);
        else setActiveDoctorId(null);
    }
    toast({ title: 'Chat deleted' });
  };

  // Voice Recording
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
          speechFormAction(formData);
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
    <div className="flex flex-col h-[100dvh] w-full bg-white dark:bg-slate-950 overflow-hidden fixed inset-0">
        
        <header className="h-14 border-b flex items-center justify-between px-4 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-30">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="h-9 w-9 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                    <Menu className="w-4 h-4 text-primary" />
                </SidebarTrigger>
                <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 mx-1" />
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                        {activeMode === 'doctor' ? <BrainCircuit className="w-4 h-4 text-primary" /> : <ShieldPlus className="w-4 h-4 text-primary" />}
                    </div>
                    <h1 className="text-xs font-black tracking-tight text-slate-800 dark:text-slate-100 uppercase truncate">
                        {activeMode === 'doctor' ? specialty : "AI Health Assistant"}
                    </h1>
                </div>
            </div>

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10" onClick={() => setHistoryTab(activeMode)}>
                        <History className="w-5 h-5 text-slate-500" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] p-0 border-none rounded-l-[2rem] shadow-2xl flex flex-col">
                    <SheetHeader className="p-6 pb-2">
                        <SheetTitle className="text-primary uppercase font-black text-sm tracking-widest">Chat History</SheetTitle>
                    </SheetHeader>
                    <div className="px-6 pb-4">
                         <Tabs value={historyTab} onValueChange={(v) => setHistoryTab(v as any)} className="w-full">
                            <TabsList className="grid grid-cols-2 h-10 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                                <TabsTrigger value="general" className="rounded-lg font-black text-[9px] uppercase">Assistant</TabsTrigger>
                                <TabsTrigger value="doctor" className="rounded-lg font-black text-[9px] uppercase">Specialists</TabsTrigger>
                            </TabsList>
                         </Tabs>
                    </div>
                    <ScrollArea className="flex-1 p-6 pt-0">
                        <Button variant="outline" className="w-full h-12 rounded-2xl mb-6 font-black uppercase text-[10px] tracking-widest" onClick={handleNewChat}>
                            <PlusCircle className="mr-2 h-4 w-4" /> New Chat
                        </Button>
                        <div className="space-y-3 pb-20">
                            {(historyTab === 'general' ? generalSessions : doctorSessions).map(session => (
                                <div key={session.id} 
                                     onClick={() => {
                                         setActiveMode(historyTab);
                                         if (historyTab === 'general') setActiveGeneralId(session.id);
                                         else { setActiveDoctorId(session.id); setSpecialty(session.specialty || "General Physician"); }
                                     }}
                                     className={cn("group p-4 rounded-2xl border shadow-sm cursor-pointer transition-all active:scale-[0.98] relative", (historyTab === 'general' ? activeGeneralId : activeDoctorId) === session.id ? "bg-primary/5 border-primary/30" : "bg-white/40 border-transparent hover:bg-white")}>
                                    <div className="pr-8">
                                        <p className="text-xs font-black truncate">{session.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[8px] font-bold text-slate-400 uppercase">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</p>
                                            {session.specialty && <p className="text-[8px] font-black text-primary uppercase">• {session.specialty}</p>}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-300 hover:text-red-500 rounded-full" onClick={(e) => deleteSession(e, session.id, historyTab)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </header>

        <main className="flex-1 overflow-hidden relative flex flex-col w-full">
            {!hasMessages && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-start p-8 text-center bg-white dark:bg-slate-950 animate-in fade-in duration-700">
                    
                    {/* Hero Section */}
                    <div className="mt-12 md:mt-20 space-y-6 flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-3xl animate-pulse scale-150" />
                            <div className="relative p-6 bg-primary/5 rounded-[3rem] border border-primary/10 backdrop-blur-sm shadow-xl">
                                <ShieldPlus className="w-16 h-16 text-primary" />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tighter uppercase">Your Medical Partner</h2>
                            <p className="text-[11px] font-black text-primary/60 uppercase tracking-[0.4em] leading-none">Intelligence • Compassion • Care</p>
                        </div>
                    </div>

                    {/* Mode Selection */}
                    <Tabs defaultValue="general" value={activeMode} onValueChange={(v) => setActiveMode(v as any)} className="w-full max-w-sm mt-12">
                        <TabsList className="grid grid-cols-2 h-14 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] mb-8">
                            <TabsTrigger value="general" className="rounded-xl font-black text-[10px] uppercase transition-all data-[state=active]:bg-white data-[state=active]:shadow-lg">AI Assistant</TabsTrigger>
                            <TabsTrigger value="doctor" className="rounded-xl font-black text-[10px] uppercase transition-all data-[state=active]:bg-white data-[state=active]:shadow-lg">Specialists</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="doctor" className="animate-in zoom-in-95 duration-300">
                            <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                {doctorSpecialties.map(spec => (
                                    <Button key={spec} variant="outline" onClick={() => { setSpecialty(spec); setActiveMode('doctor'); }}
                                            className={cn("h-auto py-4 rounded-2xl text-[10px] font-black uppercase flex flex-col gap-2 border-slate-100 transition-all active:scale-95 shadow-sm", 
                                            specialty === spec && activeMode === 'doctor' ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20" : "hover:border-primary/30")}>
                                        <div className={cn("p-2 rounded-lg", specialty === spec ? "bg-primary/20" : "bg-slate-50")}>
                                            <BrainCircuit className="w-4 h-4" />
                                        </div>
                                        {spec}
                                    </Button>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Smart Suggestions Grid */}
                    <div className="mt-auto w-full max-w-xl pb-10">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Quick Insights</p>
                        <div className="grid grid-cols-2 gap-3">
                            {smartSuggestions.map((suggestion, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => onFormAction(suggestion.query)}
                                    className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-left border border-transparent hover:border-primary/20 hover:bg-white transition-all active:scale-95 group"
                                >
                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                        <suggestion.icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-tight">{suggestion.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <ScrollArea className="flex-1 px-4 md:px-8 py-6" onScroll={handleScroll} ref={scrollAreaRef}>
                <div className="max-w-3xl mx-auto space-y-12 pb-32">
                    {activeSession?.messages.map((m, i) => (
                        <div key={i} className={cn("animate-in fade-in slide-in-from-bottom-4 duration-500", m.role === 'user' ? "flex flex-col items-end" : "flex flex-col items-start")}>
                            {m.image && (
                                <div className="mb-4 rounded-3xl overflow-hidden shadow-2xl border-4 border-white max-w-sm">
                                    <Image src={m.image} alt="Report" width={400} height={400} className="w-full h-auto" />
                                </div>
                            )}
                            <div className={cn("max-w-full text-lg leading-relaxed font-medium transition-all", 
                                m.role === 'user' ? "text-primary text-right" : "text-slate-800 dark:text-slate-200")}>
                                <div className="flex items-start gap-4">
                                    <article className="prose prose-lg dark:prose-invert max-none text-inherit">
                                        <ReactMarkdown>{m.content}</ReactMarkdown>
                                    </article>
                                    {m.role === 'assistant' && (
                                        <Button variant="ghost" size="icon" onClick={() => handleSpeak(m.content)} className="rounded-full h-8 w-8 hover:bg-primary/10 shrink-0">
                                            <Volume2 className="w-4 h-4 text-primary" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isPending && (
                        <div className="flex flex-col items-start animate-pulse">
                            <div className="h-4 w-48 bg-slate-100 dark:bg-slate-800 rounded-full mb-3" />
                            <div className="h-4 w-64 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        </div>
                    )}
                </div>
            </ScrollArea>
        </main>

        <footer className={cn("px-4 pb-8 pt-2 transition-all duration-500 transform border-t bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-40 shrink-0", 
            showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none")}>
            <form ref={formRef} action={onFormAction} className="max-w-3xl mx-auto flex items-end gap-3">
                <div className="flex flex-col gap-2 shrink-0">
                    {activeMode === 'general' && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 border-none shadow-sm">
                                    <Zap className="h-4 w-4 text-primary" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 rounded-[2rem] p-3 mb-2" side="top">
                                <RadioGroup value={pulseMode} onValueChange={(v) => setPulseMode(v as PulseMode)} className="gap-2">
                                    <PulseModeItem value="standard" label="Balanced" icon={<ShieldPlus className="w-4 h-4"/>} />
                                    <PulseModeItem value="websearch" label="Deep Search" icon={<Search className="w-4 h-4"/>} />
                                    <PulseModeItem value="deepthink" label="Logic Think" icon={<BrainCircuit className="w-4 h-4"/>} />
                                    <PulseModeItem value="proanalysis" label="Pharmacist" icon={<PlusCircle className="w-4 h-4"/>} />
                                </RadioGroup>
                            </PopoverContent>
                        </Popover>
                    )}
                    <Button type="button" variant="ghost" size="icon" onClick={() => queryInputRef.current?.parentElement?.nextElementSibling?.click()} className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 border-none shadow-sm">
                        <Paperclip className="h-4 w-4 text-slate-400" />
                    </Button>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const r = new FileReader();
                            r.onload = (ev) => setAttachedImage(ev.target?.result as string);
                            r.readAsDataURL(file);
                        }
                    }} />
                </div>

                <div className="flex-1 relative bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner group transition-all">
                    <Textarea
                        ref={queryInputRef}
                        name="query"
                        placeholder="Ask anything about your health..."
                        className="w-full min-h-[56px] max-h-[160px] p-4 pr-12 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-base resize-none"
                        rows={1}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                            setIsTyping(target.value.length > 0);
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); formRef.current?.requestSubmit(); } }}
                    />
                    {!isTyping && !isRecording && (
                        <Button type="button" variant="ghost" size="icon" onClick={startRecording} className="absolute right-2 bottom-2 h-10 w-10 rounded-full text-primary hover:bg-primary/10">
                            <Mic className="w-5 h-5" />
                        </Button>
                    )}
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                    <Button type="submit" disabled={isPending} className="h-14 w-14 rounded-full bg-primary shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </Button>
                    {(isTyping || isRecording) && (
                        <Button type="button" size="icon" onClick={isRecording ? stopRecording : startRecording} className={cn("h-10 w-14 rounded-full animate-in zoom-in duration-300 transition-all", isRecording ? "bg-red-500 text-white animate-pulse" : "bg-slate-100 dark:bg-slate-800 text-primary")}>
                            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                    )}
                </div>
            </form>
            
            {attachedImage && (
                <div className="max-w-3xl mx-auto mt-3 px-12">
                    <div className="relative inline-block w-16 h-16 animate-in zoom-in-95">
                        <Image src={attachedImage} alt="Preview" width={64} height={64} className="rounded-2xl border-2 border-white shadow-xl object-cover h-full w-full" />
                        <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => setAttachedImage(null)}><X className="h-3 w-3" /></Button>
                    </div>
                </div>
            )}
        </footer>
    </div>
  );
}

function PulseModeItem({ value, label, icon }: { value: PulseMode, label: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent has-[:checked]:border-primary/20 has-[:checked]:bg-primary/5 group cursor-pointer">
            <RadioGroupItem value={value} id={value} className="sr-only" />
            <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <Label htmlFor={value} className="flex-1 cursor-pointer font-black text-[11px] text-slate-800 dark:text-slate-100 uppercase">
                {label}
            </Label>
        </div>
    )
}
