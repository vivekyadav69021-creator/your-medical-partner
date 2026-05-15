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
  Bandage,
  Bone,
  Activity,
  HeartPulse,
  Sparkles,
  Info,
  Navigation,
  Siren,
  Utensils,
  Settings,
  ShieldCheck
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

const updateScanStats = () => {
    const stats = JSON.parse(localStorage.getItem('disease_scanner_stats') || '{"count": 0, "lastScan": null}');
    const newStats = { count: stats.count + 1, lastScan: Date.now() };
    localStorage.setItem('disease_scanner_stats', JSON.stringify(newStats));
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
            greeting: `Hi ${userName.split(' ')[0]}`,
            subGreeting: "Advanced Diagnostics",
            statsTitle: "Diagnostic Activity",
            lastScan: "Last Scan",
            reports: "Total Scans",
            healthScore: "Lab Status",
            skinTitle: "Face & Skin",
            injuryTitle: "Injury & SOS",
            xrayTitle: "X-Ray Vision",
            reportTitle: "Report Analyst",
            startBtn: "Analyze Now",
            analyzing: "Processing Samples...",
            noScans: "Ready for scan"
        },
        hi: {
            greeting: `नमस्ते ${userName.split(' ')[0]}`,
            subGreeting: "उन्नत निदान",
            statsTitle: "नैदानिक गतिविधियाँ",
            lastScan: "पिछला स्कैन",
            reports: "कुल स्कैन",
            healthScore: "लैब स्थिति",
            skinTitle: "फेस और स्किन",
            injuryTitle: "इंजरी और SOS",
            xrayTitle: "एक्स-रे विजन",
            reportTitle: "रिपोर्ट विश्लेषण",
            startBtn: "अभी विश्लेषण करें",
            analyzing: "नमूनों का विश्लेषण...",
            noScans: "स्कैन के लिए तैयार"
        }
    }[lang];

    const renderContent = () => {
        switch (view) {
            case 'skin': return <SkinFaceScanner lang={lang} onBack={() => setView('home')} />;
            case 'injury': return <InjuryScanner lang={lang} onBack={() => setView('home')} />;
            case 'xray': return <XRayScanner lang={lang} onBack={() => setView('home')} />;
            case 'lab': return <LabReportAnalyzer lang={lang} onBack={() => setView('home')} />;
            default: return (
                <div className="space-y-8 animate-in fade-in duration-700 pb-32">
                    {/* Premium Branded Header for Scanner */}
                    <div className="flex items-center justify-between p-6 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-sm mx-1">
                        <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50/80 dark:bg-blue-900/20 rounded-full border border-blue-100/50 mb-1">
                                <Scan className="w-3 h-3 text-primary" />
                                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Diagnostic Lab</span>
                            </div>
                            <h1 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight truncate">{t.greeting} 👋</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{t.subGreeting}</p>
                        </div>
                        <Link href="/profile" className="shrink-0 ml-4">
                          <Avatar className="h-14 w-14 border-4 border-white shadow-lg active:scale-95 transition-transform bg-slate-100">
                            <AvatarImage src={userImage} className="object-cover" />
                            <AvatarFallback className="bg-primary text-white font-black uppercase text-lg">{userName[0]}</AvatarFallback>
                          </Avatar>
                        </Link>
                    </div>

                    {/* Stats Dashboard Card */}
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 overflow-hidden mx-1">
                        <CardHeader className="pb-3 pt-6 px-8">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500/80 flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-primary" />
                                {t.statsTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-2 px-8 pb-8 text-center">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.lastScan}</p>
                                <p className="text-xs font-black text-[#2D3A5D] dark:text-slate-200 truncate">
                                    {scanStats.lastScan ? formatDistanceToNow(scanStats.lastScan, { addSuffix: true }) : t.noScans}
                                </p>
                            </div>
                            <div className="space-y-1 border-x border-slate-100/50 dark:border-slate-800/50 px-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.reports}</p>
                                <p className="text-sm font-black text-primary">{scanStats.count}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.healthScore}</p>
                                <div className="flex justify-center">
                                    <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 text-[9px] font-black border-none px-2.5 py-0.5 rounded-full">ACTIVE</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scanner Selection Grid */}
                    <div className="grid grid-cols-2 gap-5 px-1">
                        <ScannerCard title={t.skinTitle} slogan="Dermatology" icon={Scan} gradient="from-pink-50 to-pink-100/30" iconColor="text-pink-500" btnColor="bg-pink-500" onClick={() => setView('skin')} btnText={t.startBtn} />
                        <ScannerCard title={t.injuryTitle} slogan="Emergency" icon={Bandage} gradient="from-orange-50 to-orange-100/30" iconColor="text-orange-500" btnColor="bg-orange-500" onClick={() => setView('injury')} btnText={t.startBtn} />
                        <ScannerCard title={t.xrayTitle} slogan="Radiology" icon={Bone} gradient="from-blue-50 to-blue-100/30" iconColor="text-blue-500" btnColor="bg-blue-500" onClick={() => setView('xray')} btnText={t.startBtn} />
                        <ScannerCard title={t.reportTitle} slogan="OCR Lab" icon={FileText} gradient="from-emerald-50 to-emerald-100/30" iconColor="text-emerald-500" btnColor="bg-emerald-500" onClick={() => setView('lab')} btnText={t.startBtn} />
                    </div>

                    {/* Language Toggler */}
                    <div className="fixed bottom-24 left-0 right-0 flex justify-center z-40 px-6 pointer-events-none">
                        <div className="pointer-events-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-full p-1 border border-white/40 dark:border-slate-800">
                             <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" onClick={() => setLang('en')} className={cn("rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-widest", lang === 'en' ? "bg-primary text-white" : "text-slate-400")}>EN</Button>
                                <Button variant="ghost" size="sm" onClick={() => setLang('hi')} className={cn("rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-widest", lang === 'hi' ? "bg-primary text-white" : "text-slate-400")}>हिन्दी</Button>
                             </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] fixed inset-0 overflow-hidden font-body">
            <main className="h-full overflow-y-auto scroll-smooth scrollbar-hide safe-top">
                <div className="max-w-2xl mx-auto p-4 pt-6 min-h-full">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

function ScannerCard({ title, slogan, icon: Icon, gradient, iconColor, btnColor, onClick, btnText }: any) {
    return (
        <Card className={cn("rounded-[3rem] border-none shadow-lg group hover:scale-[1.03] active:scale-95 transition-all duration-500 cursor-pointer bg-gradient-to-br relative overflow-hidden", gradient)} onClick={onClick}>
            {/* Background pattern */}
            <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-white/20 rounded-full blur-2xl" />
            
            <div className="p-6 flex flex-col items-center gap-4 text-center relative z-10">
                <div className="w-20 h-20 rounded-[2rem] bg-white/90 dark:bg-slate-900 shadow-md flex items-center justify-center transition-transform duration-700 group-hover:rotate-12">
                   <Icon className={cn("w-10 h-10", iconColor)} />
                </div>
                <div className="space-y-1.5 w-full">
                    <h3 className="text-[13px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight leading-none">{title}</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{slogan}</p>
                    <div className={cn("w-full rounded-2xl py-2.5 mt-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl transition-all duration-300 group-hover:shadow-primary/20", btnColor)}>
                        {btnText}
                    </div>
                </div>
            </div>
        </Card>
    );
}

// --- SUB-COMPONENTS (Refactored for PWA Card-less look) ---

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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md border border-white/20 shrink-0">
                    <ArrowLeft className="h-6 w-6 text-[#1A365D]" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Skin Architect</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biological Morphology Scan</p>
                </div>
            </div>

            <div className="space-y-8">
                <canvas ref={canvasRef} className="hidden"></canvas>
                {!isCameraOpen && !preview && (
                    <div className="border-4 border-dashed border-white/60 dark:border-slate-800 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm space-y-6 transition-all active:scale-[0.98]" onClick={() => fileInputRef.current?.click()}>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl text-pink-400 animate-pulse">
                            <ImageIcon className="w-12 h-12" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">Tap to Upload Photo</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selfie or close-up of area</p>
                        </div>
                        <Button type="button" onClick={(e) => { e.stopPropagation(); setIsCameraOpen(true); }} className="rounded-full bg-pink-500 text-white font-black px-8 h-12 shadow-lg shadow-pink-200">
                             <Camera className="mr-2 h-4 w-4" /> Open Camera
                        </Button>
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
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5] bg-black border-4 border-white">
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 px-10">
                            <button onClick={takePicture} className="h-20 w-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-md flex items-center justify-center group active:scale-90 transition-transform">
                                <div className="h-14 w-14 rounded-full bg-pink-500 border-2 border-white"></div>
                            </button>
                            <Button variant="ghost" size="icon" onClick={() => {
                                setIsCameraOpen(false);
                                if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
                            }} className="rounded-full h-14 w-14 bg-black/40 text-white backdrop-blur-md border border-white/20">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                )}

                {preview && (
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group">
                        <Image src={preview} alt="Preview" width={800} height={1000} className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        <Button variant="destructive" size="icon" className="absolute top-6 right-6 rounded-full h-10 w-10 shadow-xl" onClick={() => setPreview(null)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                <form action={handleFormAction} className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500/80 px-2 flex items-center gap-2">
                             <Sparkles className="w-3.5 h-3.5 text-primary" /> Describe Symptoms
                        </Label>
                        <Textarea 
                            name="userQuery" 
                            placeholder="E.g., Itchy red patches since 2 days..." 
                            className="rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[140px] text-lg font-bold p-6 focus-visible:ring-primary/20" 
                        />
                    </div>
                    <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-pink-500 to-rose-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-pink-200 active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> Identifying Patterns...</> : "Start Scientific Analysis"}
                    </Button>
                </form>
            </div>
            
            {state.result && (
                <div className="space-y-12 animate-in slide-in-from-top-6 duration-700">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    {state.result.overallAssessment && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <BrainCircuit className="w-5 h-5 text-pink-500" />
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-100">AI Architect Verdict</h4>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-sm">
                                <p className="text-base font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{state.result.overallAssessment}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-6">
                        {state.result.identifiedConditions?.map((c: any, i: number) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between items-center px-4">
                                    <div>
                                        <h5 className="font-black text-xl text-[#1A365D] dark:text-white tracking-tight">{c.name}</h5>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Potential Finding</p>
                                    </div>
                                    <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-none font-black px-4 py-1.5 rounded-full">{Math.round(c.confidence * 100)}% Match</Badge>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 shadow-sm space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em]">Biological Logic</p>
                                        <p className="text-sm font-bold text-slate-500 leading-relaxed italic border-l-4 border-pink-100 pl-4">"{c.biologicalLogic}"</p>
                                    </div>
                                    <p className="text-sm font-medium text-slate-400 leading-relaxed">{c.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {state.result.nutritionalSupport?.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 px-2">
                                <HeartPulse className="w-5 h-5 text-emerald-500" />
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-100">Physiological Support</h4>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {state.result.nutritionalSupport.map((item: string, idx: number) => (
                                    <div key={idx} className="px-6 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-black text-[11px] uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="p-8 bg-amber-50/50 dark:bg-amber-950/20 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/30 flex gap-4">
                        <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0" />
                        <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 leading-relaxed italic">
                            "This analysis is for educational purposes. Our AI provides insights based on visual data, but it is not a diagnosis. Consult a professional dermatologist for medical treatment."
                        </p>
                    </div>
                </div>
            )}
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md border border-white/20 shrink-0">
                    <ArrowLeft className="h-6 w-6 text-[#1A365D]" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Injury Specialist</h2>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Emergency Response Scan</p>
                </div>
            </div>

            <div className="space-y-8">
                 <form action={handleFormAction} className="space-y-8">
                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Accident Description</Label>
                        <Textarea 
                            name="userQuery" 
                            placeholder="E.g., Fell down stairs, deep cut on knee, persistent bleeding..." 
                            className="rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[160px] text-lg font-bold p-8 focus-visible:ring-orange-200" 
                            required 
                        />
                    </div>
                    
                    {!preview ? (
                        <div className="border-4 border-dashed border-orange-100 dark:border-slate-800 rounded-[2.5rem] p-10 text-center space-y-4 bg-orange-50/20 dark:bg-slate-900/20 active:scale-95 transition-all" onClick={() => fileInputRef.current?.click()}>
                            <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-orange-400 mx-auto">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <p className="text-[10px] font-black text-orange-600/80 uppercase tracking-widest">Add Clear Injury Photo (Optional)</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl group">
                            <Image src={preview} alt="Injury" width={800} height={600} className="w-full h-auto object-cover" />
                            <Button size="icon" variant="destructive" className="absolute top-6 right-6 rounded-full h-10 w-10 shadow-2xl" onClick={() => setPreview(null)}>
                                <X className="h-5 w-5" />
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

                    <Button type="submit" disabled={isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-orange-500 to-red-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-orange-200 active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> Assessing Severity...</> : "Start Emergency Scan"}
                    </Button>
                </form>
            </div>

            {state.result && (
                <div className="space-y-12 animate-in slide-in-from-top-6 duration-700">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    {state.result.severity === 'high' && state.result.actionableAlert && (
                        <Alert variant="destructive" className="rounded-[2.5rem] border-none bg-red-500 text-white p-8 animate-pulse shadow-2xl shadow-red-200">
                            <div className="flex gap-6 items-start">
                                <div className="p-4 bg-white/20 rounded-[1.5rem] backdrop-blur-md">
                                    <Siren className="h-8 w-8 text-white" />
                                </div>
                                <div className="space-y-4">
                                    <AlertTitle className="text-xl font-black uppercase tracking-tight">CRITICAL ALERT</AlertTitle>
                                    <AlertDescription className="text-base font-bold leading-relaxed opacity-90">
                                        {state.result.actionableAlert}
                                    </AlertDescription>
                                    <div className="flex gap-3 pt-2">
                                        <Button variant="outline" size="sm" className="rounded-full h-11 px-6 bg-white text-red-600 border-none font-black text-[10px] uppercase tracking-widest shadow-xl" asChild>
                                            <Link href="/nearby-hospital"><Navigation className="w-4 h-4 mr-1.5" /> Find Hospital</Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="rounded-full h-11 px-6 bg-red-600 text-white border-none font-black text-[10px] uppercase tracking-widest" onClick={() => window.location.href = 'tel:112'}>
                                            <Siren className="w-4 h-4 mr-1.5" /> Call 112
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                         <div className="p-8 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800 shadow-sm text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Classification</p>
                            <p className="text-sm font-black text-[#1A365D] dark:text-slate-100">{state.result.classification}</p>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white dark:border-slate-800 shadow-sm text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Severity Level</p>
                            <Badge className={cn("font-black uppercase text-[10px] border-none px-4 py-1 rounded-full", 
                                state.result.severity === 'low' ? "bg-emerald-50 text-emerald-600" :
                                state.result.severity === 'medium' ? "bg-orange-50 text-orange-600" :
                                "bg-red-50 text-red-600"
                            )}>
                                {state.result.severity}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <HeartPulse className="w-5 h-5 text-orange-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-100">Biological Logic</h4>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 shadow-sm">
                            <p className="text-base font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{state.result.biologicalLogic}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-100">Immediate First-Aid</h4>
                        </div>
                        <div className="space-y-4">
                            {state.result.firstAidSteps?.map((step: string, i: number) => (
                                <div key={i} className="flex gap-6 items-center bg-white/40 dark:bg-slate-900/40 p-6 rounded-[2rem] border border-white/50 shadow-sm">
                                    <div className="h-10 w-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg">{i+1}</div>
                                    <p className="text-base font-bold text-slate-700 dark:text-slate-200">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] text-center pt-8 italic leading-relaxed">
                        "This is an AI-generated first-aid guide. If the injury is severe, bleeding profusely, or causes numbness, seek immediate professional medical treatment."
                    </p>
                </div>
            )}
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1">
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md border border-white/20 shrink-0">
                    <ArrowLeft className="h-6 w-6 text-[#1A365D]" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Radiology AI</h2>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Bone & Chest Structural Scan</p>
                </div>
            </div>

            <div className="space-y-8">
                <form action={handleFormAction} className="space-y-8">
                    {!preview ? (
                        <div className="border-4 border-dashed border-blue-100 dark:border-slate-800 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-blue-50/20 dark:bg-slate-900/20 backdrop-blur-sm space-y-6 cursor-pointer active:scale-95 transition-all" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl text-blue-500 animate-pulse">
                                <Bone className="w-12 h-12" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">Upload X-Ray Plate</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High resolution jpeg/png</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                            <Image src={preview} alt="X-ray" width={800} height={1000} className="w-full h-auto object-cover" />
                            <Button variant="destructive" size="icon" className="absolute top-6 right-6 rounded-full h-10 w-10 shadow-2xl" onClick={() => setPreview(null)}>
                                <X className="h-5 w-5" />
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

                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Mechanism of Injury</Label>
                        <Textarea 
                            name="userQuery" 
                            placeholder="E.g., Severe pain in wrist after fall..." 
                            className="rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[140px] text-lg font-bold p-8" 
                        />
                    </div>

                    <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> Analyzing Skeletal Density...</> : "Start Radiographic Analysis"}
                    </Button>
                </form>
            </div>

            {state.result && (
                <div className="space-y-12 animate-in slide-in-from-top-6 duration-700">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    <div className="flex justify-between items-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-sm">
                        <div className="space-y-0.5">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identified Part</p>
                            <p className="text-xl font-black text-[#1A365D] dark:text-slate-100">{state.result.bodyPart}</p>
                        </div>
                        <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border-none font-black uppercase text-[10px] px-4 py-1.5 rounded-full tracking-widest">Structural</Badge>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <Sparkles className="w-5 h-5 text-blue-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-100">AI Observation</h4>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 shadow-sm">
                            <p className="text-base font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic border-l-4 border-blue-500 pl-4">"{state.result.observation}"</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <BrainCircuit className="w-5 h-5 text-indigo-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-100">Biological Reasoning</h4>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 shadow-sm">
                            <p className="text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                {state.result.biologicalReasoning}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-100">Suggested Actions</h4>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {state.result.suggestedActions?.map((action: string, i: number) => (
                                <div key={i} className="px-6 py-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-black text-[11px] uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                                    {action}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <Alert className="rounded-[2.5rem] bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 p-8 flex gap-6 items-start">
                        <AlertTriangle className="h-8 w-8 text-amber-500 shrink-0" />
                        <p className="text-[11px] font-bold text-amber-700 dark:text-amber-500 leading-relaxed italic">
                            {state.result.disclaimer}
                        </p>
                    </Alert>
                </div>
            )}
        </div>
    );
}

function LabReportAnalyzer({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md border border-white/20 shrink-0">
                    <ArrowLeft className="h-6 w-6 text-[#1A365D]" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Report Analyst</h2>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">OCR Data Interpretation</p>
                </div>
            </div>

            <div className="space-y-8">
                <form action={handleFormAction} className="space-y-8">
                    {!preview ? (
                        <div className="border-4 border-dashed border-emerald-100 dark:border-slate-800 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-emerald-50/20 dark:bg-slate-900/20 backdrop-blur-sm space-y-6 cursor-pointer active:scale-95 transition-all" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl text-emerald-500 animate-pulse">
                                <FileText className="w-12 h-12" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">Drop Lab Report Here</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Blood tests, Lipid profile, etc.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group">
                            <Image src={preview} alt="Report" width={800} height={1000} className="w-full h-auto object-cover" />
                            <Button variant="destructive" size="icon" className="absolute top-6 right-6 rounded-full h-10 w-10 shadow-2xl" onClick={() => setPreview(null)}>
                                <X className="h-5 w-5" />
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

                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Clinical Context</Label>
                        <Textarea 
                            name="userQuery" 
                            placeholder="E.g., Feeling extremely tired for 1 month..." 
                            className="rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[140px] text-lg font-bold p-8" 
                        />
                    </div>

                    <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-200 active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> Extracting Biomarkers...</> : "Start Clinical Interpretation"}
                    </Button>
                </form>
            </div>

            {state.result && (
                <div className="space-y-12 animate-in slide-in-from-top-6 duration-700">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    <div className="space-y-6">
                        <div className="flex justify-between items-end px-2">
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Executive Summary</p>
                                <h4 className="text-xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight leading-tight">{state.result.summary}</h4>
                            </div>
                            <Button size="sm" onClick={() => downloadPdf(state.result)} className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white h-11 px-6 font-black text-[11px] uppercase tracking-widest transition-all shadow-md">
                                <Download className="h-4 w-4 mr-2" /> Export PDF
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-100">Extracted Biomarkers</h4>
                        </div>
                        <div className="space-y-4">
                            {state.result.interpretations?.map((item: any, idx: number) => (
                                <div key={idx} className="p-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 shadow-sm border border-white dark:border-slate-800 flex justify-between gap-6 items-center">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-black text-[#1A365D] dark:text-slate-100 tracking-tight truncate">{item.test}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Range: {item.range || 'N/A'}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-black text-[#1A365D] dark:text-white">{item.value}</p>
                                        <Badge className={cn("mt-1.5 text-[9px] font-black uppercase border-none px-3 rounded-full", 
                                            item.status === 'normal' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                        )}>{item.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <BrainCircuit className="w-5 h-5 text-indigo-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-100">Biological Synthesis</h4>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/50 shadow-sm">
                            <p className="text-base font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-emerald-500 pl-4">
                                "{state.result.biologicalLogic}"
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <Utensils className="w-5 h-5 text-orange-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-100">Lifestyle Adjustments</h4>
                        </div>
                        <div className="grid gap-4">
                            {state.result.lifestyleSuggestions?.map((suggestion: string, i: number) => (
                                <div key={i} className="flex gap-4 items-center bg-white/40 dark:bg-slate-900/40 p-5 rounded-[2rem] border border-white/50">
                                    <div className="h-8 w-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-md">{i+1}</div>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-300 leading-tight">{suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <Alert className="rounded-[2.5rem] bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30 p-8 flex gap-6 items-start">
                        <ShieldCheck className="h-8 w-8 text-amber-500 shrink-0" />
                        <p className="text-[11px] font-bold text-amber-700 dark:text-amber-500 leading-relaxed italic">
                            {state.result.recommendation}
                        </p>
                    </Alert>
                </div>
            )}
        </div>
    );
}

