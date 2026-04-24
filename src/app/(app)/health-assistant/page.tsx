
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
import { Input } from '@/components/ui/input';
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
    Stethoscope,
    HeartPulse
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
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
    <Button type="submit" size="icon" disabled={pending} className="rounded-full h-12 w-12 bg-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
      {pending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Send className="h-5 w-5" />
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
    <div className="mt-2 flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/50" onClick={handleLike}>
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/50">
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-[2rem] border-none shadow-2xl">
          <form onSubmit={handleDislikeSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-[#2D3A5D]">Provide Additional Feedback</DialogTitle>
              <DialogDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                Your feedback is valuable in helping us improve the AI.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
               <RadioGroup name="feedback-reason" defaultValue="not-helpful">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-helpful" id="r1" />
                    <Label htmlFor="r1" className="font-bold text-slate-600">Not helpful</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="incorrect" id="r2" />
                    <Label htmlFor="r2" className="font-bold text-slate-600">Factually incorrect</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                    <RadioGroupItem value="offensive" id="r3" />
                    <Label htmlFor="r3" className="font-bold text-slate-600">Harmful or offensive</Label>
                  </div>
                </RadioGroup>
                <Textarea name="feedback-details" placeholder="Please provide any other details (optional)." className="rounded-2xl bg-slate-50 border-none shadow-inner" />
            </div>
            <DialogFooter>
              <Button type="submit" className="rounded-full w-full font-black uppercase text-[10px] tracking-widest">Submit Feedback</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-white/50" onClick={handleCopy}>
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
      toast({ title: 'Transcription complete' });
    }
    if (error) {
      toast({ variant: 'destructive', title: 'Transcription Failed', description: error });
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
      toast({ title: 'Listening...' });
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
    <Card className="rounded-[2rem] neumorphic-card border-none mb-4">
        <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-white/50">
                    <Select value={selectedLang} onValueChange={setSelectedLang}>
                        <SelectTrigger className="w-[120px] h-8 text-[10px] font-black uppercase tracking-tighter bg-transparent border-none shadow-none focus:ring-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-none shadow-xl">
                            <SelectItem value="en-IN">English</SelectItem>
                            <SelectItem value="hi-IN">हिन्दी</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className={cn("h-9 w-9 rounded-full bg-white shadow-sm border border-blue-50", isSpeaking && "text-primary")} onClick={handleSpeak} disabled={isSpeaking || !lastAssistantMessage}>
                        <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white shadow-sm border border-blue-50" onClick={handleStopSpeaking} disabled={!isSpeaking}>
                        <StopCircle className="h-4 w-4" />
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
                        "rounded-full px-4 h-9 font-black text-[10px] uppercase tracking-widest border-none transition-all shadow-sm",
                        isRecording ? "bg-red-500 text-white animate-pulse" : "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                >
                  {isTranscribing ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : (isRecording ? <MicOff className="h-3 w-3 mr-2" /> : <Mic className="h-3 w-3 mr-2" />)}
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
  const queryInputRef = useRef<HTMLInputElement>(null);

  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  
  const isPending = activeMode === 'general' ? isGeneralPending : isDoctorPending;
  const sessions = activeMode === 'general' ? generalSessions : doctorSessions.filter(s => s.specialty === specialty);
  const activeSessionId = activeMode === 'general' ? activeGeneralSessionId : activeDoctorSessionId;
  const setSessions = activeMode === 'general' ? setGeneralSessions : setDoctorSessions;
  const setActiveSessionId = activeMode === 'general' ? setActiveGeneralSessionId : setActiveDoctorSessionId;

  const handleStateUpdate = useCallback((state: typeof initialState, mode: 'general' | 'doctor') => {
      const currentSessionId = mode === 'general' ? activeGeneralSessionId : activeDoctorSessionId;
      const setSessionList = mode === 'general' ? setGeneralSessions : setDoctorSessions;

      if ((state.response || state.error) && currentSessionId) {
          const content = state.response || `Sorry, an error occurred: ${state.error}`;
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
      title: activeMode === 'doctor' ? `${specialty} Chat` : 'New Chat',
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
        content: query || 'Image analysis',
        mode: activeMode === 'general' ? pulseMode : undefined 
    };
     if (attachedImage) {
      userMessage.image = attachedImage;
      formData.set('photoDataUri', attachedImage);
    }
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const newTitle = (s.messages.length === 0 && query) ? query.substring(0, 30) : s.title;
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
    <div className="flex h-[calc(100vh-120px)] gap-6 animate-in fade-in duration-500">
        {/* Chat History Sidebar */}
        <Card className="hidden md:flex md:w-1/4 flex-col rounded-[2.5rem] neumorphic-card border-none p-2">
            <CardHeader className="flex-row items-center justify-between pb-2 px-6 pt-6">
                <CardTitle className="text-sm font-black text-[#2D3A5D] uppercase tracking-widest">History</CardTitle>
                <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 border border-white/50" onClick={handleNewChat}>
                    <PlusCircle className="h-5 w-5 text-primary" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-2">
                <ScrollArea className="h-full px-2">
                    <div className="space-y-3">
                        {sessions.map(session => (
                            <div 
                                key={session.id} 
                                className={cn(
                                    "p-4 rounded-[1.5rem] cursor-pointer group flex items-center justify-between transition-all border border-transparent",
                                    activeSessionId === session.id ? "bg-white shadow-sm border-blue-50" : "hover:bg-white/40"
                                )}
                                onClick={() => setActiveSessionId(session.id)}
                            >
                                <div className="flex-1 overflow-hidden">
                                  <p className={cn("text-xs font-black truncate tracking-tight", activeSessionId === session.id ? "text-primary" : "text-[#2D3A5D]")}>{session.title}</p>
                                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 rounded-full hover:bg-red-50 text-red-400" onClick={(e) => {e.stopPropagation(); handleDeleteChat(session.id);}}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
          <Tabs defaultValue="general" value={activeMode} onValueChange={(v) => setActiveMode(v as any)} className="flex-1 flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-4">
                <TabsList className="grid grid-cols-2 w-[300px] h-12 p-1.5 bg-slate-100/50 rounded-full border border-white/50 backdrop-blur-sm">
                    <TabsTrigger value="general" className="rounded-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Assistant</TabsTrigger>
                    <TabsTrigger value="doctor" className="rounded-full font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-sm">Specialist</TabsTrigger>
                </TabsList>
                
                {activeMode === 'doctor' && (
                    <div className="flex-1 max-w-[240px]">
                        <Select value={specialty} onValueChange={setSpecialty}>
                            <SelectTrigger className="h-12 rounded-full bg-white/50 border-white/50 shadow-sm font-black text-[10px] uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <BrainCircuit className="w-3.5 h-3.5 text-primary" />
                                    <SelectValue placeholder="Select Specialty" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-xl">
                                {doctorSpecialties.map(spec => (
                                    <SelectItem key={spec} value={spec} className="font-bold text-xs">{spec}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col min-h-0">
                <VoiceWidget lastAssistantMessage={activeSession?.messages.filter(m => m.role === 'assistant').pop()?.content || ''} onTranscript={(t) => { if(queryInputRef.current) queryInputRef.current.value = t; }}/>
                
                <TabsContent value="general" className="flex-1 m-0 h-full data-[state=active]:flex flex-col min-h-0">
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
                        title="Health Assistant"
                        description="Ask about symptoms, meds or health tips"
                        placeholder="Ask me anything..."
                        initialMessage="Hi! I'm your AI partner. How can I help you today?"
                        Icon={ShieldPlus}
                    />
                </TabsContent>
                
                <TabsContent value="doctor" className="flex-1 m-0 h-full data-[state=active]:flex flex-col min-h-0">
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
                        title={`AI ${specialty}`}
                        description={`Consulting with your specialist`}
                        placeholder={`Talk to the ${specialty}...`}
                        initialMessage={`Greetings. I am your specialized AI ${specialty}. How may I assist you?`}
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
    queryInputRef: React.RefObject<HTMLInputElement>;
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
        <Card className="flex-1 flex flex-col rounded-[2.5rem] neumorphic-card border-none overflow-hidden min-h-0">
            <CardHeader className="px-8 pt-8 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-2xl">
                            <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-black text-[#2D3A5D] tracking-tight">{title}</CardTitle>
                            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{description}</CardDescription>
                        </div>
                    </div>
                    {setPulseMode && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="rounded-full gap-2 border-primary/20 hover:border-primary transition-all">
                                    <HeartPulse className={cn("w-4 h-4 text-primary", pulseMode !== 'standard' && "animate-pulse")} />
                                    <span className="text-[10px] font-black uppercase">{pulseMode} Mode</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64 rounded-[2rem] border-none shadow-2xl p-4">
                                <div className="space-y-4">
                                    <h4 className="font-black text-xs text-[#2D3A5D] uppercase tracking-widest px-2">Assistant Pulse Modes</h4>
                                    <RadioGroup value={pulseMode} onValueChange={(v) => setPulseMode(v as PulseMode)} className="gap-2">
                                        <PulseModeItem value="standard" label="Standard" desc="General health advice" icon={<ShieldPlus className="w-4 h-4"/>} />
                                        <PulseModeItem value="websearch" label="Web Search" desc="Search latest medical databases" icon={<Search className="w-4 h-4"/>} />
                                        <PulseModeItem value="deepthink" label="Deep Medical Think" desc="Analytical medical reasoning" icon={<BrainCircuit className="w-4 h-4"/>} />
                                        <PulseModeItem value="proanalysis" label="Pro Analysis" desc="Complex drug & report checks" icon={<Zap className="w-4 h-4"/>} />
                                    </RadioGroup>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-hidden p-0 relative">
                <ScrollArea className="h-full p-8" ref={scrollAreaRef}>
                    <div className="space-y-6">
                        {messages.length === 0 && !isPending && (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                                <div className="p-6 bg-slate-50 rounded-[2.5rem]">
                                    <Icon className="w-12 h-12 text-[#2D3A5D]" />
                                </div>
                                <p className="text-sm font-black text-[#2D3A5D] tracking-tight max-w-[200px]">{initialMessage}</p>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn("flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300", message.role === 'user' ? 'flex-row-reverse' : '')}
                            >
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                                    {message.role === 'assistant' ? (
                                        <>
                                            {assistantImage && <AvatarImage src={assistantImage.imageUrl} alt="AI" data-ai-hint={assistantImage.imageHint}/>}
                                            <AvatarFallback className="bg-primary text-white"><Icon className="w-5 h-5"/></AvatarFallback>
                                        </>
                                    ) : (
                                        <>
                                            <AvatarImage src={userImage} alt="User" data-ai-hint="person face" />
                                            <AvatarFallback className="bg-slate-200"><User className="w-5 h-5"/></AvatarFallback>
                                        </>
                                    )}
                                </Avatar>
                                <div
                                    className={cn(
                                        "max-w-[85%] rounded-[1.8rem] px-6 py-4 shadow-sm",
                                        message.role === 'user' 
                                            ? "bg-primary text-white rounded-tr-none" 
                                            : "bg-slate-50 dark:bg-slate-800 text-[#2D3A5D] dark:text-slate-100 rounded-tl-none border border-white/50"
                                    )}
                                >
                                    {message.image && (
                                        <div className="mb-3 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                                            <Image src={message.image} alt="User upload" width={300} height={300} className="w-full h-auto" />
                                        </div>
                                    )}
                                    {message.role === 'user' && message.mode && message.mode !== 'standard' && (
                                        <div className="flex items-center gap-1.5 mb-2 opacity-70">
                                            <HeartPulse className="w-3 h-3 text-white animate-pulse" />
                                            <span className="text-[8px] font-black uppercase tracking-tighter">Mode: {message.mode}</span>
                                        </div>
                                    )}
                                    <article className="prose prose-sm dark:prose-invert max-none text-inherit leading-relaxed font-medium">
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
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0 bg-primary/10">
                                    <AvatarFallback className="bg-transparent"><Icon className="w-5 h-5 text-primary"/></AvatarFallback>
                                </Avatar>
                                <div className="bg-slate-50 rounded-[1.8rem] rounded-tl-none px-6 py-4 border border-white/50 flex items-center gap-3">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI is thinking...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            
            <CardFooter className="px-8 pb-8 pt-4 flex-col items-stretch gap-4 bg-white/30 backdrop-blur-md border-t border-white/50">
                {attachedImage && (
                    <div className="relative inline-block w-20 h-20 group">
                        <Image src={attachedImage} alt="Preview" width={80} height={80} className="rounded-2xl border-4 border-white shadow-lg object-cover h-full w-full" />
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform"
                            onClick={() => setAttachedImage(null)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                )}
                
                <form
                    ref={formRef}
                    action={onFormAction}
                    className="flex w-full items-center gap-3"
                >
                    <div className="flex-1 relative group">
                        <Input
                            id="chatInput"
                            ref={queryInputRef}
                            name="query"
                            placeholder={pulseMode ? `[${pulseMode.toUpperCase()}] ${placeholder}` : placeholder}
                            className="h-14 pl-6 pr-14 rounded-full border-none bg-white shadow-inner placeholder:text-slate-300 font-bold text-sm"
                            autoComplete="off"
                            disabled={isPending}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    formRef.current?.requestSubmit();
                                }
                            }}
                        />
                        <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isPending}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-400 group-hover:text-primary"
                        >
                            <Paperclip className="h-5 w-5" />
                        </button>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    <SubmitButton />
                </form>
                <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <Activity className="w-3 h-3 text-primary" />
                    AI-powered health guidance
                </div>
            </CardFooter>
        </Card>
    )
}

function PulseModeItem({ value, label, desc, icon }: { value: PulseMode, label: string, desc: string, icon: React.ReactNode }) {
    return (
        <div className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent has-[:checked]:border-primary/20 has-[:checked]:bg-primary/5 group">
            <RadioGroupItem value={value} id={value} className="sr-only" />
            <div className="p-2 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <Label htmlFor={value} className="flex-1 cursor-pointer">
                <p className="font-black text-xs text-[#2D3A5D] leading-none">{label}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-1">{desc}</p>
            </Label>
        </div>
    )
}
