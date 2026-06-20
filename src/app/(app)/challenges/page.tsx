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
        const saved = localStorage.getItem('user_health_challenges_v4');
        if (saved) setChallenges(JSON.parse(saved));
        else setChallenges(INITIAL_CHALLENGES);
    }, []);

    useEffect(() => {
        if (challenges.length > 0) {
            localStorage.setItem('user_health_challenges_v4', JSON.stringify(challenges));
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
            description: `User defined custom goal for ${days} days.`,
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
        toast({ title: "Task Added", description: "Your custom goal is now active." });
    };

    const deleteChallenge = (id: string) => {
        setChallenges(prev => prev.filter(c => c.id !== id));
        toast({ title: "Removed", description: "Goal removed from your arena." });
    };

    // --- LOGIC: AI HEALTH PLANNER ---
    const generatePlanner = () => {
        if (!formData.name || !formData.weight) {
            toast({ variant: 'destructive', title: 'Data Missing', description: 'Please fill in your name and weight.' });
            return;
        }

        setIsGenerating(true);
        
        // Simulate AI Logic for different personas
        setTimeout(() => {
            const w = Number(formData.weight);
            const a = Number(formData.age);
            let hCm = formData.heightUnit === 'cm' ? Number(formData.height) : (Number(formData.heightFt) * 30.48 + Number(formData.heightIn) * 2.54);
            
            const bmi = Math.round((w / ((hCm/100) * (hCm/100))) * 10) / 10;
            
            let bmr = formData.gender === 'male' ? (10*w + 6.25*hCm - 5*a + 5) : (10*w + 6.25*hCm - 5*a - 161);
            const activityMult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }[formData.activity as any] || 1.375;
            let calories = Math.round(bmr * activityMult);
            
            // Adjust based on Goal Persona
            if (formData.goal === 'lose') calories -= 500;
            if (formData.goal === 'gain') calories += 400;

            const dietPlans = {
                maintain: [
                    { meal: 'Wake up (7 AM)', desc: lang === 'en' ? 'Honey Lemon Water + 5 Almonds' : 'शहद नींबू पानी + 5 बादाम' },
                    { meal: 'Breakfast (9 AM)', desc: lang === 'en' ? 'Poha with veggies OR Vegetable Omelette' : 'सब्जियों वाला पोहा या वेजिटेबल ऑमलेट' },
                    { meal: 'Lunch (1:30 PM)', desc: lang === 'en' ? '2 Rotis + Seasonal Veg + Curd + Salad' : '2 रोटी + मौसमी सब्जी + दही + सलाद' },
                    { meal: 'Dinner (8 PM)', desc: lang === 'en' ? 'Paneer Stir-fry OR Moong Dal Khichdi' : 'पनीर स्टिर-फ्राई या मूंग दाल खिचड़ी' },
                ],
                lose: [
                    { meal: 'Wake up (7 AM)', desc: lang === 'en' ? 'Green Tea + 2 Walnuts' : 'ग्रीन टी + 2 अखरोट' },
                    { meal: 'Breakfast (9 AM)', desc: lang === 'en' ? 'Oats with low-fat milk OR Besan Chilla' : 'ओट्स + लो-फैट मिल्क या बेसन चिल्ला' },
                    { meal: 'Lunch (1:30 PM)', desc: lang === 'en' ? '1 Roti + Large bowl of Dal + Steamed Veg' : '1 रोटी + बड़ी कटोरी दाल + उबली सब्जियां' },
                    { meal: 'Dinner (7:30 PM)', desc: lang === 'en' ? 'Clear Soup + Grilled Chicken/Paneer' : 'क्लियर सूप + ग्रिल्ड चिकन/पनीर' },
                ],
                gain: [
                    { meal: 'Wake up (7 AM)', desc: lang === 'en' ? 'Banana Shake + Handful of Peanuts' : 'बनाना शेक + मुट्ठी भर मूंगफली' },
                    { meal: 'Breakfast (9 AM)', desc: lang === 'en' ? 'Stuffed Paratha + Curd + 2 Eggs' : 'भरवां पराठा + दही + 2 अंडे' },
                    { meal: 'Lunch (1:30 PM)', desc: lang === 'en' ? '2-3 Rotis + Rice + Paneer/Egg Curry + Salad' : '2-3 रोटी + चावल + पनीर/अंडा करी + सलाद' },
                    { meal: 'Dinner (8:30 PM)', desc: lang === 'en' ? 'Rice + Dal + Chicken/Soya Chunks + Veg' : 'चावल + दाल + चिकन/सोया चंक्स + सब्जी' },
                ]
            };

            const exPlans = {
                maintain: [
                    { day: 'Daily', type: lang === 'en' ? '30 mins Brisk Walking / Yoga' : '30 मिनट तेज चलना / योग' },
                ],
                lose: [
                    { day: 'Mon-Fri', type: lang === 'en' ? '45 mins High Intensity Cardio' : '45 मिनट हाई इंटेंसिटी कार्डियो' },
                    { day: 'Sat', type: lang === 'en' ? 'Full Body Stretching' : 'फुल बॉडी स्ट्रेचिंग' },
                ],
                gain: [
                    { day: 'Mon/Wed/Fri', type: lang === 'en' ? 'Strength Training (Push/Pull)' : 'स्ट्रेंथ ट्रेनिंग (पुश/पुल)' },
                    { day: 'Tue/Thu', type: lang === 'en' ? 'Lower Body / Core Focus' : 'लोअर बॉडी / कोर फोकस' },
                ]
            };

            const newPlanner = {
                id: Date.now(),
                createdAt: new Date().toISOString(),
                bmi,
                calories,
                diet: dietPlans[formData.goal as keyof typeof dietPlans] || dietPlans.maintain,
                exercise: exPlans[formData.goal as keyof typeof exPlans] || exPlans.maintain,
                warnings: formData.medical ? (lang === 'en' ? `Caution: Adjusted for ${formData.medical}` : `सावधानी: ${formData.medical} के लिए समायोजित`) : null
            };

            setPlanner(newPlanner);
            setIsGenerating(false);
            toast({ title: "Architecture Built", description: "Your personalized health blueprint is ready." });
        }, 2000);
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
        doc.text(`Status: ${formData.goal.toUpperCase()} | BMI: ${planner.bmi}`, 20, 52);
        doc.text(`Target Energy: ${planner.calories} kcal/day`, 20, 59);
        
        doc.setFontSize(14);
        doc.text("Nutrition Architecture", 20, 75);
        const dietData = planner.diet.map((d: any) => [d.meal, d.desc]);
        (doc as any).autoTable({
            startY: 80,
            head: [['Time', 'Nutrition Target']],
            body: dietData,
            theme: 'grid',
            headStyles: { fillColor: [36, 136, 232], fontSize: 10, fontStyle: 'bold' },
            bodyStyles: { fontSize: 9 }
        });

        const nextY = (doc as any).lastAutoTable.finalY + 15;
        doc.text("Training Protocol", 20, nextY);
        const exData = planner.exercise.map((e: any) => [e.day, e.type]);
        (doc as any).autoTable({
            startY: nextY + 5,
            head: [['Schedule', 'Activity Type']],
            body: exData,
            theme: 'grid',
            headStyles: { fillColor: [20, 207, 189], fontSize: 10, fontStyle: 'bold' },
            bodyStyles: { fontSize: 9 }
        });

        doc.save(`${formData.name}_Health_Blueprint.pdf`);
        toast({ title: "Report Ready", description: "PDF has been generated successfully." });
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-[#f8fbff] dark:bg-[#020617] overflow-hidden fixed inset-0 font-body">
            
            {/* Native Header */}
            <header className="h-16 px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 z-50">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="space-y-0">
                        <h1 className="text-lg font-black text-[#1A365D] dark:text-white uppercase leading-none tracking-tighter">Health Center</h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Bio-Sync Active</p>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="rounded-full h-9 px-4 gap-2 bg-primary/5 text-primary border border-primary/10">
                    <Languages className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'en' ? 'हिन्दी' : 'English'}</span>
                </Button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-hidden relative">
                <Tabs defaultValue="planner" className="h-full flex flex-col">
                    <div className="px-6 pt-6 pb-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
                        <TabsList className="grid grid-cols-3 h-12 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-white/50 dark:border-slate-700/50">
                            <TabsTrigger value="planner" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">AI Planner</TabsTrigger>
                            <TabsTrigger value="challenges" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Active Arena</TabsTrigger>
                            <TabsTrigger value="stats" className="rounded-xl text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Analysis</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 px-6 pb-40 pt-4 scrollbar-hide">
                        
                        {/* 1. AI PLANNER TAB */}
                        <TabsContent value="planner" className="space-y-8 mt-0">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase">Health Architect</h2>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Enter your bio-data to construct your weekly health architecture.</p>
                            </div>

                            <Card className="rounded-[2.5rem] border-none shadow-xl bg-white/80 dark:bg-slate-900/80 p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.name}</Label>
                                        <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Name" className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.age}</Label>
                                        <Input id="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="25" className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.weight}</Label>
                                        <Input id="weight" type="number" value={formData.weight} onChange={handleInputChange} placeholder="70" className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.height}</Label>
                                        <div className="flex gap-2">
                                            {formData.heightUnit === 'cm' ? (
                                                <Input id="height" type="number" value={formData.height} onChange={handleInputChange} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold flex-1" />
                                            ) : (
                                                <div className="flex gap-1 flex-1">
                                                    <Input id="heightFt" type="number" placeholder="Ft" value={formData.heightFt} onChange={handleInputChange} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold w-1/2" />
                                                    <Input id="heightIn" type="number" placeholder="In" value={formData.heightIn} onChange={handleInputChange} className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold w-1/2" />
                                                </div>
                                            )}
                                            <Select value={formData.heightUnit} onValueChange={(v) => handleSelectChange('heightUnit', v)}>
                                                <SelectTrigger className="h-12 rounded-xl w-20 bg-slate-50 dark:bg-slate-800 border-none"><SelectValue /></SelectTrigger>
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
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 'maintain', label: 'Health', icon: Activity },
                                                { id: 'lose', label: 'Diet', icon: Utensils },
                                                { id: 'gain', label: 'Gym', icon: Dumbbell }
                                            ].map(g => (
                                                <button key={g.id} onClick={() => handleSelectChange('goal', g.id)} className={cn("h-16 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border", formData.goal === g.id ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-slate-50 dark:bg-slate-800 text-slate-400 border-transparent")}>
                                                    <g.icon className="h-4 w-4" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">{g.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">{t.medical}</Label>
                                        <Input id="medical" value={formData.medical} onChange={handleInputChange} placeholder="E.g. Asthma, Diabetes..." className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold" />
                                    </div>
                                </div>

                                <Button onClick={generatePlanner} disabled={isGenerating} className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.25em] shadow-[0_20px_40px_-10px_rgba(36,136,232,0.4)] active:scale-95 transition-all">
                                    {isGenerating ? <><Loader2 className="mr-2 animate-spin h-5 w-5" /> Optimizing Bio-Data...</> : <><Bot className="mr-2 h-5 w-5" /> {t.generate}</>}
                                </Button>
                            </Card>

                            {planner && (
                                <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
                                    <div className="h-px bg-slate-200 dark:bg-slate-800" />
                                    
                                    <section className="space-y-5">
                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheck className="h-5 w-5 text-primary" />
                                                <h3 className="text-lg font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{t.plannerTitle}</h3>
                                            </div>
                                            <Button variant="outline" size="sm" onClick={downloadPDF} className="rounded-full h-9 px-4 gap-2 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all">
                                                <Download className="w-3.5 h-3.5" /> <span className="text-[9px] font-black uppercase tracking-widest">PDF Report</span>
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-5 rounded-[2rem] bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 flex items-center gap-4">
                                                <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary shadow-sm"><Activity className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase">BMI Status</p>
                                                    <p className="text-lg font-black text-[#1A365D] dark:text-slate-100">{planner.bmi}</p>
                                                </div>
                                            </div>
                                            <div className="p-5 rounded-[2rem] bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 flex items-center gap-4">
                                                <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm"><Flame className="w-5 h-5" /></div>
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase">Daily Kcal</p>
                                                    <p className="text-lg font-black text-[#1A365D] dark:text-slate-100">{planner.calories}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Card className="rounded-[2.8rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Utensils className="w-5 h-5 text-primary" />
                                                    <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Meal Architecture</h4>
                                                </div>
                                                <Link href="/food-scanner">
                                                    <Button variant="ghost" className="h-8 px-4 rounded-full text-[9px] font-black uppercase text-primary gap-2 bg-primary/5">
                                                        <Zap className="h-3 w-3" /> Scan Meal
                                                    </Button>
                                                </Link>
                                            </div>
                                            <div className="space-y-6">
                                                {planner.diet.map((d: any, i: number) => (
                                                    <div key={i} className="flex gap-4 group">
                                                        <div className="flex flex-col items-center">
                                                            <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                                                            <div className="w-px h-full bg-slate-100 dark:bg-slate-800 mt-1" />
                                                        </div>
                                                        <div className="pb-4">
                                                            <p className="text-[9px] font-black text-primary uppercase tracking-widest">{d.meal}</p>
                                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">{d.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>

                                        <Card className="rounded-[2.8rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                                            <div className="flex items-center gap-3">
                                                <Dumbbell className="w-5 h-5 text-primary" />
                                                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Training Routine</h4>
                                            </div>
                                            <div className="grid gap-3">
                                                {planner.exercise.map((e: any, i: number) => (
                                                    <div key={i} className="p-5 rounded-3xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:bg-white transition-all">
                                                        <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-primary">{e.day}</span>
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
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase">Active Arena</h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beat the odds, transform your status</p>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-xl border-primary/20 text-primary">
                                            <PlusCircle className="h-6 w-6" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-[2.5rem] p-8 border-none bg-white dark:bg-slate-900 shadow-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-black uppercase text-[#1A365D] dark:text-white">New Personal Mission</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-6 space-y-6">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Goal Name</Label>
                                                <Input 
                                                    value={newChallengeTitle} 
                                                    onChange={(e) => setNewChallengeTitle(e.target.value)} 
                                                    placeholder="E.g. Drink 3L Water" 
                                                    className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold" 
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Duration (Days)</Label>
                                                <Select value={newChallengeDays} onValueChange={setNewChallengeDays}>
                                                    <SelectTrigger className="h-12 rounded-xl border-none bg-slate-50 dark:bg-slate-800 shadow-inner"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="rounded-xl border-none shadow-2xl">
                                                        <SelectItem value="7">7 Days</SelectItem>
                                                        <SelectItem value="14">14 Days</SelectItem>
                                                        <SelectItem value="30">30 Days</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={addCustomChallenge} className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Activate Goal</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="grid gap-6">
                                {challenges.map((c) => (
                                    <Card key={c.id} className="rounded-[2.8rem] border-none shadow-xl bg-white dark:bg-slate-900 p-6 overflow-hidden relative group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="space-y-1.5">
                                                <Badge className="bg-primary/10 text-primary text-[8px] font-black border-none uppercase px-3 rounded-md">{c.category}</Badge>
                                                <h3 className="text-lg font-black text-[#1A365D] dark:text-slate-100 uppercase tracking-tight">{c.title}</h3>
                                            </div>
                                            {c.isCustom ? (
                                                <Button variant="ghost" size="icon" onClick={() => deleteChallenge(c.id)} className="h-10 w-10 text-slate-200 hover:text-red-500 transition-colors">
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            ) : (
                                                <div className="h-10 w-10 bg-yellow-50 dark:bg-yellow-950/20 rounded-2xl flex items-center justify-center text-yellow-500 shadow-inner">
                                                    <Trophy className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{c.description}</p>
                                        
                                        <div className="space-y-2 mb-8">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-slate-400">Biological Progress</span>
                                                <span className="text-primary">{Math.round((c.progress / c.total) * 100)}%</span>
                                            </div>
                                            <Progress value={(c.progress / c.total) * 100} className="h-2.5 bg-slate-100 dark:bg-slate-800" />
                                        </div>

                                        {c.status === 'active' && (
                                            <div className="space-y-4 animate-in fade-in duration-500">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <ClipboardCheck className="w-4 h-4 text-emerald-500" />
                                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.25em]">Log Performance</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {c.daily.map((done: boolean, idx: number) => (
                                                        <button 
                                                            key={idx} 
                                                            onClick={() => handleDailyProgress(c.id, idx)}
                                                            className={cn(
                                                                "h-10 w-10 rounded-2xl border-2 transition-all flex items-center justify-center",
                                                                done 
                                                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                                                                    : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-300 hover:border-primary/40"
                                                            )}
                                                        >
                                                            {done ? <Check className="w-5 h-5" /> : <span className="text-[10px] font-black">{idx+1}</span>}
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
                                                <Button onClick={() => handleJoinChallenge(c.id)} className="rounded-full px-8 h-10 bg-primary font-black uppercase text-[9px] tracking-widest shadow-xl shadow-primary/20">Accept Challenge</Button>
                                            )}
                                            {c.status === 'completed' && (
                                                <Badge className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-none px-5 py-2 rounded-full text-[9px] font-black uppercase shadow-sm">Mission Completed ✓</Badge>
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
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual analytics of your bio-metrical performance</p>
                            </div>

                            <div className="grid gap-6">
                                <Card className="rounded-[2.8rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-5 h-5 text-primary" />
                                            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Weekly Pulse</h4>
                                        </div>
                                        <span className="text-[10px] font-black text-emerald-500 uppercase">+12% Optimal</span>
                                    </div>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={[
                                                { day: 'Mon', min: 45 }, { day: 'Tue', min: 30 }, { day: 'Wed', min: 60 },
                                                { day: 'Thu', min: 20 }, { day: 'Fri', min: 45 }, { day: 'Sat', min: 90 }, { day: 'Sun', min: 50 }
                                            ]}>
                                                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.05} />
                                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 900, fill: '#64748b'}} />
                                                <Bar dataKey="min" fill="#2488E8" radius={[8, 8, 0, 0]} barSize={24} />
                                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>

                                <Card className="rounded-[2.8rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Smile className="w-5 h-5 text-orange-500" />
                                        <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-500">Mental Sentiment</h4>
                                    </div>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { d: '1', m: 3 }, { d: '2', m: 4 }, { d: '3', m: 5 }, { d: '4', m: 2 }, { d: '5', m: 4 }, { d: '6', m: 5 }, { d: '7', m: 5 }
                                            ]}>
                                                <Line type="monotone" dataKey="m" stroke="#F97316" strokeWidth={6} dot={{r: 6, fill: '#F97316', strokeWidth: 4, stroke: '#fff'}} activeDot={{r: 10, shadow: '0 0 20px rgba(249,115,22,0.4)'}} />
                                                <XAxis dataKey="d" hide />
                                                <YAxis hide domain={[1, 5]} />
                                                <Tooltip cursor={{stroke: 'transparent'}} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', fontWeight: 900 }} />
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

// --- SUB COMPONENTS ---

function ScrollArea({ children, className }: any) {
    return (
        <div className={cn("overflow-y-auto scrollbar-hide touch-pan-y", className)}>
            {children}
        </div>
    );
}
