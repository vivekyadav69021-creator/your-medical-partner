'use client';

import React, { useActionState, useRef, useState, useEffect, useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Scan, Sparkles, Upload, X, Camera, CameraOff, AlertTriangle, Hospital, Save, FileText, Image as ImageIcon } from 'lucide-react';
import { analyzeXrayAction, healthAssistantAction } from './actions';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialXrayState = {
  result: null,
  error: null,
};

const initialDiseaseState = {
    response: null,
    error: null,
}

function escapeHtml(s: string | undefined | null){ return String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[String(c)] as string)); }

// Column 1: Disease Image Scanner
function DiseaseImageScanner() {
    const [state, formAction, isAnalyzing] = useActionState(healthAssistantAction, initialDiseaseState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleClear = () => {
        setPreview(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
        formRef.current?.reset();
    };

    const handleFormAction = (formData: FormData) => {
        if (preview) {
            formData.set('photoDataUri', preview);
            formData.set('query', 'Analyze this image of a health concern.');
            formAction(formData);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon/>Disease Image Scanner</CardTitle>
                <CardDescription>Upload a photo of a visible symptom (like a skin rash) for a preliminary analysis by the Health Assistant AI.</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={handleFormAction} className="space-y-4">
                    <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                    {preview && (
                        <div className="relative mt-2">
                            <Image src={preview} alt="Disease preview" width={300} height={300} className="rounded-md border aspect-square object-cover w-full" />
                        </div>
                    )}
                    <div className="flex gap-2 mt-2">
                        <Button type="submit" disabled={!preview || isAnalyzing}>
                            {isAnalyzing ? (<><Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Analyzing...</>) : 'Analyze Image'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleClear}>Clear</Button>
                    </div>
                </form>
            </CardContent>
             <CardFooter className="flex-col items-start gap-2">
                {isAnalyzing && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span>AI is analyzing the image...</span>
                    </div>
                )}
                {state.response && !isAnalyzing && (
                    <div className="resultBox prose prose-sm dark:prose-invert max-w-full">
                        <ReactMarkdown>{state.response}</ReactMarkdown>
                    </div>
                )}
                 {state.error && !isAnalyzing && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Analysis Failed</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}
            </CardFooter>
        </Card>
    );
}


// Column 2: X-Ray Scanner
function XRayScanner() {
  const [state, formAction, isAnalyzing] = useActionState(analyzeXrayAction, initialXrayState);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  }, []);

  const openCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({ variant: 'destructive', title: "Camera Not Supported" });
        return;
    }
    stopStream();
    setIsCameraOpen(true);
    setPreview(null);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
    } catch (err) {
       toast({ variant: 'destructive', title: 'Camera Error', description: 'Could not access camera. Please check permissions.' });
       setIsCameraOpen(false);
    }
  }, [toast, stopStream]);

  const closeCamera = useCallback(() => {
    stopStream();
    setIsCameraOpen(false);
  }, [stopStream]);

  const takePicture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
            if(blob) {
                const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
                setSelectedFile(file);
                setPreview(URL.createObjectURL(file));
                closeCamera();
            }
        }, 'image/jpeg', 0.9);
      }
    }
  }, [closeCamera]);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  
  const handleFormAction = async (formData: FormData) => {
    if (preview && selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        const base64data = reader.result;
        formData.append('photoDataUri', base64data as string);
        formData.append('contentType', selectedFile.type);
        formAction(formData);
      };
    } else {
        toast({ variant: 'destructive', title: "Analysis Failed", description: "Please upload an image to be scanned." });
        return;
    }
  };
  
   useEffect(() => {
    if(state.result && user && firestore) {
      try {
        const doc = {
          createdAt: serverTimestamp(),
          findings: state.result.findings || [],
          recommendationText: state.result.recommendationText || '',
          fileName: selectedFile?.name || 'camera.jpg',
        };
        const analysesCol = collection(firestore, 'users', user.uid, 'xrayAnalyses');
        addDoc(analysesCol, doc);
      } catch (e) {
        console.warn('Failed to save analysis record', e);
      }
    }
  }, [state.result, user, firestore, selectedFile]);


  return (
    <Card>
      <canvas ref={canvasRef} className="hidden"></canvas>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Hospital />X-ray / Radiology Scanner</CardTitle>
        <CardDescription>Upload chest/limb X-ray for analysis by an AI model. This tool is specialized for radiology images.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleFormAction} className="space-y-4">
          <Input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*"/>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={openCamera}><Camera className="mr-2"/>Open Camera</Button>
            <Button type="submit" disabled={isAnalyzing || !selectedFile}>
              {isAnalyzing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Scan className="mr-2"/>Analyze X-ray
                </>
              )}
            </Button>
          </div>
          {isCameraOpen ? (
              <div className="relative">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md border aspect-video object-cover bg-black" />
                <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
                    <Button type="button" onClick={takePicture}>Take Picture</Button>
                    <Button type="button" variant="destructive" onClick={closeCamera}><CameraOff /></Button>
                </div>
              </div>
            ) : preview && (
              <div className="relative mt-2">
                <Image src={preview} alt="X-ray preview" width={400} height={400} className="rounded-md border aspect-square object-cover w-full" />
              </div>
          )}
        </form>
      </CardContent>
       <CardFooter className="flex-col items-start gap-2">
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>AI is analyzing the X-ray...</span>
            </div>
          )}
          {state.result && !isAnalyzing && (
              <div className="resultBox w-full">
                  <h5 className="font-bold">Findings</h5>
                  <ul className="list-disc pl-5 mt-2 space-y-2 text-sm">
                    {(state.result.findings || []).map((f: any, i: number) => (
                      <li key={i}>
                          <b>{escapeHtml(f.label)}</b> — Confidence: {Math.round((f.confidence||0)*100)}%
                          <p className="text-xs text-muted-foreground">{escapeHtml(f.notes)}</p>
                      </li>
                    ))}
                  </ul>
                    <h5 className="font-bold mt-4">Recommendation</h5>
                    <p className="text-sm">{escapeHtml(state.result.recommendationText || 'Consult a qualified doctor for confirmation.')}</p>
              </div>
          )}
            {state.error && !isAnalyzing && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
        </CardFooter>
    </Card>
  );
}

// Column 3: Lab Report Analyzer
function LabReportAnalyzer() {
    const [labResult, setLabResult] = useState<any>(null);
    const [labStatus, setLabStatus] = useState('');
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const inputs = {
        fbs: useRef<HTMLInputElement>(null),
        hbA1c: useRef<HTMLInputElement>(null),
        chol: useRef<HTMLInputElement>(null),
        ldl: useRef<HTMLInputElement>(null),
        hdl: useRef<HTMLInputElement>(null),
        tg: useRef<HTMLInputElement>(null),
    };

    const analyzeLabs = () => {
        const values = {
            fbs: Number(inputs.fbs.current?.value) || null,
            hbA1c: Number(inputs.hbA1c.current?.value) || null,
            chol: Number(inputs.chol.current?.value) || null,
            ldl: Number(inputs.ldl.current?.value) || null,
            hdl: Number(inputs.hdl.current?.value) || null,
            tg: Number(inputs.tg.current?.value) || null,
        };

        const out: { timestamp: string, interpretations: any[], recommendation: string } = { timestamp: new Date().toISOString(), interpretations: [], recommendation: '' };

        if(values.fbs != null){
            if(values.fbs < 70) out.interpretations.push({ test:'Fasting Glucose', value: values.fbs, note:'Low (hypoglycemia). If symptomatic, seek care.' });
            else if(values.fbs < 100) out.interpretations.push({ test:'Fasting Glucose', value: values.fbs, note:'Normal fasting glucose.' });
            else if(values.fbs < 126) out.interpretations.push({ test:'Fasting Glucose', value: values.fbs, note:'Impaired fasting glucose (prediabetes) — consider lifestyle changes.' });
            else out.interpretations.push({ test:'Fasting Glucose', value: values.fbs, note:'High (diabetic range). Consult physician.' });
        }
        if(values.hbA1c != null){
            if(values.hbA1c < 5.7) out.interpretations.push({ test:'HbA1c', value: values.hbA1c + '%', note:'Normal' });
            else if(values.hbA1c < 6.5) out.interpretations.push({ test:'HbA1c', value: values.hbA1c + '%', note:'Prediabetes' });
            else out.interpretations.push({ test:'HbA1c', value: values.hbA1c + '%', note:'Diabetes range — medical review recommended' });
        }
        if(values.chol != null){
            if(values.chol < 200) out.interpretations.push({ test:'Total Cholesterol', value: values.chol, note:'Desirable' });
            else if(values.chol < 240) out.interpretations.push({ test:'Total Cholesterol', value: values.chol, note:'Borderline high' });
            else out.interpretations.push({ test:'Total Cholesterol', value: values.chol, note:'High — evaluate diet and meds' });
        }
        if(values.ldl != null){
            if(values.ldl < 100) out.interpretations.push({ test:'LDL', value: values.ldl, note:'Optimal' });
            else out.interpretations.push({ test:'LDL', value: values.ldl, note:'Near optimal' });
        }
        if(values.hdl != null){
            if(values.hdl < 40) out.interpretations.push({ test:'HDL', value: values.hdl, note:'Low — higher is better' });
            else out.interpretations.push({ test:'HDL', value: values.hdl, note:'Protective / Good' });
        }
        if(values.tg != null){
            if(values.tg < 150) out.interpretations.push({ test:'Triglycerides', value: values.tg, note:'Normal' });
            else out.interpretations.push({ test:'Triglycerides', value: values.tg, note:'High — lifestyle changes recommended' });
        }

        out.recommendation = 'This is an automated interpretation. For diagnosis & treatment, consult your physician.';
        setLabResult(out);
    }
    
    const saveReport = async () => {
        if (!labResult) {
            toast({ variant: 'destructive', title: 'No Report', description: 'Please analyze the lab values first.'});
            return;
        }
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: 'Please sign in to save the report.'});
            return;
        }
        setLabStatus('Saving...');
        try {
            const reportsCol = collection(firestore, 'users', user.uid, 'labReports');
            await addDoc(reportsCol, { ...labResult, savedAt: serverTimestamp() });
            setLabStatus('Saved ✓');
            toast({ title: 'Report Saved', description: 'Your lab report interpretation has been saved.'});
        } catch (error) {
            console.error(error);
            setLabStatus('Save failed.');
            toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save your report.'});
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText />Lab Report Analyzer</CardTitle>
                <CardDescription>Get a quick interpretation of common lab test values. This is for educational purposes only.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><Label htmlFor="fbs">Fasting Glucose (mg/dL)</Label><Input id="fbs" type="number" ref={inputs.fbs} /></div>
                    <div className="space-y-1"><Label htmlFor="hbA1c">HbA1c (%)</Label><Input id="hbA1c" type="number" step="0.1" ref={inputs.hbA1c} /></div>
                    <div className="space-y-1"><Label htmlFor="chol">Total Cholesterol (mg/dL)</Label><Input id="chol" type="number" ref={inputs.chol} /></div>
                    <div className="space-y-1"><Label htmlFor="ldl">LDL (mg/dL)</Label><Input id="ldl" type="number" ref={inputs.ldl} /></div>
                    <div className="space-y-1"><Label htmlFor="hdl">HDL (mg/dL)</Label><Input id="hdl" type="number" ref={inputs.hdl} /></div>
                    <div className="space-y-1"><Label htmlFor="tg">Triglycerides (mg/dL)</Label><Input id="tg" type="number" ref={inputs.tg} /></div>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                 <div className="flex items-center gap-4">
                    <Button onClick={analyzeLabs}>Analyze Labs</Button>
                    <Button onClick={saveReport} variant="secondary"><Save className="mr-2 h-4 w-4" />Save Report</Button>
                 </div>
                 {labResult && (
                    <div className="resultBox w-full">
                        <h4 className="font-semibold">Interpretation — {new Date(labResult.timestamp).toLocaleString()}</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                            {labResult.interpretations.map((i: any, idx: number) => (
                                <li key={idx}><b>{i.test}</b>: {i.value} — <i>{i.note}</i></li>
                            ))}
                        </ul>
                        <p className="font-semibold mt-4">Recommendation:</p>
                        <p className="text-sm">{labResult.recommendation}</p>
                    </div>
                )}
                 <p className="text-sm text-muted-foreground">{labStatus}</p>
            </CardFooter>
        </Card>
    );
}

export default function DiseaseScannerPage() {
    return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Disease Scanner</h1>
            <p className="text-muted-foreground">AI-powered analysis for images and lab reports.</p>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription>
            The analysis is informative only and not a medical diagnosis. Always consult a qualified doctor/radiologist for definitive interpretation.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="image-scanner">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="image-scanner">Disease Image Scanner</TabsTrigger>
                <TabsTrigger value="xray-scanner">X-ray Scanner</TabsTrigger>
                <TabsTrigger value="lab-scanner">Lab Report Analyzer</TabsTrigger>
            </TabsList>
            <TabsContent value="image-scanner" className="mt-6">
                <DiseaseImageScanner />
            </TabsContent>
            <TabsContent value="xray-scanner" className="mt-6">
                <XRayScanner />
            </TabsContent>
            <TabsContent value="lab-scanner" className="mt-6">
                <LabReportAnalyzer />
            </TabsContent>
        </Tabs>
    </div>
  );
}
