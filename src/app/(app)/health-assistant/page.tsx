
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

const initialState = {
  response: null,
  error: null,
};

const initialSpeechState = {
  transcript: null,
  error: null,
};

const doctorSpecialties = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Neurologist",
  "Oncologist",
  "Gynecologist",
  "Orthopedist",
  "Endocrinologist",
  "Psychiatrist",
];

type PulseMode = 'standard' | 'websearch' | 'deepthink' | 'proanalysis';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="rounded-2xl h-14 w-14 bg-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0">
      {pending ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : (
        <Send className="h-6 w-6" />
      )}
      <span className="sr-only">Send message</span>
    </Button>
  );
}

function FeedbackActions({ messageContent }: { messageContent: string }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(messageContent);
    toast({ title: 'Copied to clipboard!' });
  };
  
  const handleLike = () => {
    toast({ title: 'Feedback received!', description: 'Thank you for helping us improve.' });
  };

  const handleDislikeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    toast({ title: 'Feedback received!', description: 'Thank you for your detailed feedback.' });
    setIsDialogOpen(false);
  };

  return (
    <div className="mt-4 flex items-center gap-3">
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 transition-colors" onClick={handleLike}>
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 transition-colors">
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl p-8">
          <form onSubmit={handleDislikeSubmit}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-[#2D3A5D] dark:text-slate-100">Help Us Improve</DialogTitle>
              <DialogDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em] mt-2">
                Your feedback helps our AI grow.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-6">
               <RadioGroup name="feedback-reason" defaultValue="not-helpful" className="gap-4">
                  <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <RadioGroupItem value="not-helpful" id="r1" />
                    <Label htmlFor="r1" className="font-bold text-slate-600 dark:text-slate-300">Not helpful</Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <RadioGroupItem value="incorrect" id="r2" />
                    <Label htmlFor="r2" className="font-bold text-slate-600 dark:text-slate-300">Factually incorrect</Label>
                  </div>
                   <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <RadioGroupItem value="offensive" id="r3" />
                    <Label htmlFor="r3" className="font-bold text-slate-600 dark:text-slate-300">Harmful content</Label>
                  </div>
                </RadioGroup>
                <Textarea name="feedback-details" placeholder="Anything else you'd like to share?" className="rounded-2xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner p-4 min-h-[100px]" />
            </div>
            <DialogFooter>
              <Button type="submit" className="rounded-full w-full h-12 font-black uppercase text-[11px] tracking-widest shadow-lg shadow-primary/20">Submit Feedback</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-600 transition-colors" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
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
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const [speechState, speechFormAction, isTranscribing] = useActionState(speechToTextAction, initialSpeechState);
  const { toast } = useToast();

  useEffect(() => {
    const { transcript, error } = speechState;
    if (transcript) {
      onTranscript(transcript);
      toast({ title: 'Speech recognized!' });
    }
    if (error) {
      toast({ variant: 'destructive', title: 'Recognition Failed', description: error });
    }
  }, [speechState, onTranscript, toast]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
        if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!synthRef.current || !lastAssistantMessage) return;
    synthRef.current.cancel(); 
    const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.replace(/[*#_`]/g, ''));
    utterance.lang = selectedLang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

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
      toast({ title: 'I am listening...' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Mic Access Denied' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  return (
    <Card className="rounded-[1.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/40 dark:border-slate-800/40 shadow-sm mb-4 w-full">
        <CardContent className="p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 p-1 bg-white/80 dark:bg-slate-800 rounded-full border border-blue-50 dark:border-slate-700 shadow-sm">
                    <Select value={selectedLang} onValueChange={setSelectedLang}>
                        <SelectTrigger className="w-[100px] h-9 text-[10px] font-black uppercase tracking-widest bg-transparent border-none shadow-none focus:ring-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-[1.5rem] border-none shadow-2xl">
                            <SelectItem value="en-IN" className="font-bold text-xs">English</SelectItem>
                            <SelectItem value="hi-IN" className="font-bold text-xs">हिन्दी</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-blue-50 dark:border-slate-700 transition-all", isSpeaking && "text-primary ring-2 ring-primary/20")} onClick={handleSpeak} disabled={isSpeaking || !lastAssistantMessage}>
                        <Volume2 className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-blue-50 dark:border-slate-700" onClick={handleStopSpeaking} disabled={!isSpeaking}>
                        <StopCircle className="h-5 w-5" />
                    </Button>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Button 
                    variant="ghost"
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording} 
                    disabled={isTranscribing}
                    className={cn(
                        "rounded-full px-6 h-10 font-black text-[10px] uppercase tracking-widest border-none transition-all shadow-md",
                        isRecording ? "bg-red-500 text-white animate-pulse" : "bg-primary text-white hover:bg-primary/90"
                    )}
                >
                  {isTranscribing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />)}
                  {isRecording ? "Stop" : "Voice Input"}
                </Button>
            </div>
        </CardContent>
    </Card>
  );
}


export default function HealthAssistantPage() {
  const [generalSessions, setGeneralSessions] = useState<Session[]>([]);
  const [doctorSessions, setDoctorSessions] = useState<Session[]>([]);
  const [activeGeneralSessionId, setActiveGeneralSessionId] = useState<string | null>(null);
  const [activeDoctorSessionId, setActiveDoctorSessionId] = useState<string | null>(null);

  const [generalState, generalFormAction, isGeneralPending] = useActionState(healthAssistantAction, initialState);
  const [doctorState, doctorFormAction, isDoctorPending] = useActionState(aiDoctorChatAction, initialState);
  
  const [activeMode, setActiveMode] = useState<'general' | 'doctor'>('general');
  const [specialty, setSpecialty] = useState<string>("General Physician");
  const [pulseMode, setPulseMode] = useState<PulseMode>('standard');

  const formRef = useRef<HTMLFormElement>(null);
  const queryInputRef = useRef<HTMLTextAreaElement>(null);

  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  const isPending = activeMode === 'general' ? isGeneralPending : isDoctorPending;
  const sessions = activeMode === 'general' ? generalSessions : doctorSessions.filter(s => s.specialty === specialty);
  const activeSessionId = activeMode === 'general' ? activeGeneralSessionId : activeDoctorSessionId;
  const setSessions = activeMode === 'general' ? setGeneralSessions : setDoctorSessions;
  const setActiveSessionId = activeMode === 'general' ? setActiveGeneralSessionId : setActiveDoctorSessionId;

  const handleStateUpdate = useCallback((state: typeof initialState, mode: 'general' | 'doctor') => {
      const currentSessionId = mode === 'general' ? (mode === 'general' ? activeGeneralSessionId : activeDoctorSessionId) : activeDoctorSessionId;
      const setSessionList = mode === 'general' ? setGeneralSessions : setDoctorSessions;

      if ((state.response || state.error) && currentSessionId) {
          const content = state.response || `Sorry, I encountered an error: ${state.error}`;
          setSessionList(prev => prev.map(s => 
              s.id === currentSessionId ? { ...s, messages: [...s.messages, { role: 'assistant', content }] } : s
          ));
      }
  }, [activeGeneralSessionId, activeDoctorSessionId]);

  useEffect(() => {
      if (!isGeneralPending) handleStateUpdate(generalState, 'general');
  }, [generalState, isGeneralPending, handleStateUpdate]);

  useEffect(() => {
      if (!isDoctorPending) handleStateUpdate(doctorState, 'doctor');
  }, [doctorState, isDoctorPending, handleStateUpdate]);

  useEffect(() => {
    const loadSessions = (mode: 'general' | 'doctor') => {
        const key = `healthAssistantSessions_${mode}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (mode === 'general') {
                setGeneralSessions(parsed);
                if (parsed.length > 0) setActiveGeneralSessionId(parsed[0].id);
                else handleNewChat();
            } else {
                setDoctorSessions(parsed);
                const relevant = parsed.filter((s: Session) => s.specialty === specialty);
                if (relevant.length > 0) setActiveDoctorSessionId(relevant[0].id);
                else handleNewChat();
            }
        } else {
            handleNewChat();
        }
    };
    loadSessions('general');
    loadSessions('doctor');
  }, []);

  useEffect(() => {
    if (generalSessions.length > 0) localStorage.setItem('healthAssistantSessions_general', JSON.stringify(generalSessions));
    if (doctorSessions.length > 0) localStorage.setItem('healthAssistantSessions_doctor', JSON.stringify(doctorSessions));
  }, [generalSessions, doctorSessions]);

  const handleNewChat = useCallback(() => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      title: activeMode === 'doctor' ? `${specialty} Consultation` : 'New Health Chat',
      messages: [],
      createdAt: Date.now(),
      ...(activeMode === 'doctor' && { specialty }),
    };

    if (activeMode === 'general') {
        setGeneralSessions(prev => [newSession, ...prev.filter(s => s.messages.length > 0)]);
        setActiveGeneralSessionId(newSession.id);
    } else {
        setDoctorSessions(prev => [newSession, ...prev.filter(s => s.messages.length > 0)]);
        setActiveDoctorSessionId(newSession.id);
    }
    setAttachedImage(null);
  }, [activeMode, specialty]);

  const handleDeleteChat = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) handleNewChat();
  };
  
  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleFormAction = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query && !attachedImage) return;

    let userMessage: Message = { 
        role: 'user', 
        content: query || 'Analyze attached medical image',
        mode: activeMode === 'general' ? pulseMode : undefined 
    };
     if (attachedImage) {
      userMessage.image = attachedImage;
      formData.set('photoDataUri', attachedImage);
    }
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const newTitle = (s.messages.length === 0 && query) ? query.substring(0, 40) : s.title;
        return { ...s, messages: [...s.messages, userMessage], title: newTitle };
      }
      return s;
    }));
    
    formData.set('history', JSON.stringify(activeSession?.messages || []));
    
    if (activeMode === 'doctor') {
      formData.set('specialty', specialty);
      doctorFormAction(formData);
    } else {
      formData.set('mode', pulseMode);
      generalFormAction(formData);
    }
    
    formRef.current?.reset();
    if(queryInputRef.current) queryInputRef.current.value = '';
    setAttachedImage(null);
  }

  const assistantImage = PlaceHolderImages.find(img => img.id === 'assistant-avatar');
  const userImage = 'https://picsum.photos/seed/user/100/100';

  return (
    <div className="flex h-[calc(100vh-140px)] w-full gap-6 animate-in fade-in duration-500 overflow-hidden pt-2">
        {/* Chat History Sidebar - Desktop Only */}
        <Card className="hidden md:flex md:w-1/4 flex-col rounded-[2rem] neumorphic-card border-none p-2 overflow-hidden shrink-0">
            <CardHeader className="flex-row items-center justify-between pb-2 px-6 pt-6">
                <CardTitle className="text-xs font-black text-[#2D3A5D] dark:text-slate-100 uppercase tracking-widest">Chat History</CardTitle>
                <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 dark:bg-slate-800 border border-white/50 dark:border-slate-700/50 shadow-sm" onClick={handleNewChat}>
                    <PlusCircle className="h-5 w-5 text-primary" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-2">
                <ScrollArea className="h-full px-2">
                    <div className="space-y-3 pb-6">
                        {sessions.map(session => (
                            <div 
                                key={session.id} 
                                className={cn(
                                    "p-4 rounded-2xl cursor-pointer group flex items-center justify-between transition-all border border-transparent",
                                    activeSessionId === session.id ? "bg-white dark:bg-slate-800 shadow-lg border-blue-50/50 dark:border-slate-700" : "hover:bg-white/40 dark:hover:bg-slate-700/40"
                                )}
                                onClick={() => setActiveSessionId(session.id)}
                            >
                                <div className="flex-1 overflow-hidden">
                                  <p className={cn("text-xs font-black truncate tracking-tight", activeSessionId === session.id ? "text-primary" : "text-[#2D3A5D] dark:text-slate-200")}>{session.title}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400" onClick={(e) => {e.stopPropagation(); handleDeleteChat(session.id);}}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 w-full overflow-hidden">
          <Tabs defaultValue="general" value={activeMode} onValueChange={(v) => setActiveMode(v as any)} className="flex-1 flex flex-col h-full w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 px-1 shrink-0">
                <TabsList className="grid grid-cols-2 w-full sm:w-[320px] h-12 p-1.5 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/60 dark:border-slate-700/60 backdrop-blur-md shadow-sm">
                    <TabsTrigger value="general" className="rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">Assistant</TabsTrigger>
                    <TabsTrigger value="doctor" className="rounded-xl font-black text-[10px] md:text-[11px] uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">Specialists</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-3">
                    {activeMode === 'doctor' && (
                        <div className="flex-1 min-w-[160px] md:min-w-[280px]">
                            <Select value={specialty} onValueChange={setSpecialty}>
                                <SelectTrigger className="h-12 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-slate-700/60 shadow-md font-black text-[10px] md:text-[11px] uppercase tracking-widest px-4">
                                    <div className="flex items-center gap-3 truncate">
                                        <BrainCircuit className="w-4 h-4 text-primary shrink-0" />
                                        <SelectValue placeholder="Choose Specialty" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                    {doctorSpecialties.map(spec => (
                                        <SelectItem key={spec} value={spec} className="font-bold text-xs rounded-xl py-3">{spec}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    
                    {/* Mobile History Button */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="md:hidden rounded-2xl h-12 w-12 bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-slate-700/60 shadow-md">
                                <History className="h-5 w-5 text-primary" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 border-none rounded-l-[3rem] shadow-2xl">
                            <SheetHeader className="p-8 border-b bg-primary text-white rounded-tl-[3rem]">
                                <SheetTitle className="text-xl font-black uppercase tracking-widest text-white">Chat History</SheetTitle>
                            </SheetHeader>
                            <div className="flex-1 overflow-hidden h-[calc(100vh-100px)] bg-slate-50 dark:bg-slate-950">
                                <ScrollArea className="h-full p-6">
                                    <Button variant="outline" className="w-full h-14 rounded-2xl mb-8 font-black uppercase text-xs tracking-widest border-primary/20 text-primary shadow-sm" onClick={handleNewChat}>
                                        <PlusCircle className="mr-3 h-5 w-5" /> Start New Chat
                                    </Button>
                                    <div className="space-y-4">
                                        {sessions.map(session => (
                                            <div 
                                                key={session.id} 
                                                className={cn(
                                                    "p-5 rounded-2xl cursor-pointer group flex items-center justify-between transition-all border shadow-sm",
                                                    activeSessionId === session.id ? "bg-white dark:bg-slate-800 border-primary/30" : "bg-white/40 dark:bg-slate-900/40 border-transparent"
                                                )}
                                                onClick={() => setActiveSessionId(session.id)}
                                            >
                                                <div className="flex-1 overflow-hidden">
                                                    <p className={cn("text-sm font-black truncate tracking-tight", activeSessionId === session.id ? "text-primary" : "text-[#2D3A5D] dark:text-slate-200")}>{session.title}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</p>
                                                </div>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-red-400 bg-red-50 dark:bg-red-900/20" onClick={(e) => {e.stopPropagation(); handleDeleteChat(session.id);}}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
                <div className="shrink-0 px-1">
                  <VoiceWidget lastAssistantMessage={activeSession?.messages.filter(m => m.role === 'assistant').pop()?.content || ''} onTranscript={(t) => { if(queryInputRef.current) queryInputRef.current.value = t; }}/>
                </div>
                
                <TabsContent value="general" className="flex-1 m-0 h-full data-[state=active]:flex flex-col min-h-0 w-full overflow-hidden">
                    <ChatInterface 
                        messages={activeSession?.messages || []}
                        isPending={isPending}
                        onFormAction={handleFormAction}
                        formRef={formRef}
                        queryInputRef={queryInputRef}
                        attachedImage={attachedImage}
                        setAttachedImage={setAttachedImage}
                        userImage={userImage}
                        assistantImage={assistantImage}
                        pulseMode={pulseMode}
                        setPulseMode={setPulseMode}
                        title="Your Medical Partner"
                        description="Professional AI Health Companion"
                        placeholder="Ask about symptoms, medicines or health tips..."
                        initialMessage="Hello! I'm your dedicated medical assistant. How are you feeling today?"
                        Icon={ShieldPlus}
                    />
                </TabsContent>
                
                <TabsContent value="doctor" className="flex-1 m-0 h-full data-[state=active]:flex flex-col min-h-0 w-full overflow-hidden">
                     <ChatInterface 
                        messages={activeSession?.messages || []}
                        isPending={isPending}
                        onFormAction={handleFormAction}
                        formRef={formRef}
                        queryInputRef={queryInputRef}
                        attachedImage={attachedImage}
                        setAttachedImage={setAttachedImage}
                        userImage={userImage}
                        assistantImage={assistantImage}
                        title={`Specialist: ${specialty}`}
                        description={`Professional Medical Consultation`}
                        placeholder={`Message the ${specialty}...`}
                        initialMessage={`Welcome. I am your specialized AI ${specialty}. Please describe your symptoms in detail.`}
                        Icon={BrainCircuit}
                    />
                </TabsContent>
            </div>
          </Tabs>
      </div>
    </div>
  );
}


interface ChatInterfaceProps {
    messages: Message[];
    isPending: boolean;
    onFormAction: (formData: FormData) => void;
    formRef: React.RefObject<HTMLFormElement>;
    queryInputRef: React.RefObject<HTMLTextAreaElement>;
    attachedImage: string | null;
    setAttachedImage: (image: string | null) => void;
    userImage: string;
    assistantImage?: { imageUrl: string, imageHint: string };
    pulseMode?: PulseMode;
    setPulseMode?: (mode: PulseMode) => void;
    title: string;
    description: string;
    placeholder: string;
    initialMessage: string;
    Icon: React.ElementType;
}

function ChatInterface({
    messages, isPending, onFormAction, formRef, queryInputRef,
    attachedImage, setAttachedImage, userImage, assistantImage, pulseMode, setPulseMode,
    title, description, placeholder, initialMessage, Icon
}: ChatInterfaceProps) {
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => setAttachedImage(e.target?.result as string);
          reader.readAsDataURL(file);
        }
    };
    
    useEffect(() => {
        if (scrollAreaRef.current) {
          const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
          if (viewport) viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages, isPending]);

    return (
        <Card className="flex-1 flex flex-col rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-2xl overflow-hidden min-h-0 w-full h-full">
            <CardHeader className="px-6 md:px-10 pt-8 pb-4 shrink-0 border-b border-white/20 dark:border-slate-800/40">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-3xl shrink-0 shadow-inner border border-white/60 dark:border-slate-700/60">
                            <Icon className="w-7 h-7 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <CardTitle className="text-xl font-black text-[#2D3A5D] dark:text-slate-100 tracking-tight truncate">{title}</CardTitle>
                            <CardDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 truncate">{description}</CardDescription>
                        </div>
                    </div>
                </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden p-0 relative">
                <ScrollArea className="h-full px-4 md:px-10 pb-10" ref={scrollAreaRef}>
                    <div className="space-y-8 pt-8">
                        {messages.length === 0 && !isPending && (
                            <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 opacity-40">
                                <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[3rem] shadow-inner">
                                    <Icon className="w-16 h-16 text-[#2D3A5D] dark:text-slate-400" />
                                </div>
                                <p className="text-base font-black text-[#2D3A5D] dark:text-slate-400 tracking-tight max-w-[240px] leading-relaxed">{initialMessage}</p>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn("flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500", message.role === 'user' ? 'flex-row-reverse' : '')}
                            >
                                <Avatar className="h-10 w-10 md:h-12 md:w-12 border-4 border-white dark:border-slate-800 shadow-xl shrink-0">
                                    {message.role === 'assistant' ? (
                                        <>
                                            {assistantImage && <AvatarImage src={assistantImage.imageUrl} alt="AI" data-ai-hint={assistantImage.imageHint}/>}
                                            <AvatarFallback className="bg-primary text-white"><Icon className="w-5 h-5 md:w-6 md:h-6"/></AvatarFallback>
                                        </>
                                    ) : (
                                        <>
                                            <AvatarImage src={userImage} alt="User" data-ai-hint="person face" />
                                            <AvatarFallback className="bg-slate-200"><User className="w-5 h-5 md:w-6 md:h-6"/></AvatarFallback>
                                        </>
                                    )}
                                </Avatar>
                                <div
                                    className={cn(
                                        "max-w-[90%] sm:max-w-[85%] rounded-[1.8rem] px-6 py-5 shadow-sm border transition-all",
                                        message.role === 'user' 
                                            ? "bg-primary text-white rounded-tr-none border-primary/20" 
                                            : "bg-white dark:bg-slate-800 text-[#2D3A5D] dark:text-slate-100 rounded-tl-none border-white dark:border-slate-700/60"
                                    )}
                                >
                                    {message.image && (
                                        <div className="mb-4 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-700">
                                            <Image src={message.image} alt="User upload" width={400} height={400} className="w-full h-auto object-cover" />
                                        </div>
                                    )}
                                    {message.role === 'user' && message.mode && message.mode !== 'standard' && (
                                        <div className="flex items-center gap-2 mb-3 px-3 py-1 bg-white/20 rounded-full w-fit">
                                            <HeartPulse className="w-3.5 h-3.5 text-white animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{message.mode} Mode Active</span>
                                        </div>
                                    )}
                                    <article className={cn(
                                        "prose prose-base dark:prose-invert max-w-none text-inherit leading-relaxed font-bold",
                                        message.role === 'user' ? "prose-p:text-white" : ""
                                    )}>
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </article>
                                    {message.role === 'assistant' && index === messages.length - 1 && !isPending && (
                                        <FeedbackActions messageContent={message.content} />
                                    )}
                                </div>
                            </div>
                        ))}
                        {isPending && (
                            <div className="flex items-start gap-4 animate-pulse">
                                <Avatar className="h-10 w-10 md:h-12 md:w-12 border-4 border-white dark:border-slate-800 shadow-xl shrink-0 bg-primary/10">
                                    <AvatarFallback className="bg-transparent"><Icon className="w-6 h-6 text-primary"/></AvatarFallback>
                                </Avatar>
                                <div className="bg-white dark:bg-slate-800 rounded-[1.8rem] rounded-tl-none px-6 py-5 border border-white dark:border-slate-700/60 flex items-center gap-4 shadow-sm">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Assistant is thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            
            <CardFooter className="px-6 md:px-10 pb-8 md:pb-10 pt-6 flex-col items-stretch gap-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-2xl border-t border-white/30 dark:border-slate-800/40 shrink-0">
                {/* Active Mode Indicator Above Input */}
                {pulseMode && pulseMode !== 'standard' && (
                    <div className="flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 shadow-sm">
                            <HeartPulse className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{pulseMode} Engine Enabled</span>
                        </div>
                    </div>
                )}

                {attachedImage && (
                    <div className="relative inline-block w-24 h-24 group animate-in zoom-in-95 duration-300">
                        <Image src={attachedImage} alt="Preview" width={100} height={100} className="rounded-2xl border-4 border-white dark:border-slate-700 shadow-2xl object-cover h-full w-full" />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-3 -right-3 h-8 w-8 rounded-full shadow-xl border-4 border-white dark:border-slate-900 scale-0 group-hover:scale-100 transition-transform"
                            onClick={() => setAttachedImage(null)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                
                <form
                    ref={formRef}
                    action={handleFormAction}
                    className="flex w-full items-end gap-3 md:gap-4"
                >
                    <div className="flex items-center gap-2 shrink-0">
                        {/* Mode Selector Button */}
                        {setPulseMode && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-2xl h-14 w-14 bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                        <PlusCircle className="h-8 w-8 text-primary" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] rounded-[2rem] border-none shadow-2xl p-6 dark:bg-slate-900" side="top" align="start">
                                    <div className="space-y-5">
                                        <h4 className="font-black text-[11px] text-[#2D3A5D] dark:text-slate-100 uppercase tracking-[0.25em] px-2 mb-2 opacity-60">Assistant Engines</h4>
                                        <RadioGroup value={pulseMode} onValueChange={(v) => setPulseMode(v as PulseMode)} className="gap-3">
                                            <PulseModeItem value="standard" label="Balanced" desc="General medical advice" icon={<ShieldPlus className="w-5 h-5"/>} />
                                            <PulseModeItem value="websearch" label="Deep Search" desc="Latest 2024-25 data" icon={<Search className="w-5 h-5"/>} />
                                            <PulseModeItem value="deepthink" label="Logic Think" desc="Complex symptom analysis" icon={<BrainCircuit className="w-5 h-5"/>} />
                                            <PulseModeItem value="proanalysis" label="Pharmacist" desc="Drug-to-drug checks" icon={<Zap className="w-5 h-5"/>} />
                                        </RadioGroup>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}

                        {/* Attachment Button */}
                        <Button 
                            type="button" 
                            variant="ghost"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isPending}
                            className="rounded-2xl h-14 w-14 bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                            <Paperclip className="h-7 w-7 text-slate-400" />
                        </Button>
                    </div>

                    <div className="flex-1 relative flex items-end bg-white dark:bg-slate-800 rounded-3xl px-2 shadow-2xl min-h-[60px] overflow-hidden border border-white dark:border-slate-700 transition-shadow focus-within:shadow-primary/5">
                        <Textarea
                            id="chatInput"
                            ref={queryInputRef}
                            name="query"
                            placeholder={placeholder}
                            className="flex-1 min-h-[60px] max-h-[200px] p-5 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-lg resize-none dark:text-slate-100"
                            autoComplete="off"
                            disabled={isPending}
                            rows={1}
                            onInput={(e) => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    formRef.current?.requestSubmit();
                                }
                            }}
                        />
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <SubmitButton />
                </form>
                <div className="flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                    <Activity className="w-4 h-4 text-primary" />
                    Professional AI Medical Insights
                </div>
            </CardFooter>
        </Card>
    )
}

function PulseModeItem({ value, label, desc, icon }: { value: PulseMode, label: string, desc: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent has-[:checked]:border-primary/20 has-[:checked]:bg-primary/5 group cursor-pointer">
            <RadioGroupItem value={value} id={value} className="sr-only" />
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-700 shadow-md border border-slate-100 dark:border-slate-600 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <Label htmlFor={value} className="flex-1 cursor-pointer">
                <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-100 leading-none">{label}</p>
                <p className="text-[11px] font-bold text-slate-400 mt-2 leading-tight">{desc}</p>
            </Label>
        </div>
    )
}
