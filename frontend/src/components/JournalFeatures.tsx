'use client';

import { useState, useEffect, useCallback } from 'react';
import { Flame, Download, Copy, Clock, Trash2 } from 'lucide-react';

interface BurnAnimationProps {
  onComplete: () => void;
}

export function BurnAnimation({ onComplete }: BurnAnimationProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="text-center animate-burn-sequence">
        <div className="text-6xl mb-4 animate-flame">🔥</div>
        <p className="text-white text-xl font-medium animate-fade-out">
          Your words are being released...
        </p>
        <p className="text-zinc-400 text-sm mt-2 animate-fade-out" style={{ animationDelay: '1s' }}>
          Nothing remains. Nothing was stored.
        </p>
      </div>
    </div>
  );
}

interface TimerDisplayProps {
  seconds: number;
  totalSeconds: number;
}

export function TimerDisplay({ seconds, totalSeconds }: TimerDisplayProps) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <div className="flex items-center gap-3 text-zinc-300">
      <Clock className="w-4 h-4" />
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="font-mono text-sm min-w-[50px]">
        {minutes}:{secs.toString().padStart(2, '0')}
      </span>
    </div>
  );
}

interface ExportOptionsProps {
  text: string;
  onClose: () => void;
}

export function ExportOptions({ text, onClose }: ExportOptionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-card p-6 max-w-sm w-full mx-4 text-center">
        <h3 className="text-white text-lg font-semibold mb-4">Export Your Entry</h3>
        <p className="text-zinc-400 text-sm mb-6">
          Take it with you. We never store anything.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
          >
            <Copy className="w-5 h-5" />
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
          >
            <Download className="w-5 h-5" />
            Download as .txt
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 text-zinc-400 hover:text-white text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

interface EphemeralBadgeProps {
  className?: string;
}

export function EphemeralBadge({ className = '' }: EphemeralBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full ${className}`}>
      <Trash2 className="w-3 h-3 text-amber-400" />
      <span className="text-xs text-amber-300 font-medium">
        This entry will vanish when you leave
      </span>
    </div>
  );
}

interface EndOfSessionProps {
  onClose: () => void;
}

// Ritual steps defined outside component for stable reference
const END_SESSION_STEPS = [
  { text: "Take a deep breath...", delay: 2000 },
  { text: "You've expressed yourself honestly.", delay: 2500 },
  { text: "You don't need to keep this.", delay: 2500 },
  { text: "Let it go.", delay: 2000 },
];

export function EndOfSessionRitual({ onClose }: EndOfSessionProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < END_SESSION_STEPS.length - 1) {
      const timer = setTimeout(() => setStep(s => s + 1), END_SESSION_STEPS[step].delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onClose, END_SESSION_STEPS[step].delay);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="text-center px-8">
        <p className="text-2xl md:text-3xl text-white font-light animate-fade-up">
          {END_SESSION_STEPS[step].text}
        </p>
      </div>
    </div>
  );
}

// Self-destruct timer hook
export function useSelfDestruct(
  enabled: boolean,
  seconds: number,
  onDestruct: () => void
) {
  useEffect(() => {
    if (!enabled) return;
    
    const timer = setTimeout(onDestruct, seconds * 1000);
    return () => clearTimeout(timer);
  }, [enabled, seconds, onDestruct]);
}

// Typing speed tracker hook
export function useTypingSpeed() {
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const lastTypeTime = useCallback(() => {
    let lastTime = Date.now();
    let keyCount = 0;
    
    return () => {
      const now = Date.now();
      const timeDiff = now - lastTime;
      keyCount++;
      
      if (keyCount % 10 === 0) {
        if (timeDiff < 500) setSpeed('fast');
        else if (timeDiff > 2000) setSpeed('slow');
        else setSpeed('normal');
      }
      
      lastTime = now;
    };
  }, []);

  return { speed, trackKeystroke: lastTypeTime() };
}
