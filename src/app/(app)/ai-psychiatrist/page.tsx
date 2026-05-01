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
import { Send, User, Loader2, BrainCircuit, Mic, MicOff, Volume2, StopCircle, ThumbsUp, ThumbsDown, Copy, PlusCircle, Trash2, Activity, History } from 'lucide-react';
import { aiPsychiatristAction, speechToTextAction } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ReactMarkdown from 'react-markdown';
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

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Session = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
};

const initialState = {
  response: null,
  error: null,
};

const initialSpeechState = {
  transcript: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} className="rounded-2xl h-12 w-12 bg-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all shrink-0">
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
        <DialogContent className="rounded-[1rem] border-none shadow-2xl">
          <form onSubmit={handleDislikeSubmit}>
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-[#2D3A5D]">Provide Additional Feedback</DialogTitle>
              <DialogDescription className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                Your feedback is valuable.
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
                </RadioGroup>
                <Textarea name="feedback-details" placeholder="Additional details..." className="rounded-xl bg-slate-50 border-none shadow-inner" />
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
    <Card className="rounded-[1rem] neumorphic-card border-none mb-4 w-full">
        <CardContent className="p-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                 <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-full border border-white/50">
                    <Select value={selectedLang} onValueChange={setSelectedLang}>
                        <SelectTrigger className="w-[100px] h-8 text-[10px] font-black uppercase tracking-tighter bg-transparent border-none shadow-none focus:ring-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-xl">
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


export default function AIPsychiatristPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(aiPsychiatristAction, initialState);
  
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const queryInputRef = useRef<HTMLTextAreaElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];
  const lastAssistantMessage = messages.filter(m => m.role === 'assistant').pop()?.content || '';

  const handleNewChat = useCallback(() => {
    const newSession: Session = {
      id: `psy-${Date.now()}`,
      title: 'New Confidant Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev.filter(s => s.messages.length > 0)]);
    setActiveSessionId(newSession.id);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('aiPsychiatristSessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      if (parsed.length > 0) setActiveSessionId(parsed[0].id);
      else handleNewChat();
    } else {
      handleNewChat();
    }
  }, [handleNewChat]);

  useEffect(() => {
    if (sessions.some(s => s.messages.length > 0)) {
      localStorage.setItem('aiPsychiatristSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (!isPending && (state.response || state.error)) {
        const content = state.response || `Error: ${state.error}`;
        setSessions(prev => prev.map(s => 
            s.id === activeSessionId ? { ...s, messages: [...s.messages, { role: 'assistant', content }] } : s
        ));
    }
  }, [state, isPending, activeSessionId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isPending]);

  const handleFormAction = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query) return;

    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const newTitle = s.messages.length === 0 ? query.substring(0, 30) : s.title;
        return { ...s, title: newTitle, messages: [...s.messages, { role: 'user', content: query }] };
      }
      return s;
    }));

    formData.set('history', JSON.stringify(messages));
    formAction(formData);
    formRef.current?.reset();
    if(queryInputRef.current) queryInputRef.current.value = '';
  };

  const assistantImage = PlaceHolderImages.find(img => img.id === 'assistant-avatar');
  const userImage = "https://picsum.photos/seed/user/100/100";

  return (
    <div className="flex h-full w-full gap-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Sidebar - Desktop Only */}
      <Card className="hidden md:flex md:w-1/4 flex-col rounded-[1rem] neumorphic-card border-none p-2 overflow-hidden">
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
                                  "p-4 rounded-[1rem] cursor-pointer group flex items-center justify-between transition-all border border-transparent",
                                  activeSessionId === session.id ? "bg-white shadow-sm border-blue-50" : "hover:bg-white/40"
                              )}
                              onClick={() => setActiveSessionId(session.id)}
                          >
                              <div className="flex-1 overflow-hidden">
                                <p className={cn("text-xs font-black truncate tracking-tight", activeSessionId === session.id ? "text-primary" : "text-[#2D3A5D]")}>{session.title}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</p>
                              </div>
                              <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 rounded-full hover:bg-red-50 text-red-400" onClick={(e) => {
                                e.stopPropagation();
                                setSessions(prev => prev.filter(s => s.id !== session.id));
                              }}>
                                  <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                          </div>
                      ))}
                  </div>
              </ScrollArea>
          </CardContent>
      </Card>

      {/* Main Area - Full Width on Mobile */}
      <div className="flex-1 flex flex-col h-full w-full min-w-0">
        <VoiceWidget lastAssistantMessage={lastAssistantMessage} onTranscript={(t) => { if(queryInputRef.current) queryInputRef.current.value = t; }} />
        
        <Card className="flex-1 flex flex-col rounded-[1rem] neumorphic-card border-none overflow-hidden min-h-0 w-full">
          <CardHeader className="px-4 md:px-8 pt-6 pb-4">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-2xl shrink-0">
                          <BrainCircuit className="w-6 h-6 text-indigo-500" />
                      </div>
                      <div className="min-w-0">
                          <CardTitle className="text-lg font-black text-[#2D3A5D] tracking-tight truncate">AI Psychiatrist</CardTitle>
                          <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Mental Health Companion</CardDescription>
                      </div>
                  </div>
                  
                  {/* Mobile History Toggle */}
                  <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden rounded-full h-11 w-11 bg-white/50 dark:bg-slate-800/50 border-white/50 shadow-sm">
                            <History className="h-5 w-5 text-primary" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-none rounded-l-[2rem]">
                        <SheetHeader className="p-6 border-b">
                            <SheetTitle className="text-lg font-black text-primary uppercase tracking-widest">Confidant History</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-hidden h-[calc(100vh-80px)]">
                            <ScrollArea className="h-full p-4">
                                <Button variant="outline" className="w-full rounded-2xl mb-6 font-bold" onClick={handleNewChat}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> New Chat
                                </Button>
                                <div className="space-y-4">
                                    {sessions.map(session => (
                                        <div 
                                            key={session.id} 
                                            className={cn(
                                                "p-4 rounded-2xl cursor-pointer group flex items-center justify-between transition-all border",
                                                activeSessionId === session.id ? "bg-primary/5 border-primary/20" : "bg-slate-50 dark:bg-slate-800/50 border-transparent"
                                            )}
                                            onClick={() => setActiveSessionId(session.id)}
                                        >
                                            <div className="flex-1 overflow-hidden">
                                                <p className={cn("text-xs font-black truncate tracking-tight", activeSessionId === session.id ? "text-primary" : "text-[#2D3A5D] dark:text-slate-200")}>{session.title}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={(e) => {e.stopPropagation(); setSessions(prev => prev.filter(s => s.id !== session.id));}}>
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
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden p-0 relative">
              <ScrollArea className="h-full px-4 md:px-8 pb-8" ref={scrollAreaRef}>
                  <div className="space-y-6">
                      {messages.length === 0 && !isPending && (
                          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                              <div className="p-6 bg-slate-50 rounded-[2rem]">
                                  <BrainCircuit className="w-12 h-12 text-[#2D3A5D]" />
                              </div>
                              <p className="text-sm font-black text-[#2D3A5D] tracking-tight max-w-[220px]">
                                Hello! I'm your digital confidant. How are you feeling today?
                              </p>
                          </div>
                      )}
                      {messages.map((message, index) => (
                          <div
                              key={index}
                              className={cn("flex items-start gap-3 md:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300", message.role === 'user' ? 'flex-row-reverse' : '')}
                          >
                              <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-white shadow-sm shrink-0">
                                  {message.role === 'assistant' ? (
                                      <>
                                          {assistantImage && <AvatarImage src={assistantImage.imageUrl} alt="AI" data-ai-hint={assistantImage.imageHint}/>}
                                          <AvatarFallback className="bg-indigo-500 text-white"><BrainCircuit className="w-4 h-4 md:w-5 md:h-5"/></AvatarFallback>
                                      </>
                                  ) : (
                                      <>
                                          <AvatarImage src={userImage} alt="User" data-ai-hint="person face" />
                                          <AvatarFallback className="bg-slate-200"><User className="w-4 h-4 md:w-5 md:h-5"/></AvatarFallback>
                                      </>
                                  )}
                              </Avatar>
                              <div
                                  className={cn(
                                      "max-w-full md:max-w-[85%] rounded-[1.2rem] px-4 md:px-6 py-3 md:py-4 shadow-sm",
                                      message.role === 'user' 
                                          ? "bg-primary text-white rounded-tr-none" 
                                          : "bg-white dark:bg-slate-800 text-[#2D3A5D] dark:text-slate-100 rounded-tl-none border border-blue-50/30 dark:border-slate-700/50"
                                  )}
                              >
                                  <article className="prose prose-sm dark:prose-invert max-none text-inherit leading-relaxed font-medium text-base">
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
                              <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-white shadow-sm shrink-0 bg-indigo-100">
                                  <AvatarFallback className="bg-transparent"><BrainCircuit className="w-5 h-5 text-indigo-500"/></AvatarFallback>
                              </Avatar>
                              <div className="bg-white dark:bg-slate-800 rounded-[1.2rem] rounded-tl-none px-4 md:px-6 py-3 md:py-4 border border-blue-50/30 dark:border-slate-700/50 flex items-center gap-3">
                                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI is listening...</span>
                              </div>
                          </div>
                      )}
                  </div>
              </ScrollArea>
          </CardContent>
          
          <CardFooter className="px-4 md:px-8 pb-6 md:pb-8 pt-4 flex-col items-stretch gap-4 bg-white/30 backdrop-blur-md border-t border-white/50">
              <form
                  ref={formRef}
                  action={handleFormAction}
                  className="flex w-full items-end gap-3"
              >
                  <div className="flex-1 bg-white rounded-2xl shadow-inner overflow-hidden border border-slate-100 dark:bg-slate-900 dark:border-slate-800">
                    <Textarea
                        id="chatInput"
                        ref={queryInputRef}
                        name="query"
                        placeholder="Share your feelings here..."
                        className="w-full min-h-[56px] max-h-[150px] p-4 border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-base resize-none"
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
                  <SubmitButton />
              </form>
              <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <Activity className="w-3 h-3 text-indigo-500" />
                  Your safety and privacy are our priority
              </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
