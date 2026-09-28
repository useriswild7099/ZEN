'use client';

import { Context, ActivityIcon, PeopleIcon, WeatherIcon } from '@/types/journal';
import { Label } from '@/components/ui/label';
import { 
  Briefcase, Dumbbell, Users, BookOpen, Palette, 
  Brain, ChefHat, Plane, Trees, Music, 
  Gamepad2, ShoppingBag, Sparkles, GraduationCap,
  User, Heart, Home, UserPlus, Building2, 
  UsersRound, Cat,
  Sun, Cloud, CloudRain, CloudLightning, Snowflake, Wind
} from 'lucide-react';
import { useState } from 'react';

const activityIcons: Record<ActivityIcon, { icon: React.ComponentType<any>; label: string }> = {
  work: { icon: Briefcase, label: 'Work' },
  exercise: { icon: Dumbbell, label: 'Exercise' },
  social: { icon: Users, label: 'Social' },
  reading: { icon: BookOpen, label: 'Reading' },
  creative: { icon: Palette, label: 'Creative' },
  meditation: { icon: Brain, label: 'Meditation' },
  cooking: { icon: ChefHat, label: 'Cooking' },
  travel: { icon: Plane, label: 'Travel' },
  nature: { icon: Trees, label: 'Nature' },
  music: { icon: Music, label: 'Music' },
  gaming: { icon: Gamepad2, label: 'Gaming' },
  shopping: { icon: ShoppingBag, label: 'Shopping' },
  cleaning: { icon: Sparkles, label: 'Cleaning' },
  learning: { icon: GraduationCap, label: 'Learning' },
};

const peopleIcons: Record<PeopleIcon, { icon: React.ComponentType<any>; label: string }> = {
  alone: { icon: User, label: 'Alone' },
  partner: { icon: Heart, label: 'Partner' },
  family: { icon: Home, label: 'Family' },
  friends: { icon: UserPlus, label: 'Friends' },
  colleagues: { icon: Building2, label: 'Colleagues' },
  strangers: { icon: UsersRound, label: 'Strangers' },
  pets: { icon: Cat, label: 'Pets' },
};

const weatherIcons: Record<WeatherIcon, { icon: React.ComponentType<any>; label: string }> = {
  sunny: { icon: Sun, label: 'Sunny' },
  cloudy: { icon: Cloud, label: 'Cloudy' },
  rainy: { icon: CloudRain, label: 'Rainy' },
  stormy: { icon: CloudLightning, label: 'Stormy' },
  snowy: { icon: Snowflake, label: 'Snowy' },
  windy: { icon: Wind, label: 'Windy' },
};

interface ContextTaggerProps {
  context: Context;
  onChange: (context: Context) => void;
}

export function ContextTagger({ context, onChange }: ContextTaggerProps) {
  const toggleActivity = (activity: string) => {
    const activities = context.activities.includes(activity)
      ? context.activities.filter(a => a !== activity)
      : [...context.activities, activity];
    onChange({ ...context, activities });
  };

  const togglePeople = (people: string) => {
    const peopleList = context.people.includes(people)
      ? context.people.filter(p => p !== people)
      : [...context.people, people];
    onChange({ ...context, people: peopleList });
  };

  const setWeather = (weather: string) => {
    onChange({ ...context, weather: context.weather === weather ? undefined : weather });
  };

  return (
    <div className="space-y-8 py-6">
      {/* Activities */}
      <div className="space-y-4">
        <Label className="text-lg font-medium text-white">What did you do today?</Label>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3">
          {Object.entries(activityIcons).map(([key, { icon: Icon, label }]) => {
            const isSelected = context.activities.includes(key);
            return (
              <button
                key={key}
                onClick={() => toggleActivity(key)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-white/20 text-white shadow-lg scale-105'
                    : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* People */}
      <div className="space-y-4">
        <Label className="text-lg font-medium text-white">Who were you with?</Label>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3">
          {Object.entries(peopleIcons).map(([key, { icon: Icon, label }]) => {
            const isSelected = context.people.includes(key);
            return (
              <button
                key={key}
                onClick={() => togglePeople(key)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-white/20 text-white shadow-lg scale-105'
                    : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weather */}
      <div className="space-y-4">
        <Label className="text-lg font-medium text-white">Weather?</Label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {Object.entries(weatherIcons).map(([key, { icon: Icon, label }]) => {
            const isSelected = context.weather === key;
            return (
              <button
                key={key}
                onClick={() => setWeather(key)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                  isSelected
                    ? 'bg-white/20 text-white shadow-lg scale-105'
                    : 'bg-white/5 hover:bg-white/10 hover:scale-105'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
