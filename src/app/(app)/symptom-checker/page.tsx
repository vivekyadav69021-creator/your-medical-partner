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
import { Bot, Sparkles, Terminal, Camera, Upload, ScanSearch, FileText, Video, Trash2 } from 'lucide-react';
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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const liveScanFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('symptoms');


  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    
    if (activeTab === 'scan') {
        getCameraPermission();
    }


    return () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [activeTab]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, source: 'report' | 'scan') => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (source === 'report') {
          setImagePreview(result);
        } else {
          setCapturedImage(result);
        }
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
        setCapturedImage(dataUri);
        toast({ title: 'Image Captured', description: 'Your image is ready for analysis below.' });
      }
    }
  };
  
  const handleFormAction = (formData: FormData) => {
    let imageToSubmit : string | null = null;
    const sourceTab = formData.get('source_tab');

    if (sourceTab === 'report') {
        imageToSubmit = imagePreview;
    } else if (sourceTab === 'scan') {
        imageToSubmit = capturedImage;
    }
    
    if (imageToSubmit) {
      formData.set('symptomImageDataUri', imageToSubmit);
    }
    formAction(formData);
  }
  
  const resetCapturedImage = () => {
    setCapturedImage(null);
    if(liveScanFileInputRef.current) {
        liveScanFileInputRef.current.value = '';
    }
  }

  const resetUploadedImage = () => {
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Disease Scanner</h1>
        <p className="text-muted-foreground">
          Use our AI tools to analyze symptoms, reports, or live images.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="symptoms"><ScanSearch className="mr-2" />Symptom Check</TabsTrigger>
          <TabsTrigger value="report"><FileText className="mr-2" />Report Analysis</TabsTrigger>
          <TabsTrigger value="scan"><Video className="mr-2" />Live Scan</TabsTrigger>
        </TabsList>
        <TabsContent value="symptoms" className="mt-6">
          <Card>
            <form action={handleFormAction}>
              <input type="hidden" name="source_tab" value="symptoms" />
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
              <input type="hidden" name="source_tab" value="report" />
              <CardHeader>
                <CardTitle>Report Analysis</CardTitle>
                <CardDescription>Upload a medical report or photo of a symptom.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="symptoms-report">Symptoms / Notes</Label>
                    <Textarea
                      id="symptoms-report"
                      name="symptoms"
                      placeholder="e.g., 'This rash appeared yesterday. It is itchy. Please analyze the attached image.'"
                      rows={3}
                      required
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
                      onChange={(e) => handleFileChange(e, 'report')}
                      className="hidden"
                  />
                  <div className="p-4 border-2 border-dashed rounded-lg text-center">
                      {imagePreview ? (
                          <div className="relative group mx-auto max-w-[250px]">
                              <Image src={imagePreview} alt="Symptom preview" width={250} height={250} className="rounded-md object-contain max-h-[250px]" />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>Change</Button>
                                  <Button type="button" variant="destructive" size="icon" onClick={resetUploadedImage}><Trash2 className="h-4 w-4"/></Button>
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
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Live Camera</CardTitle>
                  <CardDescription>Use your camera to capture an image for analysis.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4">
                  <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative flex items-center justify-center">
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                      <canvas ref={canvasRef} className="hidden" />
                       {hasCameraPermission === false && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background/80">
                               <Camera className="w-12 h-12 text-muted-foreground mb-2" />
                               <p className="font-medium">Camera not available</p>
                               <p className="text-sm text-muted-foreground">Please allow camera access in your browser.</p>
                          </div>
                       )}
                       {hasCameraPermission === null && !videoRef.current?.srcObject && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-background/80">
                               <Sparkles className="w-12 h-12 text-muted-foreground mb-2 animate-pulse" />
                               <p className="font-medium">Initializing Camera...</p>
                          </div>
                       )}
                  </div>
                  <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
                      <Camera className="mr-2 h-4 w-4" />
                      Capture Image
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <form action={handleFormAction}>
                  <input type="hidden" name="source_tab" value="scan" />
                  {capturedImage && (
                    <input type="hidden" name="symptomImageDataUri" value={capturedImage} />
                  )}
                  <CardHeader>
                    <CardTitle>Analyze Captured Image</CardTitle>
                    <CardDescription>Add any notes and submit for analysis.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="symptoms-scan">Symptoms / Notes (Optional)</Label>
                        <Textarea
                          id="symptoms-scan"
                          name="symptoms"
                          placeholder="e.g., 'This appeared on my arm this morning. It's slightly itchy.'"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Image for Analysis</Label>
                        <Input 
                            id="live-scan-image" 
                            name="liveScanImage"
                            type="file" 
                            accept="image/*"
                            ref={liveScanFileInputRef}
                            onChange={(e) => handleFileChange(e, 'scan')}
                            className="hidden"
                        />
                         <div className="p-4 border-2 border-dashed rounded-lg text-center">
                          {capturedImage ? (
                              <div className="relative group mx-auto max-w-[250px]">
                                  <Image src={capturedImage} alt="Captured symptom" width={250} height={250} className="rounded-md object-contain max-h-[250px]" />
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button type="button" variant="destructive" size="icon" onClick={resetCapturedImage}><Trash2 className="h-4 w-4"/></Button>
                                  </div>
                              </div>
                          ) : (
                              <div className="flex flex-col items-center justify-center h-[150px] space-y-2">
                                  <Camera className="w-12 h-12 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">Capture an image or</p>
                                  <Button type="button" variant="outline" onClick={() => liveScanFileInputRef.current?.click()}>
                                      <Upload className="mr-2 h-4 w-4" /> Upload File
                                  </Button>
                              </div>
                          )}
                        </div>
                      </div>
                  </CardContent>
                  <CardFooter>
                    <SubmitButton text="Analyze Captured Image"/>
                  </CardFooter>
                </form>
              </Card>
            </div>
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
