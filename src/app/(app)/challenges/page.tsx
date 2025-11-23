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
import { Check, Trophy, Zap, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

export default function ChallengesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Health Challenges
          </h1>
          <p className="text-muted-foreground">
            Join challenges, complete tasks, and earn rewards!
          </p>
        </div>
      </div>

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
    </div>
  );
}
