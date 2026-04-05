
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
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
import { Loader2, ArrowLeft } from 'lucide-react';
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
  
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#F8FBFF] to-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-12 flex flex-col items-center">
        
        {/* Title Section */}
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 font-headline uppercase leading-tight">
            YOUR MEDICAL <br /> PARTNER
          </h1>
        </div>

        {view === 'welcome' ? (
          <>
            {/* Illustration Section */}
            <div className="relative w-full aspect-square max-w-[280px]">
              <Image 
                src="https://picsum.photos/seed/medical-team/600/600" 
                alt="Medical Partner Illustration" 
                fill
                className="object-contain"
                data-ai-hint="medical characters illustration"
              />
            </div>

            {/* Welcome Text */}
            <div className="text-left w-full space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Welcome</h2>
              <p className="text-slate-500 text-sm font-medium">Sign in or create to account to get started.</p>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-4">
              <Button 
                onClick={() => setView('signup')}
                className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-[#4A90E2] to-[#9D50BB] hover:opacity-90 shadow-lg shadow-blue-200 border-none transition-all active:scale-95"
              >
                Sign Up
              </Button>
              <Button 
                onClick={() => setView('login')}
                variant="outline"
                className="w-full h-14 rounded-xl text-lg font-bold bg-white border-slate-200 text-slate-800 hover:bg-slate-50 transition-all active:scale-95"
              >
                Log In
              </Button>
              
              <div className="text-center pt-2">
                <button 
                  onClick={handleGuestSignIn}
                  className="text-primary font-bold text-sm underline underline-offset-4 hover:text-primary/80 transition-colors"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Form View (Login or Signup) */
          <Card className="w-full rounded-[2.5rem] border-none shadow-2xl bg-white p-2 animate-in zoom-in-95 duration-300">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-slate-50" 
                  onClick={() => setView('welcome')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h3 className="text-2xl font-black text-slate-900">
                  {view === 'login' ? 'Login' : 'Create Account'}
                </h3>
              </div>

              <form onSubmit={handleAuthAction} className="space-y-4">
                {view === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name" 
                      className="h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-primary"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="h-12 rounded-xl bg-slate-50 border-none focus-visible:ring-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className={cn(
                    "w-full h-14 rounded-xl text-lg font-bold mt-4 shadow-lg active:scale-95 transition-all",
                    view === 'signup' ? "bg-gradient-to-r from-[#4A90E2] to-[#9D50BB]" : "bg-primary"
                  )}
                >
                  {loading ? <Loader2 className="animate-spin" /> : (view === 'login' ? 'Log In' : 'Sign Up')}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Social Login Icons - Always at the bottom */}
        <div className="w-full pt-8 flex flex-col items-center space-y-6">
          <div className="flex items-center gap-6">
            <SocialIcon src="https://storage.googleapis.com/studiopaas-test-assets/project-assets/google-icon.png" alt="Google" />
            <SocialIcon src="https://storage.googleapis.com/studiopaas-test-assets/project-assets/apple-icon.png" alt="Apple" />
            <SocialIcon src="https://storage.googleapis.com/studiopaas-test-assets/project-assets/fb-icon.png" alt="Facebook" />
          </div>
        </div>

      </div>
    </div>
  );
}

function SocialIcon({ src, alt }: { src: string, alt: string }) {
  return (
    <div className="h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform border border-slate-50">
      <Image src={src} alt={alt} width={24} height={24} />
    </div>
  );
}
