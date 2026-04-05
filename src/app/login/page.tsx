
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
import { Loader2, ArrowLeft, HeartPulse, Chrome, Apple, Facebook } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md space-y-10 flex flex-col items-center relative z-10">
        
        {/* Title Section with Animation */}
        <div className="text-center space-y-3 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-2">
            <HeartPulse className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 font-headline leading-none">
            YOUR MEDICAL <br />
            <span className="text-primary">PARTNER</span>
          </h1>
        </div>

        {view === 'welcome' ? (
          <div className="w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Illustration Section */}
            <div className="relative w-full aspect-square max-w-[260px] mx-auto group">
              <div className="absolute inset-0 bg-blue-200/20 rounded-full scale-110 blur-xl group-hover:scale-125 transition-transform duration-500" />
              <Image 
                src="https://picsum.photos/seed/med-team/600/600" 
                alt="Medical Illustration" 
                fill
                className="object-contain relative z-10"
                data-ai-hint="medical doctor illustration"
              />
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-4 px-2">
              <Button 
                onClick={() => setView('signup')}
                className="w-full h-16 rounded-2xl text-lg font-bold bg-gradient-to-r from-[#4A90E2] to-[#357ABD] hover:shadow-xl hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-200 border-none transition-all duration-300"
              >
                Create Account
              </Button>
              <Button 
                onClick={() => setView('login')}
                variant="outline"
                className="w-full h-16 rounded-2xl text-lg font-bold bg-white border-white shadow-sm text-slate-800 hover:bg-slate-50 hover:shadow-md transition-all active:scale-95 duration-300"
              >
                Sign In
              </Button>
              
              <div className="text-center pt-2">
                <button 
                  onClick={handleGuestSignIn}
                  className="text-slate-400 font-bold text-sm hover:text-primary underline underline-offset-4 transition-colors"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Form View (Login or Signup) */
          <Card className="w-full rounded-[2.5rem] border-none shadow-2xl bg-white/90 backdrop-blur-md p-2 animate-in zoom-in-95 duration-500">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-slate-100 hover:bg-slate-200" 
                  onClick={() => setView('welcome')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h3 className="text-2xl font-black text-slate-900">
                  {view === 'login' ? 'Welcome Back' : 'Get Started'}
                </h3>
              </div>

              <form onSubmit={handleAuthAction} className="space-y-5">
                {view === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary text-lg"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@email.com" 
                    className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary text-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-14 rounded-2xl bg-slate-50 border-none focus-visible:ring-primary text-lg"
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
                  {loading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'Login Now' : 'Create My Account')}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Professional Social Login Bar */}
        <div className="w-full pt-4 flex flex-col items-center space-y-6 animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center w-full gap-4 px-4">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Or connect with</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>
          <div className="flex items-center gap-6">
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
    <div className="h-14 w-14 rounded-2xl bg-white shadow-md flex items-center justify-center cursor-pointer hover:scale-110 hover:shadow-lg transition-all duration-300 border border-slate-50">
      {icon}
    </div>
  );
}
