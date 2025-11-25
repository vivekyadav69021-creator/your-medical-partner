'use client';

import { useActionState } from 'react';
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
import { Separator } from '@/components/ui/separator';

const initialState = {
  plan: null,
  error: null,
};

function SubmitButton() {
  return (
    <Button type="submit" className="w-full" size="lg">
      <Sparkles className="mr-2 h-5 w-5" />
      Generate My Health Plan
    </Button>
  );
}

export default function HealthPlannerPage() {
  const [state, formAction] = useActionState(createHealthPlanAction, initialState);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Health Planner</h1>
        <p className="text-muted-foreground">
          Get a personalized 7-day wellness plan crafted by AI.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <form action={formAction}>
            <CardHeader>
              <CardTitle>Your Health Profile</CardTitle>
              <CardDescription>
                Provide your details to generate a personalized plan.
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
                  placeholder="e.g., Vegetarian, low-carb, no dairy"
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

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Your AI-Generated Plan</CardTitle>
            <CardDescription>
              Your 7-day personalized wellness plan will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center gap-4">
            {!state.plan && !state.error && (
              <div className="text-center text-muted-foreground p-8">
                <BookOpen className="mx-auto h-12 w-12" />
                <p className="mt-4">Fill out your profile to create your plan!</p>
              </div>
            )}
            
            {state.plan && (
                <div className="w-full space-y-4">
                    <Alert>
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle>{state.plan.planTitle}</AlertTitle>
                        <AlertDescription>
                          {state.plan.summary}
                        </AlertDescription>
                    </Alert>
                    <div className="space-y-3">
                    {state.plan.daily_plans.map((dayPlan: any) => (
                        <Card key={dayPlan.day} className="bg-secondary/50">
                            <CardHeader className="p-3">
                                <CardTitle className="text-base">{dayPlan.day}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-3 pt-0 space-y-2 text-sm">
                                <div className="flex items-start gap-2"><Utensils className="w-4 h-4 mt-0.5 text-primary"/><span><strong>Diet:</strong> {dayPlan.diet}</span></div>
                                <div className="flex items-start gap-2"><Zap className="w-4 h-4 mt-0.5 text-primary"/><span><strong>Exercise:</strong> {dayPlan.exercise}</span></div>
                                <div className="flex items-start gap-2"><Brain className="w-4 h-4 mt-0.5 text-primary"/><span><strong>Wellness:</strong> {dayPlan.wellness_tip}</span></div>
                            </CardContent>
                        </Card>
                    ))}
                    </div>
                </div>
            )}

             {state.error && (
              <Alert variant="destructive" className="h-full">
                <Terminal className="h-4 w-4" />
                <AlertTitle>An Error Occurred</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
