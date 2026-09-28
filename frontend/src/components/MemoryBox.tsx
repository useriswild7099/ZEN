'use client';

import { useState } from 'react';
import VoiceInput from './VoiceInput';

interface MemoryBoxProps {
  onClose: () => void;
}

const MEMORY_PROMPTS = [
  {
    emoji: '🌅',
    title: 'A peaceful moment',
    prompt: 'Describe a time when you felt completely at peace...',
  },
  {
    emoji: '😊',
    title: 'Someone who made you smile',
    prompt: 'Think of someone whose kindness touched you...',
  },
  {
    emoji: '🏆',
    title: 'A proud accomplishment',
    prompt: 'Remember something you achieved that made you proud...',
  },
  {
    emoji: '🎉',
    title: 'A joyful celebration',
    prompt: 'Recall a time when you felt pure joy...',
  },
  {
    emoji: '🤗',
    title: 'Feeling loved',
    prompt: 'Remember a moment when you felt truly loved...',
  },
];

export default function MemoryBox({ onClose }: MemoryBoxProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [memory, setMemory] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [savedMemories, setSavedMemories] = useState<string[]>([]);

  const currentPrompt = MEMORY_PROMPTS[currentPromptIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSaveMemory = () => {
    if (memory.trim()) {
      setSavedMemories([...savedMemories, memory]);
      setMemory('');
      setIsFlipped(false);
      
      // Move to next prompt
      if (currentPromptIndex < MEMORY_PROMPTS.length - 1) {
        setCurrentPromptIndex(prev => prev + 1);
      }
    }
  };

  const handleNextPrompt = () => {
    setCurrentPromptIndex((prev) => (prev + 1) % MEMORY_PROMPTS.length);
    setMemory('');
    setIsFlipped(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-white mb-2 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          📦 Memory Box
        </h2>
        <p className="text-zinc-300 mb-6 text-center">
          Recall happy moments to lift your spirits
        </p>

        {/* Card container with flip animation */}
        <div 
          className="relative h-64 mb-6 cursor-pointer perspective-1000"
          onClick={handleFlip}
        >
          <div 
            className={`absolute inset-0 transition-all duration-500 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front of card */}
            <div 
              className="absolute inset-0 rounded-xl p-6 flex flex-col items-center justify-center text-center backface-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(168, 139, 250, 0.2) 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backfaceVisibility: 'hidden',
              }}
            >
              <span className="text-5xl mb-4">{currentPrompt.emoji}</span>
              <h3 className="text-xl font-semibold text-white mb-2">
                {currentPrompt.title}
              </h3>
              <p className="text-zinc-300 text-sm">
                {currentPrompt.prompt}
              </p>
              <p className="text-xs text-zinc-400 mt-4">
                Tap to reflect
              </p>
            </div>

            {/* Back of card */}
            <div 
              className="absolute inset-0 rounded-xl p-6 flex flex-col backface-hidden"
              style={{
                background: 'rgba(30, 30, 40, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <VoiceInput 
                  onTranscript={(text) => setMemory(prev => prev + (prev ? ' ' : '') + text)}
                  onInterimTranscript={(liveText) => setMemory(liveText)}
                />
                <p className="text-sm text-zinc-300">✨ {currentPrompt.title}</p>
              </div>
              <textarea
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                placeholder="Write your memory here... (not saved anywhere)"
                className="flex-1 p-3 border border-white/20 bg-white/10 rounded-lg resize-none text-white placeholder:text-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 outline-none"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFlip();
                  }}
                  className="btn-zen btn-zen-secondary text-sm py-2"
                >
                  ← Back
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveMemory();
                  }}
                  disabled={!memory.trim()}
                  className="btn-zen btn-zen-primary text-sm py-2 flex-1 disabled:opacity-50"
                >
                  This made me smile 😊
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Saved memories count */}
        {savedMemories.length > 0 && (
          <p className="text-center text-sm text-green-600 mb-4 animate-gentle-pulse">
            ✨ {savedMemories.length} happy {savedMemories.length === 1 ? 'memory' : 'memories'} reflected on!
          </p>
        )}

        {/* Navigation */}
        <div className="flex gap-4 justify-center">
          <button onClick={handleNextPrompt} className="btn-zen btn-zen-secondary">
            Different prompt
          </button>
          <button onClick={onClose} className="btn-zen btn-zen-primary">
            Done
          </button>
        </div>

        {/* Privacy notice */}
        <p className="text-xs text-zinc-400 text-center mt-4">
          🔒 Your memories stay in your heart, not on our servers
        </p>
      </div>
    </div>
  );
}
