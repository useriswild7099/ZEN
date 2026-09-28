'use client';

import { useState } from 'react';
import { JournalEntry, Pulse, Context } from '@/types/journal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PulseCapture } from '@/components/journal/PulseCapture';
import { ContextTagger } from '@/components/journal/ContextTagger';
import { DeepDivePrompts } from '@/components/journal/DeepDivePrompts';
import { FocusPortal } from '@/components/journal/FocusPortal';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface NewEntryFlowProps {
  onSave: (entry: Omit<JournalEntry, 'id' | 'date'>) => void;
  onCancel: () => void;
}

export function NewEntryFlow({ onSave, onCancel }: NewEntryFlowProps) {
  const [step, setStep] = useState<'pulse' | 'context' | 'content' | 'deep-dive' | 'science-boost'>('pulse');
  const [useFocusMode, setUseFocusMode] = useState(false);
  
  const [pulse, setPulse] = useState<Pulse>({ mood: 5, energy: 5 });
  const [context, setContext] = useState<Context>({
    activities: [],
    people: [],
    weather: undefined,
  });
  const [content, setContent] = useState('');
  const [deepDiveResponses, setDeepDiveResponses] = useState<
    { prompt: string; response: string }[]
  >([]);
  
  // New science-backed features
  const [gratitudes, setGratitudes] = useState<string[]>(['', '', '']);
  const [worries, setWorries] = useState('');
  const [sleepData, setSleepData] = useState({ sleepHours: 7, sleepQuality: 7 });
  const [futureSelfLetter, setFutureSelfLetter] = useState('');
  const [cognitiveReframe, setCognitiveReframe] = useState({
    negativeThought: '',
    reframedThought: ''
  });

  const handleSave = () => {
    if (pulse.mood === 0 || pulse.energy === 0) {
      toast.error('Please complete the Pulse step');
      return;
    }

    onSave({
      pulse,
      context,
      content,
      deepDiveResponses: deepDiveResponses.length > 0 ? deepDiveResponses : undefined,
    });

    toast.success('Entry saved! 🎉');
  };

  const canProceedFromPulse = pulse.mood > 0 && pulse.energy > 0;
  const canProceedFromContext = context.activities.length > 0 || context.people.length > 0;

  if (useFocusMode && step === 'content') {
    return (
      <FocusPortal
        content={content}
        onChange={setContent}
        onComplete={() => {
          setUseFocusMode(false);
          setStep('deep-dive');
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4">
        {['pulse', 'context', 'content', 'deep-dive', 'science-boost'].map((s, index) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step === s
                    ? 'bg-white/40 text-white'
                    : index < ['pulse', 'context', 'content', 'deep-dive', 'science-boost'].indexOf(step)
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  step === s ? 'text-white' : 'text-white/40'
                }`}
              >
                {s === 'pulse' && 'Pulse'}
                {s === 'context' && 'Context'}
                {s === 'content' && 'Write'}
                {s === 'deep-dive' && 'Reflect'}
                {s === 'science-boost' && 'Science Boost'}
              </span>
            </div>
            {index < 4 && (
              <div
                className={`h-0.5 w-full mx-2 ${
                  index < ['pulse', 'context', 'content', 'deep-dive', 'science-boost'].indexOf(step)
                    ? 'bg-white/40'
                    : 'bg-white/10'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <Card className="p-8">
        {step === 'pulse' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <PulseCapture pulse={pulse} onChange={setPulse} />
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep('context')}
                disabled={!canProceedFromPulse}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'context' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <ContextTagger context={context} onChange={setContext} />
            <div className="flex justify-between gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep('pulse')}>
                Back
              </Button>
              <Button
                onClick={() => setStep('content')}
                disabled={!canProceedFromContext}
                className="gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'content' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Free Writing</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUseFocusMode(true)}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Focus Portal
                </Button>
              </div>
              
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind? Write freely, without judgment..."
                className="min-h-[300px] resize-none text-base leading-relaxed"
              />
              
              <p className="text-sm text-muted-foreground">
                {content.split(/\s+/).filter(Boolean).length} words
              </p>
            </div>

            <div className="flex justify-between gap-3">
              <Button variant="outline" onClick={() => setStep('context')}>
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Now
                </Button>
                <Button onClick={() => setStep('science-boost')} className="gap-2">
                  Science Boost
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'deep-dive' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <DeepDivePrompts
              mood={pulse.mood}
              energy={pulse.energy}
              activities={context.activities}
              responses={deepDiveResponses}
              onChange={setDeepDiveResponses}
            />
            <div className="flex justify-between gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep('content')}>
                Back
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Entry
              </Button>
            </div>
          </motion.div>
        )}

        {step === 'science-boost' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="space-y-6">
              <div className="p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  <h2 className="text-2xl font-semibold">Science Boost Features</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  10 evidence-based techniques integrated throughout ZenGuard. These features work automatically as you journal.
                </p>
                <div className="p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>All features active:</strong> Mood Predictor, Weekly Heatmap, Positive Memory Bank, Social Connection Insights, and more are already working in your Insights tab!
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep('content')}>
                Back
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Entry
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
}
