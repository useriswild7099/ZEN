'use client';

import { useState } from 'react';
import { 
  Sparkles, Wind, MessageCircle, PenLine, BookOpen, 
  ArrowRight, RefreshCw, HeartHandshake, ShieldCheck
} from 'lucide-react';

interface QuickMoodCheckProps {
  onNavigate: (view: 'journal' | 'chat' | 'knowledge' | 'help' | 'breathing' | 'grounding') => void;
}

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  subtitle: string;
  accent: string;
  bgGlow: string;
  borderGlow: string;
  affirmation: string;
  actionText: string;
  targetView: 'journal' | 'chat' | 'knowledge' | 'help' | 'breathing' | 'grounding';
  icon: any;
}

const MOODS: MoodOption[] = [
  {
    id: 'anxious',
    emoji: '😰',
    label: 'Anxious',
    subtitle: 'Racing thoughts',
    accent: 'from-amber-400 to-orange-500',
    bgGlow: 'bg-amber-500/10',
    borderGlow: 'border-amber-400/30',
    affirmation: "Your nervous system is just asking for safety. Take a deep breath with us — you are okay right now.",
    actionText: 'Start 2-Min Calming Breath',
    targetView: 'breathing',
    icon: Wind
  },
  {
    id: 'overwhelmed',
    emoji: '🤯',
    label: 'Overwhelmed',
    subtitle: 'Too much to carry',
    accent: 'from-rose-400 to-red-500',
    bgGlow: 'bg-rose-500/10',
    borderGlow: 'border-rose-400/30',
    affirmation: "You don't have to process everything at once. Take a step back and reset your nervous system with a calming breath.",
    actionText: 'Start Calming Breath',
    targetView: 'breathing',
    icon: Wind
  },
  {
    id: 'sad',
    emoji: '🌧️',
    label: 'Feeling Down',
    subtitle: 'Need gentle support',
    accent: 'from-blue-400 to-indigo-500',
    bgGlow: 'bg-blue-500/10',
    borderGlow: 'border-blue-400/30',
    affirmation: "Sadness is heavy, but you don't have to carry it alone. Sia is ready to listen warmly without any judgment.",
    actionText: 'Talk to Sia (Warm Listener)',
    targetView: 'chat',
    icon: MessageCircle
  },
  {
    id: 'exhausted',
    emoji: '😴',
    label: 'Exhausted',
    subtitle: 'Low energy & drained',
    accent: 'from-purple-400 to-pink-500',
    bgGlow: 'bg-purple-500/10',
    borderGlow: 'border-purple-400/30',
    affirmation: "Rest is not earned — it is essential. Explore gentle evidence-based micro-practices to recharge.",
    actionText: 'Explore MindSpace Hub',
    targetView: 'knowledge',
    icon: BookOpen
  },
  {
    id: 'calm',
    emoji: '🧘',
    label: 'Calm',
    subtitle: 'Centered & quiet',
    accent: 'from-emerald-400 to-teal-500',
    bgGlow: 'bg-emerald-500/10',
    borderGlow: 'border-emerald-400/30',
    affirmation: "Peace is a gift. Anchor this peaceful state by capturing a quick reflection in your private journal.",
    actionText: 'Write in Silent Journal',
    targetView: 'journal',
    icon: PenLine
  },
  {
    id: 'hopeful',
    emoji: '✨',
    label: 'Hopeful',
    subtitle: 'Ready to grow',
    accent: 'from-cyan-400 to-blue-500',
    bgGlow: 'bg-cyan-500/10',
    borderGlow: 'border-cyan-400/30',
    affirmation: "Momentum is precious. Record your insights or spark a creative brainstorm with Sia AI.",
    actionText: 'Chat with AI Mentor',
    targetView: 'chat',
    icon: MessageCircle
  }
];

export function QuickMoodCheck({ onNavigate }: QuickMoodCheckProps) {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4 z-20 relative">
      <div className="relative rounded-3xl p-6 md:p-8 backdrop-blur-2xl border border-white/15 bg-black/40 dark:bg-zinc-950/60 shadow-2xl overflow-hidden transition-all">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <HeartHandshake className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold dark:text-white text-zinc-900 tracking-tight">
                How are you feeling right now?
              </h3>
              <p className="text-xs text-zinc-400">
                1-Tap Quick Check-In • 100% Private & Local
              </p>
            </div>
          </div>
          
          {selectedMood && (
            <button
              onClick={() => setSelectedMood(null)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Mood</span>
            </button>
          )}
        </div>

        {/* Mood Selection Buttons */}
        {!selectedMood ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood)}
                className={`group relative p-3.5 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-2 hover:scale-[1.04] active:scale-[0.98] ${mood.bgGlow} ${mood.borderGlow} dark:hover:border-white/40 hover:border-zinc-400`}
              >
                <div>
                  <span className="block text-xs font-bold dark:text-white text-zinc-800 leading-tight">
                    {mood.label}
                  </span>
                  <span className="block text-[10px] text-zinc-400 mt-0.5 font-light">
                    {mood.subtitle}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Selected Mood Empathetic Card */
          <div className="animate-fade-up bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r ${selectedMood.accent} text-zinc-950`}>
                      {selectedMood.label}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Private AI
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-zinc-200 font-medium leading-relaxed pt-1">
                    "{selectedMood.affirmation}"
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate(selectedMood.targetView)}
                className={`w-full md:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-zinc-950 bg-gradient-to-r ${selectedMood.accent} hover:brightness-110 shadow-lg hover:shadow-xl transition-all flex-shrink-0 group`}
              >
                <selectedMood.icon className="w-4 h-4" />
                <span>{selectedMood.actionText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
