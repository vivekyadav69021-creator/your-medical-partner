
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Bot,
  Stethoscope,
  Hospital,
  BookHeart,
  BrainCircuit,
  Calendar,
  Clock,
  Check,
  ListTodo,
  Trophy,
  Scan,
  Store,
  HeartPulse,
  Activity,
  Smartphone,
  BedDouble,
  Flame,
  User as UserIcon,
} from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Progress } from '@/components/ui/progress';
import { HealthScoreDisplay } from '@/components/health-score-display';
import Image from 'next/image';
import { useState, useEffect } from 'react';

type UserProfile = {
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
  bloodGroup: string;
  conditions: string;
  allergies: string;
};

const quickAccessItems = [
  {
    title: 'AI Health Assistant',
    description: 'Ask our AI anything about health.',
    href: '/health-assistant',
    icon: Bot,
  },
  {
    title: 'AI Psychiatrist',
    description: 'Talk about your mental health.',
    href: '/ai-psychiatrist',
    icon: BrainCircuit,
  },
  {
    title: 'Disease Scanner',
    description: 'Analyze X-rays, lab reports & more.',
    href: '/disease-scanner',
    icon: Scan,
  },
  {
    title: 'Doctor Consult',
    description: 'Book an appointment with a doctor.',
    href: '/consultation',
    icon: Stethoscope,
  },
  {
    title: 'Medical Store',
    description: 'Order medicines and products.',
    href: '/store',
    icon: Store,
  },
  {
    title: 'Nearby Hospital',
    description: 'Find clinics and hospitals near you.',
    href: '/nearby-hospital',
    icon: Hospital,
  },
  {
    title: 'Disease Library',
    description: 'Browse diseases and conditions.',
    href: '/disease-library',
    icon: BookHeart,
  },
];

const sleepData = [
  { day: 'Mon', hours: 7.5 },
  { day: 'Tue', hours: 6.8 },
  { day: 'Wed', hours: 8.2 },
  { day: 'Thu', hours: 7.1 },
  { day: 'Fri', hours: 6.5 },
  { day: 'Sat', hours: 9.0 },
  { day: 'Sun', hours: 8.5 },
];

const upcomingAppointments = [
  {
    doctorName: 'Dr. Priya Patel',
    specialty: 'Pediatrician',
    date: 'Dec 15, 2024',
    time: '11:30 AM',
    imageId: 'doctor-3',
  },
  {
    doctorName: 'Dr. John Smith',
    specialty: 'General Physician',
    date: 'Dec 18, 2024',
    time: '02:00 PM',
    imageId: 'doctor-5',
  },
];

const plannerTasks = [
  { id: 'task-1', task: 'Take morning medication', completed: true },
  { id: 'task-2', task: 'Go for a 30-minute walk', completed: false },
  { id: 'task-3', task: 'Drink 8 glasses of water', completed: false },
  { id: 'task-4', task: 'Evening meditation', completed: false },
];

const activeChallenge = {
    title: '7-Day Walking Challenge',
    progress: 4,
    total: 7,
    tasks: [
      { name: 'Day 5: 8,000 steps', completed: false },
      { name: 'Day 6: 8,000 steps', completed: false },
    ],
};


export default function DashboardPage() {
  const smartwatchImage = PlaceHolderImages.find(p => p.id === 'smartwatch-connect');
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userMedicalProfile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.error("Failed to load profile from local storage", e);
    }
  }, []);
  
  const greetingName = profile?.name || 'Guest';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Hi, {greetingName}!
        </h1>
        <p className="text-muted-foreground">
          Welcome to your personal health dashboard.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>
                    Your healthcare tools, just a click away.
                </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {quickAccessItems.slice(0, 4).map(item => (
                <Card
                    key={item.title}
                    className="group hover:shadow-lg transition-shadow duration-300"
                >
                    <Link href={item.href} className="flex flex-col h-full p-4 justify-between">
                        <item.icon className="w-8 h-8 text-primary mb-2" />
                        <div>
                            <p className="text-md font-semibold">
                            {item.title}
                            </p>
                             <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.description}
                            </p>
                        </div>
                    </Link>
                </Card>
                ))}
            </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Profile Summary</span>
                    <UserIcon className="w-5 h-5 text-primary" />
                </CardTitle>
                <CardDescription>
                    Your basic health information.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 {profile && profile.name ? (
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Name:</span> <strong>{profile.name}</strong></div>
                        <div className="flex justify-between"><span>Age:</span> <strong>{profile.age || 'N/A'}</strong></div>
                        <div className="flex justify-between"><span>Weight:</span> <strong>{profile.weight ? `${profile.weight} kg` : 'N/A'}</strong></div>
                        <div className="flex justify-between"><span>Blood Group:</span> <strong>{profile.bloodGroup || 'N/A'}</strong></div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Your profile is not yet complete.</p>
                )}
            </CardContent>
            <CardFooter>
                 <Button asChild variant="secondary" className="w-full">
                    <Link href="/profile">
                        {profile?.name ? 'View or Edit Profile' : 'Complete Your Profile'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Connect Your Smartwatch</CardTitle>
            <CardDescription>Sync your health data for real-time tracking and a personalized health score.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <Card className="p-4">
                    <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-4xl font-bold">78</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-1"><HeartPulse className="w-4 h-4"/> Heart Rate</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-xs text-muted-foreground">bpm (real-time)</p>
                    </CardContent>
                </Card>
                 <Card className="p-4">
                    <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-4xl font-bold">6,521</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-1"><Activity className="w-4 h-4" /> Steps</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-xs text-muted-foreground">Today</p>
                    </CardContent>
                </Card>
                 <Card className="p-4">
                    <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-4xl font-bold">7h 15m</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-1"><BedDouble className="w-4 h-4" /> Sleep</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-xs text-muted-foreground">Last night</p>
                    </CardContent>
                </Card>
                 <Card className="p-4">
                    <CardHeader className="p-0 mb-2">
                        <CardTitle className="text-4xl font-bold">340</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-1"><Flame className="w-4 h-4" /> Calories</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <p className="text-xs text-muted-foreground">Active kcal</p>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
        <CardFooter>
            <Button>
                <Smartphone className="mr-2 h-4 w-4" />
                Connect Device
            </Button>
        </CardFooter>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Challenge</span>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </CardTitle>
            <CardDescription>{activeChallenge.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">Progress</p>
                    <p className="text-sm text-muted-foreground">{activeChallenge.progress} / {activeChallenge.total} days</p>
                  </div>
                <Progress value={(activeChallenge.progress / activeChallenge.total) * 100} className="h-2"/>
            </div>
            <div className="space-y-2">
                <p className="text-sm font-medium">Next Tasks</p>
                {activeChallenge.tasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <Checkbox id={`challenge-task-${index}`} checked={task.completed} />
                        <label htmlFor={`challenge-task-${index}`} className="text-sm">{task.name}</label>
                    </div>
                ))}
            </div>
             <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/challenges">
                    View All Challenges
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Sleep Pattern</CardTitle>
            <CardDescription>
              Your sleep duration over the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sleepData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Bar
                    dataKey="hours"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled consultations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingAppointments.map((appt, index) => {
              const image = PlaceHolderImages.find(
                img => img.id === appt.imageId
              );
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-2 rounded-lg bg-secondary/50"
                >
                  {image && (
                    <Avatar>
                      <AvatarImage
                        src={image.imageUrl}
                        alt={appt.doctorName}
                        data-ai-hint={image.imageHint}
                      />
                      <AvatarFallback>
                        {appt.doctorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{appt.doctorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {appt.specialty}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{appt.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{appt.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Planner</CardTitle>
              <CardDescription>
                Today's health tasks and reminders.
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/planner">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {plannerTasks.slice(0, 4).map(task => (
              <div key={task.id} className="flex items-center gap-3">
                <Checkbox
                  id={`dashboard-${task.id}`}
                  checked={task.completed}
                />
                <label
                  htmlFor={`dashboard-${task.id}`}
                  className={`flex-1 text-sm ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.task}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
