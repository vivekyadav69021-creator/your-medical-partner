'use client';

import { useUserProfile } from '@/context/user-profile-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { Sun, Moon, Laptop, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

export default function ProfilePage() {
  const { user } = useUser();
  const { userName, userImage } = useUserProfile();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleUpdateProfile = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would update the user's profile in Firebase Auth and/or Firestore.
    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved (simulation).',
    });
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
                <Input id="name" defaultValue={userName} />
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
        </form>
      </Card>

    </div>
  );
}
