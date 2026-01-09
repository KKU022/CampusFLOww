'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer, Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { Progress } from '@/components/ui/progress-ring';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function FocusTimerCard() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [initialTime, setInitialTime] = useState(25 * 60);
  const { toast } = useToast();

  const totalSeconds = minutes * 60 + seconds;
  const progress = (totalSeconds / initialTime) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((s) => s - 1);
        } else if (minutes > 0) {
          setMinutes((m) => m - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          toast({
            title: 'Session Complete!',
            description: `Great job focusing for ${initialTime / 60} minutes.`,
          });
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, isPaused, minutes, seconds, initialTime, toast]);
  
  const setTime = useCallback((newMinutes: number) => {
    if (isActive) return;
    const clampedMinutes = Math.max(5, Math.min(120, newMinutes));
    setMinutes(clampedMinutes);
    setSeconds(0);
    setInitialTime(clampedMinutes * 60);
  }, [isActive]);


  const handleStart = () => {
    if (minutes === 0 && seconds === 0) return;
    setInitialTime(minutes * 60 + seconds);
    setIsActive(true);
    setIsPaused(false);
  };
  
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(25);
  };

  const timePresets = [15, 25, 50, 60];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
            <Timer />
            Focus Zone
        </CardTitle>
        <CardDescription>
          Start a timed session to concentrate on a single task.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6">
        <div className="relative">
            <Progress 
                value={progress}
                size={200}
                strokeWidth={10}
                className={cn(isActive && !isPaused ? "text-primary" : "text-muted")}
            />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-5xl font-bold">
                <span>{String(minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span>{String(seconds).padStart(2, '0')}</span>
            </div>
        </div>
        <div className="w-full space-y-4">
            <div className="flex items-center justify-center gap-2">
                 <Button variant="outline" size="icon" onClick={() => setTime(minutes - 5)} disabled={isActive}>
                    <Minus className="h-4 w-4" />
                </Button>
                <Input 
                    type="number"
                    className="w-24 text-center text-lg"
                    value={minutes}
                    onChange={(e) => setTime(parseInt(e.target.value, 10))}
                    disabled={isActive}
                />
                 <Button variant="outline" size="icon" onClick={() => setTime(minutes + 5)} disabled={isActive}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
                {timePresets.map(preset => (
                    <Button key={preset} variant="outline" onClick={() => setTime(preset)} disabled={isActive}>
                        {preset}m
                    </Button>
                ))}
            </div>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-4">
        {!isActive ? (
            <Button onClick={handleStart} className="col-span-2">
                <Play className="mr-2 h-4 w-4" /> Start Session
            </Button>
        ) : (
            <>
                <Button onClick={handlePauseResume}>
                    {isPaused ? <Play className="mr-2 h-4 w-4" /> : <Pause className="mr-2 h-4 w-4" />}
                    {isPaused ? 'Resume' : 'Pause'}
                </Button>
                <Button variant="destructive" onClick={handleReset}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
            </>
        )}
      </CardFooter>
    </Card>
  );
}
