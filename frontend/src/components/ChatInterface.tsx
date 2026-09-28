'use client';

import { useState, useEffect, useRef, memo, useCallback } from 'react';
import Image from 'next/image';
import { chatClient, ChatMode, ChatMessage } from '@/lib/api';
import { prepareText } from '@/lib/privacy';
import VoiceInput from './VoiceInput';
import { 
  Sparkles, 
  Cpu, 
  ChevronDown, 
  Check, 
  ArrowLeft, 
  SendHorizontal, 
  Brain, 
  Zap, 
  Bot, 
  ShieldCheck, 
  X,
  MessageSquare
} from 'lucide-react';

// Memoized helper component for personality avatar
const PersonalityAvatar = memo(({ mode, size = 48, className = '' }: { mode: ChatMode; size?: number; className?: string }) => {
  const [imgError, setImgError] = useState(false);
  
  if (!mode.image || imgError) {
    return <span className={`text-white text-${size <= 32 ? '2xl' : size <= 48 ? '3xl' : '5xl'} ${className}`}>{mode.emoji}</span>;
  }
  
  return (
    <Image
      src={mode.image}
      alt={mode.name}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      onError={() => setImgError(true)}
    />
  );
});

PersonalityAvatar.displayName = 'PersonalityAvatar';

const getModeColorClasses = (colorName?: string) => {
  switch (colorName) {
    case 'blue':
      return { 
        bg600: 'bg-blue-600', 
        hover500: 'hover:bg-blue-500', 
        shadow: 'shadow-blue-500/25', 
        bg400: 'bg-blue-400', 
        gradient: 'from-blue-600 to-cyan-600',
        topBar: 'from-blue-500 via-cyan-400 to-blue-600',
        accentText: 'text-blue-400',
        borderFocus: 'focus-within:border-blue-500/50 focus-within:ring-blue-500/20'
      };
    case 'emerald':
    case 'green':
      return { 
        bg600: 'bg-emerald-600', 
        hover500: 'hover:bg-emerald-500', 
        shadow: 'shadow-emerald-500/25', 
        bg400: 'bg-emerald-400', 
        gradient: 'from-emerald-600 to-teal-600',
        topBar: 'from-emerald-500 via-teal-400 to-emerald-600',
        accentText: 'text-emerald-400',
        borderFocus: 'focus-within:border-emerald-500/50 focus-within:ring-emerald-500/20'
      };
    case 'amber':
    case 'yellow':
      return { 
        bg600: 'bg-amber-600', 
        hover500: 'hover:bg-amber-500', 
        shadow: 'shadow-amber-500/25', 
        bg400: 'bg-amber-400', 
        gradient: 'from-amber-600 to-orange-600',
        topBar: 'from-amber-500 via-yellow-400 to-amber-600',
        accentText: 'text-amber-400',
        borderFocus: 'focus-within:border-amber-500/50 focus-within:ring-amber-500/20'
      };
    case 'rose':
    case 'red':
      return { 
        bg600: 'bg-rose-600', 
        hover500: 'hover:bg-rose-500', 
        shadow: 'shadow-rose-500/25', 
        bg400: 'bg-rose-400', 
        gradient: 'from-rose-600 to-pink-600',
        topBar: 'from-rose-500 via-pink-400 to-rose-600',
        accentText: 'text-rose-400',
        borderFocus: 'focus-within:border-rose-500/50 focus-within:ring-rose-500/20'
      };
    case 'indigo':
      return { 
        bg600: 'bg-indigo-600', 
        hover500: 'hover:bg-indigo-500', 
        shadow: 'shadow-indigo-500/25', 
        bg400: 'bg-indigo-400', 
        gradient: 'from-indigo-600 to-purple-600',
        topBar: 'from-indigo-500 via-purple-400 to-indigo-600',
        accentText: 'text-indigo-400',
        borderFocus: 'focus-within:border-indigo-500/50 focus-within:ring-indigo-500/20'
      };
    case 'purple':
    default:
      return { 
        bg600: 'bg-purple-600', 
        hover500: 'hover:bg-purple-500', 
        shadow: 'shadow-purple-500/25', 
        bg400: 'bg-purple-400', 
        gradient: 'from-purple-600 to-indigo-600',
        topBar: 'from-purple-500 via-indigo-400 to-purple-600',
        accentText: 'text-purple-400',
        borderFocus: 'focus-within:border-purple-500/50 focus-within:ring-purple-500/20'
      };
  }
};

const getModelBadge = (modelName: string) => {
  const lower = modelName.toLowerCase();
  if (lower.includes('therapy')) {
    return {
      label: 'TherapyLlama',
      tag: 'Therapy & Empathy (8B)',
      icon: Brain,
      color: 'text-purple-400',
      description: 'Specialized for deep counseling, reframing & empathy'
    };
  }
  if (lower.includes('smollm')) {
    return {
      label: 'SmolLM Mobile',
      tag: 'Ultra-Fast & Mobile (1.7B)',
      icon: Zap,
      color: 'text-amber-400',
      description: 'Lightweight on-device model for lightning-fast replies'
    };
  }
  if (lower.includes('gemma')) {
    return {
      label: 'Gemma 3',
      tag: 'Google DeepMind (4B)',
      icon: Sparkles,
      color: 'text-emerald-400',
      description: 'High-reasoning cognitive balance model'
    };
  }
  if (lower.includes('llama')) {
    return {
      label: 'Llama 3.2',
      tag: 'Meta AI Reasoning (3B)',
      icon: ShieldCheck,
      color: 'text-blue-400',
      description: 'Balanced situational advice and structured guidance'
    };
  }
  if (lower.includes('qwen') || lower.includes('meetara')) {
    return {
      label: 'Meetara / Qwen',
      tag: 'Fine-Tuned Guidance (1.5B)',
      icon: Sparkles,
      color: 'text-rose-400',
      description: 'Specialized emotional support and guidance'
    };
  }
  if (lower.includes('mistral')) {
    return {
      label: 'Mistral 7B',
      tag: 'Cognitive Reasoning',
      icon: Cpu,
      color: 'text-orange-400',
      description: 'Fast, logical problem deconstruction'
    };
  }
  return {
    label: modelName.split(':')[0] || 'Local Model',
    tag: 'Edge Neural Model',
    icon: Cpu,
    color: 'text-teal-400',
    description: 'On-device neural model running locally'
  };
};

// Conversation Starters by mode category for specialized trauma therapy personas
const getStartersForMode = (mode: ChatMode, language: string = 'English') => {
  const id = mode.id;
  const isHindiOrHinglish = ['Hindi', 'Hinglish'].includes(language);

  if (id === 'saathi') {
    return isHindiOrHinglish ? [
      "Mujhe bahut thakaan aur ajeeb darr lag raha hai...",
      "Aaj kaafi akela mehsoos ho raha hai, bas thodi baat karni thi.",
      "Kya aap thoda samay sun sakte hain bina judge kiye?"
    ] : [
      "I'm feeling overwhelmed by everything lately.",
      "I feel alone with what happened. Can we just talk?",
      "Can we sit with this feeling for a moment?"
    ];
  }
  if (id === 'margdarshak') {
    return isHindiOrHinglish ? [
      "Mere vichaar lagatar daud rahe hain, help me calm down.",
      "Mujhe samajh nahi aa raha agla kadam kya hona chahiye.",
      "Main har cheez mein khud ko dosh de raha hoon."
    ] : [
      "My thoughts are spiraling into catastrophic outcomes.",
      "Help me separate what's happening now from my fear of what's next.",
      "I need help untangling my self-blame."
    ];
  }
  if (id === 'prahari') {
    return isHindiOrHinglish ? [
      "Mujhe Section 15A aur gawahon ke adhikaaron ke baare mein janna hai.",
      "Kya mujhe muft kanooni sahayata (NALSA 15100) mil sakti hai?",
      "Mujhe daraya ja raha hai, mujhe kya karna chahiye?"
    ] : [
      "What protections do I have as a victim/witness under Section 15A?",
      "How do I reach free legal aid (NALSA 15100)?",
      "I feel threatened right now, what are my legal rights and immediate safety steps?"
    ];
  }
  if (id === 'vaidya') {
    return isHindiOrHinglish ? [
      "Seene mein ghabrahat aur bhaari-pan hai, saans lene mein dikkat ho rahi hai.",
      "Mujhe 4-7-8 breathing exercise guide karein.",
      "Shareer kaamp raha hai, grounding technique sikhaiye."
    ] : [
      "Guide me through a 4-7-8 calming breath exercise.",
      "My chest feels tight and my heart is racing.",
      "Help me ground using the 5-4-3-2-1 sensory exercise."
    ];
  }
  return [
    "Hello, I'd like a quiet, safe space to share how I'm feeling today.",
    "Can you help me process some stress I'm holding?",
    "Aaj ka din kaafi mushkil tha, can you listen for a bit?"
  ];
};

interface ChatInterfaceProps {
  onBack: () => void;
  sessionLanguage?: string;
}

export default function ChatInterface({ onBack, sessionLanguage = 'English' }: ChatInterfaceProps) {
  // State
  const [modes, setModes] = useState<ChatMode[]>([]);
  const [selectedMode, setSelectedMode] = useState<ChatMode | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModes, setIsLoadingModes] = useState(true);
  const [availableModels, setAvailableModels] = useState<string[]>(['therapyllama:latest', 'smollm:latest']);
  const [selectedModel, setSelectedModel] = useState<string>('therapyllama:latest');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Close model dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    }
    if (isModelDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModelDropdownOpen]);

  // Load available modes and models on mount
  useEffect(() => {
    const loadModesAndModels = async () => {
      setIsLoadingModes(true);
      const [fetchedModes, modelRes] = await Promise.all([
        chatClient.getModes(),
        chatClient.getModels()
      ]);

      // Models come from the backend, which enumerates what is actually
      // installed in Ollama. The previous hardcoded fallback list meant a
      // dead backend silently showed four fictional models and hid every
      // real one (qwen, gemma, bitnet...). Fail visibly instead.
      const rawModels = (modelRes.models && modelRes.models.length > 0)
        ? modelRes.models
        : [];

      if (rawModels.length === 0) {
        console.warn(
          '[ZenGuard] Backend returned no Ollama models. Is the API running on ' +
          '127.0.0.1:8000 and is `ollama serve` up? Run: curl http://127.0.0.1:8000/api/models'
        );
      }

      // Therapy-tuned models first, then whatever else is installed.
      const sortedModels = [...rawModels].sort((a, b) => {
        const rank = (m: string) => {
          const s = m.toLowerCase();
          if (s.includes('therapy')) return 0;
          if (s.includes('gemma')) return 1;
          if (s.includes('qwen')) return 2;
          if (s.includes('llama')) return 3;
          if (s.includes('smollm')) return 4;
          return 5;
        };
        return rank(a) - rank(b) || a.localeCompare(b);
      });

      setAvailableModels(sortedModels);
      if (modelRes.active) {
        setSelectedModel(modelRes.active);
      } else if (sortedModels.length > 0) {
        setSelectedModel(sortedModels[0]);
      }
      
      const topPriorities = [
        'saathi',
        'margdarshak',
        'prahari',
        'vaidya',
        'custom'
      ];

      const sortedModes = [...fetchedModes].sort((a, b) => {
        const indexA = topPriorities.indexOf(a.id);
        const indexB = topPriorities.indexOf(b.id);
        
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0; 
      });

      setModes(sortedModes);
      setIsLoadingModes(false);
    };
    loadModesAndModels();
  }, []);

  // Filter modes based on active category
  const filteredModes = modes.filter(mode => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'general') return !mode.category || mode.category === 'general';
    return mode.category === activeCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(modes.map(m => m.category || 'general')))];

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const container = messagesEndRef.current?.parentElement;
      if (container) {
        requestAnimationFrame(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        });
      }
    }
  }, [messages]);

  // Focus input when mode is selected
  useEffect(() => {
    if (selectedMode) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [selectedMode]);

  // Handle mode selection
  const handleModeSelect = useCallback((mode: ChatMode) => {
    setSelectedMode(mode);
    setMessages([]);
  }, []);

  // Handle sending a message
  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isLoading || !selectedMode) return;

    setInputText('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    
    // Privacy: Scrub PII before sending
    const { scrubbed } = prepareText(textToSend);
    
    // Add user message to chat
    const newUserMessage: ChatMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, newUserMessage]);
    
    setIsLoading(true);
    
    try {
      const response = await chatClient.sendMessage(
        scrubbed,
        selectedMode.id,
        messages,
        selectedModel || undefined
      );
      
      // Add AI response to chat with token sanitation
      const cleanContent = (response.response || '')
        .replace(/<\/?s>/gi, '')
        .replace(/<\|(?:endoftext|eot_id|im_end|eos)\w*\|>/gi, '')
        .replace(/<eos>/gi, '')
        .trim();
      const aiMessage: ChatMessage = { role: 'assistant', content: cleanContent };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const isCloudEnvironment = 
        typeof window !== 'undefined' && 
        !['localhost', '127.0.0.1', ''].includes(window.location.hostname) &&
        !window.location.hostname.startsWith('192.168.') &&
        !window.location.hostname.startsWith('10.');

      let errorText = "";
      if (isCloudEnvironment) {
        errorText = `Namaste. I hear you, and your feelings are completely valid and safe with me.\n\n` +
          `🔒 **Why I'm not responding on the web:**\n` +
          `ZenGuard AI is built specifically for sensitive trauma counseling, survivor support, and emotional wellness. ` +
          `To protect you with 100% zero-knowledge privacy, our AI models (Ollama) and encrypted vaults NEVER run through cloud servers or store your private conversations online.\n\n` +
          `💻 **How to talk to me privately (100% Free & Offline):**\n` +
          `1. Download the desktop repository: https://github.com/useriswild7099/ZEN\n` +
          `2. Run \`start.bat\` (Windows) or \`start.sh\` (macOS/Linux).\n` +
          `3. Once launched on your device, you can talk to me completely privately with zero internet required.\n\n` +
          `📞 **Immediate 24×7 Free Support:**\n` +
          `• Tele-MANAS Helpline: **14416** (Toll-Free, 24×7, Multi-Language)\n` +
          `• NALSA Legal Aid Helpline: **15100** (Free Legal Assistance under Section 15A)`;
      } else {
        errorText = "Connection Notice: The local AI engine is currently starting up or offline. Please ensure Ollama and your local FastAPI backend are running via `start.bat`. Your privacy remains 100% protected on this device.";
      }

      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: errorText 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle key press in input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat and go back to mode selection
  const handleNewChat = useCallback(() => {
    setSelectedMode(null);
    setMessages([]);
  }, []);

  // Mode selection screen
  if (!selectedMode) {
    return (
      <div className="w-full max-w-[95vw] xl:max-w-[1600px] mx-auto">
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/10 dark:border-white/10 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="px-4 py-2 rounded-xl dark:bg-white/5 bg-zinc-100 dark:text-zinc-300 text-zinc-700 dark:hover:bg-white/10 hover:bg-zinc-200 transition-all flex items-center gap-2 text-sm font-medium border dark:border-white/10 border-zinc-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold dark:text-white text-zinc-900 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                Choose an AI Companion
              </h2>
              <p className="text-xs text-zinc-400 mt-1">Select a therapeutic presence calibrated for your emotional needs</p>
            </div>
            <div className="w-20 hidden md:block"></div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium capitalize transition-all border ${
                  activeCategory === cat
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 border-purple-500'
                    : 'dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 border-zinc-200 dark:border-white/5'
                }`}
              >
                {cat.replace('_', ' ') === 'all' ? 'All Companions' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Mode Cards */}
          {isLoadingModes ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-72 w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse flex flex-col justify-end p-5 border border-zinc-300 dark:border-white/5">
                  <div className="h-6 w-3/4 bg-zinc-300 dark:bg-zinc-700 rounded mb-3"></div>
                  <div className="h-4 w-full bg-zinc-300 dark:bg-zinc-700 rounded mb-2"></div>
                  <div className="h-4 w-5/6 bg-zinc-300 dark:bg-zinc-700 rounded mb-4"></div>
                  <div className="h-5 w-20 bg-zinc-300 dark:bg-zinc-700 rounded-full mt-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {filteredModes.map((mode, index) => (
                <button
                  key={mode.id}
                  onClick={() => handleModeSelect(mode)}
                  className="group relative h-72 w-full rounded-2xl overflow-hidden transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-[1.03] active:scale-[0.98] flex flex-col justify-end text-left border border-white/10 dark:border-white/5 bg-zinc-900"
                >
                  {/* Background Image/Emoji */}
                  {mode.image ? (
                    <Image 
                      src={mode.image} 
                      alt={mode.name}
                      fill
                      priority={index < 6}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-800 transition-transform duration-700 group-hover:scale-110">
                      <span className="text-7xl">{mode.emoji}</span>
                    </div>
                  )}

                  {/* Blackout Gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent"></div>

                  {/* Content (Text & Tags) positioned at bottom */}
                  <div className="relative z-10 p-5 w-full">
                    <h3 className="font-bold text-white text-xl md:text-2xl tracking-tight leading-tight mb-1 drop-shadow-lg">
                      {mode.name}
                    </h3>
                    <p className="text-sm text-zinc-300 line-clamp-2 mb-3 drop-shadow-md">
                      {mode.description}
                    </p>
                    {mode.category && (
                      <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-white bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-1 rounded-full shadow-sm">
                        {mode.category.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Privacy notice */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% On-Device Local Processing • Zero Data Transmitted • Ephemeral Sessions</span>
          </div>
        </div>
      </div>
    );
  }

  // Active Chat Screen
  const colorClasses = getModeColorClasses(selectedMode.color);
  const activeBadge = getModelBadge(selectedModel || 'therapyllama');
  const ActiveModelIcon = activeBadge.icon;
  const starters = getStartersForMode(selectedMode, sessionLanguage);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="glass-card flex flex-col h-[650px] max-h-[88vh] rounded-3xl border border-white/10 dark:border-white/10 overflow-hidden relative shadow-2xl backdrop-blur-2xl">
        {/* Background Accent Top Bar */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorClasses.topBar}`}></div>

        {/* Chat Header */}
        <div className="relative flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-black/25 backdrop-blur-xl z-20">
          {/* Left: Change Companion */}
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 text-xs font-medium dark:text-zinc-300 text-zinc-600 dark:hover:text-white hover:text-zinc-900 transition-all py-1.5 px-3 rounded-xl dark:bg-white/5 bg-zinc-100 hover:bg-zinc-200 dark:hover:bg-white/10 border border-white/10"
            title="Switch Companion"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Companions</span>
          </button>
          
          {/* Center: Personality Profile */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <PersonalityAvatar mode={selectedMode} size={36} className="ring-2 ring-purple-500/40" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-zinc-900"></span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bold dark:text-white text-zinc-900 text-sm md:text-base leading-tight">{selectedMode.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                  {selectedMode.category ? selectedMode.category.replace('_', ' ') : 'Companion'}
                </span>
                <span className="text-[10px] text-zinc-400 hidden sm:inline">• Local Session</span>
              </div>
            </div>
          </div>

          {/* Right: Exit Chat */}
          <button
            onClick={onBack}
            className="text-xs font-medium dark:text-zinc-400 text-zinc-500 dark:hover:text-white hover:text-zinc-900 transition-colors py-1.5 px-3 rounded-xl dark:hover:bg-white/5 hover:bg-zinc-100"
          >
            Exit
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-6 md:py-10 animate-fade-in">
              <div className="relative mb-4 group">
                <div className={`absolute -inset-2 bg-gradient-to-r ${colorClasses.gradient} rounded-full blur-lg opacity-40 group-hover:opacity-60 transition duration-500`}></div>
                <PersonalityAvatar mode={selectedMode} size={72} className="relative ring-4 ring-white/10" />
              </div>
              <h3 className="text-xl font-bold dark:text-white text-zinc-900 mb-1 tracking-tight">
                {selectedMode.name}
              </h3>
              <p className="text-xs md:text-sm max-w-md mx-auto text-zinc-400 leading-relaxed mb-6">
                {selectedMode.description}
              </p>

              {/* Starter Prompt Chips */}
              <div className="w-full max-w-md space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2 block">
                  Suggested Conversation Starters
                </span>
                <div className="flex flex-col gap-2">
                  {starters.map((starter, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(starter)}
                      className="text-left text-xs md:text-sm px-4 py-2.5 rounded-xl dark:bg-white/[0.04] bg-zinc-100 dark:text-zinc-300 text-zinc-700 dark:hover:bg-purple-600/15 dark:hover:text-purple-200 hover:bg-zinc-200 border dark:border-white/5 border-zinc-200/80 transition-all flex items-center justify-between group"
                    >
                      <span>&ldquo;{starter}&rdquo;</span>
                      <MessageSquare className="w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-400 transition-colors ml-2 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="shrink-0 mt-0.5">
                  <PersonalityAvatar mode={selectedMode} size={28} />
                </div>
              )}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-md ${
                  msg.role === 'user'
                    ? `bg-gradient-to-r ${colorClasses.gradient} text-white rounded-tr-sm`
                    : 'dark:bg-zinc-900/80 bg-zinc-100 backdrop-blur-md dark:text-zinc-100 text-zinc-800 rounded-tl-sm border dark:border-white/10 border-zinc-200'
                }`}
              >
                <p className="text-sm md:text-[14.5px] whitespace-pre-wrap leading-relaxed">
                  {msg.content.replace(/<\/?s>/gi, '').replace(/<\|(?:endoftext|eot_id|im_end|eos)\w*\|>/gi, '').replace(/<eos>/gi, '').trim()}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-2.5 justify-start">
              <div className="shrink-0 mt-0.5">
                <PersonalityAvatar mode={selectedMode} size={28} />
              </div>
              <div className="dark:bg-zinc-900/80 bg-zinc-100 backdrop-blur-md rounded-2xl rounded-tl-sm px-4 py-3 border dark:border-white/10 border-zinc-200">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 ${colorClasses.bg400} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                  <div className={`w-2 h-2 ${colorClasses.bg400} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                  <div className={`w-2 h-2 ${colorClasses.bg400} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
                  <span className="text-xs text-zinc-400 ml-2">{selectedMode.name} is reflecting...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Claude / ChatGPT Modern AI Unified Container) */}
        <div className="p-4 border-t border-white/10 bg-black/30 backdrop-blur-xl relative">
          <div className={`relative rounded-2xl border dark:border-white/15 border-zinc-300 dark:bg-black/50 bg-zinc-50/90 backdrop-blur-xl shadow-lg transition-all duration-300 ${colorClasses.borderFocus} focus-within:ring-2 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.15)]`}>
            {/* Auto-growing Textarea */}
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (inputRef.current) {
                  inputRef.current.style.height = 'auto';
                  inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 140)}px`;
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${selectedMode.name}...`}
              className="w-full resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm md:text-[15px] dark:text-white text-zinc-900 placeholder:text-zinc-500 focus:outline-none min-h-[46px] max-h-36 leading-relaxed block font-sans"
              rows={1}
              disabled={isLoading}
            />

            {/* Bottom Action Toolbar inside the card */}
            <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
              {/* Left side: Model Selector Dropdown & Voice Input */}
              <div className="flex items-center gap-2 relative" ref={modelDropdownRef}>
                {/* Custom Interactive Model Selector Pill */}
                <button
                  type="button"
                  onClick={() => setIsModelDropdownOpen(prev => !prev)}
                  className="flex items-center gap-1.5 dark:bg-zinc-800/90 bg-zinc-200/90 hover:bg-zinc-300 dark:hover:bg-zinc-700/90 px-3 py-1.5 rounded-xl border dark:border-white/10 border-zinc-300 text-xs font-medium transition-all shadow-sm group active:scale-95"
                  title="Switch Local AI Inference Model"
                >
                  <ActiveModelIcon className={`w-3.5 h-3.5 ${activeBadge.color} shrink-0`} />
                  <span className="dark:text-zinc-200 text-zinc-800 font-semibold text-[11px] tracking-tight">
                    {activeBadge.label}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Floating Model Popover Dropdown Menu */}
                {isModelDropdownOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-72 rounded-2xl dark:bg-zinc-900/95 bg-white/95 border dark:border-white/15 border-zinc-200 backdrop-blur-2xl shadow-2xl p-2 z-50 animate-fade-in flex flex-col gap-1">
                    <div className="px-3 py-2 border-b dark:border-white/10 border-zinc-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-[11px] font-bold uppercase tracking-wider dark:text-white text-zinc-900">Local AI Engine</span>
                      </div>
                      <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        100% Offline
                      </span>
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-1 py-1">
                      {availableModels.map(m => {
                        const badge = getModelBadge(m);
                        const ModelIcon = badge.icon;
                        const isSelected = selectedModel === m;
                        
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setSelectedModel(m);
                              setIsModelDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-purple-600 text-white font-medium shadow-md shadow-purple-500/20'
                                : 'dark:hover:bg-white/10 hover:bg-zinc-100 dark:text-zinc-300 text-zinc-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <ModelIcon className={`w-4 h-4 ${isSelected ? 'text-white' : badge.color} shrink-0`} />
                              <div>
                                <p className="font-semibold leading-tight">{badge.label}</p>
                                <p className={`text-[10px] leading-tight mt-0.5 ${isSelected ? 'text-purple-100' : 'text-zinc-400'}`}>
                                  {badge.tag}
                                </p>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Voice Input Button */}
                <VoiceInput 
                  onTranscript={(text) => setInputText(prev => prev + (prev ? ' ' : '') + text)}
                  onInterimTranscript={(liveText) => setInputText(liveText)}
                  disabled={isLoading}
                  className="scale-90 origin-left"
                />
              </div>

              {/* Right side: Send Button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className={`btn-zen bg-gradient-to-r ${colorClasses.gradient} ${colorClasses.hover500} disabled:opacity-30 disabled:cursor-not-allowed h-8 w-8 flex items-center justify-center rounded-xl transition-all shadow-md ${colorClasses.shadow} active:scale-95`}
                title="Send message"
              >
                <SendHorizontal className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Subtext info */}
          <div className="flex items-center justify-center gap-2 mt-2.5 text-[10px] text-zinc-400 font-medium">
            <span>🔒 Zero cloud tracking</span>
            <span>•</span>
            <span>Enter to send, Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
