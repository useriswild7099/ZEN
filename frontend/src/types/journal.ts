export interface Pulse {
  mood: number; // 1-10 scale
  energy: number; // 1-10 scale
}

export interface Context {
  activities: string[]; // e.g., ["work", "exercise", "social"]
  people: string[]; // e.g., ["alone", "family", "friends"]
  weather?: string; // e.g., "sunny", "rainy"
  location?: string;
}

export interface JournalEntry {
  id: string;
  date: Date;
  pulse: Pulse;
  context: Context;
  content: string;
  deepDiveResponses?: { prompt: string; response: string }[];
  sentiment?: number; // -1 to 1
  tags?: string[];
  
  // New scientifically-proven features
  gratitudes?: string[]; // Three Good Things
  worries?: string; // Worry Dump
  sleepHours?: number; // Sleep tracking
  sleepQuality?: number; // Sleep quality 1-10
  futureSelfLetter?: string; // Letter to future self
  cognitiveReframe?: { // CBT thought reframing
    negativeThought: string;
    reframedThought: string;
  };
}

export interface InsightCard {
  id: string;
  type: 'correlation' | 'pattern' | 'suggestion' | 'milestone';
  title: string;
  description: string;
  confidence: number;
  data?: any;
}

export interface StreakData {
  current: number;
  longest: number;
  total: number;
  lastEntryDate?: Date;
  flexibleMode: boolean; // For "soft streak" logic
}

export type ActivityIcon = 
  | 'work' | 'exercise' | 'social' | 'reading' | 'creative' 
  | 'meditation' | 'cooking' | 'travel' | 'nature' | 'music'
  | 'gaming' | 'shopping' | 'cleaning' | 'learning';

export type PeopleIcon = 
  | 'alone' | 'partner' | 'family' | 'friends' | 'colleagues' 
  | 'strangers' | 'pets';

export type WeatherIcon = 
  | 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'windy';
