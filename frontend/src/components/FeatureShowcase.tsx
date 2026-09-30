'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Users, Sparkles, Shield, Brain, Zap, 
  Heart, BookOpen, Wind, Flame, Cloud,
  Search, Lock, CheckCircle2, Cpu, HardDrive, WifiOff
} from 'lucide-react';

const PERSONALITIES = [
  { 
    name: "Dost (Saathi)", 
    category: "Peer Support", 
    emoji: "🫶", 
    desc: "Empathetic peer & active listener. Offers warm, non-judgmental presence, validation, and emotional safety.",
    image: "/personalities/compasionate friend.png"
  },
  { 
    name: "Margdarshak (Guru)", 
    category: "Cognitive Guidance", 
    emoji: "🪷", 
    desc: "Cognitive reframing & wisdom guide. Untangles overwhelming thoughts and reduces catastrophizing.",
    image: "/personalities/mindfulness guide.png"
  },
  { 
    name: "Prahari (Protector)", 
    category: "Safety & Rights", 
    emoji: "🛡️", 
    desc: "Affirms dignity, Section 15A statutory protections, and connects to free NALSA (15100) legal aid.",
    image: "/personalities/father.png"
  },
  { 
    name: "Vaidya (Healer)", 
    category: "Somatic Calming", 
    emoji: "🌿", 
    desc: "Somatic & nervous system coach. Guides 4-7-8 breathing, sensory grounding, and panic de-escalation.",
    image: "/personalities/academic coach.png"
  },
  { 
    name: "Apna Saathi (Custom)", 
    category: "Personalized", 
    emoji: "✨", 
    desc: "Tailored companion adapting tone, name, and pacing to what feels most comforting and safe to you.",
    image: "/personalities/sister.png"
  }
];

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState<'personalities' | 'analysis' | 'release' | 'privacy'>('personalities');
  const [personaCategory, setPersonaCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Void Mode simulator state
  const [releaseInput, setReleaseInput] = useState<string>('');
  const [releasedWords, setReleasedWords] = useState<string[]>([]);
  const [isDissolving, setIsDissolving] = useState<boolean>(false);

  const handleSimulateRelease = () => {
    if (!releaseInput.trim()) return;
    setIsDissolving(true);
    setTimeout(() => {
      setReleasedWords((prev) => [...prev, releaseInput]);
      setReleaseInput('');
      setIsDissolving(false);
    }, 1200);
  };

  const filteredPersonas = PERSONALITIES.filter(p => {
    const matchesCat = personaCategory === 'All' || p.category === personaCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-20 relative z-10 w-full max-w-7xl mx-auto px-6">
      
      {/* Section Header */}
      <div className="text-center mb-14 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Specialized Support Ecosystem
        </div>
        <h2 className="text-3xl md:text-5xl font-bold dark:text-white text-zinc-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Trauma-Informed & Rights-Aware Companions
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
          Specialized psychological first aid, cognitive grounding, Section 15A statutory rights awareness, and zero-cloud privacy.
        </p>
      </div>

      {/* Interactive Feature Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {[
          { id: 'personalities', label: 'Therapy Companions', icon: Users },
          { id: 'release', label: 'Void Mode Release', icon: Wind },
          { id: 'analysis', label: 'Local Cognitive Insights', icon: Brain },
          { id: 'privacy', label: 'Zero-Cloud Architecture', icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-[1.03]'
                : 'dark:bg-white/5 dark:text-zinc-300 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white bg-zinc-100 text-zinc-700 border border-zinc-300 hover:bg-zinc-200 hover:text-zinc-950'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SPECIALIZED THERAPY PERSONALITIES */}
      {activeTab === 'personalities' && (
        <div className="animate-fade-in space-y-6">
          {/* Persona Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-100/90 dark:bg-white/5 p-4 rounded-2xl border border-zinc-200 dark:border-white/10 max-w-5xl mx-auto">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
              {['All', 'Peer Support', 'Cognitive Guidance', 'Safety & Rights', 'Somatic Calming', 'Personalized'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPersonaCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                    personaCategory === cat 
                      ? 'bg-purple-600 text-white shadow-sm' 
                      : 'bg-white dark:bg-white/5 text-zinc-700 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-200 dark:border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search companions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-black/40 border border-zinc-300 dark:border-white/10 rounded-xl pl-9 pr-4 py-1.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          {/* Grid of Personas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {filteredPersonas.map((persona) => (
              <div 
                key={persona.name}
                className="glass-card p-5 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-purple-500/30 transition-all duration-300 flex items-start gap-4 group cursor-default shadow-sm"
              >
                <div className="relative w-14 h-14 flex-shrink-0">
                  <Image
                    src={persona.image}
                    alt={persona.name}
                    fill
                    loading="lazy"
                    sizes="56px"
                    className="rounded-full object-cover border border-zinc-300 dark:border-white/10 group-hover:scale-110 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <span className="hidden text-3xl absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-white/5 rounded-full">{persona.emoji}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold dark:text-white text-zinc-900 text-base truncate">{persona.name}</h3>
                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/20 font-mono whitespace-nowrap font-semibold">
                      {persona.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-2 line-clamp-3 leading-relaxed">{persona.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center text-xs text-zinc-600 dark:text-zinc-400 pt-2 font-mono">
            5 specialized trauma-informed counseling & rights protection personalities
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE VOID MODE SIMULATOR */}
      {activeTab === 'release' && (
        <div className="animate-fade-in glass-card p-8 md:p-12 max-w-4xl mx-auto rounded-3xl border border-zinc-200 dark:border-white/15">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Wind className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold dark:text-white text-zinc-900">Interactive Void Release</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                Type any stress, frustration, or heavy thought below and watch it instantly dissolve into nothingness. No record, no history.
              </p>

              {/* Live Interactive Text Dissolve Input */}
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type a thought (e.g. 'Stressed about deadline')..."
                    value={releaseInput}
                    onChange={(e) => setReleaseInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSimulateRelease()}
                    className={`w-full bg-white dark:bg-black/50 border border-zinc-300 dark:border-white/15 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-blue-400 transition-all ${
                      isDissolving ? 'opacity-30 blur-sm scale-95 duration-1000' : ''
                    }`}
                  />
                  <button
                    onClick={handleSimulateRelease}
                    disabled={!releaseInput.trim() || isDissolving}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-xs font-bold text-white rounded-lg transition-all"
                  >
                    {isDissolving ? 'Dissolving...' : 'Release'}
                  </button>
                </div>

                {releasedWords.length > 0 && (
                  <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/10 text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                    <span>✨ Released {releasedWords.length} heavy thought{releasedWords.length > 1 ? 's' : ''} into the void!</span>
                    <button onClick={() => setReleasedWords([])} className="text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white underline">Clear</button>
                  </div>
                )}
              </div>
            </div>

            {/* Visual Release Preview Box */}
            <div className="relative h-64 glass-card rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden flex items-center justify-center p-6 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
              
              <div className="relative z-10 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 animate-pulse">
                  <Wind className="w-8 h-8" />
                </div>
                <h4 className="text-white font-bold text-base">Cathartic Metaphors</h4>
                <p className="text-xs text-zinc-300 max-w-xs mx-auto">
                  Choose to burn, shatter, dissolve, or float your thoughts into space with audio feedback.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOCAL COGNITIVE INSIGHTS */}
      {activeTab === 'analysis' && (
        <div className="animate-fade-in glass-card p-8 md:p-12 max-w-4xl mx-auto rounded-3xl border border-zinc-200 dark:border-white/15">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold dark:text-white text-zinc-900">Private Local Intelligence</h3>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                Powered by local Ollama AI models, ZenGuard detects cognitive distortions, tracks mood trends, and recommends CBT reframing.
              </p>
              <ul className="space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                {[
                  "Mood Seed Metaphor & Plant Growth tracking",
                  "Cognitive Distortion Spotter (Catastrophizing, All-or-Nothing)",
                  "Wellness Risk Score (0-100 score evaluation)",
                  "Proactive Gentle Intervention suggestions"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Analytics Preview Card */}
            <div className="glass-card p-6 rounded-2xl border border-zinc-200 dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs border-b border-zinc-200 dark:border-white/10 pb-3">
                <span className="text-zinc-600 dark:text-zinc-400 font-mono">INSIGHT ENGINE</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> LOCAL OLLAMA READY
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">Emotional Balance</span>
                    <span className="text-purple-600 dark:text-purple-300 font-bold">88%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-blue-400 w-[88%]"></div>
                  </div>
                </div>
                <div className="p-3 bg-zinc-100 dark:bg-white/5 rounded-xl text-xs text-zinc-600 dark:text-zinc-300 italic border border-zinc-200 dark:border-white/5">
                  "Thought pattern shows positive shift toward problem-solving after CBT reframing prompt."
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ZERO-CLOUD ARCHITECTURE */}
      {activeTab === 'privacy' && (
        <div className="animate-fade-in space-y-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "100% Offline Capable",
                desc: "The local AI engine runs directly on your machine. Turn off Wi-Fi and everything works seamlessly.",
                icon: WifiOff,
                badge: "No Internet Required"
              },
              {
                title: "Zero Remote Data Storage",
                desc: "We do not host databases or track user IDs. Your private journal entries stay on your device.",
                icon: HardDrive,
                badge: "Local Browser/Disk Only"
              },
              {
                title: "On-Device Inference",
                desc: "Every AI response is computed locally on your CPU/GPU with zero external API calls.",
                icon: Cpu,
                badge: "Local Ollama LLM"
              }
            ].map((card, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-purple-500/30 transition-all text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 mx-auto bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="inline-block text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-500/10 dark:bg-white/5 px-2.5 py-0.5 rounded-full border border-purple-500/20 dark:border-white/10 mb-2 font-semibold">
                    {card.badge}
                  </span>
                  <h3 className="text-lg font-bold dark:text-white text-zinc-900">{card.title}</h3>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
}
