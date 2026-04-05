
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signInAnonymously,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, HeartPulse, Chrome, Apple, Facebook, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

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
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === 'signup') {
        if (!name) {
          toast({ variant: 'destructive', title: 'Name is required' });
          setLoading(false);
          return;
        }
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
        
        toast({ title: 'Account created!', description: "Welcome to Your Medical Partner!" });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Logged in successfully!' });
      }
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    try {
      await signInAnonymously(auth);
      toast({ title: 'Logged in as Guest' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Guest Sign-in Failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-6 overflow-hidden relative font-body">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md space-y-12 flex flex-col items-center relative z-10">
        
        {/* Brand Typography Design */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-[2rem] shadow-xl shadow-blue-100 mb-2 transform hover:scale-110 transition-transform duration-500">
            <HeartPulse className="h-14 w-14 text-primary animate-pulse" />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 font-headline leading-none uppercase">
              Your Medical <br />
              <span className="text-primary">Partner</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] pt-2">
              Digital Health Companion
            </p>
          </div>
        </div>

        {view === 'welcome' ? (
          <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="w-full space-y-5 px-2">
              <Button 
                onClick={() => setView('signup')}
                className="w-full h-16 rounded-[1.5rem] text-lg font-bold bg-gradient-to-r from-[#4A90E2] to-[#357ABD] hover:shadow-2xl hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200 border-none transition-all duration-300 flex items-center justify-between px-8"
              >
                <span>Create Account</span>
                <ChevronRight className="h-6 w-6 opacity-50" />
              </Button>
              
              <Button 
                onClick={() => setView('login')}
                variant="outline"
                className="w-full h-16 rounded-[1.5rem] text-lg font-bold bg-white border-none shadow-md text-slate-800 hover:bg-slate-50 hover:shadow-xl transition-all active:scale-95 duration-300"
              >
                Sign In
              </Button>
              
              <div className="text-center pt-4">
                <button 
                  onClick={handleGuestSignIn}
                  className="text-slate-400 font-black text-xs hover:text-primary uppercase tracking-widest transition-colors"
                >
                  Explore as Guest
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Card className="w-full rounded-[3rem] border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] bg-white/95 backdrop-blur-xl p-2 animate-in zoom-in-95 duration-500">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-slate-200 hover:bg-slate-300 text-slate-900 transition-colors" 
                  onClick={() => setView('welcome')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {view === 'login' ? 'Welcome Back' : 'Get Started'}
                </h3>
              </div>

              <form onSubmit={handleAuthAction} className="space-y-6">
                {view === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="e.g. Rohan Kumar" 
                      className="h-14 rounded-2xl bg-slate-100 border-none focus-visible:ring-primary text-slate-900 text-lg px-6 shadow-inner"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@email.com" 
                    className="h-14 rounded-2xl bg-slate-100 border-none focus-visible:ring-primary text-slate-900 text-lg px-6 shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Secure Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-14 rounded-2xl bg-slate-100 border-none focus-visible:ring-primary text-slate-900 text-lg px-6 shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className={cn(
                    "w-full h-16 rounded-2xl text-lg font-bold mt-4 shadow-xl active:scale-95 transition-all duration-300",
                    view === 'signup' ? "bg-gradient-to-r from-[#4A90E2] to-[#357ABD]" : "bg-primary"
                  )}
                >
                  {loading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'Login Now' : 'Join Now')}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="w-full pt-4 flex flex-col items-center space-y-8 animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center w-full gap-6 px-8">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Instant Access</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>
          
          <div className="flex items-center gap-8">
            <SocialButton icon={<Chrome className="h-6 w-6 text-red-500" />} />
            <SocialButton icon={<Apple className="h-6 w-6 text-slate-900" />} />
            <SocialButton icon={<Facebook className="h-6 w-6 text-blue-600" />} />
          </div>
        </div>

      </div>
    </div>
  );
}

function SocialButton({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="h-16 w-16 rounded-[1.5rem] bg-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 hover:shadow-2xl transition-all duration-300 border border-white group">
      <div className="group-hover:rotate-12 transition-transform duration-300">
        {icon}
      </div>
    </div>
  );
}
