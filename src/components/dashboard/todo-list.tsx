'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Check, X, ArrowLeft } from 'lucide-react';
import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';

type TodoListProps = {
    tasks: Task[];
    onAddTask: (taskName: string) => void;
    onTaskComplete: (taskId: number) => void;
    onTaskDelete: (taskId: number) => void;
    onMoveTask: (taskId: number) => void;
};

export default function TodoList({ tasks, onAddTask, onTaskComplete, onTaskDelete, onMoveTask }: TodoListProps) {
    const [newTask, setNewTask] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.trim()) {
            onAddTask(newTask.trim());
            setNewTask('');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Todo List</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                        <Plus className="h-4 w-4" />
                    </Button>
                </form>
                {tasks.length > 0 ? (
                    <ul className="space-y-2 mt-4">
                        {tasks.map(task => (
                            <li 
                                key={task.id} 
                                className={cn(
                                    "flex items-center gap-2 p-2 rounded-md transition-colors",
                                    task.completed ? "bg-green-500/10 text-muted-foreground" : "bg-muted/50"
                                )}
                            >
                                <span className={cn("flex-1", task.completed && "line-through")}>{task.suggestion}</span>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:bg-green-100 hover:text-green-700" onClick={() => onTaskComplete(task.id)}>
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-600 hover:bg-red-100 hover:text-red-700" onClick={() => onTaskDelete(task.id)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:bg-primary/10 hover:text-primary" onClick={() => onMoveTask(task.id)}>
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground py-6 text-sm">
                        <p>Your task list is empty.</p>
                        <p>Add a task to get started!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
