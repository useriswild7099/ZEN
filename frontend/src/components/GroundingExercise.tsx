'use client';

import { useState } from 'react';

interface GroundingExerciseProps {
  onBack: () => void;
}

interface GroundingStep {
  count: number;
  sense: string;
  prompt: string;
  emoji: string;
}

const GROUNDING_STEPS: GroundingStep[] = [
  { count: 5, sense: 'SEE', prompt: 'Name 5 things you can see around you', emoji: '👁️' },
  { count: 4, sense: 'TOUCH', prompt: 'Name 4 things you can physically feel', emoji: '✋' },
  { count: 3, sense: 'HEAR', prompt: 'Name 3 things you can hear right now', emoji: '👂' },
  { count: 2, sense: 'SMELL', prompt: 'Name 2 things you can smell', emoji: '👃' },
  { count: 1, sense: 'TASTE', prompt: 'Name 1 thing you can taste', emoji: '👅' },
];

export default function GroundingExercise({ onBack }: GroundingExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<string[][]>(GROUNDING_STEPS.map(step => Array(step.count).fill('')));
  const [isComplete, setIsComplete] = useState(false);

  const step = GROUNDING_STEPS[currentStep];
  const progress = ((currentStep) / GROUNDING_STEPS.length) * 100;

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[currentStep] = [...newInputs[currentStep]];
    newInputs[currentStep][index] = value;
    setInputs(newInputs);
  };

  const canAdvance = () => {
    return inputs[currentStep].some(input => input.trim().length > 0);
  };

  const handleNext = () => {
    if (currentStep < GROUNDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="glass-card p-8 max-w-md w-full mx-4 text-center relative">
          <div className="text-6xl mb-4 animate-seed-grow">🌈</div>
          <h2 className="text-2xl font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            You did it!
          </h2>
          <p className="text-zinc-300 mb-6">
            You've grounded yourself in the present moment. 
            Take a deep breath and notice how you feel now.
          </p>
          <button onClick={onBack} className="btn-zen btn-zen-primary">
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card p-8 max-w-md w-full mx-4 relative">
        {/* Back/Close button */}
        <button
          onClick={onBack}
          className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
          title="Go Back"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-white mb-2 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
          5-4-3-2-1 Grounding
        </h2>
        <p className="text-zinc-300 mb-6 text-center">
          Reconnect with the present moment
        </p>

        {/* Progress bar */}
        <div className="h-2 bg-white/20 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-purple-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current step */}
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 block">{step.emoji}</span>
          <h3 className="text-xl font-semibold text-white">
            {step.count} things you can {step.sense}
          </h3>
          <p className="text-zinc-400 text-sm mt-1">{step.prompt}</p>
        </div>

        {/* Input fields */}
        <div className="space-y-3 mb-6">
          {Array.from({ length: step.count }).map((_, index) => (
            <input
              key={index}
              type="text"
              value={inputs[currentStep][index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`${index + 1}.`}
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-zinc-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 outline-none transition-all"
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="btn-zen btn-zen-secondary disabled:opacity-50"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canAdvance()}
            className="btn-zen btn-zen-primary disabled:opacity-50"
          >
            {currentStep === GROUNDING_STEPS.length - 1 ? 'Complete' : 'Next →'}
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {GROUNDING_STEPS.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? 'bg-purple-500'
                  : index < currentStep
                  ? 'bg-purple-300'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
