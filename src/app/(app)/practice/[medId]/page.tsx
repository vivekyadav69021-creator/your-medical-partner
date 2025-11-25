'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { guidedMeditations, Meditation } from '@/lib/meditation-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Play, Pause, Timer, Save } from 'lucide-react';
import Link from 'next/link';

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { medId } = params;

  const [meditation, setMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('10');

  const audioRef = useRef<HTMLAudioElement>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const foundMeditation = guidedMeditations.find(m => m.id === medId);
    if (foundMeditation) {
      setMeditation(foundMeditation);
      setSelectedDuration(String(foundMeditation.duration_min));
      setTimer(foundMeditation.duration_min * 60);
    } else {
      // Handle case where meditation is not found
    }
  }, [medId]);

  useEffect(() => {
    if (isTimerActive && timer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0 && isTimerActive) {
        setIsTimerActive(false);
        if(audioRef.current) audioRef.current.pause();
        toast({ title: 'Timer Finished!', description: 'Your meditation session is complete.' });
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerActive, timer, toast]);


  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimerStart = () => {
    setTimer(parseInt(selectedDuration, 10) * 60);
    setIsTimerActive(true);
    if (meditation?.audio_url) {
        handlePlayPause();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSaveSession = () => {
    toast({
        title: 'Session Saved!',
        description: `Your ${meditation?.title} session has been logged.`,
    });
    router.push('/meditation-hub');
  }

  if (!meditation) {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Meditation not found</h1>
            <Button variant="link" asChild>
                <Link href="/meditation-hub">Back to Hub</Link>
            </Button>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" asChild>
            <Link href="/meditation-hub">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Meditation Hub
            </Link>
        </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{meditation.title}</CardTitle>
          <CardDescription>Player, timer, and mood check for your practice session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label>Guided Audio</Label>
                <div className="flex items-center gap-4 mt-2">
                    <audio ref={audioRef} src={meditation.audio_url} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} className="hidden" />
                    <Button onClick={handlePlayPause} size="icon">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <p className="text-sm text-muted-foreground">Follow the guided audio for your session.</p>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Session Timer</Label>
                <div className="flex items-center gap-4">
                    <Select value={selectedDuration} onValueChange={setSelectedDuration} disabled={isTimerActive}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 min</SelectItem>
                            <SelectItem value="10">10 min</SelectItem>
                            <SelectItem value="15">15 min</SelectItem>
                            <SelectItem value="20">20 min</SelectItem>
                        </SelectContent>
                    </Select>
                     <Button onClick={handleTimerStart} disabled={isTimerActive}>
                        <Timer className="mr-2 h-4 w-4" />
                        Start Timer
                    </Button>
                </div>
                <div className="p-4 bg-muted rounded-lg text-center">
                    <p className="text-4xl font-bold font-mono tracking-widest">{formatTime(timer)}</p>
                    <p className="text-sm text-muted-foreground">{isTimerActive ? 'Session in progress...' : 'Timer not started'}</p>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="moodSelect">Mood After Session</Label>
                 <div className="flex items-center gap-4">
                    <Select>
                        <SelectTrigger id="moodSelect" className="flex-1">
                            <SelectValue placeholder="How do you feel?" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="relaxed">Relaxed</SelectItem>
                            <SelectItem value="neutral">Neutral</SelectItem>
                            <SelectItem value="alert">Alert</SelectItem>
                            <SelectItem value="tired">Tired</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleSaveSession}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Session
                    </Button>
                 </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
