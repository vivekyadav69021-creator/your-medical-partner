'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { Plus, Trash, Pill, HeartPulse, Dumbbell, Calendar, Pencil, Loader2 } from 'lucide-react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


const categoryIcons = {
  Medication: <Pill className="w-4 h-4" />,
  Fitness: <Dumbbell className="w-4 h-4" />,
  General: <HeartPulse className="w-4 h-4" />,
  Appointment: <Calendar className="w-4 h-4" />,
};

type Category = 'Medication' | 'Fitness' | 'General' | 'Appointment';
type Task = { id: string; title: string; category: Category; completed: boolean; createdAt: any };

export default function PlannerPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const tasksQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'users', user.uid, 'tasks'), orderBy('createdAt', 'desc')) : null
  , [user, firestore]);

  const { data: tasks, isLoading } = useCollection<Task>(tasksQuery);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleTaskSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !firestore) return;

    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as Category;

    try {
        if (editingTask) {
            const taskRef = doc(firestore, 'users', user.uid, 'tasks', editingTask.id);
            await updateDoc(taskRef, { title, category });
            toast({ title: 'Task Updated' });
        } else {
            const tasksCol = collection(firestore, 'users', user.uid, 'tasks');
            await addDoc(tasksCol, {
              title,
              category,
              completed: false,
              createdAt: serverTimestamp(),
            });
            toast({ title: 'Task Added' });
        }
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not save the task.'});
    }
    
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const toggleTask = async (task: Task) => {
    if (!user || !firestore) return;
    const taskRef = doc(firestore, 'users', user.uid, 'tasks', task.id);
    try {
        await updateDoc(taskRef, { completed: !task.completed });
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not update the task.'});
    }
  };
  
  const deleteTask = async (taskId: string) => {
    if (!user || !firestore) return;
    const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
    try {
        await deleteDoc(taskRef);
        toast({ title: 'Task Deleted' });
    } catch(e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Could not delete the task.'});
    }
  };
  
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  }

  const openNewTaskDialog = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  }

  const completedTasks = useMemo(() => tasks?.filter(t => t.completed) || [], [tasks]);
  const pendingTasks = useMemo(() => tasks?.filter(t => !t.completed) || [], [tasks]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">My Planner</h1>
          <p className="text-muted-foreground">
            Organize your health-related tasks and stay on track.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
          setIsDialogOpen(isOpen);
          if (!isOpen) setEditingTask(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={openNewTaskDialog} disabled={!user}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Add a New Task'}</DialogTitle>
              <DialogDescription>
                Fill in the details for your task below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTaskSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Task
                </Label>
                <Input id="title" name="title" defaultValue={editingTask?.title ?? ''} className="col-span-3" placeholder="e.g., Take Vitamin C" required/>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                 <Select name="category" defaultValue={editingTask?.category ?? 'General'} required>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Medication">Medication</SelectItem>
                        <SelectItem value="Fitness">Fitness</SelectItem>
                        <SelectItem value="Appointment">Appointment</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">{editingTask ? 'Save Changes' : 'Add Task'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading && <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> }

      <div className="grid gap-6 md:grid-cols-2">
        {/* PENDING TASKS */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>To-Do ({pendingTasks.length})</CardTitle>
            <CardDescription>Tasks you need to complete.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isLoading && pendingTasks.length > 0 ? (
              pendingTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 group">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task)}
                  />
                  <div className="flex-1">
                     <label htmlFor={task.id} className="text-sm font-medium cursor-pointer">
                        {task.title}
                     </label>
                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        {categoryIcons[task.category]}
                        <span>{task.category}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(task)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteTask(task.id)}>
                        <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              !isLoading && <p className="text-sm text-muted-foreground text-center py-8">
                No pending tasks. Great job!
              </p>
            )}
          </CardContent>
        </Card>

        {/* COMPLETED TASKS */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Completed ({completedTasks.length})</CardTitle>
            <CardDescription>Tasks you have finished.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!isLoading && completedTasks.length > 0 ? (
                completedTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 group">
                    <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task)}
                    />
                     <div className="flex-1">
                         <label htmlFor={task.id} className="text-sm font-medium line-through text-muted-foreground cursor-pointer">
                            {task.title}
                         </label>
                         <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                             {categoryIcons[task.category]}
                            <span>{task.category}</span>
                         </div>
                     </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteTask(task.id)}>
                            <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                ))
            ) : (
                 !isLoading && <p className="text-sm text-muted-foreground text-center py-8">
                    No tasks completed yet.
                </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
