
'use client';

import React, { useState } from 'react';
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
import { Plus, Trash, Pill, HeartPulse, Dumbbell, Calendar, Pencil } from 'lucide-react';

const initialTasks = [
  { id: 'task-1', title: 'Take morning medication', category: 'Medication', completed: true },
  { id: 'task-2', title: 'Go for a 30-minute walk', category: 'Fitness', completed: false },
  { id: 'task-3', title: 'Drink 8 glasses of water', category: 'General', completed: false },
  { id: 'task-4', title: 'Evening meditation', category: 'General', completed: false },
  { id: 'task-5', title: 'Check blood pressure', category: 'Medication', completed: false },
  { id: 'task-6', title: 'Weekly yoga session', category: 'Fitness', completed: true },
];

const categoryIcons = {
  Medication: <Pill className="w-4 h-4" />,
  Fitness: <Dumbbell className="w-4 h-4" />,
  General: <HeartPulse className="w-4 h-4" />,
  Appointment: <Calendar className="w-4 h-4" />,
};

type Category = 'Medication' | 'Fitness' | 'General' | 'Appointment';
type Task = { id: string; title: string; category: Category; completed: boolean };

export default function PlannerPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const category = formData.get('category') as Category;

    if (editingTask) {
        setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, title, category } : t));
    } else {
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title,
          category,
          completed: false,
        };
        setTasks([newTask, ...tasks]);
    }
    
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  
  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  }

  const openNewTaskDialog = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  }

  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);

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
            <Button onClick={openNewTaskDialog}>
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

      <div className="grid gap-6 md:grid-cols-2">
        {/* PENDING TASKS */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>To-Do ({pendingTasks.length})</CardTitle>
            <CardDescription>Tasks you need to complete.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 group">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
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
              <p className="text-sm text-muted-foreground text-center py-8">
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
            {completedTasks.length > 0 ? (
                completedTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 group">
                    <Checkbox
                        id={task.id}
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
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
                 <p className="text-sm text-muted-foreground text-center py-8">
                    No tasks completed yet.
                </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
