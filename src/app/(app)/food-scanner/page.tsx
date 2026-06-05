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
  Stethoscope,
  Dumbbell,
  ChevronDown,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  Scan,
  HeartPulse,
  Info,
  Search,
  Ban
} from 'lucide-react';
import { analyzeFoodAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

const initialAnalysisState = { result: null, error: null, timestamp: 0 };

export default function FoodScannerPage() {
  const [state, formAction, isAnalyzing] = useActionState(analyzeFoodAction, initialAnalysisState);
  const [preview, setPreview] = useState<string | null>(null);
  const [textLabel, setTextLabel] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  
  // Pillar 1 & 2 Local States (Optional)
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!textLabel.trim()) {
        toast({ 
            variant: 'destructive', 
            title: lang === 'en' ? "Identify Meal" : "भोजन की पहचान करें", 
            description: lang === 'en' ? "Please type what you are scanning or searching." : "कृपया लिखें कि आप क्या स्कैन या सर्च कर रहे हैं।" 
        });
        return;
    }
    const formData = new FormData();
    if (preview) formData.set('imageDataUri', preview);
    formData.set('textQuery', textLabel);
    formData.set('language', lang);
    // These are now optional but passed if filled
    formData.set('healthMirrorProfile', healthMirror);
    formData.set('mainGoal', mainGoal);
    formData.set('workoutRegimen', workout);
    formData.set('dietaryProtocol', protocol);
    startTransition(() => { formAction(formData); });
  };

  const t = {
    en: {
        title: "Nutri-Scan",
        slogan: "Precision Clinical Intelligence",
        medicalTitle: "Personal Health Mirror (Optional)",
        medicalDesc: "Mention any allergies or conditions for safer results...",
        fitnessTitle: "Fitness Context (Optional)",
        placeholder: "Type your meal (e.g., 2 Rotis with Dal)",
        startBtn: "Analyze Meal",
        logic: "Clinical Biological Logic",
        subs: "Recommended Safe Alternatives",
        compatibility: "Health Alignment",
        guarantee: "Standardized Range-Based Analysis",
        idealFor: "Ideal For",
        precautions: "Safety Warnings",
        searchHeader: "Search or Scan",
        optionalTag: "Optional: Better accuracy if filled"
    },
    hi: {
        title: "न्यूट्री-स्कैन",
        slogan: "सटीक क्लिनिकल इंटेलिजेंस",
        medicalTitle: "व्यक्तिगत स्वास्थ्य दर्पण (वैकल्पिक)",
        medicalDesc: "सुरक्षित परिणामों के लिए अपनी एलर्जी या बीमारियों का उल्लेख करें...",
        fitnessTitle: "फिटनेस संदर्भ (वैकल्पिक)",
        placeholder: "अपना भोजन लिखें (जैसे: 2 रोटी और दाल)",
        startBtn: "भोजन का विश्लेषण करें",
        logic: "क्लिनिकल बायोलॉजिकल लॉजिक",
        subs: "अनुशंसित सुरक्षित विकल्प",
        compatibility: "स्वास्थ्य अनुकूलता",
        guarantee: "मानकीकृत रेंज-आधारित विश्लेषण",
        idealFor: "इनके लिए उत्तम",
        precautions: "सुरक्षा चेतावनियाँ",
        searchHeader: "सर्च या स्कैन",
        optionalTag: "वैकल्पिक: भरने पर बेहतर परिणाम"
    }
  }[lang];

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] pb-32 animate-in fade-in duration-500 font-body overflow-y-auto scrollbar-hide">
      
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-4 bg-white/40 dark:bg-[#1e1f20]/40 backdrop-blur-xl border-b border-white/20 dark:border-[#3c4043] safe-top">
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
                  <h1 className="text-lg font-black text-[#1A365D] dark:text-white leading-tight truncate">{t.title}</h1>
              </div>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">{t.slogan}</p>
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-slate-800/60 p-1 rounded-full border border-white/20 shadow-inner flex items-center gap-1 shrink-0">
            <button onClick={() => setLang('en')} className={cn("rounded-full px-4 py-1.5 text-[9px] font-black uppercase transition-all duration-300", lang === 'en' ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-600")}>EN</button>
            <button onClick={() => setLang('hi')} className={cn("rounded-full px-4 py-1.5 text-[9px] font-black uppercase transition-all duration-300", lang === 'hi' ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-600")}>हिन्दी</button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">

        {/* Big Search Bar - Primary Input */}
        <section className="space-y-4">
            <div className="px-2 flex items-center justify-between">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-100">{t.searchHeader}</h2>
                <Badge variant="outline" className="text-[7px] font-black uppercase bg-primary/5 text-primary border-primary/10">v2.1 Stable</Badge>
            </div>
            <form onSubmit={onFormSubmit} className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center text-slate-300 group-focus-within:text-primary transition-colors">
                    <Search className="h-5 w-5" />
                </div>
                <Input 
                    value={textLabel} 
                    onChange={(e) => setTextLabel(e.target.value)} 
                    placeholder={t.placeholder} 
                    className="rounded-[2.5rem] h-20 pl-16 pr-8 bg-white dark:bg-slate-900 border-none shadow-2xl text-lg font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700 focus-visible:ring-4 focus-visible:ring-primary/10 transition-all" 
                />
            </form>
        </section>

        {/* Camera/Gallery Options */}
        {!preview && (
            <section className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => cameraInputRef.current?.click()}
                    className="h-32 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 shadow-lg border border-white dark:border-slate-800 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group"
                >
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1A365D] dark:text-white">Live Scan</span>
                    <input type="file" ref={cameraInputRef} hidden accept="image/*" capture="environment" onChange={handleFileChange} />
                </button>

                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="h-32 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 shadow-lg border border-white dark:border-slate-800 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group"
                >
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1A365D] dark:text-white">Upload</span>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                </button>
            </section>
        )}

        {/* Optional Health Profile Settings */}
        <section className="space-y-4">
            <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="w-full flex items-center justify-between p-6 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-sm border border-white/40 active:scale-[0.98] transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <UserCheck className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-[11px] font-black text-[#1A365D] dark:text-white uppercase tracking-wider">{t.medicalTitle}</h3>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">{t.optionalTag}</p>
                    </div>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform duration-500", showSettings && "rotate-180")} />
            </button>

            {showSettings && (
                <div className="p-8 rounded-[3rem] bg-white dark:bg-slate-900/80 shadow-2xl border border-white/40 space-y-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-1">
                            <Stethoscope className="h-4 w-4 text-rose-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-300">Health Mirroring</h4>
                        </div>
                        <Textarea 
                            value={healthMirror}
                            onChange={(e) => setHealthMirror(e.target.value)}
                            placeholder={t.medicalDesc}
                            className="rounded-[1.8rem] bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner min-h-[100px] font-bold text-sm p-5"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-1">
                             <Dumbbell className="h-4 w-4 text-emerald-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-300">Fitness Goals</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black uppercase text-slate-400 ml-4">Main Goal</label>
                                <Select value={mainGoal} onValueChange={setMainGoal}>
                                    <SelectTrigger className="rounded-2xl h-14 bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner font-bold text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-2xl bg-white dark:bg-slate-900 border-none">
                                        <SelectItem value="Maintain Health">Maintain Health</SelectItem>
                                        <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                                        <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black uppercase text-slate-400 ml-4">Activity</label>
                                <Select value={workout} onValueChange={setWorkout}>
                                    <SelectTrigger className="rounded-2xl h-14 bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner font-bold text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-2xl bg-white dark:bg-slate-900 border-none">
                                        <SelectItem value="Sedentary">No Exercise</SelectItem>
                                        <SelectItem value="Yoga/Light">Light Activity</SelectItem>
                                        <SelectItem value="Heavy Weights">Heavy Lifting</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>

        {/* Preview & Submit Action */}
        {preview && (
            <section className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="relative aspect-video rounded-[3rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-black/5 flex items-center justify-center">
                    <Image src={preview} alt="Meal" fill className="object-cover" />
                    {isAnalyzing && (
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <div className="absolute left-0 right-0 h-1.5 bg-primary shadow-[0_0_30px_rgba(36,136,232,1)] animate-scan-line z-30" />
                            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                        </div>
                    )}
                    <Button size="icon" variant="destructive" className={cn("absolute top-6 right-6 rounded-full h-11 w-11 z-40 shadow-2xl", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>
            </section>
        )}

        <Button onClick={() => onFormSubmit({ preventDefault: () => {} } as any)} disabled={isAnalyzing || !textLabel.trim()} className="w-full h-20 rounded-[2.8rem] bg-primary hover:bg-primary/90 text-white font-black uppercase text-[13px] tracking-[0.3em] shadow-[0_25px_50px_-15px_rgba(36,136,232,0.4)] active:scale-95 transition-all">
            {isAnalyzing ? <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Analyzing Nutrition...</> : t.startBtn}
        </Button>

        {/* Results View */}
        {state?.result && (
            <div className="space-y-10 animate-in slide-in-from-bottom-10 duration-700 pb-20 pt-6">
                
                {/* 1. Header & Identity */}
                <section className="flex flex-col items-center text-center gap-6">
                    <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-inner">
                        <Utensils className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-[#1A365D] dark:text-white leading-tight tracking-tight">{state.result.name}</h2>
                        <div className={cn(
                            "inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                            state.result.medicalAlertEn ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        )}>
                            {state.result.medicalAlertEn ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            {lang === 'en' ? state.result.compatibilityTagEn : state.result.compatibilityTagHi}
                        </div>
                    </div>
                </section>

                {/* 2. Critical Medical Warning (If Applicable) */}
                {state.result.medicalAlertEn && (
                    <Alert variant="destructive" className="rounded-[2.5rem] border-none bg-red-500 text-white p-8 animate-pulse shadow-2xl">
                        <div className="flex flex-col items-center text-center gap-3">
                            <Ban className="h-10 w-10 mb-2" />
                            <AlertTitle className="text-xl font-black uppercase tracking-widest">Medical Warning</AlertTitle>
                            <AlertDescription className="text-sm font-bold leading-relaxed">
                                {lang === 'en' ? state.result.medicalAlertEn : state.result.medicalAlertHi}
                            </AlertDescription>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mt-2">Recommended: Use alternatives below</p>
                        </div>
                    </Alert>
                )}

                {/* 3. Energy Meter */}
                <section className="w-full p-8 rounded-[3rem] bg-white dark:bg-slate-900 shadow-xl border border-white/40 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute right-0 top-0 h-full w-32 bg-primary/5 -skew-x-[25deg] translate-x-12" />
                    <div className="flex items-center gap-5 relative z-10">
                        <div className="h-16 w-16 rounded-[1.8rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <Zap className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Calories</p>
                            <p className="text-3xl font-black text-[#1A365D] dark:text-white mt-0.5">{state.result.calories}</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 text-primary bg-primary/5 px-3 py-1.5 rounded-full">Range View</Badge>
                </section>

                {/* 4. Macros Grid */}
                <section className="grid grid-cols-3 gap-4">
                    <MacroTile label="Carbs" val={state.result.carbs} color="bg-amber-400" />
                    <MacroTile label="Protein" val={state.result.protein} color="bg-emerald-400" />
                    <MacroTile label="Fats" val={state.result.fats} color="bg-rose-400" />
                </section>

                {/* 5. Biological Logic & Ideal For */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 px-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.logic}</h4>
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-6 rounded-[2.5rem] border border-white/40 italic">
                            "{lang === 'en' ? state.result.logicEn : state.result.logicHi}"
                        </p>
                    </div>

                    <div className="p-6 rounded-[2.5rem] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-3">
                         <div className="flex items-center gap-2 mb-1">
                            <HeartPulse className="h-4 w-4 text-emerald-600" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">{t.idealFor}</h4>
                         </div>
                         <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 leading-relaxed">
                            {lang === 'en' 
                                ? "Great for active recovery and individuals with stable metabolism. Matches your fitness profile." 
                                : "सक्रिय रिकवरी और स्थिर मेटाबॉलिज्म वाले व्यक्तियों के लिए बढ़िया। आपके फिटनेस प्रोफाइल से मेल खाता है।"}
                         </p>
                    </div>
                </div>

                {/* 6. Personalized Substitutions / Alternatives */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-100">{t.subs}</h4>
                    </div>
                    <div className="grid gap-3">
                        {(lang === 'en' ? state.result.substitutionsEn : state.result.substitutionsHi).map((sub: string, i: number) => (
                            <div key={i} className="flex items-center gap-5 p-6 rounded-[2rem] bg-white dark:bg-slate-900 shadow-lg border border-white/40 group active:scale-[0.98] transition-all">
                                <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <ChevronRight className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{sub}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final Disclaimer */}
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

function MacroTile({ label, val, color }: any) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-lg border border-white/40 transition-all duration-300">
      <div className={cn("h-1 w-8 rounded-full", color)} />
      <div className="text-center">
        <p className="text-sm font-black text-[#1A365D] dark:text-white leading-tight">{val}</p>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{label}</p>
      </div>
    </div>
  );
}
