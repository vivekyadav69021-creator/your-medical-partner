
'use client';

import { useActionState, useRef, useEffect, useState, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
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
import { Check, Trophy, Star, Sparkles, Zap, Activity, Smile, Bot, Terminal, Save, Download, CheckCircle, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, addDoc, collection, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { Checkbox } from '@/components/ui/checkbox';


const initialChallenges = [
  {
    id: 'challenge-1',
    title: '7-Day Walking Challenge',
    description: 'Walk at least 8,000 steps every day for a week.',
    reward: '250 Points & a Virtual Badge',
    progress: 4,
    total: 7,
    status: 'active' as 'new' | 'active' | 'completed',
    daily: Array(7).fill(false).map((_, i) => i < 4)
  },
  {
    id: 'challenge-2',
    title: 'Mindful Month',
    description: 'Meditate for 10 minutes daily for 30 days.',
    reward: '500 Points & Mindfulness Master Badge',
    progress: 0,
    total: 30,
    status: 'new' as 'new' | 'active' | 'completed',
    daily: Array(30).fill(false)
  },
    {
    id: 'challenge-3',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water daily for 2 weeks.',
    reward: '200 Points',
    progress: 14,
    total: 14,
    status: 'completed' as 'new' | 'active' | 'completed',
    daily: Array(14).fill(true)
  },
];

const activityData = [
  { day: 'Mon', minutes: 30 },
  { day: 'Tue', minutes: 45 },
  { day: 'Wed', minutes: 60 },
  { day: 'Thu', minutes: 20 },
  { day: 'Fri', minutes: 50 },
  { day: 'Sat', minutes: 90 },
  { day: 'Sun', minutes: 75 },
];

const moodData = [
  { day: 'Mon', mood: 4 },
  { day: 'Tue', mood: 3 },
  { day: 'Wed', mood: 5 },
  { day: 'Thu', mood: 4 },
  { day: 'Fri', mood: 5 },
  { day: 'Sat', mood: 4 },
  { day: 'Sun', mood: 3 },
];

const labels = {
    en: {
      name: 'Name', age:'Age', gender:'Gender', weight:'Weight (kg)', height:'Height',
      activity:'Activity level', goal:'Primary goal', medical:'Medical conditions / allergies',
      time:'Daily exercise time (minutes)', notes:'Extra notes', generate:'Generate Planner',
      save:'Save to Profile', download:'Download PDF', plannerTitle:'Your 7-day Health Plan',
      statusSaving:'Saving...', statusSaved:'Saved ✓', statusNoAuth:'Please sign in to save.'
    },
    hi: {
      name:'नाम', age:'आयु', gender:'लिंग', weight:'वजन (kg)', height:'ऊँचाई',
      activity:'गतिविधि स्तर', goal:'प्राथमिक लक्ष्य', medical:'चिकित्सीय स्थिति / एलर्जी',
      time:'दैनिक व्यायाम समय (मिनट)', notes:'अतिरिक्त नोट्स', generate:'प्लान बनाएँ',
      save:'प्रोफ़ाइल में सेव करें', download:'PDF डाउनलोड', plannerTitle:'आपकी 7-दिवसीय हेल्थ योजना',
      statusSaving:'सहेजा जा रहा है...', statusSaved:'सहेजा गया ✓', statusNoAuth:'सहेम के लिए साइन-इन करें।'
    }
  };


function HealthPlanner() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [lang, setLang] = useState<'en' | 'hi'>('en');
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'male',
        weight: '',
        height: '',
        heightFt: '',
        heightIn: '',
        heightUnit: 'cm',
        activity: 'light',
        goal: 'maintain',
        medical: '',
        timeMins: '30',
        notes: ''
    });
    const [planner, setPlanner] = useState<any>(null);
    const [status, setStatus] = useState('');
    const t = labels[lang];

    useEffect(() => {
        if (user) {
            setFormData(prev => ({...prev, name: user.displayName || user.email || ''}));
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSelectChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    }

    const generatePlanner = () => {
        if (!formData.name) {
            toast({ variant: 'destructive', title: 'Name required', description: 'Please enter a name to generate a planner.' });
            return;
        }

        const calcBMI = (weight: number, heightVal: string, heightUnit: string, heightFtVal: string, heightInVal: string) => {
            if(!weight) return null;
            let heightCm = 0;
            if (heightUnit === 'ft') {
                const ft = Number(heightFtVal) || 0;
                const inches = Number(heightInVal) || 0;
                if (ft === 0) return null;
                heightCm = (ft * 30.48) + (inches * 2.54);
            } else {
                heightCm = Number(heightVal) || 0;
            }
            
            if (heightCm === 0) return null;

            const h = heightCm/100;
            const bmi = weight / (h*h);
            return Math.round(bmi*10)/10;
        };

        const estimateCalories = (form: typeof formData) => {
            const w = Number(form.weight), age = Number(form.age);
            let heightCm = 0;
             if (form.heightUnit === 'ft') {
                const ft = Number(form.heightFt) || 0;
                const inches = Number(form.heightIn) || 0;
                heightCm = (ft * 30.48) + (inches * 2.54);
            } else {
                heightCm = Number(form.height) || 0;
            }
            
            if(!w || !heightCm || !age) return null;
            let bmr;
            if(form.gender === 'female') bmr = 10*w + 6.25*heightCm - 5*age - 161;
            else bmr = 10*w + 6.25*heightCm - 5*age + 5;
            const mult = { sedentary:1.2, light:1.375, moderate:1.55, active:1.725 }[form.activity as 'sedentary' | 'light' | 'moderate' | 'active']||1.375;
            let calories = Math.round(bmr * mult);
            if(form.goal === 'lose') calories = Math.max(1200, calories - 400);
            if(form.goal === 'gain') calories = calories + 300;
            return calories;
        };

        const generateDailyDiet = (calories: number | null) => {
          if(!calories) return [];
          return [
            { meal:'Breakfast', kcal: Math.round(calories * 0.25), sample: 'Oats/Poha/Idli + fruit + milk/curd' },
            { meal:'Mid Snack', kcal: Math.round(calories * 0.05), sample: 'Fruit / nuts' },
            { meal:'Lunch', kcal: Math.round(calories * 0.35), sample: 'Chapati/Rice + Dal/Paneer/Chicken + Salad' },
            { meal:'Evening Snack', kcal: Math.round(calories * 0.05), sample: 'Buttermilk / Sprouts' },
            { meal:'Dinner', kcal: Math.round(calories * 0.30), sample: 'Light veg/non-veg + soup' }
          ];
        };

        const generateExercisePlan = (form: typeof formData) => {
          const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
          return days.map((day, i) => {
            let type = 'Brisk Walk or Yoga';
            const time = Number(form.timeMins);
            if (time >= 40 && form.activity === 'active') type = (i % 2 === 0) ? 'Strength training' : 'HIIT / Cardio';
            else if (form.activity === 'moderate') type = (i % 3 === 0) ? 'Strength / Core' : 'Brisk Walk';
            if (time < 10) type = 'Light Stretching';
            if (i === 6) type = 'Rest or light walk';
            return { day, activity: type, minutes: time };
          });
        };
        
        const newPlanner = {
            createdAt: new Date().toISOString(),
            personal: formData,
            bmi: calcBMI(Number(formData.weight), formData.height, formData.heightUnit, formData.heightFt, formData.heightIn),
            calories: estimateCalories(formData),
            dailyDiet: generateDailyDiet(estimateCalories(formData)),
            exercise: generateExercisePlan(formData),
            mental: ['Daily 5–10 min breathing exercise.', 'Aim for 7–8 hours of sleep.'],
            hydration: 'Drink 30-40 ml per kg body weight daily.',
        };

        setPlanner(newPlanner);
    };

    const savePlanner = async () => {
        if (!planner) {
            toast({ variant: 'destructive', title: 'No planner generated', description: 'Please generate a planner first.' });
            return;
        }
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Authentication Error', description: t.statusNoAuth });
            return;
        }
        setStatus(t.statusSaving);
        try {
            const plannersCol = collection(firestore, 'users', user.uid, 'planners');
            await addDoc(plannersCol, planner);
            setStatus(t.statusSaved);
            toast({ title: 'Planner Saved', description: 'Your health planner has been saved to your profile.'});
        } catch (error) {
            console.error(error);
            setStatus('Save failed.');
            toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save your planner.'});
        }
    };
    
    const downloadPdf = async () => {
        if (!planner) {
          toast({ variant: "destructive", title: "No Planner", description: "Please generate a planner first." });
          return;
        }

        setStatus('Preparing PDF...');
        const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        const W = doc.internal.pageSize.getWidth();
        let y = 40;

        doc.setFontSize(18); doc.text('Your Medical Partner — Health Planner', W/2, y, {align:'center'}); y += 24;
        doc.setFontSize(12);
        doc.text(`Name: ${planner.personal.name || '-'}`, 40, y); doc.text(`Created: ${new Date(planner.createdAt).toLocaleDateString()}`, W-200, y); y += 18;
        doc.text(`Age: ${planner.personal.age || '-'}  Gender: ${planner.personal.gender || '-'}`, 40, y); y += 18;
        doc.text(`BMI: ${planner.bmi || '-'}  Est. Calories: ${planner.calories || '-'} kcal`, 40, y); y += 22;

        doc.setFontSize(14); doc.text('Daily Diet', 40, y); y += 16;
        doc.setFontSize(11);
        planner.dailyDiet.forEach((d: any) => {
          doc.text(`- ${d.meal}: ${d.kcal} kcal (${d.sample})`, 48, y); y += 14;
        });

        y += 8;
        doc.setFontSize(14); doc.text('Weekly Exercise Plan', 40, y); y += 16;
        doc.setFontSize(11);
        planner.exercise.forEach((e: any) => {
          doc.text(`- ${e.day}: ${e.activity} (${e.minutes} mins)`, 48, y); y += 14;
        });
        
        y+= 8;
        doc.setFontSize(14); doc.text('Mental Wellbeing', 40, y); y += 16;
        doc.setFontSize(11);
        planner.mental.forEach((m: string) => {
            doc.text(`- ${m}`, 48, y); y+=14;
        });

        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        const nameSafe = (planner.personal.name || 'planner').replace(/\s+/g,'_');
        a.download = `${nameSafe}_health_planner.pdf`;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
        setStatus('');
        toast({title: "PDF Downloaded"});
  };

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>{lang === 'en' ? 'AI Health Planner' : 'एआई हेल्थ प्लानर'}</CardTitle>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="hpLang">Language</Label>
                        <Select value={lang} onValueChange={(v) => setLang(v as 'en' | 'hi')}>
                            <SelectTrigger id="hpLang" className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="hi">हिन्दी</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <CardDescription>{lang === 'en' ? 'Fill in your details to get a personalized weekly health plan.' : 'व्यक्तिगत साप्ताहिक स्वास्थ्य योजना प्राप्त करने के लिए अपना विवरण भरें।'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t.name}</Label>
                        <Input id="name" value={formData.name} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="age">{t.age}</Label>
                        <Input id="age" type="number" value={formData.age} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">{t.gender}</Label>
                        <Select value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="weight">{t.weight}</Label>
                        <Input id="weight" type="number" value={formData.weight} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">{t.height}</Label>
                        <div className="flex gap-2">
                           {formData.heightUnit === 'cm' ? (
                               <Input id="height" type="number" placeholder="cm" value={formData.height} onChange={handleInputChange} />
                           ) : (
                               <div className="flex gap-2 w-full">
                                    <Input id="heightFt" type="number" placeholder="ft" value={formData.heightFt} onChange={handleInputChange} className="w-1/2" />
                                    <Input id="heightIn" type="number" placeholder="in" value={formData.heightIn} onChange={handleInputChange} className="w-1/2" />
                               </div>
                           )}
                           <Select value={formData.heightUnit} onValueChange={(v) => handleSelectChange('heightUnit', v)}>
                                <SelectTrigger className="w-[80px]"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cm">cm</SelectItem>
                                    <SelectItem value="ft">ft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="activity">{t.activity}</Label>
                        <Select value={formData.activity} onValueChange={(v) => handleSelectChange('activity', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sedentary">Sedentary</SelectItem>
                                <SelectItem value="light">Light (1-3 days/wk)</SelectItem>
                                <SelectItem value="moderate">Moderate (3-5 days/wk)</SelectItem>
                                <SelectItem value="active">Active (6+ days/wk)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="goal">{t.goal}</Label>
                        <Select value={formData.goal} onValueChange={(v) => handleSelectChange('goal', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="maintain">Maintain weight</SelectItem>
                                <SelectItem value="lose">Lose weight</SelectItem>
                                <SelectItem value="gain">Gain muscle</SelectItem>
                                <SelectItem value="improve_fitness">Improve fitness</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="medical">{t.medical}</Label>
                        <Input id="medical" placeholder="e.g. Diabetes, Hypertension" value={formData.medical} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="timeMins">{t.time}</Label>
                        <Input id="timeMins" type="number" value={formData.timeMins} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes">{t.notes}</Label>
                    <Textarea id="notes" placeholder="e.g. Vegetarian, intermittent fasting" value={formData.notes} onChange={handleInputChange} />
                </div>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center gap-4">
                <Button onClick={generatePlanner}><Sparkles className="mr-2 h-4 w-4" />{t.generate}</Button>
                <Button variant="outline" onClick={savePlanner} disabled={!planner || status === t.statusSaving}><Save className="mr-2 h-4 w-4" />{status === t.statusSaving ? t.statusSaving : t.save}</Button>
                <Button variant="outline" onClick={downloadPdf} disabled={!planner}><Download className="mr-2 h-4 w-4" />{t.download}</Button>
                <p className="text-sm text-muted-foreground">{status}</p>
            </CardFooter>
             {planner && (
                <CardContent>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.plannerTitle}</CardTitle>
                            <CardDescription>Created: {new Date(planner.createdAt).toLocaleDateString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="prose prose-sm dark:prose-invert max-w-full">
                            <p><strong>Name:</strong> {planner.personal.name || '-'} | <strong>BMI:</strong> {planner.bmi || '-'} | <strong>Est. Calories:</strong> {planner.calories || '-'} kcal</p>
                            <hr/>
                            <h4>Daily Diet</h4>
                            <ul>{planner.dailyDiet.map((d: any, i:number) => <li key={i}><b>{d.meal}</b> — {d.kcal} kcal — <i>{d.sample}</i></li>)}</ul>
                            <h4>Weekly Exercise Plan</h4>
                            <table>
                                <thead><tr><th>Day</th><th>Activity</th><th>Minutes</th></tr></thead>
                                <tbody>{planner.exercise.map((e: any, i:number) => <tr key={i}><td>{e.day}</td><td>{e.activity}</td><td>{e.minutes}</td></tr>)}</tbody>
                            </table>
                             <h4>Mental Wellbeing</h4>
                            <ul>{planner.mental.map((m: any, i:number) => <li key={i}>{m}</li>)}</ul>
                            <p><strong>Hydration:</strong> {planner.hydration}</p>
                            {planner.personal.medical && <p><strong>Medical Notes:</strong> {planner.personal.medical}</p>}
                        </CardContent>
                    </Card>
                </CardContent>
            )}
        </Card>
    );
}

type PlannerTask = { id: string; title: string; completed: boolean; category: string };


export default function ChallengesPage() {
    const [challenges, setChallenges] = useState(initialChallenges);
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    const plannerTasksQuery = useMemoFirebase(() => 
        user ? query(collection(firestore, 'users', user.uid, 'tasks'), orderBy('createdAt', 'desc')) : null
    , [user, firestore]);

    const { data: plannerTasks } = useCollection<PlannerTask>(plannerTasksQuery);

    const fitnessTasks = useMemo(() => plannerTasks?.filter(task => task.category === 'Fitness') || [], [plannerTasks]);

    const handleJoinChallenge = (challengeId: string) => {
        setChallenges(prev =>
            prev.map(c =>
                c.id === challengeId ? { ...c, status: 'active' } : c
            )
        );
        toast({ title: "Challenge Joined!", description: "You can now track your progress." });
    };

    const handleDailyProgress = (challengeId: string, dayIndex: number) => {
        setChallenges(prev =>
            prev.map(c => {
                if (c.id === challengeId) {
                    const newDaily = [...c.daily];
                    newDaily[dayIndex] = !newDaily[dayIndex];
                    const newProgress = newDaily.filter(Boolean).length;
                    const newStatus = newProgress === c.total ? 'completed' : c.status;
                    if (newStatus === 'completed') {
                        toast({
                            title: "Challenge Complete!",
                            description: `Congratulations! You've completed the ${c.title}.`
                        });
                    }
                    return { ...c, daily: newDaily, progress: newProgress, status: newStatus };
                }
                return c;
            })
        );
    };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Health Challenges
          </h1>
          <p className="text-muted-foreground">
            Join challenges, create your own with AI, and track your progress.
          </p>
        </div>
      </div>

      <Tabs defaultValue="community">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="community">Community Challenges</TabsTrigger>
          <TabsTrigger value="ai-planner"><Sparkles className="mr-2 h-4 w-4"/>AI Health Planner</TabsTrigger>
          <TabsTrigger value="analysis">Health Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="community" className="mt-6">
          <div className="space-y-6">
            {fitnessTasks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Custom Fitness Challenges</CardTitle>
                  <CardDescription>These are fitness tasks from your personal planner.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {fitnessTasks.map(task => (
                      <div key={task.id} className="flex items-center p-3 rounded-lg border bg-secondary/30">
                        <Flame className="w-5 h-5 mr-3 text-primary" />
                        <div className="flex-1">
                          <p className="font-semibold">{task.title}</p>
                          <p className="text-xs text-muted-foreground">Personal goal from My Planner</p>
                        </div>
                        <Badge variant={task.completed ? "outline" : "default"}>
                          {task.completed ? "Done" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                </CardContent>
              </Card>
            )}

            {challenges.map(challenge => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      {challenge.title}
                    </CardTitle>
                    {challenge.status === 'active' && <Badge>Active</Badge>}
                    {challenge.status === 'new' && <Badge variant="secondary">New</Badge>}
                    {challenge.status === 'completed' && <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="mr-1 h-4 w-4"/>Completed</Badge>}
                  </div>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">Progress</p>
                        <p className="text-sm text-muted-foreground">{challenge.progress} / {challenge.total} days</p>
                      </div>
                      <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                    </div>
                  
                  {challenge.status === 'active' && (
                    <div className="space-y-2">
                      <Label>Log Your Daily Progress:</Label>
                      <div className="flex flex-wrap gap-2">
                        {challenge.daily.map((isDone, index) => (
                           <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                                <Checkbox
                                    id={`${challenge.id}-day-${index}`}
                                    checked={isDone}
                                    onCheckedChange={() => handleDailyProgress(challenge.id, index)}
                                />
                                <Label htmlFor={`${challenge.id}-day-${index}`} className="text-xs">Day {index + 1}</Label>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-primary">
                    <Star className="w-5 h-5"/>
                    <p className="font-semibold">{challenge.reward}</p>
                  </div>

                </CardContent>
                <CardFooter>
                    {challenge.status === 'new' && <Button onClick={() => handleJoinChallenge(challenge.id)}><Flame className="mr-2 h-4 w-4"/>Join Challenge</Button>}
                    {challenge.status === 'active' && <Button variant="outline" disabled>Challenge in Progress</Button>}
                    {challenge.status === 'completed' && <Button variant="ghost" disabled>Challenge Completed</Button>}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ai-planner" className="mt-6">
           <HealthPlanner />
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>
                  Your total active minutes over the last 7 days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="day"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                      />
                      <Bar
                        dataKey="minutes"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smile className="w-5 h-5" />
                  Mood Tracker
                </CardTitle>
                <CardDescription>
                  Your mood ratings (1-5) over the last 7 days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodData}>
                       <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis domain={[1, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="mood" stroke="hsl(var(--accent))" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
