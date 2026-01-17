'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { TimetableEntry, Task } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Clock, Book, FlaskConical, Coffee, Sparkles, Check, X, Ban } from 'lucide-react';

const typeIconMapping = {
  lecture: Book,
  lab: FlaskConical,
  break: Coffee,
  task: Sparkles,
};

type TimetableProps = {
  timetable: TimetableEntry[];
  handleAttendanceChange: (subject: string, action: 'attend' | 'miss' | 'cancel', entryId: number) => void;
  tasks: Task[];
  replaceTask: (day: string, id: number) => void;
  selectedDay: string;
};

export default function Timetable({ timetable, handleAttendanceChange, tasks, replaceTask, selectedDay }: TimetableProps) {

  const isFreeSlot = (entry: TimetableEntry) => {
    return entry.type === 'break' && entry.subject === 'Free Slot';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{selectedDay}'s Schedule</CardTitle>
        <CardDescription>
          Here is your schedule for {selectedDay}. Mark your attendance for each class.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {timetable.length > 0 ? (
            <ul className="space-y-4">
            {timetable.map((entry) => {
                const Icon = typeIconMapping[entry.type as keyof typeof typeIconMapping] || Clock;
                const isFree = isFreeSlot(entry);
                const isAttended = entry.status === 'attended';
                const isMissed = entry.status === 'missed';
                const isCancelled = entry.status === 'cancelled';

                return (
                <li
                  key={entry.id}
                  className={cn(
                  'flex items-center space-x-4 rounded-lg border p-4 transition-all',
                  isFree ? 'bg-emerald-50 border-emerald-100' : 'bg-card',
                  isAttended ? 'bg-green-500/10 border-green-500/20' : '',
                  isMissed ? 'bg-red-500/10 border-red-500/20' : '',
                  isCancelled ? 'bg-gray-500/10 border-gray-500/20' : ''
                  )}
                >
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    isFree || entry.type === 'task' ? "bg-emerald-100 text-emerald-800" : "bg-primary/10 text-primary",
                    isAttended && "bg-green-500/20 text-green-700",
                    isMissed && "bg-red-500/20 text-red-700",
                    isCancelled && "bg-gray-500/20 text-gray-700"
                  )}>
                    {isFree ? <Sparkles className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>

                    <div className="flex-1">
                    <p className={cn("font-semibold", (isMissed || isAttended || isCancelled) && "line-through")}>{entry.subject}</p>
                    </div>

                    {entry.type !== 'break' && !isAttended && !isMissed && !isCancelled && (
                    <div className="flex gap-2">
                        <Button
                            variant={'outline'}
                            size="icon"
                            className="h-8 w-8 bg-green-100 hover:bg-green-200 text-green-700"
                          onClick={() => handleAttendanceChange(entry.subject, 'attend', entry.id)}
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={'outline'}
                            size="icon"
                            className="h-8 w-8 bg-red-100 hover:bg-red-200 text-red-700"
                          onClick={() => handleAttendanceChange(entry.subject, 'miss', entry.id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={'outline'}
                            size="icon"
                            className="h-8 w-8 bg-gray-100 hover:bg-gray-200 text-gray-700"
                          onClick={() => handleAttendanceChange(entry.subject, 'cancel', entry.id)}
                        >
                            <Ban className="h-4 w-4" />
                        </Button>
                    </div>
                    )}
                </li>
                );
            })}
            </ul>
        ) : (
            <div className="text-center text-muted-foreground py-10">
                <p>No schedule for {selectedDay}. Enjoy your day off!</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
