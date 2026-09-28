'use client';

import { JournalEntry } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Activity, TrendingUp, AlertTriangle } from 'lucide-react';

interface MoodPredictorProps {
  entries: JournalEntry[];
}

/**
 * Mood Trend Predictor
 * Scientific Basis: Chekroud et al. (2016) - ML predicts depression with 70% accuracy
 * Mechanism: Pattern recognition alerts user to declining trends before crisis
 */
export function MoodPredictor({ entries }: MoodPredictorProps) {
  if (entries.length < 7) {
    return null;
  }

  // Get last 7 days of mood data
  const recentEntries = entries.slice(-7);
  const moodTrend = recentEntries.map(e => e.pulse.mood);
  
  // Calculate trend direction
  const firstHalf = moodTrend.slice(0, Math.floor(moodTrend.length / 2));
  const secondHalf = moodTrend.slice(Math.floor(moodTrend.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const trend = secondAvg - firstAvg;
  const currentMood = moodTrend[moodTrend.length - 1];
  
  // Predict tomorrow
  const predictedMood = Math.max(1, Math.min(10, currentMood + (trend * 0.5)));
  
  // Check for concerning pattern
  const decliningPattern = trend < -1 && secondAvg < 5;
  const volatilePattern = moodTrend.some((m, i) => i > 0 && Math.abs(m - moodTrend[i - 1]) > 3);

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Mood Forecast</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Predicted Mood */}
        <div className="p-4 bg-blue-50/60 dark:bg-blue-900/20 backdrop-blur-xl rounded-2xl border border-blue-200/20">
          <p className="text-xs text-muted-foreground mb-2">Tomorrow's Prediction</p>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {predictedMood.toFixed(1)}/10
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Based on your 7-day pattern
          </p>
        </div>

        {/* Trend */}
        <div className="p-4 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-white/20">
          <p className="text-xs text-muted-foreground mb-2">7-Day Trend</p>
          <div className="flex items-center gap-2">
            <TrendingUp 
              className={`h-6 w-6 ${
                trend > 0.5 ? 'text-green-500 rotate-0' : 
                trend < -0.5 ? 'text-red-500 rotate-180' : 
                'text-yellow-500 rotate-90'
              }`} 
            />
            <p className="text-lg font-semibold">
              {trend > 0.5 ? 'Improving' : trend < -0.5 ? 'Declining' : 'Stable'}
            </p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {decliningPattern && (
        <div className="p-4 bg-red-50/60 dark:bg-red-900/20 backdrop-blur-xl rounded-2xl border border-red-200/20 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Pattern Alert</p>
            <p className="text-xs text-muted-foreground">
              Your mood has been declining over the past week. Consider reaching out to someone you trust, 
              or revisiting activities that have lifted your mood in the past.
            </p>
          </div>
        </div>
      )}

      {volatilePattern && !decliningPattern && (
        <div className="p-4 bg-amber-50/60 dark:bg-amber-900/20 backdrop-blur-xl rounded-2xl border border-amber-200/20 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Volatility Detected</p>
            <p className="text-xs text-muted-foreground">
              Your mood has been fluctuating significantly. This could indicate stress or disrupted routines. 
              Check your sleep and self-care patterns.
            </p>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground italic">
        💡 Research shows that awareness of mood patterns helps break negative spirals before they deepen.
      </p>
    </Card>
  );
}
