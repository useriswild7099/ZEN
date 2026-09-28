'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Flame, Cloud, Heart, Meh, Sparkles, X } from 'lucide-react';

// Types
export type MoodCategory = 'anxious' | 'angry' | 'sad' | 'overwhelmed' | 'numb' | 'hopeful';

export interface ReleaseLoop {
  id: string;
  name: string;
  category: MoodCategory;
  icon: string;
  visual: {
    type: string;
    description: string;
  };
  reflection: string;
  dataLog: {
    color: string;
    tag: string;
  };
  coolDown: {
    type: string;
    content: string;
    duration: number;
  };
}

// Mood category icons
const MOOD_ICONS: Record<MoodCategory, React.ReactNode> = {
  anxious: <Wind className="w-6 h-6" />,
  angry: <Flame className="w-6 h-6" />,
  sad: <Cloud className="w-6 h-6" />,
  overwhelmed: <Heart className="w-6 h-6" />,
  numb: <Meh className="w-6 h-6" />,
  hopeful: <Sparkles className="w-6 h-6" />
};

const MOOD_COLORS: Record<MoodCategory, string> = {
  anxious: '#FFEB3B',
  angry: '#F44336',
  sad: '#2196F3',
  overwhelmed: '#FF9800',
  numb: '#9E9E9E',
  hopeful: '#4CAF50'
};

const MOOD_NAMES: Record<MoodCategory, string> = {
  anxious: 'Anxious',
  angry: 'Angry',
  sad: 'Sad',
  overwhelmed: 'Overwhelmed',
  numb: 'Numb',
  hopeful: 'Hopeful'
};

// All 30 loops data (imported from backend conceptually, defined inline for frontend)
const RELEASE_LOOPS: Record<string, ReleaseLoop> = {
  // Anxious
  exam_panic: { id: 'exam_panic', name: 'Exam Panic', category: 'anxious', icon: '💨', visual: { type: 'shatter', description: 'Text shatters into dust' }, reflection: 'The pressure to perform is loud right now, but your worth is not defined by a grade.', dataLog: { color: '#FFEB3B', tag: 'Academic Pressure' }, coolDown: { type: 'prompt', content: 'Unclench your jaw', duration: 10 } },
  social_anxiety: { id: 'social_anxiety', name: 'Social Anxiety', category: 'anxious', icon: '💨', visual: { type: 'shrink', description: 'Words shrink away' }, reflection: 'Social interactions can be draining. It is okay to retreat and recharge.', dataLog: { color: '#FFEB3B', tag: 'Social' }, coolDown: { type: 'visual', content: 'Close your eyes. Visualize a quiet room.', duration: 15 } },
  financial_stress: { id: 'financial_stress', name: 'Financial Stress', category: 'anxious', icon: '💨', visual: { type: 'crumple', description: 'Text crumples like paper' }, reflection: 'Money stress feels like survival stress. You are carrying a heavy load today.', dataLog: { color: '#FF9800', tag: 'Finance' }, coolDown: { type: 'grounding', content: 'Find 3 blue things in the room', duration: 20 } },
  imposter_syndrome: { id: 'imposter_syndrome', name: 'Imposter Syndrome', category: 'anxious', icon: '💨', visual: { type: 'erase', description: 'Text is erased away' }, reflection: "That voice saying 'you don't belong' is fear, not fact.", dataLog: { color: '#FFEB3B', tag: 'Self-Doubt' }, coolDown: { type: 'prompt', content: 'Name one thing you did well today', duration: 15 } },
  future_dread: { id: 'future_dread', name: 'Future Dread', category: 'anxious', icon: '💨', visual: { type: 'fog', description: 'Text blurs into fog' }, reflection: "The future is a lot to hold. Let's just focus on the next hour.", dataLog: { color: '#9C27B0', tag: 'Uncertainty' }, coolDown: { type: 'breathing', content: 'Box Breathing: In 4, Hold 4, Out 4', duration: 24 } },
  
  // Angry
  roommate_conflict: { id: 'roommate_conflict', name: 'Roommate Conflict', category: 'angry', icon: '🔥', visual: { type: 'burn', description: 'Text catches fire' }, reflection: 'Living with others tests patience. Your frustration is valid.', dataLog: { color: '#F44336', tag: 'Living Situation' }, coolDown: { type: 'action', content: 'Squeeze your fists tight for 5 seconds. Now release.', duration: 10 } },
  unfair_grade: { id: 'unfair_grade', name: 'Unfair Grade', category: 'angry', icon: '🔥', visual: { type: 'slash', description: 'Text is slashed and shredded' }, reflection: "It hurts when your effort isn't seen or rewarded.", dataLog: { color: '#F44336', tag: 'Injustice' }, coolDown: { type: 'action', content: 'Tap to punch (virtual punching bag)', duration: 15 } },
  betrayal: { id: 'betrayal', name: 'Betrayal', category: 'angry', icon: '🔥', visual: { type: 'crack', description: 'Text cracks like glass' }, reflection: 'Broken trust is a wound. It makes sense you want to protect yourself.', dataLog: { color: '#795548', tag: 'Relationship' }, coolDown: { type: 'breathing', content: 'Deep breath. Imagine blowing out a candle.', duration: 10 } },
  self_frustration: { id: 'self_frustration', name: 'Self-Frustration', category: 'angry', icon: '🔥', visual: { type: 'implode', description: 'Text implodes to a dot' }, reflection: 'Be gentle with yourself. You are learning, not failing.', dataLog: { color: '#FF9800', tag: 'Self-Criticism' }, coolDown: { type: 'action', content: 'Put your hand over your heart', duration: 10 } },
  general_irritability: { id: 'general_irritability', name: 'General Irritability', category: 'angry', icon: '🔥', visual: { type: 'evaporate', description: 'Text boils and evaporates' }, reflection: "Some days, everything feels like sandpaper. It's okay to be done.", dataLog: { color: '#F44336', tag: 'Mood Swing' }, coolDown: { type: 'silence', content: '15 seconds of silence', duration: 15 } },
  
  // Sad
  homesickness: { id: 'homesickness', name: 'Homesickness', category: 'sad', icon: '☁️', visual: { type: 'rain', description: 'Text rains down' }, reflection: 'Missing home is just love with nowhere to go right now.', dataLog: { color: '#2196F3', tag: 'Homesick' }, coolDown: { type: 'visual', content: 'A warm cup of tea steaming', duration: 10 } },
  breakup_rejection: { id: 'breakup_rejection', name: 'Breakup/Rejection', category: 'sad', icon: '☁️', visual: { type: 'fade', description: 'Text fades letter by letter' }, reflection: 'This kind of loss changes your landscape. One breath at a time.', dataLog: { color: '#2196F3', tag: 'Grief' }, coolDown: { type: 'action', content: 'Wrap your arms around yourself. Squeeze.', duration: 10 } },
  academic_failure: { id: 'academic_failure', name: 'Academic Failure', category: 'sad', icon: '☁️', visual: { type: 'sink', description: 'Text sinks and dissolves' }, reflection: 'A bad result is an event, not a definition of who you are.', dataLog: { color: '#2196F3', tag: 'Academics' }, coolDown: { type: 'prompt', content: 'Look out a window. Find the sky.', duration: 15 } },
  loneliness: { id: 'loneliness', name: 'Loneliness', category: 'sad', icon: '☁️', visual: { type: 'drift', description: 'Text drifts apart like dandelion seeds' }, reflection: 'Solitude can feel heavy. You are brave for sitting with it.', dataLog: { color: '#9C27B0', tag: 'Isolation' }, coolDown: { type: 'prompt', content: 'Text one friend a simple emoji.', duration: 15 } },
  just_cried: { id: 'just_cried', name: 'I Just Cried', category: 'sad', icon: '☁️', visual: { type: 'ripple', description: 'Screen ripples like water' }, reflection: "Tears are the body's way of releasing pressure. Let them flow.", dataLog: { color: '#2196F3', tag: 'Release' }, coolDown: { type: 'prompt', content: 'Drink some water', duration: 10 } },
  
  // Overwhelmed
  too_many_deadlines: { id: 'too_many_deadlines', name: 'Too Many Deadlines', category: 'overwhelmed', icon: '❤️', visual: { type: 'stack_blow', description: 'Text stacks then blows away' }, reflection: 'You are one person. You can only do one thing at a time.', dataLog: { color: '#FF9800', tag: 'Workload' }, coolDown: { type: 'prompt', content: 'Pick ONE small task. Forget the rest for now.', duration: 15 } },
  sensory_overload: { id: 'sensory_overload', name: 'Sensory Overload', category: 'overwhelmed', icon: '❤️', visual: { type: 'dim', description: 'Screen dims to black' }, reflection: 'The world is too loud. You have permission to disconnect.', dataLog: { color: '#F44336', tag: 'Sensory' }, coolDown: { type: 'silence', content: '30 seconds of void mode', duration: 30 } },
  decision_paralysis: { id: 'decision_paralysis', name: 'Decision Paralysis', category: 'overwhelmed', icon: '❤️', visual: { type: 'spiral', description: 'Text spirals into center' }, reflection: "There is no 'perfect' choice. Any step forward is good.", dataLog: { color: '#FFEB3B', tag: 'Indecision' }, coolDown: { type: 'visual', content: 'Coin flip animation', duration: 5 } },
  burnout: { id: 'burnout', name: 'Burnout', category: 'overwhelmed', icon: '❤️', visual: { type: 'crumble', description: 'Text crumbles like dry earth' }, reflection: 'You cannot pour from an empty cup. Rest is productive.', dataLog: { color: '#795548', tag: 'Exhaustion' }, coolDown: { type: 'prompt', content: 'Lie down for 1 minute', duration: 60 } },
  everything_wrong: { id: 'everything_wrong', name: 'Everything is Wrong', category: 'overwhelmed', icon: '❤️', visual: { type: 'reset', description: 'Reset button squashes text' }, reflection: 'When the big picture is scary, focus on small. Like breathing.', dataLog: { color: '#212121', tag: 'Crisis' }, coolDown: { type: 'breathing', content: '4-7-8 Breathing', duration: 38 } },
  
  // Numb
  apathy: { id: 'apathy', name: 'Apathy', category: 'numb', icon: '😐', visual: { type: 'camouflage', description: 'Text fades into background' }, reflection: "Feeling 'nothing' is often a shield against feeling 'too much'.", dataLog: { color: '#9E9E9E', tag: 'Dissociation' }, coolDown: { type: 'action', content: 'Rub your palms together until warm', duration: 15 } },
  auto_pilot: { id: 'auto_pilot', name: 'Auto-Pilot', category: 'numb', icon: '😐', visual: { type: 'reverse', description: 'Text types backward and deletes' }, reflection: "You've been running on survival mode. It makes sense you're tired.", dataLog: { color: '#9E9E9E', tag: 'Routine' }, coolDown: { type: 'action', content: 'Stretch your arms up high', duration: 10 } },
  disconnection: { id: 'disconnection', name: 'Disconnection', category: 'numb', icon: '😐', visual: { type: 'glitch', description: 'Text glitches and vanishes' }, reflection: "It feels like you're watching life through a glass wall today.", dataLog: { color: '#9E9E9E', tag: 'Derealization' }, coolDown: { type: 'grounding', content: 'Touch 3 different textures near you', duration: 20 } },
  boredom_stuck: { id: 'boredom_stuck', name: 'Boredom/Stuck', category: 'numb', icon: '😐', visual: { type: 'sludge', description: 'Text sinks like sludge' }, reflection: 'Stagnation is uncomfortable, but often precedes a shift.', dataLog: { color: '#795548', tag: 'Stuck' }, coolDown: { type: 'action', content: 'Stand up and shake your body', duration: 15 } },
  deep_void: { id: 'deep_void', name: 'The Void', category: 'numb', icon: '😐', visual: { type: 'void_float', description: 'Text floats into space' }, reflection: 'Sending these thoughts into the void. They are gone now.', dataLog: { color: '#212121', tag: 'Void' }, coolDown: { type: 'visual', content: 'White noise for 20 seconds', duration: 20 } },
  
  // Hopeful
  small_win: { id: 'small_win', name: 'Small Win', category: 'hopeful', icon: '✨', visual: { type: 'sparkles', description: 'Text becomes sparkles' }, reflection: 'Grab onto this feeling. You earned this moment.', dataLog: { color: '#4CAF50', tag: 'Achievement' }, coolDown: { type: 'prompt', content: 'Smile for 10 seconds (it tricks the brain!)', duration: 10 } },
  gratitude: { id: 'gratitude', name: 'Gratitude', category: 'hopeful', icon: '✨', visual: { type: 'bloom', description: 'Text blooms like a flower' }, reflection: 'Noticing the good things is a superpower.', dataLog: { color: '#4CAF50', tag: 'Gratitude' }, coolDown: { type: 'prompt', content: 'Think of one person you appreciate', duration: 15 } },
  clarity: { id: 'clarity', name: 'Clarity', category: 'hopeful', icon: '✨', visual: { type: 'beam', description: 'Text becomes light beam' }, reflection: 'It sounds like the fog has lifted. Enjoy the view.', dataLog: { color: '#03A9F4', tag: 'Insight' }, coolDown: { type: 'prompt', content: 'Write down one keyword to keep', duration: 15 } },
  connection: { id: 'connection', name: 'Connection', category: 'hopeful', icon: '✨', visual: { type: 'clasp', description: 'Text becomes clasping hands' }, reflection: 'Shared burden is half a burden. Glad you connected.', dataLog: { color: '#E91E63', tag: 'Social' }, coolDown: { type: 'prompt', content: "Send a 'Thinking of you' text", duration: 15 } },
  self_love: { id: 'self_love', name: 'Self-Love', category: 'hopeful', icon: '✨', visual: { type: 'heart', description: 'Text becomes a beating heart' }, reflection: 'Being kind to yourself is the hardest and most important work.', dataLog: { color: '#E91E63', tag: 'Self-Care' }, coolDown: { type: 'prompt', content: 'Give yourself a high five (mentally)', duration: 10 } }
};

// Get loops by category
function getLoopsByCategory(category: MoodCategory): ReleaseLoop[] {
  return Object.values(RELEASE_LOOPS).filter(loop => loop.category === category);
}

interface ReleaseLoopSystemProps {
  text: string;
  onComplete: () => void;
  onClose: () => void;
}

type Phase = 'mood-select' | 'loop-select' | 'visual-release' | 'reflection' | 'cool-down' | 'complete';

export default function ReleaseLoopSystem({ text, onComplete, onClose }: ReleaseLoopSystemProps) {
  const [phase, setPhase] = useState<Phase>('mood-select');
  const [selectedMood, setSelectedMood] = useState<MoodCategory | null>(null);
  const [selectedLoop, setSelectedLoop] = useState<ReleaseLoop | null>(null);
  const [coolDownTimer, setCoolDownTimer] = useState(0);

  // Handle mood selection
  const handleMoodSelect = (mood: MoodCategory) => {
    setSelectedMood(mood);
    setPhase('loop-select');
  };

  // Handle loop selection
  const handleLoopSelect = (loop: ReleaseLoop) => {
    setSelectedLoop(loop);
    setPhase('visual-release');
  };

  // Progress through phases
  const nextPhase = useCallback(() => {
    switch (phase) {
      case 'visual-release':
        setPhase('reflection');
        break;
      case 'reflection':
        setPhase('cool-down');
        if (selectedLoop) {
          setCoolDownTimer(selectedLoop.coolDown.duration);
        }
        break;
      case 'cool-down':
        setPhase('complete');
        break;
      case 'complete':
        onComplete();
        break;
    }
  }, [phase, selectedLoop, onComplete]);

  // Cool-down timer
  useEffect(() => {
    if (phase === 'cool-down' && coolDownTimer > 0) {
      const interval = setInterval(() => {
        setCoolDownTimer(t => {
          if (t <= 1) {
            nextPhase();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase, coolDownTimer, nextPhase]);

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center">
      <AnimatePresence mode="wait">
        {/* Phase 1: Mood Selection */}
        {phase === 'mood-select' && (
          <motion.div
            key="mood-select"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center p-8 max-w-lg"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl text-white font-light mb-2">How are you feeling?</h2>
            <p className="text-zinc-400 text-sm mb-8">Choose the emotion closest to your current state</p>
            
            <div className="grid grid-cols-3 gap-4">
              {(Object.keys(MOOD_ICONS) as MoodCategory[]).map(mood => (
                <button
                  key={mood}
                  onClick={() => handleMoodSelect(mood)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105"
                  style={{ '--mood-color': MOOD_COLORS[mood] } as React.CSSProperties}
                >
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${MOOD_COLORS[mood]}20` }}
                  >
                    <span style={{ color: MOOD_COLORS[mood] }}>
                      {MOOD_ICONS[mood]}
                    </span>
                  </div>
                  <span className="text-white text-sm">{MOOD_NAMES[mood]}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Phase 2: Loop Selection */}
        {phase === 'loop-select' && selectedMood && (
          <motion.div
            key="loop-select"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center p-8 max-w-lg"
          >
            <button
              onClick={() => setPhase('mood-select')}
              className="absolute top-6 left-6 text-zinc-500 hover:text-white transition-colors text-sm"
            >
              ← Back
            </button>
            
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: `${MOOD_COLORS[selectedMood]}20` }}
            >
              <span style={{ color: MOOD_COLORS[selectedMood] }}>
                {MOOD_ICONS[selectedMood]}
              </span>
              <span style={{ color: MOOD_COLORS[selectedMood] }} className="font-medium">
                {MOOD_NAMES[selectedMood]}
              </span>
            </div>
            
            <h2 className="text-xl text-white font-light mb-6">What resonates most?</h2>
            
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {getLoopsByCategory(selectedMood).map(loop => (
                <button
                  key={loop.id}
                  onClick={() => handleLoopSelect(loop)}
                  className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                >
                  <span className="text-white font-medium">{loop.name}</span>
                  <p className="text-zinc-400 text-sm mt-1">{loop.visual.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Phase 3: Visual Release */}
        {phase === 'visual-release' && selectedLoop && (
          <motion.div
            key="visual-release"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-8 w-full max-w-2xl"
          >
            <VisualReleaseAnimation
              text={text}
              type={selectedLoop.visual.type}
              color={MOOD_COLORS[selectedLoop.category]}
              onComplete={nextPhase}
            />
          </motion.div>
        )}

        {/* Phase 4: AI Reflection */}
        {phase === 'reflection' && selectedLoop && (
          <motion.div
            key="reflection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center p-8 max-w-lg"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-white font-light leading-relaxed"
            >
              "{selectedLoop.reflection}"
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              onClick={nextPhase}
              className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              Continue
            </motion.button>
          </motion.div>
        )}

        {/* Phase 5: Cool-Down */}
        {phase === 'cool-down' && selectedLoop && (
          <motion.div
            key="cool-down"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-8 max-w-lg"
          >
            <CoolDownActivity
              type={selectedLoop.coolDown.type}
              content={selectedLoop.coolDown.content}
              duration={selectedLoop.coolDown.duration}
              timeRemaining={coolDownTimer}
            />
            
            <button
              onClick={nextPhase}
              className="mt-6 text-zinc-400 hover:text-white text-sm transition-colors"
            >
              Skip
            </button>
          </motion.div>
        )}

        {/* Phase 6: Complete */}
        {phase === 'complete' && selectedLoop && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{ backgroundColor: `${selectedLoop.dataLog.color}30` }}
            >
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedLoop.dataLog.color }}
              />
            </motion.div>
            
            <h2 className="text-xl text-white font-light mb-2">Released</h2>
            <p className="text-zinc-400 text-sm">
              {selectedLoop.dataLog.tag} • Session only
            </p>
            
            <button
              onClick={onComplete}
              className="mt-8 px-8 py-3 bg-purple-500/30 hover:bg-purple-500/40 text-purple-200 rounded-full transition-colors"
            >
              Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Visual Release Animation Component
interface VisualReleaseProps {
  text: string;
  type: string;
  color: string;
  onComplete: () => void;
}

function VisualReleaseAnimation({ text, type, color, onComplete }: VisualReleaseProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const getAnimationVariants = () => {
    switch (type) {
      case 'shatter':
        return { initial: { opacity: 1 }, animate: { opacity: 0, scale: [1, 1.1, 0], filter: 'blur(10px)' } };
      case 'burn':
        return { initial: { opacity: 1 }, animate: { opacity: 0, color: '#ff6b35', filter: 'blur(8px)' } };
      case 'fade':
        return { initial: { opacity: 1 }, animate: { opacity: 0 } };
      case 'rain':
        return { initial: { opacity: 1, y: 0 }, animate: { opacity: 0, y: 200 } };
      case 'shrink':
        return { initial: { opacity: 1, scale: 1 }, animate: { opacity: 0, scale: 0 } };
      case 'spiral':
        return { initial: { opacity: 1, rotate: 0, scale: 1 }, animate: { opacity: 0, rotate: 720, scale: 0 } };
      case 'glitch':
        return { initial: { opacity: 1 }, animate: { opacity: [1, 0.5, 1, 0], x: [0, -5, 5, 0] } };
      default:
        return { initial: { opacity: 1 }, animate: { opacity: 0, y: -50 } };
    }
  };

  const variants = getAnimationVariants();

  return (
    <div className="relative">
      <motion.div
        initial={variants.initial}
        animate={variants.animate}
        transition={{ duration: 2.5, ease: 'easeOut' }}
        className="text-xl text-white/80 leading-relaxed max-h-[40vh] overflow-hidden"
        style={{ color }}
      >
        {text.slice(0, 500)}{text.length > 500 ? '...' : ''}
      </motion.div>
    </div>
  );
}

// Cool-Down Activity Component
interface CoolDownProps {
  type: string;
  content: string;
  duration: number;
  timeRemaining: number;
}

function CoolDownActivity({ type, content, duration, timeRemaining }: CoolDownProps) {
  const progress = ((duration - timeRemaining) / duration) * 100;

  return (
    <div className="space-y-6">
      {type === 'breathing' && (
        <motion.div
          animate={{
            scale: [1, 1.3, 1.3, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            times: [0, 0.25, 0.5, 0.75]
          }}
          className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center"
        >
          <div className="w-20 h-20 rounded-full bg-white/10" />
        </motion.div>
      )}
      
      {type === 'silence' && (
        <div className="h-32 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-zinc-600 animate-pulse" />
        </div>
      )}
      
      {(type === 'prompt' || type === 'action' || type === 'grounding' || type === 'visual') && (
        <p className="text-xl text-white font-light">{content}</p>
      )}
      
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <p className="text-zinc-400 text-sm">
        {timeRemaining}s remaining
      </p>
    </div>
  );
}

export { RELEASE_LOOPS, MOOD_COLORS, MOOD_NAMES, MOOD_ICONS, getLoopsByCategory };
