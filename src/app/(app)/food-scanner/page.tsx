'use client';

import React, { useActionState, useRef, useState, useEffect, startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Loader2, 
  X, 
  ArrowLeft,
  CheckCircle2,
  Utensils,
  ShieldCheck,
  AlertCircle,
  Zap,
  UserCheck,
  ChevronDown,
  TrendingUp,
  Image as ImageIcon,
  Search,
  Ban,
  Barcode,
  FileText,
  Activity,
  Milk,
  Sparkles,
  Info,
  ExternalLink
} from 'lucide-react';
import { analyzeFoodAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const initialAnalysisState = { result: null, error: null, timestamp: 0 };

type ScanMode = 'standard' | 'barcode' | 'ocr';

export default function FoodScannerPage() {
  const [state, formAction, isAnalyzing] = useActionState(analyzeFoodAction, initialAnalysisState);
  const [preview, setPreview] = useState<string | null>(null);
  const [textLabel, setTextLabel] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [scanMode, setScanMode] = useState<ScanMode>('standard');
  const [localResult, setLocalResult] = useState<any>(null);
  
  // Pillar 1 & 2 Local States
  const [healthMirror, setHealthMirror] = useState('');
  const [mainGoal, setMainGoal] = useState('Maintain Health');
  const [workout, setWorkout] = useState('Sedentary');
  const [protocol, setProtocol] = useState('Clean Eating');
  const [showSettings, setShowSettings] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // ISOLATION LOGIC: Reset everything when mode changes
  useEffect(() => {
    setPreview(null);
    setTextLabel('');
    setLocalResult(null);
  }, [scanMode]);

  useEffect(() => {
    if (state?.result && !state?.error && state?.timestamp > 0) {
      setLocalResult(state.result);
      toast({ title: lang === 'en' ? "Analysis Ready ✨" : "विश्लेषण तैयार है ✨" });
    }
    if (state?.error) {
      toast({ variant: 'destructive', title: "Analysis Error", description: state.error });
    }
  }, [state, lang, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
        toast({
            title: lang === 'en' ? "Identify Your Meal" : "भोजन की पहचान करें",
            description: lang === 'en' ? "Please type what is in the photo for 100% accuracy." : "सटीकता के लिए कृपया लिखें कि फोटो में क्या है।"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (preview && !textLabel.trim()) {
        toast({ 
            variant: 'destructive', 
            title: lang === 'en' ? "Identity Required" : "पहचान आवश्यक", 
            description: lang === 'en' ? "Please type what is in the photo to proceed." : "कृपया आगे बढ़ने के लिए लिखें कि फोटो में क्या है।" 
        });
        return;
    }

    if (!textLabel.trim() && !preview) {
        toast({ 
            variant: 'destructive', 
            title: lang === 'en' ? "Input Required" : "इनपुट आवश्यक", 
            description: lang === 'en' ? "Please provide a photo or type the meal name." : "कृपया फोटो दें या खाने का नाम लिखें।" 
        });
        return;
    }

    const formData = new FormData();
    if (preview) formData.set('imageDataUri', preview);
    formData.set('textQuery', textLabel || "Unidentified Meal");
    formData.set('language', lang);
    formData.set('scanType', scanMode);
    formData.set('healthMirrorProfile', healthMirror);
    formData.set('mainGoal', mainGoal);
    formData.set('workoutRegimen', workout);
    formData.set('dietaryProtocol', protocol);
    startTransition(() => { formAction(formData); });
  };

  const t = {
    en: {
        title: "Nutri-Scan Pro",
        slogan: "Precision Clinical Nutrition",
        medicalTitle: "Medical Profile (Optional)",
        medicalDesc: "E.g., Diabetes, High Blood Pressure...",
        placeholder: "Type meal name (e.g., 2 Roti, Dal)",
        scanPlaceholder: "What's in the photo? (e.g. 2 Idlis)",
        startBtn: "Analyze Diet",
        logic: "Clinical Biological Logic",
        subs: "Safe Alternatives",
        macros: "Macro Breakdown",
        micros: "Micro Nutrients",
        vitamins: "Vitamins Detected",
        scanModes: "Select Scan Mode",
        modeMeal: "Meal",
        modeBarcode: "Barcode",
        modeLabel: "Label",
        guarantee: "Deterministic range-based calculations applied to all results.",
        mandatoryHint: "Labeling your meal is mandatory for 100% accurate AI detection."
    },
    hi: {
        title: "न्यूट्री-स्कैन प्रो",
        slogan: "सटीक क्लिनिकल पोषण",
        medicalTitle: "मेडिकल प्रोफाइल (वैकल्पिक)",
        medicalDesc: "जैसे: मधुमेह, उच्च रक्तचाप...",
        placeholder: "भोजन का नाम लिखें (जैसे: 2 रोटी, दाल)",
        scanPlaceholder: "फोटो में क्या है? (जैसे: 2 इडली)",
        startBtn: "आहार विश्लेषण",
        logic: "क्लिनिकल बायोलॉजिकल लॉजिक",
        subs: "सुरक्षित विकल्प",
        macros: "मैक्रो विवरण",
        micros: "सूक्ष्म पोषक तत्व",
        vitamins: "पाए गए विटामिन",
        scanModes: "स्कैन मोड चुनें",
        modeMeal: "भोजन",
        modeBarcode: "बारकोड",
        modeLabel: "लेबल",
        guarantee: "सभी परिणामों पर सटीक रेंज-आधारित गणना लागू की गई है।",
        mandatoryHint: "100% सटीक AI पहचान के लिए अपने भोजन का नाम लिखना अनिवार्य है।"
    }
  }[lang];

  return (
    <div className="min-h-[100dvh] w-full bg-background pb-32 animate-in fade-in duration-500 font-body overflow-y-auto scrollbar-hide">
      
      {/* Native-Feel Header */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-4 bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-xl border-b border-white/10 safe-top">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
             <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 bg-white/50 dark:bg-[#3c4043] shadow-sm border border-white/20 shrink-0">
                <ArrowLeft className="h-6 w-6 text-[#1A365D] dark:text-white" />
              </Button>
            </Link>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                  <Utensils className="h-5 w-5 text-primary" />
                  <h1 className="text-lg font-black text-[#1A365D] dark:text-white tracking-tight truncate">{t.title}</h1>
              </div>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] truncate">{t.slogan}</p>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-slate-800/60 p-1 rounded-full border border-white/20 shadow-inner flex items-center gap-1 shrink-0">
            <button onClick={() => setLang('en')} className={cn("rounded-full px-3 py-1.5 text-[9px] font-black uppercase transition-all", lang === 'en' ? "bg-primary text-white shadow-md" : "text-slate-400")}>EN</button>
            <button onClick={() => setLang('hi')} className={cn("rounded-full px-3 py-1.5 text-[9px] font-black uppercase transition-all", lang === 'hi' ? "bg-primary text-white shadow-md" : "text-slate-400")}>हिन्दी</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-8">

        {/* Horizontal Mode Selection (Native Pill Style) */}
        <section className="space-y-4">
             <div className="flex items-center gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-full border border-white/10 overflow-x-auto scrollbar-hide">
                <ScanModePill active={scanMode === 'standard'} icon={Utensils} label={t.modeMeal} onClick={() => setScanMode('standard')} />
                <ScanModePill active={scanMode === 'barcode'} icon={Barcode} label={t.modeBarcode} onClick={() => setScanMode('barcode')} />
                <ScanModePill active={scanMode === 'ocr'} icon={FileText} label={t.modeLabel} onClick={() => setScanMode('ocr')} />
             </div>
        </section>

        {/* Input Interface - Hidden if result exists */}
        {!localResult && (
          <>
            {!preview && (
                <section className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-500">
                    <ActionTile icon={Camera} label="Open Camera" onClick={() => cameraInputRef.current?.click()} color="primary" />
                    <ActionTile icon={ImageIcon} label="Gallery" onClick={() => fileInputRef.current?.click()} color="accent" />
                    <input type="file" ref={cameraInputRef} hidden accept="image/*" capture="environment" onChange={handleFileChange} />
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                </section>
            )}

            <section className="space-y-6">
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500/80">
                            {preview ? "Identify Your Meal (Required)" : "Direct Search"}
                        </h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                        <Input 
                            value={textLabel} 
                            onChange={(e) => setTextLabel(e.target.value)} 
                            placeholder={preview ? t.scanPlaceholder : t.placeholder} 
                            className={cn(
                                "rounded-[2rem] h-16 pl-16 pr-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl text-base font-bold placeholder:text-slate-300 transition-all",
                                preview && !textLabel ? "border-rose-300 ring-4 ring-rose-50" : "focus-visible:ring-primary/10"
                            )} 
                        />
                    </div>
                </div>

                {preview && (
                    <div className="relative aspect-square max-h-[350px] mx-auto rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-black/5 animate-in zoom-in-95">
                        <Image src={preview} alt="Meal" fill className="object-cover" />
                        {isAnalyzing && (
                            <div className="absolute inset-0 z-20">
                                <div className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_rgba(36,136,232,1)] animate-scan-line z-30" />
                                <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                            </div>
                        )}
                        <Button size="icon" variant="destructive" className={cn("absolute top-5 right-5 rounded-full h-10 w-10 z-40 shadow-xl", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                <button 
                    onClick={() => setShowSettings(!showSettings)} 
                    className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]"
                >
                    <div className="flex items-center gap-3">
                        <UserCheck className="h-5 w-5 text-primary" />
                        <div className="text-left">
                            <h3 className="text-[11px] font-black text-[#1A365D] dark:text-white uppercase tracking-wider">{t.medicalTitle}</h3>
                            <p className="text-[8px] font-bold text-slate-400 uppercase">Health Mirror Settings</p>
                        </div>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 text-slate-300 transition-transform", showSettings && "rotate-180")} />
                </button>

                {showSettings && (
                    <div className="p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-6 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Profile Mirroring</Label>
                            <Textarea 
                                value={healthMirror}
                                onChange={(e) => setHealthMirror(e.target.value)}
                                placeholder={t.medicalDesc}
                                className="rounded-xl bg-white dark:bg-slate-900 border-none shadow-sm font-bold text-sm min-h-[80px]"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Goal</Label>
                                <Select value={mainGoal} onValueChange={setMainGoal}>
                                    <SelectTrigger className="rounded-xl h-11 bg-white dark:bg-slate-900 border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl border-none">
                                        <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                                        <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                                        <SelectItem value="Health Maintenance">General Health</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                 <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Workout</Label>
                                <Select value={workout} onValueChange={setWorkout}>
                                    <SelectTrigger className="rounded-xl h-11 bg-white dark:bg-slate-900 border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-xl border-none">
                                        <SelectItem value="Heavy Lifting">Strength</SelectItem>
                                        <SelectItem value="Cardio">Cardio</SelectItem>
                                        <SelectItem value="Sedentary">None</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}

                <Button onClick={() => onFormSubmit({ preventDefault: () => {} } as any)} disabled={isAnalyzing || (!textLabel.trim() && !preview)} className="w-full h-16 rounded-full bg-primary hover:bg-primary/90 text-white font-black uppercase text-[11px] tracking-[0.25em] shadow-2xl active:scale-95 transition-all">
                    {isAnalyzing ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Processing...</> : t.startBtn}
                </Button>
            </section>
          </>
        )}

        {/* Isolated Results View */}
        {localResult && (
            <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700 pb-20">
                <section className="flex flex-col items-center text-center gap-4">
                    <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/10 shadow-inner">
                        <Activity className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1.5">
                        <h2 className="text-2xl font-black text-[#1A365D] dark:text-white leading-tight">{localResult.name}</h2>
                        <div className={cn(
                            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                            localResult.medicalAlertEn ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                            {localResult.medicalAlertEn ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                            {lang === 'en' ? localResult.compatibilityTagEn : localResult.compatibilityTagHi}
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-5">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Energy</p>
                            <p className="text-2xl font-black text-[#1A365D] dark:text-white">{localResult.calories}</p>
                            <p className="text-[9px] font-bold text-slate-400">{localResult.portion}</p>
                        </div>
                    </section>

                    <section className="flex items-center justify-around p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <MacroMini label="Carbs" val={localResult.carbs} color="bg-amber-400" />
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                        <MacroMini label="Protein" val={localResult.protein} color="bg-emerald-400" />
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                        <MacroMini label="Fats" val={localResult.fats} color="bg-rose-400" />
                    </section>
                </div>

                <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">{t.micros}</h4>
                    <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-2 gap-8">
                        <MicroItem label="Calcium" val={localResult.microNutrients.calcium} icon={Milk} />
                        <MicroItem label="Potassium" val={localResult.microNutrients.potassium} icon={Activity} />
                        <MicroItem label="Iron" val={localResult.microNutrients.iron} icon={ShieldCheck} />
                        <MicroItem label="Sodium" val={localResult.microNutrients.sodium} icon={AlertCircle} />
                    </div>
                </section>

                {localResult.medicalAlertEn && (
                    <div className="p-8 rounded-[2.5rem] bg-rose-500 text-white animate-pulse shadow-2xl flex flex-col items-center text-center gap-3">
                        <Ban className="h-10 w-10" />
                        <h3 className="text-xl font-black uppercase tracking-widest">Medical Warning</h3>
                        <p className="text-sm font-bold leading-relaxed">
                            {lang === 'en' ? localResult.medicalAlertEn : localResult.medicalAlertHi}
                        </p>
                    </div>
                )}

                <section className="space-y-4 px-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{t.logic}</h4>
                    <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 italic text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                        "{lang === 'en' ? localResult.logicEn : localResult.logicHi}"
                    </div>
                </section>

                <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-2">{t.subs}</h4>
                    <div className="space-y-3">
                        {(lang === 'en' ? localResult.substitutionsEn : localResult.substitutionsHi).map((sub: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm group">
                                <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{sub}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <Button variant="ghost" onClick={() => setLocalResult(null)} className="w-full rounded-full h-14 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-primary">
                    Start New Analysis
                </Button>

                <div className="p-6 rounded-[2rem] bg-blue-50/20 border border-dashed border-blue-100 text-center space-y-2">
                    <ShieldCheck className="h-6 w-6 text-primary/40 mx-auto" />
                    <p className="text-[9px] font-black uppercase text-blue-400/80 tracking-widest leading-relaxed">{t.guarantee}</p>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}

function ScanModePill({ active, icon: Icon, label, onClick }: any) {
    return (
        <button 
            onClick={onClick} 
            className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full transition-all duration-300",
                active ? "bg-white dark:bg-slate-800 shadow-md text-primary" : "text-slate-400 hover:text-slate-600"
            )}
        >
            <Icon className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{label}</span>
        </button>
    );
}

function ActionTile({ icon: Icon, label, onClick, color }: any) {
    return (
        <button 
            onClick={onClick}
            className="h-28 rounded-[2rem] bg-slate-50 dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group"
        >
            <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                color === 'primary' ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white" : "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white"
            )}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1A365D] dark:text-white">{label}</span>
        </button>
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
    )
}

function MicroItem({ label, val, icon: Icon }: any) {
    return (
        <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
                <p className="text-base font-black text-[#1A365D] dark:text-slate-100">{val}</p>
            </div>
        </div>
    )
}
