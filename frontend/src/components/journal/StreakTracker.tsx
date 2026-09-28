'use client';

import { StreakData } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Flame, Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakTrackerProps {
  streak: StreakData;
}

export function StreakTracker({ streak }: StreakTrackerProps) {
  const getDaysUntilBreak = (): number => {
    if (!streak.lastEntryDate) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastEntry = new Date(streak.lastEntryDate);
    lastEntry.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - lastEntry.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Soft streak allows 1 day gap
    return streak.flexibleMode ? Math.max(0, 2 - diffDays) : Math.max(0, 1 - diffDays);
  };

  const getStreakMessage = (): string => {
    const daysUntil = getDaysUntilBreak();
    
    if (daysUntil === 0) {
      return "Your streak has ended, but that's okay. Start fresh today!";
    }
    
    if (daysUntil === 1) {
      return "Journal today to keep your streak alive";
    }
    
    if (daysUntil === 2) {
      return "You have 1 grace day left (soft streak mode)";
    }
    
    return "You're on fire! 🔥";
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Your Journey</h3>
          {streak.flexibleMode && (
            <span className="text-xs bg-white/10 border border-white/10 px-2 py-1 rounded-full text-white/50">
              Soft Streak Mode
            </span>
          )}
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-3 gap-4">
          {/* Current Streak */}
          <div className="text-center space-y-2">
            <motion.div
              className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              <Flame className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <p className="text-3xl font-bold text-white">{streak.current}</p>
              <p className="text-xs text-white/60">Day Streak</p>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{streak.longest}</p>
              <p className="text-xs text-white/60">Best Streak</p>
            </div>
          </div>

          {/* Total Entries */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{streak.total}</p>
              <p className="text-xs text-white/60">Total Days</p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-sm text-center text-white/60">
            {getStreakMessage()}
          </p>
        </div>

        {/* Soft Streak Explanation */}
        {streak.flexibleMode && (
          <div className="text-xs text-white/40">
            <p>
              <strong>Soft Streak:</strong> Missing one day won't break your streak. 
              We value the <em>identity</em> of being a journaler over perfect consistency.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
