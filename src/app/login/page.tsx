
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, signupAction } from './actions';
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

const initialLoginState = {
  error: null,
  success: false,
};

function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {children}
        </Button>
    )
}

export default function LoginPage() {
    const { toast } = useToast();
    const router = useRouter();

    const [loginState, loginFormAction, isLoginPending] = useActionState(loginAction, initialLoginState);
    const [signupState, signupFormAction, isSignupPending] = useActionState(signupAction, initialLoginState);

    useEffect(() => {
        if(loginState.error) {
            toast({ variant: 'destructive', title: 'Login Failed', description: loginState.error });
        }
        if(loginState.success) {
            toast({ title: 'Login Successful', description: 'Welcome back!' });
            router.push('/dashboard');
        }
    }, [loginState, toast, router]);

    useEffect(() => {
        if(signupState.error) {
            toast({ variant: 'destructive', title: 'Signup Failed', description: signupState.error });
        }
        if(signupState.success) {
            toast({ title: 'Signup Successful', description: 'Welcome! Please complete your profile.' });
            // The modal will handle the redirect after profile completion
        }
    }, [signupState, toast, router]);


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
                    <form action={loginFormAction}>
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
                            <SubmitButton>Sign In</SubmitButton>
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
                    <form action={signupFormAction}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input id="signup-email" name="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input id="signup-password" name="password" type="password" required />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <SubmitButton>Sign Up</SubmitButton>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}

