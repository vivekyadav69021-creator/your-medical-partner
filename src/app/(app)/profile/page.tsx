
'use client';

import { useUserProfile } from '@/context/user-profile-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, User, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useState } from 'react';

export default function ProfilePage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { userName, userImage, setUserName } = useUserProfile();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();
  
  const [currentName, setCurrentName] = useState(userName);

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.'});
      return;
    }

    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, { name: currentName });
      
      // Also update context
      setUserName(currentName);
      
      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved.',
      });
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update profile.'});
    }
  };
  
  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.'});
    router.push('/login');
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          View and manage your personal settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userImage} alt={userName} data-ai-hint="person face" />
              <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{userName}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={currentName} onChange={(e) => setCurrentName(e.target.value)} />
              </div>

               <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex flex-wrap gap-2">
                    <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')} type="button">
                        <Sun className="mr-2"/> Light
                    </Button>
                    <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')} type="button">
                        <Moon className="mr-2"/> Dark
                    </Button>
                    <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')} type="button">
                        <Laptop className="mr-2"/> System
                    </Button>
                </div>
              </div>
          </CardContent>
           <CardFooter className="flex justify-between">
              <Button type="submit">Save Changes</Button>
               <Button variant="destructive" onClick={handleLogout} type="button">
                <LogOut className="mr-2"/>
                Logout
              </Button>
           </CardFooter>
        </form>
      </Card>

    </div>
  );
}
