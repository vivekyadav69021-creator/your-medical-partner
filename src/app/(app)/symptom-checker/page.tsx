'use client';

import React, { useActionState, useRef, useState, useEffect } from 'react';
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
import { Bot, Sparkles, Terminal, Camera, Upload, Video } from 'lucide-react';
import { aiSymptomCheckAction } from './actions';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

const initialState = {
  possibleCauses: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      {pending ? 'Analyzing...' : 'Analyze Symptoms & Image'}
    </Button>
  );
}

export default function SymptomCheckerPage() {
  const [state, formAction] = useActionState(aiSymptomCheckAction, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions to use this feature.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
        const stream = videoRef.current?.srcObject as MediaStream;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        const video = videoRef.current;
        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvasRef.current.toDataURL('image/jpeg');
        setImagePreview(dataUri);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Disease Scanner</h1>
        <p className="text-muted-foreground">
          Describe your symptoms, upload an image or use your camera for a more accurate analysis.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <form action={formAction}>
            <CardHeader>
              <CardTitle>Symptom & Report Analysis</CardTitle>
              <CardDescription>
                Provide details and an optional image for our AI to analyze.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  name="symptoms"
                  placeholder="e.g., 'I have a persistent cough, a slight fever, and a headache.'"
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  placeholder="e.g., 'Diagnosed with asthma, allergic to penicillin.'"
                  rows={2}
                />
              </div>

               <div className="space-y-2">
                <Label htmlFor="symptom-image">Upload Image (Optional)</Label>
                <Input 
                    id="symptom-image" 
                    name="symptomImage"
                    type="file" 
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <input type="hidden" name="symptomImageDataUri" value={imagePreview || ''} />

                <div className="p-4 border-2 border-dashed rounded-lg text-center">
                    {imagePreview ? (
                        <div className="relative group">
                            <Image src={imagePreview} alt="Symptom preview" width={200} height={200} className="mx-auto rounded-md object-contain max-h-[200px]" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>Change Image</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Upload a photo of a symptom (e.g., rash) or a medical report.</p>
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                               <Upload className="mr-2 h-4 w-4" /> Upload from Device
                            </Button>
                        </div>
                    )}
                </div>
              </div>

            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Live Camera Scan</CardTitle>
            <CardDescription>
              Use your camera to capture a live image of a symptom.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />
                 {!hasCameraPermission && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background/80">
                         <Camera className="w-12 h-12 text-muted-foreground mb-2" />
                         <p className="font-medium">Camera not available</p>
                         <p className="text-sm text-muted-foreground">Please allow camera access in your browser.</p>
                    </div>
                 )}
            </div>
            <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Capture & Use Image
            </Button>
            <p className="text-xs text-muted-foreground">Captured image will appear in the form.</p>
          </CardContent>
        </Card>
      </div>

       {(state.possibleCauses || state.error) && (
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis Result</CardTitle>
              <CardDescription>
                Possible causes based on the information you provided. This is not a medical diagnosis.
              </CardDescription>
            </CardHeader>
            <CardContent>
                {state.possibleCauses && (
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Possible Causes & Analysis</AlertTitle>
                    <AlertDescription>
                      <article className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{state.possibleCauses}</ReactMarkdown>
                      </article>
                    </AlertDescription>
                  </Alert>
                )}
                {state.error && (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>An Error Occurred</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert>
                )}
            </CardContent>
          </Card>
       )}

    </div>
  );
}
