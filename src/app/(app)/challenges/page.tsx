'use client';

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
import { Check, Trophy, Star, Sparkles, Bot, Zap, Activity, Smile } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip, Legend } from 'recharts';


const challenges = [
  {
    id: 'challenge-1',
    title: '7-Day Walking Challenge',
    description: 'Walk at least 8,000 steps every day for a week.',
    reward: '250 Points & a Virtual Badge',
    progress: 4,
    total: 7,
    status: 'active',
    tasks: [
      { name: 'Day 1: 8,000 steps', completed: true },
      { name: 'Day 2: 8,000 steps', completed: true },
      { name: 'Day 3: 8,000 steps', completed: true },
      { name: 'Day 4: 8,000 steps', completed: true },
      { name: 'Day 5: 8,000 steps', completed: false },
      { name: 'Day 6: 8,000 steps', completed: false },
      { name: 'Day 7: 8,000 steps', completed: false },
    ],
  },
  {
    id: 'challenge-2',
    title: 'Mindful Month',
    description: 'Meditate for 10 minutes daily for 30 days.',
    reward: '500 Points & Mindfulness Master Badge',
    progress: 0,
    total: 30,
    status: 'new',
    tasks: [],
  },
    {
    id: 'challenge-3',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water daily for 2 weeks.',
    reward: '200 Points',
    progress: 10,
    total: 14,
    status: 'completed',
    tasks: [],
  },
];

const generatedChallenge = {
    title: 'AI-Generated Wellness Plan',
    description: 'A 5-day plan to boost your energy and focus, created by AI Sensi.',
    reward: '300 Points & a "Sensi Starter" Badge',
    tasks: [
        { name: 'Day 1: 15-min morning stretch & hydration focus', completed: false },
        { name: 'Day 2: Mindful eating exercise & 20-min walk', completed: false },
        { name: 'Day 3: Digital detox for 1 hour before bed', completed: false },
        { name: 'Day 4: Try a new healthy recipe', completed: false },
        { name: 'Day 5: Reflect on your week & plan for the next', completed: false },
    ],
    progress: 0,
    total: 5,
};

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

      <Tabs defaultValue="community">
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
                  {challenge.status === 'active' && challenge.tasks.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium">Today's Tasks:</h4>
                        {challenge.tasks.filter(t => !t.completed).slice(0,2).map((task, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                                <div className="w-5 h-5 border-2 border-primary rounded-full" />
                                <p className="text-sm">{task.name}</p>
                            </div>
                        ))}
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
           <div className="grid gap-8 md:grid-cols-2">
                <Card>
                  <form>
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
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate My Challenge
                        </Button>
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
                    <div className="w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-6 h-6 text-yellow-500"/>
                                    {generatedChallenge.title}
                                </CardTitle>
                                <CardDescription>{generatedChallenge.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-medium">Progress</p>
                                        <p className="text-sm text-muted-foreground">{generatedChallenge.progress} / {generatedChallenge.total} days</p>
                                    </div>
                                    <Progress value={(generatedChallenge.progress / generatedChallenge.total) * 100} className="h-2" />
                                </div>

                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Tasks:</h4>
                                    {generatedChallenge.tasks.map((task, index) => (
                                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                                            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${task.completed ? 'border-primary bg-primary' : 'border-primary'}`}>
                                                {task.completed && <Check className="w-3 h-3 text-primary-foreground"/>}
                                            </div>
                                            <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col items-start gap-4">
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <Sparkles className="w-5 h-5"/>
                                    <p>Reward: {generatedChallenge.reward}</p>
                                </div>
                                <Button className="w-full">Start this AI Challenge</Button>
                            </CardFooter>
                        </Card>
                    </div>
                  </CardContent>
                </Card>
            </div>
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
