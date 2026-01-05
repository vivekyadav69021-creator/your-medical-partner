
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Moon, Laptop, Save, User as UserIcon, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfile } from '@/context/user-profile-context';
import { useUser, useAuth } from '@/firebase';
import { updateProfile } from 'firebase/auth';

type UserProfileData = {
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  bloodGroup: string;
  conditions: string;
  allergies: string;
  image: string;
};

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { user } = useUser();
  const auth = useAuth();
  const { userName, userImage, setUserName, setUserImage } = useUserProfile();
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState<UserProfileData>({
    name: '',
    age: '',
    gender: 'not-specified',
    weight: '',
    height: '',
    bloodGroup: '',
    conditions: '',
    allergies: '',
    image: 'https://picsum.photos/seed/user/100/100',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    try {
      const savedProfile = localStorage.getItem(`userMedicalProfile_${user.uid}`);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setUserName(parsedProfile.name || user.displayName || 'Guest');
        setUserImage(parsedProfile.image || user.photoURL || 'https://picsum.photos/seed/user/100/100');
      } else {
         setProfile(prev => ({...prev, name: user.displayName || '', image: user.photoURL || 'https://picsum.photos/seed/user/100/100'}));
      }
    } catch (e) {
      console.error("Failed to load profile from local storage", e);
    }
  }, [user, setUserName, setUserImage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof UserProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [id]: value }));
  };
  
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              const result = e.target?.result as string;
              setProfile(prev => ({ ...prev, image: result }));
          }
          reader.readAsDataURL(file);
      }
  };

  const handleSaveProfile = async () => {
    if (!user) {
        toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to save your profile." });
        return;
    }
    setIsSaving(true);
    try {
      // Update Firebase Auth profile if name changed
      if (user.displayName !== profile.name) {
          await updateProfile(user, { displayName: profile.name });
      }
      
      // We don't save the image to Firebase Auth `photoURL` as it requires storage.
      // We'll keep it in local storage.

      localStorage.setItem(`userMedicalProfile_${user.uid}`, JSON.stringify(profile));
      
      // Update context
      setUserName(profile.name || 'Guest');
      setUserImage(profile.image);
      
      toast({
        title: "Profile Saved",
        description: "Your information has been successfully updated.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: e.message || "Could not save your profile. Please try again.",
      });
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Profile & Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your personal details and application settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Medical Profile</CardTitle>
          <CardDescription>
            This information is stored locally on your device and is not shared.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={userImage} alt={userName} data-ai-hint="person face" />
                    <AvatarFallback>
                        <UserIcon className="h-12 w-12" />
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <Button onClick={() => fileInputRef.current?.click()}>Change Photo</Button>
                    <Input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
                    <p className="text-xs text-muted-foreground">Recommended: Square image (e.g., 400x400px)</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={profile.name} onChange={handleInputChange} placeholder="e.g., Rohan Kumar" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" value={profile.age} onChange={handleInputChange} placeholder="e.g., 30" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={profile.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="not-specified">Prefer not to say</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="grid grid-cols-3 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input id="weight" type="number" value={profile.weight} onChange={handleInputChange} placeholder="e.g., 70" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input id="height" type="number" value={profile.height} onChange={handleInputChange} placeholder="e.g., 175" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Input id="bloodGroup" value={profile.bloodGroup} onChange={handleInputChange} placeholder="e.g., A+" />
                    </div>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="conditions">Chronic Conditions</Label>
                <Textarea id="conditions" value={profile.conditions} onChange={handleInputChange} placeholder="e.g., Diabetes, Hypertension, Asthma" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea id="allergies" value={profile.allergies} onChange={handleInputChange} placeholder="e.g., Penicillin, Peanuts" />
            </div>
        </CardContent>
         <CardFooter>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the look and feel of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Theme</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                type="button"
              >
                <Sun className="mr-2" /> Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                type="button"
              >
                <Moon className="mr-2" /> Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                type="button"
              >
                <Laptop className="mr-2" /> System
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
