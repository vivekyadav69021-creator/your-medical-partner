
'use client';

import React, { useActionState, useRef, useEffect, useState, useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
    Send, 
    User, 
    Loader2, 
    Paperclip, 
    Mic, 
    MicOff, 
    X, 
    Volume2, 
    StopCircle, 
    ThumbsUp, 
    ThumbsDown, 
    Copy, 
    PlusCircle, 
    Trash2, 
    BrainCircuit, 
    Activity, 
    ShieldPlus,
    Search,
    Zap,
    HeartPulse,
    History,
} from 'lucide-react';
import { healthAssistantAction, speechToTextAction, aiDoctorChatAction } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
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

const initialState = { response: null, error: null };
const initialSpeechState = { transcript: null, error: null };

// --- Sub-Components (Modular Flutter-like approach) ---

function ChatBubble({ message, isLast, isPending, Icon }: { message: Message, isLast: boolean, isPending: boolean, Icon: any }) {
    const isUser = message.role === 'user';
    const assistantImage = PlaceHolderImages.find(img => img.id === 'assistant-avatar');
    const userImage = 'https://picsum.photos/seed/user/100/100';

    return (
        <div className={cn("flex items-start gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300", isUser ? "flex-row-reverse" : "flex-row")}>
            <Avatar className="h-10 w-10 border-2 border-white dark:border-slate-800 shadow-md shrink-0">
                {isUser ? (
                    <>
                        <AvatarImage src={userImage} alt="User" />
                        <AvatarFallback className="bg-slate-200"><User className="w-5 h-5"/></AvatarFallback>
                    </>
                ) : (
                    <>
                        {assistantImage && <AvatarImage src={assistantImage.imageUrl} alt="AI" />}
                        <AvatarFallback className="bg-primary text-white"><Icon className="w-5 h-5"/></AvatarFallback>
                    </>
                )}
            </Avatar>
            <div className={cn("max-w-[85%] md:max-w-[75%] rounded-[1.5rem] px-5 py-4 shadow-sm border transition-all", 
                isUser ? "bg-primary text-white rounded-tr-none border-primary/10" : "bg-white dark:bg-slate-800 text-[#2D3A5D] dark:text-slate-100 rounded-tl-none border-white/50 dark:border-slate-700/50")}>
                {message.image && (
                    <div className="mb-3 rounded-xl overflow-hidden shadow-md border-2 border-white dark:border-slate-700">
                        <Image src={message.image} alt="Upload" width={300} height={300} className="w-full h-auto object-cover" />
                    </div>
                )}
                {isUser && message.mode && message.mode !== 'standard' && (
                    <div className="flex items-center gap-1.5 mb-2 px-2 py-0.5 bg-white/20 rounded-full w-fit">
                        <Zap className="w-3 h-3 text-white" />
                        <span className="text-[8px] font-black uppercase tracking-widest">{message.mode}</span>
                    </div>
                )}
                <article className="prose prose-sm dark:prose-invert max-w-none text-inherit leading-relaxed font-medium">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                </article>
                {!isUser && isLast && !isPending && <FeedbackActions messageContent={message.content} />}
            </div>
        </div>
    );
}

function FeedbackActions({ messageContent }: { messageContent: string }) {
  const { toast } = useToast();
  const handleCopy = () => {
    navigator.clipboard.writeText(messageContent);
    toast({ title: 'Copied to clipboard!' });
  };
  return (
    <div className="mt-3 flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5" onClick={() => toast({ title: "Thanks for feedback!" })}>
        <ThumbsUp className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-black/5" onClick={handleCopy}>
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function VoiceWidget({ lastAssistantMessage, onTranscript }: { lastAssistantMessage: string, onTranscript: (text: string) => void }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [speechState, speechFormAction, isTranscribing] = useActionState(speechToTextAction, initialSpeechState);
  const { toast } = useToast();

  useEffect(() => {
    if (speechState.transcript) onTranscript(speechState.transcript);
    if (speechState.error) toast({ variant: 'destructive', title: 'Recognition Failed', description: speechState.error });
  }, [speechState, onTranscript, toast]);

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
          const formData = new FormData();
          formData.append('audioDataUri', reader.result as string);
          speechFormAction(formData);
        };
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (e) { toast({ variant: 'destructive', title: 'Mic Error' }); }
  };

  const handleSpeak = () => {
    if (!window.speechSynthesis || !lastAssistantMessage) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.replace(/[*#_`]/g, ''));
    utterance.lang = selectedLang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Card className="rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 shadow-sm mb-4">
        <CardContent className="p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Select value={selectedLang} onValueChange={setSelectedLang}>
                    <SelectTrigger className="w-[90px] h-8 text-[9px] font-black uppercase bg-white/80 dark:bg-slate-800 rounded-full border-none shadow-sm focus:ring-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                        <SelectItem value="en-IN">English</SelectItem>
                        <SelectItem value="hi-IN">हिन्दी</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className={cn("h-8 w-8 rounded-full bg-white dark:bg-slate-800 shadow-sm transition-all", isSpeaking && "text-primary ring-2 ring-primary/20")} onClick={handleSpeak}>
                    <Volume2 className="h-4 w-4" />
                </Button>
            </div>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={isRecording ? () => mediaRecorderRef.current?.stop() : startRecording}
                disabled={isTranscribing}
                className={cn("rounded-full px-4 h-8 font-black text-[9px] uppercase tracking-widest border-none transition-all", 
                    isRecording ? "bg-red-500 text-white animate-pulse" : "bg-primary text-white hover:bg-primary/90")}
            >
                {isTranscribing ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : (isRecording ? <MicOff className="h-3 w-3 mr-1.5" /> : <Mic className="h-3 w-3 mr-1.5" />)}
                {isRecording ? "Stop" : "Voice"}
            </Button>
        </CardContent>
    </Card>
  );
}

// --- Main Page ---

export default function HealthAssistantPage() {
  const [activeMode, setActiveMode] = useState<'general' | 'doctor'>('general');
  const [specialty, setSpecialty] = useState<string>("General Physician");
  const [pulseMode, setPulseMode] = useState<PulseMode>('standard');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
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

  const isPending = activeMode === 'general' ? isGeneralPending : isDoctorPending;
  const currentSessionId = activeMode === 'general' ? activeGeneralId : activeDoctorId;
  const currentSessions = activeMode === 'general' ? generalSessions : doctorSessions.filter(s => s.specialty === specialty);
  const activeSession = currentSessions.find(s => s.id === currentSessionId);

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
    const key = `healthAssistantSessions_${activeMode}`;
    const saved = localStorage.getItem(key);
    if (saved) {
        const parsed = JSON.parse(saved);
        if (activeMode === 'general') { setGeneralSessions(parsed); if (parsed.length) setActiveGeneralId(parsed[0].id); else handleNewChat(); }
        else { setDoctorSessions(parsed); const rel = parsed.filter((s: Session) => s.specialty === specialty); if (rel.length) setActiveDoctorId(rel[0].id); else handleNewChat(); }
    } else handleNewChat();
  }, [activeMode, specialty, handleNewChat]);

  useEffect(() => {
    if (generalSessions.length) localStorage.setItem('healthAssistantSessions_general', JSON.stringify(generalSessions));
    if (doctorSessions.length) localStorage.setItem('healthAssistantSessions_doctor', JSON.stringify(doctorSessions));
  }, [generalSessions, doctorSessions]);

  const onFormAction = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query && !attachedImage) return;

    const userMessage: Message = { 
        role: 'user', 
        content: query || 'Analyze attached image',
        mode: activeMode === 'general' ? pulseMode : undefined,
        image: attachedImage || undefined
    };
    
    const setter = activeMode === 'general' ? setGeneralSessions : setDoctorSessions;
    setter(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: [...s.messages, userMessage], title: (s.messages.length === 0 && query) ? query.substring(0, 30) : s.title } : s));
    
    formData.set('history', JSON.stringify(activeSession?.messages || []));
    if (attachedImage) formData.set('photoDataUri', attachedImage);

    if (activeMode === 'doctor') { formData.set('specialty', specialty); doctorAction(formData); }
    else { formData.set('mode', pulseMode); generalAction(formData); }
    
    formRef.current?.reset();
    if(queryInputRef.current) queryInputRef.current.value = '';
    setAttachedImage(null);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [activeSession?.messages, isPending]);

  return (
    <div className="flex h-[calc(100vh-140px)] w-full gap-6 animate-in fade-in duration-500 overflow-hidden pt-2">
        {/* Sidebar - Desktop Only */}
        <Card className="hidden md:flex md:w-1/4 flex-col rounded-[2rem] neumorphic-card border-none overflow-hidden shrink-0">
            <CardHeader className="flex-row items-center justify-between px-6 pt-6 pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">History</CardTitle>
                <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 dark:bg-slate-800" onClick={handleNewChat}><PlusCircle className="h-5 w-5 text-primary" /></Button>
            </CardHeader>
            <ScrollArea className="flex-1 p-2">
                <div className="space-y-2 pb-10">
                    {(activeMode === 'general' ? generalSessions : doctorSessions.filter(s => s.specialty === specialty)).map(session => (
                        <div key={session.id} onClick={() => activeMode === 'general' ? setActiveGeneralId(session.id) : setActiveDoctorId(session.id)}
                             className={cn("p-4 rounded-2xl cursor-pointer group flex items-center justify-between transition-all border", 
                             currentSessionId === session.id ? "bg-white dark:bg-slate-800 shadow-lg border-primary/20" : "bg-transparent border-transparent hover:bg-white/40")}>
                            <div className="flex-1 min-w-0">
                                <p className={cn("text-xs font-black truncate", currentSessionId === session.id ? "text-primary" : "text-slate-600 dark:text-slate-300")}>{session.title}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col h-full min-w-0 w-full overflow-hidden">
            <Tabs defaultValue="general" value={activeMode} onValueChange={(v) => setActiveMode(v as any)} className="flex-1 flex flex-col h-full w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 shrink-0">
                    <TabsList className="grid grid-cols-2 w-full sm:w-[280px] h-11 p-1 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/60 backdrop-blur-md">
                        <TabsTrigger value="general" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Assistant</TabsTrigger>
                        <TabsTrigger value="doctor" className="rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Specialists</TabsTrigger>
                    </TabsList>
                    
                    <div className="flex items-center gap-2">
                        {activeMode === 'doctor' && (
                            <Select value={specialty} onValueChange={setSpecialty}>
                                <SelectTrigger className="h-11 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-white/60 shadow-md font-black text-[10px] uppercase tracking-widest px-4 min-w-[160px]">
                                    <SelectValue placeholder="Specialty" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl">
                                    {doctorSpecialties.map(spec => <SelectItem key={spec} value={spec} className="font-bold text-xs rounded-xl">{spec}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        )}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="md:hidden rounded-2xl h-11 w-11 bg-white/60 dark:bg-slate-800/60 border-white/60 shadow-md">
                                    <History className="h-5 w-5 text-primary" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[85vw] p-0 border-none rounded-l-[3rem] shadow-2xl">
                                <SheetHeader className="p-8 border-b bg-primary text-white rounded-tl-[3rem]"><SheetTitle className="text-white uppercase font-black tracking-widest">Chat History</SheetTitle></SheetHeader>
                                <ScrollArea className="h-full p-6 bg-slate-50 dark:bg-slate-950">
                                    <Button variant="outline" className="w-full h-12 rounded-2xl mb-6 font-black uppercase text-[10px] tracking-widest" onClick={handleNewChat}><PlusCircle className="mr-2 h-4 w-4" /> New Chat</Button>
                                    <div className="space-y-3 pb-20">
                                        {(activeMode === 'general' ? generalSessions : doctorSessions.filter(s => s.specialty === specialty)).map(session => (
                                            <div key={session.id} onClick={() => activeMode === 'general' ? setActiveGeneralId(session.id) : setActiveDoctorId(session.id)}
                                                 className={cn("p-4 rounded-2xl border shadow-sm", currentSessionId === session.id ? "bg-white border-primary/30" : "bg-white/40 border-transparent")}>
                                                <p className="text-xs font-black truncate">{session.title}</p>
                                                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{formatDistanceToNow(session.createdAt, { addSuffix: true })}</p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
                    <VoiceWidget lastAssistantMessage={activeSession?.messages.filter(m => m.role === 'assistant').pop()?.content || ''} onTranscript={(t) => { if(queryInputRef.current) queryInputRef.current.value = t; }}/>
                    
                    <Card className="flex-1 flex flex-col rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-2xl overflow-hidden">
                        <CardHeader className="px-6 py-4 border-b border-white/20 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl"><ShieldPlus className="w-6 h-6 text-primary" /></div>
                                <div className="min-w-0">
                                    <CardTitle className="text-lg font-black tracking-tight truncate">{activeMode === 'doctor' ? specialty : "AI Health Assistant"}</CardTitle>
                                    <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Professional Medical Intelligence</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="flex-1 overflow-hidden p-0 relative">
                            <ScrollArea className="h-full px-4 md:px-8 pb-10" ref={scrollAreaRef}>
                                <div className="space-y-8 pt-8">
                                    {(!activeSession || activeSession.messages.length === 0) && !isPending && (
                                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40 space-y-4">
                                            <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full"><BrainCircuit className="w-12 h-12 text-slate-400" /></div>
                                            <p className="text-sm font-black text-slate-400 max-w-[200px]">How can I help you today?</p>
                                        </div>
                                    )}
                                    {activeSession?.messages.map((m, i) => (
                                        <ChatBubble key={i} message={m} isLast={i === activeSession.messages.length - 1} isPending={isPending} Icon={activeMode === 'doctor' ? BrainCircuit : ShieldPlus} />
                                    ))}
                                    {isPending && (
                                        <div className="flex items-start gap-4 animate-pulse">
                                            <Avatar className="h-10 w-10 border-2 border-white bg-primary/10 shrink-0"><AvatarFallback><Loader2 className="h-5 w-5 animate-spin text-primary" /></AvatarFallback></Avatar>
                                            <div className="bg-white dark:bg-slate-800 rounded-[1.5rem] rounded-tl-none px-6 py-4 border border-white flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI is thinking...</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>

                        <CardFooter className="px-4 md:px-8 pb-6 md:pb-8 pt-4 flex-col items-stretch gap-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border-t border-white/20 shrink-0">
                            {attachedImage && (
                                <div className="relative inline-block w-20 h-20 group animate-in zoom-in-95">
                                    <Image src={attachedImage} alt="Preview" width={80} height={80} className="rounded-xl border-2 border-white shadow-lg object-cover h-full w-full" />
                                    <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg" onClick={() => setAttachedImage(null)}><X className="h-3 w-3" /></Button>
                                </div>
                            )}
                            
                            <form ref={formRef} action={onFormAction} className="flex w-full items-end gap-2 md:gap-3">
                                <div className="flex items-center gap-2 shrink-0">
                                    {activeMode === 'general' && (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 bg-white dark:bg-slate-800 shadow-md border-none hover:scale-105"><PlusCircle className="h-6 w-6 text-primary" /></Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[280px] rounded-[2rem] border-none shadow-2xl p-4 dark:bg-slate-900" side="top">
                                                <RadioGroup value={pulseMode} onValueChange={(v) => setPulseMode(v as PulseMode)} className="gap-2">
                                                    <PulseModeItem value="standard" label="Balanced" desc="General medical advice" icon={<ShieldPlus className="w-4 h-4"/>} />
                                                    <PulseModeItem value="websearch" label="Deep Search" desc="Latest 2024-25 data" icon={<Search className="w-4 h-4"/>} />
                                                    <PulseModeItem value="deepthink" label="Logic Think" desc="Complex symptom analysis" icon={<BrainCircuit className="w-4 h-4"/>} />
                                                    <PulseModeItem value="proanalysis" label="Pharmacist" desc="Drug-to-drug checks" icon={<Zap className="w-4 h-4"/>} />
                                                </RadioGroup>
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                    <Button type="button" variant="ghost" size="icon" onClick={() => queryInputRef.current?.nextElementSibling?.click()} className="rounded-2xl h-12 w-12 bg-white dark:bg-slate-800 shadow-md border-none"><Paperclip className="h-6 w-6 text-slate-400" /></Button>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const r = new FileReader();
                                            r.onload = (ev) => setAttachedImage(ev.target?.result as string);
                                            r.readAsDataURL(file);
                                        }
                                    }} />
                                </div>

                                <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl px-2 shadow-inner border border-slate-100 dark:border-slate-700 min-h-[48px] flex items-end">
                                    <Textarea
                                        ref={queryInputRef}
                                        name="query"
                                        placeholder="Ask a question..."
                                        className="flex-1 min-h-[48px] max-h-[150px] p-3 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-sm resize-none"
                                        rows={1}
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = 'auto';
                                            target.style.height = `${target.scrollHeight}px`;
                                        }}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); formRef.current?.requestSubmit(); } }}
                                    />
                                </div>
                                <Button type="submit" disabled={isPending} className="rounded-2xl h-12 w-12 bg-primary shadow-lg shadow-primary/20 shrink-0">
                                    {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                </Button>
                            </form>
                            <div className="flex items-center justify-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                <Activity className="w-3 h-3 text-primary" />
                                Professional AI Medical Insights
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </Tabs>
        </div>
    </div>
  );
}

function PulseModeItem({ value, label, desc, icon }: { value: PulseMode, label: string, desc: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent has-[:checked]:border-primary/20 has-[:checked]:bg-primary/5 group cursor-pointer">
            <RadioGroupItem value={value} id={value} className="sr-only" />
            <div className="p-2 rounded-xl bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <Label htmlFor={value} className="flex-1 cursor-pointer">
                <p className="font-black text-[11px] text-[#2D3A5D] dark:text-slate-100 leading-none">{label}</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 leading-tight">{desc}</p>
            </Label>
        </div>
    )
}
