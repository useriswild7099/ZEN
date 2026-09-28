'use client';

import { JournalEntry } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Users, Heart, Coffee } from 'lucide-react';

interface SocialConnectionInsightsProps {
  entries: JournalEntry[];
}

/**
 * Social Connection Correlation Tracker
 * Scientific Basis: Holt-Lunstad et al. (2010) - Social isolation = 50% mortality increase
 * Mechanism: Quantifies loneliness vs connection impact on wellbeing
 */
export function SocialConnectionInsights({ entries }: SocialConnectionInsightsProps) {
  if (entries.length < 5) {
    return null;
  }

  // Analyze social context vs mood
  const aloneEntries = entries.filter(e => e.context.people.includes('alone'));
  const socialEntries = entries.filter(e => 
    e.context.people.some(p => ['partner', 'family', 'friends'].includes(p))
  );

  if (aloneEntries.length === 0 && socialEntries.length === 0) {
    return null;
  }

  const aloneMoodAvg = aloneEntries.length > 0
    ? aloneEntries.reduce((sum, e) => sum + e.pulse.mood, 0) / aloneEntries.length
    : 0;

  const socialMoodAvg = socialEntries.length > 0
    ? socialEntries.reduce((sum, e) => sum + e.pulse.mood, 0) / socialEntries.length
    : 0;

  const difference = socialMoodAvg - aloneMoodAvg;
  
  // Calculate alone time percentage
  const alonePercentage = (aloneEntries.length / entries.length) * 100;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-indigo-500" />
        <h3 className="text-lg font-semibold">Social Connection Impact</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Alone Time */}
        <div className="p-4 bg-gray-50/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-gray-200/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Time Alone</p>
            <Coffee className="h-4 w-4 text-gray-500" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
            {aloneMoodAvg > 0 ? aloneMoodAvg.toFixed(1) : 'N/A'}/10
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Average mood • {alonePercentage.toFixed(0)}% of entries
          </p>
        </div>

        {/* Social Time */}
        <div className="p-4 bg-indigo-50/60 dark:bg-indigo-900/20 backdrop-blur-xl rounded-2xl border border-indigo-200/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">With Loved Ones</p>
            <Heart className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {socialMoodAvg > 0 ? socialMoodAvg.toFixed(1) : 'N/A'}/10
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Average mood • {((socialEntries.length / entries.length) * 100).toFixed(0)}% of entries
          </p>
        </div>
      </div>

      {/* Insights */}
      {difference > 1.5 && (
        <div className="p-4 bg-green-50/60 dark:bg-green-900/20 backdrop-blur-xl rounded-2xl border border-green-200/20">
          <p className="text-sm font-semibold mb-1">Strong Social Effect Detected</p>
          <p className="text-xs text-muted-foreground">
            Your mood averages <strong>{difference.toFixed(1)} points higher</strong> when you're with loved ones. 
            Social connection is a key protective factor for you.
          </p>
        </div>
      )}

      {alonePercentage > 70 && aloneMoodAvg < 6 && (
        <div className="p-4 bg-amber-50/60 dark:bg-amber-900/20 backdrop-blur-xl rounded-2xl border border-amber-200/20">
          <p className="text-sm font-semibold mb-1">High Isolation Pattern</p>
          <p className="text-xs text-muted-foreground">
            You've spent {alonePercentage.toFixed(0)}% of logged days alone with below-average mood. 
            Research shows even brief social interactions significantly boost wellbeing. Consider reaching out.
          </p>
        </div>
      )}

      {difference < -1 && socialEntries.length >= 3 && (
        <div className="p-4 bg-blue-50/60 dark:bg-blue-900/20 backdrop-blur-xl rounded-2xl border border-blue-200/20">
          <p className="text-sm font-semibold mb-1">Solitude as Restoration</p>
          <p className="text-xs text-muted-foreground">
            Interesting: Your mood is actually higher during alone time. You may be an introvert who recharges 
            through solitude. Honor this need.
          </p>
        </div>
      )}

      <div className="p-4 bg-indigo-50/60 dark:bg-indigo-900/20 backdrop-blur-xl rounded-2xl border border-indigo-200/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Research insight:</strong> Lack of social connection is as harmful as smoking 15 cigarettes a day. 
          But quality matters more than quantity—one meaningful conversation beats ten shallow ones.
        </p>
      </div>
    </Card>
  );
}
