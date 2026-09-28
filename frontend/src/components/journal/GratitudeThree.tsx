'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';

interface GratitudeThreeProps {
  gratitudes: string[];
  onChange: (gratitudes: string[]) => void;
}

/**
 * Three Good Things Exercise
 * Scientific Basis: Seligman et al. (2005) - Increases happiness by 2-10% for 6 months
 * Mechanism: Positive attention bias training + savoring + gratitude
 */
export function GratitudeThree({ gratitudes, onChange }: GratitudeThreeProps) {
  const handleChange = (index: number, value: string) => {
    const updated = [...gratitudes];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <Label className="text-lg font-medium">Three Good Things</Label>
      </div>
      
      <p className="text-sm text-muted-foreground">
        List three things that went well today, no matter how small. 
        Research shows this simple practice significantly increases wellbeing.
      </p>

      <div className="space-y-4">
        {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-2">
            <Label className="text-sm">Good Thing #{index + 1}</Label>
            <Input
              value={gratitudes[index] || ''}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={
                index === 0 
                  ? "e.g., Had a great conversation with a friend"
                  : index === 1
                  ? "e.g., Finished a task I'd been putting off"
                  : "e.g., Enjoyed my morning coffee in peace"
              }
              className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl border-white/20"
            />
          </div>
        ))}
      </div>

      <div className="p-4 bg-amber-50/60 dark:bg-amber-900/20 backdrop-blur-xl rounded-2xl border border-amber-200/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Why this works:</strong> Your brain has a negativity bias—it remembers threats 
          more than joys. This exercise rewires your attention toward the positive.
        </p>
      </div>
    </div>
  );
}
