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
 * Built with Pure SVG + Tailwind for 100% visibility and premium feel.
 */
function AdvancedMedicalAnimation() {
  return (
    <div className="relative w-full max-w-[320px] h-80 flex items-center justify-center perspective-1000">
      {/* High-Tech Pulse Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-primary/20 rounded-full animate-ping [animation-duration:3s]" />
        <div className="absolute w-48 h-48 border-2 border-primary/10 rounded-full animate-ping [animation-duration:2s]" />
        <div className="absolute w-32 h-32 border-2 border-primary/30 rounded-full animate-ping [animation-duration:4s]" />
      </div>

      {/* Rotating Neural/Tech Rings */}
      <div className="absolute w-full h-full border-t-2 border-l-2 border-primary/40 rounded-full animate-spin [animation-duration:10s]" />
      <div className="absolute w-[80%] h-[80%] border-b-2 border-r-2 border-accent/30 rounded-full animate-spin [animation-duration:15s] [animation-direction:reverse]" />
      
      {/* Central Glassmorphic Shield */}
      <div className="relative z-10 p-10 bg-white/40 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl border border-white dark:border-slate-800 flex items-center justify-center group overflow-hidden transition-all duration-700 hover:scale-105 active:scale-95">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 animate-pulse" />
        
        {/* The Heart of the App */}
        <div className="relative z-20 flex flex-col items-center gap-2">
            <HeartPulse className="h-24 w-24 text-primary drop-shadow-[0_0_30px_rgba(36,136,232,0.6)] animate-pulse" />
            
            {/* Dynamic Data Wave */}
            <div className="flex gap-0.5 items-end h-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div 
                        key={i} 
                        className="w-1 bg-primary/40 rounded-full animate-bounce" 
                        style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} 
                    />
                ))}
            </div>
        </div>

        {/* Orbiting Interaction Points */}
        <div className="absolute top-4 right-6 h-3 w-3 bg-accent rounded-full animate-bounce [animation-delay:0.2s] shadow-[0_0_10px_rgba(20,207,189,0.8)]" />
        <div className="absolute bottom-8 left-6 h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:0.5s] shadow-[0_0_8px_rgba(36,136,232,0.8)]" />
      </div>

      {/* Decorative Aura Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 -z-10 animate-pulse" />
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
      {/* Dynamic Ambient Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-15%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg flex-1 flex flex-col items-center justify-between p-6 pb-12 overflow-y-auto scrollbar-hide">
        
        {/* Top Hero Section - Premium Custom Animation */}
        <div className="w-full flex flex-col items-center pt-8 animate-in fade-in zoom-in-95 duration-1000">
          <AdvancedMedicalAnimation />

          <div className="text-center mt-6 space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-100 dark:border-blue-800/50 mb-1">
                <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Professional Gateway</span>
             </div>
             <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#1A365D] dark:text-white uppercase leading-none">
                  <span className="text-primary">Medical</span> Partner
                </h1>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.35em]">Advanced Diagnostic Network</p>
             </div>
          </div>
        </div>

        {/* Auth Interface */}
        <div className="w-full max-w-md mt-8">
          {view === 'welcome' ? (
            <div className="w-full space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
              <div className="space-y-4 px-2">
                <Button 
                  onClick={() => setView('signup')}
                  className="w-full h-16 rounded-[2rem] text-lg font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-[0_20px_40px_-10px_rgba(36,136,232,0.4)] hover:shadow-2xl active:scale-95 transition-all duration-500 border-none flex items-center justify-between px-10"
                >
                  <span>Start Journey</span>
                  <ChevronRight className="h-6 w-6 opacity-50" />
                </Button>
                
                <Button 
                  onClick={() => setView('login')}
                  variant="outline"
                  className="w-full h-16 rounded-[2rem] text-lg font-bold bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-white/50 dark:border-slate-800 shadow-lg text-[#1A365D] dark:text-slate-200 hover:bg-white/60 active:scale-95 duration-300"
                >
                  Sign In
                </Button>
              </div>

              <div className="flex flex-col items-center gap-5 pt-4">
                <div className="flex items-center w-full gap-4 px-10 opacity-30">
                  <div className="h-px bg-slate-400 flex-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest">or connect with</span>
                  <div className="h-px bg-slate-400 flex-1" />
                </div>
                <div className="flex gap-8">
                  <SocialButton icon={<Chrome className="h-6 w-6 text-red-500" />} />
                  <SocialButton icon={<Apple className="h-6 w-6 text-slate-900 dark:text-white" />} />
                  <SocialButton icon={<Facebook className="h-6 w-6 text-blue-600" />} />
                </div>
                <button 
                  onClick={handleGuestSignIn}
                  className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.25em] transition-colors mt-4 p-2"
                >
                  Explore as Guest
                </button>
              </div>
            </div>
          ) : (
            <Card className="w-full rounded-[3rem] border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl p-2 animate-in slide-in-from-right-10 fade-in duration-500">
              <CardContent className="p-10 space-y-8">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 dark:bg-slate-800 h-12 w-12" onClick={() => setView('welcome')} disabled={loading}>
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
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-5">Full Name</Label>
                      <Input 
                        placeholder="Rohan Kumar" 
                        className="h-14 rounded-2xl bg-white/50 dark:bg-slate-800 border-none focus-visible:ring-primary text-lg px-7 shadow-inner"
                        value={name} onChange={(e) => setName(e.target.value)} required disabled={loading}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-5">Email Address</Label>
                    <Input 
                      type="email" placeholder="name@example.com" 
                      className="h-14 rounded-2xl bg-white/50 dark:bg-slate-800 border-none focus-visible:ring-primary text-lg px-7 shadow-inner"
                      value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-5">Password</Label>
                    <Input 
                      type="password" placeholder="••••••••" 
                      className="h-14 rounded-2xl bg-white/50 dark:bg-slate-800 border-none focus-visible:ring-primary text-lg px-7 shadow-inner"
                      value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-16 rounded-3xl text-lg font-black uppercase tracking-widest mt-4 shadow-xl active:scale-95 transition-all bg-primary">
                    {loading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'Sign In' : 'Join Now')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer Trust Badge */}
        <div className="mt-16 flex flex-col items-center gap-4 text-slate-400/60">
           <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.25em]">
              <ShieldCheck className="w-4.5 h-4.5 text-primary" />
              HIPAA Compliant Security
           </div>
           <p className="text-[9px] font-bold text-center leading-relaxed">
             By continuing, you agree to our professional <br/> medical data handling policies.
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
      className="h-16 w-16 rounded-[1.8rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border border-white dark:border-slate-800 disabled:opacity-50"
    >
      {icon}
    </button>
  );
}
