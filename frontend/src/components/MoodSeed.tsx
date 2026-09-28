'use client';

import { useEffect, useState } from 'react';

interface MoodSeedProps {
  stage: string;
  color: string;
  wellnessScore: number;
  confidence: number;
}

// Mood stage visual configurations
const STAGE_CONFIG: Record<string, { emoji: string; label: string; scale: number }> = {
  flourishing: { emoji: '🌸', label: 'Flourishing', scale: 1.2 },
  blooming: { emoji: '🌷', label: 'Blooming', scale: 1.1 },
  growing: { emoji: '🌱', label: 'Growing', scale: 1.0 },
  seedling: { emoji: '🌿', label: 'Seedling', scale: 0.9 },
  withered: { emoji: '🍂', label: 'Needs Care', scale: 0.8 },
};

export default function MoodSeed({ stage, color, wellnessScore, confidence }: MoodSeedProps) {
  const [isVisible, setIsVisible] = useState(false);
  const config = STAGE_CONFIG[stage] || STAGE_CONFIG.growing;

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Main mood visualization */}
      <div
        className={`mood-seed transition-all duration-700 ${isVisible ? 'animate-seed-grow' : 'opacity-0'}`}
        style={{
          transform: `scale(${config.scale})`,
        }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute inset-0 rounded-full opacity-30 animate-breathe"
          style={{
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          }}
        />
        
        {/* Pulse ripple */}
        <div
          className="mood-seed-ripple"
          style={{ color: color }}
        />
        
        {/* Inner circle */}
        <div
          className="mood-seed-inner flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${color}80 0%, ${color} 100%)`,
          }}
        >
          <span className="text-4xl">{config.emoji}</span>
        </div>
      </div>

      {/* Stage label */}
      <div className={`mt-6 text-center transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <h3 className="text-2xl font-semibold text-gray-700" style={{ fontFamily: 'var(--font-heading)' }}>
          {config.label}
        </h3>
        
        {/* Wellness score bar */}
        <div className="mt-4 w-48 mx-auto">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Wellness</span>
            <span>{Math.round(wellnessScore)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${wellnessScore}%`,
                backgroundColor: color,
              }}
            />
          </div>
          
          {/* Confidence indicator */}
          <div className="mt-2 text-xs text-gray-400">
            Confidence: {Math.round(confidence * 100)}%
          </div>
        </div>
      </div>

      {/* Decorative elements based on stage */}
      {stage === 'flourishing' && (
        <div className="mt-4 flex gap-2">
          {['✨', '🌟', '✨'].map((star, i) => (
            <span
              key={i}
              className="animate-gentle-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {star}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
