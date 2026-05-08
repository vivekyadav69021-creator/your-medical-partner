'use client';

import React, { useActionState, useRef, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Scan, 
  Loader2, 
  X, 
  Camera, 
  AlertTriangle, 
  FileText, 
  ImageIcon, 
  Upload, 
  Download, 
  BrainCircuit, 
  ArrowLeft,
  User as UserIcon,
  Bandage,
  Bone,
  Activity,
  HeartPulse,
  Sparkles,
  Info,
  Navigation,
  Siren,
  Utensils,
  Settings
} from 'lucide-react';
import { analyzeXrayAction, analyzeSkinImageAction, analyzeLabReportImageAction, analyzeInjuryAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Textarea } from '@/components/ui/textarea';
import { cn } from "@/lib/utils";
import { useUserProfile } from '@/context/user-profile-context';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const initialXrayState = { result: null, error: null };
const initialSkinState = { result: null, error: null };
const initialLabReportState = { result: null, error: null };
const initialInjuryState = { result: null, error: null };

type ScannerView = 'home' | 'skin' | 'injury' | 'xray' | 'lab';

// Helper to track scans in localStorage
const updateScanStats = () => {
    const stats = JSON.parse(localStorage.getItem('disease_scanner_stats') || '{"count": 0, "lastScan": null}');
    const newStats = {
        count: stats.count + 1,
        lastScan: Date.now()
    };
    localStorage.setItem('disease_scanner_stats', JSON.stringify(newStats));
    // Dispatch custom event to notify home view
    window.dispatchEvent(new Event('scan-completed'));
};

export default function DiseaseScannerPage() {
    const [view, setView] = useState<ScannerView>('home');
    const { userName, userImage } = useUserProfile();
    const [lang, setLang] = useState<'en' | 'hi'>('en');
    const [scanStats, setScanStats] = useState({ count: 0, lastScan: null as number | null });
    
    useEffect(() => {
        const loadStats = () => {
            const saved = localStorage.getItem('disease_scanner_stats');
            if (saved) setScanStats(JSON.parse(saved));
        };
        
        loadStats();
        window.addEventListener('scan-completed', loadStats);
        return () => window.removeEventListener('scan-completed', loadStats);
    }, []);

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
            back: "Back to Home",
            analyzing: "Analyzing...",
            noScans: "No scans yet"
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
            back: "होम पर वापस जाएं",
            analyzing: "विश्लेषण हो रहा है...",
            noScans: "अभी कोई स्कैन नहीं"
        }
    }[lang];

    const renderContent = () => {
        switch (view) {
            case 'skin': return <SkinFaceScanner lang={lang} onBack={() => setView('home')} />;
            case 'injury': return <InjuryScanner lang={lang} onBack={() => setView('home')} />;
            case 'xray': return <XRayScanner lang={lang} onBack={() => setView('home')} />;
            case 'lab': return <LabReportAnalyzer lang={lang} onBack={() => setView('home')} />;
            default: return (
                <div className="space-y-8 px-2">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black tracking-tighter text-[#2D3A5D] dark:text-slate-100 font-headline">{t.greeting}</h1>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.subGreeting}</p>
                        </div>
                        <Link href="/profile">
                          <Avatar className="h-14 w-14 border-4 border-white dark:border-slate-800 shadow-lg transition-transform active:scale-95">
                            <AvatarImage src={userImage} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary font-black uppercase">{userName[0]}</AvatarFallback>
                          </Avatar>
                        </Link>
                    </div>

                    <Card className="rounded-[2.5rem] border-none shadow-sm bg-white/40 backdrop-blur-md border border-white/20 overflow-hidden">
                        <CardHeader className="pb-3 pt-6 px-8">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                {t.statsTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4 px-8 pb-6">
                            <div className="space-y-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{t.lastScan}:</p>
                                <p className="text-sm font-black text-[#2D3A5D] dark:text-slate-100 truncate">
                                    {scanStats.lastScan ? formatDistanceToNow(scanStats.lastScan, { addSuffix: true }) : t.noScans}
                                </p>
                            </div>
                            <div className="space-y-1 border-x px-4 border-slate-100 dark:border-slate-800 text-center">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{t.reports}:</p>
                                <p className="text-sm font-black text-[#2D3A5D] dark:text-slate-100">{scanStats.count}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">{t.healthScore}:</p>
                                <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase">
                                    Good
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-6">
                        <ScannerCard 
                            title={t.skinTitle} 
                            icon={Scan}
                            gradient="from-[#FFF1F6] to-[#FFE4EC]"
                            btnColor="bg-pink-500 text-white"
                            onClick={() => setView('skin')}
                            btnText={t.startBtn}
                        />
                        <ScannerCard 
                            title={t.injuryTitle} 
                            icon={Bandage}
                            gradient="from-[#FFF7ED] to-[#FFEDD5]"
                            btnColor="bg-orange-500 text-white"
                            onClick={() => setView('injury')}
                            btnText={t.startBtn}
                        />
                        <ScannerCard 
                            title={t.xrayTitle} 
                            icon={Bone}
                            gradient="from-[#E6F0FF] to-[#D1E4FF]"
                            btnColor="bg-blue-500 text-white"
                            onClick={() => setView('xray')}
                            btnText={t.startBtn}
                        />
                        <ScannerCard 
                            title={t.reportTitle} 
                            icon={FileText}
                            gradient="from-[#F0FDF4] to-[#DCFCE7]"
                            btnColor="bg-green-500 text-white"
                            onClick={() => setView('lab')}
                            btnText={t.startBtn}
                        />
                    </div>

                    <div className="flex justify-center pt-4 pb-12">
                        <Select value={lang} onValueChange={(v) => setLang(v as 'en' | 'hi')}>
                            <SelectTrigger className="w-[140px] bg-white/60 backdrop-blur-md rounded-full border-white/40 shadow-sm font-black text-[10px] uppercase tracking-widest h-10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-xl">
                                <SelectItem value="en" className="font-bold text-xs">English</SelectItem>
                                <SelectItem value="hi" className="font-bold text-xs">हिन्दी</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="animate-in fade-in duration-500 h-full">
            <div className="max-w-xl mx-auto">
                {renderContent()}
            </div>
        </div>
    );
}

function ScannerCard({ title, icon: Icon, gradient, btnColor, onClick, btnText }: { title: string, icon: any, gradient: string, btnColor: string, onClick: () => void, btnText: string }) {
    return (
        <Card 
            className={cn(
                "rounded-[3rem] border-none shadow-md group hover:scale-[1.03] transition-all duration-500 overflow-hidden cursor-pointer bg-gradient-to-br",
                gradient
            )}
            onClick={onClick}
        >
            <div className="p-6 flex flex-col h-full items-center justify-between text-center space-y-4">
                <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden shadow-inner bg-white/50 backdrop-blur-sm border border-white/40 flex items-center justify-center">
                   <Icon className="w-16 h-16 text-slate-700 opacity-80 group-hover:scale-110 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                </div>
                <div className="space-y-3 w-full">
                    <h3 className="text-sm font-black text-[#2D3A5D] dark:text-slate-100 tracking-tight leading-none">{title}</h3>
                    <Button 
                        className={cn(
                            "w-full rounded-2xl h-10 text-[10px] font-black uppercase tracking-widest shadow-lg transition-all border-none hover:brightness-110",
                            btnColor
                        )}
                    >
                        {btnText}
                    </Button>
                </div>
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

    useEffect(() => {
        if (state.result && !state.error) {
            updateScanStats();
        }
    }, [state]);

    const handleFormAction = (formData: FormData) => {
        if (preview) {
            const savedProfile = localStorage.getItem(`userMedicalProfile_local`);
            if (savedProfile) {
                formData.set('userProfile', savedProfile);
            }
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
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white/40 backdrop-blur-md shadow-sm border border-white/20">
                    <ArrowLeft className="h-5 w-5 text-[#2D3A5D]" />
                </Button>
                <h2 className="text-2xl font-black text-[#2D3A5D] dark:text-slate-100 font-headline tracking-tight">Personalized Skin Architect</h2>
            </div>

            <Card className="rounded-[2.5rem] neumorphic-card border-none">
                <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-pink-100 text-pink-600 hover:bg-pink-100 border-none px-3">Detect & Describe</Badge>
                    </div>
                    <CardTitle className="text-lg font-black text-[#2D3A5D] dark:text-slate-100">Intelligent Face Analysis</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                        Our architect combines visual morphology with your symptoms to provide biological insights.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    {!isCameraOpen && !preview && (
                        <div className="border-2 border-dashed border-pink-100 dark:border-pink-900/30 rounded-[2rem] h-64 flex flex-col items-center justify-center bg-pink-50/20 space-y-4">
                            <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm text-pink-400">
                                <ImageIcon className="w-10 h-10" />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-full font-bold h-10 px-6">
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
                                }} className="rounded-full bg-[#FFEDF2] text-pink-600 hover:bg-pink-100 font-bold border-none h-10 px-6">
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
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Describe symptoms (Itching, duration, triggers...)</Label>
                            <Textarea 
                                name="userQuery" 
                                placeholder="Example: These red spots appeared yesterday and they are itchy after using a new soap..." 
                                className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner min-h-[120px] text-base" 
                            />
                        </div>
                        <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-2xl bg-gradient-to-r from-pink-400 to-pink-500 text-white h-14 text-sm font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Analyzing Biological Patterns...</> : "Start Scientific Scan"}
                        </Button>
                    </form>
                </CardContent>
                
                {state.result && (
                    <CardFooter className="flex-col items-start gap-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                        {state.result.interactionPrompt && !state.result.identifiedConditions?.length && (
                            <Alert className="rounded-2xl bg-indigo-50 border-indigo-100">
                                <Info className="h-4 w-4 text-indigo-500" />
                                <AlertTitle className="font-black text-indigo-700">Follow-up Required</AlertTitle>
                                <AlertDescription className="text-xs font-bold text-indigo-600">{state.result.interactionPrompt}</AlertDescription>
                            </Alert>
                        )}

                        <div className="w-full space-y-6 animate-in slide-in-from-top-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-pink-500" />
                                    <h4 className="font-black text-sm uppercase tracking-widest text-[#2D3A5D] dark:text-slate-100">Clinical Reasoning</h4>
                                </div>
                                <div className="p-5 rounded-[2rem] bg-pink-50/30 dark:bg-pink-900/10 border border-pink-100/50 dark:border-pink-900/30">
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{state.result.overallAssessment}</p>
                                </div>
                            </div>

                            {state.result.comparativeAnalysis && (
                                <div className="p-5 rounded-[2rem] bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Activity className="w-3.5 h-3.5 text-indigo-500" />
                                        <p className="font-black text-[10px] uppercase tracking-widest text-indigo-600">Cross-Reference Analysis</p>
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{state.result.comparativeAnalysis}</p>
                                </div>
                            )}

                            <div className="grid gap-4">
                                {state.result.identifiedConditions?.map((c: any, i: number) => (
                                    <Card key={i} className="rounded-[2rem] border-none shadow-sm bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 overflow-hidden">
                                        <div className="p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-black text-base text-[#2D3A5D] dark:text-slate-100 tracking-tight">{c.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Primary Finding</p>
                                                </div>
                                                <Badge className="bg-green-50 text-green-600 border-none font-black">{Math.round(c.confidence * 100)}% Match</Badge>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                                                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Biological Logic</p>
                                                </div>
                                                <p className="text-xs font-bold text-slate-500 leading-relaxed italic">"{c.biologicalLogic}"</p>
                                            </div>
                                            <p className="text-xs font-medium text-slate-400 leading-relaxed">{c.description}</p>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {state.result.nutritionalSupport?.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <HeartPulse className="w-4 h-4 text-green-500" />
                                        <h4 className="font-black text-sm uppercase tracking-widest text-[#2D3A5D] dark:text-slate-100">Physiological Support</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {state.result.nutritionalSupport.map((item: string, idx: number) => (
                                            <Badge key={idx} variant="outline" className="rounded-full px-4 py-1.5 border-green-100 text-green-600 font-bold text-[10px] bg-green-50/30">
                                                {item}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] text-center pt-4">
                                This analysis is for educational purposes. Consult a dermatologist for prescription-grade treatment.
                            </p>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}

function InjuryScanner({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeInjuryAction, initialInjuryState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (state.result && !state.error) {
            updateScanStats();
        }
    }, [state]);

    const handleFormAction = (formData: FormData) => {
        if (preview) formData.set('imageDataUri', preview);
        formData.set('language', lang);
        formAction(formData);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white/40 backdrop-blur-md shadow-sm border border-white/20">
                    <ArrowLeft className="h-5 w-5 text-[#2D3A5D]" />
                </Button>
                <h2 className="text-2xl font-black text-[#2D3A5D] dark:text-slate-100 font-headline tracking-tight">Injury Specialist</h2>
            </div>

            <Card className="rounded-[2.5rem] neumorphic-card border-none overflow-hidden">
                <CardHeader className="bg-orange-50/30 dark:bg-orange-900/10 border-b border-orange-100/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-orange-100 text-orange-600 border-none">Emergency Response</Badge>
                    </div>
                    <CardTitle className="text-lg font-black text-[#2D3A5D] dark:text-slate-100">Traumatic Injury Assessment</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Immediate risk assessment and first-aid guidance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <form action={handleFormAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Describe how it happened (e.g., "fell on road")</Label>
                            <Textarea 
                                name="userQuery" 
                                placeholder="Tell us about the injury, pain level, or any numbness..." 
                                className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner min-h-[140px] text-base" 
                                required 
                            />
                        </div>
                        
                        {!preview ? (
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full rounded-2xl border-orange-200 text-orange-600 bg-white dark:bg-slate-800 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-50 transition-all h-12 shadow-sm">
                                <ImageIcon className="mr-2 h-4 w-4" /> Add Clear Photo (Optional)
                            </Button>
                        ) : (
                            <div className="relative rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-md aspect-video">
                                <Image src={preview} alt="Injury" fill className="object-cover" />
                                <Button size="icon" variant="destructive" className="absolute top-4 right-4 rounded-full h-8 w-8" onClick={() => setPreview(null)}>
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

                        <Button type="submit" disabled={isAnalyzing} className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white h-14 text-sm font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all transform active:scale-[0.98]">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Assessing Injury...</> : "Start Emergency Analysis"}
                        </Button>
                    </form>
                </CardContent>

                {state.result && (
                    <CardFooter className="flex-col items-start gap-6 pt-6 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                        {state.result.interactionPrompt && (
                             <Alert className="rounded-2xl bg-blue-50 border-blue-100">
                                <Info className="h-4 w-4 text-blue-500" />
                                <AlertTitle className="font-black text-blue-700">Additional Context Needed</AlertTitle>
                                <AlertDescription className="text-xs font-bold text-indigo-600">{state.result.interactionPrompt}</AlertDescription>
                            </Alert>
                        )}

                        {state.result.severity === 'high' && state.result.actionableAlert && (
                            <Alert variant="destructive" className="rounded-2xl border-2 border-red-500 bg-red-50 animate-pulse">
                                <AlertTriangle className="h-5 w-5" />
                                <AlertTitle className="font-black uppercase tracking-widest">CRITICAL ALERT</AlertTitle>
                                <AlertDescription className="font-bold text-sm leading-relaxed">
                                    {state.result.actionableAlert}
                                    <div className="mt-4 flex gap-2">
                                        <Button variant="destructive" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest h-9" asChild>
                                            <Link href="/nearby-hospital"><Navigation className="w-3 h-3 mr-1" /> Hospital Map</Link>
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-full font-black text-[10px] uppercase tracking-widest h-9 bg-white border-red-200 text-red-600" onClick={() => window.location.href = 'tel:112'}>
                                            <Siren className="w-3 h-3 mr-1" /> Call 112
                                        </Button>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="w-full space-y-6">
                            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Classification</p>
                                    <p className="text-sm font-black text-[#2D3A5D] dark:text-slate-100">{state.result.classification}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Severity</p>
                                    <Badge className={cn("font-black uppercase text-[10px] border-none", 
                                        state.result.severity === 'low' ? "bg-green-100 text-green-600" :
                                        state.result.severity === 'medium' ? "bg-orange-100 text-orange-600" :
                                        "bg-red-100 text-red-600"
                                    )}>
                                        {state.result.severity}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <HeartPulse className="w-4 h-4 text-orange-500" />
                                    <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-500">Biological Logic</h4>
                                </div>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-white/50">
                                    {state.result.biologicalLogic}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-blue-500" />
                                    <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-500">Immediate First-Aid</h4>
                                </div>
                                <div className="space-y-3">
                                    {state.result.firstAidSteps?.map((step: string, i: number) => (
                                        <div key={i} className="flex gap-3 items-start bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-50">
                                            <div className="h-6 w-6 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-black text-xs shrink-0">{i+1}</div>
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] text-center pt-4 italic">
                                "This is an AI-generated first-aid guide for immediate awareness. If the injury is severe, seek professional medical treatment immediately."
                            </p>
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

    useEffect(() => {
        if (state.result && !state.error) {
            updateScanStats();
        }
    }, [state]);

    const handleFormAction = (formData: FormData) => {
        if (preview) {
            formData.set('photoDataUri', preview);
            formData.set('contentType', fileType);
            formData.set('language', lang);
            formAction(formData);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white/40 backdrop-blur-md shadow-sm border border-white/20">
                    <ArrowLeft className="h-5 w-5 text-[#2D3A5D]" />
                </Button>
                <h2 className="text-2xl font-black text-[#2D3A5D] dark:text-slate-100 font-headline tracking-tight">Radiology Specialist</h2>
            </div>

            <Card className="rounded-[2.5rem] neumorphic-card border-none overflow-hidden">
                <CardHeader className="bg-blue-50/30 dark:bg-blue-900/10 border-b border-blue-100/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-600 border-none">Bone & Chest Analysis</Badge>
                    </div>
                    <CardTitle className="text-lg font-black text-[#2D3A5D] dark:text-slate-100">Intelligent X-ray Scanner</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        Multimodal structural analysis for skeletal anomalies and hairline fractures.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <form action={handleFormAction} className="space-y-6">
                        {!preview ? (
                            <div className="border-2 border-dashed border-blue-100 dark:border-blue-900/30 rounded-[2rem] h-64 flex flex-col items-center justify-center bg-blue-50/20 space-y-4 cursor-pointer hover:bg-blue-50/40 transition-colors" onClick={() => fileInputRef.current?.click()}>
                                <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm text-blue-400">
                                    <Bone className="w-10 h-10" />
                                </div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Upload X-ray Image</p>
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

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Mechanism of Injury / Context</Label>
                            <Textarea 
                                name="userQuery" 
                                placeholder="Example: Severe pain in ankle after landing hard while playing basketball..." 
                                className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner min-h-[120px] text-base" 
                            />
                        </div>

                        <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-14 text-sm font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Performing Radiographic Scan...</> : "Start Structural Analysis"}
                        </Button>
                    </form>
                </CardContent>

                {state.result && (
                    <CardFooter className="flex-col items-start gap-6 pt-6 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                        {state.result.interactionPrompt && (
                             <Alert className="rounded-2xl bg-indigo-50 border-indigo-100">
                                <Info className="h-4 w-4 text-indigo-500" />
                                <AlertTitle className="font-black text-blue-700">Follow-up Query</AlertTitle>
                                <AlertDescription className="text-xs font-bold text-indigo-600">{state.result.interactionPrompt}</AlertDescription>
                            </Alert>
                        )}

                        <div className="w-full space-y-6">
                            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Body Part</p>
                                    <p className="text-sm font-black text-[#2D3A5D] dark:text-slate-100">{state.result.bodyPart}</p>
                                </div>
                                <Badge className="bg-blue-50 text-blue-600 border-none font-black uppercase text-[10px]">Pre-clinical</Badge>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-blue-500" />
                                    <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-500">Radiographic Observation</h4>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/50">
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-200 leading-relaxed italic">"{state.result.observation}"</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <BrainCircuit className="w-4 h-4 text-indigo-500" />
                                    <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-500">Biological Reasoning</h4>
                                </div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed px-1">
                                    {state.result.biologicalReasoning}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-green-500" />
                                    <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-500">Suggested Actions</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {state.result.suggestedActions?.map((action: string, i: number) => (
                                        <Badge key={i} variant="outline" className="rounded-full px-4 py-1.5 border-green-100 text-green-600 font-bold text-[10px] bg-green-50/30">
                                            {action}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            
                            <Alert className="rounded-2xl bg-amber-50 border-amber-100">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                <p className="text-[9px] font-bold text-amber-700 leading-relaxed">
                                    {state.result.disclaimer}
                                </p>
                            </Alert>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}

function LabReportAnalyzer({ lang, onBack }: { lang: 'en' | 'hi', onBack: void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeLabReportImageAction, initialLabReportState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state.result && !state.error) {
            updateScanStats();
        }
    }, [state]);

    const handleFormAction = (formData: FormData) => {
        if (preview) {
            formData.set('imageDataUri', preview);
            formData.set('language', lang);
            formAction(formData);
        } else {
            toast({ variant: 'destructive', title: "Image Required", description: "Please upload a lab report image first." });
        }
    };

    const downloadPdf = (report: any) => {
        if (!report || !report.interpretations) return;
        const doc = new jsPDF();
        const patientName = report.patientDetails?.name || 'Guest';
        doc.setFontSize(18);
        doc.text("Clinical Lab Analysis", 105, 20, { align: 'center' });
        (doc as any).autoTable({
            startY: 40,
            head: [['Biomarker', 'Value', 'Reference Range', 'Status']],
            body: report.interpretations.map((i: any) => [i.test, i.value, i.range || 'N/A', i.status]),
        });
        doc.save(`Analysis-${patientName}.pdf`);
        toast({ title: "PDF Downloaded" });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white/40 backdrop-blur-md shadow-sm border border-white/20">
                    <ArrowLeft className="h-5 w-5 text-[#2D3A5D]" />
                </Button>
                <h2 className="text-2xl font-black text-[#2D3A5D] dark:text-slate-100 font-headline tracking-tight">Clinical Data Analyst</h2>
            </div>

            <Card className="rounded-[2.5rem] neumorphic-card border-none overflow-hidden">
                <CardHeader className="bg-green-50/30 dark:bg-green-900/10 border-b border-green-100/50">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-green-100 text-green-600 border-none">Multimodal OCR Interpretation</Badge>
                    </div>
                    <CardTitle className="text-lg font-black text-[#2D3A5D] dark:text-slate-100">Lab Report Analysis</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        Extract biomarkers and identify values outside reference ranges automatically.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <form action={handleFormAction} className="space-y-6">
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

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Describe symptoms (e.g., fatigue, pain, reason for test)</Label>
                            <Textarea 
                                name="userQuery" 
                                placeholder="Example: I've been feeling extremely tired lately and have muscle aches..." 
                                className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner min-h-[120px] text-base" 
                            />
                        </div>

                        <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white h-14 text-sm font-black uppercase tracking-widest shadow-lg hover:opacity-90 transition-all">
                            {isAnalyzing ? <><Loader2 className="mr-2 animate-spin" /> Extracting Data...</> : "Start Clinical Interpretation"}
                        </Button>
                    </form>
                </CardContent>

                {state.result && (
                    <CardFooter className="flex-col items-start gap-6 pt-6 border-t border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                        {state.result.interactionPrompt && !state.result.interpretations?.length && (
                            <Alert className="rounded-2xl bg-indigo-50 border-indigo-100">
                                <Info className="h-4 w-4 text-indigo-500" />
                                <AlertTitle className="font-black text-indigo-700">Additional Data Needed</AlertTitle>
                                <AlertDescription className="text-xs font-bold text-indigo-600">{state.result.interactionPrompt}</AlertDescription>
                            </Alert>
                        )}

                        <div className="w-full space-y-6">
                            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Key Findings Summary</p>
                                    <p className="text-sm font-black text-[#2D3A5D] dark:text-slate-100 leading-tight">{state.result.summary}</p>
                                </div>
                                <Button size="sm" onClick={() => downloadPdf(state.result)} className="rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 h-9 px-4 font-black text-[10px] uppercase">
                                    <Download className="h-3.5 w-3.5 mr-1.5" /> PDF
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-500" />
                                    <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-500">Biomarker Analysis Table</h4>
                                </div>
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                    {state.result.interpretations?.map((item: any, idx: number) => (
                                        <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-50 flex justify-between gap-4 items-center">
                                            <div className="flex-1">
                                                <p className="text-xs font-black text-[#2D3A5D] dark:text-slate-100 tracking-tight">{item.test}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Range: {item.range || 'N/A'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-[#2D3A5D] dark:text-slate-100">{item.value}</p>
                                                <Badge className={cn("mt-1 text-[8px] font-black uppercase border-none", 
                                                    item.status === 'normal' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                )}>{item.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <BrainCircuit className="w-4 h-4 text-indigo-500" />
                                    <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-500">Biological Logic</h4>
                                </div>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-white/50">
                                    {state.result.biologicalLogic}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Utensils className="w-4 h-4 text-orange-500" />
                                    <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-500">Lifestyle Suggestions</h4>
                                </div>
                                <div className="grid gap-3">
                                    {state.result.lifestyleSuggestions?.map((suggestion: string, i: number) => (
                                        <div key={i} className="flex gap-3 items-start bg-white/40 dark:bg-slate-800/40 p-3 rounded-2xl border border-white/50">
                                            <div className="h-5 w-5 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center font-black text-[10px] shrink-0">{i+1}</div>
                                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">{suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <Alert className="rounded-2xl bg-amber-50 border-amber-100 mt-6">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                <p className="text-[10px] font-bold text-amber-700 leading-relaxed italic">
                                    {state.result.recommendation}
                                </p>
                            </Alert>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}