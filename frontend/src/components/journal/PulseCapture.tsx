'use client';

import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Pulse } from '@/types/journal';

interface PulseCaptureProps {
  pulse: Pulse;
  onChange: (pulse: Pulse) => void;
}

export function PulseCapture({ pulse, onChange }: PulseCaptureProps) {
  const getMoodEmoji = (value: number): string => {
    if (value <= 2) return '😢';
    if (value <= 4) return '😔';
    if (value <= 6) return '😐';
    if (value <= 8) return '🙂';
    return '😊';
  };

  const getEnergyEmoji = (value: number): string => {
    if (value <= 3) return '🔋'; // Low battery
    if (value <= 6) return '⚡'; // Medium
    return '⚡⚡'; // High
  };

  return (
    <div className="space-y-8 py-6">
      {/* Mood Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-medium text-white">How are you feeling?</Label>
          <span className="text-4xl" role="img" aria-label="mood">
            {getMoodEmoji(pulse.mood)}
          </span>
        </div>
        
        <div className="space-y-2">
          <Slider
            value={[pulse.mood]}
            onValueChange={([value]) => onChange({ ...pulse, mood: value })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/40 px-1">
            <span>Low</span>
            <span className="font-medium text-white">{pulse.mood}/10</span>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Energy Slider */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-medium text-white">Energy level?</Label>
          <span className="text-3xl" role="img" aria-label="energy">
            {getEnergyEmoji(pulse.energy)}
          </span>
        </div>
        
        <div className="space-y-2">
          <Slider
            value={[pulse.energy]}
            onValueChange={([value]) => onChange({ ...pulse, energy: value })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/40 px-1">
            <span>Drained</span>
            <span className="font-medium text-white">{pulse.energy}/10</span>
            <span>Energized</span>
          </div>
        </div>
      </div>

      {/* Mood-Energy Matrix Insight */}
      {(pulse.mood > 0 && pulse.energy > 0) && (
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
          <p className="text-sm text-white/60 leading-relaxed">
            {pulse.mood > 7 && pulse.energy > 7 && "You're in a flow state — a great time for creativity or challenging tasks."}
            {pulse.mood > 7 && pulse.energy <= 7 && pulse.energy > 4 && "You're content but relaxed — good for gentle activities."}
            {pulse.mood > 7 && pulse.energy <= 4 && "You're peaceful but tired — perfect for restorative self-care."}
            {pulse.mood <= 7 && pulse.mood > 4 && pulse.energy > 7 && "You have energy but feel neutral — try redirecting that energy into something meaningful."}
            {pulse.mood <= 7 && pulse.mood > 4 && pulse.energy <= 7 && "A balanced, ordinary moment — these are the majority of life. Notice what's steady."}
            {pulse.mood <= 4 && pulse.energy > 7 && "You're tense or anxious — movement or grounding exercises might help."}
            {pulse.mood <= 4 && pulse.energy <= 4 && "You're experiencing depletion — be gentle with yourself. Rest is productive."}
          </p>
        </div>
      )}
    </div>
  );
}
