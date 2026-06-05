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
  HeartPulse,
  Search,
  Ban,
  Barcode,
  FileText,
  Activity,
  Milk,
  Sparkles,
  Info
} from 'lucide-react';
import { analyzeFoodAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const initialAnalysisState = { result: null, error: null, timestamp: 0 };

type ScanMode = 'standard' | 'barcode' | 'ocr';

export default function FoodScannerPage() {
  const [state, formAction, isAnalyzing] = useActionState(analyzeFoodAction, initialAnalysisState);
  const [preview, setPreview] = useState<string | null>(null);
  const [textLabel, setTextLabel] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [scanMode, setScanMode] = useState<ScanMode>('standard');
  
  // Pillar 1 & 2 Local States
  const [healthMirror, setHealthMirror] = useState('');
  const [mainGoal, setMainGoal] = useState('Maintain Health');
  const [workout, setWorkout] = useState('Sedentary');
  const [protocol, setProtocol] = useState('Clean Eating');
  const [showSettings, setShowSettings] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.result && !state?.error && state?.timestamp > 0) {
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
        // Prompt user to label the meal
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
    
    // Mandatory Validation: If photo exists, name must be typed
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
        medicalTitle: "Medical Mirror (Optional)",
        medicalDesc: "E.g., Diabetes, High Blood Pressure...",
        fitnessTitle: "Fitness Goals",
        placeholder: "Type meal name (e.g., 2 Roti, Dal)",
        scanPlaceholder: "What's in the photo? (e.g. 2 Idlis)",
        startBtn: "Analyze Diet",
        logic: "Clinical Biological Logic",
        subs: "Safe Alternatives",
        macros: "Macro Breakdown",
        micros: "Micro Nutrients",
        vitamins: "Vitamins Detected",
        idealFor: "Ideal For",
        precautions: "Precautions",
        scanModes: "Select Scan Mode",
        modeMeal: "Meal",
        modeBarcode: "Barcode",
        modeLabel: "Label (OCR)",
        guarantee: "Deterministic range-based calculations applied to all results.",
        mandatoryHint: "Labeling your meal is mandatory for 100% accurate AI detection."
    },
    hi: {
        title: "न्यूट्री-स्कैन प्रो",
        slogan: "सटीक क्लिनिकल पोषण",
        medicalTitle: "मेडिकल प्रोफाइल (वैकल्पिक)",
        medicalDesc: "जैसे: मधुमेह, उच्च रक्तचाप...",
        fitnessTitle: "फिटनेस लक्ष्य",
        placeholder: "भोजन का नाम लिखें (जैसे: 2 रोटी, दाल)",
        scanPlaceholder: "फोटो में क्या है? (जैसे: 2 इडली)",
        startBtn: "आहार विश्लेषण",
        logic: "क्लिनिकल बायोलॉजिकल लॉजिक",
        subs: "सुरक्षित विकल्प",
        macros: "मैक्रो विवरण",
        micros: "सूक्ष्म पोषक तत्व",
        vitamins: "पाए गए विटामिन",
        idealFor: "इनके लिए उत्तम",
        precautions: "सावधानियां",
        scanModes: "स्कैन मोड चुनें",
        modeMeal: "भोजन",
        modeBarcode: "बारकोड",
        modeLabel: "लेबल (OCR)",
        guarantee: "सभी परिणामों पर सटीक रेंज-आधारित गणना लागू की गई है।",
        mandatoryHint: "100% सटीक AI पहचान के लिए अपने भोजन का नाम लिखना अनिवार्य है।"
    }
  }[lang];

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] pb-32 animate-in fade-in duration-500 font-body overflow-y-auto scrollbar-hide">
      
      {/* Native-Feel Header */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-4 bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-xl border-b border-white/20 dark:border-[#3c4043] safe-top">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
             <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 sm:h-11 sm:w-11 bg-white/50 dark:bg-[#3c4043] shadow-sm border border-white/20 shrink-0">
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 text-[#1A365D] dark:text-white" />
              </Button>
            </Link>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                  <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <h1 className="text-sm sm:text-lg font-black text-[#1A365D] dark:text-white tracking-tight truncate">{t.title}</h1>
              </div>
              <p className="text-[7px] sm:text-[8px] font-black text-primary uppercase tracking-[0.2em] truncate">{t.slogan}</p>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-slate-800/60 p-1 rounded-full border border-white/20 shadow-inner flex items-center gap-1 shrink-0">
            <button onClick={() => setLang('en')} className={cn("rounded-full px-3 py-1.5 text-[8px] sm:text-[9px] font-black uppercase transition-all", lang === 'en' ? "bg-primary text-white shadow-md" : "text-slate-400")}>EN</button>
            <button onClick={() => setLang('hi')} className={cn("rounded-full px-3 py-1.5 text-[8px] sm:text-[9px] font-black uppercase transition-all", lang === 'hi' ? "bg-primary text-white shadow-md" : "text-slate-400")}>हिन्दी</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">

        {/* Scan Mode Selection */}
        <section className="space-y-3">
             <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500/80 px-2">{t.scanModes}</h2>
             <div className="grid grid-cols-3 gap-3">
                <ScanModeBtn active={scanMode === 'standard'} icon={Utensils} label={t.modeMeal} onClick={() => setScanMode('standard')} color="blue" />
                <ScanModeBtn active={scanMode === 'barcode'} icon={Barcode} label={t.modeBarcode} onClick={() => setScanMode('barcode')} color="emerald" />
                <ScanModeBtn active={scanMode === 'ocr'} icon={FileText} label={t.modeLabel} onClick={() => setScanMode('ocr')} color="purple" />
             </div>
        </section>

        {/* Action Tiles - Only if no preview */}
        {!preview && (
            <section className="grid grid-cols-2 gap-4">
                <ActionTile icon={Camera} label="Open Camera" onClick={() => cameraInputRef.current?.click()} color="primary" />
                <ActionTile icon={ImageIcon} label="Upload Gallery" onClick={() => fileInputRef.current?.click()} color="accent" />
                <input type="file" ref={cameraInputRef} hidden accept="image/*" capture="environment" onChange={handleFileChange} />
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
            </section>
        )}

        {/* Meal Identification - Required if photo exists */}
        <section className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500/80">
                        {preview ? "Identify Your Meal (Mandatory)" : "Direct Search"}
                    </h2>
                    {preview && (
                        <div className="flex items-center gap-1 text-[8px] font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                           <AlertCircle className="w-2.5 h-2.5" /> Required
                        </div>
                    )}
                </div>
                <div className="relative">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input 
                        value={textLabel} 
                        onChange={(e) => setTextLabel(e.target.value)} 
                        placeholder={preview ? t.scanPlaceholder : t.placeholder} 
                        className={cn(
                            "rounded-[2.5rem] h-20 pl-16 pr-8 bg-white dark:bg-slate-900 border-none shadow-2xl text-lg font-bold placeholder:text-slate-300 focus-visible:ring-4 transition-all",
                            preview && !textLabel ? "ring-4 ring-rose-100 dark:ring-rose-900/20" : "focus-visible:ring-primary/10"
                        )} 
                    />
                </div>
                {preview && (
                    <p className="text-[9px] font-bold text-slate-400 px-6 italic flex items-center gap-2">
                        <Info className="w-3 h-3" /> {t.mandatoryHint}
                    </p>
                )}
            </div>
        </section>

        {/* Image Preview Area */}
        {preview && (
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-black/5">
                <Image src={preview} alt="Meal" fill className="object-cover" />
                {isAnalyzing && (
                    <div className="absolute inset-0 z-20">
                        <div className="absolute left-0 right-0 h-1.5 bg-primary shadow-[0_0_20px_rgba(36,136,232,1)] animate-scan-line z-30" />
                        <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                    </div>
                )}
                <Button size="icon" variant="destructive" className={cn("absolute top-6 right-6 rounded-full h-11 w-11 z-40 shadow-xl", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
                    <X className="h-6 w-6" />
                </Button>
            </div>
        )}

        {/* Pillar Drawer Toggle */}
        <section className="space-y-3">
            <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="w-full flex items-center justify-between p-6 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/40 shadow-sm"
            >
                <div className="flex items-center gap-4">
                    <UserCheck className="h-5 w-5 text-primary" />
                    <div className="text-left">
                        <h3 className="text-[11px] font-black text-[#1A365D] dark:text-white uppercase tracking-wider">{t.medicalTitle}</h3>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Personalize results</p>
                    </div>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", showSettings && "rotate-180")} />
            </button>

            {showSettings && (
                <div className="p-8 rounded-[3rem] bg-white dark:bg-slate-900 shadow-2xl border border-white/40 space-y-6 animate-in slide-in-from-top-2">
                    <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase text-slate-400 ml-2">Health Mirroring</Label>
                        <Textarea 
                            value={healthMirror}
                            onChange={(e) => setHealthMirror(e.target.value)}
                            placeholder={t.medicalDesc}
                            className="rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-[9px] font-black uppercase text-slate-400 ml-2">Goal</Label>
                            <Select value={mainGoal} onValueChange={setMainGoal}>
                                <SelectTrigger className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-2xl border-none">
                                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                                    <SelectItem value="Health Maintenance">General Health</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                             <Label className="text-[9px] font-black uppercase text-slate-400 ml-2">Workout</Label>
                            <Select value={workout} onValueChange={setWorkout}>
                                <SelectTrigger className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none font-bold text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-2xl border-none">
                                    <SelectItem value="Heavy Lifting">Strength</SelectItem>
                                    <SelectItem value="Cardio">Cardio</SelectItem>
                                    <SelectItem value="Sedentary">None</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )}
        </section>

        {/* Main Analysis Button */}
        <Button onClick={() => onFormSubmit({ preventDefault: () => {} } as any)} disabled={isAnalyzing || (!textLabel.trim() && !preview)} className="w-full h-20 rounded-[2.8rem] bg-primary hover:bg-primary/90 text-white font-black uppercase text-[12px] tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(36,136,232,0.4)] active:scale-95 transition-all">
            {isAnalyzing ? <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Analyzing Report...</> : t.startBtn}
        </Button>

        {/* Analysis Dashboard Result */}
        {state?.result && (
            <div className="space-y-10 animate-in slide-in-from-bottom-10 duration-700 pb-20 pt-6">
                
                {/* ID Header */}
                <section className="flex flex-col items-center text-center gap-6">
                    <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-inner">
                        <Activity className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#1A365D] dark:text-white leading-tight">{state.result.name}</h2>
                        <div className={cn(
                            "inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest",
                            state.result.medicalAlertEn ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                            {state.result.medicalAlertEn ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            {lang === 'en' ? state.result.compatibilityTagEn : state.result.compatibilityTagHi}
                        </div>
                    </div>
                </section>

                {/* Primary Metrics */}
                <section className="w-full p-8 rounded-[3rem] bg-white dark:bg-slate-900 shadow-xl border border-white/40 relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-24 bg-primary/5 -skew-x-[20deg] translate-x-8" />
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="h-14 w-14 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary">
                            <Zap className="h-7 w-7" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Energy</p>
                            <p className="text-3xl font-black text-[#1A365D] dark:text-white">{state.result.calories}</p>
                            <p className="text-[10px] font-bold text-slate-400">{state.result.portion}</p>
                        </div>
                    </div>
                </section>

                {/* Macros Breakdown */}
                <section className="grid grid-cols-3 gap-4">
                    <MetricCard label="Carbs" val={state.result.carbs} color="bg-amber-400" />
                    <MetricCard label="Protein" val={state.result.protein} color="bg-emerald-400" />
                    <MetricCard label="Fats" val={state.result.fats} color="bg-rose-400" />
                </section>

                {/* Micro Nutrients */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-100">{t.micros}</h4>
                    </div>
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 overflow-hidden">
                        <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                            <MicroItem label="Calcium" val={state.result.microNutrients.calcium} icon={Milk} />
                            <MicroItem label="Potassium" val={state.result.microNutrients.potassium} icon={Activity} />
                            <MicroItem label="Iron" val={state.result.microNutrients.iron} icon={ShieldCheck} />
                            <MicroItem label="Sodium" val={state.result.microNutrients.sodium} icon={AlertCircle} />
                        </div>
                        {state.result.microNutrients.vitamins.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-4">{t.vitamins}</p>
                                <div className="flex flex-wrap gap-2">
                                    {state.result.microNutrients.vitamins.map((v: string, i: number) => (
                                        <Badge key={i} variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                            {v}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </section>

                {/* Medical Alert */}
                {state.result.medicalAlertEn && (
                    <Alert variant="destructive" className="rounded-[2.5rem] border-none bg-red-500 text-white p-8 animate-pulse shadow-2xl">
                        <div className="flex flex-col items-center text-center gap-3">
                            <Ban className="h-10 w-10 mb-2" />
                            <AlertTitle className="text-xl font-black uppercase tracking-widest">Medical Warning</AlertTitle>
                            <AlertDescription className="text-sm font-bold leading-relaxed">
                                {lang === 'en' ? state.result.medicalAlertEn : state.result.medicalAlertHi}
                            </AlertDescription>
                        </div>
                    </Alert>
                )}

                {/* Logic Insight */}
                <section className="space-y-3 px-2">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.logic}</h4>
                    </div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-6 rounded-[2.5rem] border border-white/40 italic shadow-sm">
                        "{lang === 'en' ? state.result.logicEn : state.result.logicHi}"
                    </p>
                </section>

                {/* Actionable Suggestions */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-100">{t.subs}</h4>
                    </div>
                    <div className="grid gap-3">
                        {(lang === 'en' ? state.result.substitutionsEn : state.result.substitutionsHi).map((sub: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-5 rounded-[1.8rem] bg-white dark:bg-slate-900 shadow-lg border border-white/40 group active:scale-[0.98] transition-all">
                                <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <Sparkles className="h-4 w-4" />
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{sub}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <Alert className="rounded-[3rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-8 border-dashed border-2 border-blue-100 dark:border-blue-800">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <ShieldCheck className="h-8 w-8 text-primary opacity-40" />
                        <p className="text-[10px] font-black uppercase text-blue-500/80 tracking-[0.3em] leading-relaxed">
                            {t.guarantee}
                        </p>
                    </div>
                </Alert>
            </div>
        )}

      </main>
    </div>
  );
}

function MetricCard({ label, val, color }: any) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-lg border border-white/40 transition-all active:scale-[0.98]">
      <div className={cn("h-1 w-8 rounded-full", color)} />
      <div className="text-center">
        <p className="text-sm font-black text-[#1A365D] dark:text-white">{val}</p>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{label}</p>
      </div>
    </div>
  );
}

function MicroItem({ label, val, icon: Icon }: any) {
    return (
        <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
                <p className="text-sm font-black text-[#1A365D] dark:text-slate-100">{val}</p>
            </div>
        </div>
    )
}

function ScanModeBtn({ active, icon: Icon, label, onClick, color }: any) {
    const variants: Record<string, string> = {
        blue: active ? "bg-blue-500 text-white shadow-blue-200" : "bg-white dark:bg-slate-900 text-blue-500 border-blue-100",
        emerald: active ? "bg-emerald-500 text-white shadow-emerald-200" : "bg-white dark:bg-slate-900 text-emerald-500 border-emerald-100",
        purple: active ? "bg-purple-500 text-white shadow-purple-200" : "bg-white dark:bg-slate-900 text-purple-500 border-purple-100"
    };

    return (
        <button onClick={onClick} className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-[2rem] border transition-all active:scale-95 shadow-lg",
            variants[color]
        )}>
            <Icon className="h-5 w-5" />
            <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
        </button>
    );
}

function ActionTile({ icon: Icon, label, onClick, color }: any) {
    return (
        <button 
            onClick={onClick}
            className="h-32 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 shadow-lg border border-white dark:border-slate-800 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group"
        >
            <div className={cn(
                "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
                color === 'primary' ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white" : "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white"
            )}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1A365D] dark:text-white">{label}</span>
        </button>
    );
}
