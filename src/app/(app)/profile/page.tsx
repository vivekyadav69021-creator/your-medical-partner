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
    try {
      const savedProfile = localStorage.getItem(`userMedicalProfile_local`);
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(prev => ({ ...prev, ...parsedProfile }));
      } else {
         setProfile(prev => ({...prev, name: userName, image: userImage}));
      }
      
      const remindersHidden = localStorage.getItem('hideProfileReminders') === 'true';
      setHideReminders(remindersHidden);

    } catch (e) {
      console.error("Failed to load profile from local storage", e);
    }
  }, [userName, userImage]);

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

  const handleSaveProfile = () => {
    setIsSaving(true);
    try {
      localStorage.setItem(`userMedicalProfile_local`, JSON.stringify(profile));
      
      setUserName(profile.name || 'Guest');
      setUserImage(profile.image);
      
      toast({
        title: "Profile Saved Locally",
        description: "Your information has been successfully updated on this device.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save your profile. Please try again.",
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
          <CardTitle>Local Medical Profile</CardTitle>
          <CardDescription>
            Your data is stored locally on this device.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {/* Enhanced Profile Image Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 border-b pb-8 border-slate-100 dark:border-slate-800">
                <Avatar className="h-40 w-40 border-4 border-white dark:border-slate-800 shadow-xl">
                    <AvatarImage src={profile.image} alt={profile.name} className="object-cover" data-ai-hint="person face" />
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-800">
                        <UserIcon className="h-20 w-20 text-slate-400" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="space-y-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-[#2D3A5D] dark:text-slate-100">{profile.name || 'Guest User'}</h3>
                      <p className="text-sm text-slate-400 font-medium">Click below to update your profile picture</p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => fileInputRef.current?.click()} className="rounded-full px-6 font-bold shadow-md">
                        Change Photo
                      </Button>
                      <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Square image recommended (400x400px)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</Label>
                    <Input id="name" value={profile.name} onChange={handleInputChange} placeholder="e.g., Rohan Kumar" className="h-12 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="age" className="text-xs font-bold uppercase tracking-wider text-slate-500">Age</Label>
                        <Input id="age" type="number" value={profile.age} onChange={handleInputChange} placeholder="e.g., 30" className="h-12 rounded-xl" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="gender" className="text-xs font-bold uppercase tracking-wider text-slate-500">Gender</Label>
                        <Select value={profile.gender} onValueChange={(v) => handleSelectChange('gender', v)}>
                            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl">
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
                        <Label htmlFor="weight" className="text-xs font-bold uppercase tracking-wider text-slate-500">Weight (kg)</Label>
                        <Input id="weight" type="number" value={profile.weight} onChange={handleInputChange} placeholder="e.g., 70" className="h-12 rounded-xl" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="height" className="text-xs font-bold uppercase tracking-wider text-slate-500">Height (cm)</Label>
                        <Input id="height" type="number" value={profile.height} onChange={handleInputChange} placeholder="e.g., 175" className="h-12 rounded-xl" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bloodGroup" className="text-xs font-bold uppercase tracking-wider text-slate-500">Blood Group</Label>
                        <Input id="bloodGroup" value={profile.bloodGroup} onChange={handleInputChange} placeholder="e.g., A+" className="h-12 rounded-xl" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="lifestyle" className="text-xs font-bold uppercase tracking-wider text-slate-500">Lifestyle</Label>
                        <Select value={profile.lifestyle} onValueChange={(v) => handleSelectChange('lifestyle', v)}>
                            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="sedentary">Sedentary</SelectItem>
                                <SelectItem value="lightly-active">Lightly Active</SelectItem>
                                <SelectItem value="moderately-active">Moderately Active</SelectItem>
                                <SelectItem value="very-active">Very Active</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dietaryPreference" className="text-xs font-bold uppercase tracking-wider text-slate-500">Dietary Preference</Label>
                        <Select value={profile.dietaryPreference} onValueChange={(v) => handleSelectChange('dietaryPreference', v)}>
                            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="veg">Vegetarian</SelectItem>
                                <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                                <SelectItem value="eggetarian">Eggetarian</SelectItem>
                                <SelectItem value="vegan">Vegan</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Health Goals</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-center rounded-xl border p-4 bg-slate-50/50 dark:bg-slate-800/30">
                        {healthGoals.map(goal => (
                            <div key={goal} className="flex items-center gap-2">
                                <Checkbox
                                    id={`goal-${goal.toLowerCase().replace(' ', '-')}`}
                                    checked={(profile.goals || []).includes(goal)}
                                    onCheckedChange={(checked) => handleGoalChange(goal, checked)}
                                />
                                <Label htmlFor={`goal-${goal.toLowerCase().replace(' ', '-')}`} className="text-xs font-medium">{goal}</Label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="conditions" className="text-xs font-bold uppercase tracking-wider text-slate-500">Chronic Conditions</Label>
                <Textarea id="conditions" value={profile.conditions} onChange={handleInputChange} placeholder="e.g., Diabetes, Hypertension, Asthma" className="rounded-xl resize-none" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="allergies" className="text-xs font-bold uppercase tracking-wider text-slate-500">Allergies</Label>
                <Textarea id="allergies" value={profile.allergies} onChange={handleInputChange} placeholder="e.g., Penicillin, Peanuts" className="rounded-xl resize-none" />
            </div>
        </CardContent>
         <CardFooter className="bg-slate-50/50 dark:bg-slate-800/20 p-6">
            <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full md:w-auto rounded-full px-10 h-12 font-bold shadow-lg shadow-primary/20">
              {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              {isSaving ? 'Saving...' : 'Save Profile Locally'}
            </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance & Preferences</CardTitle>
          <CardDescription>
            Customize your app experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Theme Mode</h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="rounded-full h-11 px-6 font-bold"
              >
                <Sun className="mr-2 h-4 w-4" /> Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="rounded-full h-11 px-6 font-bold"
              >
                <Moon className="mr-2 h-4 w-4" /> Dark
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                className="rounded-full h-11 px-6 font-bold"
              >
                <Laptop className="mr-2 h-4 w-4" /> System
              </Button>
            </div>
          </div>
           <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Notifications</h3>
             <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div className="space-y-0.5">
                    <Label htmlFor="reminders-switch" className="text-sm font-bold">Profile Reminders</Label>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Show completion alerts on dashboard</p>
                </div>
                <Switch id="reminders-switch" checked={!hideReminders} onCheckedChange={handleReminderChange} />
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}