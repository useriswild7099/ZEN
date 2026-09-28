'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Waves, Play, Pause, Check } from 'lucide-react';

interface FocusPortalProps {
  content: string;
  onChange: (content: string) => void;
  onComplete: () => void;
}

export function FocusPortal({ content, onChange, onComplete }: FocusPortalProps) {
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    if (!isBreathing) return;

    const breathCycle = () => {
      // Inhale: 4s -> Hold: 4s -> Exhale: 6s
      setTimeout(() => setBreathPhase('hold'), 4000);
      setTimeout(() => setBreathPhase('exhale'), 8000);
      setTimeout(() => setBreathPhase('inhale'), 14000);
    };

    breathCycle();
    const interval = setInterval(breathCycle, 14000);

    return () => clearInterval(interval);
  }, [isBreathing]);

  const getBreathText = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe in...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe out...';
    }
  };

  const getBreathScale = () => {
    switch (breathPhase) {
      case 'inhale': return 1.2;
      case 'hold': return 1.2;
      case 'exhale': return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Breathing Indicator */}
        <div className="flex flex-col items-center gap-6">
          <motion.div
            className="relative"
            animate={{ scale: isBreathing ? getBreathScale() : 1 }}
            transition={{
              duration: breathPhase === 'inhale' ? 4 : breathPhase === 'hold' ? 0.1 : 6,
              ease: 'easeInOut',
            }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-30 blur-xl" />
            <Waves className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-blue-300" />
          </motion.div>

          {isBreathing && (
            <motion.p
              className="text-blue-200 text-lg font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {getBreathText()}
            </motion.p>
          )}

          <Button
            onClick={() => setIsBreathing(!isBreathing)}
            variant="outline"
            size="sm"
            className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            {isBreathing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isBreathing ? 'Pause Breathing' : 'Start Breathing Guide'}
          </Button>
        </div>

        {/* Writing Area */}
        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Let your thoughts flow... No judgment, no pressure. Just you and the page."
            className="min-h-[400px] bg-white/5 border-white/10 text-white placeholder:text-white/40 text-lg leading-relaxed resize-none backdrop-blur-sm"
            autoFocus
          />

          <div className="flex justify-between items-center">
            <p className="text-white/60 text-sm">
              {content.split(/\s+/).filter(Boolean).length} words
            </p>
            <Button
              onClick={onComplete}
              disabled={!content.trim()}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Complete
            </Button>
          </div>
        </div>

        {/* Ambient Text */}
        <div className="text-center">
          <p className="text-white/40 text-sm italic">
            "The quieter you become, the more you can hear."
          </p>
        </div>
      </div>
    </div>
  );
}
