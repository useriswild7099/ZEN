import { ChatMode } from '@/lib/api';

export const ALL_CHAT_MODES: ChatMode[] = [
  {
    id: "saathi",
    name: "Dost (Saathi)",
    emoji: "🫶",
    description: "Empathetic peer & active listener. Offers warm, non-judgmental presence and emotional safety.",
    category: "therapy",
    color: "purple",
    image: "/personalities/compasionate friend.png"
  },
  {
    id: "margdarshak",
    name: "Margdarshak (Guru)",
    emoji: "🪷",
    description: "Cognitive reframing & wisdom guide. Helps untangle racing thoughts, reduce catastrophizing, and find perspective.",
    category: "therapy",
    color: "amber",
    image: "/personalities/mindfulness guide.png"
  },
  {
    id: "prahari",
    name: "Prahari (Protector)",
    emoji: "🛡️",
    description: "Rights, safety & dignity anchor. Reassures victims with awareness of Section 15A protection & legal aid.",
    category: "therapy",
    color: "blue",
    image: "/personalities/father.png"
  },
  {
    id: "vaidya",
    name: "Vaidya (Healer)",
    emoji: "🌿",
    description: "Somatic calm & nervous system regulator. Guides through 4-7-8 breathing, tension release, and panic grounding.",
    category: "therapy",
    color: "emerald",
    image: "/personalities/academic coach.png"
  },
  {
    id: "custom",
    name: "Apna Saathi (Custom)",
    emoji: "✨",
    description: "Personalized companion. Customize your supporter's tone, name, and pacing to your comfort.",
    category: "custom",
    color: "rose",
    image: "/personalities/sister.png"
  }
];

export const DEFAULT_AI_MODELS = [
  'therapyllama:latest',
  'smollm:latest',
  'gemma3:latest',
  'llama3.2:latest'
];
