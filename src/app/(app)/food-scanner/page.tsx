'use client';

import React, { useActionState, useRef, useState, useEffect, startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
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
  Info
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
  const [textLabel, setTextLabel] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  
  // Pillar 1 & 2 Local States
  const [healthMirror, setHealthMirror] = useState('');
  const [mainGoal, setMainGoal] = useState('Weight Loss');
  const [workout, setWorkout] = useState('Sedentary');
  const [protocol, setProtocol] = useState('Clean Eating');
  const [showSettings, setShowSettings] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.result && !state?.error && state?.timestamp > 0) {
      toast({ title: lang === 'en' ? "Approximate Analysis Ready ✨" : "अनुमानित विश्लेषण तैयार है ✨" });
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
        // Scroll to top to focus on preview
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
            description: lang === 'en' ? "Please type what you are scanning." : "कृपया लिखें कि आप क्या स्कैन कर रहे हैं।" 
        });
        return;
    }
    const formData = new FormData();
    if (preview) formData.set('imageDataUri', preview);
    formData.set('textQuery', textLabel);
    formData.set('language', lang);
    formData.set('healthMirrorProfile', healthMirror);
    formData.set('mainGoal', mainGoal);
    formData.set('workoutRegimen', workout);
    formData.set('dietaryProtocol', protocol);
    startTransition(() => { formAction(formData); });
  };

  const t = {
    en: {
        title: "Nutri-Scan",
        slogan: "Medical Grade Food Intelligence",
        medicalTitle: "Health Profile Mirroring",
        medicalDesc: "Mention conditions, allergies, or concerns...",
        fitnessTitle: "Fitness Goal Fulfillment",
        placeholder: "What are you scanning? (e.g., 1 bowl Dal Rice)",
        startBtn: "Identify & Analyze",
        logic: "Clinical Biological Logic",
        subs: "Goal-Based Substitutes",
        compatibility: "Medical Alignment",
        guarantee: "Deterministic Range Intelligence Only",
        idealFor: "Ideal For",
        precautions: "Precautions"
    },
    hi: {
        title: "न्यूट्री-स्कैन",
        slogan: "मेडिकल ग्रेड आहार इंटेलिजेंस",
        medicalTitle: "हेल्थ प्रोफाइल मिररिंग",
        medicalDesc: "अपनी बीमारियां या एलर्जी यहाँ लिखें...",
        fitnessTitle: "फिटनेस लक्ष्य पूर्ति",
        placeholder: "आप क्या स्कैन कर रहे हैं? (जैसे: 1 कटोरी दाल चावल)",
        startBtn: "पहचानें और विश्लेषण करें",
        logic: "क्लिनिकल बायोलॉजिकल लॉजिक",
        subs: "लक्ष्य-आधारित बेहतर विकल्प",
        compatibility: "मेडिकल अनुकूलता",
        guarantee: "केवल सटीक रेंज इंटेलिजेंस",
        idealFor: "इनके लिए उत्तम",
        precautions: "सावधानियां"
    }
  }[lang];

  return (
    <div className="min-h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] pb-32 animate-in fade-in duration-500 font-body overflow-y-auto scrollbar-hide">
      
      {/* Header - Native Feel */}
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
                  <div className="relative">
                      <Utensils className="h-5 w-5 text-primary" />
                      <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-full" />
                  </div>
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

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-8">

        {/* Profile Settings - Android Style Expansion */}
        <section className="space-y-4">
            <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="w-full flex items-center justify-between p-6 rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm border border-white/40 active:scale-[0.98] transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary relative overflow-hidden">
                        <UserCheck className="h-6 w-6 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-[13px] font-black text-[#1A365D] dark:text-white uppercase tracking-wider">Health Profile</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Medical & Fitness Context</p>
                    </div>
                </div>
                <ChevronDown className={cn("h-5 w-5 text-slate-400 transition-transform duration-500", showSettings && "rotate-180")} />
            </button>

            {showSettings && (
                <div className="p-8 rounded-[3rem] bg-white dark:bg-slate-900/80 shadow-xl border border-white/40 space-y-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-1">
                            <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner">
                                <Stethoscope className="h-4 w-4" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-300">{t.medicalTitle}</h4>
                        </div>
                        <Textarea 
                            value={healthMirror}
                            onChange={(e) => setHealthMirror(e.target.value)}
                            placeholder={t.medicalDesc}
                            className="rounded-[1.8rem] bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner min-h-[120px] font-bold text-sm p-5 text-slate-700 dark:text-slate-200"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-1">
                             <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-inner">
                                <Dumbbell className="h-4 w-4" />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-300">{t.fitnessTitle}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black uppercase text-slate-400 ml-4 tracking-tighter">Main Goal</label>
                                <Select value={mainGoal} onValueChange={setMainGoal}>
                                    <SelectTrigger className="rounded-2xl h-14 bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner font-bold text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border-none">
                                        <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                                        <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                                        <SelectItem value="Endurance">Endurance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[8px] font-black uppercase text-slate-400 ml-4 tracking-tighter">Workout</label>
                                <Select value={workout} onValueChange={setWorkout}>
                                    <SelectTrigger className="rounded-2xl h-14 bg-slate-50 dark:bg-slate-800/50 border-none shadow-inner font-bold text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent className="rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border-none">
                                        <SelectItem value="Heavy Weights">Heavy Lifting</SelectItem>
                                        <SelectItem value="Yoga">Yoga</SelectItem>
                                        <SelectItem value="Sedentary">No Exercise</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>

        {/* Action Grid - Android Material Style */}
        {!preview && (
            <section className="grid grid-cols-2 gap-6">
                <button 
                    onClick={() => cameraInputRef.current?.click()}
                    className="aspect-square rounded-[3.5rem] bg-white/80 dark:bg-slate-900/60 shadow-xl border border-white dark:border-slate-800 flex flex-col items-center justify-center gap-5 active:scale-95 transition-all duration-500 group overflow-hidden relative"
                >
                    <div className="h-20 w-20 bg-primary/10 rounded-[2.2rem] flex items-center justify-center text-primary shadow-inner border border-primary/5 transition-transform duration-700 group-hover:rotate-6">
                        <Camera className="w-10 h-10" />
                    </div>
                    <div className="text-center space-y-1">
                        <span className="text-[12px] font-black uppercase tracking-widest text-[#1A365D] dark:text-white">Camera</span>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Live Vision</p>
                    </div>
                    <input type="file" ref={cameraInputRef} hidden accept="image/*" capture="environment" onChange={handleFileChange} />
                </button>

                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-[3.5rem] bg-white/80 dark:bg-slate-900/60 shadow-xl border border-white dark:border-slate-800 flex flex-col items-center justify-center gap-5 active:scale-95 transition-all duration-500 group overflow-hidden relative"
                >
                    <div className="h-20 w-20 bg-primary/10 rounded-[2.2rem] flex items-center justify-center text-primary shadow-inner border border-primary/5 transition-transform duration-700 group-hover:rotate-6">
                        <ImageIcon className="w-10 h-10" />
                    </div>
                    <div className="text-center space-y-1">
                        <span className="text-[12px] font-black uppercase tracking-widest text-[#1A365D] dark:text-white">Gallery</span>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">Upload Image</p>
                    </div>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                </button>
            </section>
        )}

        {/* Input & Scanning Phase */}
        {preview && (
            <section className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="relative aspect-[4/3] rounded-[3.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-black/5 flex items-center justify-center group">
                    <Image src={preview} alt="Meal" fill className="object-cover" />
                    {isAnalyzing && (
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <div className="absolute left-0 right-0 h-1.5 bg-primary shadow-[0_0_30px_rgba(36,136,232,1)] animate-scan-line z-30" />
                            <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                        </div>
                    )}
                    {!isAnalyzing && (
                        <Button size="icon" variant="destructive" className="absolute top-6 right-6 rounded-full h-11 w-11 z-40 shadow-2xl active:scale-90" onClick={() => setPreview(null)}>
                            <X className="h-6 w-6" />
                        </Button>
                    )}
                </div>

                <form onSubmit={onFormSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">Meal Identification *</label>
                            <Badge variant="outline" className="text-[7px] font-black uppercase border-primary/20 text-primary">Mandatory</Badge>
                        </div>
                        <div className="relative group">
                            <Utensils className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                            <Input 
                                value={textLabel} 
                                onChange={(e) => setTextLabel(e.target.value)} 
                                placeholder={t.placeholder} 
                                className="rounded-[2.5rem] h-20 pl-16 pr-8 bg-white dark:bg-slate-900 border-none shadow-xl text-lg font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700 focus-visible:ring-4 focus-visible:ring-primary/10 transition-all" 
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={isAnalyzing || !textLabel.trim()} className="w-full h-20 rounded-[2.8rem] bg-primary hover:bg-primary/90 text-white font-black uppercase text-[13px] tracking-[0.3em] shadow-[0_25px_50px_-15px_rgba(36,136,232,0.4)] active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Assessing Bio-Load...</> : t.startBtn}
                    </Button>
                </form>
            </section>
        )}

        {/* Advanced Clinical Results Dashboard */}
        {state?.result && (
            <div className="space-y-12 animate-in slide-in-from-bottom-10 duration-700 pb-20 pt-6">
                
                {/* Visual Report Header */}
                <section className="flex flex-col items-center text-center gap-6">
                    <div className="h-24 w-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center border border-primary/20 shadow-inner relative">
                        <Utensils className="h-12 w-12 text-primary" />
                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-950" />
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

                {/* The "Safe" Energy Meter */}
                <section className="space-y-4">
                    <div className="w-full p-8 rounded-[3rem] bg-white dark:bg-slate-900 shadow-xl border border-white/40 flex items-center justify-between relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-full w-32 bg-primary/5 -skew-x-[25deg] translate-x-12" />
                        <div className="flex items-center gap-5 relative z-10">
                            <div className="h-16 w-16 rounded-[1.8rem] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                <Zap className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Energy Estimate</p>
                                <p className="text-3xl font-black text-[#1A365D] dark:text-white mt-0.5">{state.result.calories}</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20 text-primary bg-primary/5 px-3 py-1.5 rounded-full relative z-10">Realistic Range</Badge>
                    </div>

                    {/* Macro Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <MacroTile label="Carbs" val={state.result.carbs} color="bg-amber-400" iconBg="bg-amber-50" />
                        <MacroTile label="Protein" val={state.result.protein} color="bg-emerald-400" iconBg="bg-emerald-50" />
                        <MacroTile label="Fats" val={state.result.fats} color="bg-rose-400" iconBg="bg-rose-50" />
                    </div>
                </section>

                {/* Specialized Medical Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Biological Logic */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 px-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-400">{t.logic}</h4>
                        </div>
                        <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-loose bg-white/60 dark:bg-slate-900/60 p-7 rounded-[2.8rem] border border-white/40 italic shadow-sm">
                            "{lang === 'en' ? state.result.logicEn : state.result.logicHi}"
                        </p>
                    </div>

                    {/* Ideal For & Precautions */}
                    <div className="space-y-6">
                        <div className="p-7 rounded-[2.8rem] bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-3">
                             <div className="flex items-center gap-2 mb-2">
                                <HeartPulse className="h-4 w-4 text-emerald-600" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">{t.idealFor}</h4>
                             </div>
                             <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300 leading-relaxed">
                                {lang === 'en' ? "Athletes, individuals with high metabolic activity, and those without glucose sensitivity." : "एथलीट, सक्रिय लोग और वे व्यक्ति जिन्हें शुगर की समस्या नहीं है।"}
                             </p>
                        </div>

                        <div className="p-7 rounded-[2.8rem] bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 space-y-3">
                             <div className="flex items-center gap-2 mb-2">
                                <Info className="h-4 w-4 text-rose-600" />
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-700 dark:text-rose-400">{t.precautions}</h4>
                             </div>
                             <p className="text-sm font-bold text-rose-800 dark:text-rose-300 leading-relaxed">
                                {lang === 'en' ? "Avoid large portions before bedtime. If diabetic, check glycemic load." : "सोने से पहले बड़ी मात्रा में न लें। यदि मधुमेह है, तो मात्रा का ध्यान रखें।"}
                             </p>
                        </div>
                    </div>
                </div>

                {/* Goal Alignment & Substitutes */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-400">{t.subs}</h4>
                    </div>
                    <div className="grid gap-3">
                        {(lang === 'en' ? state.result.substitutionsEn : state.result.substitutionsHi).map((sub: string, i: number) => (
                            <div key={i} className="flex items-center gap-5 p-6 rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm border border-white/40 group active:bg-primary/5 transition-all">
                                <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                    <ChevronRight className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{sub}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Medical Disclaimer Alert */}
                <Alert className="rounded-[3rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-8 border-dashed border-2 border-blue-100 dark:border-blue-800">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <ShieldCheck className="h-8 w-8 text-primary opacity-40" />
                        <p className="text-[10px] font-black uppercase text-blue-500/80 tracking-[0.3em] leading-relaxed">
                            {t.guarantee}
                        </p>
                    </div>
                </Alert>

                {/* Floating Bottom Action */}
                <div className="fixed bottom-8 left-0 right-0 px-6 z-[60] pointer-events-none">
                    <div className="max-w-2xl mx-auto pointer-events-auto">
                        <Button className="w-full h-16 rounded-[2.5rem] bg-primary text-white font-black uppercase text-[12px] tracking-[0.3em] shadow-[0_25px_50px_-10px_rgba(36,136,232,0.5)] active:scale-95 transition-all border-none">
                            Add to My Day ➔
                        </Button>
                    </div>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}

function MacroTile({ label, val, color, iconBg }: any) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-[2.8rem] bg-white dark:bg-slate-900/80 shadow-sm border border-white/40 active:border-primary/20 transition-all duration-300">
      <div className={cn("h-1.5 w-10 rounded-full", color)} />
      <div className="text-center">
        <p className="text-sm font-black text-[#1A365D] dark:text-white leading-tight">{val}</p>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{label}</p>
      </div>
    </div>
  );
}
