'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

interface WorryDumpProps {
  worries: string;
  onChange: (worries: string) => void;
}

/**
 * Worry Dump / Expressive Writing
 * Scientific Basis: Pennebaker (1997) - Reduces intrusive thoughts by 50%
 * Mechanism: Cognitive offloading + emotional processing + working memory liberation
 */
export function WorryDump({ worries, onChange }: WorryDumpProps) {
  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-blue-500" />
        <Label className="text-lg font-medium">Worry Dump (Optional)</Label>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Write down what's bothering you—unfiltered, uncensored. 
        Studies show this reduces rumination and frees mental bandwidth.
      </p>

      <Textarea
        value={worries}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What's weighing on your mind? Get it all out here..."
        className="min-h-[150px] bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl border-white/20 resize-none"
      />

      <div className="p-4 bg-blue-50/60 dark:bg-blue-900/20 backdrop-blur-xl rounded-2xl border border-blue-200/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Why this works:</strong> Unexpressed worries loop in your mind. 
          Externalizing them onto paper signals your brain they're "handled," reducing anxiety.
        </p>
      </div>
    </div>
  );
}
