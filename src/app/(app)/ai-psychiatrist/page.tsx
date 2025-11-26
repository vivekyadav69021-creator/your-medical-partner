'use client';

import React, { useActionState, useRef, useEffect, useState } from 'react';
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
import { Send, User, Sparkles, BrainCircuit, Mic, MicOff } from 'lucide-react';
import { aiPsychiatristAction, speechToTextAction } from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useUserProfile } from '@/context/user-profile-context';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import Head from 'next/head';

type Message = {
  role: 'user' | 'assistant';
  content: string;
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
    <Button type="submit" size="icon" disabled={pending} id="sendBtn">
      {pending ? (
        <Sparkles className="h-5 w-5 animate-pulse" />
      ) : (
        <Send className="h-5 w-5" />
      )}
      <span className="sr-only">Send message</span>
    </Button>
  );
}

function VoiceWidget() {
  useEffect(() => {
    const CHAT_INPUT_ID = 'chatInput';
    const SEND_BTN_ID = 'sendBtn';
    const speakBtn = document.getElementById('speakBtn');
    const stopSpeechBtn = document.getElementById('stopSpeechBtn');
    const micBtn = document.getElementById('micBtn');
    const voiceLang = document.getElementById('voiceLang') as HTMLSelectElement;
    const voiceStatus = document.getElementById('voiceStatus');
    const micStatus = document.getElementById('micStatus');

    if (!speakBtn || !stopSpeechBtn || !micBtn || !voiceLang || !voiceStatus || !micStatus) return;

    let synth = window.speechSynthesis;
    let speakingUtter: SpeechSynthesisUtterance | null = null;

    const getBestVoiceFor = (langPrefix: string) => {
      const voices = synth.getVoices() || [];
      let v = voices.find(x => x.lang && x.lang.toLowerCase() === langPrefix.toLowerCase());
      if (v) return v;
      v = voices.find(x => x.lang && x.lang.toLowerCase().startsWith(langPrefix.split('-')[0]));
      if (v) return v;
      return voices[0] || null;
    };

    const speakText = (text: string, lang: string) => {
      if (!('speechSynthesis' in window)) { voiceStatus.textContent = 'TTS not supported'; return; }
      if (!text || text.trim().length === 0) { voiceStatus.textContent = 'No text to speak'; return; }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang || 'en-IN';
      const voice = getBestVoiceFor(utter.lang);
      if (voice) utter.voice = voice;
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.onstart = () => { speakingUtter = utter; voiceStatus.textContent = 'Speaking...'; };
      utter.onend = () => { speakingUtter = null; voiceStatus.textContent = 'Done'; };
      utter.onerror = (e) => { speakingUtter = null; voiceStatus.textContent = 'Speech error'; console.error(e); };
      synth.speak(utter);
    };

    const handleStopSpeech = () => {
      if (synth && synth.speaking) synth.cancel();
      if(voiceStatus) voiceStatus.textContent = 'Stopped';
    };

    const getLatestAssistantText = () => {
      const msgs = document.querySelectorAll('.assistant-message');
      if (msgs && msgs.length) {
        const last = msgs[msgs.length - 1] as HTMLElement;
        return last.textContent?.trim() || '';
      }
      return '';
    };

    const handleSpeak = () => {
      const txt = getLatestAssistantText();
      const lang = voiceLang.value || 'en-IN';
      if (!txt) {
        if(voiceStatus) voiceStatus.textContent = 'No response found';
        return;
      }
      speakText(txt, lang);
    };

    let recognition: any = null;
    let recognizing = false;

    const createRecognition = (lang: string) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
      if (!SpeechRecognition) return null;
      const r = new SpeechRecognition();
      r.lang = lang || 'en-IN';
      r.interimResults = false;
      r.maxAlternatives = 1;
      r.continuous = false;
      return r;
    };
    
    const stopRecognition = () => {
      if(recognition) {
        try { recognition.stop(); } catch(e){}
        recognition = null;
      }
      recognizing = false;
      if (micStatus) micStatus.textContent = 'Idle';
      if (micBtn) micBtn.textContent = '🎤 Mic';
    }

    const handleMicToggle = async () => {
      if (recognizing) {
        stopRecognition();
        return;
      }
      const lang = voiceLang.value === 'hi-IN' ? 'hi-IN' : 'en-IN';
      recognition = createRecognition(lang);
      if (!recognition) {
        if (micStatus) micStatus.textContent = 'STT not supported';
        return;
      }
      recognition.onstart = () => { recognizing = true; if (micStatus) micStatus.textContent = 'Listening...'; if (micBtn) micBtn.textContent = '🎤 (Stop)'; };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if(micStatus) micStatus.textContent = 'Heard: ' + transcript;
        const inputEl = document.getElementById(CHAT_INPUT_ID) as HTMLInputElement;
        if (inputEl) {
          inputEl.value = transcript;
          inputEl.focus();
        }
      };
      recognition.onerror = (e: any) => { console.error('recognition error', e); if (micStatus) micStatus.textContent = 'Recognition error'; stopRecognition(); };
      recognition.onend = () => { stopRecognition(); };
      recognition.start();
    };

    const ensureVoicesLoaded = () => {
      return new Promise<SpeechSynthesisVoice[]>((resolve) => {
        let voices = synth.getVoices();
        if (voices.length) return resolve(voices);
        synth.onvoiceschanged = () => {
          voices = synth.getVoices();
          resolve(voices);
        };
        setTimeout(() => resolve(synth.getVoices()), 1200);
      });
    };

    ensureVoicesLoaded().then(() => {
      if(voiceStatus) voiceStatus.textContent = 'Voice ready';
    }).catch(() => {
      if(voiceStatus) voiceStatus.textContent = 'Voice ready (limited)';
    });

    speakBtn.addEventListener('click', handleSpeak);
    stopSpeechBtn.addEventListener('click', handleStopSpeech);
    micBtn.addEventListener('click', handleMicToggle);

    return () => {
      speakBtn.removeEventListener('click', handleSpeak);
      stopSpeechBtn.removeEventListener('click', handleStopSpeech);
      micBtn.removeEventListener('click', handleMicToggle);
      if (synth) synth.cancel();
      stopRecognition();
    };
  }, []);

  return (
    <>
      <Head>
        <style>{`
          .voiceWidget{display:flex;gap:8px;align-items:center}
          .voiceBtn{padding:8px 10px;border-radius:8px;border:0;cursor:pointer;background:#1398d8;color:#fff}
          .micBtn{background:#2b9edb}
          .stopBtn{background:#ff6b6b}
          .langSelect{padding:6px;border-radius:6px;border:1px solid #ddd}
          .statusTiny{font-size:0.9rem;color:#444;margin-left:8px}
        `}</style>
      </Head>
      <div id="voiceControls" style={{ maxWidth: '900px', margin: '12px auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="voiceWidget">
          <button id="speakBtn" className="voiceBtn" title="Speak assistant's reply">🔊 Speak</button>
          <button id="stopSpeechBtn" className="voiceBtn stopBtn" title="Stop speaking">■ Stop</button>
          <select id="voiceLang" className="langSelect" title="Select language">
            <option value="en-IN">English (India)</option>
            <option value="hi-IN">हिन्दी</option>
          </select>
          <label className="statusTiny dark:text-gray-300" id="voiceStatus">Ready</label>
        </div>
        <div className="voiceWidget" style={{ marginLeft: '16px' }}>
          <button id="micBtn" className="voiceBtn micBtn" title="Start / Stop microphone">🎤 Mic</button>
          <label className="statusTiny dark:text-gray-300" id="micStatus">Mic idle</label>
        </div>
      </div>
    </>
  );
}


export default function AIPsychiatristPage() {
  const { userName, userImage } = useUserProfile();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, formAction, isPending] = useActionState(aiPsychiatristAction, initialState);
  const [speechState, speechAction, isTranscribing] = useActionState(speechToTextAction, initialSpeechState);
  
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFormAction = (formData: FormData) => {
    const query = formData.get('query') as string;
    if (!query) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);

    formData.set('history', JSON.stringify(messages));
    formAction(formData);
    formRef.current?.reset();
  };
  
  useEffect(() => {
    if (!isPending) {
        if (state.response) {
          setMessages(prev => [...prev, { role: 'assistant', content: state.response! }]);
        }
        if (state.error) {
          const errorMessage = `Sorry, I encountered an error: ${state.error}`;
          setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
        }
    }
  }, [state, isPending]);

  useEffect(() => {
    if (speechState?.transcript && inputRef.current) {
      inputRef.current.value = speechState.transcript;
      toast({ title: 'Transcription complete', description: 'Your message is ready to send.' });
    }
    if (speechState?.error) {
      toast({ variant: 'destructive', title: 'Transcription Failed', description: speechState.error });
    }
  }, [speechState, toast]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages, isPending]);

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
          speechAction(formData);
        };
        stream.getTracks().forEach(track => track.stop()); // Stop the microphone access
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast({ title: 'Recording started...', description: 'Speak your message now.' });
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

  const assistantImage = PlaceHolderImages.find(img => img.id === 'assistant-avatar');

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Psychiatrist</h1>
        <p className="text-muted-foreground">
          A safe space to talk about your mental health.
        </p>
      </div>
      <VoiceWidget />
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit />
            Chat with Your AI Companion
          </CardTitle>
          <CardDescription>
            This is a safe and confidential space. Your privacy is respected.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 && !isPending && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-4">
                  <BrainCircuit className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">Hello! I'm here to listen.</p>
                  <p>How are you feeling today? You can talk to me in English or Hindi.</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'justify-end' : ''
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-9 w-9">
                      {assistantImage && <AvatarImage src={assistantImage.imageUrl} alt="AI Assistant" data-ai-hint={assistantImage.imageHint}/>}
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted assistant-message'
                    }`}
                  >
                     <article className="prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown>{message.content}</ReactMarkdown></article>
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
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span className="text-sm italic">AI is thinking...</span>
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form
            ref={formRef}
            id="chatForm"
            action={handleFormAction}
            className="flex w-full items-center gap-2"
          >
            <Input
              ref={inputRef}
              id="chatInput"
              name="query"
              placeholder="Share your feelings here... (English or Hindi)"
              className="flex-1"
              autoComplete="off"
              disabled={isPending || isTranscribing}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
            />
             <Button type="button" size="icon" variant={isRecording ? 'destructive' : 'outline'} onClick={isRecording ? stopRecording : startRecording} disabled={isTranscribing || isPending}>
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              {isTranscribing && <Sparkles className="h-5 w-5 animate-pulse" />}
              <span className="sr-only">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
            </Button>
            <SubmitButton />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
