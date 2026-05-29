'use client';

import React, { useActionState, useRef, useState, useEffect, startTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Info,
  ChevronDown,
  RotateCcw,
  UserCheck
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
  const [showSettings, setShowSettings] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.result && !state?.error && state?.timestamp > 0) {
      toast({ title: lang === 'en' ? "Personalized Analysis Ready ✨" : "व्यक्तिगत विश्लेषण तैयार है ✨" });
      setShowSettings(false); // Hide settings to focus on results
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
        slogan: "Hyper-Personalized Analysis",
        medicalTitle: "Pillar 1: Medical Mirroring",
        medicalDesc: "Mention chronic issues, gastric complaints or allergies.",
        fitnessTitle: "Pillar 2: Fitness Fulfillment",
        placeholder: "E.g., 1 Plate Dal Khichdi...",
        startBtn: "Mirror & Analyze Meal",
        logic: "Biological Logic",
        subs: "Custom Substitutions",
        compatibility: "Profile Compatibility",
        guarantee: "100% Deterministic Engine"
    },
    hi: {
        title: "न्यूट्री-स्कैन प्रो",
        slogan: "अति-व्यक्तिगत विश्लेषण",
        medicalTitle: "पिलर 1: मेडिकल मिररिंग",
        medicalDesc: "अपनी बीमारियां, पेट की समस्याएं या एलर्जी बताएं।",
        fitnessTitle: "पिलर 2: फिटनेस गोल्स",
        placeholder: "जैसे: १ प्लेट दाल खिचड़ी...",
        startBtn: "मिरर और विश्लेषण करें",
        logic: "जैविक तर्क",
        subs: "बेहतर विकल्प",
        compatibility: "प्रोफ़ाइल अनुकूलता",
        guarantee: "सटीक डेटा गारंटी"
    }
  }[lang];

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#f8faff] to-[#ffffff] dark:from-[#020617] dark:to-[#0f172a] pb-32 animate-in fade-in duration-1000 font-body overflow-y-auto overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4 p-4 bg-white/40 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-white/20 mx-1 safe-top">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link href="/dashboard" className="shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-slate-800 shadow-sm h-10 w-10">
                <ArrowLeft className="h-5 w-5 text-primary" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                <Utensils className="h-6 w-6 text-primary" />
                <div className="absolute left-0 right-0 h-0.5 bg-primary/40 animate-scan-line z-10" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-black text-[#1A365D] dark:text-white tracking-tight leading-none truncate">{t.title}</h1>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-1 truncate">{t.slogan}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full border border-white/20 flex items-center gap-1 shrink-0">
            <button onClick={() => setLang('en')} className={cn("rounded-full px-4 py-1.5 text-[10px] font-black uppercase transition-all", lang === 'en' ? "bg-primary text-white shadow-md" : "text-slate-400")}>EN</button>
            <button onClick={() => setLang('hi')} className={cn("rounded-full px-4 py-1.5 text-[10px] font-black uppercase transition-all", lang === 'hi' ? "bg-primary text-white shadow-md" : "text-slate-400")}>हिन्दी</button>
          </div>
        </div>

        {/* Pillar 1 & 2: User Settings (Collapsible) */}
        <div className="mx-1">
            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl overflow-hidden transition-all">
                <button onClick={() => setShowSettings(!showSettings)} className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary"><HeartPulse className="h-5 w-5" /></div>
                        <div className="text-left">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#1A365D] dark:text-white">Profile Personalization</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Pillar 1 & 2 Configuration</p>
                        </div>
                    </div>
                    <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform", showSettings && "rotate-180")} />
                </button>
                
                {showSettings && (
                    <CardContent className="p-6 pt-0 space-y-6 animate-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Pillar 1 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Stethoscope className="h-4 w-4 text-rose-500" />
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">{t.medicalTitle}</h4>
                                </div>
                                <Textarea 
                                    value={healthMirror}
                                    onChange={(e) => setHealthMirror(e.target.value)}
                                    placeholder={t.medicalDesc}
                                    className="rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border-none shadow-inner min-h-[120px] font-bold text-sm"
                                />
                            </div>
                            {/* Pillar 2 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-1">
                                    <Dumbbell className="h-4 w-4 text-emerald-500" />
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">{t.fitnessTitle}</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Select value={mainGoal} onValueChange={setMainGoal}>
                                        <SelectTrigger className="rounded-xl h-12 bg-slate-50/50 dark:bg-slate-800/50 border-none shadow-inner font-bold text-xs"><SelectValue placeholder="Main Goal" /></SelectTrigger>
                                        <SelectContent className="rounded-xl"><SelectItem value="Weight Loss">Weight Loss</SelectItem><SelectItem value="Muscle Gain">Muscle Gain</SelectItem><SelectItem value="Endurance">Endurance</SelectItem><SelectItem value="Lean Shred">Lean Shred</SelectItem></SelectContent>
                                    </Select>
                                    <Select value={workout} onValueChange={setWorkout}>
                                        <SelectTrigger className="rounded-xl h-12 bg-slate-50/50 dark:bg-slate-800/50 border-none shadow-inner font-bold text-xs"><SelectValue placeholder="Workout" /></SelectTrigger>
                                        <SelectContent className="rounded-xl"><SelectItem value="Heavy Weights">Heavy Lifting</SelectItem><SelectItem value="HIIT Cardio">High Intensity</SelectItem><SelectItem value="Yoga">Yoga/Flexibility</SelectItem><SelectItem value="Sedentary">No Exercise</SelectItem></SelectContent>
                                    </Select>
                                    <Select value={protocol} onValueChange={setProtocol}>
                                        <SelectTrigger className="rounded-xl h-12 bg-slate-50/50 dark:bg-slate-800/50 border-none shadow-inner font-bold text-xs"><SelectValue placeholder="Diet Plan" /></SelectTrigger>
                                        <SelectContent className="rounded-xl"><SelectItem value="High Protein">High Protein</SelectItem><SelectItem value="Low Carb">Low Carb</SelectItem><SelectItem value="Clean Eating">Clean Eating</SelectItem><SelectItem value="Calorie Deficit">Deficit</SelectItem></SelectContent>
                                    </Select>
                                    <Button variant="ghost" onClick={() => {setHealthMirror(''); setMainGoal('Weight Loss'); setWorkout('Sedentary'); setProtocol('Clean Eating');}} className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400"><RotateCcw className="h-3 w-3 mr-2" /> Reset Profile</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-1">
          
          {/* Column 1: Pillar 3 Central Input Bridge */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 p-6 h-fit">
               <div className="relative mb-6">
                {!preview ? (
                  <div onClick={() => fileInputRef.current?.click()} className="aspect-square rounded-[2.5rem] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-5 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer hover:bg-primary/5 transition-all group">
                    <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Camera className="w-8 h-8" /></div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Pillar 3: Visual Bridge</p>
                    <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                  </div>
                ) : (
                  <div className="relative aspect-square rounded-[2.5rem] overflow-hidden group shadow-xl">
                    <Image src={preview} alt="Meal" fill className="object-cover" />
                    {isAnalyzing && <div className="absolute inset-0 z-20 pointer-events-none"><div className="absolute left-0 right-0 h-1 bg-primary/60 animate-scan-line shadow-[0_0_15px_rgba(36,136,232,1)]" /></div>}
                    {!isAnalyzing && <Button size="icon" variant="destructive" className="absolute top-4 right-4 rounded-full h-10 w-10 z-30 shadow-2xl" onClick={() => setPreview(null)}><X className="h-5 w-5" /></Button>}
                  </div>
                )}
              </div>

              <form onSubmit={onFormSubmit} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input value={textQuery} onChange={(e) => setTextQuery(e.target.value)} placeholder={t.placeholder} className="rounded-2xl h-14 pl-14 bg-slate-50 dark:bg-slate-800 border-none shadow-inner text-sm font-bold" />
                  </div>
                  <Button type="submit" disabled={isAnalyzing || (!preview && !textQuery.trim())} className="w-full h-14 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-[0.25em] shadow-xl active:scale-95 transition-all">
                    {isAnalyzing ? <><Loader2 className="mr-3 h-4 w-4 animate-spin" /> Cross-Referencing...</> : t.startBtn}
                  </Button>
                </form>
            </Card>

            <Alert className="rounded-[2.5rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-6 flex flex-col items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <AlertDescription className="text-[9px] font-black uppercase text-blue-400 tracking-wider text-center">{t.guarantee}</AlertDescription>
            </Alert>
          </div>

          {/* Results Zone */}
          <div className="lg:col-span-8 space-y-8">
            {state?.result && (
                <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
                    
                    {/* Compatibility Tag */}
                    <div className="flex flex-wrap items-center gap-3 px-2">
                        <div className={cn("px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2", 
                            state.result.medicalAlertEn ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100")}>
                            {state.result.medicalAlertEn ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            {lang === 'en' ? state.result.compatibilityTagEn : state.result.compatibilityTagHi}
                        </div>
                        {state.result.protein > 20 && (
                            <Badge className="bg-blue-50 text-blue-600 border-none px-5 py-2 rounded-full font-black text-[9px] uppercase tracking-widest">Growth Dense</Badge>
                        )}
                    </div>

                    {/* Nutrient Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-10 shadow-xl flex flex-col items-center justify-center text-center">
                            <div className="relative h-44 w-44 flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                    <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="10" strokeDasharray={502} strokeDashoffset={502 * 0.3} strokeLinecap="round" fill="transparent" className="text-primary" />
                                </svg>
                                <div className="relative z-10">
                                    <p className="text-4xl font-black text-[#1A365D] dark:text-white">{state.result.calories}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">kcal</p>
                                </div>
                            </div>
                            <h3 className="mt-8 text-lg font-black text-[#1A365D] dark:text-white">{state.result.name}</h3>
                        </Card>

                        <Card className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-8 shadow-xl space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Macronutrient Matrix</h4>
                            <div className="space-y-6">
                                <MacroBar label="Carbs" value={state.result.carbs} max={150} color="bg-amber-400" />
                                <MacroBar label="Protein" value={state.result.protein} max={60} color="bg-emerald-400" />
                                <MacroBar label="Fats" value={state.result.fats} max={50} color="bg-rose-400" />
                            </div>
                        </Card>
                    </div>

                    {/* Medical & Fitness Insights */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-8 shadow-xl space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-primary"><ShieldCheck className="h-5 w-5" /></div>
                                <h4 className="font-black text-xs uppercase tracking-widest text-[#1A365D] dark:text-white">{t.logic}</h4>
                            </div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                "{lang === 'en' ? state.result.logicEn : state.result.logicHi}"
                            </p>
                            {state.result.medicalAlertEn && (
                                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100/50 flex items-start gap-4">
                                    <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                                    <p className="text-xs font-black text-rose-700 dark:text-rose-300 leading-relaxed">
                                        {lang === 'en' ? state.result.medicalAlertEn : state.result.medicalAlertHi}
                                    </p>
                                </div>
                            )}
                        </Card>

                        <Card className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-8 shadow-xl space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl text-emerald-500"><Zap className="h-5 w-5" /></div>
                                <h4 className="font-black text-xs uppercase tracking-widest text-[#1A365D] dark:text-white">{t.subs}</h4>
                            </div>
                            <div className="space-y-3">
                                {(lang === 'en' ? state.result.substitutionsEn : state.result.substitutionsHi).map((sub: string, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{sub}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-6">
                        <Button className="h-20 w-full md:w-auto px-16 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
                           Sync to Ecosystem & Challenges ➔
                        </Button>
                    </div>
                </div>
            )}
            
            {!state?.result && !isAnalyzing && (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 opacity-30 animate-pulse">
                    <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-6">
                        <Zap className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Analytics Pulse Ready</h3>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroBar({ label, value, max, color }: any) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        <span className="text-xs font-black text-[#1A365D] dark:text-white">{value}g</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <div className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
