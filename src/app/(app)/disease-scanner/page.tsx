
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
import { 
  Scan, 
  Loader2, 
  X, 
  Camera, 
  CameraOff, 
  AlertTriangle, 
  Hospital, 
  FileText, 
  Image as ImageIcon, 
  SwitchCamera, 
  Upload, 
  Download, 
  Bot, 
  FileHeart, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Search,
  Bell,
  User as UserIcon,
  Bandage,
  Bone,
  SearchCode
} from 'lucide-react';
import { analyzeXrayAction, analyzeSkinImageAction, analyzeLabReportImageAction, analyzeInjuryAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import ReactMarkdown from 'react-markdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useUserProfile } from '@/context/user-profile-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const initialXrayState = { result: null, error: null };
const initialSkinState = { result: null, error: null };
const initialLabReportState = { result: null, error: null };
const initialInjuryState = { result: null, error: null };

type ScannerView = 'home' | 'skin' | 'injury' | 'xray' | 'lab';

export default function DiseaseScannerPage() {
    const [view, setView] = useState<ScannerView>('home');
    const { userName, userImage } = useUserProfile();
    const [lang, setLang] = useState<'en' | 'hi'>('en');
    
    const t = {
        en: {
            greeting: `Hi ${userName.split(' ')[0]} 👋`,
            subGreeting: "Scan & Check Your Health",
            statsTitle: "Quick Health Stats",
            lastScan: "Last Scan",
            reports: "Reports",
            healthScore: "Health Score",
            skinTitle: "Skin Scanner",
            injuryTitle: "Injury Scanner",
            xrayTitle: "X-ray Scanner",
            reportTitle: "Report Analyse",
            startBtn: "Start Scan",
            aiAssistant: "AI Health Assistant 🤖",
            aiDesc: "Ask symptoms & get suggestions",
            back: "Back to Home",
            analyzing: "Analyzing...",
            analysisFailed: "Analysis Failed"
        },
        hi: {
            greeting: `नमस्ते ${userName.split(' ')[0]} 👋`,
            subGreeting: "स्कैन करें और अपना स्वास्थ्य जांचें",
            statsTitle: "त्वरित स्वास्थ्य आँकड़े",
            lastScan: "पिछला स्कैन",
            reports: "रिपोर्ट",
            healthScore: "हेल्थ स्कोर",
            skinTitle: "स्किन स्कैनर",
            injuryTitle: "इंजरी स्कैनर",
            xrayTitle: "एक्स-रे स्कैनर",
            reportTitle: "रिपोर्ट विश्लेषण",
            startBtn: "स्कैन शुरू करें",
            aiAssistant: "एआई स्वास्थ्य सहायक 🤖",
            aiDesc: "लक्षण पूछें और सुझाव प्राप्त करें",
            back: "होम पर वापस जाएं",
            analyzing: "विश्लेषण हो रहा है...",
            analysisFailed: "विश्लेषण विफल"
        }
    }[lang];

    const renderContent = () => {
        switch (view) {
            case 'skin': return <SkinFaceScanner lang={lang} onBack={() => setView('home')} />;
            case 'injury': return <InjuryScanner lang={lang} onBack={() => setView('home')} />;
            case 'xray': return <XRayScanner lang={lang} onBack={() => setView('home')} />;
            case 'lab': return <LabReportAnalyzer lang={lang} onBack={() => setView('home')} />;
            default: return (
                <div className="space-y-6">
                    {/* Header with Notification & Profile */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold tracking-tight font-headline">{t.greeting}</h1>
                            <p className="text-muted-foreground">{t.subGreeting}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white/50 backdrop-blur-md">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage src={userImage} />
                                <AvatarFallback><UserIcon /></AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Quick Health Stats Card */}
                    <Card className="bg-white/40 backdrop-blur-xl border-white/40 shadow-sm overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                {t.statsTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">{t.lastScan}:</p>
                                <p className="text-sm font-bold">2 days ago</p>
                            </div>
                            <div className="space-y-1 border-x px-4 border-white/20">
                                <p className="text-xs text-muted-foreground">{t.reports}:</p>
                                <p className="text-sm font-bold">5</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-xs text-muted-foreground">{t.healthScore}:</p>
                                <div className="flex items-center justify-end gap-1">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                    <p className="text-sm font-bold text-green-600">Good</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scanner Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <ScannerCard 
                            title={t.skinTitle} 
                            icon={<SearchCode className="w-12 h-12 text-pink-400" />} 
                            gradient="bg-gradient-to-br from-pink-50/80 to-pink-100/80 border-pink-200/50"
                            btnBg="bg-pink-200/50 hover:bg-pink-300/50"
                            onClick={() => setView('skin')}
                            btnText={t.startBtn}
                        />
                        <ScannerCard 
                            title={t.injuryTitle} 
                            icon={<Bandage className="w-12 h-12 text-orange-400" />} 
                            gradient="bg-gradient-to-br from-orange-50/80 to-orange-100/80 border-orange-200/50"
                            btnBg="bg-orange-200/50 hover:bg-orange-300/50"
                            onClick={() => setView('injury')}
                            btnText={t.startBtn}
                        />
                        <ScannerCard 
                            title={t.xrayTitle} 
                            icon={<Bone className="w-12 h-12 text-blue-400" />} 
                            gradient="bg-gradient-to-br from-blue-50/80 to-blue-100/80 border-blue-200/50"
                            btnBg="bg-blue-200/50 hover:bg-blue-300/50"
                            onClick={() => setView('xray')}
                            btnText={t.startBtn}
                        />
                        <ScannerCard 
                            title={t.reportTitle} 
                            icon={<FileText className="w-12 h-12 text-green-400" />} 
                            gradient="bg-gradient-to-br from-green-50/80 to-green-100/80 border-green-200/50"
                            btnBg="bg-green-200/50 hover:bg-green-300/50"
                            onClick={() => setView('lab')}
                            btnText={t.startBtn}
                        />
                    </div>

                    {/* AI Assistant Banner */}
                    <Card className="bg-[#1A1A1A] text-white overflow-hidden border-none relative group cursor-pointer hover:shadow-lg transition-all" onClick={() => (window as any).openAssistant?.()}>
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-600 shadow-inner">
                                <Bot className="h-7 w-7 text-primary" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    {t.aiAssistant}
                                </h3>
                                <p className="text-xs text-gray-400">{t.aiDesc}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
                        </CardContent>
                        {/* Subtle glow effect */}
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                    </Card>

                    {/* Language Selection */}
                    <div className="flex justify-center pt-4">
                        <Select value={lang} onValueChange={(v) => setLang(v as 'en' | 'hi')}>
                            <SelectTrigger className="w-[140px] bg-white/50 backdrop-blur-md rounded-full border-white/40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="hi">हिन्दी</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="min-h-full bg-gradient-to-b from-[#F0F7FF] to-[#E6EFFF] dark:from-slate-950 dark:to-slate-900 pb-10">
            <div className="max-w-xl mx-auto px-4 pt-6 space-y-6">
                {renderContent()}
            </div>
        </div>
    );
}

// Helper Components
function ScannerCard({ title, icon, gradient, btnBg, onClick, btnText }: { title: string, icon: React.ReactNode, gradient: string, btnBg: string, onClick: () => void, btnText: string }) {
    return (
        <Card className={cn("border-2 border-transparent transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm", gradient)}>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-3 bg-white/60 rounded-2xl shadow-sm backdrop-blur-md">
                    {icon}
                </div>
                <h3 className="font-bold text-sm text-gray-800">{title}</h3>
                <Button 
                    onClick={onClick} 
                    className={cn("w-full rounded-full text-xs font-bold text-gray-700 h-8 shadow-sm border border-white/40", btnBg)}
                    variant="ghost"
                >
                    {btnText}
                </Button>
            </CardContent>
        </Card>
    );
}

// --- Specific Scanners (Refactored to match new UI) ---

function SkinFaceScanner({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeSkinImageAction, initialSkinState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const handleFormAction = (formData: FormData) => {
        if (preview) {
            formData.set('imageDataUri', preview);
            formAction(formData);
        }
    }

    const takePicture = () => {
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
            setIsCameraOpen(false);
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
          }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack} className="rounded-full bg-white/50 backdrop-blur-md">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-bold font-headline">Skin & Face Scanner</h2>
            </div>

            <Card className="bg-white/60 backdrop-blur-xl border-white/40">
                <CardHeader>
                    <CardTitle className="text-lg">Face Analysis</CardTitle>
                    <CardDescription>Upload or take a photo of your face for common skin concerns.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    {!isCameraOpen && !preview && (
                        <div className="border-2 border-dashed border-pink-200 rounded-3xl h-64 flex flex-col items-center justify-center bg-pink-50/30 space-y-4">
                            <div className="p-4 bg-white rounded-full shadow-sm text-pink-400">
                                <ImageIcon className="w-10 h-10" />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-full">
                                    <Upload className="mr-2 h-4 w-4" /> Upload
                                </Button>
                                <Button onClick={async () => {
                                    try {
                                        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                                        setIsCameraOpen(true);
                                        if (videoRef.current) videoRef.current.srcObject = stream;
                                        streamRef.current = stream;
                                    } catch (e) {
                                        toast({ variant: 'destructive', title: "Camera Error", description: "Could not access camera." });
                                    }
                                }} className="rounded-full bg-pink-400 hover:bg-pink-500">
                                    <Camera className="mr-2 h-4 w-4" /> Camera
                                </Button>
                            </div>
                            <input type="file" ref={fileInputRef} hidden onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (re) => setPreview(reader.result as string);
                                    reader.readAsDataURL(file);
                                }
                            }} accept="image/*" />
                        </div>
                    )}

                    {isCameraOpen && (
                        <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-square bg-black">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                                <Button onClick={takePicture} size="lg" className="rounded-full h-16 w-16 p-0 bg-white hover:bg-white/90 text-pink-500 border-4 border-pink-200">
                                    <div className="h-12 w-12 rounded-full border-2 border-pink-500"></div>
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => {
                                    setIsCameraOpen(false);
                                    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
                                }} className="rounded-full">
                                    <X />
                                </Button>
                            </div>
                        </div>
                    )}

                    {preview && (
                        <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                            <Image src={preview} alt="Preview" width={500} height={500} className="w-full h-auto" />
                            <Button variant="destructive" size="icon" className="absolute top-4 right-4 rounded-full" onClick={() => setPreview(null)}>
                                <X />
                            </Button>
                        </div>
                    )}

                    <form action={handleFormAction} className="space-y-4">
                        <Textarea name="userQuery" placeholder="Optional: Describe your concern..." className="rounded-2xl bg-white/50 border-white/40" />
                        <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-full bg-pink-400 hover:bg-pink-500 h-12 text-lg font-bold">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Analyzing...</> : "Analyze My Skin"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                    {state.result && (
                        <div className="w-full space-y-4 animate-in slide-in-from-top-4">
                            <Alert className="rounded-2xl bg-white/80 border-pink-200">
                                <Sparkles className="h-4 w-4 text-pink-400" />
                                <AlertTitle>AI Assessment</AlertTitle>
                                <AlertDescription>{state.result.overallAssessment}</AlertDescription>
                            </Alert>
                            <div className="grid gap-3">
                                {state.result.identifiedConditions?.map((c: any, i: number) => (
                                    <div key={i} className="p-4 rounded-2xl bg-white/50 border border-white/40">
                                        <p className="font-bold">{c.name}</p>
                                        <Progress value={c.confidence * 100} className="h-1.5 my-2" />
                                        <p className="text-xs text-muted-foreground">{c.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

function InjuryScanner({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeInjuryAction, initialInjuryState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack} className="rounded-full bg-white/50 backdrop-blur-md">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-bold font-headline">Injury Scanner</h2>
            </div>

            <Card className="bg-white/60 backdrop-blur-xl border-white/40">
                <CardHeader>
                    <CardTitle className="text-lg">Describe or Photo</CardTitle>
                    <CardDescription>Tell us about the injury or upload a photo for guidance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form action={(formData) => {
                        if (preview) formData.set('photoDataUri', preview);
                        formAction(formData);
                    }} className="space-y-4">
                        <Textarea name="query" placeholder="e.g., I cut my finger while chopping vegetables..." rows={4} className="rounded-2xl bg-white/50 border-white/40" required />
                        
                        {!preview ? (
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full rounded-full border-orange-200 text-orange-600 bg-orange-50/30">
                                <ImageIcon className="mr-2 h-4 w-4" /> Add Photo (Optional)
                            </Button>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden border-2 border-orange-200">
                                <Image src={preview} alt="Injury" width={400} height={400} className="w-full h-auto" />
                                <Button size="icon" variant="destructive" className="absolute top-2 right-2 rounded-full h-8 w-8" onClick={() => setPreview(null)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <input type="file" ref={fileInputRef} hidden onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = () => setPreview(reader.result as string);
                                reader.readAsDataURL(file);
                            }
                        }} accept="image/*" />

                        <Button type="submit" disabled={isAnalyzing} className="w-full rounded-full bg-orange-400 hover:bg-orange-500 h-12 text-lg font-bold">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Analyzing...</> : "Analyze Injury"}
                        </Button>
                    </form>
                </CardContent>
                {state.result && (
                    <CardFooter className="flex-col items-start gap-4">
                        <div className="prose prose-sm dark:prose-invert max-w-full p-4 rounded-2xl bg-white/80 border border-orange-200">
                            <ReactMarkdown>{state.result.response}</ReactMarkdown>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}

function XRayScanner({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeXrayAction, initialXrayState);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack} className="rounded-full bg-white/50 backdrop-blur-md">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-bold font-headline">Radiology Scanner</h2>
            </div>

            <Card className="bg-white/60 backdrop-blur-xl border-white/40">
                <CardHeader>
                    <CardTitle className="text-lg">X-ray Analysis</CardTitle>
                    <CardDescription>Upload a clear image of an X-ray for AI interpretation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!preview ? (
                        <div className="border-2 border-dashed border-blue-200 rounded-3xl h-64 flex flex-col items-center justify-center bg-blue-50/30 space-y-4 cursor-pointer hover:bg-blue-50/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-4 bg-white rounded-full shadow-sm text-blue-400">
                                <Bone className="w-10 h-10" />
                            </div>
                            <p className="text-sm font-semibold text-blue-600">Click to Upload X-ray</p>
                        </div>
                    ) : (
                        <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                            <Image src={preview} alt="X-ray" width={500} height={500} className="w-full h-auto" />
                            <Button variant="destructive" size="icon" className="absolute top-4 right-4 rounded-full" onClick={() => setPreview(null)}>
                                <X />
                            </Button>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} hidden onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setFileType(file.type);
                            const reader = new FileReader();
                            reader.onload = () => setPreview(reader.result as string);
                            reader.readAsDataURL(file);
                        }
                    }} accept="image/*" />

                    <form action={(formData) => {
                        if (preview) {
                            formData.set('photoDataUri', preview);
                            formData.set('contentType', fileType);
                            formAction(formData);
                        }
                    }}>
                        <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-full bg-blue-400 hover:bg-blue-500 h-12 text-lg font-bold">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Scanning X-ray...</> : "Scan X-ray"}
                        </Button>
                    </form>
                </CardContent>
                {state.result && (
                    <CardFooter className="flex-col items-start gap-4">
                        <div className="w-full space-y-4 bg-white/80 p-5 rounded-2xl border border-blue-200 animate-in zoom-in-95">
                            <h4 className="font-bold text-lg border-b pb-2">Findings</h4>
                            <ul className="space-y-3">
                                {state.result.result.report?.findings.map((f: any, i: number) => (
                                    <li key={i} className="text-sm">
                                        <p className="font-bold text-blue-700">{f.label}</p>
                                        <p className="text-xs text-muted-foreground">{f.notes}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-2">
                                <p className="font-bold text-sm">Impression:</p>
                                <p className="text-sm italic text-muted-foreground">"{state.result.result.report?.impression}"</p>
                            </div>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}

function LabReportAnalyzer({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeLabReportImageAction, initialLabReportState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const downloadPdf = (report: any) => {
        const doc = new jsPDF();
        const patientName = report.patientDetails?.name || 'Guest';
        doc.setFontSize(18);
        doc.text("Lab Report Analysis", 105, 20, { align: 'center' });
        (doc as any).autoTable({
            startY: 40,
            head: [['Test', 'Value', 'Range', 'Status']],
            body: report.interpretations.map((i: any) => [i.test, i.value, i.range || 'N/A', i.status]),
        });
        doc.save(`Analysis-${patientName}.pdf`);
        toast({ title: "PDF Downloaded" });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack} className="rounded-full bg-white/50 backdrop-blur-md">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-bold font-headline">Lab Report Analyzer</h2>
            </div>

            <Card className="bg-white/60 backdrop-blur-xl border-white/40">
                <CardHeader>
                    <CardTitle className="text-lg">Report Analysis</CardTitle>
                    <CardDescription>Upload an image of your physical lab report for a summary.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!preview ? (
                        <div className="border-2 border-dashed border-green-200 rounded-3xl h-64 flex flex-col items-center justify-center bg-green-50/30 space-y-4 cursor-pointer hover:bg-green-50/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-4 bg-white rounded-full shadow-sm text-green-400">
                                <FileText className="w-10 h-10" />
                            </div>
                            <p className="text-sm font-semibold text-green-600">Click to Upload Report</p>
                        </div>
                    ) : (
                        <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white">
                            <Image src={preview} alt="Report" width={500} height={500} className="w-full h-auto" />
                            <Button variant="destructive" size="icon" className="absolute top-4 right-4 rounded-full" onClick={() => setPreview(null)}>
                                <X />
                            </Button>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} hidden onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = () => setPreview(reader.result as string);
                            reader.readAsDataURL(file);
                        }
                    }} accept="image/*" />

                    <form action={(formData) => {
                        if (preview) {
                            formData.set('imageDataUri', preview);
                            formData.set('language', lang);
                            formAction(formData);
                        }
                    }}>
                        <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-full bg-green-400 hover:bg-green-500 h-12 text-lg font-bold">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Analyzing Report...</> : "Analyze Report"}
                        </Button>
                    </form>
                </CardContent>
                {state.result && (
                    <CardFooter className="flex-col items-start gap-4">
                        <div className="w-full space-y-4 bg-white/80 p-5 rounded-2xl border border-green-200 animate-in zoom-in-95">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold text-lg">Results</h4>
                                <Button size="sm" onClick={() => downloadPdf(state.result.result)} className="rounded-full bg-green-600">
                                    <Download className="h-4 w-4 mr-1" /> PDF
                                </Button>
                            </div>
                            <p className="text-sm font-semibold">{state.result.result.summary}</p>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {state.result.result.interpretations.map((item: any, idx: number) => (
                                    <div key={idx} className="p-3 rounded-xl bg-white/50 border border-green-100 flex justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-green-800">{item.test}</p>
                                            <p className="text-xs text-muted-foreground">{item.note}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">{item.value}</p>
                                            <p className={cn("text-[10px] font-bold uppercase", 
                                                item.status === 'normal' ? 'text-green-500' : 'text-red-500'
                                            )}>{item.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
