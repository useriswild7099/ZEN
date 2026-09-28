'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function BackgroundMusic({ isMuted }: { isMuted: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15;
      audioRef.current.muted = isMuted;
      
      if (!isMuted && audioRef.current.paused) {
        audioRef.current.play().catch(err => console.log("Playback failed:", err));
      }
    }
  }, [isMuted]);

  useEffect(() => {
    // Initial interaction handling can stay here if we want autoplay
    const handleFirstInteraction = () => {
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(err => console.log("Autoplay prevented:", err));
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isMuted]);

  return (
    <audio
      ref={audioRef}
      src="/audio/zen-music.mp3"
      loop
      preload="auto"
    />
  );
}
