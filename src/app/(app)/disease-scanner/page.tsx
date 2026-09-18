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
  Pill,
  ExternalLink,
  Sparkles,
  Ban,
  User,
  Stethoscope,
  HeartPulse,
  Camera,
  AlertTriangle,
  Lightbulb,
  Apple
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

const compressImage = (dataUri: string, maxWidth = 800, quality = 0.5): Promise<string> => {
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
            if (!ctx) { resolve(dataUri); return; }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
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
            <div className={cn("absolute left-0 right-0 h-0.5 animate-scan-line z-[60] opacity-50", color)} style={{ backgroundColor: 'currentColor', boxShadow: '0 0 12px 1px currentColor' }} />
        </div>
    );
}

// --- SHARED MULTI-IMAGE UPLOADER ---

function MultiImageUploader({ previews, setPreviews, isAnalyzing, color, lang, label }: any) {
    const cameraRef = useRef<HTMLInputElement>(null);
    const galleryRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            for (const file of files) {
                const reader = new FileReader();
                reader.onload = async () => {
                    try {
                        const compressed = await compressImage(reader.result as string);
                        setPreviews((prev: string[]) => [...prev, compressed].slice(0, 5));
                    } catch (err) { console.error(err); }
                };
                reader.readAsDataURL(file);
            }
        }
    };

    return (
        <div className="space-y-4">
            {previews.length === 0 ? (
                <div className="grid grid-cols-2 gap-4 h-56">
                    <button type="button" onClick={() => cameraRef.current?.click()} className={cn("flex flex-col items-center justify-center gap-4 bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] border-4 border-dashed border-white/50 active:scale-95 transition-all group", color.replace('text-', 'hover:border-'))}>
                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg", color.replace('text-', 'bg-'))}>
                            <Camera className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Live Camera</span>
                        <input type="file" ref={cameraRef} hidden onChange={handleFileChange} accept="image/*" capture="environment" />
                    </button>
                    <button type="button" onClick={() => galleryRef.current?.click()} className={cn("flex flex-col items-center justify-center gap-4 bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] border-4 border-dashed border-white/50 active:scale-95 transition-all group", color.replace('text-', 'hover:border-'))}>
                        <div className="h-14 w-14 bg-slate-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <ImageIcon className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Gallery</span>
                        <input type="file" ref={galleryRef} hidden onChange={handleFileChange} accept="image/*" multiple />
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {previews.map((src: string, idx: number) => (
                            <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-md group">
                                <Image src={src} alt="Preview" fill className="object-cover" />
                                {isAnalyzing && <ScanAnimationOverlay color={color} />}
                                {!isAnalyzing && (
                                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 rounded-full h-7 w-7 shadow-lg scale-0 group-hover:scale-100 transition-transform" onClick={() => setPreviews((p: string[]) => p.filter((_, i) => i !== idx))}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {previews.length < 5 && !isAnalyzing && (
                            <div className="flex flex-col gap-2">
                                <button type="button" onClick={() => cameraRef.current?.click()} className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 bg-white/40 flex items-center justify-center text-slate-400">
                                    <Camera className="w-5 h-5" />
                                </button>
                                <button type="button" onClick={() => galleryRef.current?.click()} className="flex-1 rounded-2xl border-2 border-dashed border-slate-200 bg-white/40 flex items-center justify-center text-slate-400">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// --- SCANNER SUB-COMPONENTS ---

function SkinFaceScanner({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeSkinImageAction, initialSkinState);
    const [previews, setPreviews] = useState<string[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.result && !state?.error && state?.timestamp > 0) {
            updateScanStats();
            toast({ title: lang === 'en' ? "Analysis Complete" : "विश्लेषण पूरा हुआ" });
        }
    }, [state, toast, lang]);

    const handleFormAction = async (formData: FormData) => {
        if (previews.length === 0) return;
        const savedProfile = localStorage.getItem(`userMedicalProfile_local`);
        if (savedProfile) formData.set('userProfile', savedProfile);
        formData.set('images', JSON.stringify(previews));
        formData.set('language', lang);
        startTransition(() => { formAction(formData); });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-32 mt-4">
            <div className="flex items-center gap-4 px-2">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-11 w-11 bg-white/40 shadow-sm shrink-0">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-xl font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">{lang === 'en' ? 'Skin Analysis' : 'त्वचा विश्लेषण'}</h2>
                    <p className="text-[9px] font-black text-pink-500 uppercase tracking-widest">Advanced Dermatology AI</p>
                </div>
            </div>

            <div className="space-y-6">
                <MultiImageUploader previews={previews} setPreviews={setPreviews} isAnalyzing={isAnalyzing} color="text-pink-500" lang={lang} />
                
                <form action={handleFormAction} className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">{lang === 'en' ? 'Describe Symptoms' : 'लक्षण बताएं'}</Label>
                        <Textarea name="userQuery" placeholder={lang === 'en' ? "E.g., Itchy red patches since 2 days..." : "उदाहरण: 2 दिनों से खुजली वाले लाल धब्बे..."} className="rounded-3xl bg-white/60 dark:bg-slate-900/60 border-none shadow-inner min-h-[120px] text-base font-bold p-6" />
                    </div>
                    <Button type="submit" disabled={previews.length === 0 || isAnalyzing} className="w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white h-16 text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> AI Scanning...</> : "Start Scientific Analysis"}
                    </Button>
                </form>
            </div>

            {state?.result && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 px-2">
                    <div className="space-y-4">
                        <p className="text-xl font-black text-[#1A365D] dark:text-white leading-tight">{String(state.result.overallAssessment)}</p>
                        <div className="prose prose-sm dark:prose-invert text-slate-600 font-medium leading-relaxed">{String(state.result.detailedAnalysis)}</div>
                    </div>

                    {/* Potential Conditions */}
                    {state.result.potentialConditions && state.result.potentialConditions.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Potential Conditions</h4>
                            <div className="grid gap-3">
                                {state.result.potentialConditions.map((cond: any, i: number) => (
                                    <div key={i} className="p-4 bg-white/40 border border-white/60 rounded-2xl shadow-sm">
                                        <p className="text-sm font-black text-[#1A365D] dark:text-white uppercase">{cond.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1">{cond.simpleDescription}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Care Guide */}
                    <div className="space-y-4">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Care Recommendations</h4>
                        <div className="grid gap-4">
                            {(state.result.careRecommendations || []).map((care: any, i: number) => (
                                <div key={i} className="p-6 bg-white/80 dark:bg-slate-900/80 rounded-[2rem] border border-white dark:border-slate-800 shadow-sm">
                                    <p className="text-sm font-black text-[#1A365D] dark:text-slate-100 uppercase mb-2">{String(care.title)}</p>
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed">{String(care.description)}</p>
                                    {care.productSuggestion && <Badge className="mt-3 bg-emerald-50 text-emerald-600 border-none uppercase text-[8px] font-black">{String(care.productSuggestion)}</Badge>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nutritional Support */}
                    {state.result.nutritionalSupport && state.result.nutritionalSupport.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Dietary Support</h4>
                            <div className="grid grid-cols-1 gap-3">
                                {state.result.nutritionalSupport.map((nutri: any, i: number) => (
                                    <div key={i} className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl flex items-center gap-4">
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                            <Apple className="w-4 h-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-black uppercase text-[#1A365D]">{nutri.item}</p>
                                            <p className="text-[10px] font-bold text-slate-500">{nutri.benefit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Things to Avoid */}
                    {state.result.thingsToAvoid && state.result.thingsToAvoid.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Strictly Avoid</h4>
                            <div className="p-6 rounded-[2rem] bg-rose-50 border-2 border-dashed border-rose-200">
                                <ul className="space-y-2">
                                    {state.result.thingsToAvoid.map((item: string, i: number) => (
                                        <li key={i} className="flex gap-3 items-start">
                                            <Ban className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                            <span className="text-xs font-bold text-rose-600 uppercase tracking-tight">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function InjuryScanner({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeInjuryAction, initialInjuryState);
    const [previews, setPreviews] = useState<string[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.result && !state?.error && state?.timestamp > 0) updateScanStats();
    }, [state]);

    const handleFormAction = async (formData: FormData) => {
        if (previews.length === 0) return;
        formData.set('images', JSON.stringify(previews));
        formData.set('language', lang);
        startTransition(() => { formAction(formData); });
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-32 mt-4">
            <div className="flex items-center gap-4 px-2">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-11 w-11 bg-white/40 shadow-sm shrink-0">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-xl font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">Injury Scanner</h2>
                    <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Emergency Response AI</p>
                </div>
            </div>

            <div className="space-y-6">
                <MultiImageUploader previews={previews} setPreviews={setPreviews} isAnalyzing={isAnalyzing} color="text-orange-500" lang={lang} />
                
                <form action={handleFormAction} className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Accident Details</Label>
                        <Textarea name="userQuery" placeholder="What happened?" className="rounded-3xl bg-white/60 dark:bg-slate-900/60 border-none shadow-inner min-h-[120px] text-base font-bold p-6" />
                    </div>
                    <Button type="submit" disabled={previews.length === 0 || isAnalyzing} className="w-full rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white h-16 text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> AI Scanning...</> : "Start Emergency Scan"}
                    </Button>
                </form>
            </div>

            {state?.result && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 px-2">
                    {state.result.severity === 'high' && (
                        <Alert variant="destructive" className="rounded-[2rem] border-none bg-red-500 text-white p-6 animate-pulse">
                            <Siren className="h-6 w-6 mb-2" />
                            <AlertTitle className="font-black uppercase text-lg">Critical Alert</AlertTitle>
                            <AlertDescription className="text-xs font-bold">{String(state.result.actionableAlert)}</AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-black text-[#1A365D] dark:text-slate-100 uppercase">{String(state.result.classification)}</h3>
                            <Badge className="bg-orange-50 text-orange-600 border-none uppercase text-[8px] font-black px-3">{String(state.result.severity)}</Badge>
                        </div>
                        <p className="text-sm font-bold text-slate-500 italic leading-relaxed">"{String(state.result.biologicalLogic)}"</p>
                    </div>

                    {/* First Aid Steps */}
                    {state.result.firstAidSteps && state.result.firstAidSteps.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <HeartPulse className="w-4 h-4 text-orange-500" />
                                <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Emergency First Aid</h4>
                            </div>
                            <div className="grid gap-3">
                                {state.result.firstAidSteps.map((step: string, i: number) => (
                                    <div key={i} className="flex gap-4 p-5 bg-white/60 dark:bg-slate-900/60 rounded-[1.8rem] border border-white shadow-sm group">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary group-hover:bg-primary group-hover:text-white transition-colors">{i+1}</div>
                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-200 leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Things to Avoid */}
                    {state.result.thingsToAvoid && state.result.thingsToAvoid.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Actions to Avoid</h4>
                            <div className="p-6 rounded-[2rem] bg-rose-50 border-2 border-dashed border-rose-200">
                                <ul className="space-y-2">
                                    {state.result.thingsToAvoid.map((item: string, i: number) => (
                                        <li key={i} className="flex gap-3 items-start">
                                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                            <span className="text-xs font-bold text-rose-600 uppercase tracking-tight">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function XRayScanner({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeXrayAction, initialXrayState);
    const [previews, setPreviews] = useState<string[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.result && !state?.error && state?.timestamp > 0) updateScanStats();
    }, [state]);

    const handleFormAction = async (formData: FormData) => {
        if (previews.length === 0) return;
        formData.set('images', JSON.stringify(previews));
        formData.set('language', lang);
        startTransition(() => { formAction(formData); });
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-32 mt-4">
            <div className="flex items-center gap-4 px-2">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-11 w-11 bg-white/40 shadow-sm shrink-0">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-xl font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">Radiology AI</h2>
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Bone & Structural Scan</p>
                </div>
            </div>

            <div className="space-y-6">
                <MultiImageUploader previews={previews} setPreviews={setPreviews} isAnalyzing={isAnalyzing} color="text-blue-500" lang={lang} />
                
                <form action={handleFormAction} className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Anatomical Context</Label>
                        <Textarea name="userQuery" placeholder="E.g., Fell from height..." className="rounded-3xl bg-white/60 dark:bg-slate-900/60 border-none shadow-inner min-h-[120px] text-base font-bold p-6" />
                    </div>
                    <Button type="submit" disabled={previews.length === 0 || isAnalyzing} className="w-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white h-16 text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> Radiology Analysis...</> : "Analyze X-Ray Images"}
                    </Button>
                </form>
            </div>

            {state?.result && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 px-2">
                    <div className="space-y-2">
                        <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Findings</h4>
                        <p className="text-lg font-black text-[#1A365D] dark:text-slate-100">{String(state.result.bodyPart)}</p>
                    </div>
                    <div className="p-6 bg-white/80 dark:bg-slate-900/80 rounded-[2rem] border border-white dark:border-slate-800 shadow-sm italic text-sm font-bold text-slate-700 leading-relaxed">
                        "{String(state.result.observation)}"
                    </div>
                </div>
            )}
        </div>
    );
}

function LabReportAnalyzer({ lang, onBack }: { lang: 'en' | 'hi', onBack: () => void }) {
    const [state, formAction, isAnalyzing] = useActionState(analyzeLabReportImageAction, initialLabReportState);
    const [previews, setPreviews] = useState<string[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        if (state?.result && !state?.error && state?.timestamp > 0) updateScanStats();
    }, [state]);

    const handleFormAction = async (formData: FormData) => {
        if (previews.length === 0) return;
        formData.set('images', JSON.stringify(previews));
        formData.set('language', lang);
        startTransition(() => { formAction(formData); });
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700 pb-32 mt-4">
            <div className="flex items-center gap-4 px-2">
                <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full h-11 w-11 bg-white/40 shadow-sm shrink-0">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-xl font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">Report Specialist</h2>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Multi-Page Lab Analysis</p>
                </div>
            </div>

            <div className="space-y-6">
                <MultiImageUploader previews={previews} setPreviews={setPreviews} isAnalyzing={isAnalyzing} color="text-emerald-500" lang={lang} />
                
                <form action={handleFormAction} className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">Additional Context</Label>
                        <Textarea name="userQuery" placeholder="Feeling tired?" className="rounded-3xl bg-white/60 dark:bg-slate-900/60 border-none shadow-inner min-h-[120px] text-base font-bold p-6" />
                    </div>
                    <Button type="submit" disabled={previews.length === 0 || isAnalyzing} className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white h-16 text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all">
                        {isAnalyzing ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> Analysis OCR...</> : "Start Report Analysis"}
                    </Button>
                </form>
            </div>

            {state?.result && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 px-2">
                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-400">Patient</p>
                                <p className="text-sm font-black text-[#1A365D] dark:text-white truncate">{String(state.result.patientDetails?.name || 'Unknown')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase text-slate-400">Status</p>
                                <Badge className="bg-emerald-50 text-emerald-600 border-none uppercase text-[8px] font-black">Verified</Badge>
                            </div>
                        </div>
                    </Card>

                    {state.result.summary && (
                        <div className="space-y-3">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Holistic Summary</h4>
                            <p className="text-sm font-bold text-slate-600 leading-relaxed bg-white/40 p-5 rounded-3xl border border-white/60">{state.result.summary}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                         {(state.result.findings || []).map((item: any, i: number) => (
                            <div key={i} className="p-5 bg-white/60 dark:bg-slate-800/60 rounded-3xl border border-white/20 shadow-sm flex items-center justify-between">
                                <div className="flex-1 pr-4">
                                    <p className="text-xs font-black text-[#1A365D] dark:text-white uppercase">{String(item.test)}</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">{String(item.significance)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-primary">{String(item.value)}</p>
                                    <Badge className={cn("uppercase text-[8px] font-black border-none", (item.status === 'high' || item.status === 'low') ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500")}>{String(item.status)}</Badge>
                                </div>
                            </div>
                         ))}
                    </div>

                    {/* Action Plan Suggestions */}
                    {state.result.actionPlan && state.result.actionPlan.length > 0 && (
                        <div className="space-y-5">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-emerald-500" />
                                <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Clinical Action Plan</h4>
                            </div>
                            <div className="grid gap-4">
                                {state.result.actionPlan.map((action: any, i: number) => (
                                    <Card key={i} className="rounded-[2.2rem] border-none shadow-md bg-white p-6 space-y-4">
                                        <h5 className="text-sm font-black text-[#1A365D] uppercase tracking-tight flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-primary" /> {action.title}
                                        </h5>
                                        <ul className="space-y-3">
                                            {action.steps.map((step: string, j: number) => (
                                                <li key={j} className="flex gap-3 items-start">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                    <span className="text-xs font-bold text-slate-500 leading-snug">{step}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Things to Avoid */}
                    {state.result.thingsToAvoid && state.result.thingsToAvoid.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Strict Restrictions</h4>
                            <div className="p-8 rounded-[2.5rem] bg-rose-50 border-2 border-dashed border-rose-200">
                                <div className="grid gap-3">
                                    {state.result.thingsToAvoid.map((item: string, i: number) => (
                                        <div key={i} className="flex gap-3 items-center">
                                            <Ban className="w-4 h-4 text-rose-500 shrink-0" />
                                            <span className="text-xs font-black text-rose-600 uppercase tracking-tight">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
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
                                <h1 className="text-xl font-black text-[#1A365D] dark:text-slate-100 tracking-tight truncate">Hi {userName.split(' ')[0]} 👋</h1>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5 px-1">
                        <ScannerCard title="Skin Analysis" slogan="Dermatology" icon={Scan} gradient="from-pink-50 to-pink-100/30" iconColor="text-pink-500" btnColor="bg-pink-500" onClick={() => setView('skin')} btnText="Scan" />
                        <ScannerCard title="Injury & SOS" slogan="Emergency" icon={Bandage} gradient="from-orange-50 to-orange-100/30" iconColor="text-orange-500" btnColor="bg-orange-500" onClick={() => setView('injury')} btnText="Scan" />
                        <ScannerCard title="X-Ray Vision" slogan="Radiology" icon={Bone} gradient="from-blue-50 to-blue-100/30" iconColor="text-blue-500" btnColor="bg-blue-500" onClick={() => setView('xray')} btnText="Scan" />
                        <ScannerCard title="Report Specialist" slogan="OCR Lab" icon={FileText} gradient="from-emerald-50 to-emerald-100/30" iconColor="text-emerald-500" btnColor="bg-emerald-500" onClick={() => setView('lab')} btnText="Scan" />
                    </div>

                    <div className="flex justify-center pt-4">
                        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-lg rounded-full p-1.5 border border-white/40 dark:border-slate-800 flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setLang('en')} className={cn("rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-widest transition-all", lang === 'en' ? "bg-primary text-white shadow-md" : "text-slate-400")}>EN</Button>
                            <Button variant="ghost" size="sm" onClick={() => setLang('hi')} className={cn("rounded-full px-5 h-9 text-[10px] font-black uppercase tracking-widest transition-all", lang === 'hi' ? "bg-primary text-white shadow-md" : "text-slate-400")}>HI</Button>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] fixed inset-0 overflow-hidden font-body">
            <main className="h-full overflow-y-auto scrollbar-hide p-4">
                <div className="max-w-2xl mx-auto min-h-full">{renderContent()}</div>
            </main>
        </div>
    );
}

function ScannerCard({ title, slogan, icon: Icon, gradient, iconColor, btnColor, onClick, btnText }: any) {
    return (
        <Card className={cn("rounded-[3rem] border-none shadow-lg group hover:scale-[1.03] transition-all cursor-pointer bg-gradient-to-br relative overflow-hidden", gradient)} onClick={onClick}>
            <div className="p-6 flex flex-col items-center gap-4 text-center relative z-10">
                <div className="w-16 h-16 rounded-[1.8rem] bg-white/90 shadow-md flex items-center justify-center transition-transform group-hover:rotate-12">
                   <Icon className={cn("w-8 h-8", iconColor)} />
                </div>
                <div className="space-y-1.5 w-full">
                    <h3 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight leading-none">{title}</h3>
                    <div className={cn("w-full rounded-2xl py-2 mt-3 text-[9px] font-black uppercase text-white", btnColor)}>{btnText}</div>
                </div>
            </div>
        </Card>
    );
}

type ScannerView = 'home' | 'skin' | 'injury' | 'xray' | 'lab';
