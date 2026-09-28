'use client';

import { Intervention } from '@/lib/api';

interface InterventionCardsProps {
  interventions: Intervention[];
  onSelect: (type: string) => void;
}

// Icons for each intervention type
const INTERVENTION_ICONS: Record<string, string> = {
  breathing: '🌬️',
  grounding: '🌍',
  memory_box: '📦',
  affirmation: '💜',
  music: '🎵',
  journaling: '✍️',
};

// Colors for each intervention type
const INTERVENTION_COLORS: Record<string, string> = {
  breathing: '#D5F2E8',
  grounding: '#E8D5F2',
  memory_box: '#F2E8D5',
  affirmation: '#D5E8F2',
  music: '#F2D5E8',
  journaling: '#E8F2D5',
};

export default function InterventionCards({ interventions, onSelect }: InterventionCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {interventions.map((intervention, index) => (
        <button
          key={intervention.type}
          onClick={() => onSelect(intervention.type)}
          className="glass-card text-left group p-5 hover:bg-white/20"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {/* Icon & Title */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl group-hover:scale-110 transition-transform">
              {INTERVENTION_ICONS[intervention.type] || '✨'}
            </span>
            <h4 className="font-semibold text-white">
              {intervention.title}
            </h4>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-300 leading-relaxed">
            {intervention.description}
          </p>

          {/* Action hint */}
          <div className="mt-3 text-xs text-zinc-400 group-hover:text-white transition-colors">
            Click to start →
          </div>
        </button>
      ))}
    </div>
  );
}
