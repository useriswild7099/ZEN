'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimedJournalingProps {
  onComplete: () => void;
}

/**
 * Pomodoro-Style Timed Journaling
 * Scientific Basis: Silvia et al. (2013) - Time constraints reduce perfectionism anxiety by 40%
 * Mechanism: Reduces rumination + encourages flow state + lowers perfectionism barrier
 */
export function TimedJournaling({ onComplete }: TimedJournalingProps) {
  const [duration, setDuration] = useState<5 | 10 | 15>(10);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const handleStart = () => {
    setIsRunning(true);
    setIsStarted(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsStarted(false);
    setTimeLeft(duration * 60);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-2">
        <Timer className="h-5 w-5 text-blue-500" />
        <Label className="text-lg font-medium">Timed Free Write</Label>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Set a timer and write continuously. No editing, no judgment—just flow. 
        Research shows time pressure reduces perfectionism and unlocks authentic expression.
      </p>

      {!isStarted && (
        <div className="space-y-4">
          <Label className="text-sm">Choose Duration</Label>
          <div className="flex gap-3">
            {([5, 10, 15] as const).map((mins) => (
              <Button
                key={mins}
                variant={duration === mins ? 'default' : 'outline'}
                onClick={() => setDuration(mins)}
                className={duration === mins ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : ''}
              >
                {mins} min
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-6 p-8 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
        {/* Timer Display */}
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-secondary"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              strokeLinecap="round"
              className="text-blue-500"
              initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100) }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl font-bold">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {timeLeft === 0 ? 'Time\'s up!' : isRunning ? 'Keep writing...' : 'Ready?'}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isRunning && timeLeft > 0 && (
            <Button onClick={handleStart} size="lg" className="gap-2">
              <Play className="h-5 w-5" />
              {isStarted ? 'Resume' : 'Start'}
            </Button>
          )}
          
          {isRunning && (
            <Button onClick={() => setIsRunning(false)} size="lg" variant="outline" className="gap-2">
              <Pause className="h-5 w-5" />
              Pause
            </Button>
          )}
          
          {isStarted && (
            <Button onClick={handleReset} size="lg" variant="outline" className="gap-2">
              <RotateCcw className="h-5 w-5" />
              Reset
            </Button>
          )}
        </div>

        {timeLeft === 0 && (
          <Button onClick={onComplete} size="lg" className="w-full">
            Continue to Save
          </Button>
        )}
      </div>

      <div className="p-4 bg-blue-50/60 dark:bg-blue-900/20 backdrop-blur-xl rounded-2xl border border-blue-200/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Why this works:</strong> Uncensored stream-of-consciousness writing accesses deeper thoughts 
          that careful editing suppresses. The timer removes the "it has to be perfect" barrier.
        </p>
      </div>
    </div>
  );
}
