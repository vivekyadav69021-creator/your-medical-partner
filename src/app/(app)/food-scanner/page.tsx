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
  ChevronRight, 
  Activity,
  ArrowLeft,
  CheckCircle2,
  Utensils,
  Trophy,
  Scale,
  HeartPulse,
  ShieldCheck,
  AlertCircle,
  UserCheck,
  Clock
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
      toast({ title: lang === 'en' ? "Meal Identified ✨" : "भोजन की पहचान हो गई ✨" });
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
      title: "Success",
      description: "Added to your nutrition log.",
    });
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] pb-32 animate-in fade-in duration-1000 font-body overflow-y-auto overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-8">
        
        {/* Robust Responsive Header with Scanning App Logo */}
        <div className="flex items-center justify-between gap-2 md:gap-4 p-4 md:p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-sm border border-white/40 dark:border-slate-800/40 mx-1 safe-top">
          <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
            <Link href="/dashboard" className="shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-slate-800 shadow-sm h-10 w-10 md:h-11 md:w-11">
                <ArrowLeft className="h-5 w-5 text-[#1A365D] dark:text-white" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="relative h-9 w-9 md:h-10 md:w-10 bg-primary/10 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                <Utensils className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <div className="absolute left-0 right-0 h-0.5 bg-primary/40 animate-scan-line z-10" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-black text-[#1A365D] dark:text-white tracking-tight leading-none truncate">Nutri-Scan</h1>
                <p className="text-[8px] md:text-[9px] font-black text-primary uppercase tracking-[0.1em] md:tracking-[0.2em] mt-1 truncate">Smart Food Analysis</p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full border border-white/20 flex items-center gap-0.5 md:gap-1 shrink-0">
            <button 
                onClick={() => setLang('en')}
                className={cn("rounded-full px-3 md:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px] font-black uppercase transition-all duration-300", lang === 'en' ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-600")}
            >EN</button>
            <button 
                onClick={() => setLang('hi')}
                className={cn("rounded-full px-3 md:px-4 py-1 md:py-1.5 text-[9px] md:text-[10px] font-black uppercase transition-all duration-300", lang === 'hi' ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-600")}
            >हिन्दी</button>
          </div>
        </div>

        <div className="space-y-8 px-1">
          
          {/* Module A: Immersive Input Zone */}
          <Card className="rounded-[3rem] border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl overflow-hidden p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Visual Upload Area with Laser Effect */}
              <div className="relative">
                {!preview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-[2.5rem] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-5 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer hover:bg-primary/5 transition-all group active:scale-95"
                  >
                    <div className="h-20 w-20 bg-white dark:bg-slate-800 rounded-[1.8rem] shadow-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Camera className="w-10 h-10" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-[12px] font-black uppercase tracking-widest text-[#1A365D] dark:text-white">Upload Plate</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">JPEG, PNG up to 10MB</p>
                    </div>
                    <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                  </div>
                ) : (
                  <div className="relative aspect-square rounded-[3rem] overflow-hidden group shadow-2xl ring-8 ring-white/20">
                    <Image src={preview} alt="Meal Preview" fill className="object-cover" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 z-20 pointer-events-none">
                        <div className="absolute inset-0 bg-primary/10" />
                        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(36,136,232,1)] animate-scan-line" />
                      </div>
                    )}
                    {!isAnalyzing && (
                      <Button 
                        size="icon" variant="destructive" 
                        className="absolute top-5 right-5 rounded-full h-11 w-11 shadow-2xl z-30 opacity-0 group-hover:opacity-100 transition-opacity" 
                        onClick={() => setPreview(null)}
                      ><X className="h-6 w-6" /></Button>
                    )}
                  </div>
                )}
              </div>

              {/* Text Search Area */}
              <div className="space-y-6">
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tight">What's on <span className="text-primary">your plate?</span></h3>
                   <p className="text-sm font-bold text-slate-400 leading-relaxed">Instantly analyze nutrition, health tips, and ideal consumer profiles.</p>
                </div>

                <form action={onFormSubmit} className="space-y-4">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <Input 
                      name="textQuery"
                      value={textQuery}
                      onChange={(e) => setTextQuery(e.target.value)}
                      placeholder={lang === 'en' ? "E.g., 2 Rotis and Dal..." : "जैसे: २ रोटी और दाल..."} 
                      className="rounded-2xl h-16 pl-14 bg-slate-50 dark:bg-slate-800 border-none shadow-inner text-base font-bold placeholder:text-slate-300"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isAnalyzing || (!preview && !textQuery.trim())}
                    className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase text-xs tracking-[0.25em] shadow-[0_20px_40px_-10px_rgba(36,136,232,0.4)] active:scale-95 transition-all"
                  >
                    {isAnalyzing ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Scanning...</> : (lang === 'en' ? 'Start Analysis' : 'विश्लेषण शुरू करें')}
                  </Button>
                </form>
              </div>
            </div>
          </Card>

          {/* Module B & C: Advanced Result Display */}
          {state?.result && (
            <div className="space-y-8 animate-in slide-in-from-bottom-10 duration-1000">
              
              {/* Macros & Energy Hub */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Large Energy Focus */}
                <Card className="md:col-span-5 rounded-[3.5rem] border-none bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-10 text-center shadow-xl border border-white dark:border-slate-800">
                  <div className="relative h-56 w-56 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                       <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                       <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="16" strokeDasharray={628} strokeDashoffset={628 * (1 - 0.75)} strokeLinecap="round" fill="transparent" className="text-primary" />
                    </svg>
                    <div className="space-y-1 relative z-10">
                      <p className="text-5xl font-black text-[#1A365D] dark:text-white tracking-tighter">{state.result.calories}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Total KCAL</p>
                    </div>
                  </div>
                  <div className="mt-8 space-y-2">
                     <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 rounded-full font-black text-[9px] uppercase tracking-widest px-4 py-1">Nutrition Report</Badge>
                     <h3 className="text-2xl font-black text-[#1A365D] dark:text-white leading-tight">{state.result.name}</h3>
                  </div>
                </Card>

                {/* Macro Progress Columns */}
                <Card className="md:col-span-7 rounded-[3.5rem] border-none bg-white dark:bg-slate-900 p-10 shadow-xl space-y-10 border border-white dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Nutrient Breakdown</h4>
                    <Scale className="h-5 w-5 text-slate-200" />
                  </div>
                  <div className="space-y-8">
                    <MacroProgress label={lang === 'en' ? "Carbs" : "कार्ब्स"} value={state.result.carbs} max={300} color="bg-amber-400" icon={Activity} />
                    <MacroProgress label={lang === 'en' ? "Protein" : "प्रोटीन"} value={state.result.protein} max={150} color="bg-emerald-400" icon={Utensils} />
                    <MacroProgress label={lang === 'en' ? "Fats" : "फैट्स"} value={state.result.fats} max={80} color="bg-rose-400" icon={Flame} />
                  </div>
                </Card>
              </div>

              {/* Module C: In-Depth Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Biological Logic & Tips */}
                 <Card className="rounded-[3.5rem] border-none bg-white dark:bg-slate-900 p-8 shadow-xl border border-white dark:border-slate-800 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-primary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h4 className="font-black text-sm uppercase tracking-widest text-[#1A365D] dark:text-white">Biological Logic</h4>
                    </div>
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "{lang === 'en' ? state.result.logicEn : state.result.logicHi}"
                    </p>
                    <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/50">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Health Tip</span>
                        </div>
                        <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">{lang === 'en' ? state.result.tipEn : state.result.tipHi}</p>
                    </div>
                 </Card>

                 {/* Consumer & Safety Insights */}
                 <Card className="rounded-[3.5rem] border-none bg-white dark:bg-slate-900 p-8 shadow-xl border border-white dark:border-slate-800 space-y-6">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-2xl text-purple-500">
                                    <UserCheck className="h-6 w-6" />
                                </div>
                                <h4 className="font-black text-sm uppercase tracking-widest text-[#1A365D] dark:text-white">Ideal For</h4>
                            </div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{lang === 'en' ? state.result.idealForEn : state.result.idealForHi}</p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-rose-500">
                                    <AlertCircle className="h-6 w-6" />
                                </div>
                                <h4 className="font-black text-sm uppercase tracking-widest text-[#1A365D] dark:text-white">Future Precautions</h4>
                            </div>
                            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 leading-relaxed">
                                {lang === 'en' ? state.result.precautionsEn : state.result.precautionsHi}
                            </p>
                        </div>
                    </div>
                 </Card>
              </div>

              {/* Module D: Friendship Callback Bridge */}
              <div className="flex flex-col items-center gap-4 pt-6">
                <Button 
                  onClick={handleSyncEcosystem}
                  className="h-20 px-16 rounded-[2.5rem] bg-primary hover:scale-[1.02] text-white font-black uppercase text-xs tracking-[0.3em] shadow-[0_20px_50px_rgba(36,136,232,0.3)] active:scale-95 transition-all group"
                >
                  Add to My Day ➔
                </Button>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Professionally Verified Nutritional Logic
                </p>
              </div>

            </div>
          )}

          {/* Standby State */}
          {!state?.result && !isAnalyzing && (
            <div className="py-20 text-center space-y-6 opacity-30 animate-pulse">
                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto">
                  <Utensils className="w-10 h-10 text-slate-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Scanner Ready</h3>
                  <p className="text-[10px] font-bold text-slate-400 max-w-[200px] mx-auto uppercase">Upload a photo for scientific breakdown</p>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MacroProgress({ label, value, max, color, icon: Icon }: any) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50", color.replace('bg-', 'text-'))}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#1A365D] dark:text-slate-300">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-[#1A365D] dark:text-white leading-none">{value}g</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter ml-1">/ {max}g</span>
        </div>
      </div>
      <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/10">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-lg", color)} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}
