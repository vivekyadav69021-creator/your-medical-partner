'use client';

import React, { useActionState, useRef, useState, useEffect, startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Search, 
  Loader2, 
  X, 
  Activity,
  ArrowLeft,
  CheckCircle2,
  Utensils,
  ShieldCheck,
  AlertCircle,
  Zap,
  Sparkles,
  Stethoscope,
  Dumbbell,
  HeartPulse,
  ChevronDown,
  RotateCcw,
  UserCheck,
  Info,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { analyzeFoodAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialAnalysisState = { result: null, error: null, timestamp: 0 };

export default function FoodScannerPage() {
  const [state, formAction, isAnalyzing] = useActionState(analyzeFoodAction, initialAnalysisState);
  const [preview, setPreview] = useState<string | null>(null);
  const [textQuery, setTextQuery] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  
  // Pillar 1 & 2 Local States
  const [healthMirror, setHealthMirror] = useState('');
  const [mainGoal, setMainGoal] = useState('Weight Loss');
  const [workout, setWorkout] = useState('Sedentary');
  const [protocol, setProtocol] = useState('Clean Eating');
  const [showSettings, setShowSettings] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.result && !state?.error && state?.timestamp > 0) {
      toast({ title: lang === 'en' ? "Personalized Analysis Ready ✨" : "व्यक्तिगत विश्लेषण तैयार है ✨" });
    }
    if (state?.error) {
      toast({ variant: 'destructive', title: "Analysis Error", description: state.error });
    }
  }, [state, lang, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (preview) formData.set('imageDataUri', preview);
    formData.set('textQuery', textQuery);
    formData.set('language', lang);
    formData.set('healthMirrorProfile', healthMirror);
    formData.set('mainGoal', mainGoal);
    formData.set('workoutRegimen', workout);
    formData.set('dietaryProtocol', protocol);
    startTransition(() => { formAction(formData); });
  };

  const t = {
    en: {
        title: "Nutri-Scan Pro",
        slogan: "Precision Food Intelligence",
        medicalTitle: "Pillar 1: Medical Mirroring",
        medicalDesc: "Mention conditions, allergies, or concerns...",
        fitnessTitle: "Pillar 2: Fitness Fulfillment",
        placeholder: "Search meal or scan photo...",
        startBtn: "Analyze Meal",
        logic: "Body Processing Logic",
        subs: "Recommended Substitutes",
        compatibility: "Goal Alignment",
        guarantee: "100% Precise Lab Analysis"
    },
    hi: {
        title: "न्यूट्री-स्कैन प्रो",
        slogan: "सटीक आहार इंटेलिजेंस",
        medicalTitle: "पिलर 1: मेडिकल मिररिंग",
        medicalDesc: "अपनी बीमारियां या एलर्जी यहाँ लिखें...",
        fitnessTitle: "पिलर 2: फिटनेस गोल्स",
        placeholder: "खाना सर्च करें या फोटो लें...",
        startBtn: "विश्लेषण शुरू करें",
        logic: "बॉडी प्रोसेसिंग लॉजिक",
        subs: "बेहतर आहार विकल्प",
        compatibility: "लक्ष्य अनुकूलता",
        guarantee: "100% सटीक लैब डेटा"
    }
  }[lang];

  return (
    <div className="min-h-[100dvh] w-full bg-slate-50 dark:bg-[#020617] pb-32 animate-in fade-in duration-500 font-body overflow-y-auto overflow-x-hidden relative">
      
      {/* Native App Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/10 via-transparent to-transparent -z-10" />

      {/* Header - Native App Feel */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-2 bg-slate-50/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 safe-top">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <ArrowLeft className="h-5 w-5 text-[#1A365D] dark:text-slate-100" />
              </Button>
            </Link>
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-[#1A365D] dark:text-white leading-tight">{t.title}</h1>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.15em]">{t.slogan}</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-1 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-1">
            <button onClick={() => setLang('en')} className={cn("rounded-full px-3 py-1 text-[9px] font-black uppercase transition-all", lang === 'en' ? "bg-primary text-white" : "text-slate-400")}>EN</button>
            <button onClick={() => setLang('hi')} className={cn("rounded-full px-3 py-1 text-[9px] font-black uppercase transition-all", lang === 'hi' ? "bg-primary text-white" : "text-slate-400")}>हिन्दी</button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-6 space-y-8">

        {/* 3-Pillar Profile Setup - Native Form Feel */}
        <section className="space-y-4">
            <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800/50 active:scale-[0.98] transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <UserCheck className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-[12px] font-black text-[#1A365D] dark:text-white uppercase tracking-wider">Pillar 1 & 2 Config</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Medical & Fitness Profile</p>
                    </div>
                </div>
                <ChevronDown className={cn("h-5 w-5 text-slate-300 transition-transform", showSettings && "rotate-180")} />
            </button>

            {showSettings && (
                <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-xl border border-primary/10 space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Stethoscope className="h-4 w-4 text-rose-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.medicalTitle}</h4>
                        </div>
                        <Textarea 
                            value={healthMirror}
                            onChange={(e) => setHealthMirror(e.target.value)}
                            placeholder={t.medicalDesc}
                            className="rounded-2xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner min-h-[100px] font-bold text-xs"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Dumbbell className="h-4 w-4 text-emerald-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.fitnessTitle}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Select value={mainGoal} onValueChange={setMainGoal}>
                                <SelectTrigger className="rounded-xl h-11 bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold text-[10px]"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl"><SelectItem value="Weight Loss">Weight Loss</SelectItem><SelectItem value="Muscle Gain">Muscle Gain</SelectItem><SelectItem value="Endurance">Endurance</SelectItem></SelectContent>
                            </Select>
                            <Select value={workout} onValueChange={setWorkout}>
                                <SelectTrigger className="rounded-xl h-11 bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold text-[10px]"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl"><SelectItem value="Heavy Weights">Heavy Lifting</SelectItem><SelectItem value="Yoga">Yoga</SelectItem><SelectItem value="Sedentary">No Exercise</SelectItem></SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )}
        </section>

        {/* Input Bridge - Action Center */}
        <section className="space-y-6">
            <div 
                onClick={() => fileInputRef.current?.click()} 
                className={cn(
                    "relative aspect-[4/3] rounded-[3rem] overflow-hidden border-4 transition-all duration-500 bg-slate-100 dark:bg-slate-900 group cursor-pointer",
                    !preview ? "border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4" : "border-white dark:border-slate-800 shadow-2xl"
                )}
            >
                {!preview ? (
                    <>
                        <div className="h-20 w-20 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <Camera className="w-10 h-10" />
                        </div>
                        <div className="text-center px-10">
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Scan Meal Photo</p>
                            <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">Tap to open camera</p>
                        </div>
                    </>
                ) : (
                    <>
                        <Image src={preview} alt="Meal" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                        {isAnalyzing && (
                            <div className="absolute inset-0 z-20 pointer-events-none">
                                <div className="absolute left-0 right-0 h-1.5 bg-primary shadow-[0_0_20px_rgba(36,136,232,1)] animate-scan-line z-30" />
                                <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                            </div>
                        )}
                        {!isAnalyzing && (
                            <Button size="icon" variant="destructive" className="absolute top-4 right-4 rounded-full h-10 w-10 z-40 shadow-2xl" onClick={(e) => {e.stopPropagation(); setPreview(null);}}>
                                <X className="h-5 w-5" />
                            </Button>
                        )}
                    </>
                )}
                <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
            </div>

            <form onSubmit={onFormSubmit} className="space-y-4">
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <Input 
                        value={textQuery} 
                        onChange={(e) => setTextQuery(e.target.value)} 
                        placeholder={t.placeholder} 
                        className="rounded-[1.8rem] h-14 pl-14 bg-white dark:bg-slate-900 border-none shadow-sm text-sm font-bold placeholder:text-slate-300 focus-visible:ring-2 focus-visible:ring-primary/20" 
                    />
                </div>
                <Button type="submit" disabled={isAnalyzing || (!preview && !textQuery.trim())} className="w-full h-16 rounded-[2.2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase text-[11px] tracking-[0.25em] shadow-xl shadow-primary/20 active:scale-95 transition-all">
                    {isAnalyzing ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Cross-Referencing...</> : t.startBtn}
                </Button>
            </form>
        </section>

        {/* Results Flow */}
        {state?.result && (
            <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-20">
                
                {/* Score & Profile Compatibility */}
                <section className="flex flex-col items-center text-center gap-6">
                    <div className="relative h-48 w-48 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" strokeDasharray={552} strokeDashoffset={552 * 0.3} strokeLinecap="round" fill="transparent" className="text-primary drop-shadow-[0_0_8px_rgba(36,136,232,0.5)]" />
                        </svg>
                        <div className="relative z-10 flex flex-col items-center">
                            <p className="text-5xl font-black text-[#1A365D] dark:text-white tracking-tighter">{state.result.calories}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">kcal total</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-[#1A365D] dark:text-white leading-tight">{state.result.name}</h2>
                        <div className={cn(
                            "inline-flex items-center gap-2 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest",
                            state.result.medicalAlertEn ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                            {state.result.medicalAlertEn ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            {lang === 'en' ? state.result.compatibilityTagEn : state.result.compatibilityTagHi}
                        </div>
                    </div>
                </section>

                {/* Macro Matrix - Native Visuals */}
                <section className="grid grid-cols-3 gap-3">
                    <MacroDot label="Carbs" val={state.result.carbs} color="bg-amber-400" icon={Zap} />
                    <MacroDot label="Protein" val={state.result.protein} color="bg-emerald-400" icon={TrendingUp} />
                    <MacroDot label="Fats" val={state.result.fats} color="bg-rose-400" icon={Activity} />
                </section>

                {/* Deep Insights - Immersive Text */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-primary">
                                <ShieldCheck className="h-4 w-4" />
                            </div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#1A365D] dark:text-white">{t.logic}</h4>
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic px-2">
                            "{lang === 'en' ? state.result.logicEn : state.result.logicHi}"
                        </p>
                    </div>

                    {state.result.medicalAlertEn && (
                        <div className="p-5 rounded-[2rem] bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 flex items-start gap-4">
                            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                            <p className="text-xs font-black text-rose-700 dark:text-rose-300 leading-relaxed">
                                {lang === 'en' ? state.result.medicalAlertEn : state.result.medicalAlertHi}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-500">
                                <RotateCcw className="h-4 w-4" />
                            </div>
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#1A365D] dark:text-white">{t.subs}</h4>
                        </div>
                        <div className="space-y-2">
                            {(lang === 'en' ? state.result.substitutionsEn : state.result.substitutionsHi).map((sub: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-50 dark:border-slate-800">
                                    <ChevronRight className="h-3 w-3 text-primary shrink-0" />
                                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Floating Bottom Action - Native UX */}
                <div className="fixed bottom-6 left-0 right-0 px-6 z-[60]">
                    <Button className="w-full h-16 rounded-[2.2rem] bg-[#1A365D] dark:bg-primary text-white font-black uppercase text-[11px] tracking-[0.25em] shadow-[0_20px_50px_rgba(26,54,93,0.4)] active:scale-95 transition-all">
                        Sync to My Day & Challenges ➔
                    </Button>
                </div>
            </div>
        )}

        {!state?.result && !isAnalyzing && (
            <div className="pt-10 flex flex-col items-center justify-center text-center opacity-30 grayscale pointer-events-none">
                <Utensils className="w-16 h-16 text-slate-300 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Scanner Pulse Idle</p>
            </div>
        )}

        <section className="pt-4">
             <div className="p-6 rounded-[2.5rem] bg-blue-50/50 dark:bg-blue-900/10 flex flex-col items-center gap-3 text-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <p className="text-[9px] font-black uppercase text-blue-400 tracking-wider max-w-[200px] leading-relaxed">
                    {t.guarantee}
                </p>
            </div>
        </section>

      </main>
    </div>
  );
}

function MacroDot({ label, val, color, icon: Icon }: any) {
  return (
    <div className="flex flex-col items-center gap-3 p-5 rounded-[2.2rem] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800/50 group hover:border-primary/20 transition-all">
      <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center text-white", color)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-center">
        <p className="text-xs font-black text-[#1A365D] dark:text-white leading-none">{val}g</p>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}
