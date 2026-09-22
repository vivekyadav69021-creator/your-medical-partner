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
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    ShieldCheck, 
    Users, 
    MessageSquare, 
    Zap, 
    Trash2, 
    Plus, 
    Loader2, 
    Activity,
    Video,
    Stethoscope,
    UploadCloud,
    CheckCircle2,
    BarChart3,
    Cpu,
    BookHeart,
    Flower,
    Store,
    Layers,
    LogOut,
    ArrowLeft,
    ShieldAlert
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import Link from 'next/link';

const analyticsData = [
  { time: '00:00', users: 40, scans: 12 }, { time: '04:00', users: 20, scans: 5 },
  { time: '08:00', users: 80, scans: 45 }, { time: '12:00', users: 150, scans: 89 },
  { time: '16:00', users: 190, scans: 120 }, { time: '20:00', users: 110, scans: 60 },
  { time: '23:59', users: 60, scans: 30 },
];

type ContentType = 'video' | 'disease' | 'yoga' | 'store';

export default function AdminDashboard() {
  const { firestore, storage, auth } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('controls');
  const [contentType, setContentType] = useState<ContentType>('video');
  
  const [featureFlags, setFeatureFlags] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ADMIN_EMAIL = 'yourmedicalpartner07@gmail.com';

  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL) {
      window.location.href = '/dashboard';
    }
  }, [user]);

  const handleExitAdmin = async () => {
    try {
      await signOut(auth);
      toast({ title: "Exited Terminal", description: "Identity signed out." });
    } catch (e) {
      toast({ variant: 'destructive', title: 'Exit Failed' });
    }
  };

  if (user?.email !== ADMIN_EMAIL) {
    return (
        <div className="h-screen flex items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950">
            <Card className="rounded-[3rem] border-none shadow-2xl p-10 space-y-6 max-w-sm">
                <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 shadow-inner">
                    <ShieldAlert className="h-10 w-10" />
                </div>
                <h1 className="text-2xl font-black text-[#1A365D] uppercase tracking-tight">Terminal Locked</h1>
                <p className="text-sm font-bold text-slate-400 uppercase leading-relaxed">Admin Credentials Required.</p>
                <Button className="w-full rounded-2xl h-14 font-black uppercase text-[10px] tracking-[0.2em]" onClick={() => window.location.href = '/login'}>Return to Portal</Button>
            </Card>
        </div>
    );
  }

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
        await updateDoc(doc(firestore, 'system_settings', 'features'), { [id]: !current });
        toast({ title: `Module ${!current ? 'Online' : 'Offline'}` });
    } catch (e) { toast({ variant: 'destructive', title: 'Action Failed' }); }
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
                setUploadedUrl(url);
                toast({ title: "Media Cached", description: "Ready for injection." });
                setIsUploading(false);
            }
        );
    } catch (e) {
        toast({ variant: 'destructive', title: "Upload Failed" });
        setIsUploading(false);
    }
  };

  const handleContentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
        const data: any = { createdAt: serverTimestamp(), imageUrl: uploadedUrl || formData.get('imageUrl') };
        formData.forEach((value, key) => { if(key !== 'imageUrl') data[key] = value; });
        const collectionMap: Record<ContentType, string> = { video: 'video_tutorials', disease: 'disease_library', yoga: 'yoga_library', store: 'medicines' };
        await addDoc(collection(firestore, collectionMap[contentType]), data);
        toast({ title: "Injection Successful", description: "Database updated." });
        form.reset();
        setUploadedUrl('');
    } catch (e) {
        toast({ variant: 'destructive', title: "Injection Failed" });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pb-32 font-body safe-top overflow-x-hidden animate-in fade-in duration-700">
      
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-[#1A365D] rounded-[1.8rem] flex items-center justify-center shadow-2xl border-4 border-white dark:border-slate-800">
                <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase leading-none">Root Terminal</h1>
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Active Node: {ADMIN_EMAIL.split('@')[0]}
                </div>
            </div>
        </div>
        <Button variant="destructive" onClick={handleExitAdmin} className="rounded-2xl h-11 px-6 gap-2 font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            <LogOut className="w-3.5 h-3.5" /> Exit Terminal
        </Button>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-1">
            <StatCard label="Identities" value={users.length} icon={Users} color="text-blue-500" bg="bg-blue-50/50" />
            <StatCard label="Live Units" value="156" icon={Activity} color="text-emerald-500" bg="bg-emerald-50/50" />
            <StatCard label="System Load" value="24%" icon={Cpu} color="text-purple-500" bg="bg-purple-50/50" />
            <StatCard label="Core Status" value="SAFE" icon={CheckCircle2} color="text-orange-500" bg="bg-orange-50/50" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 h-16 p-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-sm mx-1">
                <TabsTrigger value="controls" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Kill-Switch</TabsTrigger>
                <TabsTrigger value="content" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Pipeline</TabsTrigger>
                <TabsTrigger value="users" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Audit</TabsTrigger>
                <TabsTrigger value="feedback" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Inbox</TabsTrigger>
            </TabsList>

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

            <TabsContent value="content" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-5">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner"><Layers className="h-6 w-6" /></div>
                            <div>
                                <h3 className="text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Injection Engine</h3>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Injecting new data to production</p>
                            </div>
                        </div>
                        <div className="w-full md:w-64">
                             <Select value={contentType} onValueChange={(v) => { setContentType(v as any); setUploadedUrl(''); }}>
                                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none font-black text-[10px] uppercase tracking-widest px-6 shadow-inner">
                                    <SelectValue placeholder="Collection" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                    <SelectItem value="video" className="font-bold text-[10px] uppercase tracking-widest"><div className="flex items-center gap-2"><Video className="w-3 h-3"/> Video Library</div></SelectItem>
                                    <SelectItem value="disease" className="font-bold text-[10px] uppercase tracking-widest"><div className="flex items-center gap-2"><BookHeart className="w-3 h-3"/> Disease Library</div></SelectItem>
                                    <SelectItem value="yoga" className="font-bold text-[10px] uppercase tracking-widest"><div className="flex items-center gap-2"><Flower className="w-3 h-3"/> Yoga Library</div></SelectItem>
                                    <SelectItem value="store" className="font-bold text-[10px] uppercase tracking-widest"><div className="flex items-center gap-2"><Store className="w-3 h-3"/> Medical Store</div></SelectItem>
                                </SelectContent>
                             </Select>
                        </div>
                    </div>

                    <form onSubmit={handleContentSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-5">Manual URL</Label>
                                <Input name="imageUrl" defaultValue={uploadedUrl} placeholder="https://..." className="h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold px-8" />
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-5">Cloud Sync</Label>
                                <div onClick={() => fileInputRef.current?.click()} className="h-16 rounded-3xl bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center gap-4 cursor-pointer hover:bg-primary/10 transition-all">
                                    {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : uploadedUrl ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <UploadCloud className="h-6 w-6 text-primary" />}
                                    <span className="text-[10px] font-black text-primary uppercase">{isUploading ? `${Math.round(uploadProgress)}%` : 'Open Gallery'}</span>
                                </div>
                                <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />
                            </div>
                        </div>

                        <div className="space-y-6">
                            {contentType === 'video' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <Input name="title" placeholder="Video Title" className="h-16 rounded-3xl bg-slate-50 border-none px-8 font-bold" required />
                                    <Input name="youtube_url" placeholder="YouTube Link" className="h-16 rounded-3xl bg-slate-50 border-none px-8 font-bold" required />
                                </div>
                            )}
                            {contentType === 'disease' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Input name="nameEn" placeholder="Name (EN)" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                        <Textarea name="overviewEn" placeholder="Overview (EN)" className="rounded-2xl bg-slate-50 border-none p-6 font-bold" required />
                                    </div>
                                    <div className="space-y-4">
                                        <Input name="nameHi" placeholder="नाम (HI)" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                        <Textarea name="overviewHi" placeholder="अवलोकन (HI)" className="rounded-2xl bg-slate-50 border-none p-6 font-bold" required />
                                    </div>
                                </div>
                            )}
                            {contentType === 'store' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input name="name" placeholder="Medicine Name" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                    <Input name="price" placeholder="Price (₹)" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                    <Input name="category" placeholder="Category" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                    <Input name="stock" type="number" placeholder="Stock" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={isSaving || isUploading} className="w-full h-20 rounded-[2.5rem] bg-[#1A365D] text-white font-black uppercase text-xs tracking-[0.25em] shadow-2xl active:scale-95 transition-all">
                            {isSaving ? <Loader2 className="animate-spin mr-3 h-5 w-5" /> : `Deploy to ${contentType.toUpperCase()}`}
                        </Button>
                    </form>
                </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {users?.map((u) => (
                        <Card key={u.id} className="rounded-[2.8rem] border-none bg-white dark:bg-slate-900 p-6 flex items-center justify-between shadow-xl">
                            <div className="flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 text-lg shadow-inner">{(u.name?.[0] || 'U')}</div>
                                <div>
                                    <h4 className="text-sm font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{u.name || 'Anonymous'}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 truncate tracking-widest">{u.email || 'No Email'}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 text-rose-500 hover:bg-rose-50" onClick={async () => { if(confirm("Purge Identity?")) await deleteDoc(doc(firestore, 'users', u.id)); }}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </Card>
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {feedback?.map((f) => (
                        <Card key={f.id} className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-8 space-y-6 shadow-xl border-l-8 border-l-primary">
                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300 italic border-l-2 border-slate-100 pl-6">"{f.text}"</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">UID: {f.userId?.substring(0, 8)}...</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{f.createdAt ? format(f.createdAt.toDate(), 'MMM dd') : 'Recent'}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="rounded-[2.2rem] border-none shadow-xl bg-white dark:bg-slate-900 p-6 flex flex-col gap-4 group hover:scale-105 transition-all">
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner", bg, color)}>
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
        <Card className="rounded-[2.5rem] border-none shadow-xl bg-white dark:bg-slate-900 p-8 flex items-center justify-between transition-all hover:shadow-primary/10 group">
            <div className="flex items-center gap-6">
                <div className={cn("h-14 w-14 rounded-3xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 shadow-inner group-hover:rotate-6 transition-transform", color)}>
                    <Icon className="h-7 w-7" />
                </div>
                <div>
                    <h4 className="text-base font-black text-[#1A365D] dark:text-white uppercase tracking-tight">{title}</h4>
                    <p className={cn("text-[9px] font-black uppercase tracking-[0.2em]", current ? "text-emerald-500" : "text-rose-500")}>
                        {current ? 'Patch Active' : 'Offline'}
                    </p>
                </div>
            </div>
            <Switch checked={current} onCheckedChange={() => onToggle(id, current)} className="data-[state=checked]:bg-emerald-500" />
        </Card>
    );
}
