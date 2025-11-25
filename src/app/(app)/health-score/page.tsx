'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { HeartPulse, Sparkles, Terminal, BookOpen, Utensils, Zap, Brain } from 'lucide-react';
import { createHealthPlanAction } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending ? (
          <>
            <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
            Generating Plan...
          </>
      ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generate My Health Plan
          </>
      )}
    </Button>
  );
}

export default function HealthPlannerPage() {
  const [state, formAction] = useActionState(createHealthPlanAction, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
        toast({
            variant: "destructive",
            title: "An Error Occurred",
            description: state.error,
        });
    }
  }, [state, toast]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Health Planner</h1>
        <p className="text-muted-foreground">
          Get a personalized 7-day wellness plan crafted by AI.
        </p>
      </div>
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Your Health Profile</CardTitle>
            <CardDescription>
              Provide your details to generate a personalized plan. The more details you provide, the better the plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" type="number" placeholder="e.g., 35" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender" required>
                      <SelectTrigger id="gender">
                          <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
             </div>
            <div className="space-y-2">
              <Label htmlFor="healthGoals">Primary Health Goal</Label>
              <Textarea
                id="healthGoals"
                name="healthGoals"
                placeholder="e.g., Lose weight, gain muscle, reduce stress, improve sleep..."
                rows={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dietaryPreferences">Dietary Preferences</Label>
              <Input
                id="dietaryPreferences"
                name="dietaryPreferences"
                placeholder="e.g., Vegetarian, low-carb, no dairy, prefer Indian food"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Weekly Activity Level</Label>
              <Select name="activityLevel" required>
                  <SelectTrigger id="activityLevel">
                      <SelectValue placeholder="Select Activity Level" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                      <SelectItem value="lightly_active">Lightly Active (1-2 days/week)</SelectItem>
                      <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                      <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                  </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
