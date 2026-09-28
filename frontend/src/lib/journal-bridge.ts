'use client';

import { JournalEntry } from '@/types/journal';

// ── Mindspace-hub mood types ──
export type MoodLevel = 'great' | 'good' | 'okay' | 'low' | 'bad';

export const moodConfig: Record<MoodLevel, { emoji: string; label: string; color: string }> = {
  great: { emoji: '✨', label: 'Wonderful', color: 'mood-great' },
  good:  { emoji: '😊', label: 'Good',      color: 'mood-good' },
  okay:  { emoji: '😐', label: 'Okay',      color: 'mood-okay' },
  low:   { emoji: '😔', label: 'Low',       color: 'mood-low' },
  bad:   { emoji: '🌧️', label: 'Rough',     color: 'mood-bad' },
};

export const moodToValue: Record<MoodLevel, number> = {
  great: 5, good: 4, okay: 3, low: 2, bad: 1,
};

/** Map ZenGuard's 1-10 numeric mood → mindspace-hub 5-level mood */
export function numericToMoodLevel(mood: number): MoodLevel {
  if (mood >= 9) return 'great';
  if (mood >= 7) return 'good';
  if (mood >= 5) return 'okay';
  if (mood >= 3) return 'low';
  return 'bad';
}

/** Get mood chart data for the last N days from ZenGuard entries */
export function getMoodData(
  entries: JournalEntry[],
  days: number = 14
): { date: string; value: number; mood: MoodLevel }[] {
  const result: { date: string; value: number; mood: MoodLevel }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const entry = entries.find(e => {
      const entryDate = new Date(e.date).toISOString().split('T')[0];
      return entryDate === dateStr;
    });
    if (entry) {
      const mood = numericToMoodLevel(entry.pulse.mood);
      result.push({ date: dateStr, value: moodToValue[mood], mood });
    }
  }
  return result;
}

/** Get pixel data for the last 90 days from ZenGuard entries */
export function getPixelData(
  entries: JournalEntry[]
): { date: string; mood?: MoodLevel }[] {
  const days: { date: string; mood?: MoodLevel }[] = [];
  for (let i = 89; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const entry = entries.find(e => {
      const entryDate = new Date(e.date).toISOString().split('T')[0];
      return entryDate === dateStr;
    });
    days.push({
      date: dateStr,
      mood: entry ? numericToMoodLevel(entry.pulse.mood) : undefined,
    });
  }
  return days;
}
