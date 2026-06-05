'use client';

import React, { useActionState, useRef, useState, useEffect, startTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Scan
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
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!textLabel.trim()) {
        toast({ variant: 'destructive', title: lang === 'en' ? "Label Required" : "नाम लिखना अनिवार्य है", description: lang === 'en' ? "Please tell us what you're scanning." : "कृपया हमें बताएं कि आप क्या स्कैन कर रहे हैं।" });
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
        title: "Nutri-Scan Pro",
        slogan: "Precision Food Intelligence",
        medicalTitle: "Pillar 1: Medical Mirroring",
        medicalDesc: "Mention conditions, allergies, or concerns...",
        fitnessTitle: "Pillar 2: Fitness Fulfillment",
        placeholder: "What are you scanning? (e.g., 1 bowl Dal Rice)",
        startBtn: "Analyze Meal",
        logic: "Body Processing Logic",
        subs: "Recommended Substitutes",
        compatibility: "Goal Alignment",
        guarantee: "Deterministic Range Intelligence"
    },
    hi: {
        title: "न्यूट्री-स्कैन प्रो",
        slogan: "सटीक आहार इंटेलिजेंस",
        medicalTitle: "पिलर 1: मेडिकल मिररिंग",
        medicalDesc: "अपनी बीमारियां या एलर्जी यहाँ लिखें...",
        fitnessTitle: "पिलर 2: फिटनेस गोल्स",
        placeholder: "आप क्या स्कैन कर रहे हैं? (जैसे: 1 कटोरी दाल चावल)",
        startBtn: "विश्लेषण शुरू करें",
        logic: "बॉडी प्रोसेसिंग लॉजिक",
        subs: "बेहतर आहार विकल्प",
        compatibility: "लक्ष्य अनुकूलता",
        guarantee: "सटीक रेंज इंटेलिजेंस"
    }
  }[lang];

  return (
    <div className="min-h-[100dvh] w-full bg-[#020617] pb-32 animate-in fade-in duration-500 font-body overflow-y-auto overflow-x-hidden relative text-white">
      
      {/* Native App Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/20 via-transparent to-transparent -z-10" />

      {/* Header - Fixed & Native */}
      <header className="sticky top-0 z-50 px-4 pt-4 pb-4 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 safe-top">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 hover:bg-white/10 transition-colors">
                <ArrowLeft className="h-5 w-5 text-white" />
              </Button>
            </Link>
            <div className="flex flex-col">
              <h1 className="text-lg font-black text-white leading-tight">{t.title}</h1>
              <p className="text-[8px] font-black text-primary uppercase tracking-[0.15em]">{t.slogan}</p>
            </div>
          </div>
          
          <div className="bg-white/10 p-1 rounded-full border border-white/10 flex items-center gap-1">
            <button onClick={() => setLang('en')} className={cn("rounded-full px-3 py-1 text-[9px] font-black uppercase transition-all", lang === 'en' ? "bg-primary text-white" : "text-slate-400")}>EN</button>
            <button onClick={() => setLang('hi')} className={cn("rounded-full px-3 py-1 text-[9px] font-black uppercase transition-all", lang === 'hi' ? "bg-primary text-white" : "text-slate-400")}>हिन्दी</button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-6 space-y-8">

        {/* Pillar Setup Section */}
        <section className="space-y-4">
            <button 
                onClick={() => setShowSettings(!showSettings)} 
                className="w-full flex items-center justify-between p-5 rounded-[2.5rem] bg-white/5 shadow-inner border border-white/5 active:scale-[0.98] transition-all"
            >
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/10">
                        <UserCheck className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-[12px] font-black text-white uppercase tracking-wider">Health Profile</h3>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Medical & Fitness Sync</p>
                    </div>
                </div>
                <ChevronDown className={cn("h-5 w-5 text-slate-600 transition-transform", showSettings && "rotate-180")} />
            </button>

            {showSettings && (
                <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Stethoscope className="h-4 w-4 text-rose-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.medicalTitle}</h4>
                        </div>
                        <Textarea 
                            value={healthMirror}
                            onChange={(e) => setHealthMirror(e.target.value)}
                            placeholder={t.medicalDesc}
                            className="rounded-2xl bg-white/5 border-none shadow-inner min-h-[100px] font-bold text-xs text-white"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Dumbbell className="h-4 w-4 text-emerald-500" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.fitnessTitle}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Select value={mainGoal} onValueChange={setMainGoal}>
                                <SelectTrigger className="rounded-xl h-11 bg-white/5 border-none shadow-inner font-bold text-[10px] text-white"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl bg-slate-900 border-white/10 text-white">
                                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                                    <SelectItem value="Endurance">Endurance</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={workout} onValueChange={setWorkout}>
                                <SelectTrigger className="rounded-xl h-11 bg-white/5 border-none shadow-inner font-bold text-[10px] text-white"><SelectValue /></SelectTrigger>
                                <SelectContent className="rounded-xl bg-slate-900 border-white/10 text-white">
                                    <SelectItem value="Heavy Weights">Heavy Lifting</SelectItem>
                                    <SelectItem value="Yoga">Yoga</SelectItem>
                                    <SelectItem value="Sedentary">No Exercise</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )}
        </section>

        {/* Primary Input Flow */}
        {!preview && (
            <section className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => cameraInputRef.current?.click()}
                    className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary to-blue-700 flex flex-col items-center justify-center gap-4 shadow-2xl active:scale-95 transition-all group"
                >
                    <div className="h-16 w-16 bg-white/20 rounded-[1.8rem] flex items-center justify-center text-white backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
                        <Camera className="w-8 h-8" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white">Open Camera</span>
                    <input type="file" ref={cameraInputRef} hidden accept="image/*" capture="environment" onChange={handleFileChange} />
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-[3rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-4 shadow-lg active:scale-95 transition-all group"
                >
                    <div className="h-16 w-16 bg-white/10 rounded-[1.8rem] flex items-center justify-center text-primary border border-white/5 group-hover:scale-110 transition-transform">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Upload Photo</span>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                </button>
            </section>
        )}

        {preview && (
            <section className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-black">
                    <Image src={preview} alt="Meal" fill className="object-cover" />
                    {isAnalyzing && (
                        <div className="absolute inset-0 z-20 pointer-events-none">
                            <div className="absolute left-0 right-0 h-1.5 bg-primary shadow-[0_0_25px_rgba(36,136,232,1)] animate-scan-line z-30" />
                            <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                        </div>
                    )}
                    {!isAnalyzing && (
                        <Button size="icon" variant="destructive" className="absolute top-4 right-4 rounded-full h-10 w-10 z-40" onClick={() => setPreview(null)}>
                            <X className="h-5 w-5" />
                        </Button>
                    )}
                </div>

                <form onSubmit={onFormSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary px-4">Identification Step *</label>
                        <Input 
                            value={textLabel} 
                            onChange={(e) => setTextLabel(e.target.value)} 
                            placeholder={t.placeholder} 
                            className="rounded-[2.2rem] h-16 px-8 bg-white/5 border-none shadow-inner text-base font-bold placeholder:text-slate-600 focus-visible:ring-2 focus-visible:ring-primary/40" 
                        />
                    </div>
                    <Button type="submit" disabled={isAnalyzing || !textLabel.trim()} className="w-full h-16 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-white font-black uppercase text-[12px] tracking-[0.25em] shadow-xl shadow-primary/20 active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Analyzing Biological Load...</> : t.startBtn}
                    </Button>
                </form>
            </section>
        )}

        {/* Results Flow */}
        {state?.result && (
            <div className="space-y-10 animate-in slide-in-from-bottom-10 duration-700 pb-20">
                
                {/* Visual Header */}
                <section className="flex flex-col items-center text-center gap-6 pt-6">
                    <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20">
                        <Utensils className="h-10 w-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white leading-tight tracking-tight">{state.result.name}</h2>
                        <div className={cn(
                            "inline-flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest",
                            state.result.medicalAlertEn ? "bg-rose-500/20 text-rose-400 border border-rose-500/20" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                        )}>
                            {state.result.medicalAlertEn ? <AlertCircle className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                            {lang === 'en' ? state.result.compatibilityTagEn : state.result.compatibilityTagHi}
                        </div>
                    </div>
                </section>

                {/* Macro Matrix - Range Data */}
                <section className="grid grid-cols-1 gap-4">
                    <RangeMetric label="Estimated Energy" value={state.result.calories} color="text-primary" icon={Zap} />
                    <div className="grid grid-cols-3 gap-3">
                        <MacroBox label="Carbs" val={state.result.carbs} color="bg-amber-400" />
                        <MacroBox label="Protein" val={state.result.protein} color="bg-emerald-400" />
                        <MacroBox label="Fats" val={state.result.fats} color="bg-rose-400" />
                    </div>
                </section>

                {/* Consumer Insights */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">{t.logic}</h4>
                        </div>
                        <p className="text-sm font-bold text-slate-300 leading-loose bg-white/5 p-6 rounded-[2.5rem] border border-white/5 italic">
                            "{lang === 'en' ? state.result.logicEn : state.result.logicHi}"
                        </p>
                    </div>

                    {state.result.medicalAlertEn && (
                        <div className="p-6 rounded-[2.5rem] bg-rose-500/10 border border-rose-500/20 flex items-start gap-4">
                            <AlertCircle className="h-6 w-6 text-rose-500 shrink-0 mt-1" />
                            <p className="text-xs font-black text-rose-300 leading-relaxed uppercase tracking-wider">
                                {lang === 'en' ? state.result.medicalAlertEn : state.result.medicalAlertHi}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">{t.subs}</h4>
                        </div>
                        <div className="space-y-3">
                            {(lang === 'en' ? state.result.substitutionsEn : state.result.substitutionsHi).map((sub: string, i: number) => (
                                <div key={i} className="flex items-center gap-4 p-5 rounded-[1.8rem] bg-white/5 border border-white/5 group active:bg-primary/10 transition-all">
                                    <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                                    <p className="text-xs font-bold text-slate-200">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-8 left-0 right-0 px-6 z-[60]">
                    <Button className="w-full h-16 rounded-[2.5rem] bg-primary text-white font-black uppercase text-[12px] tracking-[0.3em] shadow-[0_25px_50px_-10px_rgba(36,136,232,0.5)] active:scale-95 transition-all">
                        Add to My Day ➔
                    </Button>
                </div>
            </div>
        )}

        <section className="pt-10">
             <div className="p-8 rounded-[3rem] bg-primary/5 border border-primary/10 flex flex-col items-center gap-4 text-center">
                <Scan className="h-8 w-8 text-primary opacity-50" />
                <p className="text-[10px] font-black uppercase text-primary/60 tracking-[0.3em] max-w-[220px] leading-relaxed">
                    {t.guarantee}
                </p>
            </div>
        </section>

      </main>
    </div>
  );
}

function RangeMetric({ label, value, color, icon: Icon }: any) {
    return (
        <div className="w-full p-6 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center", color)}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                    <p className="text-xl font-black text-white mt-0.5">{value}</p>
                </div>
            </div>
            <div className="text-right">
                <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-primary/20 text-primary">Approx Range</Badge>
            </div>
        </div>
    )
}

function MacroBox({ label, val, color }: any) {
  return (
    <div className="flex flex-col items-center gap-3 p-5 rounded-[2.2rem] bg-white/5 border border-white/5 active:border-primary/20 transition-all">
      <div className={cn("h-2 w-8 rounded-full", color)} />
      <div className="text-center">
        <p className="text-[11px] font-black text-white leading-tight">{val}</p>
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">{label}</p>
      </div>
    </div>
  );
}
