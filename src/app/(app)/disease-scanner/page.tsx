
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
import { Scan, Sparkles, X, Camera, CameraOff, AlertTriangle, Hospital, FileText, Image as ImageIcon, SwitchCamera, Upload, Download } from 'lucide-react';
import { analyzeXrayAction, healthAssistantAction, analyzeLabReportImageAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const initialXrayState = {
  result: null,
  error: null,
};

const initialDiseaseState = {
    response: null,
    error: null,
}

const initialLabReportState = {
    result: null,
    error: null,
};


const labels = {
    en: {
        title: 'Disease Scanner',
        description: 'AI-powered analysis for images and lab reports.',
        disclaimerTitle: 'Disclaimer',
        disclaimerText: 'The analysis is informative only and not a medical diagnosis. Always consult a qualified doctor/radiologist for definitive interpretation.',
        tabImage: 'Disease Image Scanner',
        tabXray: 'X-ray Scanner',
        tabLab: 'Lab Report Analyzer',
        imageTitle: 'Disease Image Scanner',
        imageDesc: 'Upload a photo of a visible symptom (like a skin rash) for a preliminary analysis by the Health Assistant AI.',
        uploadLabel: 'Upload Image',
        openCamera: 'Open Camera',
        analyzeImage: 'Analyze Image',
        analyzing: 'Analyzing...',
        clear: 'Clear',
        analysisFailed: 'Analysis Failed',
        diseaseQuery: 'Analyze this image of a health concern.',
        xrayTitle: 'X-ray / Radiology Scanner',
        xrayDesc: 'Upload chest/limb X-ray for analysis by an AI model. This tool is specialized for radiology images.',
        uploadXray: 'Upload X-Ray Image',
        analyzeXray: 'Analyze X-ray',
        takePicture: 'Take Picture',
        xrayStatusAnalyzing: 'AI is analyzing the X-ray...',
        findings: 'Findings',
        impression: 'Impression',
        recommendation: 'Recommendation',
        consultDoctor: 'Consult a qualified doctor for confirmation.',
        labTitle: 'Lab Report Analyzer',
        labDesc: 'Get a quick interpretation of common lab test values. Upload an image or enter values manually.',
        labAnalyzeBtn: 'Analyze Labs',
        labSaveBtn: 'Save Report',
        labSaving: 'Saving...',
        labSaved: 'Saved ✓',
        labFailed: 'Save failed.',
        labNoAuth: 'Please sign in to save the report.',
        labNoReport: 'Please analyze the lab values first.',
        interpretation: 'Interpretation',
        fbs: 'Fasting Glucose (mg/dL)',
        hba1c: 'HbA1c (%)',
        chol: 'Total Cholesterol (mg/dL)',
        ldl: 'LDL (mg/dL)',
        hdl: 'HDL (mg/dL)',
        tg: 'Triglycerides (mg/dL)',
        uploadReport: 'Upload Lab Report Image',
        analyzeReportImage: 'Analyze Report Image',
        downloadPdf: 'Download PDF'
    },
    hi: {
        title: 'रोग स्कैनर',
        description: 'छवियों और लैब रिपोर्ट के लिए एआई-संचालित विश्लेषण।',
        disclaimerTitle: 'अस्वीकरण',
        disclaimerText: 'यह विश्लेषण केवल जानकारी के लिए है और यह चिकित्सा निदान नहीं है। निश्चित व्याख्या के लिए हमेशा एक योग्य डॉक्टर/रेडियोलॉजिस्ट से परामर्श करें।',
        tabImage: 'रोग छवि स्कैनर',
        tabXray: 'एक्स-रे स्कैनर',
        tabLab: 'लैब रिपोर्ट विश्लेषक',
        imageTitle: 'रोग छवि स्कैनर',
        imageDesc: 'स्वास्थ्य सहायक एआई द्वारा प्रारंभिक विश्लेषण के लिए एक दृश्य लक्षण (जैसे त्वचा पर लाल चकत्ते) की एक तस्वीर अपलोड करें।',
        uploadLabel: 'छवि अपलोड करें',
        openCamera: 'कैमरा खोलें',
        analyzeImage: 'छवि का विश्लेषण करें',
        analyzing: 'विश्लेषण हो रहा है...',
        clear: 'साफ़ करें',
        analysisFailed: 'विश्लेषण विफल',
        diseaseQuery: 'स्वास्थ्य संबंधी चिंता की इस छवि का विश्लेषण करें।',
        xrayTitle: 'एक्स-रे / रेडियोलॉजी स्कैनर',
        xrayDesc: 'एक एआई मॉडल द्वारा विश्लेषण के लिए छाती/अंग एक्स-रे अपलोड करें। यह उपकरण रेडियोलॉजी छवियों के लिए विशिष्ट है।',
        uploadXray: 'एक्स-रे छवि अपलोड करें',
        analyzeXray: 'एक्स-रे का विश्लेषण करें',
        takePicture: 'तस्वीर लो',
        xrayStatusAnalyzing: 'एआई एक्स-रे का विश्लेषण कर रहा है...',
        findings: 'निष्कर्ष',
        impression: 'प्रभाव',
        recommendation: 'सिफारिश',
        consultDoctor: 'पुष्टि के लिए एक योग्य चिकित्सक से परामर्श करें।',
        labTitle: 'लैब रिपोर्ट विश्लेषक',
        labDesc: 'सामान्य लैब परीक्षण मूल्यों की त्वरित व्याख्या प्राप्त करें। एक छवि अपलोड करें या मान मैन्युअल रूप से दर्ज करें।',
        labAnalyzeBtn: 'लैब का विश्लेषण करें',
        labSaveBtn: 'रिपोर्ट सहेजें',
        labSaving: 'सहेज रहा है...',
        labSaved: 'सहेजा गया ✓',
        labFailed: 'सहेजने में विफल।',
        labNoAuth: 'रिपोर्ट सहेजने के लिए कृपया साइन इन करें।',
        labNoReport: 'कृपया पहले लैब मानों का विश्लेषण करें।',
        interpretation: 'व्याख्या',
        fbs: 'उपवास ग्लूकोज (mg/dL)',
        hba1c: 'एचबीए1सी (%)',
        chol: 'कुल कोलेस्ट्रॉल (mg/dL)',
        ldl: 'एलडीएल (mg/dL)',
        hdl: 'एचडीएल (mg/dL)',
        tg: 'ट्राइग्लिसराइड्स (mg/dL)',
        uploadReport: 'लैब रिपोर्ट की छवि अपलोड करें',
        analyzeReportImage: 'रिपोर्ट छवि का विश्लेषण करें',
        downloadPdf: 'पीडीएफ डाउनलोड करें'
    }
};

function escapeHtml(s: string | undefined | null){ return String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[String(c)] as string)); }

// Column 1: Disease Image Scanner
function DiseaseImageScanner({ lang, t }: { lang: 'en' | 'hi', t: typeof labels.en}) {
    const [state, formAction, isAnalyzing] = useActionState(healthAssistantAction, initialDiseaseState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
    }, []);

    const openCamera = useCallback(async (mode: 'user' | 'environment') => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            toast({ variant: 'destructive', title: "Camera Not Supported" });
            return;
        }
        stopStream();
        setIsCameraOpen(true);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode } });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
        } catch (err) {
           toast({ variant: 'destructive', title: 'Camera Error', description: 'Could not access camera. Please check permissions.' });
           setIsCameraOpen(false);
        }
    }, [toast, stopStream]);

    useEffect(() => {
        return () => {
            stopStream();
        }
    }, [stopStream]);


    const closeCamera = useCallback(() => {
        setIsCameraOpen(false);
        stopStream();
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
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setPreview(dataUrl);
            closeCamera();
          }
        }
    }, [closeCamera]);

    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
                closeCamera();
            }
            reader.readAsDataURL(file);
        }
    };
    
    const handleClear = () => {
        setPreview(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
        formRef.current?.reset();
        closeCamera();
    };

    const handleFormAction = (formData: FormData) => {
        if (preview) {
            formData.set('photoDataUri', preview);
            formData.set('query', t.diseaseQuery);
            formData.set('language', lang);
            formAction(formData);
        }
    }

    return (
        <Card>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon/>{t.imageTitle}</CardTitle>
                <CardDescription>{t.imageDesc}</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={handleFormAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="disease-file-input">{t.uploadLabel}</Label>
                        <Input id="disease-file-input" type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                    </div>
                     <div className="flex gap-2 mt-2">
                        <Button type="button" variant="secondary" onClick={() => openCamera(facingMode)}><Camera className="mr-2"/>{t.openCamera}</Button>
                        <Button type="submit" disabled={!preview || isAnalyzing}>
                            {isAnalyzing ? (<><Sparkles className="mr-2 h-4 w-4 animate-pulse" /> {t.analyzing}</>) : t.analyzeImage}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleClear}>{t.clear}</Button>
                    </div>

                    {isCameraOpen && (
                        <div className="relative mt-2">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md border aspect-video object-cover bg-black" />
                            <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
                                <Button type="button" onClick={takePicture}>{t.takePicture}</Button>
                                <Button type="button" variant="outline" size="icon" onClick={() => setFacingMode(p => p === 'user' ? 'environment' : 'user')}>
                                    <SwitchCamera />
                                </Button>
                                <Button type="button" variant="destructive" onClick={closeCamera}><CameraOff /></Button>
                            </div>
                        </div>
                    )}
                    
                    {preview && !isCameraOpen && (
                        <div className="relative mt-2">
                            <Image src={preview} alt="Disease preview" width={300} height={300} className="rounded-md border aspect-square object-cover w-full" />
                        </div>
                    )}
                </form>
            </CardContent>
             <CardFooter className="flex-col items-start gap-2">
                {isAnalyzing && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span>{t.analyzing}</span>
                    </div>
                )}
                {state.response && (
                    <div className="resultBox prose prose-sm dark:prose-invert max-w-full">
                        <ReactMarkdown>{state.response}</ReactMarkdown>
                    </div>
                )}
                 {state.error && (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>{t.analysisFailed}</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}
            </CardFooter>
        </Card>
    );
}


// Column 2: X-Ray Scanner
function XRayScanner({t}: {t: typeof labels.en}) {
  const [state, formAction, isAnalyzing] = useActionState(analyzeXrayAction, initialXrayState);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
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
    setSelectedFile(null);
    if(fileInputRef.current) fileInputRef.current.value = '';

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
    } catch (err) {
       toast({ variant: 'destructive', title: 'Camera Error', description: 'Could not access camera. Please check permissions.' });
       setIsCameraOpen(false);
    }
  }, [toast, stopStream, facingMode]);

  useEffect(() => {
    return () => {
        stopStream();
    }
  }, [stopStream]);


  const closeCamera = useCallback(() => {
    setIsCameraOpen(false);
    stopStream();
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
            setSelectedFile(file);
            setPreview(dataUrl);
            closeCamera();
          });
      }
    }
  }, [closeCamera]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
            setSelectedFile(file);
            closeCamera();
        }
        reader.readAsDataURL(file);
    }
  };
  
  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    formRef.current?.reset();
    closeCamera();
  };
  
  const handleFormAction = async (formData: FormData) => {
    if (preview && selectedFile) {
        formData.append('photoDataUri', preview);
        formData.append('contentType', selectedFile.type);
        formAction(formData);
    } else {
        toast({ variant: 'destructive', title: t.analysisFailed, description: t.uploadLabel });
        return;
    }
  };
  
   useEffect(() => {
    if(state.result && user && firestore) {
      try {
        const doc = {
          createdAt: serverTimestamp(),
          report: state.result.report || {},
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
        <CardTitle className="flex items-center gap-2"><Hospital />{t.xrayTitle}</CardTitle>
        <CardDescription>{t.xrayDesc}</CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleFormAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="xray-file-input">{t.uploadXray}</Label>
            <Input id="xray-file-input" type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*"/>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => openCamera()}><Camera className="mr-2"/>{t.openCamera}</Button>
            <Button type="submit" disabled={isAnalyzing || !selectedFile}>
              {isAnalyzing ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Scan className="mr-2"/>{t.analyzeXray}
                </>
              )}
            </Button>
             <Button type="button" variant="outline" onClick={handleClear}>{t.clear}</Button>
          </div>
            {isCameraOpen && (
              <div className="relative mt-2">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md border aspect-video object-cover bg-black" />
                <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
                    <Button type="button" onClick={takePicture}>{t.takePicture}</Button>
                    <Button type="button" variant="outline" size="icon" onClick={() => setFacingMode(p => p === 'user' ? 'environment' : 'user')}>
                        <SwitchCamera />
                    </Button>
                    <Button type="button" variant="destructive" onClick={closeCamera}><CameraOff /></Button>
                </div>
              </div>
            )}
          
          {preview && !isCameraOpen && (
              <div className="relative mt-2">
                <Image src={preview} alt="X-ray preview" width={400} height={400} className="rounded-md border aspect-square object-cover w-full" />
              </div>
          )}
        </form>
      </CardContent>
       <CardFooter className="flex-col items-start gap-4">
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>{t.xrayStatusAnalyzing}</span>
            </div>
          )}
          {state.result && !isAnalyzing && (
              <div className="resultBox w-full space-y-4">
                  <div>
                    <h5 className="font-bold text-lg border-b pb-1 mb-2">{t.findings}</h5>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      {(state.result.report?.findings || []).map((f: any, i: number) => (
                        <li key={i}>
                            <b>{escapeHtml(f.label)}</b> — Confidence: {Math.round((f.confidence||0)*100)}%
                            <p className="text-xs text-muted-foreground">{escapeHtml(f.notes)}</p>
                        </li>
                      ))}
                      {state.result.report?.findings.length === 0 && (
                        <p className="text-sm text-muted-foreground">No specific abnormalities identified.</p>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-lg border-b pb-1 mb-2">{t.impression}</h5>
                    <p className="text-sm">{escapeHtml(state.result.report?.impression)}</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-lg border-b pb-1 mb-2">{t.recommendation}</h5>
                    <p className="text-sm">{escapeHtml(state.result.recommendationText || t.consultDoctor)}</p>
                  </div>
              </div>
          )}
            {state.error && !isAnalyzing && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t.analysisFailed}</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
        </CardFooter>
    </Card>
  );
}

// Column 3: Lab Report Analyzer
function LabReportAnalyzer({lang, t}: {lang: 'en' | 'hi', t: typeof labels.en}) {
    const [imageState, imageFormAction, isImageAnalyzing] = useActionState(analyzeLabReportImageAction, initialLabReportState);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const imageFileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const { user } = useUser();

    const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleImageFormAction = (formData: FormData) => {
        if (imagePreview) {
            formData.set('imageDataUri', imagePreview);
            formData.set('language', lang);
            imageFormAction(formData);
        }
    };
    
    const downloadPdf = (report: any) => {
        if (!report) {
          toast({ variant: "destructive", title: "No Report", description: "Please analyze a report first." });
          return;
        }

        const doc = new jsPDF();
        const patientName = report.patientDetails?.name || user?.displayName || 'N/A';
        
        doc.setFontSize(18);
        doc.text("Lab Report Analysis", 105, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Patient: ${patientName}`, 20, 40);
        doc.text(`Date of Report: ${report.patientDetails?.date || 'N/A'}`, 130, 40);
        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);

        doc.setFontSize(14);
        doc.text("Summary", 20, 60);
        doc.setFontSize(11);
        const summaryLines = doc.splitTextToSize(report.summary, 170);
        doc.text(summaryLines, 20, 68);

        let finalY = (doc as any).lastAutoTable.finalY || 80;
        if (summaryLines.length > 3) finalY += (summaryLines.length - 3) * 5;

        (doc as any).autoTable({
            startY: finalY + 10,
            head: [['Test', 'Value', 'Standard Range', 'Interpretation']],
            body: report.interpretations.map((i: any) => [i.test, i.value, i.range || 'N/A', i.note]),
            headStyles: { fillColor: [76, 129, 190] }
        });
        
        finalY = (doc as any).lastAutoTable.finalY;
        doc.setFontSize(14);
        doc.text("Recommendations", 20, finalY + 15);
        doc.setFontSize(11);
        const recLines = doc.splitTextToSize(report.recommendation, 170);
        doc.text(recLines, 20, finalY + 23);

        finalY += 23 + (recLines.length * 5);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text("Disclaimer: This is an AI-generated analysis for educational purposes. Consult a doctor.", 105, finalY + 15, { align: 'center' });


        doc.save(`Lab-Report-Analysis-${patientName}.pdf`);
        toast({ title: "PDF Downloaded", description: "Your lab report analysis has been saved as a PDF." });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText />{t.labTitle}</CardTitle>
                <CardDescription>Upload an image of your lab report for a detailed AI-powered analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form action={handleImageFormAction} className="space-y-4 p-4 border rounded-lg bg-secondary/50">
                    <div className="space-y-2">
                        <Label htmlFor="lab-report-image">{t.uploadReport}</Label>
                        <Input id="lab-report-image" type="file" ref={imageFileInputRef} onChange={handleImageFileChange} accept="image/*" />
                    </div>
                    {imagePreview && (
                        <div className="relative">
                            <Image src={imagePreview} alt="Lab report preview" width={200} height={200} className="rounded-md border" />
                            <Button variant="ghost" size="icon" className="absolute top-0 right-0" onClick={() => setImagePreview(null)}><X className="h-4 w-4" /></Button>
                        </div>
                    )}
                    <Button type="submit" disabled={!imagePreview || isImageAnalyzing}>
                        {isImageAnalyzing ? (<><Sparkles className="mr-2 h-4 w-4 animate-pulse"/>{t.analyzing}</>) : <><Upload className="mr-2 h-4 w-4"/>{t.analyzeReportImage}</>}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                 {isImageAnalyzing && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span>{t.analyzing}</span>
                    </div>
                 )}

                 {imageState.result && (
                    <div className="resultBox w-full space-y-4">
                        <h4 className="font-bold text-xl">{t.interpretation}</h4>
                        <div>
                            <h5 className="font-semibold text-lg">Overall Summary</h5>
                            <p className="text-sm">{imageState.result.summary}</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="p-2">Test</th>
                                        <th className="p-2">Value</th>
                                        <th className="p-2">Standard Range</th>
                                        <th className="p-2">Interpretation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {imageState.result.interpretations.map((item: any, idx: number) => (
                                        <tr key={idx} className="border-b">
                                            <td className="p-2 font-medium">{item.test}</td>
                                            <td className="p-2">{item.value}</td>
                                            <td className="p-2">{item.range || 'N/A'}</td>
                                            <td className="p-2">{item.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                         <div>
                            <h5 className="font-semibold text-lg">Recommendations</h5>
                            <p className="text-sm whitespace-pre-wrap">{imageState.result.recommendation}</p>
                        </div>
                        <Button onClick={() => downloadPdf(imageState.result)}>
                            <Download className="mr-2 h-4 w-4" />
                            {t.downloadPdf}
                        </Button>
                    </div>
                )}
                 {imageState.error && (
                    <Alert variant="destructive">
                         <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>{t.analysisFailed}</AlertTitle>
                        <AlertDescription>{imageState.error}</AlertDescription>
                    </Alert>
                )}
            </CardFooter>
        </Card>
    );
}

export default function DiseaseScannerPage() {
    const [lang, setLang] = useState<'en' | 'hi'>('en');
    const t = labels[lang];
    
     useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/jspdf-autotable@3.8.2/dist/jspdf.plugin.autotable.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
          document.body.removeChild(script);
        }
      }, []);

    return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">{t.title}</h1>
                <p className="text-muted-foreground">{t.description}</p>
            </div>
            <div className="flex items-center gap-2">
                <Label htmlFor="lang-select">Language</Label>
                <Select value={lang} onValueChange={(v) => setLang(v as 'en' | 'hi')}>
                    <SelectTrigger id="lang-select" className="w-[120px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t.disclaimerTitle}</AlertTitle>
          <AlertDescription>
            {t.disclaimerText}
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="image-scanner">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="image-scanner">{t.tabImage}</TabsTrigger>
                <TabsTrigger value="xray-scanner">{t.tabXray}</TabsTrigger>
                <TabsTrigger value="lab-scanner">{t.tabLab}</TabsTrigger>
            </TabsList>
            <TabsContent value="image-scanner" className="mt-6">
                <DiseaseImageScanner lang={lang} t={t} />
            </TabsContent>
            <TabsContent value="xray-scanner" className="mt-6">
                <XRayScanner t={t} />
            </TabsContent>
            <TabsContent value="lab-scanner" className="mt-6">
                <LabReportAnalyzer lang={lang} t={t} />
            </TabsContent>
        </Tabs>
    </div>
  );
}

    