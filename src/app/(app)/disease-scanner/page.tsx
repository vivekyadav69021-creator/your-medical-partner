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
  ShieldCheck,
  ChevronLeft
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
                    {/* Immersive Branded Header for Scanner Home */}
                    <div className="flex items-center justify-between p-6 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-sm mx-1 safe-top mt-2">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 bg-white/50 shadow-sm border border-white/20 shrink-0">
                                    <ChevronLeft className="h-6 w-6 text-[#1A365D]" />
                                </Button>
                            </Link>
                            <div className="space-y-0.5 min-w-0">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50/80 dark:bg-blue-900/20 rounded-full border border-blue-100/50 mb-0.5">
                                    <Scan className="w-2.5 h-2.5 text-primary" />
                                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Diagnostic Lab</span>
                                </div>
                                <h1 className="text-xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight truncate">{t.greeting} 👋</h1>
                            </div>
                        </div>
                        <Link href="/profile" className="shrink-0 ml-4">
                          <Avatar className="h-12 w-12 border-4 border-white shadow-lg active:scale-95 transition-transform bg-slate-100">
                            <AvatarImage src={userImage} className="object-cover" />
                            <AvatarFallback className="bg-primary text-white font-black uppercase text-base">{userName[0]}</AvatarFallback>
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
            <main className="h-full overflow-y-auto scroll-smooth scrollbar-hide">
                <div className="max-w-2xl mx-auto p-4 pt-4 min-h-full">
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

// --- SCAN ANIMATION OVERLAY ---
function ScanAnimationOverlay({ color }: { color: string }) {
    return (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {/* Scanning Line */}
            <div 
                className={cn("absolute left-0 right-0 h-1.5 shadow-[0_0_20px_2px_currentColor] animate-scan-line z-30", color)} 
                style={{ color: 'inherit' }}
            />
            {/* Holographic Grid Effect */}
            <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] dark:opacity-[0.15]" />
            {/* Pulsing Glow Tint */}
            <div className={cn("absolute inset-0 opacity-10 animate-pulse", color.replace('text-', 'bg-'))} />
        </div>
    );
}

// --- SUB-COMPONENTS ---

function SkinFaceScanner({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeSkinImageAction, initialSkinState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (state.result && !state.error) updateScanStats();
    }, [state]);

    const handleFormAction = (formData: FormData) => {
        if (preview) {
            const savedProfile = localStorage.getItem(`userMedicalProfile_local`);
            if (savedProfile) formData.set('userProfile', savedProfile);
            formData.set('imageDataUri', preview);
            formAction(formData);
        }
    }

    const takePicture = () => {
        if (videoRef.current && canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
          setPreview(canvas.toDataURL('image/jpeg', 0.9));
          setIsCameraOpen(false);
          streamRef.current?.getTracks().forEach(t => t.stop());
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1 safe-top mt-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md border border-white/20 shrink-0">
                    <ArrowLeft className="h-6 w-6 text-[#1A365D]" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Skin Architect</h2>
                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Morphological Scan</p>
                </div>
            </div>

            <div className="space-y-8">
                <canvas ref={canvasRef} className="hidden"></canvas>
                {!isCameraOpen && !preview && (
                    <div className="border-4 border-dashed border-white/60 dark:border-slate-800 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm space-y-6" onClick={() => fileInputRef.current?.click()}>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl text-pink-400">
                            <ImageIcon className="w-12 h-12" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase">Tap to Upload Photo</p>
                        </div>
                        <Button type="button" onClick={(e) => { e.stopPropagation(); setIsCameraOpen(true); }} className="rounded-full bg-pink-500 text-white font-black px-8 h-12 shadow-lg">
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
                            <button onClick={takePicture} className="h-20 w-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-md flex items-center justify-center active:scale-90 transition-transform">
                                <div className="h-14 w-14 rounded-full bg-pink-500 border-2 border-white"></div>
                            </button>
                        </div>
                    </div>
                )}

                {preview && (
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group">
                        <Image src={preview} alt="Preview" width={800} height={1000} className="w-full h-auto object-cover" />
                        {isAnalyzing && <ScanAnimationOverlay color="text-pink-500" />}
                        <Button variant="destructive" size="icon" className={cn("absolute top-6 right-6 rounded-full h-10 w-10 shadow-xl z-40", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                <form action={handleFormAction} className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500/80 px-2">Describe Symptoms</Label>
                        <Textarea name="userQuery" placeholder="E.g., Itchy red patches since 2 days..." className="rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[140px] text-lg font-bold p-6" />
                    </div>
                    <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-pink-500 to-rose-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> AI Scanning...</> : "Start Scientific Analysis"}
                    </Button>
                </form>
            </div>
            
            {state.result && (
                <div className="space-y-12 animate-in slide-in-from-top-6 duration-700">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    {state.result.overallAssessment && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2"><BrainCircuit className="w-5 h-5 text-pink-500" /><h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D]">AI Architect Verdict</h4></div>
                            <div className="p-8 rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white shadow-sm"><p className="text-base font-bold text-slate-700 leading-relaxed">{state.result.overallAssessment}</p></div>
                        </div>
                    )}
                    <div className="grid gap-6">
                        {state.result.identifiedConditions?.map((c: any, i: number) => (
                            <div key={i} className="p-8 rounded-[2.5rem] bg-white/80 shadow-sm space-y-4">
                                <h5 className="font-black text-xl text-[#1A365D]">{c.name}</h5>
                                <p className="text-sm font-bold text-slate-500 italic border-l-4 border-pink-100 pl-4">"{c.biologicalLogic}"</p>
                                <p className="text-sm font-medium text-slate-400">{c.description}</p>
                            </div>
                        ))}
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
        if (state.result && !state.error) updateScanStats();
    }, [state]);

    const handleFormAction = (formData: FormData) => {
        if (preview) formData.set('imageDataUri', preview);
        formData.set('language', lang);
        formAction(formData);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1 safe-top mt-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md shrink-0">
                    <ArrowLeft className="h-6 w-6 text-[#1A365D]" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Injury Specialist</h2>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Emergency Scan</p>
                </div>
            </div>

            <div className="space-y-8">
                 <form action={handleFormAction} className="space-y-8">
                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Accident Description</Label>
                        <Textarea name="userQuery" placeholder="E.g., Fell down stairs, deep cut on knee..." className="rounded-[2.5rem] bg-white/60 backdrop-blur-xl border-none shadow-inner min-h-[160px] text-lg font-bold p-8" required />
                    </div>
                    
                    {!preview ? (
                        <div className="border-4 border-dashed border-orange-100 rounded-[2.5rem] p-10 text-center space-y-4 bg-orange-50/20" onClick={() => fileInputRef.current?.click()}>
                            <div className="h-16 w-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-orange-400 mx-auto">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <p className="text-[10px] font-black text-orange-600/80 uppercase">Add Injury Photo (Optional)</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl">
                            <Image src={preview} alt="Injury" width={800} height={600} className="w-full h-auto object-cover" />
                            {isAnalyzing && <ScanAnimationOverlay color="text-orange-500" />}
                            <Button size="icon" variant="destructive" className={cn("absolute top-6 right-6 rounded-full h-10 w-10 z-40", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
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

                    <Button type="submit" disabled={isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-orange-500 to-red-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> Emergency AI Scan...</> : "Start Emergency Scan"}
                    </Button>
                </form>
            </div>

            {state.result && (
                <div className="space-y-12 animate-in slide-in-from-top-6 duration-700">
                    <div className="h-px bg-slate-200" />
                    {state.result.severity === 'high' && (
                        <Alert variant="destructive" className="rounded-[2.5rem] border-none bg-red-500 text-white p-8 animate-pulse shadow-2xl shadow-red-200">
                            <AlertTitle className="text-xl font-black uppercase">CRITICAL ALERT</AlertTitle>
                            <AlertDescription className="text-base font-bold leading-relaxed">{state.result.actionableAlert}</AlertDescription>
                        </Alert>
                    )}
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
        if (state.result && !state.error) updateScanStats();
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1 safe-top mt-4">
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md">
                    <ArrowLeft className="h-6 w-6 text-[#1A365D]" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Radiology AI</h2>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Structural Scan</p>
                </div>
            </div>

            <div className="space-y-8">
                <form action={handleFormAction} className="space-y-8">
                    {!preview ? (
                        <div className="border-4 border-dashed border-blue-100 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-blue-50/20 backdrop-blur-sm space-y-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-6 bg-white rounded-[2rem] shadow-xl text-blue-500">
                                <Bone className="w-12 h-12" />
                            </div>
                            <p className="text-sm font-black text-[#1A365D] uppercase">Upload X-Ray Plate</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                            <Image src={preview} alt="X-ray" width={800} height={1000} className="w-full h-auto object-cover" />
                            {isAnalyzing && <ScanAnimationOverlay color="text-blue-500" />}
                            <Button variant="destructive" size="icon" className={cn("absolute top-6 right-6 rounded-full h-10 w-10 z-40", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
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
                        <Textarea name="userQuery" placeholder="E.g., Severe pain in wrist after fall..." className="rounded-[2.5rem] bg-white/60 border-none shadow-inner min-h-[140px] text-lg font-bold p-8" />
                    </div>

                    <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> AI Radiology Scan...</> : "Start Radiographic Analysis"}
                    </Button>
                </form>
            </div>

            {state.result && (
                <div className="space-y-12 animate-in slide-in-from-top-6 duration-700">
                    <div className="h-px bg-slate-200" />
                    <div className="p-8 rounded-[2.5rem] bg-white/80 shadow-sm"><p className="text-base font-bold text-slate-700 italic border-l-4 border-blue-500 pl-4">"{state.result.observation}"</p></div>
                </div>
            )}
        </div>
    );
}

function LabReportAnalyzer({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeLabReportImageAction, initialLabReportState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (state.result && !state.error) updateScanStats();
    }, [state]);

    const handleFormAction = (formData: FormData) => {
        if (preview) {
            formData.set('imageDataUri', preview);
            formData.set('language', lang);
            formAction(formData);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1 safe-top mt-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md">
                    <ArrowLeft className="h-6 w-6 text-[#1A365D]" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Report Analyst</h2>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Deeper OCR Scan</p>
                </div>
            </div>

            <div className="space-y-8">
                <form action={handleFormAction} className="space-y-8">
                    {!preview ? (
                        <div className="border-4 border-dashed border-emerald-100 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-emerald-50/20 backdrop-blur-sm space-y-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-6 bg-white rounded-[2rem] shadow-xl text-emerald-500">
                                <FileText className="w-12 h-12" />
                            </div>
                            <p className="text-sm font-black text-[#1A365D] uppercase">Drop Lab Report Here</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white group">
                            <Image src={preview} alt="Report" width={800} height={1000} className="w-full h-auto object-cover" />
                            {isAnalyzing && <ScanAnimationOverlay color="text-emerald-500" />}
                            <Button variant="destructive" size="icon" className={cn("absolute top-6 right-6 rounded-full h-10 w-10 z-40", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
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
                        <Textarea name="userQuery" placeholder="E.g., Feeling extremely tired for 1 month..." className="rounded-[2.5rem] bg-white/60 border-none shadow-inner min-h-[140px] text-lg font-bold p-8" />
                    </div>

                    <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> AI Extracting Data...</> : "Start Clinical Interpretation"}
                    </Button>
                </form>
            </div>

            {state.result && (
                <div className="space-y-12 animate-in slide-in-from-top-6 duration-700">
                    <div className="h-px bg-slate-200" />
                    <div className="space-y-6">
                        <h4 className="text-xl font-black text-[#1A365D] tracking-tight leading-tight">{state.result.summary}</h4>
                    </div>
                </div>
            )}
        </div>
    );
}
