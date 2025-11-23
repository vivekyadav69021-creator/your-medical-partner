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
import { Bot, Sparkles, Terminal, Camera, Upload, ScanSearch, FileText, Video } from 'lucide-react';
import { aiSymptomCheckAction } from './actions';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const initialState = {
  possibleCauses: null,
  error: null,
};

function SubmitButton({ text = 'Analyze' }: { text?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      {pending ? 'Analyzing...' : text}
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
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();

    return () => {
        const stream = videoRef.current?.srcObject as MediaStream;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        toast({ title: 'Image selected', description: 'The image is ready to be analyzed with your symptoms.' });
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
        toast({ title: 'Image Captured', description: 'The image is ready for analysis. Switch to the Report Analysis tab to submit.' });
      }
    }
  };
  
  const handleFormAction = (formData: FormData) => {
    if (imagePreview) {
      formData.set('symptomImageDataUri', imagePreview);
    }
    formAction(formData);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Disease Scanner</h1>
        <p className="text-muted-foreground">
          Use our AI tools to analyze symptoms, reports, or live images.
        </p>
      </div>

      <Tabs defaultValue="symptoms" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="symptoms"><ScanSearch className="mr-2" />Symptom Check</TabsTrigger>
          <TabsTrigger value="report"><FileText className="mr-2" />Report Analysis</TabsTrigger>
          <TabsTrigger value="scan"><Video className="mr-2" />Live Scan</TabsTrigger>
        </TabsList>
        <TabsContent value="symptoms" className="mt-6">
          <Card>
            <form action={handleFormAction}>
              <CardHeader>
                <CardTitle>Symptom Check</CardTitle>
                <CardDescription>Describe your symptoms for the AI to analyze.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="symptoms-text">Symptoms</Label>
                  <Textarea
                    id="symptoms-text"
                    name="symptoms"
                    placeholder="e.g., 'I have a persistent cough, a slight fever, and a headache.'"
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <SubmitButton text="Analyze Symptoms"/>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="report" className="mt-6">
           <Card>
            <form action={handleFormAction}>
              <CardHeader>
                <CardTitle>Report Analysis</CardTitle>
                <CardDescription>Upload a medical report or photo of a symptom.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="symptoms-report">Symptoms / Notes (Optional)</Label>
                    <Textarea
                      id="symptoms-report"
                      name="symptoms"
                      placeholder="e.g., 'This rash appeared yesterday. It is itchy. Please analyze the attached image.'"
                      rows={3}
                    />
                  </div>
                 <div className="space-y-2">
                  <Label htmlFor="symptom-image">Upload Image</Label>
                  <Input 
                      id="symptom-image" 
                      name="symptomImage"
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                  />
                  <div className="p-4 border-2 border-dashed rounded-lg text-center">
                      {imagePreview ? (
                          <div className="relative group mx-auto max-w-[250px]">
                              <Image src={imagePreview} alt="Symptom preview" width={250} height={250} className="rounded-md object-contain max-h-[250px]" />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>Change Image</Button>
                              </div>
                          </div>
                      ) : (
                          <div className="space-y-2 flex flex-col items-center">
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
                <SubmitButton text="Analyze Report/Image"/>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="scan" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Camera Scan</CardTitle>
                <CardDescription>Use your camera to capture an image and then submit it for analysis in the 'Report Analysis' tab.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4">
                <div className="w-full max-w-md aspect-video bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
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
                <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full max-w-md">
                    <Camera className="mr-2 h-4 w-4" />
                    Capture Image
                </Button>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

       {(state.possibleCauses || state.error) && (
          <Card className="mt-8">
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
