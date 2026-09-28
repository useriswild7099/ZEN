'use client';

import { JournalEntry } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineViewProps {
  entries: JournalEntry[];
  onSelectEntry?: (entry: JournalEntry) => void;
}

export function TimelineView({ entries, onSelectEntry }: TimelineViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getDateLabel = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const getMoodColor = (mood: number): string => {
    if (mood <= 3) return 'bg-red-500';
    if (mood <= 5) return 'bg-orange-500';
    if (mood <= 7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getMoodEmoji = (mood: number): string => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😔';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };

  if (sortedEntries.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">📖</div>
        <div>
          <h3 className="text-lg font-medium">Your story begins here</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Start your first entry to create your narrative thread
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Your Narrative Thread</h2>
        <p className="text-white/60">
          Every entry is a chapter in your story
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

        <div className="space-y-6">
          {sortedEntries.map((entry, index) => {
            const isExpanded = expandedId === entry.id;
            const entryDate = new Date(entry.date);

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full border-4 border-black/50 bg-white/80 shadow-[0_0_15px_rgba(255,255,255,0.4)]" />

                <Card
                  className="p-6 space-y-4 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {getDateLabel(entryDate)}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {format(entryDate, 'h:mm a')} · {formatDistanceToNow(entryDate, { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMoodEmoji(entry.pulse.mood)}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Mood & Energy */}
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Mood</span>
                        <span className="font-medium text-white">{entry.pulse.mood}/10</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getMoodColor(entry.pulse.mood)} transition-all`}
                          style={{ width: `${(entry.pulse.mood / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Energy</span>
                        <span className="font-medium text-white">{entry.pulse.energy}/10</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${(entry.pulse.energy / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Context Tags */}
                  {(entry.context.activities.length > 0 || entry.context.people.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                      {entry.context.activities.slice(0, 3).map((activity) => (
                        <span
                          key={activity}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {activity}
                        </span>
                      ))}
                      {entry.context.people.slice(0, 2).map((people) => (
                        <span
                          key={people}
                          className="text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full"
                        >
                          {people}
                        </span>
                      ))}
                      {entry.context.activities.length + entry.context.people.length > 5 && (
                        <span className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">
                          +{entry.context.activities.length + entry.context.people.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content Preview */}
                  {entry.content && (
                    <p className={`text-sm leading-relaxed text-muted-foreground ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {entry.content}
                    </p>
                  )}

                  {/* Deep Dive Responses */}
                  {isExpanded && entry.deepDiveResponses && entry.deepDiveResponses.length > 0 && (
                    <div className="space-y-3 mt-4 pt-4 border-t">
                      <h4 className="text-sm font-semibold">Deep Reflections</h4>
                      {entry.deepDiveResponses.map((response, idx) => (
                        <div key={idx} className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-xs font-medium text-muted-foreground italic">
                            {response.prompt}
                          </p>
                          <p className="text-sm">{response.response}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
