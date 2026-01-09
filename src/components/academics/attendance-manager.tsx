'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress-ring';
import type { SubjectAttendance } from '@/lib/types';
import { format } from 'date-fns';
import {
  Check,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

type AttendanceManagerProps = {
  subjects: SubjectAttendance[];
  loading: boolean;
  onAttendanceChange: (subjectName: string, action: 'attend' | 'miss') => void;
};


export function AttendanceManager({ 
    subjects,
    loading,
    onAttendanceChange,
}: AttendanceManagerProps) {
  const targetAttendance = 75;

  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0);
  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const overallAttendance =
    totalClasses > 0 ? (totalAttended / totalClasses) * 100 : 0;
  
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
                      onClick={() => onAttendanceChange(subject.name, 'attend')}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-6 w-6 bg-red-100 hover:bg-red-200 text-red-700"
                      onClick={() => onAttendanceChange(subject.name, 'miss')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
