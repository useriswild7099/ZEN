'use client';

import { useState } from 'react';
import { KNOWLEDGE_ARTICLES, KnowledgeArticle } from '@/lib/knowledge';
import { 
  Heart, Cloud, Zap, 
  HelpCircle, ChevronRight,
  ShieldAlert, Sparkles, X,
  ShieldCheck, AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';

interface CopingNavigatorProps {
  onRoute: (article: KnowledgeArticle) => void;
  onHelpHub: () => void;
  onClose: () => void;
}

export default function CopingNavigator({ onRoute, onHelpHub, onClose }: CopingNavigatorProps) {
  const [step, setStep] = useState<'selection' | 'triage'>('selection');
  const [selectedFeeling, setSelectedFeeling] = useState<string | null>(null);

  const feelings = [
    { id: 'anxious', label: 'Anxious / Panic', icon: <Zap className="w-5 h-5 text-yellow-400" />, articleId: 'crisis-panic', triage: true },
    { id: 'overwhelmed', label: 'Overwhelmed', icon: <Cloud className="w-5 h-5 text-blue-400" />, articleId: 'crisis-overwhelmed', triage: true },
    { id: 'sad', label: 'Sad / Low Mood', icon: <Heart className="w-5 h-5 text-red-400" />, articleId: 'condition-depression' },
    { id: 'academic', label: 'Academic Stress', icon: <Sparkles className="w-5 h-5 text-purple-400" />, articleId: 'academic-stress' },
    { id: 'lonely', label: 'Lonely', icon: <HelpCircle className="w-5 h-5 text-green-400" />, articleId: 'social-loneliness' },
  ];

  const handleSelection = (feeling: typeof feelings[0]) => {
    if (feeling.triage) {
      setSelectedFeeling(feeling.id);
      setStep('triage');
    } else {
      const article = KNOWLEDGE_ARTICLES.find(a => a.id === feeling.articleId);
      if (article) onRoute(article);
    }
  };

  const finalizeTriage = (highDistress: boolean) => {
    if (highDistress) {
      onHelpHub();
    } else {
      const feeling = feelings.find(f => f.id === selectedFeeling);
      const article = KNOWLEDGE_ARTICLES.find(a => a.id === feeling?.articleId);
      if (article) onRoute(article);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-card p-8 border-white/20 relative overflow-hidden shadow-2xl">
        {/* Background Glow */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 ${step === 'triage' ? 'bg-red-500/20' : 'bg-purple-500/20'} blur-[80px] rounded-full transition-colors duration-500`}></div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl ${step === 'triage' ? 'bg-red-600/30 border-red-500/30' : 'bg-purple-600/30 border-purple-500/30'} flex items-center justify-center border transition-colors duration-500`}>
              {step === 'triage' ? <AlertCircle className="w-6 h-6 text-red-400" /> : <ShieldAlert className="w-6 h-6 text-purple-400" />}
            </div>
            <h3 className="text-2xl font-bold text-white">Wellness Navigator</h3>
          </div>

          {step === 'selection' ? (
            <>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                I&apos;m here to help you find the right tools. How are you feeling right now?
              </p>

              <div className="space-y-3">
                {feelings.map(feeling => (
                  <button
                    key={feeling.id}
                    onClick={() => handleSelection(feeling)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {feeling.icon}
                      </div>
                      <span className="text-white font-medium">{feeling.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6 animate-fade-up">
              <p className="text-white text-lg font-medium">I hear you. Let&apos;s check the severity together.</p>
              <p className="text-zinc-400 leading-relaxed">
                Are you feeling at immediate risk of hurting yourself, or do you feel your safety is currently compromised?
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => finalizeTriage(true)}
                  className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-all text-left flex items-start gap-4 group"
                >
                  <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-bold mb-1">Yes, I feel unsafe</h4>
                    <p className="text-red-200/50 text-sm">I need immediate professional support pathways.</p>
                  </div>
                </button>

                <button
                  onClick={() => finalizeTriage(false)}
                  className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left flex items-start gap-4 group"
                >
                  <ShieldCheck className="w-6 h-6 text-green-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-bold mb-1">No, I just need tools</h4>
                    <p className="text-zinc-500 text-sm">Guide me to the library articles and coping strategies.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
            <p>{step === 'selection' ? 'Select a feeling to see tailored support.' : 'Triage helps determine the right care level.'}</p>
            <span className="italic">Local & Anonymous</span>
          </div>
        </div>
      </div>
    </div>
  );
}
