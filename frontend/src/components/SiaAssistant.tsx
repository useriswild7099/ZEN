'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, MessageCircle, 
  BookOpen, PenLine, 
  LifeBuoy, Palette, Wind, Lightbulb,
  Moon, Sun, Volume2, VolumeX, Leaf
} from 'lucide-react';
import { Switch } from './ui/switch';

interface SiaAssistantProps {
  activeView: string;
  onNavigate: (view: any) => void;
  onNavigateTab?: (tab: string) => void;
  onOpenArticle?: (article: any) => void;
  language?: string;
  theme?: string;
  onThemeChange?: (theme: string) => void;
  isMuted?: boolean;
  onToggleMusic?: () => void;
}

export default function SiaAssistant({ 
  activeView, 
  onNavigate, 
  onNavigateTab, 
  onOpenArticle, 
  language = 'English',
  theme = 'nature',
  onThemeChange,
  isMuted = true,
  onToggleMusic
}: SiaAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPeekingActive, setIsPeekingActive] = useState(false);
  const [greeting, setGreeting] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isLight = theme === 'light';
  const textPrimary = isLight ? 'text-zinc-900' : 'text-white';
  const textSecondary = isLight ? 'text-zinc-500' : 'text-white/60';
  const cardBg = isLight ? 'bg-zinc-100/70 border-zinc-200' : 'bg-white/5 border-white/10';

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Track view switches for proactive greeting updates
  useEffect(() => {
    const greetings: Record<string, string> = {
      'English': "I'm here to guide you. Where should we go next?",
      'Hindi': "मैं आपकी मार्गदर्शिका हूँ। आगे कहाँ चलना चाहिए?",
    };
    
    const contextGreetings: Record<string, string> = {
      'journal': "Your thoughts are safe here. Want to see your insights?",
      'chat': "Deep conversations can be healing. Need a different tool?",
      'breathing': "Peace is within you. Shall we check the Library?",
    };

    const baseGreeting = greetings[language] || greetings['English'];
    const contextual = contextGreetings[activeView];
    
    setGreeting(contextual || baseGreeting);
  }, [activeView, language]);

  useEffect(() => {
    if (isOpen) {
      setIsPeekingActive(false);
      return;
    }

    const runPeekCycle = () => {
      setIsPeekingActive(true);
      setTimeout(() => {
        setIsPeekingActive(false);
      }, 5000);
    };

    const timeout = setTimeout(runPeekCycle, 1000);
    const interval = setInterval(runPeekCycle, 15000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isOpen]);

  const getTranslatedLabels = () => {
    if (language === 'Hindi') return {
      help: 'सहायता', library: 'पुस्तकालय', journal: 'जर्नल', chat: 'बात करें',
      breathing: 'सांस लें', stats: 'आंकड़े', shortcuts: 'शॉर्टकट्स',
      system: 'सिस्टम', darkMode: 'डार्क मोड', music: 'संगीत',
      natureMode: 'प्रकृति मोड', lightMode: 'लाइट मोड'
    };
    return {
      help: 'Help Hub', library: 'Library', journal: 'Journal', chat: 'AI Friend',
      breathing: 'Breathing', stats: 'Insights', shortcuts: 'Shortcuts',
      system: 'System', darkMode: 'Dark Mode', music: 'Music',
      natureMode: 'Nature', lightMode: 'Light'
    };
  };

  const labels = getTranslatedLabels();

  const quickActions = [
    { label: labels.journal, icon: PenLine, action: () => { onNavigate('journal'); setIsOpen(false); } },
    { label: labels.chat, icon: MessageCircle, action: () => { onNavigate('chat'); setIsOpen(false); } },
    { label: labels.library, icon: BookOpen, action: () => { onNavigate('knowledge'); setIsOpen(false); } },
    { label: labels.breathing, icon: Wind, action: () => { onNavigate('breathing'); setIsOpen(false); } },
    { label: labels.stats, icon: Lightbulb, action: () => { onNavigateTab?.('insights'); setIsOpen(false); } },
    { label: labels.help, icon: LifeBuoy, action: () => { onNavigate('help'); setIsOpen(false); } },
  ];

  return (
    <div ref={containerRef} className="fixed bottom-1 md:bottom-0 right-4 md:right-2 z-[200] flex flex-col items-end">
      {/* Sia Navigator Window */}
      {isOpen && (
        <div className={`w-[calc(100vw-32px)] md:w-[320px] h-auto max-h-[600px] backdrop-blur-[40px] rounded-[32px] shadow-elite flex flex-col mb-2 md:mb-1 animate-sia-slide-in overflow-hidden border ${
          isLight ? 'bg-white/90 border-zinc-200' : 'bg-black/40 border-white/20'
        }`}>
          {/* Header */}
          <div className="p-4 pb-3 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 flex items-center justify-center bg-white/5 rounded-[12px] border border-white/10 shadow-inner overflow-hidden backdrop-blur-md">
                <img src="/sia-peeking.png" alt="Sia" className="w-[140%] h-[140%] object-contain -mr-3 mt-1" />
              </div>
              <div>
                <h3 className={`font-bold text-[14px] md:text-[13px] leading-tight ${isLight ? 'text-zinc-900' : 'premium-text-gradient text-white'}`}>Sia</h3>
                <p className={`text-[8px] uppercase tracking-[0.2em] font-black ${isLight ? 'text-zinc-400' : 'text-white/30'}`}>Navigator</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className={`p-1.5 rounded-lg transition-all duration-300 ${isLight ? 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900' : 'hover:bg-white/10 text-white/40 hover:text-white'}`}
            >
              <X className="w-5 h-5 md:w-4 md:h-4" />
            </button>
          </div>

          {/* Navigation Body */}
          <div className="flex-1 overflow-y-auto p-5 md:p-4 space-y-6 no-scrollbar bg-transparent">
            {/* Contextual Greeting */}
            <div className={`p-4 rounded-[20px] border backdrop-blur-md ${cardBg}`}>
              <p className={`text-[13px] md:text-[11px] leading-relaxed text-center font-medium ${isLight ? 'text-zinc-600' : 'text-white/70'}`}>
                {greeting}
              </p>
            </div>
            
            {/* System Controls */}
            <div className="space-y-3">
              <p className={`text-[8px] uppercase tracking-[0.3em] font-black text-center ${isLight ? 'text-zinc-400' : 'text-white/20'}`}>{labels.system}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-3 border rounded-[20px] flex flex-col items-center justify-center gap-2 group transition-all duration-500 ${cardBg}`}>
                  <div className="flex items-center justify-between w-full px-1">
                    <button 
                      onClick={() => onThemeChange?.('nature')}
                      className={`p-1.5 rounded-lg transition-all ${theme === 'nature' ? 'bg-green-400/20 text-green-500' : isLight ? 'text-zinc-300 hover:text-zinc-500' : 'text-white/20 hover:text-white/40'}`}
                      title={labels.natureMode}
                    >
                      <Leaf className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => onThemeChange?.('light')}
                      className={`p-1.5 rounded-lg transition-all ${theme === 'light' ? 'bg-amber-400/20 text-amber-500' : isLight ? 'text-zinc-300 hover:text-zinc-500' : 'text-white/20 hover:text-white/40'}`}
                      title={labels.lightMode}
                    >
                      <Sun className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => onThemeChange?.('dark')}
                      className={`p-1.5 rounded-lg transition-all ${theme === 'dark' ? 'bg-purple-400/20 text-purple-500' : isLight ? 'text-zinc-300 hover:text-zinc-500' : 'text-white/20 hover:text-white/40'}`}
                      title={labels.darkMode}
                    >
                      <Moon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isLight ? 'text-zinc-400' : 'text-white/30'}`}>Theme</span>
                </div>
                <button 
                  onClick={onToggleMusic}
                  className={`p-3 border rounded-[20px] flex flex-col items-center justify-center gap-2 group transition-all duration-500 hover:bg-white/10 ${cardBg}`}
                >
                  <div className="flex items-center justify-center w-full">
                    {!isMuted ? <Volume2 className={`w-4 h-4 animate-pulse ${isLight ? 'text-green-600' : 'text-green-300'}`} /> : <VolumeX className={`w-4 h-4 ${isLight ? 'text-zinc-300' : 'text-white/20'}`} />}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isLight ? 'text-zinc-400' : 'text-white/30'}`}>{labels.music}</span>
                </button>
              </div>
            </div>

            {/* Shortcuts */}
            <div className="space-y-3">
              <p className={`text-[8px] uppercase tracking-[0.3em] font-black text-center ${isLight ? 'text-zinc-400' : 'text-white/20'}`}>{labels.shortcuts}</p>
              <div className="grid grid-cols-1 gap-2.5">
                {quickActions.map((qa, i) => (
                  <button
                    key={i}
                    onClick={qa.action}
                    className={`p-3 border rounded-[16px] text-[13px] md:text-[11px] flex items-center gap-3 transition-all duration-500 active:scale-95 group ${
                      isLight ? 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-900' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md transition-all border ${isLight ? 'bg-zinc-100 border-zinc-200 group-hover:bg-zinc-200' : 'bg-white/10 border-white/5 group-hover:bg-white/20'}`}>
                      <qa.icon className="w-4 h-4 md:w-3.5 md:h-3.5 text-purple-500 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <span className={`font-bold tracking-tight transition-colors ${isLight ? 'text-zinc-600 group-hover:text-zinc-900' : 'text-white/50 group-hover:text-white'}`}>{qa.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-white/5 bg-white/5 text-center">
            <p className="text-[8px] text-white/10 uppercase tracking-widest font-black">ZenGuard Intelligence</p>
          </div>
        </div>
      )}

      {/* Floating Toggle Bubble */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className={`relative group p-0 w-24 md:w-20 h-24 md:h-20 transition-all duration-700 hover:scale-110 active:scale-95 flex items-center justify-center pointer-events-auto ${
          isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100'
        } ${isPeekingActive ? 'animate-sia-peek-right' : 'animate-sia-peek-out'}`}
      >
        <div className="relative w-full h-full flex items-center justify-end">
          <img 
            src="/sia-peeking.png" 
            alt="Sia" 
            className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]" 
          />
        </div>
      </button>

      {/* Premium Pop-up Hint */}
      {!isOpen && (
        <div className={`absolute bottom-20 right-0 mb-6 p-5 bg-white/5 backdrop-blur-[40px] border border-white/20 rounded-[28px] shadow-elite w-72 pointer-events-none border-l-[6px] border-l-purple-500 transition-all duration-700 ${
          isPeekingActive 
            ? 'opacity-100 translate-x-0 translate-y-0 scale-100' 
            : 'opacity-0 translate-x-20 translate-y-4 scale-90'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Navigator</span>
          </div>
          <p className="text-[13px] text-white/80 leading-relaxed font-semibold">
            {greeting}
          </p>
        </div>
      )}
    </div>
  );
}
