'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  PersonStanding,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function VideoCallPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const doctorName = searchParams.get('doctor') || 'Doctor';
  const { toast } = useToast();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const doctorImage = PlaceHolderImages.find(p => p.id === 'doctor-5');

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setHasCameraPermission(true);
        streamRef.current = stream;

        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera and microphone permissions in your browser settings.',
        });
      }
    };

    getCameraPermission();

    return () => {
        // Stop all tracks on cleanup
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const toggleMute = () => {
    if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
        streamRef.current.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsVideoOff(!isVideoOff);
    }
  };
  
  const leaveCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    // In a real app, you would navigate away or close the modal.
    // For now, we just toast.
    toast({
        title: "Call Ended",
        description: `Your consultation with ${doctorName} has ended.`
    });
  }


  return (
    <div className="space-y-6">
       <Button variant="ghost" asChild>
          <Link href="/consultation">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Consultations
          </Link>
       </Button>
      <Card>
        <CardHeader>
          <CardTitle>Video Consultation with {doctorName}</CardTitle>
          <CardDescription>Appointment ID: {params.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Doctor's Video Feed */}
            <div className="relative aspect-video bg-secondary rounded-lg flex flex-col items-center justify-center">
               {doctorImage && <Image src={doctorImage.imageUrl} alt={doctorName} layout="fill" className="object-cover rounded-lg" data-ai-hint={doctorImage.imageHint} />}
               <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
               <div className="absolute bottom-4 left-4 text-white font-bold z-10">{doctorName}</div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                 <Card className="p-4 bg-background/80">
                    <p className="text-center text-sm">Doctor has not joined yet.</p>
                 </Card>
               </div>
            </div>

            {/* User's Video Feed */}
            <div className="relative aspect-video bg-secondary rounded-lg flex items-center justify-center">
              <video ref={userVideoRef} className={`w-full h-full object-cover rounded-lg ${isVideoOff ? 'hidden' : 'block'}`} autoPlay muted />
              {(isVideoOff || hasCameraPermission === false) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <PersonStanding className="w-16 h-16" />
                    <p>Your video is off</p>
                </div>
              )}
               {hasCameraPermission === false && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <Alert variant="destructive" className="w-3/4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access to use this feature.
                      </AlertDescription>
                    </Alert>
                </div>
               )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4 mt-6 p-4 bg-muted rounded-lg">
             <Button variant={isMuted ? 'destructive' : 'outline'} size="icon" onClick={toggleMute} className="w-14 h-14 rounded-full">
                {isMuted ? <MicOff /> : <Mic />}
                <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
            </Button>
             <Button variant={isVideoOff ? 'destructive' : 'outline'} size="icon" onClick={toggleVideo} className="w-14 h-14 rounded-full">
                {isVideoOff ? <VideoOff /> : <Video />}
                <span className="sr-only">{isVideoOff ? 'Turn Video On' : 'Turn Video Off'}</span>
            </Button>
            <Link href="/consultation">
                <Button variant="destructive" size="icon" onClick={leaveCall} className="w-14 h-14 rounded-full">
                    <PhoneOff />
                    <span className="sr-only">End Call</span>
                </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
