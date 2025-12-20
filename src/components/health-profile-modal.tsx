
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function HealthProfileModal() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const shouldOpen = !isUserLoading && user && !isProfileLoading && (!userProfile || !userProfile.profileCompleted);
    setIsOpen(shouldOpen);
  }, [user, isUserLoading, userProfile, isProfileLoading]);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to save your profile.' });
      return;
    }
    if (!consent) {
      toast({ variant: 'destructive', title: 'Consent Required', description: 'You must agree to the terms to continue.' });
      return;
    }

    setIsSaving(true);
    const formData = new FormData(event.currentTarget);
    
    try {
      await setDoc(doc(firestore, 'users', user.uid), {
        name: formData.get('fullName'),
        age: Number(formData.get('age')),
        phone: formData.get('phone'),
        conditions: formData.get('conditions'),
        allergy: formData.get('allergy'),
        profileCompleted: true,
        createdAt: serverTimestamp(),
        email: user.email,
        id: user.uid
      }, { merge: true });

      toast({ title: 'Profile Saved!', description: "You're all set up." });
      setIsOpen(false);
      router.push('/dashboard');
    } catch (error) {
      console.error("Error saving medical info:", error);
      toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save your profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <form onSubmit={handleSave}>
          <DialogHeader>
            <DialogTitle>Complete Your Health Profile</DialogTitle>
            <DialogDescription>
              This information will help us personalize your experience.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">Full Name</Label>
              <Input id="fullName" name="fullName" className="col-span-3" defaultValue={user?.displayName ?? ''} required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">Age</Label>
              <Input id="age" name="age" type="number" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Mobile</Label>
              <Input id="phone" name="phone" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="conditions" className="text-right">Conditions</Label>
              <Input id="conditions" name="conditions" placeholder="e.g., Diabetes" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="allergy" className="text-right">Allergies</Label>
              <Input id="allergy" name="allergy" placeholder="e.g., Peanuts" className="col-span-3" />
            </div>
             <div className="flex items-center space-x-2 mt-4">
                <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(checked as boolean)} />
                <Label htmlFor="consent" className="text-sm text-muted-foreground">
                    I understand this app does not replace a doctor and my data is stored securely.
                </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSaving || !consent}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save & Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

