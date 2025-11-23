'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/context/user-profile-context';
import { useToast } from '@/hooks/use-toast';
import { ChangeEvent, useState } from 'react';

export default function ProfilePage() {
  const { userName, userImage, setUserName, setUserImage } = useUserProfile();
  const [currentName, setCurrentName] = useState(userName);
  const [currentImage, setCurrentImage] = useState(userImage);
  const { toast } = useToast();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    setUserName(currentName);
    setUserImage(currentImage);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and personal information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your public profile here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentImage} alt="@user" data-ai-hint="person face" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Label htmlFor="picture">Profile Picture</Label>
              <Input id="picture" type="file" onChange={handleImageChange} accept="image/*" />
              <p className="text-sm text-muted-foreground">Upload a new photo for your profile.</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={currentName} onChange={(e) => setCurrentName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue="user@example.com" disabled />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
