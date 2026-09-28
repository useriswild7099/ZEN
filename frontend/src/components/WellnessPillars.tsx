'use client';

import { 
  PenLine, MessageCircle, BookOpen, Wind, ArrowUpRight
} from 'lucide-react';

interface WellnessPillarsProps {
  onNavigate: (view: 'journal' | 'chat' | 'knowledge' | 'help' | 'breathing' | 'grounding') => void;
}

const PILLARS = [
  {
    id: 'journal' as const,
    title: "The Silent Journal",
    subtitle: "Reflect & Grow",
    desc: "A sacred space where your words stay strictly yours. Local AI analyzes emotional sentiment without transmitting data.",
    icon: PenLine,
    color: "from-purple-500/20 via-indigo-500/10 to-transparent",
    borderColor: "group-hover:border-purple-400/50",
    iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-300",
    features: ["Pattern Spotter", "CBT Reframing", "Mood Seeds"]
  },
  {
    id: 'chat' as const,
    title: "Trauma Support Companions",
    subtitle: "Safe & Non-Judgmental",
    desc: "Specialized counseling personalities (Dost, Margdarshak, Prahari, Vaidya) providing peer support, cognitive reframing, rights reassurance, and somatic regulation.",
    icon: MessageCircle,
    color: "from-purple-500/20 via-pink-500/10 to-transparent",
    borderColor: "group-hover:border-purple-400/50",
    iconBg: "bg-purple-500/10 border-purple-500/20 text-purple-300",
    features: ["5 Therapy Personas", "Section 15A Rights", "Offline Privacy"]
  },
  {
    id: 'knowledge' as const,
    title: "MindSpace Hub",
    subtitle: "Evidence-Based Learning",
    desc: "A curated library of clinical-grade mental health insights filtered through our gentle, supportive AI interface.",
    icon: BookOpen,
    color: "from-blue-500/20 via-cyan-500/10 to-transparent",
    borderColor: "group-hover:border-blue-400/50",
    iconBg: "bg-blue-500/10 border-blue-500/20 text-blue-300",
    features: ["CBT Foundations", "Crisis Navigation", "Wellness Paths"]
  },
  {
    id: 'breathing' as const,
    title: "Guided Breath & Reset",
    subtitle: "Nervous System Calming",
    desc: "Restore calm and regulate your nervous system with interactive, science-backed box breathing exercises.",
    icon: Wind,
    color: "from-teal-500/20 via-emerald-500/10 to-transparent",
    borderColor: "group-hover:border-teal-400/50",
    iconBg: "bg-teal-500/10 border-teal-500/20 text-teal-300",
    features: ["Box Breathing", "Sync Pacing", "Immediate Calm"]
  }
];

export default function WellnessPillars({ onNavigate }: WellnessPillarsProps) {
  return (
    <section className="py-20 relative z-10 w-full max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          The Four Pillars of ZenGuard
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
          Four distinct pathways to restore balance, clarity, and peace of mind.
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 mx-auto rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {PILLARS.map((pillar) => (
          <button 
            key={pillar.id}
            onClick={() => onNavigate(pillar.id)}
            className="group relative p-1 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] text-left w-full h-full focus:outline-none"
          >
            {/* Background Accent Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-40 group-hover:opacity-70 transition-opacity duration-500`}></div>
            
            <div className={`relative h-full glass-card p-8 md:p-10 rounded-3xl border border-white/10 ${pillar.borderColor} transition-all duration-500 flex flex-col justify-between`}>
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className={`p-4 rounded-2xl border ${pillar.iconBg} group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <pillar.icon className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-mono font-bold">
                      {pillar.subtitle}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-white/20 transition-all">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {pillar.title}
                </h3>

                <p className="text-zinc-300 text-sm md:text-base leading-relaxed mb-6">
                  {pillar.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                {pillar.features.map((feature, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] text-zinc-300 font-medium tracking-wide"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
