'use client';

import { motion } from 'framer-motion';
import { JournalEntry } from '@/types/journal';
import { getPixelData, moodConfig, MoodLevel } from '@/lib/journal-bridge';

const moodColorMap: Record<MoodLevel, string> = {
  great: 'bg-mood-great',
  good:  'bg-mood-good',
  okay:  'bg-mood-okay',
  low:   'bg-mood-low',
  bad:   'bg-mood-bad',
};

interface YearInPixelsProps {
  entries: JournalEntry[];
}

export function YearInPixels({ entries }: YearInPixelsProps) {
  const days = getPixelData(entries);

  return (
    <div>
      <div className="grid grid-cols-10 gap-1">
        {days.map((day, i) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.008, duration: 0.3 }}
            className={`aspect-square rounded-sm ${
              day.mood ? moodColorMap[day.mood] : 'bg-white/10'
            } hover:ring-1 hover:ring-purple-400/30 transition-all cursor-default`}
            title={`${day.date}${day.mood ? ': ' + moodConfig[day.mood].label : ''}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 justify-center">
        {(Object.entries(moodConfig) as [MoodLevel, typeof moodConfig.great][]).map(([mood, config]) => (
          <div key={mood} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-sm ${moodColorMap[mood]}`} />
            <span className="text-[10px] text-white/40">{config.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
