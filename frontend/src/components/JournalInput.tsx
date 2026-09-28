'use client';

import { useState, useRef, useEffect } from 'react';
import { QuickCheckResponse } from '@/lib/api';
import VoiceInput from './VoiceInput';

interface JournalInputProps {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  placeholder: string;
  isAnalyzing: boolean;
  quickCheck: QuickCheckResponse | null;
}

export default function JournalInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  isAnalyzing,
  quickCheck,
}: JournalInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [wordCount, setWordCount] = useState(0);
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(200, textareaRef.current.scrollHeight)}px`;
    }
  }, [value]);

  // Count words
  useEffect(() => {
    const words = value.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };

  // Get tone indicator color
  const getToneColor = () => {
    if (!quickCheck) return 'transparent';
    switch (quickCheck.emotional_tone) {
      case 'positive':
        return 'var(--mood-blooming)';
      case 'concerning':
        return 'var(--mood-seedling)';
      default:
        return 'var(--zen-lavender)';
    }
  };

  return (
    <div className="relative">
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="journal-input w-full"
        style={{
          borderColor: quickCheck ? getToneColor() : undefined,
        }}
        disabled={isAnalyzing}
      />

      {/* Bottom bar */}
      <div className="flex items-center justify-between mt-3 text-sm">
        {/* Left: Word count & quick check */}
        <div className="flex items-center gap-4">
          <span className="text-zinc-400">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          </span>
          
          {quickCheck?.suggestion && (
            <span className="text-purple-300 animate-gentle-pulse">
              💜 {quickCheck.suggestion}
            </span>
          )}
        </div>

        {/* Right: Voice input + Submit button */}
        <div className="flex items-center gap-2">
          <VoiceInput 
            onTranscript={(text) => onChange(value + (value ? ' ' : '') + text)}
            onInterimTranscript={(liveText) => onChange(liveText)}
            disabled={isAnalyzing}
          />
          <button
            onClick={onSubmit}
            disabled={value.trim().length < 10 || isAnalyzing}
            className="btn-zen btn-zen-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Reflecting...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
                Share with ZenGuard
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hint */}
      <p className="text-xs text-zinc-400 mt-2 text-center">
        Press Ctrl+Enter to submit • Your words are never stored
      </p>

      {/* Real-time tone indicator bar */}
      {quickCheck && (
        <div 
          className="absolute bottom-0 left-0 h-0.5 transition-all duration-500"
          style={{
            width: `${quickCheck.intensity * 100}%`,
            backgroundColor: getToneColor(),
          }}
        />
      )}
    </div>
  );
}
