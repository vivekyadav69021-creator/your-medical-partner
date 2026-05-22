'use client';

import { useState, useEffect, useRef } from 'react';
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
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, HeartPulse, Chrome, Apple, Facebook, ChevronRight, ShieldCheck, Phone, Smartphone, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * Advanced Medical Animation - Contained Waves
 */
function AdvancedMedicalAnimation() {
  return (
    <div className="relative w-full max-w-[260px] h-[260px] flex items-center justify-center pointer-events-none select-none overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-20 h-20 bg-primary/10 rounded-full animate-ping [animation-duration:2.5s]" />
        <div className="absolute w-32 h-32 border border-primary/5 rounded-full animate-pulse [animation-duration:4s]" />
      </div>

      <div className="relative z-10 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_40px_-10px_rgba(36,136,232,0.3)] border border-white dark:border-slate-800 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
        <div className="relative z-20">
          <HeartPulse className="h-14 w-14 text-primary drop-shadow-[0_0_12px_rgba(36,136,232,0.4)] animate-pulse" />
        </div>
      </div>
      <div className="absolute inset-0 bg-primary/5 blur-[60px] rounded-full scale-75 -z-10" />
    </div>
  );
}

type AuthView = 'welcome' | 'login' | 'signup' | 'phone' | 'otp';

export default function LoginPage() {
  const [view, setView] = useState<AuthView>('welcome');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
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

  // Phone Auth Logic
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          console.log('Recaptcha resolved');
        }
      });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    // Basic validation
    if (!phoneNumber.startsWith('+')) {
      toast({ variant: 'destructive', title: 'Invalid Format', description: 'Please include country code (e.g. +91)' });
      return;
    }

    setLoading(true);
    try {
      setupRecaptcha();
      const verifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(result);
      setView('otp');
      toast({ title: 'OTP Sent', description: `A code has been sent to ${phoneNumber}` });
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send OTP. Please try again.' });
      if ((window as any).recaptchaVerifier) {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !confirmationResult) return;

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      toast({ title: 'Success', description: 'Logged in successfully.' });
      // New phone users might need profile setup
      if (result.user.metadata.creationTime === result.user.metadata.lastSignInTime) {
          localStorage.setItem('userMedicalProfile_local', JSON.stringify({
              name: 'Guest User',
              image: `https://picsum.photos/seed/${result.user.uid}/400/400`
          }));
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Invalid OTP', description: 'The code you entered is incorrect.' });
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
      <div id="recaptcha-container"></div>
      
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-15%] w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-lg flex-1 flex flex-col items-center justify-between p-6 pb-12 overflow-y-auto scrollbar-hide">
        
        <div className="w-full flex flex-col items-center pt-6 animate-in fade-in zoom-in-95 duration-1000">
          <AdvancedMedicalAnimation />
          <div className="text-center mt-4 space-y-4">
             <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-blue-50/80 dark:bg-blue-900/30 rounded-full border border-blue-100/50 dark:border-blue-800 shadow-sm mx-auto">
                <ShieldCheck className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Professional Gateway</span>
             </div>
             <div className="space-y-0.5">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[#1A365D] dark:text-white uppercase leading-none select-none">
                  Your <span className="text-primary">Medical</span> Partner
                </h1>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.45em] ml-1">Elite Digital Health Companion</p>
             </div>
          </div>
        </div>

        <div className="w-full max-w-md mt-6">
          {view === 'welcome' ? (
            <div className="w-full space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
              <div className="space-y-3 px-2">
                <Button 
                  onClick={() => setView('signup')}
                  className="w-full h-16 rounded-[2.5rem] text-lg font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-[0_20px_40px_-10px_rgba(36,136,232,0.4)] active:scale-95 transition-all duration-500 border-none flex items-center justify-between px-10"
                >
                  <span>Start Journey</span>
                  <ChevronRight className="h-7 w-7 opacity-60" />
                </Button>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => setView('phone')}
                    variant="outline"
                    className="h-14 rounded-2xl font-bold bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-white/60 dark:border-slate-800 shadow-sm text-[#1A365D] dark:text-slate-200 hover:bg-white/70 active:scale-95"
                  >
                    <Smartphone className="w-4 h-4 mr-2" /> Mobile
                  </Button>
                  <Button 
                    onClick={() => setView('login')}
                    variant="outline"
                    className="h-14 rounded-2xl font-bold bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-white/60 dark:border-slate-800 shadow-sm text-[#1A365D] dark:text-slate-200 hover:bg-white/70 active:scale-95"
                  >
                    Sign In
                  </Button>
                </div>
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
                  className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.3em] transition-colors mt-2 px-6 py-2 rounded-full hover:bg-primary/5"
                >
                  Explore as Guest
                </button>
              </div>
            </div>
          ) : (
            <Card className="w-full rounded-[3rem] border-none shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl p-1 animate-in slide-in-from-right-10 fade-in duration-500">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 dark:bg-slate-800 h-11 w-11 hover:bg-primary/10 transition-colors" onClick={() => setView('welcome')} disabled={loading}>
                    <ArrowLeft className="h-5 w-5 text-[#1A365D] dark:text-white" />
                  </Button>
                  <div className="flex flex-col -space-y-1">
                    <h3 className="text-xl font-black text-[#1A365D] dark:text-white tracking-tight uppercase">
                        {view === 'login' ? 'Welcome Back' : view === 'phone' ? 'Mobile Login' : view === 'otp' ? 'Verify Code' : 'Create Account'}
                    </h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Safe & Encrypted Session</p>
                  </div>
                </div>

                {view === 'phone' && (
                  <form onSubmit={handleSendOtp} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-6">Phone Number</Label>
                        <div className="relative">
                            <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input 
                                type="tel" placeholder="+91 98765 43210" 
                                className="h-14 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-lg pl-14 pr-8 shadow-inner"
                                value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required disabled={loading}
                            />
                        </div>
                        <p className="text-[9px] text-slate-400 px-6 italic font-medium">Use +91 followed by your number</p>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-16 rounded-[2rem] text-lg font-black uppercase tracking-widest mt-4 shadow-xl active:scale-95 transition-all bg-primary hover:bg-primary/90">
                        {loading ? <Loader2 className="animate-spin" /> : 'Get OTP Code'}
                    </Button>
                  </form>
                )}

                {view === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-6">Verification Code</Label>
                        <div className="relative">
                            <CheckCircle2 className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            <Input 
                                type="text" placeholder="Enter 6-digit OTP" 
                                className="h-14 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-center text-2xl tracking-[0.5em] font-black shadow-inner"
                                maxLength={6}
                                value={otp} onChange={(e) => setOtp(e.target.value)} required disabled={loading}
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-16 rounded-[2rem] text-lg font-black uppercase tracking-widest mt-4 shadow-xl active:scale-95 transition-all bg-primary hover:bg-primary/90">
                        {loading ? <Loader2 className="animate-spin" /> : 'Verify & Sign In'}
                    </Button>
                    <button type="button" onClick={() => setView('phone')} className="w-full text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Change Number</button>
                  </form>
                )}

                {(view === 'login' || view === 'signup') && (
                  <form onSubmit={handleAuthAction} className="space-y-5">
                    {view === 'signup' && (
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-6">Full Name</Label>
                        <Input 
                          placeholder="Rohan Kumar" 
                          className="h-14 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-lg px-8 shadow-inner"
                          value={name} onChange={(e) => setName(e.target.value)} required disabled={loading}
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-6">Email Address</Label>
                      <Input 
                        type="email" placeholder="name@example.com" 
                        className="h-14 rounded-2xl bg-white/60 dark:bg-slate-800/60 border-none focus-visible:ring-2 focus-visible:ring-primary text-lg px-8 shadow-inner"
                        value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading}
                      />
                    </div>
                    <div className="space-y-1.5">
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
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-slate-400/50">
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
      <div className="group-hover:drop-shadow-[0_0:10px_rgba(36,136,232,0.3)] transition-all">
        {icon}
      </div>
    </button>
  );
}
