
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HeartPulse, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useFirebase } from '@/firebase';

function SubmitButton({ isPending, children }: { isPending: boolean; children: React.ReactNode }) {
    return (
        <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {children}
        </Button>
    )
}

export default function LoginPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { firebaseApp } = useFirebase();
    const auth = getAuth(firebaseApp);

    const [isLoginPending, setIsLoginPending] = useState(false);
    const [isSignupPending, setIsSignupPending] = useState(false);

    const handleAuth = async (
      e: React.FormEvent<HTMLFormElement>,
      authFn: typeof createUserWithEmailAndPassword | typeof signInWithEmailAndPassword,
      setPending: React.Dispatch<React.SetStateAction<boolean>>,
      isSignup: boolean
    ) => {
        e.preventDefault();
        setPending(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const userCredential = await authFn(auth, email, password);
            
            const idToken = await userCredential.user.getIdToken();

            await fetch('/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ idToken }),
            });

            toast({ title: isSignup ? 'Signup Successful' : 'Login Successful', description: isSignup ? 'Welcome!' : 'Welcome back!' });
            router.push('/dashboard');
        } catch (error: any) {
            let errorMessage = 'An unknown error occurred.';
            if (error.code) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already in use.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                    case 'auth/wrong-password':
                    case 'auth/user-not-found':
                    case 'auth/invalid-credential':
                        errorMessage = 'Invalid email or password.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many attempts. Please try again later.';
                        break;
                    default:
                        errorMessage = error.message;
                        break;
                }
            }
            toast({ variant: 'destructive', title: isSignup ? 'Signup Failed' : 'Login Failed', description: errorMessage });
        } finally {
            setPending(false);
        }
    };


  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary/50">
        <Tabs defaultValue="login" className="w-full max-w-md">
            <div className="flex justify-center mb-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="login">
                <Card>
                    <CardHeader className="text-center">
                        <HeartPulse className="mx-auto h-10 w-10 text-primary mb-2"/>
                        <CardTitle>Welcome Back</CardTitle>
                        <CardDescription>Sign in to access your health dashboard.</CardDescription>
                    </CardHeader>
                    <form onSubmit={(e) => handleAuth(e, signInWithEmailAndPassword, setIsLoginPending, false)}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input id="login-email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input id="login-password" name="password" type="password" required />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <SubmitButton isPending={isLoginPending}>Sign In</SubmitButton>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
            <TabsContent value="signup">
                 <Card>
                    <CardHeader className="text-center">
                        <HeartPulse className="mx-auto h-10 w-10 text-primary mb-2"/>
                        <CardTitle>Create an Account</CardTitle>
                        <CardDescription>Join Your Medical Partner today.</CardDescription>
                    </CardHeader>
                    <form onSubmit={(e) => handleAuth(e, createUserWithEmailAndPassword, setIsSignupPending, true)}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input id="signup-email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input id="signup-password" name="password" type="password" required minLength={6} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <SubmitButton isPending={isSignupPending}>Sign Up</SubmitButton>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
