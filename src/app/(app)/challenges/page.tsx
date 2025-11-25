'use client';

import { useActionState, useRef, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';
import { Check, Trophy, Star, Sparkles, Zap, Activity, Smile, Bot, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateChallengeAction } from './actions';
import type { GenerateChallengeOutput } from '@/ai/flows/challenge-generator-flow';

const challenges = [
  {
    id: 'challenge-1',
    title: '7-Day Walking Challenge',
    description: 'Walk at least 8,000 steps every day for a week.',
    reward: '250 Points & a Virtual Badge',
    progress: 4,
    total: 7,
    status: 'active',
  },
  {
    id: 'challenge-2',
    title: 'Mindful Month',
    description: 'Meditate for 10 minutes daily for 30 days.',
    reward: '500 Points & Mindfulness Master Badge',
    progress: 0,
    total: 30,
    status: 'new',
  },
    {
    id: 'challenge-3',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water daily for 2 weeks.',
    reward: '200 Points',
    progress: 14,
    total: 14,
    status: 'completed',
  },
];

const activityData = [
  { day: 'Mon', minutes: 30 },
  { day: 'Tue', minutes: 45 },
  { day: 'Wed', minutes: 60 },
  { day: 'Thu', minutes: 20 },
  { day: 'Fri', minutes: 50 },
  { day: 'Sat', minutes: 90 },
  { day: 'Sun', minutes: 75 },
];

const moodData = [
  { day: 'Mon', mood: 4 },
  { day: 'Tue', mood: 3 },
  { day: 'Wed', mood: 5 },
  { day: 'Thu', mood: 4 },
  { day: 'Fri', mood: 5 },
  { day: 'Sat', mood: 4 },
  { day: 'Sun', mood: 3 },
];

const initialState = {
  challenge: null,
  error: null,
};

function GenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate My Challenge
        </>
      )}
    </Button>
  );
}

function AIChallengeGenerator() {
  const [state, formAction] = useActionState(generateChallengeAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormAction = (formData: FormData) => {
    formAction(formData);
  };
  
  const generatedChallenge: GenerateChallengeOutput | null = state.challenge;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <form ref={formRef} action={handleFormAction}>
          <CardHeader>
            <CardTitle>Tell AI Sensi About Your Routine</CardTitle>
            <CardDescription>
              Describe your daily activities, diet, and health goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="routine-description">Your Daily Routine & Goals</Label>
              <Textarea
                id="routine-description"
                name="routine-description"
                placeholder="e.g., 'I work a desk job, 9-to-5. I want to have more energy in the afternoons. I usually eat sandwiches for lunch and order takeout for dinner. I want to start exercising but don't have much time.'"
                rows={8}
                required
              />
            </div>
             {state.error && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Generation Failed</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
          </CardContent>
          <CardFooter>
            <GenerateButton />
          </CardFooter>
        </form>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Your Personalized Challenge</CardTitle>
          <CardDescription>
            AI Sensi will generate a custom challenge for you here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center gap-4">
          {generatedChallenge ? (
            <div className="w-full">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-6 h-6 text-yellow-500" />
                    {generatedChallenge.title}
                  </CardTitle>
                  <CardDescription>{generatedChallenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">Progress</p>
                      <p className="text-sm text-muted-foreground">0 / 5 days</p>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Tasks:</h4>
                    {generatedChallenge.tasks.map((task, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                        <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center border-primary`} />
                        <p className="text-sm"><b>Day {task.day}:</b> {task.task}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <Star className="w-5 h-5" />
                    <p>Reward: {generatedChallenge.reward}</p>
                  </div>
                  <Button className="w-full">Start this AI Challenge</Button>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
                <Bot className="mx-auto h-12 w-12"/>
                <p className="mt-4">Your AI-generated challenge will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


export default function ChallengesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Health Challenges
          </h1>
          <p className="text-muted-foreground">
            Join challenges, create your own with AI, and track your progress.
          </p>
        </div>
      </div>

      <Tabs defaultValue="ai-sensi">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="community">Community Challenges</TabsTrigger>
          <TabsTrigger value="ai-sensi"><Sparkles className="mr-2 h-4 w-4"/>AI Sensi</TabsTrigger>
          <TabsTrigger value="analysis">Health Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="community" className="mt-6">
          <div className="space-y-6">
            {challenges.map(challenge => (
              <Card key={challenge.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      {challenge.title}
                    </CardTitle>
                    {challenge.status === 'active' && <Badge>Active</Badge>}
                    {challenge.status === 'new' && <Badge variant="secondary">New</Badge>}
                    {challenge.status === 'completed' && <Badge variant="outline">Completed</Badge>}
                  </div>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {challenge.status === 'active' && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">Progress</p>
                        <p className="text-sm text-muted-foreground">{challenge.progress} / {challenge.total} days</p>
                      </div>
                      <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-primary">
                    <Star className="w-5 h-5"/>
                    <p className="font-semibold">{challenge.reward}</p>
                  </div>

                </CardContent>
                <CardFooter>
                    {challenge.status === 'new' && <Button>Join Challenge</Button>}
                    {challenge.status === 'active' && <Button variant="outline">View Details</Button>}
                    {challenge.status === 'completed' && <Button variant="ghost" disabled>Challenge Completed</Button>}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ai-sensi" className="mt-6">
           <AIChallengeGenerator />
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Weekly Activity
                </CardTitle>
                <CardDescription>
                  Your total active minutes over the last 7 days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <XAxis
                        dataKey="day"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                      />
                      <Bar
                        dataKey="minutes"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smile className="w-5 h-5" />
                  Mood Tracker
                </CardTitle>
                <CardDescription>
                  Your mood ratings (1-5) over the last 7 days.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodData}>
                       <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis domain={[1, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="mood" stroke="hsl(var(--accent))" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
