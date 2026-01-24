
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
import { Scan, Loader2, X, Camera, CameraOff, AlertTriangle, Hospital, FileText, Image as ImageIcon, SwitchCamera, Upload, Download, CircleDot, Bot, FileHeart } from 'lucide-react';
import { analyzeXrayAction, analyzeSkinImageAction, analyzeLabReportImageAction, analyzeInjuryAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import ReactMarkdown from 'react-markdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";


const initialXrayState = {
  result: null,
  error: null,
};

const initialSkinState = {
    result: null,
    error: null,
}

const initialLabReportState = {
    result: null,
    error: null,
};

const initialInjuryState = {
    result: null,
    error: null,
}

const labels = {
    en: {
        title: 'Disease Scanner',
        description: 'AI-powered analysis for images, symptoms and lab reports.',
        disclaimerTitle: 'Disclaimer',
        disclaimerText: 'The analysis is informative only and not a medical diagnosis. Always consult a qualified doctor for definitive interpretation.',
        tabImage: 'Skin & Face Scanner',
        tabXray: 'X-ray Scanner',
        tabLab: 'Lab Report Analyzer',
        tabInjury: 'Injury & Symptom Scanner',
        imageTitle: 'Skin & Face Scanner',
        imageDesc: 'Upload a clear, well-lit photo of your face to get a preliminary analysis of common skin concerns like acne, dark circles, and more.',
        uploadLabel: 'Upload Face Photo',
        openCamera: 'Open Camera',
        analyzeImage: 'Analyze Skin',
        analyzing: 'Analyzing...',
        clear: 'Clear',
        analysisFailed: 'Analysis Failed',
        skinQueryPlaceholder: 'Optional: Describe your concern (e.g., "red spots on my cheeks").',
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
        downloadPdf: 'Download PDF',
        injuryTitle: 'Injury & Symptom Scanner',
        injuryDesc: 'Describe your injury or symptom and upload a photo for an AI-guided analysis and first-aid recommendations.',
        injuryQueryPlaceholder: 'Describe your injury... e.g., "I cut my finger while chopping vegetables." or "I have a strange rash on my arm."',
        uploadInjuryPhoto: 'Upload Injury Photo (Optional)',
        analyzeInjury: 'Analyze Injury/Symptom'
    },
    hi: {
        title: 'रोग स्कैनर',
        description: 'छवियों, लक्षणों और लैब रिपोर्ट के लिए एआई-संचालित विश्लेषण।',
        disclaimerTitle: 'अस्वीकरण',
        disclaimerText: 'यह विश्लेषण केवल जानकारी के लिए है और यह चिकित्सा निदान नहीं है। निश्चित व्याख्या के लिए हमेशा एक योग्य डॉक्टर से परामर्श करें।',
        tabImage: 'त्वचा और चेहरा स्कैनर',
        tabXray: 'एक्स-रे स्कैनर',
        tabLab: 'लैब रिपोर्ट विश्लेषक',
        tabInjury: 'चोट और लक्षण स्कैनर',
        imageTitle: 'त्वचा और चेहरा स्कैनर',
        imageDesc: 'मुंहासे, काले घेरे आदि जैसी सामान्य त्वचा संबंधी चिंताओं का प्रारंभिक विश्लेषण प्राप्त करने के लिए अपने चेहरे की एक स्पष्ट, अच्छी तरह से रोशनी वाली तस्वीर अपलोड करें।',
        uploadLabel: 'चेहरे की तस्वीर अपलोड करें',
        openCamera: 'कैमरा खोलें',
        analyzeImage: 'त्वचा का विश्लेषण करें',
        analyzing: 'विश्लेषण हो रहा है...',
        clear: 'साफ़ करें',
        analysisFailed: 'विश्लेषण विफल',
        skinQueryPlaceholder: 'वैकल्पिक: अपनी चिंता का वर्णन करें (जैसे, "मेरे गालों पर लाल धब्बे")।',
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
        downloadPdf: 'पीडीएफ डाउनलोड करें',
        injuryTitle: 'चोट और लक्षण स्कैनर',
        injuryDesc: 'एआई-निर्देशित विश्लेषण और प्राथमिक चिकित्सा सिफारिशों के लिए अपनी चोट या लक्षण का वर्णन करें और एक तस्वीर अपलोड करें।',
        injuryQueryPlaceholder: 'अपनी चोट का वर्णन करें... जैसे, "सब्जी काटते समय मेरी उंगली कट गई।" या "मेरे हाथ पर एक अजीब दाने हैं।"',
        uploadInjuryPhoto: 'चोट की तस्वीर अपलोड करें (वैकल्पिक)',
        analyzeInjury: 'चोट/लक्षण का विश्लेषण करें'
    }
};

function escapeHtml(s: string | undefined | null){ return String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[String(c)] as string)); }

// Column 1: Skin & Face Scanner
function SkinFaceScanner({ lang, t }: { lang: 'en' | 'hi', t: typeof labels.en}) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeSkinImageAction, initialSkinState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const { toast } = useToast();

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
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
            formData.set('imageDataUri', preview);
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
                        <Label htmlFor="skin-query">{t.skinQueryPlaceholder}</Label>
                        <Textarea id="skin-query" name="userQuery" placeholder={t.skinQueryPlaceholder} rows={2} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="disease-file-input">{t.uploadLabel}</Label>
                        <Input id="disease-file-input" type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                    </div>
                     <div className="flex flex-wrap gap-2 mt-2">
                        <Button type="button" variant="secondary" onClick={() => openCamera(facingMode)}><Camera className="mr-2"/>{t.openCamera}</Button>
                         <Button type="button" variant="secondary" size="icon" onClick={() => setFacingMode(p => p === 'user' ? 'environment' : 'user')} disabled={!isCameraOpen}>
                            <SwitchCamera />
                        </Button>
                        <Button type="submit" disabled={!preview || isAnalyzing}>
                            {isAnalyzing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.analyzing}</>) : <>{t.analyzeImage}</>}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleClear}>{t.clear}</Button>
                    </div>

                    {isCameraOpen && (
                        <div className="relative mt-2">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md border aspect-video object-cover bg-black" />
                            <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
                                <Button type="button" onClick={takePicture}>{t.takePicture}</Button>
                                <Button type="button" variant="destructive" onClick={closeCamera}><CameraOff /></Button>
                            </div>
                        </div>
                    )}
                    
                    {preview && !isCameraOpen && (
                        <div className="relative mt-2 w-full max-w-sm">
                            <Image src={preview} alt="Skin concern preview" width={300} height={300} className="rounded-md border w-full h-auto object-contain" />
                        </div>
                    )}
                </form>
            </CardContent>
             <CardFooter className="flex-col items-start gap-4">
                {isAnalyzing && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{t.analyzing}</span>
                    </div>
                )}
                {state.result && (
                    <div className="resultBox w-full space-y-4">
                        <Alert>
                            <Bot className="h-4 w-4" />
                            <AlertTitle>AI Assessment</AlertTitle>
                            <AlertDescription>{state.result.overallAssessment}</AlertDescription>
                        </Alert>
                        
                        {state.result.identifiedConditions?.length > 0 && (
                            <div>
                                <h5 className="font-bold text-lg mb-2">Potential Conditions Identified</h5>
                                <div className="space-y-2">
                                    {state.result.identifiedConditions.map((c: any, i: number) => (
                                        <Card key={i} className="p-3">
                                            <p className="font-semibold">{c.name}</p>
                                            <Progress value={c.confidence * 100} className="h-2 my-1" />
                                            <p className="text-xs text-muted-foreground">Confidence: {Math.round(c.confidence * 100)}%</p>
                                            <p className="text-sm mt-1">{c.description}</p>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {state.result.recommendations?.length > 0 && (
                             <div>
                                <h5 className="font-bold text-lg mb-2">General Recommendations</h5>
                                <ul className="list-disc pl-5 space-y-2 text-sm">
                                    {state.result.recommendations.map((r: any, i: number) => (
                                        <li key={i}>
                                            <span className="font-semibold capitalize">{r.type}:</span> {r.suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
              <div className="relative mt-2 w-full max-w-sm">
                <Image src={preview} alt="X-ray preview" width={400} height={400} className="rounded-md border object-contain" />
              </div>
          )}
        </form>
      </CardContent>
       <CardFooter className="flex-col items-start gap-4">
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
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
        const patientName = report.patientDetails?.name || 'Guest';
        
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
                        <div className="relative w-full max-w-sm">
                            <Image src={imagePreview} alt="Lab report preview" width={200} height={200} className="rounded-md border object-contain" />
                            <Button variant="ghost" size="icon" className="absolute top-0 right-0" onClick={() => setImagePreview(null)}><X className="h-4 w-4" /></Button>
                        </div>
                    )}
                    <Button type="submit" disabled={!imagePreview || isImageAnalyzing}>
                        {isImageAnalyzing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/>{t.analyzing}</>) : <><Upload className="mr-2 h-4 w-4"/>{t.analyzeReportImage}</>}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                 {isImageAnalyzing && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
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
                        <div className="overflow-x-auto rounded-lg border">
                           <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Test</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Standard Range</TableHead>
                                        <TableHead>Interpretation</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {imageState.result.interpretations.map((item: any, idx: number) => {
                                        const statusClass = {
                                            high: 'bg-destructive/10 hover:bg-destructive/15',
                                            low: 'bg-destructive/10 hover:bg-destructive/15',
                                            borderline: 'bg-yellow-400/20 hover:bg-yellow-400/25 dark:bg-yellow-600/20 dark:hover:bg-yellow-600/25',
                                            normal: ''
                                        }[item.status] || '';

                                        return (
                                            <TableRow key={idx} className={cn(statusClass)}>
                                                <TableCell className="font-medium">{item.test}</TableCell>
                                                <TableCell>{item.value}</TableCell>
                                                <TableCell>{item.range || 'N/A'}</TableCell>
                                                <TableCell>{item.note}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
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


function InjuryScanner({ lang, t }: { lang: 'en' | 'hi', t: typeof labels.en }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeInjuryAction, initialInjuryState);
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
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(file);
            closeCamera();
        }
    };

    const handleClear = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        formRef.current?.reset();
        closeCamera();
    };

    const handleFormAction = (formData: FormData) => {
        if (preview) {
            formData.set('photoDataUri', preview);
        }
        formData.set('language', lang);
        formAction(formData);
    };

    return (
        <Card>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileHeart />{t.injuryTitle}</CardTitle>
                <CardDescription>{t.injuryDesc}</CardDescription>
            </CardHeader>
            <form ref={formRef} action={handleFormAction}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="injury-query">{t.injuryQueryPlaceholder}</Label>
                        <Textarea id="injury-query" name="query" placeholder={t.injuryQueryPlaceholder} rows={3} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="injury-file-input">{t.uploadInjuryPhoto}</Label>
                        <Input id="injury-file-input" type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                    </div>
                     <div className="flex flex-wrap gap-2 mt-2">
                        <Button type="button" variant="secondary" onClick={() => openCamera(facingMode)}><Camera className="mr-2"/>{t.openCamera}</Button>
                         <Button type="button" variant="secondary" size="icon" onClick={() => setFacingMode(p => p === 'user' ? 'environment' : 'user')} disabled={!isCameraOpen}>
                            <SwitchCamera />
                        </Button>
                    </div>

                    {isCameraOpen && (
                        <div className="relative mt-2">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto rounded-md border aspect-video object-cover bg-black" />
                            <div className="absolute bottom-2 left-2 right-2 flex justify-center gap-2">
                                <Button type="button" onClick={takePicture}>{t.takePicture}</Button>
                                <Button type="button" variant="destructive" onClick={closeCamera}><CameraOff /></Button>
                            </div>
                        </div>
                    )}
                    
                    {preview && !isCameraOpen && (
                        <div className="relative mt-2 w-full max-w-sm">
                            <Image src={preview} alt="Injury preview" width={300} height={300} className="rounded-md border object-contain" />
                            <Button variant="ghost" size="icon" className="absolute top-0 right-0" onClick={() => setPreview(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                    <div className="flex items-center gap-2">
                        <Button type="submit" disabled={isAnalyzing}>
                            {isAnalyzing ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.analyzing}</>
                            ) : (
                                <><Scan className="mr-2" />{t.analyzeInjury}</>
                            )}
                        </Button>
                        <Button type="button" variant="outline" onClick={handleClear}>{t.clear}</Button>
                    </div>

                    {isAnalyzing && (
                        <div className="flex items-center gap-2 text-muted-foreground pt-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>{t.analyzing}</span>
                        </div>
                    )}

                    {state.result && (
                        <div className="resultBox w-full space-y-4 pt-4">
                             <article className="prose prose-sm dark:prose-invert max-w-full"><ReactMarkdown>{state.result.response}</ReactMarkdown></article>
                        </div>
                    )}

                    {state.error && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>{t.analysisFailed}</AlertTitle>
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
}



export default function DiseaseScannerPage() {
    const [lang, setLang] = useState<'en' | 'hi'>('en');
    const t = labels[lang];
    
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
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="image-scanner">{t.tabImage}</TabsTrigger>
                <TabsTrigger value="injury-scanner">{t.tabInjury}</TabsTrigger>
                <TabsTrigger value="xray-scanner">{t.tabXray}</TabsTrigger>
                <TabsTrigger value="lab-scanner">{t.tabLab}</TabsTrigger>
            </TabsList>
            <TabsContent value="image-scanner" className="mt-6">
                <SkinFaceScanner lang={lang} t={t} />
            </TabsContent>
            <TabsContent value="injury-scanner" className="mt-6">
                <InjuryScanner lang={lang} t={t} />
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
