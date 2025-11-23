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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Bot, Check, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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


export default function AISensiPage() {

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary"/>
            AI Sensi
        </h1>
        <p className="text-muted-foreground">
          Let our AI create a personalized health challenge just for you.
        </p>
      </div>
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
    </div>
  );
}
