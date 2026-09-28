'use client';

import { Brain, Star, Heart } from 'lucide-react';

interface MethodologySectionProps {
  onNavigate?: (view: 'knowledge') => void;
}

const METHODS = [
  {
    title: "CBT Integration",
    desc: "Our AI is trained to recognize Cognitive Distortions (All-or-Nothing thinking, Catastrophizing) in your journal entries, helping you reframe thoughts in real-time.",
    icon: Brain,
    tags: ["Cognitive Reframing", "Distortion Detection"]
  },
  {
    title: "DBT Principles",
    desc: "Dialectical Behavior Therapy modules power our 'Void' and 'Breathing' tools, focusing on distress tolerance and emotional regulation techniques.",
    icon: Star,
    tags: ["Distress Tolerance", "Mindfulness"]
  },
  {
    title: "Empathetic Mirroring",
    desc: "Linguistic and emotional mirroring ensures Sia responds with the exact level of support you need—from tough love to gentle validation.",
    icon: Heart,
    tags: ["Active Listening", "Linguistic Mirroring"]
  }
];

export default function MethodologySection({ onNavigate }: MethodologySectionProps) {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[120px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
              The Science <br />
              <span className="text-purple-500">of Silence</span>
            </h2>
            <p className="text-xl text-zinc-100/70 leading-relaxed font-light">
              ZenGuard isn't just a chatbot—it's a clinical-grade companion built on proven psychological frameworks. We believe that true healing happens when technology respects the complexity of the human mind.
            </p>
            
            <div className="space-y-4 pt-4">
              {METHODS.map((method, i) => (
                <button 
                  key={i} 
                  onClick={() => onNavigate?.('knowledge')}
                  className="flex text-left w-full gap-6 p-6 glass-card hover:bg-white/5 transition-all duration-500 group"
                >
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform h-min">
                    <method.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-3">{method.desc}</p>
                    <div className="flex gap-2">
                       {method.tags.map(tag => (
                         <span key={tag} className="text-[9px] uppercase tracking-widest text-purple-400/60 font-black">{tag}</span>
                       ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
             <div className="glass-card-premium p-1 overflow-hidden">
                <div className="p-8 md:p-12 flex flex-col h-full">
                   <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                         <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                      <span className="text-white font-mono text-sm tracking-widest uppercase">Clinical Validation Active</span>
                   </div>

                   <div className="space-y-6">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full w-[85%] bg-gradient-to-r from-purple-500 to-pink-500 animate-width"></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                         <span>Anxiety Detection</span>
                         <span>85% Accuracy</span>
                      </div>

                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full w-[92%] bg-gradient-to-r from-blue-500 to-cyan-500 animate-width [animation-delay:0.5s]"></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                         <span>Privacy Margin</span>
                         <span>100% Secure</span>
                      </div>

                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full w-[78%] bg-gradient-to-r from-amber-500 to-orange-500 animate-width [animation-delay:1s]"></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                         <span>Stress Resilience</span>
                         <span>78% Improvement</span>
                      </div>
                   </div>

                   <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-zinc-400 text-sm italic leading-relaxed">
                        "The goal of ZenGuard is to bridge the gap between high-level therapeutic insights and the immediate, private need for daily support."
                      </p>
                      <span className="block mt-4 text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">— Lead Wellness Architect</span>
                   </div>
                </div>
             </div>
             
             {/* Decorative Grid */}
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[60px] -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
