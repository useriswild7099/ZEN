'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight, Download, Clock, Zap, Moon, Volume2, VolumeX } from 'lucide-react';
import EmotionPicker, { Emotion, EMOTION_PROMPTS, getTimeBasedPrompt } from './EmotionPicker';
import { BurnAnimation, ExportOptions, EphemeralBadge, EndOfSessionRitual, TimerDisplay } from './JournalFeatures';
import ReleaseLoopSystem from './ReleaseLoopSystem';
import VoiceInput from './VoiceInput';

// Journal mode types
type JournalMode = 'free' | 'timed' | 'void';

interface EnhancedJournalProps {
  onSubmit: (text: string) => void;
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export default function EnhancedJournal({ onSubmit, onAnalyze, isAnalyzing }: EnhancedJournalProps) {
  // Core state
  const [text, setText] = useState('');
  const [mode, setMode] = useState<JournalMode>('free');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState(getTimeBasedPrompt());
  
  // Feature states
  const [showBurn, setShowBurn] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showEndRitual, setShowEndRitual] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  
  // Timed mode
  const [timedDuration, setTimedDuration] = useState(300); // 5 minutes
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Void mode
  const [isVoidMode, setIsVoidMode] = useState(false);
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);
  const [showReleaseLoop, setShowReleaseLoop] = useState(false);
  
  // Ambient sound
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Typing speed tracking
  const [typingSpeed, setTypingSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const lastKeyTime = useRef(Date.now());
  const keyCount = useRef(0);

  // Update prompt based on emotion
  useEffect(() => {
    if (selectedEmotion) {
      const prompts = EMOTION_PROMPTS[selectedEmotion.promptTone];
      setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    }
  }, [selectedEmotion]);

  // Timer logic
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(t => {
        if (t <= 1) {
          setIsTimerActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  // Track typing speed
  const handleTextChange = (newText: string) => {
    setText(newText);
    
    const now = Date.now();
    const timeDiff = now - lastKeyTime.current;
    keyCount.current++;
    
    if (keyCount.current % 10 === 0) {
      if (timeDiff < 100) setTypingSpeed('fast');
      else if (timeDiff > 500) setTypingSpeed('slow');
      else setTypingSpeed('normal');
    }
    
    lastKeyTime.current = now;
  };

  // Burn effect
  const handleBurn = useCallback(() => {
    setIsBurning(true);
    setTimeout(() => {
      setText('');
      setIsBurning(false);
      setShowEndRitual(true);
    }, 2500);
  }, []);

  // Start timed session
  const startTimedSession = (seconds: number) => {
    setTimedDuration(seconds);
    setTimeRemaining(seconds);
    setIsTimerActive(true);
    setMode('timed');
  };

  // Toggle void mode
  const toggleVoidMode = () => {
    setIsVoidMode(!isVoidMode);
    setMode(isVoidMode ? 'free' : 'void');
  };

  // Ambient sound toggle
  const toggleAmbientSound = (sound: string) => {
    if (ambientSound === sound) {
      audioRef.current?.pause();
      setAmbientSound(null);
    } else {
      setAmbientSound(sound);
      // Would load audio here - placeholder for now
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  return (
    <>
      {/* Burn Animation Overlay */}
      {isBurning && <BurnAnimation onComplete={() => setIsBurning(false)} />}
      
      {/* Export Modal */}
      {showExport && <ExportOptions text={text} onClose={() => setShowExport(false)} />}
      
      {/* End of Session Ritual */}
      {showEndRitual && <EndOfSessionRitual onClose={() => setShowEndRitual(false)} />}

      {/* Release Loop System */}
      {showReleaseLoop && (
        <ReleaseLoopSystem 
          text={text}
          onComplete={() => {
            setShowReleaseLoop(false);
            setText('');
            toggleVoidMode();
          }}
          onClose={() => setShowReleaseLoop(false)}
        />
      )}

      <div className={`transition-all duration-1000 space-y-4 ${isVoidMode ? 'glass-card p-8 min-h-[60vh] flex flex-col justify-center' : ''}`}>
        {/* Ephemeral Badge */}
        {!isVoidMode && (
          <div className="text-center">
            <EphemeralBadge />
          </div>
        )}

        {/* Mode Selector - hidden in void mode */}
        {!isVoidMode && (
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setMode('free')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                mode === 'free' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              Free Write
            </button>
            <button
              onClick={() => startTimedSession(300)}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                mode === 'timed' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              <Clock className="w-4 h-4" />
              5 Min Session
            </button>
            <button
              onClick={toggleVoidMode}
              className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 ${
                mode === 'void' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10'
              }`}
            >
              <Moon className="w-4 h-4" />
              Void Mode
            </button>
          </div>
        )}

        {/* Emotion Picker - hidden in void mode */}
        {!isVoidMode && mode === 'free' && (
          <EmotionPicker 
            onSelect={setSelectedEmotion} 
            selectedEmotion={selectedEmotion} 
          />
        )}

        {/* Timer Display for timed mode */}
        {mode === 'timed' && isTimerActive && (
          <TimerDisplay seconds={timeRemaining} totalSeconds={timedDuration} />
        )}

        {/* Dynamic prompt */}
        {!isVoidMode && (
          <p className="text-center text-zinc-400 text-sm italic mb-2">
            {typingSpeed === 'fast' ? 'Let it all out...' : currentPrompt}
          </p>
        )}

        {/* Main Textarea */}
        <div className={`relative ${isBurning ? 'animate-burn-text' : ''}`}>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={isVoidMode ? '' : currentPrompt}
            disabled={isAnalyzing}
            className={`journal-input ${
              isVoidMode 
                ? 'bg-transparent border-none focus:ring-0 text-white/80' 
                : ''
            } ${selectedEmotion ? `bg-gradient-to-br ${selectedEmotion.gradient}` : ''}`}
            style={{
              minHeight: isVoidMode ? '60vh' : '200px',
              fontWeight: typingSpeed === 'fast' ? '400' : '300',
            }}
          />
        </div>

        {/* Footer Actions - hidden in void mode */}
        {!isVoidMode && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">
              {wordCount} words
            </span>
            
            <div className="flex items-center gap-2">
              {/* Voice Input */}
              <VoiceInput 
                onTranscript={(newText) => setText(prev => prev + (prev ? ' ' : '') + newText)}
                onInterimTranscript={(liveText) => setText(liveText)}
                disabled={isAnalyzing}
              />
              
              {/* Ambient Sound Toggle */}
              <button
                onClick={() => toggleAmbientSound('rain')}
                className={`p-2 rounded-lg transition-colors ${
                  ambientSound ? 'bg-purple-500/30 text-purple-300' : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                }`}
                title="Ambient sounds"
              >
                {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Export */}
              <button
                onClick={() => setShowExport(true)}
                disabled={!text.trim()}
                className="p-2 rounded-lg bg-white/5 text-zinc-400 hover:bg-white/10 disabled:opacity-50 transition-colors"
                title="Export"
              >
                <Download className="w-4 h-4" />
              </button>

              {/* Go - Submit for analysis */}
              <button
                onClick={() => onAnalyze(text)}
                disabled={!text.trim() || isAnalyzing || (mode === 'timed' && isTimerActive)}
                className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Go
              </button>


            </div>
          </div>
        )}

        {/* Void Mode Exit */}
        {isVoidMode && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            <button
              onClick={() => {
                if (text.trim()) {
                  setShowVoidConfirm(true);
                } else {
                  toggleVoidMode();
                }
              }}
              className="px-6 py-3 bg-white/5 text-zinc-400 hover:text-white rounded-full transition-colors"
            >
              {text.trim() ? 'Let it go' : 'Exit void'}
            </button>
          </div>
        )}

        {/* Void Mode Confirmation Dialog */}
        {showVoidConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="glass-card p-6 max-w-sm w-full mx-4 text-center">
              <h3 className="text-white text-lg font-semibold mb-3">Release your words?</h3>
              <p className="text-zinc-400 text-sm mb-6">
                This will permanently erase what you wrote. Nothing will be saved.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowVoidConfirm(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Keep writing
                </button>
                <button
                  onClick={() => {
                    setShowVoidConfirm(false);
                    setShowReleaseLoop(true);
                  }}
                  className="px-4 py-2 bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 rounded-lg transition-colors"
                >
                  Let it go
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
