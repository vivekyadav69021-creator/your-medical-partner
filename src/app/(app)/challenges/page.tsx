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
    Check,
    PlusCircle,
    Trash2,
    Zap,
    ExternalLink,
    Search,
    ShieldCheck,
    Loader2
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- CONSTANTS & LABELS ---

const LABELS = {
    en: {
      name: 'Full Name', age:'Age', gender:'Gender', weight:'Weight (kg)', height:'Height',
      activity:'Activity Level', goal:'Profile Type', medical:'Medical History',
      time:'Workout Duration', notes:'Diet Preference', generate:'Build My Architecture',
      save:'Sync to Cloud', download:'Download Report', plannerTitle:'Personal Health Architecture',
      statusSaving:'Optimizing...', statusSaved:'Health Blueprint Ready ✓'
    },
    hi: {
      name:'पूरा नाम', age:'आयु', gender:'लिंग', weight:'वजन (kg)', height:'ऊँचाई',
      activity:'गतिविधि स्तर', goal:'प्रोफ़ाइल प्रकार', medical:'चिकित्सीय इतिहास',
      time:'वर्कआउट अवधि', notes:'आहार प्राथमिकता', generate:'मेरा प्लान बनाएँ',
      save:'क्लाउड सिंक', download:'रिपोर्ट डाउनलोड', plannerTitle:'व्यक्तिगत स्वास्थ्य योजना',
      statusSaving:'अनुकूलन हो रहा है...', statusSaved:'स्वास्थ्य ब्लूप्रिंट तैयार ✓'
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
    category: 'Fitness',
    isCustom: false
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
    category: 'Diet',
    isCustom: false
  },
  {
      id: 'ch-3',
      title: 'Mental Clarity',
      description: '15 mins of guided meditation for 14 days.',
      reward: 'Zen Master Badge',
      progress: 0,
      total: 14,
      status: 'new',
      daily: Array(14).fill(false),
      category: 'Mental',
      isCustom: false
  }
];

// --- MAIN COMPONENT ---

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<any[]>([]);
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

    // Custom Challenge State
    const [newChallengeTitle, setNewChallengeTitle] = useState('');
    const [newChallengeDays, setNewChallengeDays] = useState('7');

    useEffect(() => {
        const saved = localStorage.getItem('user_health_challenges_v5');
        if (saved) setChallenges(JSON.parse(saved));
        else setChallenges(INITIAL_CHALLENGES);
    }, []);

    useEffect(() => {
        if (challenges.length > 0) {
            localStorage.setItem('user_health_challenges_v5', JSON.stringify(challenges));
        }
    }, [challenges]);

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
                    toast({ title: "Victory!", description: `Mission Accomplished: ${c.title}` });
                }
                return { ...c, daily: newDaily, progress: newProgress, status: completed ? 'completed' : 'active' };
            }
            return c;
        }));
    };

    const addCustomChallenge = () => {
        if (!newChallengeTitle.trim()) return;
        const days = parseInt(newChallengeDays);
        const id = `custom-${Date.now()}`;
        const newC = {
            id,
            title: newChallengeTitle,
            description: `Personalized goal for ${days} days.`,
            reward: 'Personal Mastery',
            progress: 0,
            total: days,
            status: 'active',
            daily: Array(days).fill(false),
            category: 'Personal',
            isCustom: true
        };
        setChallenges(prev => [newC, ...prev]);
        setNewChallengeTitle('');
        toast({ title: "Goal Activated", description: "Your custom mission has started." });
    };

    const deleteChallenge = (id: string) => {
        setChallenges(prev => prev.filter(c => c.id !== id));
        toast({ title: "Goal Removed" });
    };

    // --- LOGIC: AI HEALTH PLANNER ---
    const generatePlanner = () => {
        if (!formData.name || !formData.weight) {
            toast({ variant: 'destructive', title: 'Bio-Data Required', description: 'Please fill in your name and weight.' });
            return;
        }

        setIsGenerating(true);
        
        // Simulate Deep Analysis
        setTimeout(() => {
            const w = Number(formData.weight);
            const a = Number(formData.age);
            let hCm = formData.heightUnit === 'cm' ? Number(formData.height) : (Number(formData.heightFt) * 30.48 + Number(formData.heightIn) * 2.54);
            
            const bmi = Math.round((w / ((hCm/100) * (hCm/100))) * 10) / 10;
            
            let bmr = formData.gender === 'male' ? (10*w + 6.25*hCm - 5*a + 5) : (10*w + 6.25*hCm - 5*a - 161);
            const activityMult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }[formData.activity as any] || 1.375;
            let calories = Math.round(bmr * activityMult);
            
            if (formData.goal === 'lose') calories -= 500;
            if (formData.goal === 'gain') calories += 400;

            const dietPlans = {
                maintain: [
                    { meal: 'Wake up', desc: 'Warm Water + Handful of soaked almonds' },
                    { meal: 'Breakfast', desc: 'Mixed Veg Poha or Masala Oats' },
                    { meal: 'Lunch', desc: 'Dal, Rice, 1 Roti, Curd & seasonal Salad' },
                    { meal: 'Dinner', desc: 'Grilled Paneer or Moong Dal Khichdi' },
                ],
                lose: [
                    { meal: 'Wake up', desc: 'Green Tea or Lemon Honey Water' },
                    { meal: 'Breakfast', desc: 'Besan Chilla or Boiled Egg Whites' },
                    { meal: 'Lunch', desc: 'Large bowl of Dal with seasonal vegetables (No Rice)' },
                    { meal: 'Dinner', desc: 'Vegetable Soup or Clear Chicken Broth' },
                ],
                gain: [
                    { meal: 'Wake up', desc: 'Banana Milkshake or Peanut Butter Toast' },
                    { meal: 'Breakfast', desc: 'Stuffed Paratha with Curd and 2 Whole Eggs' },
                    { meal: 'Lunch', desc: 'Paneer/Chicken Curry, Rice, 2 Rotis & Salad' },
                    { meal: 'Dinner', desc: 'High Protein Dal, Rice & Grilled Chicken/Soya' },
                ]
            };

            const exPlans = {
                maintain: [ { day: 'Daily', type: '30 mins Brisk Walking + 10 mins Surya Namaskar' } ],
                lose: [
                    { day: 'Morning', type: '45 mins HIIT / Jogging' },
                    { day: 'Evening', type: '15 mins Deep Stretching' },
                ],
                gain: [
                    { day: 'Mon-Wed-Fri', type: 'Weight Training (Compound Movements)' },
                    { day: 'Tue-Thu', type: 'Core Strength + 20 mins Cardio' },
                ]
            };

            const newPlanner = {
                id: Date.now(),
                bmi,
                calories,
                diet: dietPlans[formData.goal as keyof typeof dietPlans] || dietPlans.maintain,
                exercise: exPlans[formData.goal as keyof typeof exPlans] || exPlans.maintain,
            };

            setPlanner(newPlanner);
            setIsGenerating(false);
            toast({ title: "Architecture Complete", description: "Your blueprint is ready to download." });
        }, 2500);
    };

    const downloadPDF = () => {
        if (!planner) return;
        const doc = new jsPDF();
        const W = doc.internal.pageSize.getWidth();
        
        doc.setFontSize(22);
        doc.setTextColor(36, 136, 232);
        doc.text("YOUR MEDICAL PARTNER", W/2, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setTextColor(100, 116, 139);
        doc.text("Personal Precision Health Report", W/2, 30, { align: 'center' });
        
        doc.setDrawColor(241, 245, 249);
        doc.line(20, 35, W-20, 35);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(`Patient: ${formData.name}`, 20, 45);
        doc.text(`BMI: ${planner.bmi} | Goal: ${formData.goal.toUpperCase()}`, 20, 52);
        doc.text(`Target Energy: ${planner.calories} kcal/day`, 20, 59);
        
        doc.setFontSize(14);
        doc.text("Nutrition Architecture", 20, 75);
        const dietData = planner.diet.map((d: any) => [d.meal, d.desc]);
        (doc as any).autoTable({
            startY: 80,
            head: [['Time', 'Nutrition Strategy']],
            body: dietData,
            theme: 'grid',
            headStyles: { fillColor: [36, 136, 232], fontSize: 10 },
            bodyStyles: { fontSize: 9 }
        });

        const nextY = (doc as any).lastAutoTable.finalY + 15;
        doc.text("Training Protocol", 20, nextY);
        const exData = planner.exercise.map((e: any) => [e.day, e.type]);
        (doc as any).autoTable({
            startY: nextY + 5,
            head: [['Frequency', 'Training Type']],
            body: exData,
            theme: 'grid',
            headStyles: { fillColor: [244, 63, 94], fontSize: 10 },
            bodyStyles: { fontSize: 9 }
        });

        doc.save(`Health_Architecture_${formData.name}.pdf`);
        toast({ title: "Report Downloaded" });
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-gradient-to-b from-[#f0f4ff] via-[#fdfbff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] overflow-hidden fixed inset-0 font-body safe-top">
            
            {/* Branded Native Header */}
            <header className="h-16 px-4 bg-white/60 dark:bg-[#1e1f20]/60 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 z-50">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <div className="h-10 w-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm active:scale-95 transition-all">
                            <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-slate-100" />
                        </div>
                    </Link>
                    <div className="flex flex-col -space-y-0.5">
                        <h1 className="text-[12px] font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tighter leading-none">Health</h1>
                        <p className="text-[9px] font-black text-primary uppercase tracking-[0.25em]">Challenges</p>
                    </div>
                </div>
                <Button variant="ghost" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="rounded-2xl h-10 px-4 gap-2 bg-primary/5 text-primary border border-primary/10">
                    <Languages className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
                </Button>
            </header>

            {/* Main Segmented Area */}
            <main className="flex-1 overflow-hidden relative flex flex-col w-full max-w-4xl mx-auto">
                <Tabs defaultValue="planner" className="flex-1 flex flex-col">
                    <div className="px-4 py-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                        <TabsList className="grid grid-cols-3 h-12 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-white/50 dark:border-slate-700/50">
                            <TabsTrigger value="planner" className="rounded-xl text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">AI Planner</TabsTrigger>
                            <TabsTrigger value="arena" className="rounded-xl text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Arena</TabsTrigger>
                            <TabsTrigger value="stats" className="rounded-xl text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Stats</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 px-4 pb-40 scrollbar-hide">
                        
                        {/* 1. AI PLANNER - MODERN ARCHITECT */}
                        <TabsContent value="planner" className="space-y-6 mt-0">
                            <div className="space-y-1 mt-2">
                                <h2 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase leading-none">Health Architect</h2>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-80">Precision engineering for your biology</p>
                            </div>

                            <Card className="rounded-[2.8rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{t.name}</Label>
                                        <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold text-base px-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{t.age}</Label>
                                        <Input id="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="25" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold text-base px-6" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{t.weight}</Label>
                                        <Input id="weight" type="number" value={formData.weight} onChange={handleInputChange} placeholder="70" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold text-base px-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">{t.height}</Label>
                                        <div className="flex gap-2">
                                            <Input id="height" type="number" value={formData.height} onChange={handleInputChange} placeholder="175" className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold text-base px-6 flex-1" />
                                            <div className="h-14 w-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-[10px] text-primary">CM</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Strategic Goal</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'maintain', label: 'Healthy', icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
                                            { id: 'lose', label: 'Fat Loss', icon: Utensils, color: "text-rose-500", bg: "bg-rose-50" },
                                            { id: 'gain', label: 'Muscle', icon: Dumbbell, color: "text-emerald-500", bg: "bg-emerald-50" }
                                        ].map(g => (
                                            <button key={g.id} onClick={() => handleSelectChange('goal', g.id)}
                                                className={cn(
                                                    "h-20 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all border-2",
                                                    formData.goal === g.id 
                                                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                                                        : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400"
                                                )}>
                                                <g.icon className={cn("h-5 w-5", formData.goal === g.id ? "text-white" : g.color)} />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{g.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button onClick={generatePlanner} disabled={isGenerating} className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(36,136,232,0.4)] active:scale-95 transition-all">
                                    {isGenerating ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> Calculating Bio-Architecture...</> : <><Bot className="mr-2 h-5 w-5" /> {t.generate}</>}
                                </Button>
                            </Card>

                            {planner && (
                                <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-1000">
                                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                                    
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="h-6 w-6 text-primary" />
                                            <h3 className="text-lg font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Your Architecture</h3>
                                        </div>
                                        <Button variant="outline" size="sm" onClick={downloadPDF} className="rounded-full h-10 px-6 gap-2 border-primary/20 text-primary hover:bg-primary hover:text-white shadow-sm transition-all">
                                            <Download className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-widest">PDF Report</span>
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-xl">
                                            <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-primary shrink-0"><Activity className="w-6 h-6" /></div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase">Current BMI</p>
                                                <p className="text-xl font-black text-[#1A365D] dark:text-slate-100">{planner.bmi}</p>
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-xl">
                                            <div className="h-12 w-12 bg-rose-50 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-500 shrink-0"><Flame className="w-6 h-6" /></div>
                                            <div>
                                                <p className="text-[9px] font-black text-slate-400 uppercase">Daily Fuel</p>
                                                <p className="text-xl font-black text-[#1A365D] dark:text-slate-100">{planner.calories} kcal</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 p-8 space-y-8 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-bl-full -z-0" />
                                        <div className="flex items-center gap-3 relative z-10">
                                            <Utensils className="w-6 h-6 text-primary" />
                                            <h4 className="font-black text-xs uppercase tracking-[0.25em] text-[#1A365D] dark:text-slate-200">Meal Engineering</h4>
                                        </div>
                                        <div className="space-y-8 relative z-10">
                                            {planner.diet.map((d: any, i: number) => (
                                                <div key={i} className="flex gap-6 group">
                                                    <div className="flex flex-col items-center">
                                                        <div className="h-3 w-3 rounded-full bg-primary ring-8 ring-primary/5 mt-1.5" />
                                                        <div className="w-px h-full bg-slate-100 dark:bg-slate-800 mt-2" />
                                                    </div>
                                                    <div className="pb-2">
                                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">{d.meal}</p>
                                                        <p className="text-base font-bold text-slate-700 dark:text-slate-300 mt-1">{d.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>

                                    <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 p-8 space-y-8 overflow-hidden relative">
                                        <div className="absolute top-0 right-0 h-32 w-32 bg-rose-500/5 rounded-bl-full -z-0" />
                                        <div className="flex items-center gap-3 relative z-10">
                                            <Dumbbell className="w-6 h-6 text-rose-500" />
                                            <h4 className="font-black text-xs uppercase tracking-[0.25em] text-[#1A365D] dark:text-slate-200">Training Routine</h4>
                                        </div>
                                        <div className="grid gap-4 relative z-10">
                                            {planner.exercise.map((e: any, i: number) => (
                                                <div key={i} className="p-6 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:bg-white transition-all duration-300">
                                                    <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-rose-500 transition-colors">{e.day}</span>
                                                    <span className="text-sm font-black text-slate-800 dark:text-slate-100 text-right max-w-[200px]">{e.type}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            )}
                        </TabsContent>

                        {/* 2. CHALLENGES ARENA - GAMIFIED LOGS */}
                        <TabsContent value="arena" className="space-y-6 mt-0">
                            <div className="flex items-center justify-between mt-2">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase leading-none">Active Arena</h2>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-80">Transform your status daily</p>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button size="icon" className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-900 text-primary shadow-xl border border-primary/10 active:scale-95 transition-all">
                                            <Plus className="h-7 w-7" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-[3rem] p-8 border-none bg-white dark:bg-[#020617] shadow-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black uppercase text-[#1A365D] dark:text-white tracking-tighter">New Custom Mission</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-8 space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-black uppercase text-slate-400 ml-4">Goal Definition</Label>
                                                <Input 
                                                    value={newChallengeTitle} 
                                                    onChange={(e) => setNewChallengeTitle(e.target.value)} 
                                                    placeholder="e.g. Drink 3L Water" 
                                                    className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold text-base px-6" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[11px] font-black uppercase text-slate-400 ml-4">Duration Cycle (Days)</Label>
                                                <Select value={newChallengeDays} onValueChange={setNewChallengeDays}>
                                                    <SelectTrigger className="h-14 rounded-2xl border-none bg-slate-50 dark:bg-slate-800 shadow-inner font-bold text-base px-6"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-1">
                                                        <SelectItem value="7" className="rounded-xl font-bold py-3">7 DAYS BURST</SelectItem>
                                                        <SelectItem value="14" className="rounded-xl font-bold py-3">14 DAYS SPRINT</SelectItem>
                                                        <SelectItem value="30" className="rounded-xl font-bold py-3">30 DAYS MARATHON</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={addCustomChallenge} className="w-full h-16 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20">Activate Mission</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="grid gap-6">
                                {challenges.map((c) => (
                                    <Card key={c.id} className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 p-8 overflow-hidden relative group animate-in zoom-in-95 duration-500">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="space-y-2">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full border border-primary/10">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{c.category}</span>
                                                </div>
                                                <h3 className="text-xl font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight leading-tight">{c.title}</h3>
                                            </div>
                                            {c.isCustom ? (
                                                <Button variant="ghost" size="icon" onClick={() => deleteChallenge(c.id)} className="h-10 w-10 text-slate-200 hover:text-red-500 transition-colors shrink-0">
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            ) : (
                                                <div className="h-14 w-14 bg-amber-50 dark:bg-amber-900/20 rounded-[1.5rem] flex items-center justify-center text-amber-500 shadow-inner shrink-0">
                                                    <Trophy className="w-7 h-7" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-8 leading-relaxed pr-8">{c.description}</p>
                                        
                                        <div className="space-y-3 mb-8">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-400">Mission Progress</span>
                                                <span className="text-primary">{Math.round((c.progress / c.total) * 100)}%</span>
                                            </div>
                                            <Progress value={(c.progress / c.total) * 100} className="h-3 bg-slate-100 dark:bg-slate-800" />
                                        </div>

                                        {c.status === 'active' && (
                                            <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-500">
                                                <div className="flex items-center gap-2 mb-1 opacity-60">
                                                    <ClipboardCheck className="w-4 h-4 text-primary" />
                                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Sync Daily Performance</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {c.daily.map((done: boolean, idx: number) => (
                                                        <button 
                                                            key={idx} 
                                                            onClick={() => handleDailyProgress(c.id, idx)}
                                                            className={cn(
                                                                "h-11 w-11 rounded-2xl border-2 transition-all flex items-center justify-center relative group/box",
                                                                done 
                                                                    ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105" 
                                                                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-300 hover:border-primary/40 active:scale-90"
                                                            )}
                                                        >
                                                            {done ? <Check className="w-6 h-6" /> : <span className="text-[10px] font-black">{idx+1}</span>}
                                                            {done && <div className="absolute inset-0 bg-white/20 rounded-2xl animate-ping" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-10 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-primary fill-primary/20" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{c.reward}</span>
                                            </div>
                                            {c.status === 'new' && (
                                                <Button onClick={() => handleJoinChallenge(c.id)} className="rounded-full px-8 h-12 bg-primary font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/25 active:scale-95 transition-all">Accept Mission</Button>
                                            )}
                                            {c.status === 'completed' && (
                                                <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-none px-6 py-2.5 rounded-full text-[10px] font-black uppercase shadow-sm">VICTORY ACHIEVED ✓</Badge>
                                            )}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* 3. STATS - ANALYTICAL INSIGHTS */}
                        <TabsContent value="stats" className="space-y-6 mt-0">
                             <div className="space-y-1 mt-2">
                                <h2 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase leading-none">Bio Analytics</h2>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] opacity-80">Visualizing your performance matrix</p>
                            </div>

                            <div className="grid gap-6">
                                <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 p-8 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-6 h-6 text-primary" />
                                            <h4 className="font-black text-xs uppercase tracking-[0.25em] text-[#1A365D] dark:text-slate-300">Weekly Pulse</h4>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg">
                                            <Zap className="h-3 w-3 text-emerald-500" />
                                            <span className="text-[9px] font-black text-emerald-600 uppercase">+12% OPTIMAL</span>
                                        </div>
                                    </div>
                                    <div className="h-64 w-full mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { day: 'Mon', val: 45 }, { day: 'Tue', val: 30 }, { day: 'Wed', val: 60 },
                                                { day: 'Thu', val: 20 }, { day: 'Fri', val: 45 }, { day: 'Sat', val: 90 }, { day: 'Sun', val: 50 }
                                            ]}>
                                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.05} />
                                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}} />
                                                <Bar dataKey="val" fill="#2488E8" radius={[10, 10, 0, 0]} barSize={28} />
                                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 p-8 space-y-8">
                                    <div className="flex items-center gap-3">
                                        <Smile className="w-6 h-6 text-orange-500" />
                                        <h4 className="font-black text-xs uppercase tracking-[0.25em] text-[#1A365D] dark:text-slate-300">Emotional Balance</h4>
                                    </div>
                                    <div className="h-64 w-full mt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { d: '1', m: 3 }, { d: '2', m: 4 }, { d: '3', m: 5 }, { d: '4', m: 2 }, { d: '5', m: 4 }, { d: '6', m: 5 }, { d: '7', m: 5 }
                                            ]}>
                                                <defs>
                                                    <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                                                        <stop offset="0%" stopColor="#F97316" />
                                                        <stop offset="100%" stopColor="#EC4899" />
                                                    </linearGradient>
                                                </defs>
                                                <Line type="monotone" dataKey="m" stroke="url(#lineGrad)" strokeWidth={8} dot={{r: 6, fill: '#fff', strokeWidth: 4, stroke: '#F97316'}} activeDot={{r: 10, shadow: '0 0 30px rgba(249,115,22,0.5)'}} />
                                                <XAxis dataKey="d" hide />
                                                <YAxis hide domain={[1, 5]} />
                                                <Tooltip cursor={{stroke: 'transparent'}} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', fontWeight: 900 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>

                    </ScrollArea>
                </Tabs>
            </main>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .touch-none { touch-action: none; }
            `}</style>
        </div>
    );
}