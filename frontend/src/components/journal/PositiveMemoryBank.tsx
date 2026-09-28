'use client';

import { JournalEntry } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface PositiveMemoryBankProps {
  entries: JournalEntry[];
}

/**
 * Positive Memory Bank / Savoring
 * Scientific Basis: Bryant & Veroff (2007) - Savoring increases happiness duration by 3x
 * Mechanism: Positive memory consolidation + reminiscence bump + mood repair
 */
export function PositiveMemoryBank({ entries }: PositiveMemoryBankProps) {
  // Filter for positive entries (mood >= 7)
  const positiveEntries = entries
    .filter(e => e.pulse.mood >= 7)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 9); // Show top 9

  if (positiveEntries.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-3">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <p className="text-sm text-muted-foreground">
            Your positive memories will appear here once you journal about good days (mood 7+)
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-pink-500" />
        <h3 className="text-lg font-semibold">Positive Memory Bank</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Revisit your best moments. Research shows that savoring positive memories extends their emotional benefit.
      </p>

      <div className="grid md:grid-cols-3 gap-3">
        {positiveEntries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 backdrop-blur-xl rounded-2xl border border-pink-200/20 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {format(new Date(entry.date), 'MMM d')}
                </span>
                <span className="text-2xl group-hover:scale-110 transition-transform">
                  {entry.pulse.mood >= 9 ? '😊' : '🙂'}
                </span>
              </div>
              
              {entry.content && (
                <p className="text-sm line-clamp-3 leading-relaxed">
                  {entry.content}
                </p>
              )}

              {entry.context.activities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {entry.context.activities.slice(0, 2).map(activity => (
                    <span 
                      key={activity}
                      className="text-xs bg-pink-100 dark:bg-pink-900 px-2 py-0.5 rounded-full"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-pink-50/60 dark:bg-pink-900/20 backdrop-blur-xl rounded-2xl border border-pink-200/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Why this works:</strong> Your brain's negativity bias means positive memories fade faster. 
          Deliberately revisiting them strengthens their neural pathways, making happiness more accessible.
        </p>
      </div>
    </Card>
  );
}
