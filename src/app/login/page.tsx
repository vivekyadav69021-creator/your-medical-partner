'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useFirestore, useUser } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, HeartPulse, Chrome, Apple, Facebook, ChevronRight, ShieldCheck, Sparkles, Activity, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Custom Advanced Medical Animation
 * Perfectly contained and centered SVG + CSS Animation.
 */
function AdvancedMedicalAnimation() {
  return (
    <div className="relative w-full max-w-[300px] h-[300px] flex items-center justify-center pointer-events-none select-none">
      {/* Contained High-Tech Pulse Rings */}
      <div className="absolute inset-0 flex items-center justify-center overflow-visible">
        {/* Outer Soft Pulse */}
        <div className="absolute w-full h-full border border-primary/10 rounded-full animate-pulse [animation-duration:3s]" />
        {/* Middle Pulse */}
        <div className="absolute w-[80%] h-[80%] border-2 border-primary/20 rounded-full animate-pulse [animation-duration:2s]" />
        {/* Inner Wave (controlled expansion) */}
        <div className="absolute w-[60%] h-[60%] border-2 border-primary/10 rounded-full animate-pulse [animation-duration:1.5s]" />
      </div>

      {/* Rotating Tech Rings */}
      <div className="absolute w-[75%] h-[75%] border-t-2 border-l-2 border-primary/40 rounded-full animate-spin [animation-duration:8s]" />
      <div className="absolute w-[65%] h-[65%] border-b-2 border-r-2 border-accent/30 rounded-full animate-spin [animation-duration:12s] [animation-direction:reverse]" />
      
      {/* Central Branded Shield */}
      <div className="relative z-10 p-10 bg-white/60 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_30px_60px_-12px_rgba(36,136,232,0.3)] border border-white dark:border-slate-800 flex items-center justify-center group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-transparent opacity-60" />
        
        {/* Animated Heart Symbol */}
        <div className="relative z-20 flex flex-col items-center gap-4">
            <div className="relative">
                <HeartPulse className="h-24 w-20 text-primary drop-shadow-[0_0_20px_rgba(36,136,232,0.6)] animate-pulse" />
                <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-accent rounded-full animate-bounce shadow-[0_0_12px_rgba(20,207,189,1)]" />
            </div>
            
            {/* Real-time Data Indicator */}
            <div className="flex gap-1 items-end h-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div 
                        key={i} 
                        className="w-1 bg-primary/40 rounded-full animate-bounce" 
                        style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 0.15}s` }} 
                    />
                ))}
            </div>
        </div>
      </div>

      {/* Radiant Glow Background - contained blur */}
      <div className="absolute inset-0 bg-primary/15 blur-[100px] rounded-full scale-90 -z-10" />
    </div>
  );
}

type AuthView = 'welcome' | 'login' | 'signup';

export default function LoginPage() {
  const [view, setView] = useState<AuthView>('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && user) {
      router.replace('/dashboard');
    }
  }, [user, isMounted, router]);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      if (view === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (password.length < 6) throw new Error('Password should be at least 6 characters.');

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { 
          displayName: name,
          photoURL: `https://picsum.photos/seed/${userCredential.user.uid}/400/400`
        });

        localStorage.setItem('userMedicalProfile_local', JSON.stringify({
            name: name,
            image: `https://picsum.photos/seed/${userCredential.user.uid}/400/400`
        }));
        
        const userProfileRef = doc(firestore, 'users', userCredential.user.uid, 'userProfiles', userCredential.user.uid);
        await setDoc(userProfileRef, {
          id: userCredential.user.uid,
          name: name,
          email: userCredential.user.email,
          onboardingCompleted: true,
          createdAt: serverTimestamp(),
        });
        
        toast({ title: 'Welcome!', description: "Your account has been created successfully." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        localStorage.removeItem('userMedicalProfile_local');
        toast({ title: 'Welcome Back!', description: 'Logged in successfully.' });
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') message = 'Email already registered.';
      else if (error.code === 'auth/invalid-credential') message = 'Invalid email or password.';
      
      toast({ variant: 'destructive', title: 'Authentication Failed', description: message });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signInAnonymously(auth);
      toast({ title: 'Logged in as Guest' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Guest Sign-in Failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-br from-[#f0f7ff] via-[#ffffff] to-[#fff5f7] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] flex flex-col items-center justify-start overflow-hidden relative font-body safe-top">
      {/* Ambient Visual Layers */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-15%] w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg flex-1 flex flex-col items-center justify-between p-6 pb-12 overflow-y-auto scrollbar-hide">
        
        {/* Branded Hero Section */}
        <div className="w-full flex flex-col items-center pt-8 animate-in fade-in zoom-in-95 duration-1000">
          
          <AdvancedMedicalAnimation />

          <div className="text-center mt-6 space-y-5">
             <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-blue-50/80 dark:bg-blue-900/30 rounded-full border border-blue-100/50 dark:border-blue-800 shadow-sm mx-auto">
                <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Professional Gateway</span>
             </div>
             
             <div className="space-y-2">
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-[#1A365D] dark:text-white uppercase leading-none select-none">
                  <span className="text-primary">Medical</span> Partner
                </h1>
                <p className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.45em] ml-1">Elite Diagnostic Network</p>
             </div>
          </div>
        </div>

        {/* Dynamic Auth Controller */}
        <div className="w-full max-w-md mt-8">
          {view === 'welcome' ? (
            <div className="w-full space-y-10 animate-in slide-in-from-bottom-10 fade-in duration-700">
              <div className="space-y-4 px-2">
                <Button 
                  onClick={() => setView('signup')}
                  className="w-full h-16 rounded-[2.5rem] text-lg font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-[0_25px_50px_-12px_rgba(36,136,232,0.45)] hover:shadow-2xl active:scale-95 transition-all duration-500 border-none flex items-center justify-between px-10"
                >
                  <span>Start Journey</span>
                  <ChevronRight className="h-7 w-7 opacity-60" />
                </Button>
                
                <Button 
                  onClick={() => setView('login')}
                  variant="outline"
                  className="w-full h-16 rounded-[2.5rem] text-lg font-bold bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-white/60 dark:border-slate-800 shadow-lg text-[#1A365D] dark:text-slate-200 hover:bg-white/70 active:scale-95 duration-300"
                >
                  Sign In
                </Button>
              </div>

              <div className="flex flex-col items-center gap-6 pt-2">
                <div className="flex items-center w-full gap-4 px-12 opacity-30">
                  <div className="h-px bg-slate-400 flex-1" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Express Access</span>
                  <div className="h-px bg-slate-400 flex-1" />
                </div>
                <div className="flex gap-10">
                  <SocialButton icon={<Chrome className="h-7 w-7 text-red-500" />} />
                  <SocialButton icon={<Apple className="h-7 w-7 text-slate-900 dark:text-white" />} />
                  <SocialButton icon={<Facebook className="h-7 w-7 text-blue-600" />} />
                </div>
                <button 
                  onClick={handleGuestSignIn}
                  className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.3em] transition-colors mt-4 px-6 py-2 rounded-full hover:bg-primary/5"
                >
                  Explore as Guest
                </button>
              </div>
            </div>
          ) : (
            <Card className="w-full rounded-[3.5rem] border-none shadow-[0_60px_120px_-25px_rgba(0,0,0,0.2)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl p-1 animate-in slide-in-from-right-10 fade-in duration-500">
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center gap-5">
                  <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 dark:bg-slate-800 h-12 w-12 hover:bg-primary/10 transition-colors" onClick={() => setView('welcome')} disabled={loading}>
                    <ArrowLeft className="h-6 w-6 text-[#1A365D] dark:text-white" />
                  </Button>
                  <div className="flex flex-col -space-y-1">
                    <h3 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase">
                        {view === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Safe & Encrypted Login</p>
                  </div>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-6">
                  {view === 'signup' && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-6">Full Name</Label>
                      <Input 
                        placeholder="Rohan Kumar" 
                        className="h-14 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-lg px-8 shadow-inner"
                        value={name} onChange={(e) => setName(e.target.value)} required disabled={loading}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-6">Email Address</Label>
                    <Input 
                      type="email" placeholder="name@example.com" 
                      className="h-14 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-lg px-8 shadow-inner"
                      value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-6">Password</Label>
                    <Input 
                      type="password" placeholder="••••••••" 
                      className="h-14 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-lg px-8 shadow-inner"
                      value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-16 rounded-[2rem] text-lg font-black uppercase tracking-widest mt-4 shadow-xl active:scale-95 transition-all bg-primary hover:bg-primary/90">
                    {loading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'Sign In' : 'Join Now')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Identity Footer */}
        <div className="mt-14 flex flex-col items-center gap-4 text-slate-400/50">
           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]">
              <ShieldCheck className="w-4.5 h-4.5 text-primary" />
              HIPAA Compliant Security
           </div>
           <p className="text-[9px] font-bold text-center leading-relaxed max-w-[240px]">
             Professional medical data handling standards applied to all user sessions.
           </p>
        </div>

      </div>
    </div>
  );
}

function SocialButton({ icon, disabled }: { icon: React.ReactNode, disabled?: boolean }) {
  return (
    <button 
      disabled={disabled}
      className="h-16 w-16 rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border border-white dark:border-slate-800 disabled:opacity-50 group"
    >
      <div className="group-hover:drop-shadow-[0_0_10px_rgba(36,136,232,0.3)] transition-all">
        {icon}
      </div>
    </button>
  );
}
