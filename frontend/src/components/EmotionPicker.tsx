'use client';

import { useState } from 'react';
import { Heart, Flame, Cloud, Sparkles, Frown, Wind } from 'lucide-react';

export interface Emotion {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  promptTone: 'gentle' | 'intense' | 'reflective' | 'hopeful';
}

const EMOTIONS: Emotion[] = [
  {
    id: 'anxious',
    name: 'Anxious',
    icon: <Wind className="w-6 h-6" />,
    color: 'text-amber-400',
    gradient: 'from-amber-500/30 to-orange-500/20',
    promptTone: 'gentle',
  },
  {
    id: 'angry',
    name: 'Angry',
    icon: <Flame className="w-6 h-6" />,
    color: 'text-red-400',
    gradient: 'from-red-500/30 to-orange-500/20',
    promptTone: 'intense',
  },
  {
    id: 'sad',
    name: 'Sad',
    icon: <Cloud className="w-6 h-6" />,
    color: 'text-blue-400',
    gradient: 'from-blue-500/30 to-indigo-500/20',
    promptTone: 'gentle',
  },
  {
    id: 'hopeful',
    name: 'Hopeful',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'text-green-400',
    gradient: 'from-green-500/30 to-emerald-500/20',
    promptTone: 'hopeful',
  },
  {
    id: 'numb',
    name: 'Numb',
    icon: <Frown className="w-6 h-6" />,
    color: 'text-zinc-400',
    gradient: 'from-zinc-500/30 to-slate-500/20',
    promptTone: 'reflective',
  },
  {
    id: 'overwhelmed',
    name: 'Overwhelmed',
    icon: <Heart className="w-6 h-6" />,
    color: 'text-purple-400',
    gradient: 'from-purple-500/30 to-pink-500/20',
    promptTone: 'gentle',
  },
];

interface EmotionPickerProps {
  onSelect: (emotion: Emotion) => void;
  selectedEmotion: Emotion | null;
}

export default function EmotionPicker({ onSelect, selectedEmotion }: EmotionPickerProps) {
  return (
    <div className="mb-6">
      <p className="text-sm text-zinc-400 mb-3 text-center">How are you feeling?</p>
      <div className="grid grid-cols-3 gap-3">
        {EMOTIONS.map((emotion) => (
          <button
            key={emotion.id}
            onClick={() => onSelect(emotion)}
            className={`
              group relative p-4 rounded-xl border transition-all duration-300
              ${selectedEmotion?.id === emotion.id 
                ? `bg-gradient-to-br ${emotion.gradient} border-white/30 scale-105` 
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}
            `}
          >
            <div className={`flex flex-col items-center gap-2 ${emotion.color}`}>
              {emotion.icon}
              <span className="text-xs font-medium text-zinc-300">{emotion.name}</span>
            </div>
            {selectedEmotion?.id === emotion.id && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Export emotions and prompt generator for use in page.tsx
export const EMOTION_PROMPTS: Record<string, string[]> = {
  gentle: [
    "Take your time. What's weighing on you?",
    "It's okay to feel this way. What do you need to say?",
    "Breathe. Let the words come when they're ready.",
  ],
  intense: [
    "Let it out. No filter. What's making you feel this way?",
    "Say what you really want to say. No one's reading this.",
    "Write the thing you're holding back.",
  ],
  reflective: [
    "Sometimes we feel disconnected. What's beneath the surface?",
    "What would you tell yourself right now?",
    "What are you avoiding thinking about?",
  ],
  hopeful: [
    "What's the small light you're holding onto?",
    "What would make tomorrow a little better?",
    "Write about what you're grateful for today.",
  ],
};

export function getTimeBasedPrompt(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning. How did you wake up feeling today?";
  } else if (hour >= 12 && hour < 17) {
    return "Afternoon check-in. How's your day going so far?";
  } else if (hour >= 17 && hour < 21) {
    return "Evening reflection. What's on your mind as the day winds down?";
  } else {
    return "Late night thoughts are often the truest. What's keeping you up?";
  }
}

export { EMOTIONS };
