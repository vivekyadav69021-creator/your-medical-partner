'use client';

import { useFormState } from 'react-dom';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Terminal } from 'lucide-react';
import { aiSymptomCheckAction } from './actions';

const initialState = {
  possibleCauses: null,
  error: null,
};

function SubmitButton() {
  // This component will be used to show a pending state in the future
  return (
    <Button type="submit" className="w-full">
      <Sparkles className="mr-2 h-4 w-4" />
      Check Symptoms
    </Button>
  );
}

export default function SymptomCheckerPage() {
  const [state, formAction] = useFormState(aiSymptomCheckAction, initialState);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Symptom Checker</h1>
        <p className="text-muted-foreground">
          Describe your symptoms and our AI will suggest possible causes. This is not a substitute for professional medical advice.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <form action={formAction}>
            <CardHeader>
              <CardTitle>Describe Your Symptoms</CardTitle>
              <CardDescription>
                Provide as much detail as possible for a more accurate analysis.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  name="symptoms"
                  placeholder="e.g., 'I have a persistent cough, a slight fever, and a headache.'"
                  rows={6}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
                <Textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  placeholder="e.g., 'Diagnosed with asthma, allergic to penicillin.'"
                  rows={4}
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
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>
              Possible causes based on the information you provided.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            {/* We will add a pending state here later */}
            {!state.possibleCauses && !state.error && (
              <div className="text-center text-muted-foreground">
                <Bot className="mx-auto h-12 w-12" />
                <p>Your results will appear here.</p>
              </div>
            )}
            {state.possibleCauses && (
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Possible Causes</AlertTitle>
                <AlertDescription>
                  <p className="whitespace-pre-wrap">{state.possibleCauses}</p>
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
