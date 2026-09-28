'use client';

import { ShieldCheck, PhoneCall, HeartPulse, LifeBuoy } from 'lucide-react';

interface SafetySectionProps {
  onNavigate: (view: 'help') => void;
}

export default function SafetySection({ onNavigate }: SafetySectionProps) {
  const handleExternalHelplines = () => {
    window.open('https://findahelpline.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="glass-card-premium p-1 border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center">
            
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-black uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Human-First Boundary
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
                Sia is a <span className="text-purple-500">Companion,</span> <br />
                Not a Crisis Center.
              </h2>
              
              <p className="text-xl text-zinc-400 leading-relaxed font-light">
                ZenGuard is designed for daily wellness support, self-reflection, and routine mental health maintenance. If you are experiencing a crisis, please reach out to trained human professionals immediately.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button 
                  onClick={handleExternalHelplines}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-purple-500/20 flex items-center gap-3 active:scale-95"
                >
                  <PhoneCall className="w-5 h-5" />
                  International Helplines
                </button>
                <button 
                  onClick={() => onNavigate('help')}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold rounded-2xl transition-all flex items-center gap-3 active:scale-95"
                >
                  <LifeBuoy className="w-5 h-5 text-purple-400" />
                  Support Resources
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 space-y-4">
               {[
                 { icon: HeartPulse, text: "Not a substitute for therapy" },
                 { icon: ShieldCheck, text: "No clinical diagnosis provided" },
                 { icon: PhoneCall, text: "Emergency? Call local services" },
               ].map((item, i) => (
                 <div key={i} className="p-4 glass-card flex items-center gap-4 group hover:bg-white/5 transition-all">
                    <div className="p-2 rounded-xl bg-white/5 text-zinc-400 group-hover:scale-110 transition-transform">
                       <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-white/80">{item.text}</span>
                 </div>
               ))}
               
               <div className="mt-8 p-6 rounded-3xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] leading-relaxed">
                    Always consult with a qualified <br /> health provider for medical concerns.
                  </p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
