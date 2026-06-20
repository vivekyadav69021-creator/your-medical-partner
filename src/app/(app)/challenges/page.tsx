
'use client';

import { useState, useEffect, useMemo, startTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
    Trophy, 
    Star, 
    Bot, 
    Activity, 
    Smile, 
    Save, 
    Download, 
    CheckCircle, 
    Flame, 
    ChevronLeft,
    Plus,
    Utensils,
    Dumbbell,
    Brain,
    HeartPulse,
    ClipboardCheck,
    Languages,
    ArrowRight,
    MapPin,
    AlertCircle,
    Check
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- CONSTANTS & LABELS ---

const LABELS = {
    en: {
      name: 'Full Name', age:'Age', gender:'Gender', weight:'Weight (kg)', height:'Height',
      activity:'Activity Level', goal:'Main Goal', medical:'Medical Conditions / Allergies',
      time:'Daily Exercise Time (min)', notes:'Dietary Preference', generate:'Generate My Plan',
      save:'Save to Profile', download:'Export PDF Report', plannerTitle:'Your 7-Day Precision Health Plan',
      statusSaving:'Syncing...', statusSaved:'Synced to Cloud ✓', statusNoAuth:'Sign in to enable cloud sync.'
    },
    hi: {
      name:'पूरा नाम', age:'आयु', gender:'लिंग', weight:'वजन (kg)', height:'ऊँचाई',
      activity:'गतिविधि स्तर', goal:'मुख्य लक्ष्य', medical:'चिकित्सीय स्थिति / एलर्जी',
      time:'दैनिक व्यायाम समय (मिनट)', notes:'आहार प्राथमिकता', generate:'मेरा प्लान बनाएँ',
      save:'प्रोफ़ाइल में सेव करें', download:'PDF रिपोर्ट डाउनलोड', plannerTitle:'आपकी 7-दिवसीय सटीक स्वास्थ्य योजना',
      statusSaving:'सिंक हो रहा है...', statusSaved:'क्लाउड में सेव हुआ ✓', statusNoAuth:'क्लाउड सिंक के लिए साइन-इन करें।'
    }
};

const INITIAL_CHALLENGES = [
  {
    id: 'ch-1',
    title: 'Fat Loss Sprint',
    description: 'Lose 2kg in 10 days with clean eating and daily brisk walking.',
    reward: '500 Points & Metabolism Badge',
    progress: 4,
    total: 10,
    status: 'active',
    daily: Array(10).fill(false).map((_, i) => i < 4),
    category: 'Fitness'
  },
  {
    id: 'ch-2',
    title: 'Sugar-Free Week',
    description: 'Avoid all added sugars for 7 days straight to reset your insulin.',
    reward: '300 Points & Healthy Heart Badge',
    progress: 0,
    total: 7,
    status: 'new',
    daily: Array(7).fill(false),
    category: 'Diet'
  },
    {
    id: 'ch-3',
    title: 'Mindfulness Master',
    description: 'Complete 15 minutes of guided meditation daily for 14 days.',
    reward: '400 Points & Zen Master Badge',
    progress: 14,
    total: 14,
    status: 'completed',
    daily: Array(14).fill(true),
    category: 'Mental'
  },
];

// --- MAIN COMPONENT ---

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
    const [lang, setLang] = useState<'en' | 'hi'>('en');
    const { toast } = useToast();
    const t = LABELS[lang];

    // Planner State
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'male',
        weight: '',
        height: '',
        heightUnit: 'cm',
        heightFt: '',
        heightIn: '',
        activity: 'light',
        goal: 'maintain',
        medical: '',
        timeMins: '30',
        notes: 'Veg'
    });
    const [planner, setPlanner] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSelectChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // --- LOGIC: CHALLENGE TRACKING ---
    const handleJoinChallenge = (id: string) => {
        setChallenges(prev => prev.map(c => c.id === id ? { ...c, status: 'active' } : c));
        toast({ title: "Challenge Started!", description: "Track your progress daily." });
    };

    const handleDailyProgress = (id: string, index: number) => {
        setChallenges(prev => prev.map(c => {
            if (c.id === id) {
                const newDaily = [...c.daily];
                newDaily[index] = !newDaily[index];
                const newProgress = newDaily.filter(Boolean).length;
                const completed = newProgress === c.total;
                if (completed && !c.daily[index]) {
                    toast({ title: "Victory!", description: `You completed the ${c.title}!` });
                }
                return { ...c, daily: newDaily, progress: newProgress, status: completed ? 'completed' : 'active' };
            }
            return c;
        }));
    };

    // --- LOGIC: AI HEALTH PLANNER ---
    const generatePlanner = () => {
        if (!formData.name || !formData.weight) {
            toast({ variant: 'destructive', title: 'Data Missing', description: 'Please fill in your name and weight.' });
            return;
        }

        setIsGenerating(true);
        
        // Simulate AI Thinking
        setTimeout(() => {
            const w = Number(formData.weight);
            const a = Number(formData.age);
            let hCm = formData.heightUnit === 'cm' ? Number(formData.height) : (Number(formData.heightFt) * 30.48 + Number(formData.heightIn) * 2.54);
            
            const bmi = Math.round((w / ((hCm/100) * (hCm/100))) * 10) / 10;
            
            let bmr = formData.gender === 'male' ? (10*w + 6.25*hCm - 5*a + 5) : (10*w + 6.25*hCm - 5*a - 161);
            const activityMult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }[formData.activity as any] || 1.375;
            let calories = Math.round(bmr * activityMult);
            
            if (formData.goal === 'lose') calories -= 400;
            if (formData.goal === 'gain') calories += 300;

            const newPlanner = {
                id: Date.now(),
                createdAt: new Date().toISOString(),
                bmi,
                calories,
                diet: [
                    { meal: 'Wake up (7 AM)', desc: lang === 'en' ? 'Warm water + 5 soaked almonds' : 'गुनगुना पानी + 5 भीगे हुए बादाम' },
                    { meal: 'Breakfast (9 AM)', desc: lang === 'en' ? 'Oats with milk OR 2 Besan Chilla + Curd' : 'दूध के साथ ओट्स या 2 बेसन चिल्ला + दही' },
                    { meal: 'Lunch (1:30 PM)', desc: lang === 'en' ? '2 Whole wheat rotis + Dal + Green Veg + Salad' : '2 गेहूं की रोटी + दाल + हरी सब्जी + सलाद' },
                    { meal: 'Evening (5 PM)', desc: lang === 'en' ? 'Roasted makhana OR 1 Fruit' : 'भुने हुए मखाने या 1 फल' },
                    { meal: 'Dinner (8 PM)', desc: lang === 'en' ? 'Paneer/Chicken Stir fry OR Moong Dal Khichdi' : 'पनीर/चिकन स्टिर फ्राई या मूंग दाल खिचड़ी' },
                ],
                exercise: [
                    { day: 'Mon/Wed/Fri', type: lang === 'en' ? 'Strength Training (Bodyweight)' : 'स्ट्रेंथ ट्रेनिंग (बॉडीवेट)' },
                    { day: 'Tue/Thu/Sat', type: lang === 'en' ? 'Brisk Walking or Cardio' : 'तेज चलना या कार्डियो' },
                    { day: 'Sunday', type: lang === 'en' ? 'Active Rest (Yoga / Stretching)' : 'एक्टिव रेस्ट (योग / स्ट्रेचिंग)' },
                ],
                warnings: formData.medical ? (lang === 'en' ? `Note: Plan adjusted for ${formData.medical}` : `नोट: ${formData.medical} के लिए प्लान एडजस्ट किया गया है`) : null
            };

            setPlanner(newPlanner);
            setIsGenerating(false);
            toast({ title: "Plan Ready!", description: "Your custom health blueprint is generated." });
        }, 1500);
    };

    const downloadPDF = () => {
        if (!planner) return;
        const doc = new jsPDF();
        const W = doc.internal.pageSize.getWidth();
        
        doc.setFontSize(22);
        doc.setTextColor(36, 136, 232);
        doc.text("YOUR MEDICAL PARTNER", W/2, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setTextColor(80, 80, 80);
        doc.text("Custom Precision Health Report", W/2, 30, { align: 'center' });
        
        doc.setDrawColor(230, 230, 230);
        doc.line(20, 35, W-20, 35);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Patient Name: ${formData.name}`, 20, 45);
        doc.text(`Age/Gender: ${formData.age} / ${formData.gender}`, 20, 52);
        doc.text(`BMI: ${planner.bmi} | Daily Calories: ${planner.calories} kcal`, 20, 59);
        
        doc.setFontSize(16);
        doc.text("Daily Nutrition Blueprint", 20, 75);
        const dietData = planner.diet.map((d: any) => [d.meal, d.desc]);
        (doc as any).autoTable({
            startY: 80,
            head: [['Time', 'Meal Description']],
            body: dietData,
            theme: 'grid',
            headStyles: { fillColor: [36, 136, 232] }
        });

        const nextY = (doc as any).lastAutoTable.finalY + 15;
        doc.text("Weekly Activity Routine", 20, nextY);
        const exData = planner.exercise.map((e: any) => [e.day, e.type]);
        (doc as any).autoTable({
            startY: nextY + 5,
            head: [['Days', 'Activity Type']],
            body: exData,
            theme: 'grid',
            headStyles: { fillColor: [20, 207, 189] }
        });

        doc.save(`${formData.name}_Health_Plan.pdf`);
        toast({ title: "PDF Ready", description: "Your report has been downloaded." });
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#f8fbff] dark:bg-[#020617] overflow-hidden fixed inset-0 font-body">
            
            {/* Header */}
            <header className="h-16 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 z-50">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-slate-50 dark:bg-slate-800 border">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="space-y-0">
                        <h1 className="text-lg font-black text-[#1A365D] dark:text-white uppercase leading-none tracking-tighter">Health Center</h1>
                        <p className="text-[8px] font-black text-primary uppercase tracking-widest mt-0.5">V2.0 Elite Edition</p>
                    </div>
                </div>
                <Button variant="ghost" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="rounded-full h-9 px-4 gap-2 bg-primary/5 text-primary border-primary/10">
                    <Languages className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
                </Button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative">
                <Tabs defaultValue="planner" className="h-full flex flex-col">
                    <div className="px-6 pt-6 pb-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                        <TabsList className="grid grid-cols-3 h-12 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-white/50 dark:border-slate-700/50">
                            <TabsTrigger value="planner" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">AI Planner</TabsTrigger>
                            <TabsTrigger value="challenges" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Challenges</TabsTrigger>
                            <TabsTrigger value="stats" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Analysis</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 px-6 pb-40 pt-4">
                        
                        {/* 1. AI PLANNER TAB */}
                        <TabsContent value="planner" className="space-y-8 mt-0">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase">Health Architect</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Generate a science-backed routine in seconds</p>
                            </div>

                            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.name}</Label>
                                        <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="h-12 rounded-xl bg-slate-50 border-none shadow-inner font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.age}</Label>
                                        <Input id="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="25" className="h-12 rounded-xl bg-slate-50 border-none shadow-inner font-bold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.weight}</Label>
                                        <Input id="weight" type="number" value={formData.weight} onChange={handleInputChange} placeholder="70" className="h-12 rounded-xl bg-slate-50 border-none shadow-inner font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.height}</Label>
                                        <div className="flex gap-2">
                                            {formData.heightUnit === 'cm' ? (
                                                <Input id="height" type="number" value={formData.height} onChange={handleInputChange} className="h-12 rounded-xl bg-slate-50 border-none shadow-inner font-bold" />
                                            ) : (
                                                <div className="flex gap-1 w-full">
                                                    <Input id="heightFt" type="number" placeholder="Ft" value={formData.heightFt} onChange={handleInputChange} className="h-12 rounded-xl bg-slate-50 border-none shadow-inner font-bold w-1/2" />
                                                    <Input id="heightIn" type="number" placeholder="In" value={formData.heightIn} onChange={handleInputChange} className="h-12 rounded-xl bg-slate-50 border-none shadow-inner font-bold w-1/2" />
                                                </div>
                                            )}
                                            <Select value={formData.heightUnit} onValueChange={(v) => handleSelectChange('heightUnit', v)}>
                                                <SelectTrigger className="h-12 rounded-xl w-24 bg-slate-50 border-none"><SelectValue /></SelectTrigger>
                                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                                    <SelectItem value="cm">CM</SelectItem>
                                                    <SelectItem value="ft">FT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.goal}</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['maintain', 'lose', 'gain'].map(g => (
                                                <button key={g} onClick={() => handleSelectChange('goal', g)} className={cn("h-11 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all", formData.goal === g ? "bg-primary text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100")}>
                                                    {g} {g === 'lose' ? 'Fat' : g === 'gain' ? 'Muscle' : 'Health'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.medical}</Label>
                                        <Input id="medical" value={formData.medical} onChange={handleInputChange} placeholder="Diabetes, Asthma..." className="h-12 rounded-xl bg-slate-50 border-none shadow-inner font-bold" />
                                    </div>
                                </div>

                                <Button onClick={generatePlanner} disabled={isGenerating} className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(36,136,232,0.4)] active:scale-95 transition-all">
                                    {isGenerating ? <><Loader2 className="mr-2 animate-spin" /> Analyzing Data...</> : <><Bot className="mr-2 h-5 w-5" /> {t.generate}</>}
                                </Button>
                            </Card>

                            {planner && (
                                <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
                                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                                    
                                    <section className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{t.plannerTitle}</h3>
                                            <Button variant="outline" size="sm" onClick={downloadPDF} className="rounded-full h-9 px-4 gap-2 border-primary/20 text-primary">
                                                <Download className="w-3.5 h-3.5" /> <span className="text-[9px] font-black uppercase tracking-widest">Report</span>
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-5 rounded-[2rem] bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 flex items-center gap-4">
                                                <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm"><Activity className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase">BMI Score</p>
                                                    <p className="text-lg font-black text-[#1A365D] dark:text-slate-100">{planner.bmi}</p>
                                                </div>
                                            </div>
                                            <div className="p-5 rounded-[2rem] bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 flex items-center gap-4">
                                                <div className="h-10 w-10 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm"><Flame className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase">Daily Kcal</p>
                                                    <p className="text-lg font-black text-[#1A365D] dark:text-slate-100">{planner.calories}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                                            <div className="flex items-center gap-3">
                                                <Utensils className="w-5 h-5 text-primary" />
                                                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Meal Routine</h4>
                                            </div>
                                            <div className="space-y-6">
                                                {planner.diet.map((d: any, i: number) => (
                                                    <div key={i} className="flex gap-4 group">
                                                        <div className="flex flex-col items-center">
                                                            <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                                                            <div className="w-px h-full bg-slate-100 dark:bg-slate-800 mt-1" />
                                                        </div>
                                                        <div className="pb-4">
                                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{d.meal}</p>
                                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">{d.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>

                                        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                                            <div className="flex items-center gap-3">
                                                <Dumbbell className="w-5 h-5 text-emerald-500" />
                                                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Exercise Schedule</h4>
                                            </div>
                                            <div className="grid gap-3">
                                                {planner.exercise.map((e: any, i: number) => (
                                                    <div key={i} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 flex items-center justify-between">
                                                        <span className="text-[10px] font-black uppercase text-slate-400">{e.day}</span>
                                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{e.type}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    </section>
                                </div>
                            )}
                        </TabsContent>

                        {/* 2. CHALLENGES TAB */}
                        <TabsContent value="challenges" className="space-y-8 mt-0 pb-20">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase">Active Arena</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beat the odds, transform your body</p>
                            </div>

                            <div className="grid gap-6">
                                {challenges.map((c) => (
                                    <Card key={c.id} className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-6 overflow-hidden relative group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="space-y-1">
                                                <Badge className="bg-primary/10 text-primary text-[8px] font-black border-none uppercase px-3">{c.category}</Badge>
                                                <h3 className="text-lg font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">{c.title}</h3>
                                            </div>
                                            <div className="h-10 w-10 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500"><Trophy className="w-5 h-5" /></div>
                                        </div>
                                        
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{c.description}</p>
                                        
                                        <div className="space-y-2 mb-8">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-400">Mission Progress</span>
                                                <span className="text-primary">{Math.round((c.progress / c.total) * 100)}%</span>
                                            </div>
                                            <Progress value={(c.progress / c.total) * 100} className="h-2 bg-slate-100" />
                                        </div>

                                        {c.status === 'active' && (
                                            <div className="space-y-4 animate-in fade-in duration-500">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Log Daily Performance</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {c.daily.map((done, idx) => (
                                                        <button 
                                                            key={idx} 
                                                            onClick={() => handleDailyProgress(c.id, idx)}
                                                            className={cn(
                                                                "h-9 w-9 rounded-xl border-2 transition-all flex items-center justify-center",
                                                                done ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white dark:bg-slate-800 border-slate-100 text-slate-300 hover:border-emerald-200"
                                                            )}
                                                        >
                                                            {done ? <Check className="w-4 h-4" /> : <span className="text-[10px] font-black">{idx+1}</span>}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-primary fill-primary/20" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{c.reward}</span>
                                            </div>
                                            {c.status === 'new' && (
                                                <Button onClick={() => handleJoinChallenge(c.id)} className="rounded-full px-6 h-10 bg-primary font-black uppercase text-[9px] tracking-widest shadow-lg shadow-primary/20">Accept Challenge</Button>
                                            )}
                                            {c.status === 'completed' && (
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-full text-[9px] font-black uppercase">Mission Completed ✓</Badge>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* 3. STATS TAB */}
                        <TabsContent value="stats" className="space-y-8 mt-0 pb-20">
                             <div className="space-y-2">
                                <h2 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase">Health Insights</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time biometrics and data analysis</p>
                            </div>

                            <div className="grid gap-6">
                                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-5 h-5 text-primary" />
                                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Weekly Pulse</h4>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-500 uppercase">+12% vs last week</span>
                                    </div>
                                    <div className="h-60 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { day: 'Mon', min: 45 }, { day: 'Tue', min: 30 }, { day: 'Wed', min: 60 },
                                                { day: 'Thu', min: 20 }, { day: 'Fri', min: 45 }, { day: 'Sat', min: 90 }, { day: 'Sun', min: 50 }
                                            ]}>
                                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
                                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900}} />
                                                <Bar dataKey="min" fill="#2488E8" radius={[6, 6, 0, 0]} />
                                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Smile className="w-5 h-5 text-orange-500" />
                                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Mind Sentiment</h4>
                                    </div>
                                    <div className="h-60 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { d: '1', m: 3 }, { d: '2', m: 4 }, { d: '3', m: 5 }, { d: '4', m: 2 }, { d: '5', m: 4 }, { d: '6', m: 5 }, { d: '7', m: 5 }
                                            ]}>
                                                <Line type="monotone" dataKey="m" stroke="#F97316" strokeWidth={4} dot={{r: 6, fill: '#F97316'}} activeDot={{r: 10}} />
                                                <XAxis dataKey="d" hide />
                                                <YAxis hide domain={[1, 5]} />
                                                <Tooltip cursor={{stroke: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>

                    </ScrollArea>
                </Tabs>
            </main>

            {/* Bottom Safe Area */}
            <div className="h-10 bg-[#f8fbff] dark:bg-[#020617] shrink-0" />
            
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .touch-none { touch-action: none; }
            `}</style>
        </div>
    );
}

// --- SUB COMPONENTS ---

function ScrollArea({ children, className }: any) {
    return (
        <div className={cn("overflow-y-auto scrollbar-hide touch-pan-y", className)}>
            {children}
        </div>
    );
}

function Loader2({ className }: any) {
    return <Activity className={cn("animate-spin", className)} />;
}
