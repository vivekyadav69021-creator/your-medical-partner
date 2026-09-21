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
import { Loader2, ArrowLeft, HeartPulse, ShieldCheck, ChevronRight, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Player } from '@lottiefiles/react-lottie-player';

/**
 * Premium Medical Animation Section
 * Centered and optimized for mobile/web.
 */
function MedicalHeroAnimation() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full max-w-[320px] h-[300px] flex items-center justify-center overflow-visible">
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-primary/15 blur-[60px] rounded-full scale-110 -z-10 animate-pulse" />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
        </div>
      )}

      {/* High-Quality Medical Lottie Asset */}
      <Player
        autoplay
        loop
        src="https://lottie.host/bf51dd24-6e25-48d0-94fc-168e43827d6a/qduk3jmYak.json"
        style={{ height: '280px', width: '280px' }}
        className={cn(
          "relative z-10 drop-shadow-2xl transition-all duration-1000",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
        onEvent={event => {
          if (event === 'load') setIsLoaded(true);
        }}
      />
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
      console.error("Google Auth Error:", error);
      toast({ variant: 'destructive', title: 'Sign-in Failed', description: 'Could not connect to Google.' });
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
        
        toast({ title: 'Account Created', description: "Welcome to Your Medical Partner." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Welcome Back!', description: 'Accessing your health dashboard...' });
      }
    } catch (error: any) {
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') message = 'This email is already registered.';
      else if (error.code === 'auth/invalid-credential') message = 'Incorrect email or password.';
      
      toast({ variant: 'destructive', title: 'Auth Failed', description: message });
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
      toast({ variant: 'destructive', title: 'Failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-[#f0f7ff] via-[#ffffff] to-[#f8f9ff] dark:from-[#0f172a] dark:via-[#020617] dark:to-[#1e1b4b] flex flex-col items-center justify-start overflow-hidden relative font-body safe-top">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-5%] left-[-10%] w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-[-10%] w-80 h-80 bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg flex-1 flex flex-col items-center justify-between p-6 pb-8 overflow-y-auto scrollbar-hide relative z-10">
        
        {/* Header Section with Animation */}
        <div className="w-full flex flex-col items-center pt-2 animate-in fade-in zoom-in-95 duration-1000">
          <MedicalHeroAnimation />
          
          <div className="text-center mt-4 space-y-4">
             <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full border border-blue-100/50 dark:border-slate-800 shadow-sm mx-auto">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[9px] font-black text-[#1A365D] dark:text-primary uppercase tracking-[0.3em]">Official Health Portal</span>
             </div>
             <div className="space-y-1">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#1A365D] dark:text-white uppercase leading-none">
                  Your <span className="text-primary">Medical</span> Partner
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Elite Digital Health Ecosystem</p>
             </div>
          </div>
        </div>

        {/* Form Action Section */}
        <div className="w-full max-w-md mt-6 relative z-20">
          {view === 'welcome' ? (
            <div className="w-full space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
              <div className="space-y-4 px-2">
                <Button 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full h-16 rounded-[2.2rem] bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xl flex items-center justify-center gap-4 transition-all active:scale-95 group"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <>
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335"/></svg>
                            </div>
                            <span className="font-black uppercase text-[10px] tracking-widest">Sign in with Google</span>
                        </>
                    )}
                </Button>

                <Button 
                  onClick={() => setView('signup')}
                  className="w-full h-16 rounded-[2.2rem] text-sm font-black uppercase tracking-[0.25em] bg-primary hover:bg-primary/90 shadow-[0_20px_40px_-10px_rgba(36,136,232,0.4)] active:scale-95 transition-all duration-500 border-none flex items-center justify-between px-10"
                >
                  <span>Start Health Journey</span>
                  <ChevronRight className="h-6 w-6 opacity-60" />
                </Button>
                
                <div className="pt-2">
                  <button 
                    onClick={() => setView('login')}
                    className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
                  >
                    Already a partner? Sign In
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 pt-2 text-center">
                <div className="flex items-center w-full gap-4 px-12 opacity-30">
                  <div className="h-px bg-slate-400 flex-1" />
                  <span className="text-[8px] font-black uppercase tracking-[0.3em] whitespace-nowrap">Clinical Access</span>
                  <div className="h-px bg-slate-400 flex-1" />
                </div>
                
                <button 
                  onClick={handleGuestSignIn}
                  className="text-[9px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.3em] transition-colors bg-white/40 dark:bg-slate-800/40 px-8 py-3 rounded-full border border-white/50 dark:border-slate-800 backdrop-blur-md shadow-sm"
                >
                  Explore as Visitor
                </button>
              </div>
            </div>
          ) : (
            <Card className="w-full rounded-[2.8rem] border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl p-1 animate-in slide-in-from-right-8 fade-in duration-500">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 dark:bg-slate-800 h-11 w-11 hover:bg-primary/10 transition-colors" onClick={() => setView('welcome')} disabled={loading}>
                    <ArrowLeft className="h-5 w-5 text-[#1A365D] dark:text-white" />
                  </Button>
                  <div className="text-right">
                    <h3 className="text-xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase">
                        {view === 'login' ? 'Sign In' : 'Join Partner'}
                    </h3>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Medical Cloud Sync</p>
                  </div>
                </div>

                <form onSubmit={handleAuthAction} className="space-y-5">
                  {view === 'signup' && (
                    <div className="space-y-1.5 px-1">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</Label>
                      <Input 
                        placeholder="e.g. Rohan Kumar" 
                        className="h-14 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-base px-6 shadow-inner font-bold"
                        value={name} onChange={(e) => setName(e.target.value)} required disabled={loading}
                      />
                    </div>
                  )}
                  <div className="space-y-1.5 px-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</Label>
                    <Input 
                      type="email" placeholder="name@example.com" 
                      className="h-14 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-base px-6 shadow-inner font-bold"
                      value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
                    />
                  </div>
                  <div className="space-y-1.5 px-1">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Password</Label>
                    <Input 
                      type="password" placeholder="••••••••" 
                      className="h-14 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-base px-6 shadow-inner font-bold"
                      value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
                    />
                  </div>
                  
                  <Button type="submit" disabled={loading} className="w-full h-16 rounded-[2rem] text-xs font-black uppercase tracking-[0.25em] mt-6 shadow-xl active:scale-95 transition-all bg-primary hover:bg-primary/90">
                    {loading ? <Loader2 className="animate-spin" /> : (
                        <span className="flex items-center gap-3">
                            {view === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                            {view === 'login' ? 'Access Dashboard' : 'Confirm Registration'}
                        </span>
                    )}
                  </Button>
                </form>

                <div className="text-center pt-2">
                    <p className="text-[10px] font-bold text-slate-400">
                        {view === 'login' ? "Don't have an account?" : "Already a partner?"}{' '}
                        <button 
                            type="button" 
                            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                            className="text-primary font-black uppercase tracking-widest hover:underline"
                        >
                            {view === 'login' ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer Trust Section */}
        <div className="mt-8 flex flex-col items-center gap-4 text-slate-400/60">
           <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em]">
              <ShieldCheck className="w-4 h-4 text-primary/60" />
              100% HIPAA Secure Data
           </div>
           <p className="text-[8px] font-bold text-center leading-relaxed max-w-[260px] uppercase tracking-tighter">
             Professional health intelligence with encrypted private storage.
           </p>
        </div>

      </div>
    </div>
  );
}
