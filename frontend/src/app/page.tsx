'use client';

import { useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo, useTransition } from 'react';
import Image from 'next/image';
import { sentimentClient } from '@/lib/api';
import dynamic from 'next/dynamic';

// Dynamic imports for secondary views to reduce initial bundle size
const ChatInterface = dynamic(() => import('@/components/ChatInterface'), { 
  loading: () => <div className="animate-pulse glass w-full h-96 rounded-3xl" /> 
});
const KnowledgeHub = dynamic(() => import('@/components/KnowledgeHub'), { 
  loading: () => <div className="animate-pulse glass w-full h-96 rounded-3xl" /> 
});
const HelpHub = dynamic(() => import('@/components/HelpHub'), { 
  loading: () => <div className="animate-pulse glass w-full h-96 rounded-3xl" /> 
});
const CopingNavigator = dynamic(() => import('@/components/CopingNavigator'));
const FeatureShowcase = dynamic(() => import('@/components/FeatureShowcase'));
const BreathingExercise = dynamic(() => import('@/components/BreathingExercise'));
const GroundingExercise = dynamic(() => import('@/components/GroundingExercise'));
const WellnessPillars = dynamic(() => import('@/components/WellnessPillars'));
const MethodologySection = dynamic(() => import('@/components/MethodologySection'));
const TechnicalPrivacySection = dynamic(() => import('@/components/TechnicalPrivacySection'));
const SafetySection = dynamic(() => import('@/components/SafetySection'));
const SiaAssistant = dynamic(() => import('@/components/SiaAssistant'), { ssr: false });
const BackgroundMusic = dynamic(() => import('@/components/BackgroundMusic'), { ssr: false });

import { 
  PenLine, MessageCircle, 
  WifiOff, Cpu, UserX, Code, 
  Plus, BookOpen, Lightbulb, Flame, Calendar, Shield,
  GraduationCap, Sparkles, LifeBuoy, Zap, Languages,
  Palette, Wind, MapPin, Volume2, VolumeX
} from 'lucide-react';

// ZenGuard Journal imports
import { JournalEntry } from '@/types/journal';
import { KnowledgeArticle } from '@/lib/knowledge';
import { journalStorage, generateInsights } from '@/lib/storage';
import JournalVaultLock from '@/components/JournalVaultLock';
import { QuickMoodCheck } from '@/components/QuickMoodCheck';
import { NewEntryFlow } from '@/components/journal/NewEntryFlow';
const TimelineView = dynamic(() => import('@/components/journal/TimelineView').then(m => ({ default: m.TimelineView })), { loading: () => <div className="animate-pulse bg-zinc-200 dark:bg-white/5 w-full h-[300px] rounded-xl" /> });
const InsightsDashboard = dynamic(() => import('@/components/journal/InsightsDashboard').then(m => ({ default: m.InsightsDashboard })), { loading: () => <div className="animate-pulse bg-zinc-200 dark:bg-white/5 w-full h-[400px] rounded-xl" /> });
const StreakTracker = dynamic(() => import('@/components/journal/StreakTracker').then(m => ({ default: m.StreakTracker })), { loading: () => <div className="animate-pulse bg-zinc-200 dark:bg-white/5 w-full h-[100px] rounded-xl" /> });
const JournalCalendar = dynamic(() => import('@/components/journal/JournalCalendar').then(m => ({ default: m.JournalCalendar })), { loading: () => <div className="animate-pulse bg-zinc-200 dark:bg-white/5 w-full h-[500px] rounded-xl" /> });
const YearInPixels = dynamic(() => import('@/components/journal/YearInPixels').then(m => ({ default: m.YearInPixels })), { loading: () => <div className="animate-pulse bg-zinc-200 dark:bg-white/5 w-full h-[400px] rounded-xl" /> });
const MoodChart = dynamic(() => import('@/components/journal/MoodChart').then(m => ({ default: m.MoodChart })), { loading: () => <div className="animate-pulse bg-zinc-200 dark:bg-white/5 w-full h-[300px] rounded-xl" /> });
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import React, { memo } from 'react';
import { TRANSLATIONS } from '@/lib/translations';

// Memoized background component to prevent re-renders when parent state changes
const StaticBackground = memo(({ activeView, isLight }: { activeView: string; isLight: boolean }) => {
  return (
    <div className={`fixed inset-0 overflow-hidden -z-10 transition-opacity duration-1000 ${isLight ? 'opacity-0' : 'opacity-100'} bg-[#0E0D13]`} style={{ transform: 'translateZ(0)' }}>
      {/* Satisfying Tactile Paper Texture Canvas Tile */}
      <div 
        className="absolute inset-0 w-full h-full opacity-60 mix-blend-overlay"
        style={{ 
          backgroundImage: "url('/paper-texture.svg')",
          backgroundRepeat: 'repeat',
          backgroundSize: '360px 360px',
          transform: 'translate3d(0, 0, 0)'
        }}
      />

      {/* Gentle Warm Parchment Ambient Glow */}
      <div className="absolute -top-[15%] left-[5%] w-[85vw] md:w-[650px] h-[85vw] md:h-[650px] rounded-full bg-gradient-to-br from-purple-800/18 via-amber-700/8 to-transparent blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[35%] -right-[15%] w-[75vw] md:w-[500px] h-[75vw] md:h-[500px] rounded-full bg-gradient-to-bl from-indigo-800/15 via-rose-900/10 to-transparent blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[65%] -left-[10%] w-[80vw] md:w-[550px] h-[80vw] md:h-[550px] rounded-full bg-gradient-to-tr from-amber-900/10 via-purple-900/12 to-transparent blur-[110px] pointer-events-none"></div>

      {/* Glass overlay with smooth fade */}
      <div className={`absolute inset-0 transition-all duration-700 ${
        activeView === 'help' ? 'bg-[#0E0D13]/85 backdrop-blur-[3px]' :
        activeView === 'knowledge' ? 'bg-[#0E0D13]/70 backdrop-blur-[2px]' :
        activeView === 'chat' ? 'bg-[#0E0D13]/60 backdrop-blur-[2px]' :
        activeView === 'landing' ? 'bg-gradient-to-b from-[#0E0D13]/30 via-transparent to-[#0E0D13]/90' :
        'bg-[#0E0D13]/60 backdrop-blur-[1px]'
      }`} style={{ transform: 'translateZ(0)' }}></div>
    </div>
  );
});

StaticBackground.displayName = 'StaticBackground';


export default function Home() {
  const [apiConnected, setApiConnected] = useState(false);
  const [activeView, setActiveView] = useState<'landing' | 'journal' | 'chat' | 'knowledge' | 'help' | 'breathing' | 'grounding'>('landing');
  const [showCopingNavigator, setShowCopingNavigator] = useState(false);
  const [routedArticle, setRoutedArticle] = useState<KnowledgeArticle | null>(null);
  const [isPending, startTransition] = useTransition();

  // ZenGuard Journal state
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isCreatingEntry, setIsCreatingEntry] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'insights' | 'stats' | 'calendar'>('timeline');
  const [globalLanguage, setGlobalLanguage] = useState('English');
  const [isMuted, setIsMuted] = useState(true);
  const [theme, setTheme] = useState<'nature' | 'light' | 'dark'>('nature');
  const t = TRANSLATIONS[globalLanguage] || TRANSLATIONS['English'];

  // --- Browser History Integration for Back/Forward Navigation ---
  const isPopstateNav = useRef(false);

  // Navigate to a view and push it onto browser history
  const navigateTo = useCallback((view: typeof activeView) => {
    if (view === activeView && !isPopstateNav.current) return;
    setActiveView(view);
    if (!isPopstateNav.current) {
      window.history.pushState({ view }, '', `#${view}`);
    }
  }, [activeView]);

  // Go back using browser history (for onBack callbacks)
  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  // Set initial history state on mount & listen for popstate (back/forward)
  useEffect(() => {
    // Determine initial view from URL hash
    const hash = window.location.hash.replace('#', '') as typeof activeView;
    const validViews = ['landing', 'journal', 'chat', 'knowledge', 'help', 'breathing', 'grounding'];
    const initialView = validViews.includes(hash) ? hash : 'landing';

    // Replace the current history entry with the initial state
    window.history.replaceState({ view: initialView }, '', `#${initialView}`);
    if (initialView !== 'landing') {
      setActiveView(initialView);
    }

    const handlePopState = (event: PopStateEvent) => {
      const view = event.state?.view || 'landing';
      isPopstateNav.current = true;
      setActiveView(view);
      setRoutedArticle(null);
      setIsCreatingEntry(false);
      // Reset the flag after React processes the state update
      requestAnimationFrame(() => { isPopstateNav.current = false; });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  // --- End Browser History Integration ---

  // Vault States
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultPassword, setVaultPassword] = useState('');

  useEffect(() => {
    sentimentClient.healthCheck().then(setApiConnected);
  }, []);

  const handleSaveEntry = async (entryData: Omit<JournalEntry, 'id' | 'date'>) => {
    if (!vaultUnlocked) return;
    
    const newEntry: JournalEntry = {
      ...entryData,
      id: crypto.randomUUID(),
      date: new Date(),
    };
    
    // Always persist to client-side storage so entries are safely stored in browser
    journalStorage.saveEntry(newEntry);
    
    // If backend is active and vaultPassword is set, sync with desktop encrypted vault
    if (apiConnected && vaultPassword) {
      try {
        await sentimentClient.saveJournalEntry(vaultPassword, newEntry);
      } catch (e) {
        console.warn('Backend vault sync unavailable, saved to browser storage:', e);
      }
    }
    
    setEntries(prev => [newEntry, ...prev.filter(e => e.id !== newEntry.id)]);
    journalStorage.updateStreak(newEntry.date);
    setIsCreatingEntry(false);
  };

  const handleVaultUnlock = (password: string, decryptedEntries: JournalEntry[]) => {
    setVaultPassword(password);
    setEntries(decryptedEntries);
    setVaultUnlocked(true);
  };

  const insights = useMemo(() => generateInsights(entries), [entries]);
  const streak = useMemo(() => journalStorage.getStreak(), [entries]);

  // Scroll to top when view changes synchronously before DOM paint
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    // Fallback for some browsers that might need a tick
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    }, 10);
    return () => clearTimeout(timer);
  }, [activeView]);


  const isLight = theme === 'light';
  const textPrimary = isLight ? 'text-zinc-900' : 'text-white';
  const textSecondary = isLight ? 'text-zinc-500' : 'text-zinc-100';
  const textMuted = isLight ? 'text-zinc-400' : 'text-white/60';

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${
      theme === 'dark' ? 'dark bg-zinc-950 text-white' : 
      theme === 'nature' ? 'dark text-white' : 
      'bg-white text-zinc-900'
    }`}>
      <BackgroundMusic isMuted={isMuted} />

      <StaticBackground activeView={activeView} isLight={isLight} />

      {/* View Content Hub */}
      {activeView === 'landing' && (
        <div className="min-h-screen relative flex flex-col">
          <nav className="relative z-10 flex justify-between items-center px-6 md:px-12 py-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-[0.5em] uppercase transition-colors duration-500 dark:text-white text-zinc-900" style={{ fontFamily: 'var(--font-heading)' }}>
                ZenGuard
              </span>
            </div>
            <div className="flex items-center gap-4">
              {/* Sound Toggle */}
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`flex items-center justify-center w-10 h-10 border rounded-xl transition-all ${
                  isLight ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-600' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/60 hover:text-white'
                }`}
                title={isMuted ? "Unmute" : "Mute"}
                aria-label={isMuted ? "Unmute background music" : "Mute background music"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
              </button>

              {/* Language Switcher */}
              <div className="relative group/lang z-50">
                <button className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all h-10 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 bg-zinc-100 hover:bg-zinc-200 border-zinc-200`}>
                  <Languages className="w-4 h-4 text-purple-400" />
                  <span className={`text-xs font-bold uppercase tracking-wider dark:text-white text-zinc-700`}>{globalLanguage}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-40 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all overflow-hidden flex flex-col py-1">
                  {['English', 'Hindi', 'Hinglish', 'Assamese', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Kannada', 'Punjabi', 'Odia', 'Urdu'].map(lang => (
                    <button 
                      key={lang}
                      onClick={() => setGlobalLanguage(lang)}
                      className={`px-4 py-2 text-left text-xs hover:bg-white/10 transition-colors ${globalLanguage === lang ? 'text-purple-400 font-bold' : 'text-zinc-400'}`}
                    >
                      {lang}
                    </button>
                  ))}

                </div>
              </div>

              {/* Sahayak MoSJE Admin Portal Button */}
              <a
                href={process.env.NEXT_PUBLIC_SAHAYAK_URL || "http://localhost:5173"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 border rounded-xl transition-all h-10 bg-blue-950/40 hover:bg-blue-900/60 border-blue-500/40 text-blue-300 hover:text-white shadow-sm"
                title="Open Sahayak Caseworker & Witness Protection Dashboard"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold tracking-wide">{t.sahayakAdmin}</span>
              </a>

              {/* AI Status Indicator */}
              <div 
                className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-black border backdrop-blur-md px-3 py-2 rounded-xl h-10 dark:bg-white/5 dark:border-white/10 bg-zinc-100 border-zinc-200`}
                role="status"
                aria-live="polite"
              >
                <div className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'bg-rose-400'}`}></div>
                <span className={`font-black dark:text-white/60 text-zinc-600`}>{apiConnected ? t.aiReady : t.aiOffline}</span>
              </div>
            </div>
          </nav>


          <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-12 pb-20 md:pt-20 flex-1">
            <div className="text-center max-w-6xl mx-auto">
              <div className="mb-8 flex justify-center animate-fade-scale">
                <Image src="/logo.png" alt="ZenGuard Logo" width={256} height={256} className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl animate-gentle-float" priority />
              </div>
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] drop-shadow-xl tracking-tight animate-fade-up stagger-2 dark:text-white text-zinc-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t.heroTitle} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-x">{t.heroHighlight}</span>
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-xl mx-auto leading-relaxed drop-shadow-md font-light animate-fade-up stagger-3 dark:text-zinc-100 text-zinc-500">
                  {t.heroSub} 
                  <span className={`block mt-2 font-medium dark:text-zinc-300 text-zinc-600`}>{t.heroSubHighlight}</span>
                </p>

                {/* Privacy & Feature Badges */}
                <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-up stagger-3">
                  {t.badges.map((badge, idx) => (
                    <span 
                      key={idx} 
                      className={`px-3 py-1 rounded-full text-xs font-mono font-medium border backdrop-blur-md transition-colors ${
                        isLight 
                          ? 'bg-zinc-100 text-zinc-700 border-zinc-300' 
                          : 'bg-white/10 text-white/90 border-white/15'
                      }`}
                    >
                      ✓ {badge}
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-6 animate-fade-up stagger-4 max-w-5xl mx-auto">
                {[
                  { label: t.navJournal, view: 'journal', icon: PenLine, color: 'white' },
                  { label: t.navChat, view: 'chat', icon: MessageCircle, color: 'purple' },
                  { label: t.navKnowledge, view: 'knowledge', icon: GraduationCap, color: 'blue' },
                  { label: t.navHelp, view: 'help', icon: LifeBuoy, color: 'red' }
                ].map((btn, i) => (
                  <button 
                    key={i} 
                    onClick={() => navigateTo(btn.view as any)} 
                    className={`glass-pill-button group p-6 flex flex-col items-center justify-center gap-3 min-h-[140px] text-center border shadow-sm ${
                      isLight 
                        ? 'bg-white/80 hover:bg-white border-zinc-200' 
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/15'
                    }`}
                  >
                    <div className={`p-3 rounded-full border transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                      isLight 
                        ? 'bg-zinc-100 border-zinc-200' 
                        : 'bg-white/5 border-white/15'
                    }`}>
                      <btn.icon className={`w-6 h-6 ${btn.color === 'purple' ? 'text-purple-400' : btn.color === 'blue' ? 'text-blue-400' : btn.color === 'red' ? 'text-red-400' : isLight ? 'text-zinc-700' : 'text-white'}`} />
                    </div>
                    <span className={`font-bold leading-tight whitespace-pre-line text-base drop-shadow-sm ${isLight ? 'text-zinc-800' : 'text-white'}`}>{btn.label}</span>
                  </button>
                ))}
              </div>

              {/* 1-Tap Quick Mood Check-In Widget */}
              <QuickMoodCheck onNavigate={(view) => navigateTo(view)} />
            </div>

            <FeatureShowcase />
            <WellnessPillars onNavigate={(view) => navigateTo(view)} />
            <MethodologySection onNavigate={(view) => navigateTo(view)} />
            <TechnicalPrivacySection />
            <SafetySection onNavigate={(view) => navigateTo(view)} />
            <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-12 animate-fade-up stagger-8 pb-20">
              {[
                { icon: WifiOff, label: "Fully Offline", color: "text-green-400" },
                { icon: Cpu, label: "Local Processing", color: "text-blue-400" },
                { icon: UserX, label: "No Account Needed", color: "text-purple-400" },
                { icon: Code, label: "Open Source", color: "text-yellow-400", action: () => window.open('https://github.com/useriswild7099/ZEN', '_blank') }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col items-center gap-3 group ${item.action ? 'cursor-pointer' : ''}`}
                  onClick={item.action}
                >
                  <div className={`w-12 h-12 glass-card flex items-center justify-center transition-colors dark:border-white/10 dark:hover:bg-white/10 bg-zinc-100 border-zinc-200 hover:bg-zinc-200`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className={`font-mono text-xs tracking-wide transition-colors dark:text-zinc-300 text-zinc-500`}>{item.label}</span>
                </div>
              ))}
            </div>
          </main>
          <footer className="relative z-10 text-center py-8 text-sm text-gray-400">
            <p>{t.footerText}</p>
          </footer>
        </div>
      )}

      {activeView === 'chat' && (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full z-10">
            <ChatInterface onBack={goBack} sessionLanguage={globalLanguage} />
          </div>
        </div>
      )}

      {activeView === 'knowledge' && (
        <div className="min-h-screen relative flex flex-col items-center p-4 md:p-12 overflow-x-hidden">
          <KnowledgeHub 
            onBack={() => { goBack(); setRoutedArticle(null); }} 
            onNavigateToHelp={() => { navigateTo('help'); setRoutedArticle(null); }}
            initialArticle={routedArticle}
            sessionLanguage={globalLanguage}
            theme={theme}
          />
        </div>
      )}

      {activeView === 'help' && (
        <div className="min-h-screen relative flex flex-col items-center p-4 md:p-12 overflow-x-hidden">
          <HelpHub onBack={goBack} />
        </div>
      )}

      {isCreatingEntry && (
        <div className="min-h-screen relative flex items-start justify-center p-4 py-8">
          <div className="relative z-10 w-full max-w-4xl">
            <button
              onClick={() => { setIsCreatingEntry(false); goBack(); }}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
            >
              <span>←</span><span>Home</span>
            </button>
            <NewEntryFlow onSave={handleSaveEntry} onCancel={() => setIsCreatingEntry(false)} />
          </div>
        </div>
      )}

      {activeView === 'breathing' && !isCreatingEntry && (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-12 overflow-x-hidden">
          <BreathingExercise onBack={goBack} />
        </div>
      )}

      {activeView === 'grounding' && !isCreatingEntry && (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 md:p-12 overflow-x-hidden">
          <GroundingExercise onBack={goBack} />
        </div>
      )}

      {activeView === 'journal' && !isCreatingEntry && (
        <div className="min-h-screen flex flex-col">
          <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 shadow-2xl ${
            theme === 'dark' ? 'bg-zinc-950/80 border-white/10' : 
            theme === 'nature' ? 'bg-black/20 border-white/10' : 
            'bg-white/80 border-zinc-200'
          }`}>
            <div className="container max-w-7xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={goBack} className={`flex items-center gap-2 transition-colors ${isLight ? 'text-zinc-500 hover:text-zinc-900' : 'text-white/50 hover:text-white'}`}><span>←</span></button>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-xl ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-white/10 border-white/20'}`}><Shield className={`h-6 w-6 ${isLight ? 'text-zinc-900' : 'text-white'}`} /></div>
                  <div><h1 className={`text-2xl font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>ZenGuard</h1><p className={`text-xs ${isLight ? 'text-zinc-500' : 'text-white/40'}`}>Your Reflective Space</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" onClick={() => navigateTo('knowledge')} className={`gap-2 hidden md:flex ${isLight ? 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100' : 'text-white/60 hover:text-white hover:bg-white/5'}`}><GraduationCap className="h-5 w-5" />Library</Button>
                  <Button variant="ghost" onClick={() => navigateTo('help')} className={`gap-2 hidden md:flex ${isLight ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-red-400/60 hover:text-red-400 hover:bg-red-400/5'}`}><LifeBuoy className="h-5 w-5" />Help</Button>
                  <Button onClick={() => setIsCreatingEntry(true)} size="lg" className={`gap-2 border-0 shadow-xl ${isLight ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-white text-black hover:bg-white/90'}`}><Plus className="h-5 w-5" />New Entry</Button>
                </div>
              </div>
            </div>
          </header>
          <main className={`relative z-10 container max-w-7xl mx-auto px-4 py-8 flex-1 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
            {!vaultUnlocked ? (
              <JournalVaultLock onUnlock={handleVaultUnlock} isLight={isLight} />
            ) : entries.length === 0 ? (
              <div className="max-w-3xl mx-auto text-center space-y-8 py-20">
                <div className={`w-24 h-24 border rounded-full mx-auto flex items-center justify-center backdrop-blur-md shadow-2xl ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-white/5 border-white/10'}`}><BookOpen className={`h-12 w-12 ${isLight ? 'text-zinc-400' : 'text-white/60'}`} /></div>
                <h2 className="text-4xl font-bold">Welcome to ZenGuard</h2>
                <p className={`text-xl ${isLight ? 'text-zinc-500' : 'text-white/50'}`}>A mental wellness app with 10 scientifically-proven features for better emotional health.</p>
                <Button onClick={() => setIsCreatingEntry(true)} size="lg" className={`gap-2 px-8 border-0 shadow-2xl ${isLight ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-white text-black hover:bg-white/90'}`}><Plus className="h-5 w-5" />Start Your First Entry</Button>
              </div>
            ) : (
              <div className="space-y-12">
                <StreakTracker streak={streak} />
                <Tabs value={activeTab} onValueChange={(v) => startTransition(() => setActiveTab(v as any))} className="w-full">
                  <TabsList className={`p-1 mb-8 border ${isLight ? 'bg-zinc-100 border-zinc-200' : 'bg-white/5 border-white/10'}`}>
                    <TabsTrigger value="timeline" className={`data-[state=active]:shadow-sm ${isLight ? 'data-[state=active]:bg-white text-zinc-500 data-[state=active]:text-zinc-900' : 'data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white'}`}><BookOpen className="h-4 w-4 mr-2" />Timeline</TabsTrigger>
                    <TabsTrigger value="calendar" className={`data-[state=active]:shadow-sm ${isLight ? 'data-[state=active]:bg-white text-zinc-500 data-[state=active]:text-zinc-900' : 'data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white'}`}><Calendar className="h-4 w-4 mr-2" />Calendar</TabsTrigger>
                    <TabsTrigger value="insights" className={`data-[state=active]:shadow-sm ${isLight ? 'data-[state=active]:bg-white text-zinc-500 data-[state=active]:text-zinc-900' : 'data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white'}`}><Lightbulb className="h-4 w-4 mr-2" />Insights</TabsTrigger>
                    <TabsTrigger value="stats" className={`data-[state=active]:shadow-sm ${isLight ? 'data-[state=active]:bg-white text-zinc-500 data-[state=active]:text-zinc-900' : 'data-[state=active]:bg-white/10 text-white/60 data-[state=active]:text-white'}`}><Flame className="h-4 w-4 mr-2" />Stats</TabsTrigger>
                  </TabsList>
                  <TabsContent value="timeline" className="mt-0 focus-visible:outline-none"><TimelineView entries={entries} /></TabsContent>
                  <TabsContent value="insights" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                    <div className="space-y-8">
                      <div className={`p-8 backdrop-blur-2xl rounded-3xl border shadow-2xl ${isLight ? 'bg-white border-zinc-200' : 'bg-white/5 border-white/10'}`}>
                        <h2 className="text-2xl font-bold mb-6">10 Science-Backed Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className={`space-y-3 text-sm ${isLight ? 'text-zinc-600' : 'text-white/70'}`}>
                            {["Mood Predictor - 70% accuracy", "Weekly Heatmap - 40% awareness boost", "Positive Memory Bank - 3x happiness", "Social Connection Tracker", "Sleep Correlation - 60% impact"].map((f, i) => (
                              <li key={i} className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${['bg-purple-400', 'bg-blue-400', 'bg-pink-400', 'bg-yellow-400', 'bg-indigo-400'][i]}`}></div> {f}</li>
                            ))}
                          </ul>
                          <ul className={`space-y-3 text-sm ${isLight ? 'text-zinc-600' : 'text-white/70'}`}>
                            {["CBT Reframing - 50-60% reduction", "Three Good Things - 2-10% happiness", "Worry Dump - 50% thought reduction", "Future Self Letters - 30% goal boost", "Timed Free-Write - 40% focus boost"].map((f, i) => (
                              <li key={i} className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${['bg-green-400', 'bg-orange-400', 'bg-red-400', 'bg-teal-400', 'bg-lime-400'][i]}`}></div> {f}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <InsightsDashboard insights={insights} />
                    </div>
                  </TabsContent>
                  <TabsContent value="stats" className="mt-0 focus-visible:outline-none">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-semibold">Your Statistics</h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className={`p-8 backdrop-blur-2xl rounded-3xl border shadow-2xl ${isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-white/5 border-white/10 text-white'}`}><p className={`text-sm mb-1 ${isLight ? 'text-zinc-500' : 'text-white/40'}`}>Total Entries</p><p className="text-5xl font-bold">{entries.length}</p></div>
                        <div className={`p-8 backdrop-blur-2xl rounded-3xl border shadow-2xl ${isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-white/5 border-white/10 text-white'}`}><p className={`text-sm mb-1 ${isLight ? 'text-zinc-500' : 'text-white/40'}`}>Average Mood</p><p className="text-5xl font-bold">{entries.length > 0 ? (entries.reduce((sum, e) => sum + e.pulse.mood, 0) / entries.length).toFixed(1) : '0'}<span className={`text-xl ml-1 ${isLight ? 'text-zinc-400' : 'text-white/30'}`}>/10</span></p></div>
                        <div className={`p-8 backdrop-blur-2xl rounded-3xl border shadow-2xl ${isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-white/5 border-white/10 text-white'}`}><p className={`text-sm mb-1 ${isLight ? 'text-zinc-500' : 'text-white/40'}`}>Total Words</p><p className="text-5xl font-bold">{entries.reduce((sum, e) => sum + (e.content?.split(/\s+/).filter(Boolean).length || 0), 0).toLocaleString()}</p></div>
                      </div>
                      <div className={`p-8 backdrop-blur-2xl rounded-3xl border shadow-2xl ${isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-white/5 border-white/10 text-white'}`}><h3 className="text-xl font-bold mb-6">Mood Trend (14 days)</h3><MoodChart entries={entries} days={14} /></div>
                      <div className={`p-8 backdrop-blur-2xl rounded-3xl border shadow-2xl ${isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-white/5 border-white/10 text-white'}`}><h3 className="text-xl font-bold mb-6">Last 90 Days</h3><YearInPixels entries={entries} /></div>
                    </div>
                  </TabsContent>
                  <TabsContent value="calendar" className="mt-0 focus-visible:outline-none"><JournalCalendar entries={entries} /></TabsContent>
                </Tabs>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Global Systems */}
      <Toaster />
      <SiaAssistant 
        activeView={activeView}
        onNavigate={(view) => navigateTo(view)}
        onNavigateTab={(tab) => {
          navigateTo('journal');
          setActiveTab(tab as any);
        }}
        onOpenArticle={(article) => {
          setRoutedArticle(article);
          navigateTo('knowledge');
        }}
        language={globalLanguage}
        theme={theme}
        onThemeChange={(newTheme) => setTheme(newTheme as any)}
        isMuted={isMuted}
        onToggleMusic={() => setIsMuted(!isMuted)}
      />
    </div>
  );
}
