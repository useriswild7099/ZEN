'use client';

import { Zap, Cpu, Lock, Globe, HardDrive, Code, ExternalLink } from 'lucide-react';

export default function TechnicalPrivacySection() {
  const handleGithubLink = () => {
    window.open('https://github.com/useriswild7099/ZENGUARD.AI', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-24 relative z-10 bg-white/[0.02] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <Zap className="w-3 h-3" />
              Edge Intelligence
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Self-Hosting Your Mind: <br />
              <span className="text-blue-400">Total Data Sovereignty</span>
            </h2>
            
            <p className="text-lg text-zinc-400 leading-relaxed">
              Unlike traditional AI that ships your most private thoughts to remote servers, ZenGuard lives entirely on your device. We use TherapyLlama-8B, a therapy-fine-tuned model optimized for local execution, ensuring your mental health data never leaves your hardware.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              {[
                {
                  title: "Zero Latency",
                  desc: "Instant responses with no network lag or server downtime.",
                  icon: Cpu
                },
                {
                  title: "Ghost Protocol",
                  desc: "Session data exists only in RAM and evaporates on close.",
                  icon: Lock
                },
                {
                  title: "Air-Gap Ready",
                  desc: "Runs 100% offline. No internet connection required.",
                  icon: Globe
                },
                {
                  title: "Self-Purity",
                  desc: "Zero-telemetry. We don't track when or how you use it.",
                  icon: HardDrive
                }
              ].map((item, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-blue-400" />
                    <h4 className="font-bold text-white">{item.title}</h4>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={handleGithubLink}
              className="mt-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest border border-white/10 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10"
            >
              <Code className="w-4 h-4" />
              View Source Code
              <ExternalLink className="w-3 h-3 ml-2" />
            </button>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 p-1 glass-card-premium">
              <div className="p-10 text-center flex flex-col items-center">
                <div className="mb-8 relative inline-block">
                  <div className="absolute inset-0 bg-blue-500/30 blur-[40px] rounded-full"></div>
                  <Zap className="w-24 h-24 text-blue-400 relative z-10" />
                </div>
                
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Verified Local-First</h3>
                
                <div className="space-y-3 mb-8">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Processing Mode</span>
                    <span className="text-green-400 font-mono">ON-DEVICE</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">Encryption Level</span>
                    <span className="text-green-400 font-mono">NON-PERSISTENT</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">External Connections</span>
                    <span className="text-rose-400 font-mono">0 BLOCKED</span>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest leading-relaxed">
                  Your encryption keys never leave this window. <br /> Total isolation is our primary protocol.
                </p>
              </div>
            </div>
            
            {/* Background Glows */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10 animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/10 blur-[100px] -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
