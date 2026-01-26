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
import { Sun, Moon, Laptop, Save, User as UserIcon, Loader2, BellOff, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfile } from '@/context/user-profile-context';
import { useUser } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

const healthGoals = ["Weight Loss", "Muscle Gain", "Improve Fitness", "Boost Immunity", "Manage Stress"];

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
  lifestyle: string;
  dietaryPreference: string;
  goals: string[];
};

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { user } = useUser();
  const { userName, userImage, setUserName, setUserImage } = useUserProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [hideReminders, setHideReminders] = useState(false);

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
    lifestyle: 'sedentary',
    dietaryPreference: 'non-veg',
    goals: [],
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    try {
      const savedProfile = localStorage.getItem(`userMedicalProfile_${user.uid}`);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(prev => ({ ...prev, ...parsedProfile }));
        setUserName(parsedProfile.name || user.displayName || 'Guest');
        setUserImage(parsedProfile.image || user.photoURL || 'https://picsum.photos/seed/user/100/100');
      } else {
         setProfile(prev => ({...prev, name: user.displayName || '', image: user.photoURL || 'https://picsum.photos/seed/user/100/100'}));
      }
      
      const remindersHidden = localStorage.getItem('hideProfileReminders') === 'true';
      setHideReminders(remindersHidden);

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
  
  const handleGoalChange = (goal: string, checked: boolean | 'indeterminate') => {
      setProfile(prev => {
          const newGoals = checked
              ? [...(prev.goals || []), goal]
              : (prev.goals || []).filter(g => g !== goal);
          return { ...prev, goals: newGoals };
      });
  };

  const handleReminderChange = (checked: boolean) => {
    const shouldHide = !checked;
    setHideReminders(shouldHide);
    localStorage.setItem('hideProfileReminders', String(shouldHide));
    toast({
        title: "Settings Updated",
        description: `Profile completion reminders are now ${shouldHide ? 'hidden' : 'shown'}.`
    });
  };

  const handleSaveProfile = async () => {
    if (!user) {
        toast({ variant: "destructive", title: "Not Authenticated", description: "You must be logged in to save your profile." });
        return;
    }
    setIsSaving(true);
    try {
      if (user.displayName !== profile.name || user.photoURL !== profile.image) {
          await updateProfile(user, { displayName: profile.name, photoURL: profile.image });
      }

      localStorage.setItem(`userMedicalProfile_${user.uid}`, JSON.stringify(profile));
      
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
            Your data is encrypted and remains under your control, stored locally on your device.
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="lifestyle">Lifestyle</Label>
                        <Select value={profile.lifestyle} onValueChange={(v) => handleSelectChange('lifestyle', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                                <SelectItem value="lightly-active">Lightly Active (light exercise/sports 1-3 days/week)</SelectItem>
                                <SelectItem value="moderately-active">Moderately Active (moderate exercise/sports 3-5 days/week)</SelectItem>
                                <SelectItem value="very-active">Very Active (hard exercise/sports 6-7 days a week)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dietaryPreference">Dietary Preference</Label>
                        <Select value={profile.dietaryPreference} onValueChange={(v) => handleSelectChange('dietaryPreference', v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="veg">Vegetarian</SelectItem>
                                <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                                <SelectItem value="eggetarian">Eggetarian</SelectItem>
                                <SelectItem value="vegan">Vegan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label>Health Goals</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-center rounded-md border p-4">
                        {healthGoals.map(goal => (
                            <div key={goal} className="flex items-center gap-2">
                                <Checkbox
                                    id={`goal-${goal.toLowerCase().replace(' ', '-')}`}
                                    checked={(profile.goals || []).includes(goal)}
                                    onCheckedChange={(checked) => handleGoalChange(goal, checked)}
                                />
                                <Label htmlFor={`goal-${goal.toLowerCase().replace(' ', '-')}`}>{goal}</Label>
                            </div>
                        ))}
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
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Customize the look and feel and notification preferences.
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
           <div className="space-y-2">
            <h3 className="font-semibold">Notifications</h3>
             <div className="flex items-center space-x-2 p-4 border rounded-md">
                <Switch id="reminders-switch" checked={!hideReminders} onCheckedChange={handleReminderChange} />
                <Label htmlFor="reminders-switch">Show profile completion reminders on dashboard</Label>
             </div>
             <p className="text-xs text-muted-foreground">
                Prefer not to share? No problem. You can disable profile reminders here anytime.
             </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
