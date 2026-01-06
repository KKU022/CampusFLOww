'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress-ring';
import { getInitialAttendance } from '@/lib/data';
import type { SubjectAttendance } from '@/lib/types';
import { format } from 'date-fns';
import {
  MoreVertical,
  Check,
  X,
  Calendar,
  BarChart,
  ClipboardCheck,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AttendanceManager() {
  const [subjects, setSubjects] = useState<SubjectAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const targetAttendance = 75;

  useEffect(() => {
    setSubjects(getInitialAttendance());
    setLoading(false);
  }, []);

  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const overallAttendance =
    totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;

  const handleAttendanceChange = (
    subjectName: string,
    action: 'attend' | 'miss'
  ) => {
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) => {
        if (subject.name === subjectName) {
          const newAttended =
            action === 'attend' ? subject.attended + 1 : subject.attended;
          const newTotal = subject.total + 1;
          return { ...subject, attended: newAttended, total: newTotal };
        }
        return subject;
      })
    );
  };
  
  const handleAddSubject = () => {
    if (newSubjectName.trim() === '') return;
    setSubjects(prev => [...prev, { name: newSubjectName, attended: 0, total: 0 }]);
    setNewSubjectName('');
    setIsAddDialogOpen(false);
  }

  const handleResetSubject = (subjectName: string) => {
    setSubjects(prev => prev.map(s => s.name === subjectName ? {...s, attended: 0, total: 0} : s));
  }

  const handleDeleteSubject = (subjectName: string) => {
    setSubjects(prev => prev.filter(s => s.name !== subjectName));
  }

  const getStatus = (attended: number, total: number) => {
    const currentPercentage = total > 0 ? (attended / total) * 100 : 0;
    if (currentPercentage >= targetAttendance) {
      const canMiss = Math.floor(
        (attended - targetAttendance * 0.01 * total) /
          (targetAttendance * 0.01)
      );
      if (canMiss > 0) {
        return {
          text: `On Track, You may leave next ${canMiss} class${
            canMiss > 1 ? 'es' : ''
          }`,
          isOnTrack: true,
        };
      }
      return {
        text: "On Track, but can't miss the next class",
        isOnTrack: true,
      };
    } else {
      const needed = Math.ceil(
        (targetAttendance * 0.01 * total - attended) /
          (1 - targetAttendance * 0.01)
      );
      return {
        text: `You need to attend next ${needed} class${
          needed > 1 ? 'es' : ''
        }`,
        isOnTrack: false,
      };
    }
  };

  if (loading) {
    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                 <div className="flex items-start justify-between">
                    <div>
                        <CardDescription>Target: {targetAttendance}%</CardDescription>
                        <Skeleton className="h-7 w-48 mt-1" />
                        <div className="text-sm text-muted-foreground mt-1">
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                     <div className="flex flex-col items-end gap-2">
                        <Skeleton className="h-10 w-28" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-10" />
                            <Skeleton className="h-10 w-10" />
                            <Skeleton className="h-10 w-10" />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i} className="bg-card-foreground/5 dark:bg-card-foreground/10">
                        <CardContent className="p-4 flex items-center gap-4">
                            <Skeleton className="w-1.5 h-12 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-[60px] w-[60px] rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardDescription>Target: {targetAttendance}%</CardDescription>
            <CardTitle className="font-bold text-lg">
              Total Attendance: {overallAttendance.toFixed(2)}%
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), 'dd MMM, yyyy')}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Plus className="mr-2 h-4 w-4" /> Add Subject
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Subject</DialogTitle>
                        <DialogDescription>
                            Enter the name of the new subject you want to track.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Subject
                            </Label>
                            <Input
                                id="name"
                                value={newSubjectName}
                                onChange={(e) => setNewSubjectName(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g. Artificial Intelligence"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleAddSubject}>Add Subject</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Calendar className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <BarChart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ClipboardCheck className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjects.map((subject) => {
          const attendancePercentage =
            subject.total > 0 ? (subject.attended / subject.total) * 100 : 0;
          const status = getStatus(subject.attended, subject.total);
          return (
            <Card
              key={subject.name}
              className="bg-card-foreground/5 dark:bg-card-foreground/10"
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={cn(
                    'w-1.5 h-12 rounded-full',
                    status.isOnTrack ? 'bg-green-500' : 'bg-red-500'
                  )}
                />
                <div className="flex-1">
                  <p className="font-bold text-lg">{subject.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Attendance: {subject.attended}/{subject.total}
                  </p>
                  <p
                    className={cn(
                      'text-sm',
                      status.isOnTrack
                        ? 'text-green-600'
                        : 'text-red-600'
                    )}
                  >
                    Status: {status.text}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress
                    value={attendancePercentage}
                    size={60}
                    strokeWidth={6}
                    className={cn(
                      status.isOnTrack ? 'text-green-500' : 'text-red-500'
                    )}
                  />
                  <div className="flex flex-col gap-1">
                    <Button
                      size="icon"
                      className="h-6 w-6 bg-green-100 hover:bg-green-200 text-green-700"
                      onClick={() => handleAttendanceChange(subject.name, 'attend')}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-6 w-6 bg-red-100 hover:bg-red-200 text-red-700"
                      onClick={() => handleAttendanceChange(subject.name, 'miss')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleResetSubject(subject.name)}>
                        Reset
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteSubject(subject.name)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
