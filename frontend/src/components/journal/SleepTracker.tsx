'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Moon, Coffee } from 'lucide-react';

interface SleepTrackerProps {
  sleepHours: number;
  sleepQuality: number;
  onChange: (data: { sleepHours: number; sleepQuality: number }) => void;
}

/**
 * Sleep Quality Tracker
 * Scientific Basis: Walker (2017) - Sleep deprivation = 60% increase in emotional reactivity
 * Mechanism: Correlates sleep with mood to reveal causation
 */
export function SleepTracker({ sleepHours, sleepQuality, onChange }: SleepTrackerProps) {
  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-2">
        <Moon className="h-5 w-5 text-indigo-500" />
        <Label className="text-lg font-medium">Sleep Check</Label>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Sleep is the foundation of emotional regulation. Track it to see its impact on your mood.
      </p>

      {/* Hours of Sleep */}
      <div className="space-y-3">
        <Label className="text-sm">Hours of Sleep Last Night</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[sleepHours]}
            onValueChange={([value]) => onChange({ sleepHours: value, sleepQuality })}
            min={0}
            max={12}
            step={0.5}
            className="flex-1"
          />
          <span className="text-lg font-semibold w-16 text-right">{sleepHours}h</span>
        </div>
      </div>

      {/* Sleep Quality */}
      <div className="space-y-3">
        <Label className="text-sm">Sleep Quality</Label>
        <div className="flex items-center gap-4">
          <Slider
            value={[sleepQuality]}
            onValueChange={([value]) => onChange({ sleepHours, sleepQuality: value })}
            min={1}
            max={10}
            step={1}
            className="flex-1"
          />
          <span className="text-lg font-semibold w-16 text-right">{sleepQuality}/10</span>
        </div>
      </div>

      {sleepHours > 0 && sleepHours < 7 && (
        <div className="p-4 bg-red-50/60 dark:bg-red-900/20 backdrop-blur-xl rounded-2xl border border-red-200/20">
          <p className="text-xs text-muted-foreground">
            ⚠️ <strong>Sleep Alert:</strong> Less than 7 hours impairs emotional regulation. 
            If your mood is low today, sleep debt may be a factor.
          </p>
        </div>
      )}

      {sleepHours >= 7 && sleepHours <= 9 && (
        <div className="p-4 bg-green-50/60 dark:bg-green-900/20 backdrop-blur-xl rounded-2xl border border-green-200/20">
          <p className="text-xs text-muted-foreground">
            ✅ <strong>Optimal Range:</strong> 7-9 hours supports peak emotional and cognitive function.
          </p>
        </div>
      )}
    </div>
  );
}
