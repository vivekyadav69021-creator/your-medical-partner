'use client';

import React, { useActionState, useRef, useState, useEffect, startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Camera, 
  Loader2, 
  X, 
  ArrowLeft,
  CheckCircle2,
  Utensils,
  ImageIcon,
  Barcode,
  FileText,
  Activity,
  Sparkles,
  ShieldAlert,
  ChevronLeft,
  Apple,
  Filter,
  History,
  Lightbulb,
  Ban,
  Clock,
  AlertTriangle,
  Zap,
  Info,
  ShieldCheck
} from 'lucide-react';
import { analyzeFoodAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/context/user-profile-context';
import { formatDistanceToNow } from 'date-fns';

const compressFoodImage = (dataUri: string, maxWidth = 1024, quality = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new (window as any).Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(dataUri); return; }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => reject(new Error("Image processing failed"));
        img.src = dataUri;
    });
};

const initialAnalysisState = { result: null, error: null, timestamp: 0 };

type ViewMode = 'home' | 'meal' | 'barcode' | 'ocr';

function ScanAnimationOverlay({ color }: { color: string }) {
    return (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-[inherit]">
            <div className={cn("absolute inset-0 opacity-[0.2] animate-pulse", color.replace('text-', 'bg-'))} />
            <div 
                className={cn("absolute left-0 right-0 h-1.5 animate-scan-line z-[60] opacity-100", color)} 
                style={{ backgroundColor: 'currentColor', boxShadow: '0 0 30px 6px currentColor' }}
            />
            {/* Minimal Corner Accents instead of central box */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white opacity-40" />
            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white opacity-40" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white opacity-40" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white opacity-40" />
        </div>
    );
}

function MacroMini({ label, val, color }: any) {
    return (
        <div className="text-center">
            <p className="text-sm font-black text-[#1A365D] dark:text-white">{String(val)}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1 flex items-center justify-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", color)} /> {label}
            </p>
        </div>
    );
}

export default function FoodScannerPage() {
  const [view, setView] = useState<ViewMode>('home');
  const { userName } = useUserProfile();
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [state, formAction, isAnalyzing] = useActionState(analyzeFoodAction, initialAnalysisState);
  
  const [preview, setPreview] = useState<string | null>(null);
  const [textLabel, setTextLabel] = useState('');
  const [scanStats, setScanStats] = useState({ count: 0, lastScan: null as number | null });

  const [healthMirror, setHealthMirror] = useState('');
  const [mainGoal, setMainGoal] = useState('General Health');
  const [workout, setWorkout] = useState('Moderate');

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const lastProcessedRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('food_scanner_stats');
    if (saved) setScanStats(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (state?.result && !state?.error && state?.timestamp > lastProcessedRef.current) {
      lastProcessedRef.current = state.timestamp;
      const newStats = { count: scanStats.count + 1, lastScan: Date.now() };
      setScanStats(newStats);
      localStorage.setItem('food_scanner_stats', JSON.stringify(newStats));
      toast({ title: lang === 'en' ? "Product Identified" : "प्रोडक्ट की पहचान हो गई" });
    }
    if (state?.error && state?.timestamp > lastProcessedRef.current) {
      lastProcessedRef.current = state.timestamp;
      toast({ variant: 'destructive', title: "Scan Failed", description: state.error });
    }
  }, [state, lang, toast, scanStats.count]);

  const handleModeSwitch = (newView: ViewMode) => {
    setView(newView);
    setPreview(null);
    setTextLabel('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview && !textLabel) return;

    const formData = new FormData();
    if (preview) {
        const optimizedImage = await compressFoodImage(preview, 1024, 0.7);
        formData.set('imageDataUri', optimizedImage);
    }
    formData.set('textQuery', textLabel || `Scan initiated in ${view} mode`);
    formData.set('language', lang);
    formData.set('scanType', view === 'meal' ? 'standard' : view);
    formData.set('healthMirrorProfile', healthMirror);
    formData.set('mainGoal', mainGoal);
    formData.set('workoutRegimen', workout);
    
    startTransition(() => { formAction(formData); });
  };

  const t = {
    en: {
        greeting: `Hi ${userName.split(' ')[0]}`,
        statsTitle: "Nutrition Activity",
        lastScan: "Last Analysis",
        scans: "Total Scans",
        status: "Engine Status",
        mealTitle: "Meal Analysis",
        barcodeTitle: "Barcode Vision",
        ocrTitle: "Label Specialist",
        startBtn: "Identify Product",
        noScans: "Ready for scan",
        filterTitle: "Health Mirror (Filters)",
        medProfile: "Medical / Allergy",
        fitnessGoal: "Fitness Goal",
        workout: "Workout Intensity",
        logicTitle: "Scientific Logic",
        substitutionTitle: "Better Alternatives",
        expiryTitle: "Expiry Intelligence",
        ingredientTitle: "Ingredient Watch",
        safetyVerified: "Safety Verified"
    },
    hi: {
        greeting: `नमस्ते ${userName.split(' ')[0]}`,
        statsTitle: "पोषण गतिविधि",
        lastScan: "पिछला विश्लेषण",
        scans: "कुल स्कैन",
        status: "इंजन स्थिति",
        mealTitle: "भोजन विश्लेषण",
        barcodeTitle: "बारकोड विजन",
        ocrTitle: "लेबल विशेषज्ञ",
        startBtn: "प्रोडक्ट पहचानें",
        noScans: "तैयार है",
        filterTitle: "हेल्थ मिरर (फिल्टर)",
        medProfile: "पुरानी बीमारी",
        fitnessGoal: "फिटनेस का लक्ष्य",
        workout: "व्यायाम तीव्रता",
        logicTitle: "सरल व्याख्या",
        substitutionTitle: "बेहतर विकल्प",
        expiryTitle: "एक्सपायरी रिपोर्ट",
        ingredientTitle: "सामग्री विश्लेषण",
        safetyVerified: "सुरक्षा सत्यापित"
    }
  }[lang];

  if (view === 'home') {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-32 pt-4 px-1">
            <div className="flex items-center justify-between p-6 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-sm mx-1">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 bg-white/50 shadow-sm shrink-0">
                            <ChevronLeft className="h-6 w-6 text-[#1A365D]" />
                        </Button>
                    </Link>
                    <div className="space-y-0.5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-pink-50/80 rounded-full border border-pink-100/50 mb-0.5">
                            <Utensils className="w-2.5 h-2.5 text-pink-500" />
                            <span className="text-[8px] font-black text-pink-600 uppercase tracking-[0.2em]">Nutri-Lens AI</span>
                        </div>
                        <h1 className="text-xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight truncate">{t.greeting} 👋</h1>
                    </div>
                </div>
            </div>

            <div className="rounded-[2.5rem] border-none shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 p-8">
                <div className="pb-4 flex items-center gap-2">
                    <History className="w-4 h-4 text-primary" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500/80">{t.statsTitle}</h4>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase">{t.lastScan}</p>
                        <p className="text-xs font-black text-[#2D3A5D] dark:text-slate-200">
                            {scanStats.lastScan ? formatDistanceToNow(scanStats.lastScan, { addSuffix: true }) : t.noScans}
                        </p>
                    </div>
                    <div className="space-y-1 border-x border-slate-100/50 px-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase">{t.scans}</p>
                        <p className="text-sm font-black text-primary">{scanStats.count}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase">{t.status}</p>
                        <Badge className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase">Active</Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5 px-1">
                <ScannerCard title={t.mealTitle} icon={Utensils} gradient="from-blue-50 to-blue-100/30" iconColor="text-blue-500" onClick={() => handleModeSwitch('meal')} />
                <ScannerCard title={t.barcodeTitle} icon={Barcode} gradient="from-pink-50 to-pink-100/30" iconColor="text-pink-500" onClick={() => handleModeSwitch('barcode')} />
                <ScannerCard title={t.ocrTitle} icon={FileText} gradient="from-emerald-50 to-emerald-100/30" iconColor="text-emerald-500" onClick={() => handleModeSwitch('ocr')} />
                <div className="bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-center opacity-40">
                    <Sparkles className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Coming Soon</p>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-lg rounded-full p-1.5 border border-white/40 flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setLang('en')} className={cn("rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-widest transition-all", lang === 'en' ? "bg-primary text-white shadow-md" : "text-slate-400")}>EN</Button>
                    <Button variant="ghost" size="sm" onClick={() => setLang('hi')} className={cn("rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-widest transition-all", lang === 'hi' ? "bg-primary text-white shadow-md" : "text-slate-400")}>HI</Button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-32 px-1 pt-4">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => handleModeSwitch('home')} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md shrink-0">
                <ArrowLeft className="h-6 w-6 text-[#1A365D]" />
            </Button>
            <div>
                <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight uppercase leading-none">{view === 'meal' ? t.mealTitle : view === 'barcode' ? t.barcodeTitle : t.ocrTitle}</h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Precision Scanning Hub</p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="p-6 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#1A365D]">{t.filterTitle}</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.medProfile}</Label>
                        <Input value={healthMirror} onChange={(e) => setHealthMirror(e.target.value)} placeholder="e.g. Diabetes, Peanut Allergy" className="h-12 rounded-2xl bg-white/50 border-none shadow-inner font-bold" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.fitnessGoal}</Label>
                            <Input value={mainGoal} onChange={(e) => setMainGoal(e.target.value)} placeholder="Weight Loss" className="h-12 rounded-2xl bg-white/50 border-none shadow-inner font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.workout}</Label>
                            <Input value={workout} onChange={(e) => setWorkout(e.target.value)} placeholder="Moderate" className="h-12 rounded-2xl bg-white/50 border-none shadow-inner font-bold" />
                        </div>
                    </div>
                </div>
            </div>

            {!preview ? (
                <div className="grid grid-cols-2 gap-4 h-64">
                     <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center justify-center gap-4 bg-white/40 dark:bg-slate-900/40 rounded-[3rem] border-4 border-dashed border-primary/40 active:scale-95 transition-all group">
                        <div className="h-16 w-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform">
                            <Camera className="w-8 h-8" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Camera</span>
                        <input type="file" ref={cameraInputRef} hidden onChange={handleFileChange} accept="image/*" capture="environment" />
                     </button>
                     <button type="button" onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center justify-center gap-4 bg-white/40 dark:bg-slate-900/40 rounded-[3rem] border-4 border-dashed border-slate-200 active:scale-95 transition-all group">
                        <div className="h-16 w-16 bg-slate-700 rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:-rotate-6 transition-transform">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Photo Gallery</span>
                        <input type="file" ref={galleryInputRef} hidden onChange={handleFileChange} accept="image/*" />
                     </button>
                </div>
            ) : (
                <div className={cn(
                    "relative rounded-[3rem] overflow-hidden shadow-2xl border-4 transition-all duration-700 bg-black/5 max-h-[400px] flex items-center justify-center",
                    isAnalyzing ? "ring-8 ring-primary/20" : "border-white dark:border-slate-800"
                )}>
                    <Image src={preview} alt="Input" width={600} height={800} className="w-full h-auto object-contain max-h-[400px]" />
                    {isAnalyzing && <ScanAnimationOverlay color="text-primary" />}
                    {!isAnalyzing && (
                        <Button variant="destructive" size="icon" className="absolute top-6 right-6 rounded-full h-10 w-10 z-[70]" onClick={() => setPreview(null)}>
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            )}

            <form onSubmit={onFormSubmit} className="space-y-6">
                {view === 'meal' && (
                    <div className="space-y-2">
                         <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500/80 px-2">Meal or Product Name</Label>
                         <Input value={textLabel} onChange={(e) => setTextLabel(e.target.value)} placeholder="e.g. Oats, Dal Tadka" className="h-14 rounded-2xl bg-white border-none shadow-xl px-6 font-bold" />
                    </div>
                )}
                <Button type="submit" disabled={isAnalyzing || (!preview && !textLabel)} className="w-full h-16 rounded-full bg-primary text-white font-black uppercase text-[11px] tracking-[0.25em] shadow-2xl active:scale-95 transition-all">
                    {isAnalyzing ? <><Loader2 className="h-5 w-5 animate-spin mr-3" /> Analyzing Nutrition...</> : t.startBtn}
                </Button>
            </form>
        </div>

        {state?.result && (
            <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700 mt-12 pb-20">
                <div className="h-px bg-slate-200" />
                
                <section className="flex flex-col items-center text-center gap-4">
                    <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/10 shadow-inner">
                        <Activity className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{state.result.brand || 'Identified Product'}</p>
                        <h2 className="text-3xl font-black text-[#1A365D] dark:text-white leading-tight uppercase tracking-tight">{String(state.result.name)}</h2>
                        <div className={cn(
                            "inline-flex items-center gap-2 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-md border",
                            (state.result.medicalAlertEn || state.result.medicalAlertHi) ? "bg-rose-50 border-rose-100 text-rose-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                        )}>
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {lang === 'en' ? String(state.result.compatibilityTagEn) : String(state.result.compatibilityTagHi)}
                        </div>
                    </div>
                </section>

                {state.result.expiryDate && (
                    <Card className={cn(
                        "rounded-[2.5rem] border-none p-8 flex items-center justify-between shadow-xl relative overflow-hidden",
                        state.result.expiryStatus === 'Safe' ? "bg-emerald-50/50" : state.result.expiryStatus === 'Expired' ? "bg-rose-50/50" : "bg-amber-50/50"
                    )}>
                        <div className="flex items-center gap-5 relative z-10">
                            <div className={cn(
                                "h-14 w-14 rounded-3xl flex items-center justify-center shadow-inner",
                                state.result.expiryStatus === 'Safe' ? "bg-emerald-100 text-emerald-600" : state.result.expiryStatus === 'Expired' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                            )}>
                                {state.result.expiryStatus === 'Safe' ? <CheckCircle2 className="w-7 h-7" /> : state.result.expiryStatus === 'Expired' ? <AlertTriangle className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.expiryTitle}</h4>
                                <p className="text-xl font-black text-[#1A365D] dark:text-white uppercase">{state.result.expiryDate}</p>
                            </div>
                        </div>
                        <Badge className={cn(
                            "rounded-xl px-5 py-2 text-[10px] font-black uppercase tracking-widest border-none",
                            state.result.expiryStatus === 'Safe' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : state.result.expiryStatus === 'Expired' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                        )}>
                            {state.result.expiryStatus}
                        </Badge>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-20 w-20 bg-primary/5 rounded-bl-full" />
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner"><Zap className="h-8 w-8" /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Energy Profile</p>
                            <p className="text-3xl font-black text-[#1A365D] dark:text-white leading-none">{String(state.result.calories)}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase mt-2">Per {String(state.result.portion)}</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-around p-8 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl">
                        <MacroMini label="Carbs" val={state.result.carbs} color="bg-amber-400" />
                        <MacroMini label="Protein" val={state.result.protein} color="bg-emerald-400" />
                        <MacroMini label="Fats" val={state.result.fats} color="bg-rose-400" />
                    </div>
                </div>

                {/* Advanced Ingredient Analysis Section */}
                <div className="space-y-6 px-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            <h4 className="font-black text-sm uppercase tracking-widest text-[#1A365D] dark:text-slate-100">{t.ingredientTitle}</h4>
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black uppercase text-emerald-600 border-emerald-100">{t.safetyVerified}</Badge>
                    </div>
                    <div className="grid gap-3">
                        {(state.result.ingredientSafety || []).map((ing: any, i: number) => (
                            <div key={i} className="flex gap-4 p-5 bg-white dark:bg-slate-900 rounded-[1.8rem] border border-slate-100 dark:border-slate-800 shadow-sm group">
                                <div className={cn(
                                    "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-110",
                                    ing.status === 'Safe' ? "bg-emerald-50 text-emerald-500" : ing.status === 'Caution' ? "bg-amber-50 text-amber-500" : "bg-rose-50 text-rose-500"
                                )}>
                                    <Info className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-black uppercase text-[#1A365D] dark:text-white">{ing.item}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 leading-tight">{ing.reason}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {(lang === 'en' ? state.result.medicalAlertEn : state.result.medicalAlertHi) && (
                    <div className="p-10 rounded-[3.5rem] bg-rose-500 text-white animate-pulse shadow-[0_20px_50px_rgba(244,63,94,0.3)] flex flex-col items-center text-center gap-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-white/10 rounded-bl-full translate-x-10 -translate-y-10" />
                        <ShieldAlert className="h-14 w-14 drop-shadow-xl" />
                        <h3 className="text-2xl font-black uppercase tracking-widest">Medical Advisory</h3>
                        <p className="text-base font-bold leading-relaxed">{lang === 'en' ? String(state.result.medicalAlertEn) : String(state.result.medicalAlertHi)}</p>
                    </div>
                )}

                <div className="space-y-4 px-1">
                    <div className="flex items-center gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        <h4 className="font-black text-sm uppercase tracking-widest text-[#1A365D] dark:text-slate-100">{t.logicTitle}</h4>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-100 dark:border-blue-900/30 italic text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed shadow-inner">
                        "{lang === 'en' ? String(state.result.logicEn) : String(state.result.logicHi)}"
                    </div>
                </div>

                <div className="space-y-4 px-1">
                    <h4 className="font-black text-sm uppercase tracking-widest text-[#1A365D] dark:text-slate-100">{t.substitutionTitle}</h4>
                    <div className="grid gap-3">
                        {(lang === 'en' ? (state.result.substitutionsEn || []) : (state.result.substitutionsHi || [])).map((sub: string, i: number) => (
                            <div key={i} className="flex items-center gap-5 p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg hover:border-primary/30 transition-all active:scale-[0.98]">
                                <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shadow-inner"><CheckCircle2 className="h-5 w-5" /></div>
                                <p className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{String(sub)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <Alert className="rounded-[3rem] border-none bg-slate-900 text-white p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-32 w-32 bg-white/5 rounded-bl-full" />
                    <div className="flex flex-col items-center gap-6 text-center relative z-10">
                        <ShieldAlert className="h-10 w-10 text-primary" />
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] leading-relaxed max-w-sm">
                            Disclaimer: Our AI Engine uses global food databases. Real-time ingredient compositions may vary. Always verify with packaging for life-threatening allergies.
                        </p>
                    </div>
                </Alert>
            </div>
        )}
    </div>
  );
}

function ScannerCard({ title, icon: Icon, gradient, iconColor, onClick }: any) {
    return (
        <div className={cn("rounded-[3.2rem] border-none shadow-xl group hover:scale-[1.03] active:scale-95 transition-all duration-500 cursor-pointer bg-gradient-to-br relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-md", gradient)} onClick={onClick}>
            <div className="p-8 flex flex-col items-center gap-6 text-center relative z-10">
                <div className="w-18 h-18 rounded-[2rem] bg-white/90 dark:bg-slate-900 shadow-lg flex items-center justify-center transition-transform duration-700 group-hover:rotate-12">
                   <Icon className={cn("w-10 h-10", iconColor)} />
                </div>
                <div className="space-y-1.5 w-full">
                    <h3 className="text-[13px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tighter leading-none">{title}</h3>
                    <div className={cn("w-full rounded-2xl py-2.5 mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl bg-primary")}>Launch</div>
                </div>
            </div>
            <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-1000" />
        </div>
    );
}
