'use client';

import React, { useActionState, useRef, useState, useEffect, useCallback } from 'react';
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
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Scan, Sparkles, Upload, X, Bot, Terminal, Camera, CameraOff, SwitchCamera, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { diseaseScannerAction } from './actions';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  response: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
          Scanning...
        </>
      ) : (
        <>
          <Scan className="mr-2 h-5 w-5" />
          Scan Disease
        </>
      )}
    </Button>
  );
}

export default function DiseaseScannerPage() {
  const [state, formAction] = useActionState(diseaseScannerAction, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const availableVideoInputsRef = useRef<MediaDeviceInfo[]>([]);
  const currentDeviceIdRef = useRef<string | null>(null);
  const usingFrontRef = useRef(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const attachStream = useCallback((stream: MediaStream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.warn('video.play() error', e));
    }
    streamRef.current = stream;
  }, []);

  const startCamera = useCallback(async ({ deviceId, facingMode }: { deviceId?: string | null; facingMode?: 'user' | 'environment' } = {}) => {
    stopStream();
    setHasCameraPermission(null);

    const constraints = {
      video: deviceId 
        ? { deviceId: { exact: deviceId } }
        : { facingMode: { exact: facingMode || 'environment' } }
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      attachStream(stream);
      setHasCameraPermission(true);
      const track = stream.getVideoTracks()[0];
      if (track) {
          currentDeviceIdRef.current = track.getSettings().deviceId || null;
      }
    } catch (err) {
      console.error("Failed to start camera with constraints:", constraints, err);
      // Fallback to any video device
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        attachStream(stream);
        setHasCameraPermission(true);
      } catch (finalErr) {
        console.error("Final camera fallback failed:", finalErr);
        setHasCameraPermission(false);
        setIsCameraOpen(false);
        toast({
          variant: "destructive",
          title: "Camera Error",
          description: "Could not access camera. Please check permissions.",
        });
      }
    }
  }, [attachStream, stopStream, toast]);
  
  const openCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({ variant: 'destructive', title: 'Camera not supported' });
        return;
    }
    setIsCameraOpen(true);
    setPreview(null);
    try {
        // This initial call helps populate device labels
        const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
        tempStream.getTracks().forEach(t => t.stop());
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        availableVideoInputsRef.current = devices.filter(d => d.kind === 'videoinput');

        let preferredDeviceId: string | null = null;
        if(availableVideoInputsRef.current.length > 1) {
            const backCamera = availableVideoInputsRef.current.find(d => d.label.toLowerCase().includes('back'));
            preferredDeviceId = backCamera?.deviceId || availableVideoInputsRef.current[1]?.deviceId || null;
        }

        await startCamera({ deviceId: preferredDeviceId, facingMode: 'environment' });
        usingFrontRef.current = false;
    } catch (err) {
       await startCamera({ facingMode: 'environment' });
    }
  }, [startCamera, toast]);


  const closeCamera = useCallback(() => {
    stopStream();
    setIsCameraOpen(false);
  }, [stopStream]);

  const switchCamera = useCallback(async () => {
    if (availableVideoInputsRef.current.length < 2) {
      toast({ title: "No other camera found." });
      return;
    }
    usingFrontRef.current = !usingFrontRef.current;
    
    // Find the other device
    const otherDevice = availableVideoInputsRef.current.find(d => d.deviceId !== currentDeviceIdRef.current);
    const newDeviceId = otherDevice?.deviceId || null;
    
    await startCamera({ deviceId: newDeviceId });
  }, [startCamera, toast]);

  const takePicture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPreview(dataUri);
        closeCamera();
      }
    }
  }, [closeCamera]);


  useEffect(() => {
    return () => {
      // Cleanup stream when component unmounts
      stopStream();
    };
  }, [stopStream]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
      setPreview(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
  }

  const handleFormAction = (formData: FormData) => {
    if (preview) {
      formData.append('photoDataUri', preview);
    }
    formAction(formData);
  };

  return (
    <div className="space-y-8">
       <canvas ref={canvasRef} className="hidden"></canvas>
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Disease Scanner</h1>
        <p className="text-muted-foreground">
          Upload an image of a skin condition or other visible symptom for an AI-powered analysis.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <form ref={formRef} action={handleFormAction}>
            <CardHeader>
              <CardTitle>Scan a Symptom</CardTitle>
              <CardDescription>
                Upload an image, or use your camera to take a picture.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="symptom-image">Symptom Image</Label>
                
                {isCameraOpen ? (
                  <div className="relative">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md border aspect-video object-cover bg-black" />
                    {hasCameraPermission === false ? (
                       <Alert variant="destructive" className="absolute top-2 left-2 right-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Camera Access Denied</AlertTitle>
                          <AlertDescription>
                            Please enable camera permissions to use this feature.
                          </AlertDescription>
                        </Alert>
                    ) : (
                      <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
                          <Button type="button" onClick={takePicture}>Take Picture</Button>
                          <Button type="button" variant="outline" onClick={switchCamera} disabled={availableVideoInputsRef.current.length < 2}><SwitchCamera /></Button>
                          <Button type="button" variant="destructive" onClick={closeCamera}><CameraOff /></Button>
                      </div>
                    )}
                  </div>
                ) : (
                  preview ? (
                     <div className="relative">
                       <Image src={preview} alt="Symptom preview" width={200} height={200} className="rounded-md border aspect-square object-cover w-full" />
                       <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleRemoveImage}>
                         <X className="h-4 w-4"/>
                         <span className="sr-only">Remove image</span>
                       </Button>
                     </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div 
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary/80"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                        </div>
                         <input ref={fileInputRef} id="symptom-image" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                      </div>
                       <Button type="button" variant="outline" className="w-full" onClick={openCamera}>
                          <Camera className="mr-2 h-4 w-4" />
                          Open Camera
                       </Button>
                     </div>
                  )
                )}

              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Describe Your Symptoms (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="e.g., 'This rash appeared on my arm 2 days ago. It's red, itchy, and has small bumps.' (The AI will analyze the image if you leave this blank)"
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
            <CardDescription>
              The AI's analysis will appear here. This is not a medical diagnosis.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1">
                <div className="pr-4">
                  {!state.response && !state.error && (
                    <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                      <Bot className="mx-auto h-12 w-12" />
                      <p className="mt-4">Your scan results will be shown here.</p>
                    </div>
                  )}
                  {state.response && (
                    <article className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{state.response}</ReactMarkdown>
                    </article>
                  )}
                  {state.error && (
                    <Alert variant="destructive" className="h-full">
                      <Terminal className="h-4 w-4" />
                      <AlertTitle>Scan Failed</AlertTitle>
                      <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
