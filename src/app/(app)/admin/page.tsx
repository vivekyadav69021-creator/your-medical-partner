'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFirestore, useUser, useFirebase } from '@/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  updateDoc, 
  query, 
  orderBy, 
  deleteDoc, 
  addDoc, 
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    ShieldCheck, 
    Settings, 
    Users, 
    MessageSquare, 
    AlertCircle, 
    Zap, 
    Trash2, 
    Send, 
    Plus, 
    Image as ImageIcon, 
    Loader2, 
    LayoutDashboard,
    Activity,
    Video,
    Stethoscope,
    UploadCloud,
    CheckCircle2,
    X,
    Star,
    BarChart3,
    Smartphone,
    Globe,
    Cpu,
    ArrowUpRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip, YAxis, CartesianGrid } from 'recharts';

const analyticsData = [
  { time: '00:00', users: 40, scans: 12 }, { time: '04:00', users: 20, scans: 5 },
  { time: '08:00', users: 80, scans: 45 }, { time: '12:00', users: 150, scans: 89 },
  { time: '16:00', users: 190, scans: 120 }, { time: '20:00', users: 110, scans: 60 },
  { time: '23:59', users: 60, scans: 30 },
];

export default function AdminDashboard() {
  const { firestore, storage } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('controls');
  
  // Real-time Data States
  const [featureFlags, setFeatureFlags] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  
  // Form States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. HIDDEN ROUTER GUARD - RIGID CHECK
  useEffect(() => {
    if (user && user.email !== 'yourmedicalpartner07@gmail.com') {
      window.location.href = '/dashboard';
    }
  }, [user]);

  // Security Fail-safe Overlay
  if (user?.email !== 'yourmedicalpartner07@gmail.com') {
    return (
        <div className="h-screen flex items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950">
            <Card className="rounded-[3rem] border-none shadow-2xl p-10 space-y-6 max-w-sm">
                <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 shadow-inner">
                    <ShieldCheck className="h-10 w-10" />
                </div>
                <h1 className="text-2xl font-black text-[#1A365D] uppercase tracking-tight">Access Restricted</h1>
                <p className="text-sm font-bold text-slate-400 uppercase leading-relaxed">Admin Credentials Required. Returning to safe zone...</p>
                <Button className="w-full rounded-2xl h-14 font-black uppercase text-[10px] tracking-[0.2em]" onClick={() => window.location.href = '/dashboard'}>Exit Terminal</Button>
            </Card>
        </div>
    );
  }

  // 2. LISTENERS
  useEffect(() => {
    try {
        const unsubFeatures = onSnapshot(doc(firestore, 'system_settings', 'features'), (docSnap) => {
            if (docSnap.exists()) setFeatureFlags(docSnap.data());
        });
        const qUsers = query(collection(firestore, 'users'), orderBy('createdAt', 'desc'));
        const unsubUsers = onSnapshot(qUsers, (snap) => {
            setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        const qFeedback = query(collection(firestore, 'feedback'), orderBy('createdAt', 'desc'));
        const unsubFeedback = onSnapshot(qFeedback, (snap) => {
            setFeedback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => { unsubFeatures(); unsubUsers(); unsubFeedback(); };
    } catch (e) { console.error("Admin Listener Error", e); }
  }, [firestore]);

  const toggleFeature = async (id: string, current: boolean) => {
    try {
        await updateDoc(doc(firestore, 'system_settings', 'features'), {
            [id]: !current
        });
        toast({ title: `Feature Update Success`, description: `Module ${id} is now ${!current ? 'Online' : 'Offline'}` });
    } catch (e) { toast({ variant: 'destructive', title: 'Kill-Switch Failed' }); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
        const storageRef = ref(storage, `admin_uploads/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
            (snap) => setUploadProgress((snap.bytesTransferred / snap.totalBytes) * 100),
            (err) => { throw err; },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                toast({ title: "Media Link Ready", description: "Image synced with cloud storage." });
                console.log("Cloud URL:", url);
                setIsUploading(false);
                setUploadProgress(0);
            }
        );
    } catch (e) {
        toast({ variant: 'destructive', title: "Upload Purged", description: "Cloud link failed." });
        setIsUploading(false);
    }
  };

  const deleteUser = async (uid: string) => {
    if (!confirm("Irreversible Action: Purge this identity from the database?")) return;
    try {
        await deleteDoc(doc(firestore, 'users', uid));
        toast({ title: "Identity Purged", variant: "destructive" });
    } catch (e) { toast({ variant: 'destructive', title: "Purge Failed" }); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-32 font-body safe-top overflow-x-hidden">
      
      {/* HEADER: TERMINAL STYLE */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-primary rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3 transition-transform hover:rotate-0 border-4 border-white dark:border-slate-800">
                <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase leading-none">Admin Terminal</h1>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Mission Control Pro v2.0
                </p>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <Badge className="bg-emerald-50 text-emerald-600 border-none uppercase text-[10px] font-black px-5 py-2 shadow-sm rounded-xl">Verified Root</Badge>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Sess: 0x-992-Admin-Secure</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-8">
        
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-1">
            <StatCard label="Total Users" value={users.length} icon={Users} color="text-blue-500" bg="bg-blue-50/50" />
            <StatCard label="Live Pulse" value="142" icon={Activity} color="text-emerald-500" bg="bg-emerald-50/50" />
            <StatCard label="Storage" value="84%" icon={Cpu} color="text-purple-500" bg="bg-purple-50/50" />
            <StatCard label="Status" value="OK" icon={CheckCircle2} color="text-orange-500" bg="bg-orange-50/50" />
        </div>

        {/* LIVE ANALYTICS PULSE */}
        <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900/50 overflow-hidden relative group">
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-bl-full -z-0" />
            <CardHeader className="relative z-10 px-8 pt-8 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Active Pulse Diagnostics</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Real-time Feature Traction (24H)</CardDescription>
                    </div>
                    <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData}>
                            <defs>
                                <linearGradient id="adminPulse" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2488E8" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#2488E8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="users" stroke="#2488E8" strokeWidth={5} fill="url(#adminPulse)" animationDuration={3000} />
                            <Tooltip content={<CustomTooltip />} />
                            <XAxis dataKey="time" hide />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        {/* CORE MANAGEMENT ENGINE */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 h-16 p-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-sm mx-1">
                <TabsTrigger value="controls" className="rounded-full text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Kill-Switch</TabsTrigger>
                <TabsTrigger value="content" className="rounded-full text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Ingestion</TabsTrigger>
                <TabsTrigger value="users" className="rounded-full text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Audit</TabsTrigger>
                <TabsTrigger value="feedback" className="rounded-full text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white transition-all">Inbox</TabsTrigger>
            </TabsList>

            {/* TAB: FEATURE KILL-SWITCHES */}
            <TabsContent value="controls" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                    <FeatureSwitch title="AI Health Assistant" id="ai_assistant" current={featureFlags?.ai_assistant} icon={Zap} onToggle={toggleFeature} color="text-blue-500" />
                    <FeatureSwitch title="AI Psychiatrist" id="ai_psychiatrist" current={featureFlags?.ai_psychiatrist} icon={MessageSquare} onToggle={toggleFeature} color="text-pink-500" />
                    <FeatureSwitch title="Medical Radar" id="nearby_hospital" current={featureFlags?.nearby_hospital} icon={Activity} onToggle={toggleFeature} color="text-red-500" />
                    <FeatureSwitch title="Video Library" id="video_library" current={featureFlags?.video_library} icon={Video} onToggle={toggleFeature} color="text-emerald-500" />
                    <FeatureSwitch title="Doctor Consult" id="consultation" current={featureFlags?.consultation} icon={Stethoscope} onToggle={toggleFeature} color="text-indigo-500" />
                    <FeatureSwitch title="Health Architect" id="challenges" current={featureFlags?.challenges} icon={CheckCircle2} onToggle={toggleFeature} color="text-orange-500" />
                </div>
            </TabsContent>

            {/* TAB: CONTENT INGESTION ENGINE */}
            <TabsContent value="content" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 p-10">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner"><Plus className="h-7 w-7" /></div>
                        <div>
                            <h3 className="text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Content Pipeline</h3>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Add Medicines, Yoga, or Clinical Data</p>
                        </div>
                    </div>
                    <form className="space-y-8">
                        <div className="space-y-2.5">
                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-5">Item Identifier (Name)</Label>
                            <Input placeholder="e.g. Paracetamol 500mg IP" className="h-16 rounded-3xl bg-slate-50 border-none shadow-inner font-bold px-8 text-base focus-visible:ring-2 focus-visible:ring-primary/20" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-5">Source Image URL</Label>
                                <Input placeholder="https://images.unsplash..." className="h-16 rounded-3xl bg-slate-50 border-none shadow-inner font-bold px-8" />
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-5">Native Cloud Upload</Label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-16 rounded-3xl bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center gap-4 cursor-pointer hover:bg-primary/10 transition-all group"
                                >
                                    {isUploading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                            <span className="text-xs font-black text-primary uppercase">{Math.round(uploadProgress)}% Complete</span>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadCloud className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-black text-primary uppercase tracking-widest">Select Files</span>
                                        </>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />
                            </div>
                        </div>
                        <Button className="w-full h-20 rounded-[2.5rem] bg-primary text-white font-black uppercase text-sm tracking-[0.25em] shadow-2xl shadow-primary/30 active:scale-95 transition-all hover:bg-primary/90">
                            Launch to Production
                        </Button>
                    </form>
                </Card>
            </TabsContent>

            {/* TAB: USER AUDIT LOGS */}
            <TabsContent value="users" className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                    {users?.map((u) => (
                        <Card key={u.id} className="rounded-[2.8rem] border-none bg-white dark:bg-slate-900 p-6 flex items-center justify-between shadow-xl group transition-all hover:shadow-primary/5 border border-transparent hover:border-primary/10">
                            <div className="flex items-center gap-5 min-w-0">
                                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 uppercase text-lg shadow-inner">{(u.name?.[0] || 'U')}</div>
                                <div className="min-w-0 space-y-0.5">
                                    <h4 className="text-base font-black text-[#1A365D] dark:text-white uppercase truncate tracking-tight">{u.name || 'Anonymous User'}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 truncate tracking-widest">{u.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase px-2 py-0 border-none">Active</Badge>
                                        <span className="text-[8px] font-black text-slate-300 uppercase">Joined: {u.createdAt ? format(u.createdAt.toDate(), 'MMM yy') : 'Recent'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all active:scale-90" onClick={() => deleteUser(u.id)}>
                                    <Trash2 className="h-6 w-6" />
                                </Button>
                                <Button size="sm" className="rounded-2xl h-12 px-6 bg-slate-50 dark:bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest border-none hover:bg-primary/10 hover:text-primary transition-all">Profile</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </TabsContent>

            {/* TAB: FEEDBACK & BUG INBOX */}
            <TabsContent value="feedback" className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                {feedback?.length === 0 ? (
                    <div className="py-32 text-center opacity-30 space-y-6">
                        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                            <MessageSquare className="h-12 w-12 text-slate-400" />
                        </div>
                        <p className="font-black uppercase text-xs tracking-[0.4em]">Satellite Signal Clear • No Feedback</p>
                    </div>
                ) : (
                    feedback?.map((f) => (
                        <Card key={f.id} className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-8 space-y-6 shadow-xl border-l-8 border-l-primary relative overflow-hidden transition-all hover:scale-[1.01]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-primary/5 text-primary text-[10px] font-black border-none px-4 py-1.5 uppercase rounded-lg tracking-widest">{f.featureId || 'Global'}</Badge>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Feedback Node</span>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-500">
                                    {[...Array(5)].map((_, i) => <Star key={i} className={cn("h-3.5 w-3.5", i < (f.rating || 0) ? "fill-current" : "opacity-20")} />)}
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-slate-100 dark:border-slate-800 pl-6">"{f.text || "Empty content provided."}"</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-[9px] font-black text-slate-400 uppercase">UID</div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">0x{f.userId?.substring(0, 12)}...</p>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{f.createdAt ? format(f.createdAt.toDate(), 'MMM dd, HH:mm') : 'Recently'}</p>
                            </div>
                        </Card>
                    ))
                )}
            </TabsContent>
        </Tabs>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="rounded-[2.2rem] border-none shadow-xl bg-white dark:bg-slate-900 p-6 flex flex-col gap-4 group hover:scale-105 transition-all">
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform", bg, color)}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em]">{label}</p>
                <p className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tighter mt-1">{value}</p>
            </div>
        </Card>
    );
}

function FeatureSwitch({ title, id, current, icon: Icon, onToggle, color }: any) {
    return (
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 flex items-center justify-between transition-all hover:shadow-primary/10 border border-transparent hover:border-primary/20 group">
            <div className="flex items-center gap-6">
                <div className={cn("h-14 w-14 rounded-3xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 shadow-inner group-hover:scale-110 transition-transform", color)}>
                    <Icon className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-base font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{title}</h4>
                    <div className="flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full", current ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                        <p className={cn("text-[9px] font-black uppercase tracking-[0.2em]", current ? "text-emerald-500" : "text-rose-500")}>
                            {current ? 'Live & Patched' : 'In Development'}
                        </p>
                    </div>
                </div>
            </div>
            <Switch checked={current} onCheckedChange={() => onToggle(id, current)} className="data-[state=checked]:bg-emerald-500 scale-110" />
        </Card>
    );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A365D] p-4 rounded-[1.5rem] border border-white/20 shadow-2xl text-center backdrop-blur-xl animate-in zoom-in-95 duration-200">
        <p className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{payload[0].value} Active Units</p>
        <p className="text-[8px] font-bold text-blue-300 uppercase mt-1 tracking-widest">Node Diagnostic OK</p>
      </div>
    );
  }
  return null;
}
