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
  ImageIcon, 
  SwitchCamera, 
  Upload, 
  Download, 
  BrainCircuit, 
  FileHeart, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Search,
  Bell,
  User as UserIcon,
  Bandage,
  Bone,
  SearchCode,
  ShieldPlus,
  Activity
} from 'lucide-react';
import { analyzeXrayAction, analyzeSkinImageAction, analyzeLabReportImageAction, analyzeInjuryAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { jsPDF } from 'jspdf';
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
                            <h1 className="text-3xl font-bold tracking-tight font-headline text-[#2D3A5D] dark:text-slate-100">{t.greeting}</h1>
                            <p className="text-muted-foreground">{t.subGreeting}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white/50 backdrop-blur-md">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm overflow-hidden">
                                <AvatarImage src={userImage} className="object-cover" />
                                <AvatarFallback><UserIcon /></AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Quick Health Stats Card */}
                    <Card className="neumorphic-card overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-wider text-[#2D3A5D]/60 dark:text-slate-400">
                                {t.statsTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.lastScan}:</p>
                                <p className="text-sm font-black text-[#2D3A5D] dark:text-slate-100">2 days ago</p>
                            </div>
                            <div className="space-y-1 border-x px-4 border-white/20">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.reports}:</p>
                                <p className="text-sm font-black text-[#2D3A5D] dark:text-slate-100">5</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{t.healthScore}:</p>
                                <div className="flex items-center justify-end gap-1">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                    <p className="text-sm font-black text-green-600">Good</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scanner Grid */}
                    <div className="grid grid-cols-2 gap-5">
                        <ScannerCard 
                            title={t.skinTitle} 
                            icon={<SearchCode className="w-10 h-10 text-pink-500" />} 
                            gradient="from-[#FFF0F5] to-[#FFE1EB] dark:from-pink-900/40 dark:to-pink-800/40"
                            onClick={() => setView('skin')}
                            btnText={t.startBtn}
                        />
                        <ScannerCard 
                            title={t.injuryTitle} 
                            icon={<Bandage className="w-10 h-10 text-orange-500" />} 
                            gradient="from-[#FFF7ED] to-[#FFEDD5] dark:from-orange-900/40 dark:to-orange-800/40"
                            onClick={() => setView('injury')}
                            btnText={t.startBtn}
                        />
                        <ScannerCard 
                            title={t.xrayTitle} 
                            icon={<Bone className="w-10 h-10 text-blue-500" />} 
                            gradient="from-[#E6F0FF] to-[#D1E4FF] dark:from-blue-900/40 dark:to-blue-800/40"
                            onClick={() => setView('xray')}
                            btnText={t.startBtn}
                        />
                        <ScannerCard 
                            title={t.reportTitle} 
                            icon={<FileText className="w-10 h-10 text-green-500" />} 
                            gradient="from-[#F0FDF4] to-[#DCFCE7] dark:from-green-900/40 dark:to-green-800/40"
                            onClick={() => setView('lab')}
                            btnText={t.startBtn}
                        />
                    </div>

                    {/* Language Selection */}
                    <div className="flex justify-center pt-4 pb-10">
                        <Select value={lang} onValueChange={(v) => setLang(v as 'en' | 'hi')}>
                            <SelectTrigger className="w-[140px] bg-white/50 backdrop-blur-md rounded-full border-white/40 shadow-sm">
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
        <div className="animate-in fade-in duration-500 h-full">
            <div className="max-w-xl mx-auto space-y-6">
                {renderContent()}
            </div>
        </div>
    );
}

function ScannerCard({ title, icon, gradient, onClick, btnText }: { title: string, icon: React.ReactNode, gradient: string, onClick: () => void, btnText: string }) {
    return (
        <Card className="rounded-[2.5rem] neumorphic-card group hover:scale-[1.03] transition-all duration-500 overflow-hidden border-none">
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl transform group-hover:rotate-6 transition-transform duration-500">
                    {icon}
                </div>
                <h3 className="text-sm font-black text-[#2D3A5D] dark:text-slate-100 tracking-tight">{title}</h3>
                <Button 
                    onClick={onClick} 
                    className={cn(
                        "mt-auto w-full py-2.5 rounded-2xl flex items-center justify-between text-[10px] font-black tracking-tight transition-all bg-gradient-to-r shadow-inner text-[#2D3A5D] dark:text-slate-100",
                        gradient
                    )}
                    variant="ghost"
                >
                    {btnText}
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </Button>
            </div>
        </Card>
    );
}

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
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white/40 backdrop-blur-md shadow-sm border border-white/20">
                    <ArrowLeft className="h-5 w-5 text-[#2D3A5D]" />
                </Button>
                <h2 className="text-2xl font-black text-[#2D3A5D] dark:text-slate-100 font-headline tracking-tight">Skin & Face Scanner</h2>
            </div>

            <Card className="rounded-[2.5rem] neumorphic-card border-none">
                <CardHeader>
                    <CardTitle className="text-lg font-black text-[#2D3A5D] dark:text-slate-100">Face Analysis</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload or take a photo of your face for common skin concerns.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    {!isCameraOpen && !preview && (
                        <div className="border-2 border-dashed border-pink-100 dark:border-pink-900/30 rounded-[2rem] h-64 flex flex-col items-center justify-center bg-pink-50/20 space-y-4 space-y-4">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm text-pink-400">
                                <ImageIcon className="w-10 h-10" />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-full font-bold">
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
                                }} className="rounded-full bg-[#FFEDF2] text-pink-600 hover:bg-pink-100 font-bold border-none">
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
                        <div className="relative rounded-[2rem] overflow-hidden shadow-lg aspect-square bg-black">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                                <Button onClick={takePicture} size="lg" className="rounded-full h-16 w-16 p-0 bg-white hover:bg-white/90 text-pink-500 border-4 border-pink-200">
                                    <div className="h-12 w-12 rounded-full border-2 border-pink-500"></div>
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => {
                                    setIsCameraOpen(false);
                                    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
                                }} className="rounded-full shadow-lg">
                                    <X />
                                </Button>
                            </div>
                        </div>
                    )}

                    {preview && (
                        <div className="relative rounded-[2rem] overflow-hidden shadow-md border-4 border-white dark:border-slate-800">
                            <Image src={preview} alt="Preview" width={500} height={500} className="w-full h-auto object-cover" />
                            <Button variant="destructive" size="icon" className="absolute top-4 right-4 rounded-full h-8 w-8" onClick={() => setPreview(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    <form action={handleFormAction} className="space-y-4">
                        <Textarea name="userQuery" placeholder="Optional: Describe your concern..." className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner" />
                        <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 text-white h-12 text-sm font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Analyzing...</> : "Analyze My Skin"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                    {state.result && (
                        <div className="w-full space-y-4 animate-in slide-in-from-top-4">
                            <Alert className="rounded-2xl bg-pink-50/50 dark:bg-pink-900/10 border-pink-100 dark:border-pink-900/30">
                                <Activity className="h-4 w-4 text-pink-500" />
                                <AlertTitle className="font-black text-[#2D3A5D] dark:text-slate-100">AI Assessment</AlertTitle>
                                <AlertDescription className="text-xs font-bold text-slate-500">{state.result.overallAssessment}</AlertDescription>
                            </Alert>
                            <div className="grid gap-3">
                                {state.result.identifiedConditions?.map((c: any, i: number) => (
                                    <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-700/50">
                                        <p className="font-black text-sm text-[#2D3A5D] dark:text-slate-100 tracking-tight">{c.name}</p>
                                        <Progress value={c.confidence * 100} className="h-1.5 my-3 bg-slate-100 dark:bg-slate-700" />
                                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed">{c.description}</p>
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
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white/40 backdrop-blur-md shadow-sm border border-white/20">
                    <ArrowLeft className="h-5 w-5 text-[#2D3A5D]" />
                </Button>
                <h2 className="text-2xl font-black text-[#2D3A5D] dark:text-slate-100 font-headline tracking-tight">Injury Scanner</h2>
            </div>

            <Card className="rounded-[2.5rem] neumorphic-card border-none">
                <CardHeader>
                    <CardTitle className="text-lg font-black text-[#2D3A5D] dark:text-slate-100">Describe or Photo</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tell us about the injury or upload a photo for guidance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form action={(formData) => {
                        if (preview) formData.set('photoDataUri', preview);
                        formAction(formData);
                    }} className="space-y-4">
                        <Textarea name="query" placeholder="e.g., I cut my finger while chopping vegetables..." rows={4} className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner" required />
                        
                        {!preview ? (
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full rounded-2xl border-orange-100 text-orange-600 bg-orange-50/30 font-bold hover:bg-orange-50 transition-all">
                                <ImageIcon className="mr-2 h-4 w-4" /> Add Photo (Optional)
                            </Button>
                        ) : (
                            <div className="relative rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-md">
                                <Image src={preview} alt="Injury" width={400} height={400} className="w-full h-auto object-cover" />
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

                        <Button type="submit" disabled={isAnalyzing} className="w-full rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 text-white h-12 text-sm font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Analyzing...</> : "Analyze Injury"}
                        </Button>
                    </form>
                </CardContent>
                {state.result && (
                    <CardFooter className="flex-col items-start gap-4">
                        <div className="prose prose-sm dark:prose-invert max-w-full p-6 rounded-[2rem] bg-white dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-700/50">
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
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white/40 backdrop-blur-md shadow-sm border border-white/20">
                    <ArrowLeft className="h-5 w-5 text-[#2D3A5D]" />
                </Button>
                <h2 className="text-2xl font-black text-[#2D3A5D] dark:text-slate-100 font-headline tracking-tight">Radiology Scanner</h2>
            </div>

            <Card className="rounded-[2.5rem] neumorphic-card border-none">
                <CardHeader>
                    <CardTitle className="text-lg font-black text-[#2D3A5D] dark:text-slate-100">X-ray Analysis</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload a clear image of an X-ray for AI interpretation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!preview ? (
                        <div className="border-2 border-dashed border-blue-100 dark:border-blue-900/30 rounded-[2rem] h-64 flex flex-col items-center justify-center bg-blue-50/20 space-y-4 cursor-pointer hover:bg-blue-50/40 transition-colors" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm text-blue-400">
                                <Bone className="w-10 h-10" />
                            </div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Click to Upload X-ray</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[2rem] overflow-hidden shadow-md border-4 border-white dark:border-slate-800">
                            <Image src={preview} alt="X-ray" width={500} height={500} className="w-full h-auto object-cover" />
                            <Button variant="destructive" size="icon" className="absolute top-4 right-4 rounded-full h-8 w-8" onClick={() => setPreview(null)}>
                                <X className="h-4 w-4" />
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
                        <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-2xl bg-gradient-to-r from-blue-400 to-blue-500 text-white h-12 text-sm font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Scanning X-ray...</> : "Scan X-ray"}
                        </Button>
                    </form>
                </CardContent>
                {state.result && (
                    <CardFooter className="flex-col items-start gap-4">
                        <div className="w-full space-y-4 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-50 dark:border-slate-700/50 animate-in zoom-in-95">
                            <h4 className="font-black text-lg text-[#2D3A5D] dark:text-slate-100 border-b border-slate-50 dark:border-slate-700 pb-3">Findings</h4>
                            <ul className="space-y-4">
                                {state.result.result.report?.findings.map((f: any, i: number) => (
                                    <li key={i} className="text-sm">
                                        <p className="font-black text-blue-600 tracking-tight">{f.label}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">{f.notes}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="pt-4 mt-2 border-t border-slate-50 dark:border-slate-700">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Impression:</p>
                                <p className="text-sm font-bold italic text-[#2D3A5D] dark:text-slate-200 mt-1">"{state.result.result.report?.impression}"</p>
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
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white/40 backdrop-blur-md shadow-sm border border-white/20">
                    <ArrowLeft className="h-5 w-5 text-[#2D3A5D]" />
                </Button>
                <h2 className="text-2xl font-black text-[#2D3A5D] dark:text-slate-100 font-headline tracking-tight">Lab Report Analyzer</h2>
            </div>

            <Card className="rounded-[2.5rem] neumorphic-card border-none">
                <CardHeader>
                    <CardTitle className="text-lg font-black text-[#2D3A5D] dark:text-slate-100">Report Analysis</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload an image of your physical lab report for a summary.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!preview ? (
                        <div className="border-2 border-dashed border-green-100 dark:border-green-900/30 rounded-[2rem] h-64 flex flex-col items-center justify-center bg-green-50/20 space-y-4 cursor-pointer hover:bg-green-50/40 transition-colors" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm text-green-400">
                                <FileText className="w-10 h-10" />
                            </div>
                            <p className="text-[10px] font-black text-green-600 uppercase tracking-widest">Click to Upload Report</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[2rem] overflow-hidden shadow-md border-4 border-white dark:border-slate-800">
                            <Image src={preview} alt="Report" width={500} height={500} className="w-full h-auto object-cover" />
                            <Button variant="destructive" size="icon" className="absolute top-4 right-4 rounded-full h-8 w-8" onClick={() => setPreview(null)}>
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

                    <form action={(formData) => {
                        if (preview) {
                            formData.set('imageDataUri', preview);
                            formData.set('language', lang);
                            formAction(formData);
                        }
                    }}>
                        <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-2xl bg-gradient-to-r from-green-400 to-green-500 text-white h-12 text-sm font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Analyzing Report...</> : "Analyze Report"}
                        </Button>
                    </form>
                </CardContent>
                {state.result && (
                    <CardFooter className="flex-col items-start gap-4">
                        <div className="w-full space-y-4 bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-50 dark:border-slate-700/50 animate-in zoom-in-95">
                            <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-700 pb-3 mb-2">
                                <h4 className="font-black text-lg text-[#2D3A5D] dark:text-slate-100">Results</h4>
                                <Button size="sm" onClick={() => downloadPdf(state.result.result)} className="rounded-full bg-green-600 text-white font-bold h-8 px-4 text-[10px] uppercase">
                                    <Download className="h-3 w-3 mr-1" /> PDF
                                </Button>
                            </div>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed mb-4">{state.result.result.summary}</p>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {state.result.result.interpretations.map((item: any, idx: number) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-xs font-black text-[#2D3A5D] dark:text-slate-100 tracking-tight">{item.test}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{item.note}</p>
                                        </div>
                                        <div className="text-right flex flex-col justify-center">
                                            <p className="text-sm font-black text-[#2D3A5D] dark:text-slate-100">{item.value}</p>
                                            <p className={cn("text-[8px] font-black uppercase mt-0.5", 
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

