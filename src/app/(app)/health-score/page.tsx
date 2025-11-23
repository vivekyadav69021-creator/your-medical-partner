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
import { HeartPulse, Sparkles, Terminal } from 'lucide-react';
import { calculateHealthScoreAction } from './actions';
import { HealthScoreDisplay } from '@/components/health-score-display';

const initialState = {
  healthScore: null,
  insights: null,
  error: null,
};

function SubmitButton() {
  return (
    <Button type="submit" className="w-full">
      <Sparkles className="mr-2 h-4 w-4" />
      Calculate My Health Score
    </Button>
  );
}

export default function HealthScorePage() {
  const [state, formAction] = useActionState(calculateHealthScoreAction, initialState);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Personalized Health Score</h1>
        <p className="text-muted-foreground">
          Fill in your details to get an AI-generated health score and insights.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <form action={formAction}>
            <CardHeader>
              <CardTitle>Your Health Profile</CardTitle>
              <CardDescription>
                The more information you provide, the more accurate your score will be.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="personalInformation">Personal Information</Label>
                <Textarea
                  id="personalInformation"
                  name="personalInformation"
                  placeholder="e.g., 35-year-old male, non-smoker, exercises 3 times a week."
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnoses">Diagnoses</Label>
                <Input
                  id="diagnoses"
                  name="diagnoses"
                  placeholder="e.g., Hypertension, Type 2 Diabetes"
                  required
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="prescriptions">Prescriptions</Label>
                <Input
                  id="prescriptions"
                  name="prescriptions"
                  placeholder="e.g., Metformin, Lisinopril"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fitnessTrackerData">Fitness Tracker Data</Label>
                <Textarea
                  id="fitnessTrackerData"
                  name="fitnessTrackerData"
                  placeholder="e.g., Avg 8000 steps/day, 7 hours sleep, resting heart rate 65bpm."
                  rows={3}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Your Health Score & Insights</CardTitle>
            <CardDescription>
              An estimation of your general health based on your data.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center gap-4">
            {!state.healthScore && !state.error && (
              <div className="text-center text-muted-foreground">
                <HeartPulse className="mx-auto h-12 w-12" />
                <p>Your score and insights will appear here.</p>
              </div>
            )}
            {state.healthScore && <HealthScoreDisplay score={state.healthScore} />}
            {state.insights && (
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>AI Insights</AlertTitle>
                <AlertDescription>
                  <p className="whitespace-pre-wrap">{state.insights}</p>
                </AlertDescription>
              </Alert>
            )}
             {state.error && (
              <Alert variant="destructive">
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
