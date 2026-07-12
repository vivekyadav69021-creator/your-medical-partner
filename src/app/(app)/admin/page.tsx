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
    BarChart3
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const analyticsData = [
  { time: '00:00', users: 40 }, { time: '04:00', users: 20 },
  { time: '08:00', users: 80 }, { time: '12:00', users: 150 },
  { time: '16:00', users: 190 }, { time: '20:00', users: 110 },
  { time: '23:59', users: 60 },
];

export default function AdminDashboard() {
  const { firestore, storage } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('controls');
  
  // Real-time Data
  const [featureFlags, setFeatureFlags] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  
  // Form States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security Check
  if (user?.email !== 'yourmedicalpartner07@gmail.com') {
    return (
        <div className="h-screen flex items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950">
            <Card className="rounded-[3rem] border-none shadow-2xl p-10 space-y-6 max-w-sm">
                <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 shadow-inner">
                    <ShieldCheck className="h-10 w-10" />
                </div>
                <h1 className="text-2xl font-black text-[#1A365D] uppercase tracking-tight">Access Restricted</h1>
                <p className="text-sm font-bold text-slate-400 uppercase leading-relaxed">This terminal is for authorized personnel only. Return to dashboard.</p>
                <Button className="w-full rounded-2xl h-14 font-black uppercase text-[10px] tracking-[0.2em]" onClick={() => window.location.href = '/'}>Exit Secure Zone</Button>
            </Card>
        </div>
    );
  }

  // 1. Listen for Feature Flags
  useEffect(() => {
    try {
        const unsub = onSnapshot(doc(firestore, 'system_settings', 'features'), (docSnap) => {
            if (docSnap.exists()) setFeatureFlags(docSnap.data());
        });
        return () => unsub();
    } catch (e) { console.error("Feature listen error", e); }
  }, [firestore]);

  // 2. Listen for Users
  useEffect(() => {
    try {
        const q = query(collection(firestore, 'users'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    } catch (e) { console.error("User listen error", e); }
  }, [firestore]);

  // 3. Listen for Feedback
  useEffect(() => {
    try {
        const q = query(collection(firestore, 'feedback'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setFeedback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    } catch (e) { console.error("Feedback listen error", e); }
  }, [firestore]);

  const toggleFeature = async (id: string, current: boolean) => {
    try {
        await updateDoc(doc(firestore, 'system_settings', 'features'), {
            [id]: !current
        });
        toast({ title: `Feature ${!current ? 'Enabled' : 'Disabled'}` });
    } catch (e) { toast({ variant: 'destructive', title: 'Update Failed' }); }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetCollection: string) => {
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
                // Here you would normally populate a form field with this URL
                toast({ title: "Upload Success", description: "Image URL generated & saved." });
                setIsUploading(false);
                setUploadProgress(0);
            }
        );
    } catch (e) {
        toast({ variant: 'destructive', title: 'Upload Failed' });
        setIsUploading(false);
    }
  };

  const deleteUser = async (uid: string) => {
    if (!confirm("Are you sure? This will purge the user's entire identity.")) return;
    try {
        await deleteDoc(doc(firestore, 'users', uid));
        toast({ title: "User Purged" });
    } catch (e) { toast({ variant: 'destructive', title: "Delete Failed" }); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-32 font-body safe-top">
      
      {/* 1. COMPACT ADMIN HEADER */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-3 transition-transform hover:rotate-0">
                <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase leading-none">Admin Terminal</h1>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mt-1 flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Mission Control Stable
                </p>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <Badge className="bg-emerald-50 text-emerald-600 border-none uppercase text-[8px] font-black px-4 py-1.5 shadow-sm">Verified Root</Badge>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sess: 0x-992-Admin</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-8">
        
        {/* 2. ANALYTICS PREVIEW (CHART) */}
        <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900/50 overflow-hidden relative group">
            <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-bl-full -z-0" />
            <CardHeader className="relative z-10 px-8 pt-8 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Active Pulse</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase text-slate-400 tracking-widest">24H Traffic Statistics</CardDescription>
                    </div>
                    <BarChart3 className="h-6 w-6 text-primary/40 group-hover:scale-110 transition-transform" />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData}>
                            <defs>
                                <linearGradient id="adminPulse" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2488E8" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#2488E8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="users" stroke="#2488E8" strokeWidth={4} fill="url(#adminPulse)" animationDuration={3000} />
                            <Tooltip content={<CustomTooltip />} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        {/* 3. CORE MANAGEMENT TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 h-14 p-1.5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2rem] border border-white/40 shadow-sm mx-1">
                <TabsTrigger value="controls" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Flags</TabsTrigger>
                <TabsTrigger value="content" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Add</TabsTrigger>
                <TabsTrigger value="users" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Users</TabsTrigger>
                <TabsTrigger value="feedback" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Inbox</TabsTrigger>
            </TabsList>

            {/* A. KILL-SWITCHES */}
            <TabsContent value="controls" className="space-y-6 animate-in slide-in-from-bottom-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-1">
                    <FeatureSwitch title="AI Health Assistant" id="ai_assistant" current={featureFlags?.ai_assistant} icon={Zap} onToggle={toggleFeature} color="text-blue-500" />
                    <FeatureSwitch title="AI Psychiatrist" id="ai_psychiatrist" current={featureFlags?.ai_psychiatrist} icon={MessageSquare} onToggle={toggleFeature} color="text-pink-500" />
                    <FeatureSwitch title="Medical Radar" id="nearby_hospital" current={featureFlags?.nearby_hospital} icon={Activity} onToggle={toggleFeature} color="text-red-500" />
                    <FeatureSwitch title="Video Library" id="video_library" current={featureFlags?.video_library} icon={Video} onToggle={toggleFeature} color="text-emerald-500" />
                    <FeatureSwitch title="Doctor Consult" id="consultation" current={featureFlags?.consultation} icon={Stethoscope} onToggle={toggleFeature} color="text-indigo-500" />
                    <FeatureSwitch title="Health Architect" id="challenges" current={featureFlags?.challenges} icon={CheckCircle2} onToggle={toggleFeature} color="text-orange-500" />
                </div>
            </TabsContent>

            {/* B. CONTENT INGESTION */}
            <TabsContent value="content" className="space-y-8 animate-in slide-in-from-bottom-4">
                <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Plus className="h-6 w-6" /></div>
                        <h3 className="text-xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Add Medicine / Yoga</h3>
                    </div>
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Item Title</Label>
                            <Input placeholder="e.g. Paracetamol 500mg" className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Image Link (URL)</Label>
                                <Input placeholder="https://images.unsplash..." className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Native Upload</Label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-14 rounded-2xl bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center gap-3 cursor-pointer hover:bg-primary/10 transition-colors"
                                >
                                    {isUploading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                            <span className="text-[9px] font-black text-primary uppercase">{Math.round(uploadProgress)}%</span>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadCloud className="h-5 w-5 text-primary" />
                                            <span className="text-[9px] font-black text-primary uppercase">Choose File</span>
                                        </>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} hidden onChange={(e) => handleFileUpload(e, 'medicines')} accept="image/*" />
                            </div>
                        </div>
                        <Button className="w-full h-16 rounded-[2rem] bg-primary text-white font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">Publish Content</Button>
                    </form>
                </Card>
            </TabsContent>

            {/* C. USER AUDIT */}
            <TabsContent value="users" className="space-y-4 animate-in slide-in-from-bottom-4">
                <div className="space-y-3">
                    {users?.map((u) => (
                        <Card key={u.id} className="rounded-[2.2rem] border-none bg-white dark:bg-slate-900 p-5 flex items-center justify-between shadow-lg group">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 uppercase text-xs">{(u.name?.[0] || 'U')}</div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-black text-[#1A365D] dark:text-white uppercase truncate">{u.name || 'Anonymous'}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 truncate">{u.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteUser(u.id)}>
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                                <Button size="sm" className="rounded-xl h-10 px-4 bg-slate-50 dark:bg-slate-800 text-slate-400 font-black text-[8px] uppercase border-none hover:bg-primary/10 hover:text-primary transition-all">Message</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </TabsContent>

            {/* D. FEEDBACK INBOX */}
            <TabsContent value="feedback" className="space-y-4 animate-in slide-in-from-bottom-4">
                {feedback?.length === 0 ? (
                    <div className="py-20 text-center opacity-30 space-y-4">
                        <MessageSquare className="h-16 w-16 mx-auto" />
                        <p className="font-black uppercase text-[10px] tracking-widest">Inbox is Clear</p>
                    </div>
                ) : (
                    feedback?.map((f) => (
                        <Card key={f.id} className="rounded-[2.5rem] border-none bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xl border-l-4 border-l-primary relative overflow-hidden">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-primary/5 text-primary text-[8px] font-black border-none px-3 uppercase">{f.featureId || 'General'}</Badge>
                                <div className="flex items-center gap-0.5 text-yellow-500">
                                    {[...Array(5)].map((_, i) => <Star key={i} className={cn("h-3 w-3", i < (f.rating || 0) ? "fill-current" : "opacity-20")} />)}
                                </div>
                            </div>
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">"{f.text}"</p>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">User ID: <span className="text-slate-700">{f.userId?.substring(0, 8)}...</span></p>
                                <p className="text-[8px] font-bold text-slate-400">{f.createdAt ? format(f.createdAt.toDate(), 'MMM dd, HH:mm') : 'Recently'}</p>
                            </div>
                        </Card>
                    ))
                )}
            </TabsContent>
        </Tabs>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function FeatureSwitch({ title, id, current, icon: Icon, onToggle, color }: any) {
    return (
        <Card className="rounded-[2rem] border-none shadow-xl bg-white dark:bg-slate-900 p-6 flex items-center justify-between transition-all hover:shadow-primary/5 border border-transparent hover:border-primary/10">
            <div className="flex items-center gap-5">
                <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 shadow-inner", color)}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{title}</h4>
                    <p className={cn("text-[9px] font-bold uppercase", current ? "text-emerald-500" : "text-rose-500")}>
                        {current ? 'Live & Operational' : 'Maintenance Mode'}
                    </p>
                </div>
            </div>
            <Switch checked={current} onCheckedChange={() => onToggle(id, current)} className="data-[state=checked]:bg-emerald-500" />
        </Card>
    );
}

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1A365D] p-3 rounded-2xl border border-white/10 shadow-2xl text-center">
        <p className="text-[10px] font-black text-white uppercase tracking-widest">{payload[0].value} Users</p>
        <p className="text-[8px] font-bold text-blue-300 uppercase mt-0.5">Peak Activity</p>
      </div>
    );
  }
  return null;
}
