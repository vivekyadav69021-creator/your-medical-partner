'use client';

import React, { useActionState, useRef, useState, useEffect, startTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Search, 
  Loader2, 
  X, 
  Flame, 
  Activity,
  ArrowLeft,
  CheckCircle2,
  Utensils,
  Scale,
  ShieldCheck,
  AlertCircle,
  UserCheck,
  Zap,
  Sparkles
} from 'lucide-react';
import { analyzeFoodAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { cn } from "@/lib/utils";
import Link from 'next/link';

const initialAnalysisState = { result: null, error: null, timestamp: 0 };

export default function FoodScannerPage() {
  const [state, formAction, isAnalyzing] = useActionState(analyzeFoodAction, initialAnalysisState);
  const [preview, setPreview] = useState<string | null>(null);
  const [textQuery, setTextQuery] = useState('');
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.result && !state?.error && state?.timestamp > 0) {
      toast({ title: lang === 'en' ? "Calculation Perfect ✨" : "गणना बिल्कुल सटीक है ✨" });
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

  const onFormSubmit = (formData: FormData) => {
    if (preview) formData.set('imageDataUri', preview);
    formData.set('language', lang);
    startTransition(() => { formAction(formData); });
  };

  const handleSyncEcosystem = () => {
    if (!state?.result) return;
    toast({
      title: "Health Ecosystem Synced",
      description: "Data added to your nutrition log and challenges.",
    });
  };

  const t = {
    en: {
        title: "Nutri-Scan",
        slogan: "Smart Food Analysis",
        placeholder: "E.g., 1 Plate Dal Khichdi...",
        startBtn: "Analyze Meal",
        nutrients: "Nutrient Breakdown",
        calories: "Total KCAL",
        logic: "Biological Logic",
        ideal: "Ideal For",
        precautions: "Precautions",
        sync: "Add to My Day & Trigger Challenges ➔",
        guarantee: "Deterministic Nutritional Intelligence"
    },
    hi: {
        title: "न्यूट्री-स्कैन",
        slogan: "स्मार्ट आहार विश्लेषण",
        placeholder: "जैसे: १ प्लेट दाल खिचड़ी...",
        startBtn: "भोजन का विश्लेषण करें",
        nutrients: "पोषक तत्वों का विवरण",
        calories: "कुल कैलोरी",
        logic: "जैविक तर्क",
        ideal: "इनके लिए उपयुक्त",
        precautions: "सावधानियां",
        sync: "मेरे दिन में जोड़ें और चुनौती शुरू करें ➔",
        guarantee: "सटीक पोषण संबंधी बुद्धिमत्ता"
    }
  }[lang];

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] pb-32 animate-in fade-in duration-1000 font-body overflow-y-auto overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
        
        {/* Module A: The Input Zone Header */}
        <div className="flex items-center justify-between gap-4 p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-white/40 dark:border-slate-800/40 mx-1 safe-top">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Link href="/dashboard" className="shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-slate-800 shadow-sm h-10 w-10">
                <ArrowLeft className="h-5 w-5 text-[#1A365D] dark:text-white" />
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
            <button 
                onClick={() => setLang('en')}
                className={cn("rounded-full px-4 py-1.5 text-[10px] font-black uppercase transition-all duration-300", lang === 'en' ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-600")}
            >EN</button>
            <button 
                onClick={() => setLang('hi')}
                className={cn("rounded-full px-4 py-1.5 text-[10px] font-black uppercase transition-all duration-300", lang === 'hi' ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-600")}
            >हिन्दी</button>
          </div>
        </div>

        {/* Desktop Balanced 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-1">
          
          {/* Column 1: Input Zone (Desktop: col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[3rem] border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 h-fit">
               <div className="relative mb-6">
                {!preview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-[2.5rem] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-5 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer hover:bg-primary/5 transition-all group active:scale-95"
                  >
                    <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Scan Your Plate</p>
                    <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                  </div>
                ) : (
                  <div className="relative aspect-square rounded-[2.5rem] overflow-hidden group shadow-xl">
                    <Image src={preview} alt="Meal" fill className="object-cover" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 z-20 pointer-events-none">
                        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_rgba(36,136,232,1)] animate-scan-line" />
                      </div>
                    )}
                    {!isAnalyzing && (
                      <Button size="icon" variant="destructive" className="absolute top-4 right-4 rounded-full h-10 w-10 z-30 shadow-2xl" onClick={() => setPreview(null)}><X className="h-5 w-5" /></Button>
                    )}
                  </div>
                )}
              </div>

              <form action={onFormSubmit} className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input 
                      name="textQuery"
                      value={textQuery}
                      onChange={(e) => setTextQuery(e.target.value)}
                      placeholder={t.placeholder} 
                      className="rounded-2xl h-14 pl-14 bg-slate-50 dark:bg-slate-800 border-none shadow-inner text-sm font-bold"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isAnalyzing || (!preview && !textQuery.trim())}
                    className="w-full h-14 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-[0.25em] shadow-lg active:scale-95 transition-all"
                  >
                    {isAnalyzing ? <><Loader2 className="mr-3 h-4 w-4 animate-spin" /> Analyzing...</> : t.startBtn}
                  </Button>
                </form>
            </Card>

            <Alert className="rounded-[2.5rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-6">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <p className="text-[9px] font-black uppercase text-blue-400 tracking-wider text-center">{t.guarantee}</p>
            </Alert>
          </div>

          {/* Module B & C Results (Desktop: col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            {!state?.result && !isAnalyzing ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 opacity-30 animate-pulse">
                    <div className="h-24 w-24 bg-slate-200 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center mb-6">
                        <Utensils className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">Analytics Engine Ready</h3>
                </div>
            ) : state?.result && (
                <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
                    
                    {/* Module B: Nutrient Breakdown Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Energy Circle */}
                        <Card className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-10 shadow-xl flex flex-col items-center justify-center text-center">
                            <div className="relative h-48 w-48 flex items-center justify-center">
                                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" strokeDasharray={552} strokeDashoffset={552 * (1 - 0.7)} strokeLinecap="round" fill="transparent" className="text-primary" />
                                </svg>
                                <div className="relative z-10">
                                    <p className="text-5xl font-black text-[#1A365D] dark:text-white">{state.result.calories}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.calories}</p>
                                </div>
                            </div>
                            <h3 className="mt-8 text-xl font-black text-[#1A365D] dark:text-white line-clamp-1">{state.result.name}</h3>
                        </Card>

                        {/* Macro Bars */}
                        <Card className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-8 shadow-xl space-y-8">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">{t.nutrients}</h4>
                            <div className="space-y-6">
                                <MacroBar label={lang === 'en' ? "Carbs" : "कार्ब्स"} value={state.result.carbs} max={300} color="bg-amber-400" />
                                <MacroBar label={lang === 'en' ? "Protein" : "प्रोटीन"} value={state.result.protein} max={150} color="bg-emerald-400" />
                                <MacroBar label={lang === 'en' ? "Fats" : "फैट्स"} value={state.result.fats} max={100} color="bg-rose-400" />
                            </div>
                        </Card>
                    </div>

                    {/* Module C: Biological Logic & Advice */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-8 shadow-xl space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-primary">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <h4 className="font-black text-sm uppercase tracking-widest text-[#1A365D] dark:text-white">{t.logic}</h4>
                            </div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                "{lang === 'en' ? state.result.logicEn : state.result.logicHi}"
                            </p>
                            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-4 w-4 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Expert Tip</span>
                                </div>
                                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{lang === 'en' ? state.result.tipEn : state.result.tipHi}</p>
                            </div>
                        </Card>

                        <Card className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-8 shadow-xl space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <UserCheck className="h-5 w-5 text-purple-500" />
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">{t.ideal}</h4>
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{lang === 'en' ? state.result.idealForEn : state.result.idealForHi}</p>
                            </div>
                            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5 text-rose-500" />
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400">{t.precautions}</h4>
                                </div>
                                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 leading-relaxed">{lang === 'en' ? state.result.precautionsEn : state.result.precautionsHi}</p>
                            </div>
                        </Card>
                    </div>

                    {/* Module D: Friendship Callback Bridge */}
                    <div className="flex flex-col items-center gap-4 pt-6">
                        <Button 
                            onClick={handleSyncEcosystem}
                            className="h-20 w-full md:w-auto px-16 rounded-[2.5rem] bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-all group"
                        >
                            {t.sync}
                        </Button>
                    </div>
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
        <span className="text-[11px] font-black uppercase tracking-widest text-[#1A365D] dark:text-slate-300">{label}</span>
        <span className="text-sm font-black text-[#1A365D] dark:text-white">{value}g</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-lg", color)} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}
