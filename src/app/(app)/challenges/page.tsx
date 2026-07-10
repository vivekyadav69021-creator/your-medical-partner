'use client';

import React, { useState, useEffect, useActionState, startTransition } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    Activity, 
    Bot, 
    Dumbbell, 
    Utensils, 
    HeartPulse, 
    User, 
    ChevronLeft, 
    Plus, 
    Languages, 
    Download, 
    Share2, 
    CheckCircle2, 
    AlarmClock, 
    Loader2, 
    Sparkles, 
    AlertTriangle,
    Clock,
    RotateCcw,
    Calendar,
    Save,
    Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateHealthPlanAction } from './actions';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

// --- TYPES ---
type UserType = 'patient' | 'gym' | 'diet' | 'normal' | null;
type Lang = 'en' | 'hi';

export default function AdvancedHealthArchitectPage() {
    const [step, setStep] = useState<'type' | 'filters' | 'result'>('type');
    const [userType, setUserType] = useState<UserType>(null);
    const [lang, setLang] = useState<Lang>('en');
    const [activeTab, setActiveTab] = useState('summary');
    const [checklist, setChecklist] = useState<any[]>([]);
    const [streak, setStreak] = useState(0);

    const [state, formAction, isPending] = useActionState(generateHealthPlanAction, { result: null, error: null, timestamp: 0 });
    const { toast } = useToast();

    // Load persistence
    useEffect(() => {
        const savedPlan = localStorage.getItem('saved_health_plan_v1');
        const savedChecklist = localStorage.getItem('health_checklist_v1');
        const savedStreak = localStorage.getItem('health_streak_v1');
        
        if (savedPlan) {
            // If there's a saved plan, we could jump to results, but let's keep it clean
        }
        if (savedChecklist) setChecklist(JSON.parse(savedChecklist));
        if (savedStreak) setStreak(Number(savedStreak));
    }, []);

    // Handle AI Result
    useEffect(() => {
        if (state.result && state.timestamp > 0) {
            setStep('result');
            // Auto-generate checklist from AI schedule
            const newChecklist = state.result.dailySchedule.map((item: any, i: number) => ({
                id: `task-${Date.now()}-${i}`,
                ...item,
                completed: false
            }));
            setChecklist(newChecklist);
            localStorage.setItem('saved_health_plan_v1', JSON.stringify(state.result));
            localStorage.setItem('health_checklist_v1', JSON.stringify(newChecklist));
        }
    }, [state]);

    const handleTypeSelect = (type: UserType) => {
        setUserType(type);
        setStep('filters');
    };

    const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append('userType', userType as string);
        startTransition(() => { formAction(formData); });
    };

    const toggleTask = (id: string) => {
        const updated = checklist.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        setChecklist(updated);
        localStorage.setItem('health_checklist_v1', JSON.stringify(updated));
        
        // Simple streak logic: if all done today, increment streak (Simplified for demo)
        const allDone = updated.every(t => t.completed);
        if (allDone) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            localStorage.setItem('health_streak_v1', String(newStreak));
            toast({ title: "Daily Goal Achieved! 🏆", description: `You're on a ${newStreak} day streak!` });
        }
    };

    const setNativeAlarm = (timeStr: string, label: string) => {
        // Parse time like "09:30 AM"
        try {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            // Intent for Android (Native Alarm App)
            // On iOS/Web, this opens the alarm creation screen if supported
            const alarmUrl = `intent://#Intent;action=android.intent.action.SET_ALARM;i.android.intent.extra.alarm.HOUR=${hours};i.android.intent.extra.alarm.MINUTES=${minutes};S.android.intent.extra.alarm.MESSAGE=${encodeURIComponent(label)};b.android.intent.extra.alarm.SKIP_UI=false;end`;
            
            window.location.href = alarmUrl;
            
            // Fallback for browsers that block direct intents
            setTimeout(() => {
                toast({ 
                    title: "Setting Alarm", 
                    description: `Check your phone's clock app for the ${timeStr} alarm.` 
                });
            }, 500);
        } catch (e) {
            toast({ variant: 'destructive', title: "Alarm Error", description: "Could not sync with native clock app." });
        }
    };

    const downloadPDF = () => {
        if (!state.result) return;
        const res = state.result;
        const doc = new jsPDF();
        const w = doc.internal.pageSize.getWidth();
        
        doc.setFontSize(22);
        doc.setTextColor(36, 136, 232);
        doc.text("YOUR MEDICAL PARTNER", w/2, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setTextColor(100, 116, 139);
        doc.text(`Personal ${userType?.toUpperCase()} Health Plan`, w/2, 30, { align: 'center' });
        
        doc.setDrawColor(241, 245, 249);
        doc.line(20, 35, w-20, 35);
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(lang === 'en' ? res.summaryEn : res.summaryHi, 20, 45, { maxWidth: w - 40 });

        const tableData = res.dailySchedule.map((d: any) => [d.time, lang === 'en' ? d.taskEn : d.taskHi]);
        (doc as any).autoTable({
            startY: 70,
            head: [['Time', 'Activity']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [36, 136, 232] }
        });

        doc.save(`Health_Plan_${userType}.pdf`);
        toast({ title: "PDF Report Downloaded" });
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] overflow-hidden fixed inset-0 font-body safe-top">
            
            {/* Native Header */}
            <header className="h-16 px-4 bg-white/60 dark:bg-[#1e1f20]/60 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 z-50">
                <div className="flex items-center gap-3">
                    <button onClick={() => step === 'type' ? window.history.back() : setStep(step === 'result' ? 'filters' : 'type')}>
                        <div className="h-10 w-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm active:scale-95 transition-all">
                            <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-slate-100" />
                        </div>
                    </button>
                    <div className="flex flex-col -space-y-0.5">
                        <h1 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tighter leading-none">Health</h1>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.25em]">Architect</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="rounded-2xl h-10 px-4 gap-2 bg-primary/5 text-primary border border-primary/10">
                        <Languages className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">{lang === 'en' ? 'HI' : 'EN'}</span>
                    </Button>
                </div>
            </header>

            <main className="flex-1 overflow-hidden relative flex flex-col w-full max-w-4xl mx-auto">
                <ScrollArea className="flex-1 px-4 py-6 scrollbar-hide">
                    
                    {/* STEP 1: SELECT TYPE */}
                    {step === 'type' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="text-center space-y-2">
                                <div className="h-16 w-16 bg-primary/10 rounded-[1.8rem] flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                                </div>
                                <h2 className="text-3xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase leading-none">Identify Purpose</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Who are you today?</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <TypeCard icon={HeartPulse} label="Patient" color="text-rose-500" bg="bg-rose-50" desc="Medical Care" onClick={() => handleTypeSelect('patient')} />
                                <TypeCard icon={Dumbbell} label="Gym" color="text-blue-500" bg="bg-blue-50" desc="Performance" onClick={() => handleTypeSelect('gym')} />
                                <TypeCard icon={Utensils} label="Diet" color="text-emerald-500" bg="bg-emerald-50" desc="Nutrition" onClick={() => handleTypeSelect('diet')} />
                                <TypeCard icon={User} label="Normal" color="text-slate-500" bg="bg-slate-50" desc="General Health" onClick={() => handleTypeSelect('normal')} />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: FILTERS */}
                    {step === 'filters' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-32">
                            <div className="flex items-center gap-4">
                                <Badge className="bg-primary/10 text-primary border-none uppercase text-[9px] font-black px-4 py-1.5">{userType} MODE</Badge>
                                <div className="h-px bg-slate-100 flex-1" />
                            </div>

                            <form onSubmit={onFormSubmit} className="space-y-6">
                                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Age</Label>
                                            <Input name="age" type="number" placeholder="25" className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Gender</Label>
                                            <Select name="gender" defaultValue="male">
                                                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6"><SelectValue /></SelectTrigger>
                                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                                    <SelectItem value="male">Male</SelectItem>
                                                    <SelectItem value="female">Female</SelectItem>
                                                    <SelectItem value="other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Weight (kg)</Label>
                                            <Input name="weight" type="number" placeholder="70" className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Height (cm)</Label>
                                            <Input name="height" type="number" placeholder="175" className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Current Goal</Label>
                                        <Select name="goal" defaultValue="maintain">
                                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6"><SelectValue /></SelectTrigger>
                                            <SelectContent className="rounded-xl border-none shadow-2xl">
                                                <SelectItem value="lose">Weight Loss</SelectItem>
                                                <SelectItem value="gain">Weight Gain</SelectItem>
                                                <SelectItem value="maintain">General Fitness</SelectItem>
                                                <SelectItem value="recovery">Medical Recovery</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* DYNAMIC FIELDS */}
                                    {userType === 'patient' && (
                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-rose-500 ml-4">Medical Condition</Label>
                                                <Input name="medicalCondition" placeholder="e.g. Diabetes, Hypertension" className="h-14 rounded-2xl bg-rose-50/50 border-none shadow-inner font-bold px-6" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Mobility</Label>
                                                <Select name="mobility" defaultValue="normal">
                                                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="rest">Bed Rest</SelectItem>
                                                        <SelectItem value="limited">Limited Movement</SelectItem>
                                                        <SelectItem value="normal">Normal</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    {userType === 'gym' && (
                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-blue-500 ml-4">Experience Level</Label>
                                                <Select name="gymExperience" defaultValue="beginner">
                                                    <SelectTrigger className="h-14 rounded-2xl bg-blue-50/50 border-none shadow-inner font-bold px-6"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="beginner">Beginner</SelectItem>
                                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                                        <SelectItem value="advanced">Advanced</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Equipment Available</Label>
                                                <Select name="equipment" defaultValue="gym">
                                                    <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="none">No Equipment</SelectItem>
                                                        <SelectItem value="dumbbells">Dumbbells Only</SelectItem>
                                                        <SelectItem value="gym">Full Gym Access</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}

                                    {userType === 'diet' && (
                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-emerald-500 ml-4">Dietary Preference</Label>
                                                <Select name="dietType" defaultValue="veg">
                                                    <SelectTrigger className="h-14 rounded-2xl bg-emerald-50/50 border-none shadow-inner font-bold px-6"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="veg">Vegetarian</SelectItem>
                                                        <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                                                        <SelectItem value="jain">Jain</SelectItem>
                                                        <SelectItem value="vegan">Vegan</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </Card>

                                <Button type="submit" disabled={isPending} className="w-full h-16 rounded-[2rem] bg-primary text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 active:scale-95 transition-all">
                                    {isPending ? <><Loader2 className="mr-3 h-5 w-5 animate-spin" /> Architecting Plan...</> : <><Bot className="mr-3 h-5 w-5" /> Generate AI Plan</>}
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* STEP 3: RESULT & CHECKLIST */}
                    {step === 'result' && state.result && (
                        <div className="space-y-8 animate-in zoom-in-95 duration-700 pb-40">
                            {/* Summary Card */}
                            <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-bl-full" />
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                        <h3 className="text-xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Your Health Architecture</h3>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                        "{lang === 'en' ? state.result.summaryEn : state.result.summaryHi}"
                                    </p>
                                    
                                    <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                            <span className="text-[10px] font-black uppercase text-slate-400">Streak: <span className="text-primary">{streak} Days</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-emerald-50 text-emerald-600 border-none uppercase text-[8px] font-black">Verified Plan</Badge>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                                <TabsList className="grid grid-cols-3 h-12 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm">
                                    <TabsTrigger value="summary" className="rounded-xl text-[9px] font-black uppercase tracking-widest">Protocol</TabsTrigger>
                                    <TabsTrigger value="checklist" className="rounded-xl text-[9px] font-black uppercase tracking-widest">Checklist</TabsTrigger>
                                    <TabsTrigger value="actions" className="rounded-xl text-[9px] font-black uppercase tracking-widest">Settings</TabsTrigger>
                                </TabsList>

                                <TabsContent value="summary" className="space-y-6">
                                    <InfoSection icon={Utensils} title="Diet Protocol" content={lang === 'en' ? state.result.dietAdviceEn : state.result.dietAdviceHi} color="text-emerald-500" />
                                    <InfoSection icon={Dumbbell} title="Activity Protocol" content={lang === 'en' ? state.result.exerciseAdviceEn : state.result.exerciseAdviceHi} color="text-blue-500" />
                                    
                                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                                            <h4 className="text-sm font-black uppercase text-[#1A365D] dark:text-slate-100">Daily Guardrail</h4>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {(lang === 'en' ? state.result.dosAndDontsEn : state.result.dosAndDontsHi).map((item: string, i: number) => (
                                                <div key={i} className="flex gap-3 items-start">
                                                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{item}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {state.result.disclaimerEn && (
                                            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-[10px] font-bold text-rose-600 leading-relaxed uppercase">
                                                ⚠️ {lang === 'en' ? state.result.disclaimerEn : state.result.disclaimerHi}
                                            </div>
                                        )}
                                    </Card>
                                </TabsContent>

                                <TabsContent value="checklist" className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <h3 className="text-lg font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Today's Missions</h3>
                                        <Badge className="bg-primary/5 text-primary border-none uppercase text-[8px] font-black">{checklist.filter(t => t.completed).length}/{checklist.length} DONE</Badge>
                                    </div>

                                    <div className="space-y-3">
                                        {checklist.map((task) => (
                                            <div key={task.id} className={cn(
                                                "p-5 rounded-[2rem] border transition-all flex items-center gap-4 group",
                                                task.completed ? "bg-emerald-50/50 border-emerald-100 opacity-60" : "bg-white dark:bg-slate-900 border-slate-100 shadow-sm"
                                            )}>
                                                <button onClick={() => toggleTask(task.id)} className={cn(
                                                    "h-8 w-8 rounded-xl border-2 flex items-center justify-center transition-all",
                                                    task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200"
                                                )}>
                                                    {task.completed && <CheckCircle2 className="h-5 w-5" />}
                                                </button>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <Clock className="h-3 w-3 text-primary" />
                                                        <span className="text-[9px] font-black uppercase text-primary tracking-widest">{task.time}</span>
                                                    </div>
                                                    <p className={cn("text-sm font-bold truncate", task.completed ? "line-through text-slate-400" : "text-slate-700 dark:text-slate-200")}>
                                                        {lang === 'en' ? task.taskEn : task.taskHi}
                                                    </p>
                                                </div>

                                                <button 
                                                    onClick={() => setNativeAlarm(task.time, lang === 'en' ? task.taskEn : task.taskHi)}
                                                    className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <AlarmClock className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="actions" className="space-y-6">
                                    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-black uppercase text-[#1A365D] dark:text-white">Plan Management</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Backup and sharing options</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            <ActionButton icon={Download} label="Download PDF Architecture" onClick={downloadPDF} />
                                            <ActionButton icon={Share2} label="Share via WhatsApp" onClick={() => {}} />
                                            <ActionButton icon={RotateCcw} label="Regenerate Plan" variant="outline" onClick={() => setStep('filters')} />
                                            <ActionButton icon={Trash2} label="Reset All Progress" variant="ghost" className="text-rose-500 hover:bg-rose-50" onClick={() => { setChecklist([]); setStreak(0); localStorage.clear(); }} />
                                        </div>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </ScrollArea>
            </main>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}

function TypeCard({ icon: Icon, label, color, bg, desc, onClick }: any) {
    return (
        <button onClick={onClick} className="flex flex-col items-center justify-center gap-4 p-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-white dark:border-slate-800 shadow-xl hover:scale-105 active:scale-95 transition-all group overflow-hidden relative">
            <div className={cn("h-16 w-16 rounded-[1.8rem] flex items-center justify-center shadow-inner relative z-10", bg, color)}>
                <Icon className="h-8 w-8" />
            </div>
            <div className="text-center relative z-10">
                <h3 className="text-[12px] font-black text-[#1A365D] dark:text-white uppercase tracking-tighter leading-none mb-1">{label}</h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{desc}</p>
            </div>
            <div className="absolute -bottom-4 -right-4 h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full opacity-40 -z-0 group-hover:scale-150 transition-transform" />
        </button>
    );
}

function InfoSection({ icon: Icon, title, content, color }: any) {
    return (
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-4">
            <div className="flex items-center gap-3">
                <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 shadow-inner", color)}>
                    <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-black uppercase text-[#1A365D] dark:text-slate-100">{title}</h4>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-full text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                {content}
            </div>
        </Card>
    );
}

function ActionButton({ icon: Icon, label, variant = "default", onClick, className }: any) {
    return (
        <Button variant={variant} onClick={onClick} className={cn("h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 justify-start px-6", className)}>
            <Icon className="h-4 w-4" /> {label}
        </Button>
    );
}
