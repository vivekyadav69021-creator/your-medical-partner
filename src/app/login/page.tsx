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
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if user is already logged in
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
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (password.length < 6) {
          throw new Error('Password should be at least 6 characters.');
        }

        // 1. Create User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 2. Update Auth Profile - DO THIS FIRST before any redirection
        await updateProfile(userCredential.user, { 
          displayName: name,
          photoURL: `https://picsum.photos/seed/${userCredential.user.uid}/400/400`
        });

        // 3. Store name locally for instant persistence in context
        localStorage.setItem('userMedicalProfile_local', JSON.stringify({
            name: name,
            image: `https://picsum.photos/seed/${userCredential.user.uid}/400/400`
        }));
        
        // 4. Create Firestore Profile
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
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Clear old local data to fetch fresh from server
        localStorage.removeItem('userMedicalProfile_local');
        toast({ title: 'Welcome Back!', description: 'Logged in successfully.' });
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      let message = error.message;
      
      if (error.message.includes('identity-toolkit-api')) {
        message = "Firebase Identity API is not enabled. Please enable it in the Google Cloud Console.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        message = 'The password is too weak.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password.';
      }

      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: message,
      });
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
      console.error("Guest Sign-in Error:", error);
      let message = error.message;
      if (error.message.includes('identity-toolkit-api')) {
        message = "Firebase Identity API is not enabled. Please enable it in the Google Cloud Console.";
      }
      toast({ 
        variant: 'destructive', 
        title: 'Guest Sign-in Failed', 
        description: message 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#F0F7FF] dark:bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden relative font-body">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md space-y-12 flex flex-col items-center relative z-10">
        
        {/* Unique Brand Typography Design */}
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center justify-center p-5 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-blue-100 dark:shadow-none mb-4 transform hover:rotate-6 transition-transform duration-500">
            <HeartPulse className="h-16 w-16 text-[#2488E8] animate-pulse" />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-6xl font-black tracking-tighter font-headline leading-[0.8] uppercase flex flex-col">
              <span className="text-[#1A365D] dark:text-slate-300 self-start ml-2 opacity-80 text-3xl">Your</span>
              <span className="text-[#2488E8] -mt-1 text-7xl">Medical</span>
              <span className="text-[#1A365D] dark:text-slate-300 self-end mr-2 -mt-1 text-4xl">Partner</span>
            </h1>
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.5em] pt-6 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />
              Digital Health Companion
              <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-800" />
            </p>
          </div>
        </div>

        {view === 'welcome' ? (
          <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="w-full space-y-5 px-2">
              <Button 
                onClick={() => setView('signup')}
                className="w-full h-16 rounded-[1.5rem] text-lg font-bold bg-gradient-to-r from-[#4A90E2] to-[#357ABD] hover:shadow-2xl hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none border-none transition-all duration-300 flex items-center justify-between px-8"
              >
                <span>Create Account</span>
                <ChevronRight className="h-6 w-6 opacity-50" />
              </Button>
              
              <Button 
                onClick={() => setView('login')}
                variant="outline"
                className="w-full h-16 rounded-[1.5rem] text-lg font-bold bg-white dark:bg-slate-900 border-none shadow-md text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-xl transition-all active:scale-95 duration-300"
              >
                Sign In
              </Button>
              
              <div className="text-center pt-4">
                <button 
                  onClick={handleGuestSignIn}
                  disabled={loading}
                  className="text-slate-400 font-black text-xs hover:text-primary uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {loading ? 'Entering...' : 'Explore as Guest'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Card className="w-full rounded-[3rem] border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-2 animate-in zoom-in-95 duration-500">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors" 
                  onClick={() => setView('welcome')}
                  disabled={loading}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
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
                      className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus-visible:ring-primary text-slate-900 dark:text-white text-lg px-6 shadow-inner"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@email.com" 
                    className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus-visible:ring-primary text-slate-900 dark:text-white text-lg px-6 shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-4">Secure Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none focus-visible:ring-primary text-slate-900 dark:text-white text-lg px-6 shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
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
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Instant Access</span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          </div>
          
          <div className="flex items-center gap-8">
            <SocialButton icon={<Chrome className="h-6 w-6 text-red-500" />} disabled={loading} />
            <SocialButton icon={<Apple className="h-6 w-6 text-slate-900 dark:text-white" />} disabled={loading} />
            <SocialButton icon={<Facebook className="h-6 w-6 text-blue-600" />} disabled={loading} />
          </div>
        </div>

      </div>
    </div>
  );
}

function SocialButton({ icon, disabled }: { icon: React.ReactNode, disabled?: boolean }) {
  return (
    <button 
      disabled={disabled}
      className="h-16 w-16 rounded-[1.5rem] bg-white dark:bg-slate-900 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 hover:shadow-2xl transition-all duration-300 border border-white dark:border-slate-800 group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="group-hover:rotate-12 transition-transform duration-300">
        {icon}
      </div>
    </button>
  );
}
