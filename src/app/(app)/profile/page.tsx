
'use client';

import { useState, useEffect } from 'react';
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
import { Sun, Moon, Laptop, Save } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';

type UserProfile = {
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  bloodGroup: string;
  conditions: string;
  allergies: string;
};

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    gender: 'not-specified',
    weight: '',
    height: '',
    bloodGroup: '',
    conditions: '',
    allergies: '',
  });

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userMedicalProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.error("Failed to load profile from local storage", e);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('userMedicalProfile', JSON.stringify(profile));
      toast({
        title: "Profile Saved",
        description: "Your medical information has been saved locally on this device.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save your profile. Your browser storage might be full or disabled.",
      });
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
            <Button onClick={handleSaveProfile}>
                <Save className="mr-2 h-4 w-4" />
                Save Profile
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
