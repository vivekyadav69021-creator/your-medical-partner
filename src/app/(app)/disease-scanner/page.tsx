'use client';

import React, { useActionState, useRef, useState, useEffect, useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Scan, Sparkles, Upload, X, Camera, CameraOff, SwitchCamera, AlertTriangle, Hospital, Save, FileText } from 'lucide-react';
import { analyzeXrayAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const initialXrayState = {
  result: null,
  error: null,
};

function escapeHtml(s: string | undefined | null){ return String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[String(c)])); }

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

        // Rule-based interpretation
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
        <section>
            <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2"><FileText />Lab Report Analyzer</CardTitle>
                <CardDescription>Get a quick interpretation of common lab test values.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1"><Label htmlFor="fbs">Blood Sugar - Fasting (mg/dL)</Label><Input id="fbs" type="number" ref={inputs.fbs} /></div>
                    <div className="space-y-1"><Label htmlFor="hbA1c">HbA1c (%)</Label><Input id="hbA1c" type="number" step="0.1" ref={inputs.hbA1c} /></div>
                    <div className="space-y-1"><Label htmlFor="chol">Total Cholesterol (mg/dL)</Label><Input id="chol" type="number" ref={inputs.chol} /></div>
                    <div className="space-y-1"><Label htmlFor="ldl">LDL (mg/dL)</Label><Input id="ldl" type="number" ref={inputs.ldl} /></div>
                    <div className="space-y-1"><Label htmlFor="hdl">HDL (mg/dL)</Label><Input id="hdl" type="number" ref={inputs.hdl} /></div>
                    <div className="space-y-1"><Label htmlFor="tg">Triglycerides (mg/dL)</Label><Input id="tg" type="number" ref={inputs.tg} /></div>
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={analyzeLabs}>Analyze Labs</Button>
                    <Button onClick={saveReport} variant="secondary"><Save className="mr-2 h-4 w-4" />Save Report</Button>
                    <p className="text-sm text-muted-foreground">{labStatus}</p>
                </div>
                
                {labResult && (
                    <div className="resultBox">
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
            </CardContent>
        </section>
    )
}

function AnalyzeXrayButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
          Analyzing...
        </>
      ) : (
        <>
          <Scan className="mr-2 h-5 w-5" />
          Analyze Image
        </>
      )}
    </Button>
  );
}

export default function DiseaseScannerPage() {
  const [state, formAction] = useActionState(analyzeXrayAction, initialXrayState);
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
    closeCamera();
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
  
  const handleRemoveImage = () => {
      setPreview(null);
      setSelectedFile(null);
      if(fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleFormAction = async (formData: FormData) => {
    if (preview) {
      formData.append('photoDataUri', preview);
    } else {
        toast({ variant: 'destructive', title: "Analysis Failed", description: "Please upload an image to be scanned." });
        return;
    }
    const response = await analyzeXrayAction(null, formData);
    if(response.result && user && firestore) {
      try {
        const doc = {
          createdAt: serverTimestamp(),
          findings: response.result.findings || [],
          recommendationText: response.result.recommendationText || '',
          fileName: selectedFile?.name || 'camera.jpg',
        };
        const analysesCol = collection(firestore, 'users', user.uid, 'xrayAnalyses');
        await addDoc(analysesCol, doc);
      } catch (e) {
        console.warn('Failed to save analysis record', e);
      }
    }
  };

  return (
    <div className="space-y-8">
       <canvas ref={canvasRef} className="hidden"></canvas>
        <Card>
            <CardHeader>
                <CardTitle>Disease Scanner — X-ray Analysis & Lab Report Interpreter</CardTitle>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Disclaimer</AlertTitle>
                  <AlertDescription>
                    The analysis is informative only and not a medical diagnosis. Always consult a qualified doctor/radiologist for definitive interpretation.
                  </AlertDescription>
                </Alert>
                
                <section className="mt-6">
                    <CardHeader className="px-0">
                        <CardTitle className="flex items-center gap-2"><Hospital />X-ray / Image Scanner</CardTitle>
                    </CardHeader>
                     <CardContent className="px-0 grid md:grid-cols-2 gap-8">
                        <form action={handleFormAction} className="space-y-6">
                             <div className="space-y-2">
                                <Label htmlFor="xray-image">Select image (X-ray / photo)</Label>
                                {isCameraOpen ? (
                                  <div className="relative">
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md border aspect-video object-cover bg-black" />
                                    <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
                                        <Button type="button" onClick={takePicture}>Take Picture</Button>
                                        <Button type="button" variant="destructive" onClick={closeCamera}><CameraOff /></Button>
                                    </div>
                                  </div>
                                ) : (
                                  preview ? (
                                     <div className="relative">
                                       <Image src={preview} alt="Symptom preview" width={400} height={400} className="rounded-md border aspect-square object-cover w-full" />
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
                                         <input ref={fileInputRef} id="xray-image" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                                      </div>
                                       <Button type="button" variant="outline" className="w-full" onClick={openCamera}>
                                          <Camera className="mr-2 h-4 w-4" />
                                          Open Camera
                                       </Button>
                                     </div>
                                  )
                                )}
                            </div>
                            <AnalyzeXrayButton />
                        </form>

                        <div className="space-y-4">
                            <h4 className="font-semibold">Analysis Result</h4>
                            {!state.result && !state.error && (
                                <div className="resultBox text-center text-muted-foreground py-10">
                                    <p>Your scan results will appear here.</p>
                                </div>
                            )}
                            {state.result && (
                                <div className="resultBox">
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
                             {state.error && (
                                <Alert variant="destructive">
                                  <AlertTriangle className="h-4 w-4" />
                                  <AlertTitle>Analysis Failed</AlertTitle>
                                  <AlertDescription>{state.error}</AlertDescription>
                                </Alert>
                              )}
                        </div>
                     </CardContent>
                </section>

                 <hr className="my-8"/>

                 <LabReportAnalyzer />

            </CardContent>
        </Card>
    </div>
  );
}
