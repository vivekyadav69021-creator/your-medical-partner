'use client';

import React, { useActionState, useRef, useState, useEffect, startTransition } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Scan, 
  Loader2, 
  X, 
  AlertTriangle, 
  FileText, 
  ImageIcon, 
  BrainCircuit, 
  ArrowLeft,
  Bandage,
  Bone,
  Activity,
  ChevronLeft,
  CheckCircle2,
  MessageCircle,
  Siren,
  ShieldAlert,
  Plus,
  Apple,
  Pill,
  ExternalLink,
  Sparkles,
  Ban,
  Utensils,
  User,
  Calendar,
  Stethoscope,
  HeartPulse
} from 'lucide-react';
import { analyzeXrayAction, analyzeSkinImageAction, analyzeLabReportImageAction, analyzeInjuryAction } from './actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { cn } from "@/lib/utils";
import { useUserProfile } from '@/context/user-profile-context';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

// --- UTILITIES ---

const updateScanStats = () => {
    if (typeof window === 'undefined') return;
    try {
        const stats = JSON.parse(localStorage.getItem('disease_scanner_stats') || '{"count": 0, "lastScan": null}');
        const newStats = { count: (stats.count || 0) + 1, lastScan: Date.now() };
        localStorage.setItem('disease_scanner_stats', JSON.stringify(newStats));
        window.dispatchEvent(new Event('scan-completed'));
    } catch (e) {
        console.error("Failed to update scan stats", e);
    }
};

const compressImage = (dataUri: string, maxWidth = 600): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new (window as any).Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (maxWidth / width) * height;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(dataUri);
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.4);
            resolve(compressed);
        };
        img.onerror = () => reject(new Error("Image failed to load"));
        img.src = dataUri;
    });
};

const initialXrayState = { result: null, error: null, timestamp: 0 };
const initialSkinState = { result: null, error: null, timestamp: 0 };
const initialLabReportState = { result: null, error: null, timestamp: 0 };
const initialInjuryState = { result: null, error: null, timestamp: 0 };

function ScanAnimationOverlay({ color }: { color: string }) {
    return (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden rounded-[inherit]">
            <div className={cn("absolute inset-0 opacity-[0.08] animate-pulse", color.replace('text-', 'bg-'))} />
            <div 
                className={cn("absolute left-0 right-0 h-0.5 animate-scan-line z-[60] opacity-50", color)} 
                style={{ 
                    backgroundColor: 'currentColor',
                    boxShadow: '0 0 12px 1px currentColor' 
                }}
            />
            <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-white/40 rounded-tl-sm" />
            <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-white/40 rounded-tr-sm" />
            <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-white/40 rounded-bl-sm" />
            <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-white/40 rounded-br-sm" />
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.1)_100%)]" />
        </div>
    );
}

// --- SCANNER SUB-COMPONENTS ---

function SkinFaceScanner({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeSkinImageAction, initialSkinState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (state?.result && !state?.error && state?.timestamp > 0) {
            updateScanStats();
            toast({ title: lang === 'en' ? "Analysis Complete" : "विश्लेषण पूरा हुआ" });
        }
    }, [state, toast, lang]);

    const handleFormAction = async (formData: FormData) => {
        if (!preview) return;
        try {
            const compressed = await compressImage(preview);
            const savedProfile = localStorage.getItem(`userMedicalProfile_local`);
            if (savedProfile) formData.set('userProfile', savedProfile);
            formData.set('imageDataUri', compressed);
            formData.set('language', lang);
            startTransition(() => { formAction(formData); });
        } catch (e) {
            toast({ variant: 'destructive', title: lang === 'en' ? 'Error' : 'त्रुटि' });
        }
    };

    const handleAskAssistant = () => {
        if (!state?.result) return;
        sessionStorage.setItem('last_skin_scan_result', JSON.stringify(state.result));
        router.push('/health-assistant?source=skin-scanner');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
                if (fileInputRef.current) fileInputRef.current.value = '';
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1 safe-top mt-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md shrink-0 text-foreground">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">
                        {lang === 'en' ? 'Skin Analysis' : 'त्वचा विश्लेषण'}
                    </h2>
                    <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest">
                        Welcome to the Dermatology Digital Clinic
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {!preview ? (
                    <div className="border-4 border-dashed border-white/60 dark:border-slate-800 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm space-y-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl text-pink-400">
                            <ImageIcon className="w-12 h-12" />
                        </div>
                        <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase">
                            {lang === 'en' ? 'Tap to Upload Photo' : 'फोटो अपलोड करने के लिए टैप करें'}
                        </p>
                        <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                    </div>
                ) : (
                    <div className={cn(
                        "relative rounded-[3rem] overflow-hidden shadow-2xl border-4 transition-all duration-700 bg-black/5 max-h-[500px] flex items-center justify-center",
                        isAnalyzing ? "border-pink-200 ring-8 ring-pink-50/50" : "border-white dark:border-slate-800"
                    )}>
                        <Image src={preview} alt="Preview" width={600} height={800} className="w-full h-auto object-contain max-h-[500px]" />
                        {isAnalyzing && <ScanAnimationOverlay color="text-pink-500" />}
                        <Button variant="destructive" size="icon" className={cn("absolute top-6 right-6 rounded-full h-10 w-10 z-[70]", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                <form action={handleFormAction} className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500/80 px-2">
                            {lang === 'en' ? 'Describe Symptoms' : 'लक्षण बताएं'}
                        </Label>
                        <Textarea 
                            name="userQuery" 
                            placeholder={lang === 'en' ? "E.g., Itchy red patches since 2 days..." : "उदाहरण: 2 दिनों से खुजली वाले लाल धब्बे..."} 
                            className="rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[140px] text-base font-bold p-6" 
                        />
                    </div>
                    <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-pink-500 to-rose-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> {lang === 'en' ? 'AI Scanning...' : 'AI जांच कर रहा है...'}</> : (lang === 'en' ? "Start Scientific Analysis" : "वैज्ञानिक विश्लेषण शुरू करें")}
                    </Button>
                </form>
            </div>

            {state?.result && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    {state.result.interactionPrompt && (
                        <Alert className="rounded-[2.5rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-6 border-dashed border-2 border-blue-100 animate-pulse">
                            <MessageCircle className="h-5 w-5 text-blue-500" />
                            <AlertDescription className="font-bold text-blue-700 dark:text-blue-300">
                                {state.result.interactionPrompt}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-4 px-2">
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-pink-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">
                                {lang === 'en' ? 'Analysis Verdict' : 'विश्लेषण निष्कर्ष'}
                            </h4>
                        </div>
                        <p className="text-xl font-black text-[#1A365D] dark:text-slate-100 leading-tight">
                            {state.result.overallAssessment}
                        </p>
                        <div className="prose prose-sm dark:prose-invert max-w-full text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                            {state.result.detailedAnalysis}
                        </div>
                    </div>

                    <div className="grid gap-8">
                        <div className="space-y-4 px-2">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">
                                {lang === 'en' ? 'Potential Conditions' : 'संभावित स्थितियां'}
                            </h4>
                            <div className="grid gap-3">
                                {(state.result.potentialConditions || []).map((cond: any, i: number) => (
                                    <div key={i} className="p-5 bg-white/60 dark:bg-slate-800/60 rounded-[1.8rem] border border-white/20 shadow-sm">
                                        <p className="text-sm font-black text-[#1A365D] dark:text-slate-100">{cond.name}</p>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">{cond.simpleDescription}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 px-2">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">
                                {lang === 'en' ? 'Care & Treatment Guide' : 'देखभाल और उपचार मार्गदर्शिका'}
                            </h4>
                            <div className="grid gap-4">
                                {(state.result.careRecommendations || []).map((care: any, i: number) => (
                                    <div key={i} className="p-6 bg-white/80 dark:bg-slate-900/80 rounded-[2.2rem] border border-white dark:border-slate-800 shadow-xl relative overflow-hidden group transition-all hover:scale-[1.02]">
                                        <div className="flex items-start gap-4">
                                            <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                                <Pill className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">{care.title}</p>
                                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">{care.description}</p>
                                                {care.productSuggestion && (
                                                    <div className="mt-4 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800">
                                                        <p className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Recommended OTC Product</p>
                                                        <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">{care.productSuggestion}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {state.result.nutritionalSupport && state.result.nutritionalSupport.length > 0 && (
                            <div className="space-y-4 px-2">
                                <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">
                                    {lang === 'en' ? 'Nutritional Support' : 'पोषण संबंधी सुझाव'}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {(state.result.nutritionalSupport || []).map((item: any, i: number) => (
                                        <div key={i} className="p-4 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-[1.5rem] border border-emerald-100/50 flex gap-3">
                                            <Utensils className="h-4 w-4 text-emerald-500 shrink-0" />
                                            <div>
                                                <p className="text-sm font-black text-emerald-700 dark:text-emerald-300">{item.item}</p>
                                                <p className="text-[11px] font-bold text-emerald-600/80 dark:text-emerald-400/80">{item.benefit}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {state.result.thingsToAvoid && state.result.thingsToAvoid.length > 0 && (
                            <div className="space-y-4 px-2">
                                <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">
                                    {lang === 'en' ? 'What NOT to do' : 'क्या न करें'}
                                </h4>
                                <div className="p-6 bg-red-50/40 dark:bg-red-950/10 rounded-[2.2rem] border border-red-100/50 space-y-3">
                                    {(state.result.thingsToAvoid || []).map((item: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <Ban className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-sm font-bold text-red-700 dark:text-red-300">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 px-2">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">
                                {lang === 'en' ? 'Simplified Biological Logic' : 'सरल जैविक तर्क'}
                            </h4>
                            <div className="p-6 rounded-[2rem] bg-pink-50/30 dark:bg-pink-900/10 border border-pink-100/50">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "{state.result.biologicalLogic}"
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="px-2 pt-4">
                         <Card className="rounded-[2.5rem] border-2 border-dashed border-primary/20 bg-primary/5 p-8 flex flex-col items-center text-center gap-6">
                            <div className="h-16 w-16 bg-white dark:bg-slate-900 rounded-3xl shadow-xl flex items-center justify-center text-primary relative">
                                <Activity className="w-8 h-8" />
                                <div className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Need More Details?</h3>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                                    {lang === 'en' 
                                        ? "Talk to our AI Health Assistant about this specific analysis for a deeper conversation." 
                                        : "इस विशेष विश्लेषण के बारे में अधिक बातचीत के लिए हमारे एआई स्वास्थ्य सहायक से बात करें।"}
                                </p>
                            </div>
                            <Button onClick={handleAskAssistant} className="rounded-full h-12 px-8 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 transition-all active:scale-95">
                                Ask Assistant <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                         </Card>
                    </div>

                    <Alert className="rounded-[2.5rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-6 border-dashed border-2 border-blue-100">
                        <ShieldAlert className="h-5 w-5 text-blue-500" />
                        <AlertDescription className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                            {state.result.disclaimer}
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
}

function InjuryScanner({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeInjuryAction, initialInjuryState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.result && !state?.error && state?.timestamp > 0) updateScanStats();
    }, [state]);

    const handleFormAction = async (formData: FormData) => {
        try {
            if (preview) {
                const compressed = await compressImage(preview);
                formData.set('imageDataUri', compressed);
            }
            formData.set('language', lang);
            startTransition(() => { formAction(formData); });
        } catch (e) {
            toast({ variant: 'destructive', title: 'Optimization Error' });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
                if (fileInputRef.current) fileInputRef.current.value = '';
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1 safe-top mt-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md shrink-0 text-foreground">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Injury Specialist</h2>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Emergency Scan</p>
                </div>
            </div>

            <div className="space-y-6">
                 <form action={handleFormAction} className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Accident Description</Label>
                        <Textarea name="userQuery" placeholder={lang === 'en' ? "How did it happen? (e.g., Fell down stairs)" : "यह कैसे हुआ? (जैसे: सीढ़ियों से गिर गया)"} className="rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[140px] text-base font-bold p-6" />
                    </div>
                    
                    {!preview ? (
                        <div className="border-4 border-dashed border-orange-100 dark:border-orange-900/30 rounded-[2.5rem] p-8 text-center space-y-4 bg-orange-50/20 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="h-14 w-14 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-orange-400 mx-auto">
                                <ImageIcon className="w-7 h-7" />
                            </div>
                            <p className="text-[10px] font-black text-orange-600/80 dark:text-orange-400 uppercase tracking-widest">Add Injury Photo (Optional)</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl bg-black/5 max-h-[500px] flex items-center justify-center">
                            <Image src={preview} alt="Injury" width={600} height={800} className="w-full h-auto object-contain max-h-[500px]" />
                            {isAnalyzing && <ScanAnimationOverlay color="text-orange-500" />}
                            <Button size="icon" variant="destructive" className={cn("absolute top-6 right-6 rounded-full h-10 w-10 z-[70]", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />

                    <Button type="submit" disabled={isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-orange-500 to-red-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> AI Scanning...</> : (lang === 'en' ? "Start Emergency Scan" : "इमरजेंसी स्कैन शुरू करें")}
                    </Button>
                </form>
            </div>

            {state?.result && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    {state.result.interactionPrompt && (
                        <Alert className="rounded-[2rem] bg-blue-50/50 border-blue-200 border-dashed border-2 p-6">
                            <MessageCircle className="h-5 w-5 text-blue-500" />
                            <AlertDescription className="font-bold text-blue-700">{state.result.interactionPrompt}</AlertDescription>
                        </Alert>
                    )}

                    {state.result.severity === 'high' && (
                        <Alert variant="destructive" className="rounded-[2.5rem] border-none bg-red-500 text-white p-6 animate-pulse">
                            <Siren className="h-8 w-8 mb-3" />
                            <AlertTitle className="text-xl font-black uppercase">CRITICAL ALERT</AlertTitle>
                            <AlertDescription className="text-sm font-bold">{state.result.actionableAlert}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-8">
                        <div className="space-y-3 px-2">
                             <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Injury Type</h4>
                             <div className="flex items-center gap-4">
                                <h3 className="text-lg font-black text-[#1A365D] dark:text-slate-100">{state.result.classification}</h3>
                                <Badge className={cn("uppercase font-black text-[8px] border-none px-3", 
                                    state.result.severity === 'high' ? "bg-red-100 text-red-600" : 
                                    state.result.severity === 'medium' ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                                )}>
                                    {state.result.severity}
                                </Badge>
                             </div>
                        </div>

                        <div className="space-y-4 px-2">
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Biological Logic</h4>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">"{state.result.biologicalLogic}"</p>
                        </div>

                        <div className="space-y-4 px-2">
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">First-Aid Steps</h4>
                            <div className="space-y-3">
                                {(state.result.firstAidSteps || []).map((step: string, i: number) => (
                                    <div key={i} className="flex gap-4 p-4 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/20">
                                        <span className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</span>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {state.result.thingsToAvoid && state.result.thingsToAvoid.length > 0 && (
                            <div className="space-y-4 px-2">
                                <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">
                                    {lang === 'en' ? 'What NOT to do' : 'क्या न करें'}
                                </h4>
                                <div className="p-6 bg-red-50/40 dark:bg-red-950/10 rounded-[2.2rem] border border-red-100/50 space-y-3">
                                    {(state.result.thingsToAvoid || []).map((item: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <Ban className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-sm font-bold text-red-700 dark:text-red-300">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Alert className="rounded-[2.5rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-6 border-dashed border-2 border-blue-100">
                            <ShieldAlert className="h-5 w-5 text-blue-500" />
                            <AlertDescription className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                                {state.result.disclaimer}
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            )}
        </div>
    );
}

function XRayScanner({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeXrayAction, initialXrayState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.result && !state?.error && state?.timestamp > 0) updateScanStats();
    }, [state]);

    const handleFormAction = async (formData: FormData) => {
        if (!preview) return;
        try {
            const compressed = await compressImage(preview);
            formData.set('photoDataUri', compressed);
            formData.set('contentType', 'image/jpeg');
            formData.set('language', lang);
            startTransition(() => { formAction(formData); });
        } catch (e) {
            toast({ variant: 'destructive', title: 'Error' });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
                if (fileInputRef.current) fileInputRef.current.value = '';
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1 safe-top mt-4">
             <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md shrink-0 text-foreground">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Radiology AI</h2>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Structural Scan</p>
                </div>
            </div>

            <div className="space-y-6">
                <form action={handleFormAction} className="space-y-6">
                    {!preview ? (
                        <div className="border-4 border-dashed border-blue-100 dark:border-blue-900/30 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-blue-50/20 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl text-blue-500">
                                <Bone className="w-12 h-12" />
                            </div>
                            <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase">Upload X-Ray Plate</p>
                        </div>
                    ) : (
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-black/5 max-h-[500px] flex items-center justify-center">
                            <Image src={preview} alt="X-ray" width={600} height={800} className="w-full h-auto object-contain max-h-[500px]" />
                            {isAnalyzing && <ScanAnimationOverlay color="text-blue-500" />}
                            <Button variant="destructive" size="icon" className={cn("absolute top-6 right-6 rounded-full h-10 w-10 z-[70]", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />

                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Mechanism of Injury</Label>
                        <Textarea name="userQuery" placeholder="E.g., Severe pain in wrist after fall..." className="rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[140px] text-base font-bold p-6" />
                    </div>

                    <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-blue-500 to-indigo-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> Analyzing...</> : "Start Radiology Analysis"}
                    </Button>
                </form>
            </div>

            {state?.result && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    <div className="space-y-8 px-2">
                        <h4 className="font-black text-xs uppercase tracking-[0.3em] text-slate-400">Clinical Observation</h4>
                        <div className="p-6 rounded-[2.5rem] bg-white/60 dark:bg-slate-800/60 border border-white/40 shadow-sm">
                            <p className="text-base font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic">"{state.result.observation}"</p>
                        </div>
                    </div>
                    <Alert className="rounded-[2.5rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-6 border-dashed border-2 border-blue-100">
                        <ShieldAlert className="h-5 w-5 text-blue-500" />
                        <AlertDescription className="text-[10px] font-black uppercase text-blue-400 tracking-wider">
                            {state.result.disclaimer}
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
}

function LabReportAnalyzer({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeLabReportImageAction, initialLabReportState);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.result && !state?.error && state?.timestamp > 0) updateScanStats();
    }, [state]);

    const handleFormAction = async (formData: FormData) => {
        if (!preview) return;
        try {
            const compressed = await compressImage(preview);
            formData.set('imageDataUri', compressed);
            formData.set('language', lang);
            startTransition(() => { formAction(formData); });
        } catch (e) {
            toast({ variant: 'destructive', title: 'Error' });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
                if (fileInputRef.current) fileInputRef.current.value = '';
            };
            reader.readAsDataURL(file);
        }
    };

    // Group findings by category with safety fallback
    const groupedFindings = (state?.result?.findings || []).reduce((acc: any, item: any) => {
        const category = item.category || (lang === 'en' ? 'General' : 'सामान्य');
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
    }, {});

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 px-1 safe-top mt-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-12 w-12 bg-white/40 backdrop-blur-xl shadow-md shrink-0 text-foreground">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight">Report Specialist</h2>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Advanced Lab OCR</p>
                </div>
            </div>

            <div className="space-y-6">
                {!preview ? (
                    <div className="border-4 border-dashed border-emerald-100 dark:border-emerald-900/30 rounded-[3rem] h-80 flex flex-col items-center justify-center bg-emerald-50/20 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className="p-6 bg-white dark:bg-slate-800 rounded-[2rem] shadow-xl text-emerald-500">
                            <FileText className="w-12 h-12" />
                        </div>
                        <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase">Drop Lab Report Here</p>
                        <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                    </div>
                ) : (
                    <div className={cn(
                        "relative rounded-[3rem] overflow-hidden shadow-2xl border-4 transition-all duration-700 bg-black/5 max-h-[500px] flex items-center justify-center",
                        isAnalyzing ? "border-emerald-200 ring-8 ring-emerald-50/50" : "border-white dark:border-slate-800"
                    )}>
                        <Image src={preview} alt="Report" width={600} height={800} className="w-full h-auto object-contain max-h-[500px]" />
                        {isAnalyzing && <ScanAnimationOverlay color="text-emerald-500" />}
                        <Button variant="destructive" size="icon" className={cn("absolute top-6 right-6 rounded-full h-10 w-10 z-[70]", isAnalyzing && "hidden")} onClick={() => setPreview(null)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                )}

                <form action={handleFormAction} className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Additional Context (Optional)</Label>
                        <Textarea name="userQuery" placeholder="E.g., I have been feeling tired lately..." className="rounded-[2.5rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-none shadow-inner min-h-[100px] text-base font-bold p-6" />
                    </div>
                    <Button type="submit" disabled={!preview || isAnalyzing} className="w-full rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-600 text-white h-16 text-sm font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> {lang === 'en' ? 'Scanning Report...' : 'रिपोर्ट स्कैन हो रही है...'}</> : (lang === 'en' ? "Analyze My Report" : "रिपोर्ट का विश्लेषण करें")}
                    </Button>
                </form>
            </div>

            {state?.result && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                    
                    {/* Patient Details Header */}
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-400">Patient Name</p>
                                <p className="text-sm font-black text-[#1A365D] dark:text-white flex items-center gap-2"><User className="w-3.5 h-3.5 text-primary" /> {state.result.patientDetails?.name || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-400">Age / Gender</p>
                                <p className="text-sm font-black text-[#1A365D] dark:text-white">{state.result.patientDetails?.age || '-'} / {state.result.patientDetails?.gender || '-'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-400">Report Date</p>
                                <p className="text-sm font-black text-[#1A365D] dark:text-white flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-primary" /> {state.result.patientDetails?.date || '-'}</p>
                            </div>
                             <div className="col-span-full pt-4 border-t border-slate-100 dark:border-slate-800">
                                <p className="text-[9px] font-black uppercase text-slate-400">Referring Physician / Clinic</p>
                                <p className="text-sm font-black text-primary flex items-center gap-2"><Stethoscope className="w-3.5 h-3.5" /> {state.result.patientDetails?.doctorName || 'Not Specified'}</p>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-4 px-2">
                        <div className="flex items-center gap-2">
                            <HeartPulse className="w-5 h-5 text-emerald-500" />
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Executive Summary</h4>
                        </div>
                        <p className="text-lg font-black text-[#1A365D] dark:text-slate-100 leading-tight">
                            {state.result.summary}
                        </p>
                    </div>

                    {/* Findings by Category */}
                    <div className="space-y-8">
                        {Object.entries(groupedFindings).map(([category, items]: [string, any]) => (
                            <div key={category} className="space-y-4 px-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">{category}</h4>
                                    <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1 ml-4" />
                                </div>
                                <div className="grid gap-3">
                                    {(items || []).map((item: any, i: number) => (
                                        <div key={i} className="p-5 bg-white/60 dark:bg-slate-800/60 rounded-[1.8rem] border border-white/20 shadow-sm group transition-all hover:bg-white hover:shadow-md">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-black text-[#1A365D] dark:text-white">{item.test}</p>
                                                <Badge className={cn("uppercase text-[8px] font-black border-none px-3", 
                                                    item.status === 'high' ? "bg-red-50 text-red-500" : 
                                                    item.status === 'low' ? "bg-orange-50 text-orange-500" : 
                                                    item.status === 'borderline' ? "bg-yellow-50 text-yellow-600" : "bg-emerald-50 text-emerald-600"
                                                )}>
                                                    {item.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-black text-primary">{item.value}</span>
                                                <span className="text-[10px] font-bold text-slate-400 italic">Ref: {item.range}</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{item.significance}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-4 px-2">
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Clinical Reasoning</h4>
                            <div className="p-6 rounded-[2rem] bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100/50">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                    "{state.result.biologicalLogic}"
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6 px-2">
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[#1A365D] dark:text-slate-300">Cure & Action Plan</h4>
                            <div className="grid gap-4">
                                {(state.result.actionPlan || []).map((plan: any, i: number) => (
                                    <div key={i} className="p-6 bg-white/80 dark:bg-slate-900/80 rounded-[2.2rem] border border-white dark:border-slate-800 shadow-xl relative overflow-hidden">
                                        <div className="flex items-start gap-4">
                                            <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-sm font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{plan.title}</p>
                                                <div className="space-y-2">
                                                    {(plan.steps || []).map((step: string, j: number) => (
                                                        <div key={j} className="flex gap-2 items-start">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {state.result.thingsToAvoid && state.result.thingsToAvoid.length > 0 && (
                            <div className="space-y-4 px-2">
                                <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Precautions (What to Avoid)</h4>
                                <div className="p-6 bg-red-50/40 dark:bg-red-950/10 rounded-[2.2rem] border border-red-100/50 space-y-3">
                                    {(state.result.thingsToAvoid || []).map((item: string, i: number) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <Ban className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                            <p className="text-sm font-bold text-red-700 dark:text-red-300">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Alert className="rounded-[2.5rem] border-none bg-blue-50/50 dark:bg-blue-900/10 p-6 border-dashed border-2 border-blue-100">
                        <ShieldAlert className="h-5 w-5 text-blue-500" />
                        <AlertDescription className="text-[10px] font-black uppercase text-blue-400 tracking-wider text-center">
                            {state.result.disclaimer}
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
}

// --- MAIN PAGE COMPONENT ---

export default function DiseaseScannerPage() {
    const [view, setView] = useState<ScannerView>('home');
    const { userName, userImage } = useUserProfile();
    const [lang, setLang] = useState<'en' | 'hi'>('en');
    const [scanStats, setScanStats] = useState({ count: 0, lastScan: null as number | null });
    
    useEffect(() => {
        const loadStats = () => {
            const saved = localStorage.getItem('disease_scanner_stats');
            if (saved) setScanStats(JSON.parse(saved));
        };
        loadStats();
        window.addEventListener('scan-completed', loadStats);
        return () => window.removeEventListener('scan-completed', loadStats);
    }, []);

    const t = {
        en: {
            greeting: `Hi ${userName.split(' ')[0]}`,
            statsTitle: "Diagnostic Activity",
            lastScan: "Last Scan",
            reports: "Total Scans",
            healthScore: "Lab Status",
            skinTitle: "Skin Analysis",
            injuryTitle: "Injury & SOS",
            xrayTitle: "X-Ray Vision",
            reportTitle: "Report Specialist",
            startBtn: "Analyze Now",
            noScans: "Ready for scan"
        },
        hi: {
            greeting: `नमस्ते ${userName.split(' ')[0]}`,
            statsTitle: "नैदानिक गतिविधियाँ",
            lastScan: "पिछला स्कैन",
            reports: "कुल स्कैन",
            healthScore: "लैब स्थिति",
            skinTitle: "त्वचा विश्लेषण",
            injuryTitle: "इंजरी और SOS",
            xrayTitle: "एक्स-रे विजन",
            reportTitle: "रिपोर्ट विश्लेषण",
            startBtn: "अभी विश्लेषण करें",
            noScans: "स्कैन के लिए तैयार"
        }
    }[lang];

    const renderContent = () => {
        switch (view) {
            case 'skin': return <SkinFaceScanner lang={lang} onBack={() => setView('home')} />;
            case 'injury': return <InjuryScanner lang={lang} onBack={() => setView('home')} />;
            case 'xray': return <XRayScanner lang={lang} onBack={() => setView('home')} />;
            case 'lab': return <LabReportAnalyzer lang={lang} onBack={() => setView('home')} />;
            default: return (
                <div className="space-y-8 animate-in fade-in duration-700 pb-32">
                    <div className="flex items-center justify-between p-6 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-sm mx-1 safe-top mt-2">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 bg-white/50 shadow-sm border border-white/20 shrink-0">
                                    <ChevronLeft className="h-6 w-6 text-[#1A365D]" />
                                </Button>
                            </Link>
                            <div className="space-y-0.5 min-w-0">
                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50/80 dark:bg-blue-900/20 rounded-full border border-blue-100/50 mb-0.5">
                                    <Scan className="w-2.5 h-2.5 text-primary" />
                                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Diagnostic Lab</span>
                                </div>
                                <h1 className="text-xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight truncate">{t.greeting} 👋</h1>
                            </div>
                        </div>
                        <Link href="/profile" className="shrink-0 ml-4">
                            <div className="h-12 w-12 rounded-full border-4 border-white shadow-lg overflow-hidden shrink-0">
                                <img src={userImage} alt={userName} className="h-full w-full object-cover" />
                            </div>
                        </Link>
                    </div>

                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/20 overflow-hidden mx-1">
                        <CardHeader className="pb-3 pt-6 px-8">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500/80 flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-primary" />
                                {t.statsTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-2 px-8 pb-8 text-center">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.lastScan}</p>
                                <p className="text-xs font-black text-[#2D3A5D] dark:text-slate-200 truncate">
                                    {scanStats.lastScan ? formatDistanceToNow(scanStats.lastScan, { addSuffix: true }) : t.noScans}
                                </p>
                            </div>
                            <div className="space-y-1 border-x border-slate-100/50 dark:border-slate-800/50 px-2">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.reports}</p>
                                <p className="text-sm font-black text-primary">{scanStats.count || 0}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{t.healthScore}</p>
                                <div className="flex justify-center">
                                    <Badge className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 text-[9px] font-black border-none px-2.5 py-0.5 rounded-full">ACTIVE</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-5 px-1">
                        <ScannerCard title={t.skinTitle} slogan="Dermatology" icon={Scan} gradient="from-pink-50 to-pink-100/30" iconColor="text-pink-500" btnColor="bg-pink-500" onClick={() => setView('skin')} btnText={t.startBtn} />
                        <ScannerCard title={t.injuryTitle} slogan="Emergency" icon={Bandage} gradient="from-orange-50 to-orange-100/30" iconColor="text-orange-500" btnColor="bg-orange-500" onClick={() => setView('injury')} btnText={t.startBtn} />
                        <ScannerCard title={t.xrayTitle} slogan="Radiology" icon={Bone} gradient="from-blue-50 to-blue-100/30" iconColor="text-blue-500" btnColor="bg-blue-500" onClick={() => setView('xray')} btnText={t.startBtn} />
                        <ScannerCard title={t.reportTitle} slogan="OCR Lab" icon={FileText} gradient="from-emerald-50 to-emerald-100/30" iconColor="text-emerald-500" btnColor="bg-emerald-500" onClick={() => setView('lab')} btnText={t.startBtn} />
                    </div>

                    {/* Language Selection specifically for Dashboard view */}
                    <div className="flex justify-center pt-4">
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-lg rounded-full p-1.5 border border-white/40 dark:border-slate-800 flex items-center gap-1">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setLang('en')} 
                                className={cn(
                                    "rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-widest transition-all duration-300", 
                                    lang === 'en' ? "bg-primary text-white shadow-md" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                            >
                                EN
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setLang('hi')} 
                                className={cn(
                                    "rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-widest transition-all duration-300", 
                                    lang === 'hi' ? "bg-primary text-white shadow-md" : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                )}
                            >
                                हिन्दी
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] fixed inset-0 overflow-hidden font-body">
            <main className="h-full overflow-y-auto scroll-smooth scrollbar-hide">
                <div className="max-w-2xl mx-auto p-4 pt-4 min-h-full">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}

function ScannerCard({ title, slogan, icon: Icon, gradient, iconColor, btnColor, onClick, btnText }: any) {
    return (
        <Card className={cn("rounded-[3rem] border-none shadow-lg group hover:scale-[1.03] active:scale-95 transition-all duration-500 cursor-pointer bg-gradient-to-br relative overflow-hidden", gradient)} onClick={onClick}>
            <div className="absolute top-[-10%] right-[-10%] w-24 h-24 bg-white/20 rounded-full blur-2xl" />
            <div className="p-6 flex flex-col items-center gap-4 text-center relative z-10">
                <div className="w-16 h-16 rounded-[1.8rem] bg-white/90 dark:bg-slate-900 shadow-md flex items-center justify-center transition-transform duration-700 group-hover:rotate-12">
                   <Icon className={cn("w-8 h-8", iconColor)} />
                </div>
                <div className="space-y-1.5 w-full">
                    <h3 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight leading-none">{title}</h3>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{slogan}</p>
                    <div className={cn("w-full rounded-2xl py-2 mt-3 text-[9px] font-black uppercase tracking-widest text-white shadow-xl transition-all duration-300 group-hover:shadow-primary/20", btnColor)}>
                        {btnText}
                    </div>
                </div>
            </div>
        </Card>
    );
}

type ScannerView = 'home' | 'skin' | 'injury' | 'xray' | 'lab';
