'use client';

import { useState, useEffect, useCallback } from 'react';

interface BreathingExerciseProps {
  onBack: () => void;
}

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

const PHASE_DURATIONS: Record<Phase, number> = {
  inhale: 4000,
  hold: 7000,
  exhale: 8000,
  rest: 1000,
};

const PHASE_LABELS: Record<Phase, string> = {
  inhale: 'Breathe in...',
  hold: 'Hold...',
  exhale: 'Breathe out...',
  rest: 'Rest...',
};

export default function BreathingExercise({ onBack }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<Phase>('rest');
  const [cycleCount, setCycleCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startExercise = useCallback(() => {
    setIsActive(true);
    setCycleCount(0);
    setPhase('inhale');
  }, []);

  // Phase progression
  useEffect(() => {
    if (!isActive) return;

    const duration = PHASE_DURATIONS[phase];
    setCountdown(Math.ceil(duration / 1000));

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    // Phase transition timer
    const phaseTimer = setTimeout(() => {
      switch (phase) {
        case 'inhale':
          setPhase('hold');
          break;
        case 'hold':
          setPhase('exhale');
          break;
        case 'exhale':
          setPhase('rest');
          setCycleCount(prev => prev + 1);
          break;
        case 'rest':
          setPhase('inhale');
          break;
      }
    }, duration);

    return () => {
      clearTimeout(phaseTimer);
      clearInterval(countdownInterval);
    };
  }, [phase, isActive]);

  // Get circle scale based on phase
  const getScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.5;
      case 'hold':
        return 1.5;
      case 'exhale':
        return 1;
      default:
        return 1;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card p-8 max-w-md w-full mx-4 text-center relative">
        {/* Close button */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          4-7-8 Breathing
        </h2>
        <p className="text-zinc-300 mb-8">
          A calming technique to reduce anxiety
        </p>

        {/* Breathing circle */}
        <div className="flex items-center justify-center mb-8">
          <div
            className="breathing-circle relative"
            style={{
              transform: `scale(${getScale()})`,
              transition: `transform ${PHASE_DURATIONS[phase]}ms ease-in-out`,
            }}
          >
            {/* Inner content */}
            <div className="text-center text-white z-10">
              {isActive ? (
                <>
                  <div className="text-4xl font-bold mb-1">{countdown}</div>
                  <div className="text-sm opacity-80">{PHASE_LABELS[phase]}</div>
                </>
              ) : (
                <div className="text-lg">Ready?</div>
              )}
            </div>

            {/* Outer ring animation */}
            <div
              className="absolute inset-0 rounded-full border-4 border-white/30"
              style={{
                animation: isActive ? 'ripple 4s linear infinite' : 'none',
              }}
            />
          </div>
        </div>

        {/* Cycle counter */}
        {isActive && (
          <p className="text-zinc-300 mb-4">
            Cycle {cycleCount + 1}
          </p>
        )}

        {/* Instructions */}
        {!isActive && (
          <div className="mb-6 text-sm text-zinc-300">
            <p className="mb-2">This technique helps calm your nervous system:</p>
            <ul className="space-y-1 text-zinc-400">
              <li>🌬️ Inhale for 4 seconds</li>
              <li>⏸️ Hold for 7 seconds</li>
              <li>💨 Exhale for 8 seconds</li>
            </ul>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          {!isActive ? (
            <button onClick={startExercise} className="btn-zen btn-zen-primary">
              Start Breathing
            </button>
          ) : (
            <button onClick={() => setIsActive(false)} className="btn-zen btn-zen-secondary">
              Pause
            </button>
          )}
          <button onClick={onBack} className="btn-zen btn-zen-secondary">
            Done
          </button>
        </div>

        {/* Encouragement */}
        {cycleCount >= 3 && (
          <p className="mt-6 text-sm text-green-400 animate-gentle-pulse">
            ✨ You're doing great! {cycleCount} cycles completed.
          </p>
        )}
      </div>
    </div>
  );
}
