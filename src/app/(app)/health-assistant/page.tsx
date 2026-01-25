
'use client';

import React, { useActionState, useRef, useEffect, useState, useCallback, useTransition } from 'react';
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
import { Send, User, Bot, Loader2, Paperclip, Mic, MicOff, X, Volume2, StopCircle, ThumbsUp, ThumbsDown, Copy, PlusCircle, Trash2, BrainCircuit } from 'lucide-react';
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


type Message = {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
};

type Session = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  specialty?: string; // For doctor chats
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} id="sendBtn">
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
    const reason = formData.get('feedback-reason');
    const details = formData.get('feedback-details');
    console.log('Dislike Feedback:', { reason, details, message: messageContent });
    toast({ title: 'Feedback received!', description: 'Thank you for your detailed feedback.' });
    setIsDialogOpen(false);
  };

  return (
    <div className="mt-2 flex items-center gap-2">
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleLike}>
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={handleDislikeSubmit}>
            <DialogHeader>
              <DialogTitle>Provide Additional Feedback</DialogTitle>
              <DialogDescription>
                Your feedback is valuable in helping us improve the AI.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
               <RadioGroup name="feedback-reason" defaultValue="not-helpful">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-helpful" id="r1" />
                    <Label htmlFor="r1">Not helpful</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="incorrect" id="r2" />
                    <Label htmlFor="r2">Factually incorrect</Label>
                  </div>
                   <div className="flex items-center space-x-2">
                    <RadioGroupItem value="offensive" id="r3" />
                    <Label htmlFor="r3">Harmful or offensive</Label>
                  </div>
                </RadioGroup>
                <Textarea name="feedback-details" placeholder="Please provide any other details (optional)." />
            </div>
            <DialogFooter>
              <Button type="submit">Submit Feedback</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
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
      toast({ title: 'Transcription complete', description: 'Your message is ready to send.' });
    }
    if (error) {
      toast({ variant: 'destructive', title: 'Transcription Failed', description: error });
    }
  }, [speechState, onTranscript, toast]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    const handleVoicesChanged = () => {};
    if (synthRef.current) {
        synthRef.current.addEventListener('voiceschanged', handleVoicesChanged);
    }
    return () => {
        if (synthRef.current) {
            synthRef.current.removeEventListener('voiceschanged', handleVoicesChanged);
            synthRef.current.cancel();
        }
    };
  }, []);

  const getBestVoice = (lang: string) => {
    if (!synthRef.current) return null;
    const voices = synthRef.current.getVoices();
    let voice = voices.find(v => v.lang === lang);
    if (voice) return voice;
    voice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    return voice || voices.find(v => v.lang.startsWith('en')) || voices[0];
  };

  const handleSpeak = () => {
    if (!synthRef.current || !lastAssistantMessage) {
        toast({variant: "destructive", title: "Nothing to speak", description: "There is no assistant message to read out."});
        return;
    }
    synthRef.current.cancel(); 
    const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.replace(/[*#_`]/g, ''));
    utterance.lang = selectedLang;
    const voice = getBestVoice(selectedLang);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
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
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
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
      toast({ title: 'Recording started...', description: 'Speak your query now.' });
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({ variant: 'destructive', title: 'Recording Error', description: 'Could not access microphone.' });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  return (
    <Card className="mb-4">
        <CardContent className="p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
                <Label>Voice</Label>
                 <Select value={selectedLang} onValueChange={setSelectedLang}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en-IN">English (India)</SelectItem>
                        <SelectItem value="hi-IN">हिन्दी</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                 <Button variant="outline" size="icon" onClick={handleSpeak} disabled={isSpeaking || !lastAssistantMessage}>
                    <Volume2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleStopSpeaking} disabled={!isSpeaking}>
                    <StopCircle className="h-5 w-5" />
                </Button>
            </div>
             <div className="flex items-center gap-2">
                <Button 
                    variant={isRecording ? 'destructive' : 'outline'} 
                    size="icon" 
                    onClick={isRecording ? stopRecording : startRecording} 
                    disabled={isTranscribing}
                >
                  {isTranscribing ? <Loader2 className="h-5 w-5 animate-spin" /> : (isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />)}
                </Button>
                <Label className="text-sm text-muted-foreground">{isRecording ? "Recording..." : (isTranscribing ? "Transcribing...": "Microphone")}</Label>
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

  const loadSessions = (mode: 'general' | 'doctor') => {
    try {
      const key = `healthAssistantSessions_${mode}`;
      const savedSessions = localStorage.getItem(key);
      const parsedSessions = savedSessions ? JSON.parse(savedSessions) : [];
      if (mode === 'general') {
        setGeneralSessions(parsedSessions);
        if (parsedSessions.length > 0) setActiveGeneralSessionId(parsedSessions[0].id);
        else handleNewChat();
      } else {
        setDoctorSessions(parsedSessions);
        const relevantDoctorSessions = parsedSessions.filter((s: Session) => s.specialty === specialty);
        if (relevantDoctorSessions.length > 0) setActiveDoctorSessionId(relevantDoctorSessions[0].id);
        else handleNewChat();
      }
    } catch (error) {
      console.error(`Failed to load ${mode} sessions:`, error);
      handleNewChat();
    }
  };

  useEffect(() => {
    loadSessions('general');
    loadSessions('doctor');
  }, []);

  useEffect(() => {
    if (generalSessions.some(s => s.messages.length > 0)) {
      localStorage.setItem('healthAssistantSessions_general', JSON.stringify(generalSessions));
    }
  }, [generalSessions]);
  
  useEffect(() => {
    if (doctorSessions.some(s => s.messages.length > 0)) {
      localStorage.setItem('healthAssistantSessions_doctor', JSON.stringify(doctorSessions));
    }
  }, [doctorSessions]);

  const handleNewChat = useCallback(() => {
    const newSession: Session = {
      id: `session-${Date.now()}`,
      title: activeMode === 'doctor' ? `${specialty} Chat` : 'New Chat',
      messages: [],
      createdAt: Date.now(),
      ...(activeMode === 'doctor' && { specialty }),
    };

    const setSessionList = activeMode === 'general' ? setGeneralSessions : setDoctorSessions;
    const setActiveId = activeMode === 'general' ? setActiveGeneralSessionId : setActiveDoctorSessionId;
    
    setSessionList(prev => [newSession, ...prev.filter(s => s.messages.length > 0)]);
    setActiveId(newSession.id);
    setAttachedImage(null);
  }, [activeMode, specialty]);

  useEffect(() => {
    const currentSessions = activeMode === 'general' ? generalSessions : doctorSessions.filter(s => s.specialty === specialty);
    if (!currentSessions.find(s => s.id === activeSessionId)) {
        if (currentSessions.length > 0) {
            setActiveSessionId(currentSessions[0].id);
        } else {
            handleNewChat();
        }
    }
  }, [activeMode, specialty, generalSessions, doctorSessions, activeSessionId, handleNewChat, setActiveSessionId]);

  const handleDeleteChat = (sessionId: string) => {
    setSessions(prev => {
        const filtered = prev.filter(s => s.id !== sessionId);
        if (activeSessionId === sessionId) {
            if (filtered.length > 0) {
                setActiveSessionId(filtered[0].id);
            } else {
                handleNewChat();
            }
        }
        return filtered;
    });
  };
  
  const handleFormAction = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query && !attachedImage) return;

    let userMessage: Message = { role: 'user', content: query || 'Image analysis' };
     if (attachedImage) {
      userMessage.image = attachedImage;
      formData.set('photoDataUri', attachedImage);
    }
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const newMessages = [...s.messages, userMessage];
        const newTitle = (s.messages.length === 0 && query) ? query.substring(0, 30) : s.title;
        return { ...s, messages: newMessages, title: newTitle };
      }
      return s;
    }));
    
    if (activeMode === 'doctor') {
      formData.set('specialty', specialty);
      formData.set('history', JSON.stringify(activeSession?.messages || []));
      doctorFormAction(formData);
    } else {
      generalFormAction(formData);
    }
    
    formRef.current?.reset();
    if(queryInputRef.current) queryInputRef.current.value = '';
    setAttachedImage(null);
  }

  const handleSpecialtyChange = (newSpecialty: string) => {
    setSpecialty(newSpecialty);
    const existingChat = doctorSessions.find(s => s.specialty === newSpecialty);
    if (existingChat) {
      setActiveDoctorSessionId(existingChat.id);
    } else {
      handleNewChat();
    }
  };

  const handleTranscript = (transcript: string) => {
    if (queryInputRef.current) {
      queryInputRef.current.value = transcript;
    }
  }
  
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];
  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop()?.content || '';

  const assistantImage = PlaceHolderImages.find(img => img.id === 'assistant-avatar');
  const userImage = 'https://picsum.photos/seed/user/100/100';

  return (
    <div className="flex h-[calc(100vh-6.5rem)] gap-4">
        {/* Chat History Sidebar */}
        <Card className="hidden md:flex md:w-1/4 flex-col">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Chat History</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleNewChat}>
                    <PlusCircle className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-2">
                <ScrollArea className="h-full">
                    <div className="space-y-2">
                        {sessions.map(session => (
                            <div 
                                key={session.id} 
                                className={cn(
                                    "p-3 rounded-lg cursor-pointer group flex items-center justify-between",
                                    activeSessionId === session.id ? "bg-primary/20" : "hover:bg-muted"
                                )}
                                onClick={() => setActiveSessionId(session.id)}
                            >
                                <div className="flex-1 overflow-hidden">
                                  <p className="text-sm font-medium truncate">{session.title}</p>
                                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={(e) => {e.stopPropagation(); handleDeleteChat(session.id);}}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full">
          <Tabs defaultValue="general" value={activeMode} onValueChange={(value) => {
            setActiveMode(value as 'general' | 'doctor');
          }} className="flex-grow flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">General Assistant</TabsTrigger>
                <TabsTrigger value="doctor">Specialist Doctor</TabsTrigger>
            </TabsList>
            <div className="flex-grow flex flex-col mt-4">
                <VoiceWidget lastAssistantMessage={lastAssistantMessage} onTranscript={handleTranscript}/>
                <TabsContent value="general" asChild>
                    <ChatInterface 
                        key={`general-${activeSessionId}`}
                        messages={messages}
                        isPending={isPending}
                        onFormAction={handleFormAction}
                        formRef={formRef}
                        queryInputRef={queryInputRef}
                        attachedImage={attachedImage}
                        setAttachedImage={setAttachedImage}
                        userImage={userImage}
                        assistantImage={assistantImage}
                        title="AI Health Assistant"
                        description="Ask me anything about health, medicines, or diseases."
                        placeholder="Type your message..."
                        initialMessage="Hello! I am your AI Health Assistant. How can I help you today?"
                        Icon={Bot}
                    />
                </TabsContent>
                <TabsContent value="doctor" asChild>
                     <ChatInterface 
                        key={`doctor-${activeSessionId}`}
                        messages={messages}
                        isPending={isPending}
                        onFormAction={handleFormAction}
                        formRef={formRef}
                        queryInputRef={queryInputRef}
                        attachedImage={attachedImage}
                        setAttachedImage={setAttachedImage}
                        userImage={userImage}
                        assistantImage={assistantImage}
                        title={`AI ${specialty}`}
                        description="Chat with an AI specialist. This is not a substitute for real medical advice."
                        placeholder={`Ask the AI ${specialty}...`}
                        initialMessage={`Hello! I am your AI ${specialty}. How may I help you?`}
                        Icon={BrainCircuit}
                    >
                       <Card className="mb-4">
                            <CardContent className="p-4">
                               <Label htmlFor="specialty-select">Select a Specialty</Label>
                               <Select value={specialty} onValueChange={handleSpecialtyChange}>
                                <SelectTrigger id="specialty-select">
                                    <SelectValue placeholder="Select a doctor specialty" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctorSpecialties.map(spec => (
                                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </CardContent>
                        </Card>
                    </ChatInterface>
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
    title: string;
    description: string;
    placeholder: string;
    initialMessage: string;
    Icon: React.ElementType;
    children?: React.ReactNode;
}

function ChatInterface({
    messages, isPending, onFormAction, formRef, queryInputRef,
    attachedImage, setAttachedImage, userImage, assistantImage, title, description, placeholder,
    initialMessage, Icon, children
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
          if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
          }
        }
    }, [messages, isPending]);
    
    const renderMarkdown = (text: string) => {
        return (
            <ReactMarkdown
                components={{
                    a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80" />
                }}
            >
                {text}
            </ReactMarkdown>
        )
    }

    return (
         <div className="flex-grow flex flex-col">
            {children}
            <Card className="flex-1 flex flex-col" data-chat-card="true">
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><Icon />{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                    <div className="space-y-4">
                    {messages.length === 0 && !isPending && (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                        <Icon className="w-16 h-16 mb-4" />
                        <p className="text-lg font-medium">{initialMessage}</p>
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div
                        key={index}
                        className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                        >
                        {message.role === 'assistant' && (
                            <Avatar className="h-9 w-9">
                            {assistantImage && <AvatarImage src={assistantImage.imageUrl} alt="AI Assistant" data-ai-hint={assistantImage.imageHint}/>}
                            <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                        )}
                        <div
                            className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 ${
                            message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}
                        >
                            {message.image && (
                            <Image src={message.image} alt="User upload" width={200} height={200} className="rounded-md mb-2" />
                            )}
                            {message.role === 'assistant' ? (
                            <>
                                <article className="prose prose-sm dark:prose-invert max-w-none">{renderMarkdown(message.content)}</article>
                                {index === messages.length - 1 && !isPending && (
                                <FeedbackActions messageContent={message.content} />
                                )}
                            </>
                            ) : (
                            <p>{message.content}</p>
                            )}
                        </div>
                        {message.role === 'user' && (
                            <Avatar className="h-9 w-9">
                            <AvatarImage src={userImage} alt="@user" data-ai-hint="person face" />
                            <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                        )}
                        </div>
                    ))}
                    {isPending && (
                        <div className="flex items-start gap-3">
                        <Avatar className="h-9 w-9">
                            {assistantImage && <AvatarImage src={assistantImage.imageUrl} alt="AI Assistant" data-ai-hint={assistantImage.imageHint} />}
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <div className="max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 bg-muted flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm italic">Assistant is typing...</span>
                        </div>
                        </div>
                    )}
                    </div>
                </ScrollArea>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2">
                {attachedImage && (
                    <div className="relative p-2 border rounded-md">
                    <Image src={attachedImage} alt="Preview" width={80} height={80} className="rounded-md" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground"
                        onClick={() => setAttachedImage(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    </div>
                )}
                <form
                    ref={formRef}
                    action={onFormAction}
                    className="flex w-full items-center gap-2"
                >
                    <Input
                    id="chatInput"
                    ref={queryInputRef}
                    name="query"
                    placeholder={placeholder}
                    className="flex-1"
                    autoComplete="off"
                    disabled={isPending}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        formRef.current?.requestSubmit();
                        }
                    }}
                    />
                    <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                    />
                    <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isPending}>
                    <Paperclip className="h-5 w-5" />
                    <span className="sr-only">Attach file</span>
                    </Button>
                    <SubmitButton />
                </form>
                </CardFooter>
            </Card>
        </div>
    )
}
