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
    ArrowLeft,
    BookHeart,
    Flower,
    Store,
    Layers,
    LogOut
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

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
  
  // Real-time Data States
  const [featureFlags, setFeatureFlags] = useState<any>({});
  const [users, setUsers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  
  // Form States
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Security Check: Specific Admin Email
  const ADMIN_EMAIL = 'yourmedicalpartner07@gmail.com';

  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL) {
      window.location.href = '/dashboard';
    }
  }, [user]);

  const handleExitAdmin = async () => {
    try {
      await signOut(auth);
      toast({ title: "Exited Admin Panel", description: "Returning to Login Page..." });
      // Layout logic will redirect to /login automatically
    } catch (e) {
      toast({ variant: 'destructive', title: 'Exit Failed' });
    }
  };

  if (user?.email !== ADMIN_EMAIL) {
    return (
        <div className="h-screen flex items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950">
            <Card className="rounded-[3rem] border-none shadow-2xl p-10 space-y-6 max-w-sm">
                <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 shadow-inner">
                    <ShieldCheck className="h-10 w-10" />
                </div>
                <h1 className="text-2xl font-black text-[#1A365D] uppercase tracking-tight">Access Restricted</h1>
                <p className="text-sm font-bold text-slate-400 uppercase leading-relaxed">Admin Credentials Required.</p>
                <Button className="w-full rounded-2xl h-14 font-black uppercase text-[10px] tracking-[0.2em]" onClick={() => window.location.href = '/login'}>Return to Login</Button>
            </Card>
        </div>
    );
  }

  // Real-time Listeners
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
        toast({ title: `Feature ${!current ? 'Online' : 'Offline'}` });
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
                toast({ title: "Media Synced", description: "Image ready for database injection." });
                setIsUploading(false);
            }
        );
    } catch (e) {
        toast({ variant: 'destructive', title: "Upload Failed" });
        setIsUploading(false);
    }
  };

  const deleteUser = async (uid: string) => {
    if (!confirm("Irreversible: Purge this identity?")) return;
    try {
        await deleteDoc(doc(firestore, 'users', uid));
        toast({ title: "Identity Purged" });
    } catch (e) { toast({ variant: 'destructive', title: "Purge Failed" }); }
  };

  const handleContentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
        const data: any = {
            createdAt: serverTimestamp(),
            imageUrl: uploadedUrl || formData.get('imageUrl')
        };
        
        formData.forEach((value, key) => { if(key !== 'imageUrl') data[key] = value; });

        const collectionMap: Record<ContentType, string> = {
            video: 'video_tutorials',
            disease: 'disease_library',
            yoga: 'yoga_library',
            store: 'medicines'
        };

        await addDoc(collection(firestore, collectionMap[contentType]), data);
        toast({ title: "Injection Successful", description: `${contentType.toUpperCase()} added to production.` });
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
      
      {/* HEADER: TERMINAL STYLE */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-primary rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-primary/30 border-4 border-white dark:border-slate-800">
                <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <div>
                <h1 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tighter uppercase leading-none">Admin Terminal</h1>
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Root Panel Active
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <Button 
                variant="destructive" 
                onClick={handleExitAdmin}
                className="rounded-2xl h-11 px-6 gap-2 font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
            >
                <LogOut className="w-3.5 h-3.5" /> Exit Terminal
            </Button>
            <Badge className="bg-emerald-50 text-emerald-600 border-none uppercase text-[9px] font-black px-4 py-2 rounded-xl hidden sm:block">Verified Root</Badge>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-8">
        
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-1">
            <StatCard label="Total Users" value={users.length} icon={Users} color="text-blue-500" bg="bg-blue-50/50" />
            <StatCard label="Live Pulse" value="156" icon={Activity} color="text-emerald-500" bg="bg-emerald-50/50" />
            <StatCard label="CPU Usage" value="24%" icon={Cpu} color="text-purple-500" bg="bg-purple-50/50" />
            <StatCard label="Engine" value="OK" icon={CheckCircle2} color="text-orange-500" bg="bg-orange-50/50" />
        </div>

        {/* CORE MANAGEMENT ENGINE */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 h-16 p-2 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-sm mx-1">
                <TabsTrigger value="controls" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Kill-Switch</TabsTrigger>
                <TabsTrigger value="content" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Ingestion</TabsTrigger>
                <TabsTrigger value="users" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Audit</TabsTrigger>
                <TabsTrigger value="feedback" className="rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">Inbox</TabsTrigger>
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
                <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 p-8 md:p-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-5">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner"><Layers className="h-6 w-6" /></div>
                            <div>
                                <h3 className="text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">Content Pipeline</h3>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Select collection for production injection</p>
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
                        {/* COMMON IMAGE HANDLER */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-5">Source Image URL (Manual)</Label>
                                <Input name="imageUrl" defaultValue={uploadedUrl} placeholder="https://images.unsplash..." className="h-16 rounded-3xl bg-slate-50 dark:bg-slate-800 border-none shadow-inner font-bold px-8" />
                            </div>
                            <div className="space-y-2.5">
                                <Label className="text-[10px] font-black uppercase text-slate-400 ml-5">Native Cloud Upload (Gallery)</Label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-16 rounded-3xl bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center gap-4 cursor-pointer hover:bg-primary/10 transition-all group"
                                >
                                    {isUploading ? (
                                        <div className="flex items-center gap-3">
                                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                            <span className="text-[10px] font-black text-primary uppercase">{Math.round(uploadProgress)}% Complete</span>
                                        </div>
                                    ) : uploadedUrl ? (
                                        <div className="flex items-center gap-3 text-emerald-500">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span className="text-[10px] font-black uppercase">File Cached</span>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadCloud className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Open Gallery</span>
                                        </>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept="image/*" />
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 dark:bg-slate-800" />

                        {/* DYNAMIC FIELDS PER CONTENT TYPE */}
                        <div className="space-y-6">
                            {contentType === 'video' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-5">Video Title</Label>
                                        <Input name="title" placeholder="e.g. CPR Guide" className="h-16 rounded-3xl bg-slate-50 border-none px-8 font-bold" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-5">YouTube Embed/URL</Label>
                                        <Input name="youtube_url" placeholder="https://youtube.com/..." className="h-16 rounded-3xl bg-slate-50 border-none px-8 font-bold" required />
                                    </div>
                                </div>
                            )}

                            {contentType === 'disease' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Input name="nameEn" placeholder="Disease Name (English)" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                        <Textarea name="overviewEn" placeholder="Overview (English)" className="rounded-2xl bg-slate-50 border-none p-6 font-bold" required />
                                        <Textarea name="symptomsEn" placeholder="Symptoms (HTML allowed)" className="rounded-2xl bg-slate-50 border-none p-6 font-bold" />
                                    </div>
                                    <div className="space-y-4">
                                        <Input name="nameHi" placeholder="रोग का नाम (हिन्दी)" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                        <Textarea name="overviewHi" placeholder="अवलोकन (हिन्दी)" className="rounded-2xl bg-slate-50 border-none p-6 font-bold" required />
                                        <Textarea name="symptomsHi" placeholder="लक्षण (HTML allowed)" className="rounded-2xl bg-slate-50 border-none p-6 font-bold" />
                                    </div>
                                </div>
                            )}

                            {contentType === 'yoga' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <Input name="nameEn" placeholder="Pose Name (e.g. Tadasana)" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                        <Input name="category" placeholder="Category (Standing, Floor, etc.)" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                    </div>
                                    <Textarea name="descriptionEn" placeholder="Description of the pose" className="rounded-2xl bg-slate-50 border-none p-6 font-bold" required />
                                </div>
                            )}

                            {contentType === 'store' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <Input name="name" placeholder="Medicine Name" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                        <Input name="price" placeholder="Price (e.g. ₹50.00)" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                    </div>
                                    <div className="space-y-4">
                                        <Input name="category" placeholder="Category (Pain, Allergy, etc.)" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                        <Input name="stock" type="number" placeholder="Initial Stock" className="h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold" required />
                                    </div>
                                    <Textarea name="description" placeholder="Short description for card" className="col-span-1 md:col-span-2 rounded-2xl bg-slate-50 border-none p-6 font-bold" />
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={isSaving || isUploading} className="w-full h-20 rounded-[2.5rem] bg-primary text-white font-black uppercase text-xs tracking-[0.25em] shadow-2xl shadow-primary/30 active:scale-95 transition-all">
                            {isSaving ? <><Loader2 className="animate-spin mr-3 h-5 w-5" /> Syncing with Cloud...</> : `Inject to ${contentType.toUpperCase()} Collection`}
                        </Button>
                    </form>
                </Card>
            </TabsContent>

            {/* TAB: USER AUDIT LOGS */}
            <TabsContent value="users" className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {users?.map((u) => (
                        <Card key={u.id} className="rounded-[2.8rem] border-none bg-white dark:bg-slate-900 p-6 flex items-center justify-between shadow-xl group transition-all hover:border-primary/10 border border-transparent">
                            <div className="flex items-center gap-5 min-w-0">
                                <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 uppercase text-lg shadow-inner">{(u.name?.[0] || 'U')}</div>
                                <div className="min-w-0 space-y-0.5">
                                    <h4 className="text-sm font-black text-[#1A365D] dark:text-white uppercase truncate tracking-tight">{u.name || 'Anonymous'}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 truncate tracking-widest">{u.email || 'No Email'}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase px-2 py-0 border-none">Active</Badge>
                                        <span className="text-[8px] font-black text-slate-300 uppercase">Joined: {u.createdAt ? format(u.createdAt.toDate(), 'MMM yy') : 'Recent'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="rounded-2xl h-12 w-12 text-rose-500 hover:bg-rose-50" onClick={() => deleteUser(u.id)}>
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </TabsContent>

            {/* TAB: FEEDBACK INBOX */}
            <TabsContent value="feedback" className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 pb-20">
                {feedback?.length === 0 ? (
                    <div className="py-32 text-center opacity-30 space-y-6">
                        <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto"><MessageSquare className="h-12 w-12 text-slate-400" /></div>
                        <p className="font-black uppercase text-xs tracking-[0.4em]">Radar Clear • No Feedback</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {feedback?.map((f) => (
                            <Card key={f.id} className="rounded-[3rem] border-none bg-white dark:bg-slate-900 p-8 space-y-6 shadow-xl border-l-8 border-l-primary relative overflow-hidden transition-all hover:scale-[1.01]">
                                <div className="flex items-center justify-between">
                                    <Badge className="bg-primary/5 text-primary text-[9px] font-black border-none px-4 py-1.5 uppercase rounded-lg tracking-widest">{f.featureId || 'Global'}</Badge>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        {[...Array(5)].map((_, i) => <Star key={i} className={cn("h-3.5 w-3.5", i < (f.rating || 0) ? "fill-current" : "opacity-20")} />)}
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-2 border-slate-100 dark:border-slate-800 pl-6">"{f.text}"</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">User: {f.userId?.substring(0, 8)}...</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{f.createdAt ? format(f.createdAt.toDate(), 'MMM dd, HH:mm') : 'Recently'}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </TabsContent>
        </Tabs>
      </main>

      {/* DASHBOARD PULSE ANALYTICS */}
      <div className="max-w-6xl mx-auto px-4 mt-8 pb-32">
          <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden group">
            <CardHeader className="px-8 pt-8 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl font-black text-[#1A365D] dark:text-white uppercase tracking-tight">System Pulse Diagnostic</CardTitle>
                        <CardDescription className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Global Traction Analysis (24H)</CardDescription>
                    </div>
                    <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center"><BarChart3 className="h-5 w-5 text-primary" /></div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData}>
                            <defs>
                                <linearGradient id="pulseGrad" x1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2488E8" stopOpacity={0.3}/><stop offset="95%" stopColor="#2488E8" stopOpacity={0}/></linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="users" stroke="#2488E8" strokeWidth={5} fill="url(#pulseGrad)" animationDuration={3000} />
                            <Tooltip content={<CustomTooltip />} />
                            <XAxis dataKey="time" hide />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
      </div>

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
