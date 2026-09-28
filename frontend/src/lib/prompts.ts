// Deep Dive prompts based on mood and context
export const generateDeepDivePrompts = (
  mood: number,
  energy: number,
  activities: string[]
): string[] => {
  const prompts: string[] = [];
  
  // Low mood prompts (CBT-inspired reframing)
  if (mood < 5) {
    prompts.push(
      "What's one small thing that went right today, even if it feels insignificant?",
      "If you described today to a friend, what would they remind you to be grateful for?",
      "What's one action you could take right now that your future self would thank you for?"
    );
  }
  
  // Mid mood prompts (neutral exploration)
  if (mood >= 5 && mood <= 7) {
    prompts.push(
      "What surprised you most about today?",
      "Describe a moment when you felt most 'yourself' today.",
      "If today were a chapter in your life story, what would you title it?"
    );
  }
  
  // High mood prompts (gratitude & savoring)
  if (mood > 7) {
    prompts.push(
      "What made today special? Write it in detail so you can revisit this feeling.",
      "Who or what deserves credit for your positive mood today?",
      "How can you create more days like this?"
    );
  }
  
  // Low energy prompts
  if (energy < 5) {
    prompts.push(
      "What drained your energy today? Is it worth the cost?",
      "What would rest look like for you right now?"
    );
  }
  
  // Activity-specific prompts
  if (activities.includes('work')) {
    prompts.push("What's one work-related thing you're proud of, or one lesson you learned?");
  }
  
  if (activities.includes('social')) {
    prompts.push("How did your social interactions affect your internal state today?");
  }
  
  if (activities.includes('exercise')) {
    prompts.push("How did movement change your perspective or mood?");
  }
  
  if (activities.includes('nature')) {
    prompts.push("What did you notice in nature that you hadn't seen before?");
  }
  
  // Stoic pre-mortem style
  prompts.push(
    "What went well today that you want to repeat?",
    "What would you approach differently if you could redo today?"
  );
  
  // Randomly select 3-5 prompts
  const shuffled = prompts.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(5, shuffled.length));
};

// Gratitude-focused prompts
export const gratitudePrompts = [
  "List three small things that made you smile today.",
  "Who made your day better, and how?",
  "What's something you often take for granted that deserves appreciation?",
  "What challenge are you grateful for in hindsight?",
];

// Stoic reflection prompts
export const stoicPrompts = [
  "What was within your control today, and what wasn't?",
  "How did you practice virtue today (wisdom, courage, justice, or temperance)?",
  "What would your wisest self say about today's events?",
  "What temporary discomfort helped you grow today?",
];

// Future self prompts
export const futureSelfPrompts = [
  "What advice would your future self give you about today?",
  "What seeds are you planting today for your future harvest?",
  "What will you be proud of a year from now?",
];

// Random prompt generator
export const getRandomPrompt = (): string => {
  const allPrompts = [
    ...gratitudePrompts,
    ...stoicPrompts,
    ...futureSelfPrompts,
  ];
  
  return allPrompts[Math.floor(Math.random() * allPrompts.length)];
};
