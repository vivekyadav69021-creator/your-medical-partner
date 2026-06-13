
'use client';

import React, { useActionState, useRef, useState, useEffect, startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Loader2, 
  X, 
  ArrowLeft,
  CheckCircle2,
  Utensils,
  AlertCircle,
  Zap,
  UserCheck,
  ChevronDown,
  Image as ImageIcon,
  Search,
  Ban,
  Barcode,
  FileText,
  Activity,
  Milk,
  Sparkles,
  ShieldAlert,
  RotateCcw,
  ChevronLeft,
  HeartPulse,
  Pill,
  Scan,
  LayoutGrid
} from 'lucide-react';
import { analyzeFoodAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/context/user-profile-context';
import { formatDistanceToNow } from 'date-fns';

const initialAnalysisState = { result: null, error: null, timestamp: 0 };

type ViewMode = 'home' | 'meal' | 'barcode' | 'ocr';

function ScanAnimationOverlay({ color }: { color: string }) {
    return (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-[inherit]">
            <div className={cn("absolute inset-0 opacity-[0.08] animate-pulse", color.replace('text-', 'bg-'))} />
            <div 
                className={cn("absolute left-0 right-0 h-0.5 animate-scan-line z-[60] opacity-50", color)} 
                style={{ 
                    backgroundColor: 'currentColor',
                    boxShadow: '0 0 12px 1px currentColor' 
                }}
            />
            <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-white/40 rounded-tl-sm" />
            <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-white/40 rounded-tr-sm" />
            <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-white/40 rounded-bl-sm" />
            <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-white/40 rounded-br-sm" />
        </div>
    );
}

function MacroMini({ label, val, color }: any) {
    return (
        <div className="text-center">
            <p className="text-sm font-black text-[#1A365D] dark:text-white">{val}</p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1 flex items-center justify-center gap-1">
                <span className={cn("h-1.5 w-1.5 rounded-full", color)} /> {label}
            </p>
        </div>
    );
}

function MicroItem({ label, val, icon: Icon }: any) {
    return (
        <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md flex items-center justify-center text-slate-400 shrink-0">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
                <p className="text-base font-black text-[#1A365D] dark:text-slate-100">{val}</p>
            </div>
        </div>
    );
}

export default function FoodScannerPage() {
  const [view, setView] = useState<ViewMode>('home');
  const { userName, userImage } = useUserProfile();
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [state, formAction, isAnalyzing] = useActionState(analyzeFoodAction, initialAnalysisState);
  
  // Isolated Local Result State to ensure data doesn't leak between views
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [textLabel, setTextLabel] = useState('');
  
  const [healthMirror, setHealthMirror] = useState('');
  const [mainGoal, setMainGoal] = useState('Maintain Health');
  const [workout, setWorkout] = useState('Sedentary');
  const [protocol, setProtocol] = useState('Clean Eating');
  const [showSettings, setShowSettings] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Sync AI response to local result only for the current view
  useEffect(() => {
    if (state?.result && !state?.error && state?.timestamp > 0) {
      setCurrentResult(state.result);
      toast({ title: lang === 'en' ? "Analysis Complete" : "विश्लेषण पूरा हुआ" });
    }
    if (state?.error) {
      toast({ variant: 'destructive', title: lang === 'en' ? "Scan Failed" : "स्कैन विफल", description: state.error });
    }
  }, [state, lang, toast]);

  const resetAll = () => {
    setPreview(null);
    setTextLabel('');
    setCurrentResult(null);
    setShowSettings(false);
  };

  const handleModeSwitch = (newView: ViewMode) => {
    setView(newView);
    resetAll(); // Pure isolation: Clear everything when switching modes
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (view === 'meal' && !textLabel.trim() && !preview) {
        toast({ variant: 'destructive', title: lang === 'en' ? "Input Required" : "विवरण आवश्यक है", description: lang === 'en' ? "Please provide a name or a photo." : "कृपया नाम या फोटो प्रदान करें।" });
        return;
    }
    
    if (view !== 'meal' && !preview) {
        toast({ variant: 'destructive', title: lang === 'en' ? "Photo Required" : "फोटो आवश्यक है" });
        return;
    }

    const formData = new FormData();
    if (preview) formData.set('imageDataUri', preview);
    formData.set('textQuery', textLabel || `Nutri ${view} scan`);
    formData.set('language', lang);
    formData.set('scanType', view === 'meal' ? 'standard' : view);
    formData.set('healthMirrorProfile', healthMirror);
    formData.set('mainGoal', mainGoal);
    formData.set('workoutRegimen', workout);
    formData.set('dietaryProtocol', protocol);
    
    startTransition(() => { formAction(formData); });
  };

  const t = {
    en: {
        greeting: `Hi ${userName.split(' ')[0]}`,
        statsTitle: "Nutrition Activity",
        lastScan: "Last Analysis",
        scans: "Total Meals",
        status: "Engine Status",
        mealTitle: "Meal Analysis",
        barcodeTitle: "Barcode Vision",
        ocrTitle: "Label Specialist",
        mealSlogan: "Identify & Quantify",
        barcodeSlogan: "Packet Scanning",
        ocrSlogan: "Ingredient OCR",
        startBtn: "Analyze Now",
        noScans: "Ready for scan"
    },
    hi: {
        greeting: `नमस्ते ${userName.split(' ')[0]}`,
        statsTitle: "पोषण गतिविधि",
        lastScan: "पिछला विश्लेषण",
        scans: "कुल भोजन",
        status: "इंजन स्थिति",
        mealTitle: "भोजन विश्लेषण",
        barcodeTitle: "बारकोड विजन",
        ocrTitle: "लेबल विशेषज्ञ",
        mealSlogan: "पहचान और मात्रा",
        barcodeSlogan: "पैकेट स्कैनिंग",
        ocrSlogan: "सामग्री OCR",
        startBtn: "अभी विश्लेषण करें",
        noScans: "स्कैन के लिए तैयार"
    }
  }[lang];

  const renderContent = () => {
    if (view === 'home') {
        return (
            <div className="space-y-8 animate-in fade-in duration-700 pb-32">
                <div className="flex items-center justify-between p-6 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-sm mx-1 safe-top">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 bg-white/50 shadow-sm border border-white/20 shrink-0">
                                <ChevronLeft className="h-6 w-6 text-[#1A365D]" />
                            </Button>
                        </Link>
                        <div className="space-y-0.5 min-w-0">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-pink-50/80 dark:bg-pink-900/20 rounded-full border border-pink-100/50 mb-0.5">
                                <Utensils className="w-2.5 h-2.5 text-pink-500" />
                                <span className="text-[8px] font-black text-pink-600 uppercase tracking-[0.2em]">Nutri-Scan Pro</span>
                            </div>
                            <h1 className="text-xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight truncate">{t.greeting} 👋</h1>
                        </div>
                    </div>
                    <Link href="/profile" className="shrink-0 ml-4">
                        <div className="h-12 w-12 rounded-full border-4 border-white shadow-lg overflow-hidden shrink-0">
                            <img src={userImage} alt={userName} className="h-full w-full object-cover" />
                        </div>
                    </Link>
                </div>

                <div className="rounded-[2.5rem] border-none shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 overflow-hidden mx-1 p-8">
                    <div className="pb-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500/80 flex items-center gap-2">
                            <Activity className="w-3.5 h-3.5 text-primary" />
                            {t.statsTitle}
                        </h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.lastScan}</p>
                            <p className="text-xs font-black text-[#2D3A5D] dark:text-slate-200 truncate">{t.noScans}</p>
                        </div>
                        <div className="space-y-1 border-x border-slate-100/50 dark:border-slate-800/50 px-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.scans}</p>
                            <p className="text-sm font-black text-primary">0</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.status}</p>
                            <div className="flex justify-center">
                                <Badge className="bg-emerald-50 text-emerald-600 text-[9px] font-black border-none px-2.5 py-0.5 rounded-full">ACTIVE</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5 px-1">
                    <ScannerGridCard title={t.mealTitle} slogan={t.mealSlogan} icon={Utensils} gradient="from-blue-50 to-blue-100/30" iconColor="text-blue-500" btnColor="bg-blue-500" onClick={() => handleModeSwitch('meal')} btnText={t.startBtn} />
                    <ScannerGridCard title={t.barcodeTitle} slogan={t.barcodeSlogan} icon={Barcode} gradient="from-pink-50 to-pink-100/30" iconColor="text-pink-500" btnColor="bg-pink-500" onClick={() => handleModeSwitch('barcode')} btnText={t.startBtn} />
                    <ScannerGridCard title={t.ocrTitle} slogan={t.ocrSlogan} icon={FileText} gradient="from-emerald-50 to-emerald-100/30" iconColor="text-emerald-500" btnColor="bg-emerald-500" onClick={() => handleModeSwitch('ocr')} btnText={t.startBtn} />
                </div>

                <div className="flex justify-center pt-4">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-lg rounded-full p-1.5 border border-white/40 dark:border-slate-800 flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setLang('en')} className={cn("rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-widest transition-all", lang === 'en' ? "bg-primary text-white shadow-md" : "text-slate-400")}>EN</Button>
                        <Button variant="ghost" size="sm" onClick={() => setLang('hi')} className={cn("rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-widest transition-all", lang === 'hi' ? "bg-primary text-white shadow-md" : "text-slate-400")}>हिन्दी</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-32 px-1 safe-top">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => handleModeSwitch('home')} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md shrink-0 text-foreground">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">
                        {view === 'meal' ? t.mealTitle : view === 'barcode' ? t.barcodeTitle : t.ocrTitle}
                    </h2>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{view === 'meal' ? t.mealSlogan : view === 'barcode' ? t.barcodeSlogan : t.ocrSlogan}</p>
                </div>
                {(currentResult || preview || textLabel) && (
                     <Button variant="ghost" size="icon" onClick={resetAll} className="ml-auto rounded-full h-10 w-10 bg-white/40 shadow-sm border border-white/20">
                        <RotateCcw className="h-5 w-5 text-primary" />
                    </Button>
                )}
            </div>

            {/* Sub-mode Navigation (Horizontal Row) */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 px-1 scrollbar-hide">
                <button onClick={() => handleModeSwitch('meal')} className={cn("px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap", view === 'meal' ? "bg-primary text-white shadow-lg" : "bg-white/40 text-slate-500 border border-white/20")}>Meal Scan</button>
                <button onClick={() => handleModeSwitch('barcode')} className={cn("px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap", view === 'barcode' ? "bg-pink-500 text-white shadow-lg" : "bg-white/40 text-slate-500 border border-white/20")}>Barcode</button>
                <button onClick={() => handleModeSwitch('ocr')} className={cn("px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap", view === 'ocr' ? "bg-emerald-500 text-white shadow-lg" : "bg-white/40 text-slate-500 border border-white/20")}>Label OCR</button>
            </div>

            <div className="space-y-6">
                {!preview ? (
                    <div className="border-4 border-dashed border-white/60 dark:border-slate-800 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm space-y-6 cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                        <div className={cn("p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl group-hover:scale-110 transition-transform", view === 'meal' ? "text-blue-400" : view === 'barcode' ? "text-pink-400" : "text-emerald-400")}>
                            {view === 'barcode' ? <Barcode className="w-12 h-12" /> : view === 'ocr' ? <FileText className="w-12 h-12" /> : <Camera className="w-12 h-12" />}
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase">Tap to Capture or Pick Photo</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Camera & Gallery supported</p>
                        </div>
                        <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                    </div>
                ) : (
                    <div className={cn(
                        "relative rounded-[3rem] overflow-hidden shadow-2xl border-4 transition-all duration-700 bg-black/5 max-h-[400px] flex items-center justify-center",
                        isAnalyzing ? "ring-8 ring-primary/20" : "border-white dark:border-slate-800"
                    )}>
                        <Image src={preview} alt="Input" width={600} height={800} className="w-full h-auto object-contain max-h-[400px]" />
                        {isAnalyzing && <ScanAnimationOverlay color={view === 'meal' ? "text-blue-500" : view === 'barcode' ? "text-pink-500" : "text-emerald-500"} />}
                        <Button variant="destructive" size="icon" className={cn("absolute top-6 right-6 rounded-full h-10 w-10 z-[70]", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                <form onSubmit={onFormSubmit} className="space-y-6">
                    {view === 'meal' && (
                        <div className="space-y-3 animate-in slide-in-from-top-2">
                             <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500/80 px-2">Identify Your Meal (Or Search Directly)</Label>
                             <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                <Input 
                                    value={textLabel} 
                                    onChange={(e) => setTextLabel(e.target.value)} 
                                    placeholder="E.g., Paneer Butter Masala" 
                                    className="rounded-[2rem] h-16 pl-16 pr-8 bg-white/80 dark:bg-slate-900/80 border border-white/40 shadow-xl text-base font-bold placeholder:text-slate-300 transition-all focus-visible:ring-primary/10" 
                                />
                             </div>
                        </div>
                    )}

                    <button type="button" onClick={() => setShowSettings(!showSettings)} className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary"><UserCheck className="h-5 w-5" /></div>
                            <div className="text-left">
                                <h3 className="text-[11px] font-black text-[#1A365D] dark:text-white uppercase tracking-wider">Health Profile</h3>
                                <p className="text-[8px] font-bold text-slate-400 uppercase">Personalize Analysis</p>
                            </div>
                        </div>
                        <ChevronDown className={cn("h-4 w-4 text-slate-300 transition-transform", showSettings && "rotate-180")} />
                    </button>

                    {showSettings && (
                        <div className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 shadow-inner space-y-4 animate-in fade-in">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Conditions/Allergies</Label>
                                <Textarea value={healthMirror} onChange={e => setHealthMirror(e.target.value)} placeholder="E.g., Diabetes, Nut Allergy" className="rounded-xl bg-white/80 dark:bg-slate-800/80 border-none font-bold text-sm min-h-[80px]" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Select value={mainGoal} onValueChange={setMainGoal}>
                                    <SelectTrigger className="rounded-xl h-11 bg-white border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="Weight Loss">Weight Loss</SelectItem><SelectItem value="Muscle Gain">Muscle Gain</SelectItem><SelectItem value="Health Maintenance">Maintenance</SelectItem></SelectContent>
                                </Select>
                                <Select value={workout} onValueChange={setWorkout}>
                                    <SelectTrigger className="rounded-xl h-11 bg-white border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent><SelectItem value="Heavy Lifting">Heavy Lifting</SelectItem><SelectItem value="Sedentary">Sedentary</SelectItem><SelectItem value="Cardio">Cardio</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <Button type="submit" disabled={isAnalyzing || (view === 'meal' && !textLabel && !preview) || (view !== 'meal' && !preview)} className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase text-[11px] tracking-[0.25em] shadow-2xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Analyzing Visuals...</> : "Start Clinical Scan"}
                    </Button>
                </form>
            </div>

            {currentResult && (
                <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700 mt-12 pb-20">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    <section className="flex flex-col items-center text-center gap-4">
                        <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/10 shadow-inner">
                            <Activity className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-black text-[#1A365D] dark:text-white leading-tight">{currentResult.name}</h2>
                            <div className={cn(
                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                (lang === 'en' ? currentResult.medicalAlertEn : currentResult.medicalAlertHi) ? "bg-rose-50 text-rose-600 shadow-sm" : "bg-emerald-50 text-emerald-600 shadow-sm"
                            )}>
                                {(lang === 'en' ? currentResult.medicalAlertEn : currentResult.medicalAlertHi) ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                {lang === 'en' ? currentResult.compatibilityTagEn : currentResult.compatibilityTagHi}
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 flex items-center gap-5 shadow-sm">
                            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0"><Zap className="h-6 w-6" /></div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estimated Energy</p>
                                <p className="text-2xl font-black text-[#1A365D] dark:text-white">{currentResult.calories}</p>
                                <p className="text-[9px] font-bold text-slate-400">{currentResult.portion}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-around p-6 rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 shadow-sm">
                            <MacroMini label="Carbs" val={currentResult.carbs} color="bg-amber-400" />
                            <div className="h-8 w-px bg-slate-200" />
                            <MacroMini label="Protein" val={currentResult.protein} color="bg-emerald-400" />
                            <div className="h-8 w-px bg-slate-200" />
                            <MacroMini label="Fats" val={currentResult.fats} color="bg-rose-400" />
                        </div>
                    </div>

                    <div className="space-y-4 px-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Micro-Nutrient Breakdown</h4>
                        <div className="p-8 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 shadow-sm grid grid-cols-2 gap-8">
                            <MicroItem label="Calcium" val={currentResult.microNutrients?.calcium} icon={Milk} />
                            <MicroItem label="Potassium" val={currentResult.microNutrients?.potassium} icon={Activity} />
                            <MicroItem label="Iron" val={currentResult.microNutrients?.iron} icon={Sparkles} />
                            <MicroItem label="Sodium" val={currentResult.microNutrients?.sodium} icon={AlertCircle} />
                        </div>
                    </div>

                    {(lang === 'en' ? currentResult.medicalAlertEn : currentResult.medicalAlertHi) && (
                        <div className="p-8 rounded-[2.5rem] bg-rose-500 text-white animate-pulse shadow-2xl flex flex-col items-center text-center gap-3">
                            <Ban className="h-10 w-10" />
                            <h3 className="text-xl font-black uppercase tracking-widest">Safety Advisory</h3>
                            <p className="text-sm font-bold leading-relaxed">{lang === 'en' ? currentResult.medicalAlertEn : currentResult.medicalAlertHi}</p>
                        </div>
                    )}

                    <div className="space-y-4 px-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{lang === 'en' ? 'Scientific Explanation' : 'सरल व्याख्या'}</h4>
                        <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100/50 italic text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                            "{lang === 'en' ? currentResult.logicEn : currentResult.logicHi}"
                        </div>
                    </div>

                    <div className="space-y-4 px-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{lang === 'en' ? 'Healthier Substitutions' : 'बेहतर विकल्प'}</h4>
                        <div className="space-y-3">
                            {(lang === 'en' ? (currentResult.substitutionsEn || []) : (currentResult.substitutionsHi || [])).map((sub: string, i: number) => (
                                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-white/40 shadow-sm">
                                    <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary"><Sparkles className="h-4 w-4" /></div>
                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button variant="ghost" onClick={resetAll} className="w-full rounded-full h-14 font-black uppercase text-[10px] tracking-widest text-slate-500 hover:text-primary bg-white/40 backdrop-blur-md border border-white/20">
                            <RotateCcw className="mr-2 h-4 w-4" /> Start New Analysis
                        </Button>
                    </div>

                    <Alert className="rounded-[3rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-8 border-dashed border-2 border-blue-100">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <ShieldAlert className="h-8 w-8 text-primary opacity-40" />
                            <p className="text-[10px] font-black uppercase text-blue-500/80 tracking-[0.3em] leading-relaxed">
                                AI analysis is based on typical values. Always verify with your clinical dietitian for medically complex cases.
                            </p>
                        </div>
                    </Alert>
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] fixed inset-0 overflow-hidden font-body">
        <main className="h-full overflow-y-auto scroll-smooth scrollbar-hide">
            <div className="max-w-2xl mx-auto p-4 min-h-full">
                {renderContent()}
            </div>
        </main>
    </div>
  );
}

function ScannerGridCard({ title, slogan, icon: Icon, gradient, iconColor, btnColor, onClick, btnText }: any) {
    return (
        <div className={cn("rounded-[3rem] border-none shadow-lg group hover:scale-[1.03] active:scale-95 transition-all duration-500 cursor-pointer bg-gradient-to-br relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md", gradient)} onClick={onClick}>
            <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-white/20 rounded-full blur-2xl" />
            <div className="p-6 flex flex-col items-center gap-4 text-center relative z-10">
                <div className="w-16 h-16 rounded-[1.8rem] bg-white/90 dark:bg-slate-900 shadow-md flex items-center justify-center transition-transform duration-700 group-hover:rotate-12">
                   <Icon className={cn("w-8 h-8", iconColor)} />
                </div>
                <div className="space-y-1.5 w-full">
                    <h3 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight leading-none">{title}</h3>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{slogan}</p>
                    <div className={cn("w-full rounded-2xl py-2 mt-3 text-[9px] font-black uppercase tracking-widest text-white shadow-xl transition-all duration-300 group-hover:shadow-primary/20", btnColor)}>
                        {btnText}
                    </div>
                </div>
            </div>
        </div>
    );
}
