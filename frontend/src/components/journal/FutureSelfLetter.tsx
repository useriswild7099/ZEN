'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FutureSelfLetterProps {
  letter: string;
  onChange: (letter: string) => void;
}

/**
 * Letter to Future Self
 * Scientific Basis: Hershfield et al. (2011) - Increases goal achievement by 30%
 * Mechanism: Temporal self-continuity + commitment device + self-affirmation
 */
export function FutureSelfLetter({ letter, onChange }: FutureSelfLetterProps) {
  const [timeframe, setTimeframe] = useState<'1-month' | '3-month' | '1-year'>('3-month');

  const getPrompt = () => {
    switch (timeframe) {
      case '1-month':
        return "What do you want your life to look like one month from now? What habits will you have built?";
      case '3-month':
        return "Imagine yourself three months from now. What progress have you made? What are you proud of?";
      case '1-year':
        return "One year from today, what story do you want to be telling about this chapter of your life?";
    }
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <Label className="text-lg font-medium">Letter to Future Self</Label>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Writing to your future self strengthens the bond between who you are now and who you want to become.
      </p>

      {/* Timeframe Selector */}
      <div className="flex gap-2">
        {(['1-month', '3-month', '1-year'] as const).map((tf) => (
          <Button
            key={tf}
            variant={timeframe === tf ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeframe(tf)}
            className={timeframe === tf ? 'bg-gradient-to-r from-purple-600 to-blue-600' : ''}
          >
            {tf === '1-month' && '1 Month'}
            {tf === '3-month' && '3 Months'}
            {tf === '1-year' && '1 Year'}
          </Button>
        ))}
      </div>

      <div className="p-4 bg-purple-50/60 dark:bg-purple-900/20 backdrop-blur-xl rounded-2xl border border-purple-200/20">
        <p className="text-sm font-medium">{getPrompt()}</p>
      </div>

      <Textarea
        value={letter}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Dear Future Me..."
        className="min-h-[200px] bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl border-white/20 resize-none"
      />

      <div className="p-4 bg-purple-50/60 dark:bg-purple-900/20 backdrop-blur-xl rounded-2xl border border-purple-200/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Why this works:</strong> Most people feel disconnected from their future selves. 
          This exercise increases temporal continuity, making you more likely to make choices that benefit your future.
        </p>
      </div>
    </div>
  );
}
