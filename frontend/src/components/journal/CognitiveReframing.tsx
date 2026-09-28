'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Brain, AlertCircle } from 'lucide-react';

interface CognitiveReframingProps {
  negativeThought: string;
  reframedThought: string;
  onChange: (data: { negativeThought: string; reframedThought: string }) => void;
}

/**
 * Cognitive Distortion Identifier & Reframing
 * Scientific Basis: Beck (1976) - CBT reduces depression by 50-60%
 * Mechanism: Metacognition + cognitive restructuring + thought diffusion
 */
export function CognitiveReframing({ negativeThought, reframedThought, onChange }: CognitiveReframingProps) {
  const [detectedDistortions, setDetectedDistortions] = useState<string[]>([]);

  const distortionPatterns = [
    { 
      name: 'All-or-Nothing', 
      keywords: ['always', 'never', 'every', 'no one', 'everyone', 'completely'],
      explanation: 'Seeing things in black-and-white categories'
    },
    { 
      name: 'Catastrophizing', 
      keywords: ['disaster', 'terrible', 'worst', 'ruin', 'horrible', 'awful'],
      explanation: 'Expecting the worst possible outcome'
    },
    { 
      name: 'Mind Reading', 
      keywords: ['they think', 'she thinks', 'he thinks', 'they must', 'probably thinks'],
      explanation: 'Assuming you know what others think'
    },
    { 
      name: 'Should Statements', 
      keywords: ['should', 'must', 'ought to', 'have to'],
      explanation: 'Rigid rules about how you/others should behave'
    },
    { 
      name: 'Personalization', 
      keywords: ['my fault', 'because of me', 'i caused', 'i made'],
      explanation: 'Blaming yourself for things outside your control'
    },
  ];

  const analyzeThought = (thought: string) => {
    const detected: string[] = [];
    const lowerThought = thought.toLowerCase();
    
    distortionPatterns.forEach(pattern => {
      if (pattern.keywords.some(keyword => lowerThought.includes(keyword))) {
        detected.push(pattern.name);
      }
    });
    
    setDetectedDistortions(detected);
  };

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-2">
        <Brain className="h-5 w-5 text-purple-500" />
        <Label className="text-lg font-medium">Thought Reframing (CBT)</Label>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Negative thoughts aren't facts. Let's examine and reframe them using cognitive behavioral therapy techniques.
      </p>

      {/* Negative Thought */}
      <div className="space-y-2">
        <Label className="text-sm">What's a negative thought you had today?</Label>
        <Textarea
          value={negativeThought}
          onChange={(e) => {
            onChange({ negativeThought: e.target.value, reframedThought });
            analyzeThought(e.target.value);
          }}
          placeholder="e.g., 'I always mess everything up' or 'Everyone thinks I'm incompetent'"
          className="min-h-[100px] bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl border-white/20 resize-none"
        />
      </div>

      {/* Detected Distortions */}
      {detectedDistortions.length > 0 && (
        <div className="p-4 bg-purple-50/60 dark:bg-purple-900/20 backdrop-blur-xl rounded-2xl border border-purple-200/20 space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-purple-500" />
            <p className="text-sm font-semibold">Possible Cognitive Distortions Detected:</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {detectedDistortions.map(distortion => {
              const pattern = distortionPatterns.find(p => p.name === distortion);
              return (
                <span 
                  key={distortion}
                  className="text-xs bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-full"
                  title={pattern?.explanation}
                >
                  {distortion}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            These thinking patterns can distort reality. Let's reframe this thought more accurately.
          </p>
        </div>
      )}

      {/* Reframed Thought */}
      <div className="space-y-2">
        <Label className="text-sm">Now reframe it: What's a more balanced, realistic perspective?</Label>
        <Textarea
          value={reframedThought}
          onChange={(e) => onChange({ negativeThought, reframedThought: e.target.value })}
          placeholder="e.g., 'I made a mistake, but I've succeeded many times before. This is one moment, not my whole identity.'"
          className="min-h-[100px] bg-green-50/60 dark:bg-green-900/20 backdrop-blur-xl border-green-200/20 resize-none"
        />
      </div>

      <div className="p-4 bg-blue-50/60 dark:bg-blue-900/20 backdrop-blur-xl rounded-2xl border border-blue-200/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Why this works:</strong> Cognitive therapy shows that changing thoughts changes emotions. 
          Regular practice rewires neural pathways, making balanced thinking automatic.
        </p>
      </div>
    </div>
  );
}
