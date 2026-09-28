import { JournalEntry, InsightCard, StreakData } from '@/types/journal';

const STORAGE_KEY = 'zenguard_entries';
const STREAK_KEY = 'zenguard_streak';

export const journalStorage = {
  getEntries: (): JournalEntry[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      }));
    } catch (error) {
      console.error('Error loading entries:', error);
      return [];
    }
  },

  saveEntry: (entry: JournalEntry): void => {
    if (typeof window === 'undefined') return;
    const entries = journalStorage.getEntries();
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.push(entry);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    journalStorage.updateStreak(entry.date);
  },

  deleteEntry: (id: string): void => {
    if (typeof window === 'undefined') return;
    const entries = journalStorage.getEntries();
    const filtered = entries.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  getStreak: (): StreakData => {
    if (typeof window === 'undefined') {
      return { current: 0, longest: 0, total: 0, flexibleMode: true };
    }
    try {
      const data = localStorage.getItem(STREAK_KEY);
      if (!data) {
        return { current: 0, longest: 0, total: 0, flexibleMode: true };
      }
      const streak = JSON.parse(data);
      if (streak.lastEntryDate) {
        streak.lastEntryDate = new Date(streak.lastEntryDate);
      }
      return streak;
    } catch (error) {
      return { current: 0, longest: 0, total: 0, flexibleMode: true };
    }
  },

  updateStreak: (entryDate: Date): void => {
    const streak = journalStorage.getStreak();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const entryDay = new Date(entryDate);
    entryDay.setHours(0, 0, 0, 0);
    
    const lastEntry = streak.lastEntryDate ? new Date(streak.lastEntryDate) : null;
    if (lastEntry) {
      lastEntry.setHours(0, 0, 0, 0);
    }
    
    // Check if this is a new day
    if (!lastEntry || entryDay > lastEntry) {
      const daysDiff = lastEntry 
        ? Math.floor((entryDay.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
      
      // Soft streak logic: Allow 1 day gap
      if (daysDiff <= 2 || !lastEntry) {
        streak.current = lastEntry ? streak.current + 1 : 1;
        streak.total += 1;
        
        if (streak.current > streak.longest) {
          streak.longest = streak.current;
        }
      } else {
        streak.current = 1;
        streak.total += 1;
      }
      
      streak.lastEntryDate = entryDate;
      localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
    }
  },

  getEntriesByDateRange: (startDate: Date, endDate: Date): JournalEntry[] => {
    const entries = journalStorage.getEntries();
    return entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });
  },

  getEntryByDate: (date: Date): JournalEntry | undefined => {
    const entries = journalStorage.getEntries();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return entries.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === targetDate.getTime();
    });
  },
};

// Generate insights from entries
export const generateInsights = (entries: JournalEntry[]): InsightCard[] => {
  if (entries.length < 3) return [];
  
  const insights: InsightCard[] = [];
  
  // Correlation Analysis: Activities vs Mood
  const activityMoodMap = new Map<string, number[]>();
  
  entries.forEach(entry => {
    entry.context.activities.forEach(activity => {
      if (!activityMoodMap.has(activity)) {
        activityMoodMap.set(activity, []);
      }
      activityMoodMap.get(activity)!.push(entry.pulse.mood);
    });
  });
  
  activityMoodMap.forEach((moods, activity) => {
    if (moods.length >= 3) {
      const avgMood = moods.reduce((a, b) => a + b, 0) / moods.length;
      const overallAvg = entries.reduce((sum, e) => sum + e.pulse.mood, 0) / entries.length;
      
      const diff = avgMood - overallAvg;
      
      if (Math.abs(diff) > 1.5) {
        insights.push({
          id: `correlation-${activity}`,
          type: 'correlation',
          title: `${activity.charAt(0).toUpperCase() + activity.slice(1)} & Your Mood`,
          description: `You tend to feel ${diff > 0 ? 'better' : 'less positive'} on days when you ${activity}. ${
            diff > 0 
              ? `Your mood averages ${avgMood.toFixed(1)}/10 vs ${overallAvg.toFixed(1)}/10 normally.`
              : `Consider whether this activity aligns with your wellbeing.`
          }`,
          confidence: Math.min(moods.length / 10, 1),
          data: { activity, avgMood, overallAvg, samples: moods.length },
        });
      }
    }
  });
  
  // Pattern: Time of day
  const morningEntries = entries.filter(e => new Date(e.date).getHours() < 12);
  const eveningEntries = entries.filter(e => new Date(e.date).getHours() >= 18);
  
  if (morningEntries.length >= 3 && eveningEntries.length >= 3) {
    const morningMood = morningEntries.reduce((s, e) => s + e.pulse.mood, 0) / morningEntries.length;
    const eveningMood = eveningEntries.reduce((s, e) => s + e.pulse.mood, 0) / eveningEntries.length;
    
    const diff = morningMood - eveningMood;
    
    if (Math.abs(diff) > 1) {
      insights.push({
        id: 'pattern-timeofday',
        type: 'pattern',
        title: `You're a ${diff > 0 ? 'Morning' : 'Evening'} Person`,
        description: `Your mood tends to be ${Math.abs(diff).toFixed(1)} points higher in the ${
          diff > 0 ? 'morning' : 'evening'
        }. Consider scheduling important activities during your peak times.`,
        confidence: 0.7,
        data: { morningMood, eveningMood },
      });
    }
  }
  
  // Milestone
  if (entries.length === 7) {
    insights.push({
      id: 'milestone-week',
      type: 'milestone',
      title: 'One Week of Reflection',
      description: 'You\'ve completed your first week of journaling. This is when the habit starts to solidify.',
      confidence: 1,
    });
  }
  
  if (entries.length === 30) {
    insights.push({
      id: 'milestone-month',
      type: 'milestone',
      title: 'One Month Strong',
      description: 'A full month of self-reflection. You\'re building a narrative thread of your inner life.',
      confidence: 1,
    });
  }
  
  return insights;
};
