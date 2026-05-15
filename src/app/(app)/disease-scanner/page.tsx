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
  ChevronLeft,
  CheckCircle2,
  Stethoscope,
  ClipboardCheck,
  Zap,
  Lightbulb
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
import ReactMarkdown from 'react-markdown';

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

                    <div className="grid grid-cols-2 gap-5 px-1">
                        <ScannerCard title={t.skinTitle} slogan="Dermatology" icon={Scan} gradient="from-pink-50 to-pink-100/30" iconColor="text-pink-500" btnColor="bg-pink-500" onClick={() => setView('skin')} btnText={t.startBtn} />
                        <ScannerCard title={t.injuryTitle} slogan="Emergency" icon={Bandage} gradient="from-orange-50 to-orange-100/30" iconColor="text-orange-500" btnColor="bg-orange-500" onClick={() => setView('injury')} btnText={t.startBtn} />
                        <ScannerCard title={t.xrayTitle} slogan="Radiology" icon={Bone} gradient="from-blue-50 to-blue-100/30" iconColor="text-blue-500" btnColor="bg-blue-500" onClick={() => setView('xray')} btnText={t.startBtn} />
                        <ScannerCard title={t.reportTitle} slogan="OCR Lab" icon={FileText} gradient="from-emerald-50 to-emerald-100/30" iconColor="text-emerald-500" btnColor="bg-emerald-500" onClick={() => setView('lab')} btnText={t.startBtn} />
                    </div>

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

function ScanAnimationOverlay({ color }: { color: string }) {
    return (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            <div 
                className={cn("absolute left-0 right-0 h-1.5 shadow-[0_0_20px_2px_currentColor] animate-scan-line z-30", color)} 
                style={{ color: 'inherit' }}
            />
            <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] dark:opacity-[0.15]" />
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
                        <Button variant="destructive" size="icon" className={cn("absolute top-6 right-6 rounded-full h-10 w-10 z-40", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
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
            
            {state.error && (
                <Alert variant="destructive" className="rounded-[2rem] border-none bg-red-50 text-red-600 p-6 animate-in zoom-in-95">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-black uppercase text-xs tracking-widest">Scan Error</AlertTitle>
                    <AlertDescription className="text-sm font-bold">{state.error}</AlertDescription>
                </Alert>
            )}

            {state.result && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    {/* Overall Assessment */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <BrainCircuit className="w-5 h-5 text-pink-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Architect Verdict</h4>
                        </div>
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            <ReactMarkdown>{state.result.overallAssessment}</ReactMarkdown>
                        </div>
                    </div>

                    {/* Identified Conditions */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <Scan className="w-5 h-5 text-pink-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Morphological Data</h4>
                        </div>
                        <div className="grid gap-6">
                            {state.result.identifiedConditions?.map((c: any, i: number) => (
                                <div key={i} className="space-y-4 border-l-4 border-pink-100 dark:border-pink-900/30 pl-6 py-2">
                                    <div className="flex items-center justify-between">
                                        <h5 className="font-black text-xl text-[#1A365D] dark:text-slate-100">{c.name}</h5>
                                        <Badge className="bg-pink-50 text-pink-500 border-none font-black text-[9px] tracking-widest">CONF: {Math.round(c.confidence * 100)}%</Badge>
                                    </div>
                                    <p className="text-sm font-bold text-slate-500 italic">"{c.biologicalLogic}"</p>
                                    <p className="text-sm font-medium text-slate-400 leading-relaxed">{c.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Comparative Analysis */}
                    {state.result.comparativeAnalysis && (
                        <div className="space-y-4">
                             <div className="flex items-center gap-2 px-2">
                                <ClipboardCheck className="w-5 h-5 text-pink-500" />
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Comparative Linkage</h4>
                            </div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{state.result.comparativeAnalysis}</p>
                        </div>
                    )}

                    {/* Nutritional Support */}
                    {state.result.nutritionalSupport?.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <Utensils className="w-5 h-5 text-pink-500" />
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Nutritional Support</h4>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {state.result.nutritionalSupport.map((item: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/20 text-xs font-bold text-slate-600 dark:text-slate-400">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recommendations */}
                    {state.result.recommendations?.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <Sparkles className="w-5 h-5 text-pink-500" />
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Action Plan</h4>
                            </div>
                            <div className="space-y-3">
                                {state.result.recommendations.map((rec: any, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white/60 dark:bg-slate-800/60 rounded-[1.8rem] border border-white/20 shadow-sm items-start">
                                        <div className="h-8 w-8 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center shrink-0 mt-0.5">
                                            {rec.type === 'routine' ? <Activity className="w-4 h-4 text-pink-500" /> : rec.type === 'product' ? <ClipboardCheck className="w-4 h-4 text-pink-500" /> : <Settings className="w-4 h-4 text-pink-500" />}
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{rec.suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Alert className="rounded-[2.5rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-6 border-dashed border-2 border-blue-100">
                        <Info className="h-5 w-5 text-blue-500" />
                        <AlertDescription className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                            Disclaimer: This analysis is for educational purposes. AI can misread visual data. Consult a certified dermatologist for professional diagnosis.
                        </AlertDescription>
                    </Alert>
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
                        <Textarea name="userQuery" placeholder="E.g., Fell down stairs, deep cut on knee..." className="rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[160px] text-lg font-bold p-8" required />
                    </div>
                    
                    {!preview ? (
                        <div className="border-4 border-dashed border-orange-100 dark:border-orange-900/30 rounded-[2.5rem] p-10 text-center space-y-4 bg-orange-50/20" onClick={() => fileInputRef.current?.click()}>
                            <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-orange-400 mx-auto">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <p className="text-[10px] font-black text-orange-600/80 dark:text-orange-400 uppercase tracking-widest">Add Injury Photo (Optional)</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
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

            {state.error && (
                <Alert variant="destructive" className="rounded-[2rem] border-none bg-red-50 text-red-600 p-6 animate-in zoom-in-95">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-black uppercase text-xs tracking-widest">Scan Error</AlertTitle>
                    <AlertDescription className="text-sm font-bold">{state.error}</AlertDescription>
                </Alert>
            )}

            {state.result && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    {state.result.severity === 'high' && (
                        <Alert variant="destructive" className="rounded-[2.5rem] border-none bg-red-500 text-white p-8 animate-pulse shadow-2xl shadow-red-200">
                            <Siren className="h-10 w-10 mb-4" />
                            <AlertTitle className="text-2xl font-black uppercase tracking-tight">CRITICAL ALERT</AlertTitle>
                            <AlertDescription className="text-lg font-bold leading-relaxed">{state.result.actionableAlert || "High severity detected. Seek medical help."}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-8">
                         {/* Core Classification */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <Bandage className="w-5 h-5 text-orange-500" />
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Injury Classification</h4>
                            </div>
                            <div className="flex items-baseline gap-4">
                                <h3 className="text-3xl font-black text-[#1A365D] dark:text-slate-100">{state.result.classification}</h3>
                                <Badge className={cn("font-black uppercase tracking-widest text-[9px] border-none px-3 py-1", 
                                    state.result.severity === 'high' ? "bg-red-100 text-red-600" : state.result.severity === 'medium' ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600")}>
                                    SEVERITY: {state.result.severity}
                                </Badge>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            <ReactMarkdown>{state.result.summary}</ReactMarkdown>
                        </div>

                        {/* Biological Logic */}
                        <div className="space-y-3 p-6 bg-orange-50/30 dark:bg-orange-950/10 rounded-[2rem] border border-orange-100/50 dark:border-orange-900/30">
                            <div className="flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 text-orange-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">Biological Response Logic</span>
                            </div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed italic">"{state.result.biologicalLogic}"</p>
                        </div>

                        {/* First Aid Steps */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 px-2">
                                <ClipboardCheck className="w-5 h-5 text-orange-500" />
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Immediate First-Aid</h4>
                            </div>
                            <div className="grid gap-3">
                                {state.result.firstAidSteps?.map((step: string, i: number) => (
                                    <div key={i} className="flex gap-4 p-5 bg-white/60 dark:bg-slate-800/60 rounded-[2rem] border border-white/20 shadow-sm items-start">
                                        <div className="h-8 w-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0 font-black text-orange-500 text-xs">{i+1}</div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Alert className="rounded-[2.5rem] border-none bg-slate-100/50 dark:bg-slate-800/50 p-6 border-dashed border-2">
                        <Info className="h-5 w-5 text-slate-400" />
                        <AlertDescription className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            Disclaimer: This is an AI-generated guide for awareness. If bleeding is heavy or pain is extreme, go to the nearest emergency room immediately.
                        </AlertDescription>
                    </Alert>
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
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md border border-white/20">
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
                        <div className="border-4 border-dashed border-blue-100 dark:border-blue-900/30 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-blue-50/20 backdrop-blur-sm space-y-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl text-blue-500">
                                <Bone className="w-12 h-12" />
                            </div>
                            <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-widest">Upload X-Ray Plate</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
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
                        <Textarea name="userQuery" placeholder="E.g., Severe pain in wrist after fall..." className="rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[140px] text-lg font-bold p-8" />
                    </div>

                    <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> AI Radiology Scan...</> : "Start Radiographic Analysis"}
                    </Button>
                </form>
            </div>

            {state.error && (
                <Alert variant="destructive" className="rounded-[2rem] border-none bg-red-50 text-red-600 p-6 animate-in zoom-in-95">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-black uppercase text-xs tracking-widest">Scan Error</AlertTitle>
                    <AlertDescription className="text-sm font-bold">{state.error}</AlertDescription>
                </Alert>
            )}

            {state.result && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    <div className="space-y-8">
                        {/* Identifiers */}
                        <div className="flex items-center justify-between px-2">
                             <div className="space-y-1">
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Body Part</h4>
                                <h3 className="text-2xl font-black text-[#1A365D] dark:text-slate-100">{state.result.bodyPart}</h3>
                             </div>
                             <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100/50">
                                <Bone className="w-8 h-8 text-blue-500" />
                             </div>
                        </div>

                        {/* Observation */}
                        <div className="space-y-4">
                             <div className="flex items-center gap-2 px-2">
                                <Scan className="w-5 h-5 text-blue-500" />
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Clinical Observation</h4>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/40 shadow-sm">
                                <p className="text-lg font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic">"{state.result.observation}"</p>
                            </div>
                        </div>

                        {/* Reasoning */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <BrainCircuit className="w-5 h-5 text-blue-500" />
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Radiographic Logic</h4>
                            </div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed pl-2">{state.result.biologicalReasoning}</p>
                        </div>

                        {/* Actions */}
                        {state.result.suggestedActions?.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-2">
                                    <Lightbulb className="w-5 h-5 text-blue-500" />
                                    <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Immediate Care</h4>
                                </div>
                                <div className="grid gap-3">
                                    {state.result.suggestedActions.map((action: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{action}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Alert className="rounded-[2.5rem] border-none bg-blue-50 dark:bg-blue-900/10 p-6">
                        <Info className="h-5 w-5 text-blue-500" />
                        <AlertDescription className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                            Disclaimer: {state.result.disclaimer || "This is an AI-powered preliminary scan for awareness. AI can misinterpret shadows in X-rays. Consult a certified Radiologist for a final official diagnosis."}
                        </AlertDescription>
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
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md border border-white/20">
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
                        <div className="border-4 border-dashed border-emerald-100 dark:border-emerald-900/30 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-emerald-50/20 backdrop-blur-sm space-y-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl text-emerald-500">
                                <FileText className="w-12 h-12" />
                            </div>
                            <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-widest">Drop Lab Report Here</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group">
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
                        <Textarea name="userQuery" placeholder="E.g., Feeling extremely tired for 1 month..." className="rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[140px] text-lg font-bold p-8" />
                    </div>

                    <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> AI Extracting Data...</> : "Start Clinical Interpretation"}
                    </Button>
                </form>
            </div>

            {state.error && (
                <Alert variant="destructive" className="rounded-[2rem] border-none bg-red-50 text-red-600 p-6 animate-in zoom-in-95">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertTitle className="font-black uppercase text-xs tracking-widest">Scan Error</AlertTitle>
                    <AlertDescription className="text-sm font-bold">{state.error}</AlertDescription>
                </Alert>
            )}

            {state.result && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    <div className="space-y-10">
                        {/* Patient & Summary */}
                        <div className="space-y-6">
                            {state.result.patientDetails && (
                                <div className="flex flex-wrap gap-4 px-2">
                                    {state.result.patientDetails.name && <Badge variant="outline" className="rounded-full font-black text-[9px] uppercase tracking-wider px-3">PATIENT: {state.result.patientDetails.name}</Badge>}
                                    {state.result.patientDetails.age && <Badge variant="outline" className="rounded-full font-black text-[9px] uppercase tracking-wider px-3">AGE: {state.result.patientDetails.age}</Badge>}
                                    {state.result.patientDetails.date && <Badge variant="outline" className="rounded-full font-black text-[9px] uppercase tracking-wider px-3">DATE: {state.result.patientDetails.date}</Badge>}
                                </div>
                            )}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-2">
                                    <ClipboardCheck className="w-5 h-5 text-emerald-500" />
                                    <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Executive Summary</h4>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight leading-tight">{state.result.summary}</h3>
                            </div>
                        </div>

                        {/* Biomarkers Interpretation */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 px-2">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Biomarker Analysis</h4>
                            </div>
                            <div className="grid gap-3">
                                {state.result.interpretations?.map((item: any, i: number) => (
                                    <div key={i} className="p-5 bg-white/60 dark:bg-slate-800/60 rounded-[1.8rem] border border-white/20 shadow-sm flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest truncate">{item.test}</p>
                                            <p className="text-lg font-black text-[#1A365D] dark:text-slate-100">{item.value}</p>
                                            {item.range && <p className="text-[9px] font-bold text-slate-400 mt-0.5">RANGE: {item.range}</p>}
                                        </div>
                                        <Badge className={cn("font-black text-[9px] uppercase tracking-widest border-none px-3 py-1", 
                                            item.status === 'high' ? "bg-red-50 text-red-500" : item.status === 'low' ? "bg-orange-50 text-orange-500" : item.status === 'normal' ? "bg-emerald-50 text-emerald-500" : "bg-blue-50 text-blue-500")}>
                                            {item.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Biological Logic */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 px-2">
                                <BrainCircuit className="w-5 h-5 text-emerald-500" />
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Scientific Logic</h4>
                            </div>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed pl-2 border-l-4 border-emerald-100 dark:border-emerald-900/30 ml-2 py-1 italic">
                                {state.result.biologicalLogic}
                            </p>
                        </div>

                        {/* Lifestyle Suggestions */}
                        {state.result.lifestyleSuggestions?.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-2">
                                    <Zap className="w-5 h-5 text-emerald-500" />
                                    <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Lifestyle Adjustments</h4>
                                </div>
                                <div className="space-y-3">
                                    {state.result.lifestyleSuggestions.map((tip: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Alert className="rounded-[2.5rem] border-none bg-blue-50 dark:bg-blue-900/10 p-6">
                        <Info className="h-5 w-5 text-blue-500" />
                        <AlertDescription className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                            Disclaimer: {state.result.recommendation || "This is an AI-generated interpretation for awareness. AI can occasionally misread laboratory values. Please consult a qualified Physician for a formal diagnosis."}
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
}
