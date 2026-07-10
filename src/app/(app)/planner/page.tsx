'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    Plus, 
    Trash, 
    Pill, 
    HeartPulse, 
    Dumbbell, 
    Calendar, 
    Pencil, 
    Loader2, 
    AlarmClock, 
    Clock, 
    CheckCircle2,
    ChevronLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const categoryIcons = {
  Medication: <Pill className="w-4 h-4" />,
  Fitness: <Dumbbell className="w-4 h-4" />,
  General: <HeartPulse className="w-4 h-4" />,
  Appointment: <Calendar className="w-4 h-4" />,
};

type Category = 'Medication' | 'Fitness' | 'General' | 'Appointment';
type Task = { 
    id: string; 
    title: string; 
    category: Category; 
    time: string; 
    completed: boolean; 
    createdAt: number 
};

export default function PlannerPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('guest_planner_tasks_v2');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
    setIsLoading(false);
  }, []);

  const saveTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    localStorage.setItem('guest_planner_tasks_v2', JSON.stringify(newTasks));
  };

  const handleTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as Category;
    const time = formData.get('time') as string;

    if (editingTask) {
      const updated = tasks.map(t => t.id === editingTask.id ? { ...t, title, category, time } : t);
      saveTasks(updated);
      toast({ title: 'Schedule Updated' });
    } else {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        category,
        time,
        completed: false,
        createdAt: Date.now(),
      };
      saveTasks([newTask, ...tasks]);
      toast({ title: 'New Task Added' });
    }
    setIsDialogOpen(false);
  };

  const toggleTask = (task: Task) => {
    const updated = tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t);
    saveTasks(updated);
  };
  
  const deleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    saveTasks(updated);
    toast({ title: 'Task Erased' });
  };
  
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  }

  const openNewTaskDialog = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  }

  // --- NATIVE ALARM INTEGRATION ---
  const setNativeAlarm = (timeStr: string, label: string) => {
    try {
        if (!timeStr) {
            toast({ variant: 'destructive', title: "No Time Set", description: "Please add a time to set an alarm." });
            return;
        }

        const [hours, minutes] = timeStr.split(':').map(Number);
        
        // Android Intent for setting alarm
        // skipping UI allows it to set directly if permissions allow
        const alarmUrl = `intent://#Intent;action=android.intent.action.SET_ALARM;i.android.intent.extra.alarm.HOUR=${hours};i.android.intent.extra.alarm.MINUTES=${minutes};S.android.intent.extra.alarm.MESSAGE=${encodeURIComponent(label)};b.android.intent.extra.alarm.SKIP_UI=false;end`;
        
        window.location.href = alarmUrl;
        
        toast({ 
            title: "Alarm Sync Initiated", 
            description: `Setting system alarm for ${timeStr} with label: ${label}` 
        });
    } catch (e) {
        console.error("Alarm Error:", e);
        toast({ variant: 'destructive', title: "Sync Failed", description: "Native alarm sync is only supported on Android mobile devices." });
    }
  };

  const completedTasks = useMemo(() => tasks.filter(t => t.completed), [tasks]);
  const pendingTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);

  return (
    <div className="space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Header */}
      <div className="flex items-center justify-between p-6 bg-white/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 shadow-sm mx-1 mt-2">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Link href="/dashboard">
            <div className="h-10 w-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-sm active:scale-90 transition-transform">
                <ChevronLeft className="h-6 w-6 text-[#1A365D] dark:text-slate-100" />
            </div>
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-2xl font-black text-[#1A365D] dark:text-white uppercase tracking-tighter leading-none">Health Planner</h1>
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] opacity-70">Schedule & Native Sync</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) setEditingTask(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={openNewTaskDialog} className="h-12 w-12 rounded-2xl bg-primary shadow-xl shadow-primary/20 p-0 active:scale-95 transition-all">
              <Plus className="h-6 w-6 text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] border-none shadow-2xl p-8">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-black text-[#1A365D] uppercase tracking-tight">
                  {editingTask ? 'Refine Entry' : 'Create Mission'}
              </DialogTitle>
              <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Define your health target and set a time.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTaskSubmit} className="space-y-6 py-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">What's the plan?</Label>
                <Input name="title" defaultValue={editingTask?.title ?? ''} className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6" placeholder="e.g., Take Vitamin C" required/>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Category</Label>
                    <Select name="category" defaultValue={editingTask?.category ?? 'General'} required>
                        <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-6">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl">
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="Medication">Medication</SelectItem>
                            <SelectItem value="Fitness">Fitness</SelectItem>
                            <SelectItem value="Appointment">Appointment</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-4">Execution Time</Label>
                    <Input name="time" type="time" defaultValue={editingTask?.time ?? ''} className="h-14 rounded-2xl bg-slate-50 border-none shadow-inner font-bold px-4" required/>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full h-16 rounded-[1.8rem] bg-primary text-white font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all">
                    {editingTask ? 'Sync Changes' : 'Launch Task'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Planner...</p>
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2 px-1">
        
        {/* PENDING TASKS */}
        <section className="space-y-5">
          <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                  <div className="h-4 w-1.5 bg-primary rounded-full" />
                  <h3 className="text-sm font-black uppercase text-[#1A365D] tracking-widest">Active Missions ({pendingTasks.length})</h3>
              </div>
          </div>

          <div className="space-y-4">
            {!isLoading && pendingTasks.length > 0 ? (
              pendingTasks.map(task => (
                <div key={task.id} className="p-5 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-5 group transition-all hover:shadow-primary/5">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task)}
                    className="h-6 w-6 rounded-xl border-2 border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                     <label htmlFor={task.id} className="text-[15px] font-black text-[#1A365D] dark:text-slate-100 truncate block uppercase tracking-tight">
                        {task.title}
                     </label>
                     <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            {categoryIcons[task.category]}
                            <span className="text-[9px] font-black uppercase text-slate-400">{task.category}</span>
                        </div>
                        <div className="flex items-center gap-1 text-primary font-black text-[9px] uppercase">
                            <Clock className="w-3 h-3" />
                            {task.time}
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setNativeAlarm(task.time, task.title)}
                        className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary shadow-inner active:scale-90 transition-transform"
                        title="Set Phone Alarm"
                    >
                        <AlarmClock className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleEditClick(task)} className="h-10 w-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteTask(task.id)} className="h-10 w-10 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-400 active:scale-90 transition-transform">
                        <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              !isLoading && (
                <div className="p-12 text-center border-2 border-dashed rounded-[3rem] bg-white/30 border-blue-100">
                    <CheckCircle2 className="h-10 w-10 text-emerald-300 mx-auto mb-3" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">All Missions Completed</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* COMPLETED TASKS */}
        <section className="space-y-5">
           <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                  <div className="h-4 w-1.5 bg-emerald-500 rounded-full" />
                  <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">Achieved ({completedTasks.length})</h3>
              </div>
          </div>

          <div className="space-y-4">
            {!isLoading && completedTasks.length > 0 ? (
                completedTasks.map(task => (
                    <div key={task.id} className="p-5 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 opacity-60 flex items-center gap-5 transition-all">
                    <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task)}
                        className="h-6 w-6 rounded-xl bg-emerald-500 border-emerald-500"
                    />
                     <div className="flex-1 min-w-0">
                         <label htmlFor={task.id} className="text-sm font-bold line-through text-slate-400 uppercase tracking-tight truncate block">
                            {task.title}
                         </label>
                         <div className="flex items-center gap-3 mt-1">
                             <div className="flex items-center gap-1">
                                {categoryIcons[task.category]}
                                <span className="text-[9px] font-black uppercase tracking-widest">{task.category}</span>
                             </div>
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{task.time}</span>
                         </div>
                     </div>
                      <button onClick={() => deleteTask(task.id)} className="h-10 w-10 rounded-2xl bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-400 active:scale-90 transition-transform">
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                ))
            ) : (
                 !isLoading && <p className="text-[10px] font-black text-slate-300 text-center py-10 uppercase tracking-widest">Zero completed entries</p>
            )}
          </div>
        </section>
      </div>

      {/* Helpful Hint */}
      <div className="mx-4 p-6 rounded-[2rem] bg-blue-50 border-2 border-dashed border-blue-200 text-center space-y-2">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-relaxed">
             💡 Pro Tip: Tap the <AlarmClock className="inline h-3 w-3" /> icon to sync your task time directly with your phone's native alarm app.
          </p>
      </div>

    </div>
  );
}
