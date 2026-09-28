'use client';

import { useCallback, useRef } from 'react';
import { useWhisper } from '@/hooks/useWhisper';
import { Mic, Square, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onInterimTranscript?: (text: string) => void; // Real-time updates
  disabled?: boolean;
  className?: string;
}

export default function VoiceInput({ 
  onTranscript, 
  onInterimTranscript,
  disabled = false, 
  className = '' 
}: VoiceInputProps) {
  const baseTextRef = useRef<string>('');
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;
  
  const handleInterim = useCallback((text: string) => {
    // Stream to textarea in real-time
    if (onInterimTranscript) {
      onInterimTranscript(baseTextRef.current + text);
    }
  }, [onInterimTranscript]);

  const {
    isRecording,
    isProcessing,
    error,
    startRecording: start,
    stopRecording: stop,
  } = useWhisper({ 
    onInterimResult: handleInterim,
    silenceTimeout: 4000 // Auto-stop after 4s silence
  });

  const handleClick = useCallback(() => {
    if (disabled || isProcessing) return;

    if (isRecording) {
      const finalText = stop();
      if (finalText) {
        onTranscriptRef.current(finalText);
      }
    } else {
      // Store current textarea content before starting
      baseTextRef.current = '';
      start();
    }
  }, [disabled, isProcessing, isRecording, start, stop]);

  const state = isProcessing ? 'processing' : isRecording ? 'recording' : 'idle';

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isProcessing}
        className={`
          p-2.5 rounded-full transition-all duration-300 
          ${state === 'recording' 
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' 
            : state === 'processing'
            ? 'bg-purple-600/50 text-white cursor-wait'
            : 'bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          border border-white/10 hover:border-white/20
        `}
        aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
        title={isRecording ? 'Click to stop (or wait for auto-stop)' : 'Click to speak'}
      >
        {state === 'processing' ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : state === 'recording' ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </button>

      {error && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 
                        bg-red-950/90 text-xs text-red-200 rounded-xl max-w-xs text-center leading-tight
                        border border-red-500/30 shadow-xl backdrop-blur-md z-50">
          {error}
        </div>
      )}

      {isRecording && (
        <>
          <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-75" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        </>
      )}
    </div>
  );
}
