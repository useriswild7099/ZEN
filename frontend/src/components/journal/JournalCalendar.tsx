'use client';

import { useState } from 'react';
import { JournalEntry } from '@/types/journal';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

interface JournalCalendarProps {
  entries: JournalEntry[];
}

export const JournalCalendar = ({ entries }: JournalCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEntryForDay = (day: Date) => {
    return entries.find(entry => isSameDay(new Date(entry.date), day));
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'bg-green-500';
    if (mood >= 6) return 'bg-blue-500';
    if (mood >= 4) return 'bg-yellow-500';
    if (mood >= 2) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const handleDayClick = (day: Date) => {
    const entry = getEntryForDay(day);
    if (entry) {
      setSelectedEntry(entry);
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-semibold text-white">Journal Calendar</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold min-w-[150px] text-center text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-semibold text-white/40 p-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const entry = getEntryForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <motion.button
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`relative p-3 rounded-xl transition-all ${!isCurrentMonth ? 'opacity-30' : 'opacity-100'} ${entry ? 'cursor-pointer hover:scale-105' : 'cursor-default'} ${isToday ? 'ring-2 ring-white/40' : ''} ${entry ? 'bg-white/10 border border-white/20 shadow-lg' : 'bg-white/5'}`}
            >
              <div className="flex flex-col items-center gap-1">
                <span className={`text-sm font-medium ${isToday ? 'text-white font-bold underline' : 'text-white/80'}`}>
                  {format(day, 'd')}
                </span>
                {entry && (
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${getMoodColor(entry.pulse.mood)}`} />
                    <span className="text-xs font-semibold text-muted-foreground">
                      {entry.pulse.mood}
                    </span>
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>8-10</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>6-7</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>4-5</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-orange-500" />
          <span>2-3</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>1</span>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          {selectedEntry && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {format(new Date(selectedEntry.date), 'EEEE, MMMM d, yyyy')}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Mood</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {selectedEntry.pulse.mood}/10
                    </p>
                  </div>
                  <div className="p-4 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">Energy</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {selectedEntry.pulse.energy}/10
                    </p>
                  </div>
                </div>

                {(selectedEntry.context?.activities?.length > 0 || selectedEntry.context?.people?.length > 0) && (
                  <div className="p-4 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-xl">
                    <p className="text-sm font-semibold mb-2">Context</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.context.activities?.map(activity => (
                        <span key={activity} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                          {activity}
                        </span>
                      ))}
                      {selectedEntry.context.people?.map(person => (
                        <span key={person} className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEntry.content && (
                  <div className="p-4 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-xl">
                    <p className="text-sm font-semibold mb-2">Journal Entry</p>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedEntry.content}
                    </p>
                  </div>
                )}

                {selectedEntry.deepDiveResponses && selectedEntry.deepDiveResponses.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Deep Reflections</p>
                    {selectedEntry.deepDiveResponses.map((response, idx) => (
                      <div key={idx} className="p-4 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-xl">
                        <p className="text-sm font-medium text-muted-foreground mb-2">{response.prompt}</p>
                        <p className="text-sm">{response.response}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
