'use client';

import React, { useActionState, useRef, useState, useEffect, startTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Search, 
  Loader2, 
  X, 
  ChefHat, 
  Flame, 
  ChevronRight, 
  Apple, 
  Zap, 
  Activity,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Utensils
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
      toast({ title: lang === 'en' ? "Meal Analyzed" : "भोजन का विश्लेषण पूरा हुआ" });
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
    startTransition(() => { formAction(formData); });
  };

  const handleSyncEcosystem = () => {
    if (!state?.result) return;
    toast({
      title: "Health Bridge Triggered",
      description: "Meal added to My Day. Reward streaks updated.",
      icon: <CheckCircle2 className="text-emerald-500" />
    });
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 pb-32 animate-in fade-in duration-700 font-body">
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 mx-1">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-full bg-slate-50 dark:bg-slate-800 shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tight leading-none">Food AI Scanner</h1>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Smart Nutritional Vision</p>
            </div>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
            <Button 
                variant="ghost" size="sm" 
                onClick={() => setLang('en')}
                className={cn("rounded-full px-4 h-8 text-[10px] font-black uppercase transition-all", lang === 'en' ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-400")}
            >EN</Button>
            <Button 
                variant="ghost" size="sm" 
                onClick={() => setLang('hi')}
                className={cn("rounded-full px-4 h-8 text-[10px] font-black uppercase transition-all", lang === 'hi' ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-400")}
            >हिन्दी</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-1">
          
          {/* Left Column: Module A (Input Zone) */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="rounded-[3rem] border-slate-200 overflow-hidden bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">The Input Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!preview ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-[2.5rem] border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4 bg-slate-50/50 dark:bg-slate-800/30 cursor-pointer hover:bg-blue-50/30 transition-colors"
                  >
                    <div className="h-16 w-16 bg-white dark:bg-slate-800 rounded-3xl shadow-xl flex items-center justify-center text-blue-500">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Capture Food Plate</p>
                    <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                  </div>
                ) : (
                  <div className="relative aspect-square rounded-[2.5rem] overflow-hidden group">
                    <Image src={preview} alt="Meal Preview" fill className="object-cover" />
                    {isAnalyzing && (
                      <div className="absolute inset-0 z-20 pointer-events-none">
                        <div className="absolute inset-0 bg-blue-500/10" />
                        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent shadow-[0_0_15px_rgba(37,99,235,1)] animate-scan-line" />
                      </div>
                    )}
                    {!isAnalyzing && (
                      <Button 
                        size="icon" variant="destructive" 
                        className="absolute top-4 right-4 rounded-full h-10 w-10 shadow-lg z-30" 
                        onClick={() => setPreview(null)}
                      ><X className="h-5 w-5" /></Button>
                    )}
                  </div>
                )}

                <form action={onFormSubmit} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                      name="textQuery"
                      value={textQuery}
                      onChange={(e) => setTextQuery(e.target.value)}
                      placeholder="Type your meal here..." 
                      className="rounded-2xl h-14 pl-12 bg-slate-50 dark:bg-slate-800 border-none shadow-inner text-sm font-bold"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isAnalyzing || (!preview && !textQuery.trim())}
                    className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[11px] tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                  >
                    {isAnalyzing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing vision...</> : 'Identify Meal'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Module B & C (Analytics) */}
          <div className="lg:col-span-8 space-y-8">
            {state?.result ? (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-700">
                
                {/* Module B: Macro & Micro Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <Card className="md:col-span-5 rounded-[3rem] border-slate-200 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center shadow-sm">
                    <div className="relative h-48 w-48 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-[12px] border-slate-100 dark:border-slate-800" />
                      <div className="absolute inset-0 rounded-full border-[12px] border-blue-500 border-t-transparent animate-spin [animation-duration:3s]" />
                      <div className="space-y-1">
                        <p className="text-4xl font-black text-[#1A365D] dark:text-white tracking-tighter">{state.result.calories}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total KCAL</p>
                      </div>
                    </div>
                    <div className="mt-8 px-4">
                       <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{state.result.name}</h3>
                    </div>
                  </Card>

                  <Card className="md:col-span-7 rounded-[3rem] border-slate-200 bg-white dark:bg-slate-900 p-8 shadow-sm space-y-8">
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Nutrient progress</h4>
                    <div className="space-y-6">
                      <MacroBar label="Carbohydrates" value={state.result.carbs} max={300} color="bg-amber-400" icon={Zap} />
                      <MacroBar label="Protein" value={state.result.protein} max={150} color="bg-emerald-400" icon={Utensils} />
                      <MacroBar label="Fats" value={state.result.fats} max={80} color="bg-rose-400" icon={Flame} />
                    </div>
                  </Card>
                </div>

                {/* Module C: Biological Logic */}
                <Card className="rounded-[3rem] border-slate-200 bg-white dark:bg-slate-900 p-10 shadow-sm overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                      <Activity className="w-32 h-32 text-blue-500" />
                   </div>
                   <div className="space-y-8 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                          <ChefHat className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#1A365D] dark:text-slate-300">Meal Logic & Insights</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                         <div className="space-y-4">
                            <Badge variant="outline" className="rounded-full px-3 py-1 font-black text-[9px] uppercase border-slate-200">English Logic</Badge>
                            <p className="text-base font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                              "{state.result.logicEn}"
                            </p>
                            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50">
                               <p className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> Pro Tip</p>
                               <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mt-2">{state.result.tipEn}</p>
                            </div>
                         </div>
                         <div className="space-y-4 border-l border-slate-100 dark:border-slate-800 md:pl-10">
                            <Badge variant="outline" className="rounded-full px-3 py-1 font-black text-[9px] uppercase border-slate-200">हिन्दी विश्लेषण</Badge>
                            <p className="text-base font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                              "{state.result.logicHi}"
                            </p>
                            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50">
                               <p className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5" /> स्वास्थ्य सुझाव</p>
                               <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-2">{state.result.tipHi}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </Card>

                {/* Module D: Friendship Callback Bridge */}
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={handleSyncEcosystem}
                    className="h-16 px-12 rounded-[2rem] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-sm tracking-[0.25em] shadow-[0_20px_50px_rgba(37,99,235,0.3)] active:scale-95 transition-all group"
                  >
                    Add to My Day & Trigger Challenges <ChevronRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-40 animate-pulse">
                  <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-6">
                    <Utensils className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-black text-slate-400 uppercase tracking-[0.2em]">Scanner Standby</h3>
                  <p className="text-sm font-bold text-slate-400 max-w-xs mx-auto mt-2">Identify your meal using the camera or text input to see the nutritional breakdown.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function MacroBar({ label, value, max, color, icon: Icon }: any) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2.5">
          <Icon className={cn("w-3.5 h-3.5", color.replace('bg-', 'text-'))} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
        </div>
        <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">{value}g <span className="text-slate-400 font-bold ml-1">/ {max}g</span></span>
      </div>
      <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", color)} 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
}
