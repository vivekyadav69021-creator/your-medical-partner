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
import { Sun, Moon, Laptop, Save, User as UserIcon, Loader2, LogOut, ShieldAlert, Camera } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfile } from '@/context/user-profile-context';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { updateProfile, signOut } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useFirebase } from '@/firebase';

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
  const { auth, storage, user } = useFirebase();
  const { userName, userImage, setUserName, setUserImage } = useUserProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
    image: '',
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
  
  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!user) {
          toast({ variant: 'destructive', title: "Access Denied", description: "Please sign in to upload photos." });
          return;
      }

      setIsUploading(true);
      try {
          const storageRef = ref(storage, `profile_pictures/${user.uid}_${Date.now()}`);
          const uploadTask = uploadBytesResumable(storageRef, file);

          uploadTask.on('state_changed', 
              null,
              (error) => {
                  console.error(error);
                  toast({ variant: 'destructive', title: "Upload Failed" });
                  setIsUploading(false);
              },
              async () => {
                  const url = await getDownloadURL(uploadTask.snapshot.ref);
                  setProfile(prev => ({ ...prev, image: url }));
                  setIsUploading(false);
                  toast({ title: "Photo Updated", description: "Image synced with cloud storage." });
              }
          );
      } catch (e) {
          setIsUploading(false);
          toast({ variant: 'destructive', title: "Error during upload" });
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
    setIsSaving(true);
    try {
      if (user) {
        await updateProfile(user, {
          displayName: profile.name,
          photoURL: profile.image
        });
      }

      localStorage.setItem(`userMedicalProfile_local`, JSON.stringify(profile));
      
      setUserName(profile.name || 'Guest');
      setUserImage(profile.image);
      
      toast({
        title: "Profile Synced!",
        description: "Your details have been updated across the application.",
      });
    } catch (e: any) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not sync your profile. Please check your connection.",
      });
    } finally {
        setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('userMedicalProfile_local');
        toast({ title: "Signed Out", description: "You have been logged out safely." });
    } catch (e: any) {
        toast({ variant: "destructive", title: "Logout Failed", description: e.message });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
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
          <CardTitle>Medical Profile</CardTitle>
          <CardDescription>
            Your information is used to personalize your health reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="flex flex-col md:flex-row items-center gap-8 border-b pb-8 border-slate-100 dark:border-slate-800">
                <div className="relative group">
                    <Avatar className="h-40 w-40 border-4 border-white dark:border-slate-800 shadow-xl">
                        <AvatarImage src={profile.image} alt={profile.name} className="object-cover" />
                        <AvatarFallback className="bg-slate-100 dark:bg-slate-800">
                            <UserIcon className="h-20 w-20 text-slate-400" />
                        </AvatarFallback>
                    </Avatar>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
                    >
                        {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
                </div>
                <div className="flex flex-col items-center md:items-start gap-3">
                    <div className="space-y-1 text-center md:text-left">
                      <h3 className="text-xl font-bold text-[#2D3A5D] dark:text-slate-100">{profile.name || 'Guest User'}</h3>
                      <p className="text-sm text-slate-400 font-medium">Cloud-synced medical identity</p>
                    </div>
                    <Badge variant="outline" className="rounded-full px-4 py-1 uppercase text-[9px] font-black tracking-widest border-primary/20 text-primary">
                        {user?.isAnonymous ? 'Guest Access' : 'Verified Partner'}
                    </Badge>
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
              {isSaving ? 'Saving...' : 'Sync & Save Profile'}
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
                < Sun className="mr-2 h-4 w-4" /> Light
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

      {/* Logout Section */}
      <Card className="border-red-100 dark:border-red-900/30 bg-red-50/10">
        <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Account Actions
            </CardTitle>
            <CardDescription>Manage your session and account security.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full md:w-auto rounded-full px-8 h-12 font-bold shadow-lg shadow-red-500/20"
            >
                <LogOut className="mr-2 h-5 w-5" /> Sign Out from Device
            </Button>
            <p className="mt-4 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black text-center md:text-left">
                Your data is synced with Firebase cloud.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}