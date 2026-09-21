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
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, HeartPulse, ShieldCheck, ChevronRight, UserPlus, LogIn, Sparkles, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Premium CSS-Based Medical Animation with Bottom ECG/Health Rate
 * Optimized: Compact width for mobile screens.
 */
function PremiumMedicalHero() {
  return (
    <div className="relative w-full max-w-[220px] h-[220px] flex items-center justify-center overflow-visible select-none mb-6">
      {/* Dynamic Background Glow Orbs */}
      <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-[50px] animate-pulse" />
      
      {/* Main Animated Engine */}
      <div className="relative z-10 flex items-center justify-center animate-in zoom-in-50 duration-1000 w-full">
        <div className="relative w-full p-6 pb-12 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-800 transform hover:scale-105 transition-transform duration-700 group cursor-default overflow-hidden">
          
          {/* Floating Heart Icon */}
          <div className="animate-bounce duration-[3000ms] ease-in-out relative z-20 flex justify-center">
            <HeartPulse className="h-14 w-14 text-primary drop-shadow-[0_0_20px_rgba(36,136,232,0.6)]" />
          </div>

          {/* Health Rate / ECG Animation at the Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none opacity-60">
            <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
              <path 
                className="ecg-line"
                d="M0,20 L20,20 L25,10 L30,30 L35,20 L55,20 L60,5 L65,35 L70,20 L100,20" 
                fill="transparent" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{ color: 'hsl(var(--primary))' }}
              />
            </svg>
          </div>

          {/* Precision Corner Badge */}
          <div className="absolute top-3 right-3 w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-xl border-4 border-white dark:border-slate-950 flex items-center justify-center shadow-xl rotate-6 z-30">
            <Sparkles className="h-3 w-3 text-white animate-pulse" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .ecg-line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: ecg-draw 2.5s linear infinite;
          filter: drop-shadow(0 0 4px #2488E8);
        }
        @keyframes ecg-draw {
          0% { stroke-dashoffset: 200; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
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

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
          const userProfileRef = doc(firestore, 'users', result.user.uid, 'userProfiles', result.user.uid);
          await setDoc(userProfileRef, {
            id: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
            profilePicture: result.user.photoURL,
            onboardingCompleted: true,
            createdAt: serverTimestamp(),
          });
      }
      toast({ title: 'Welcome!', description: 'Logged in with Google.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Sign-in Failed', description: 'Google connection interrupted.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    try {
      if (view === 'signup') {
        if (!name.trim()) throw new Error('Enter your full name.');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        const userProfileRef = doc(firestore, 'users', userCredential.user.uid, 'userProfiles', userCredential.user.uid);
        await setDoc(userProfileRef, {
          id: userCredential.user.uid,
          name: name,
          email: userCredential.user.email,
          onboardingCompleted: true,
          createdAt: serverTimestamp(),
        });
        toast({ title: 'Welcome Partner!' });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Welcome Back!' });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await signInAnonymously(auth);
      toast({ title: 'Guest Access Active' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Guest Sign-in Failed' });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-[#f0f7ff] via-[#ffffff] to-[#f8f9ff] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] flex flex-col items-center justify-start overflow-hidden relative font-body safe-top">
      
      {/* Immersive Background Blur */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-blue-400 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-lg flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        
        {/* Welcome Screen */}
        {view === 'welcome' && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
            <PremiumMedicalHero />
            
            <div className="text-center space-y-4 mb-10">
               <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full border border-blue-100/50 dark:border-slate-800 shadow-sm mx-auto">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-[9px] font-black text-[#1A365D] dark:text-primary uppercase tracking-[0.3em]">Verified Health Portal</span>
               </div>
               <div className="space-y-1">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-[#1A365D] dark:text-white uppercase leading-none">
                    Your <span className="text-primary">Medical</span> Partner
                  </h1>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Elite Health Companion</p>
               </div>
            </div>

            <div className="w-full max-w-xs space-y-4">
              {/* Google Button */}
              <Button 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full h-14 rounded-3xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 border border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95 group"
              >
                  {loading ? <Loader2 className="animate-spin" /> : (
                      <>
                          <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335"/></svg>
                          </div>
                          <span className="font-black uppercase text-[9px] tracking-widest">Sign with Google</span>
                      </>
                  )}
              </Button>

              {/* Primary Signup Action */}
              <Button 
                onClick={() => setView('signup')}
                className="w-full h-14 rounded-3xl text-[11px] font-black uppercase tracking-[0.25em] bg-primary hover:bg-primary/90 shadow-xl active:scale-95 transition-all duration-500 border-none flex items-center justify-between px-8"
              >
                <span>Join Network</span>
                <ChevronRight className="h-5 w-5 opacity-60" />
              </Button>
              
              {/* Secondary Actions Row */}
              <div className="grid grid-cols-2 gap-3">
                 <Button 
                    variant="outline"
                    onClick={() => setView('login')}
                    className="h-12 rounded-2xl border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 text-[9px] font-black uppercase tracking-widest"
                 >
                    Sign In
                 </Button>
                 <Button 
                    variant="ghost"
                    onClick={handleGuestSignIn}
                    className="h-12 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary"
                 >
                    <UserCircle className="w-3 h-3 mr-2" /> Guest
                 </Button>
              </div>

              <div className="pt-8 opacity-40">
                  <div className="flex items-center w-full gap-4">
                      <div className="h-px bg-slate-400 flex-1" />
                      <span className="text-[7px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Secure Private Data</span>
                      <div className="h-px bg-slate-400 flex-1" />
                  </div>
              </div>
            </div>
          </div>
        )}

        {/* Focused Form View (Login/Signup) */}
        {view !== 'welcome' && (
          <div className="w-full max-w-sm animate-in slide-in-from-right-8 fade-in duration-500">
            <div className="flex items-center justify-between mb-8 px-2">
              <Button variant="ghost" size="icon" className="rounded-full bg-white dark:bg-slate-800 h-11 w-11 shadow-md border border-slate-100 dark:border-slate-700 hover:bg-primary/10 transition-all active:scale-90" onClick={() => setView('welcome')} disabled={loading}>
                <ArrowLeft className="h-5 w-5 text-[#1A365D] dark:text-white" />
              </Button>
              <div className="text-right">
                <h3 className="text-2xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase leading-none">
                    {view === 'login' ? 'Sign In' : 'Join Now'}
                </h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Elite Medical Access</p>
              </div>
            </div>

            <Card className="w-full rounded-[2.8rem] border-none shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <form onSubmit={handleAuthAction} className="space-y-5">
                  {view === 'signup' && (
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</Label>
                      <Input 
                        placeholder="e.g. Rohan Kumar" 
                        className="h-13 rounded-2xl bg-slate-50/50 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-sm px-6 shadow-inner font-bold"
                        value={name} onChange={(e) => setName(e.target.value)} required disabled={loading}
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</Label>
                    <Input 
                      type="email" placeholder="name@example.com" 
                      className="h-13 rounded-2xl bg-slate-50/50 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-sm px-6 shadow-inner font-bold"
                      value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</Label>
                    <Input 
                      type="password" placeholder="••••••••" 
                      className="h-13 rounded-2xl bg-slate-50/50 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-sm px-6 shadow-inner font-bold"
                      value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading} className="w-full h-15 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] mt-4 shadow-xl shadow-primary/20 active:scale-95 transition-all bg-primary hover:bg-primary/90 border-none">
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <span className="flex items-center gap-3">
                            {view === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            {view === 'login' ? 'Access Portal' : 'Create Identity'}
                        </span>
                    )}
                  </Button>
                </form>

                <div className="text-center pt-2">
                    <button 
                        type="button" 
                        onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                        className="text-[9px] font-bold text-slate-400 uppercase tracking-widest"
                    >
                        {view === 'login' ? "New to the platform? " : "Already a partner? "}
                        <span className="text-primary font-black hover:underline ml-1">
                            {view === 'login' ? 'Register' : 'Log In'}
                        </span>
                    </button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary/50" />
                    HIPAA Compliant Cloud Security
                 </p>
            </div>
          </div>
        )}

      </div>
      
      {/* Disclaimer Footer */}
      <div className="pb-8 flex flex-col items-center gap-2 text-slate-400/50">
         <p className="text-[7px] font-bold uppercase tracking-tighter text-center max-w-[200px]">
           Advanced health intelligence with encrypted private storage.
         </p>
      </div>
    </div>
  );
}
