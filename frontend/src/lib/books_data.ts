import { BookRecommendation } from './knowledge';

export const MASTER_LIBRARY: BookRecommendation[] = [
  // --- MODERN CLASSICS (Curation) ---
  {
    id: 'book-atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Modern',
    summary: 'The comprehensive guide on how tiny changes lead to remarkable results.',
    targetAudience: 'Anyone struggling to stick to a routine or break a bad habit.',
    keyInsight: 'You do not rise to the level of your goals. You fall to the level of your systems.',
    color: 'from-amber-500 to-orange-600',
    readUrl: 'https://jamesclear.com/atomic-habits'
  },
  {
    id: 'book-why-we-sleep',
    title: 'Why We Sleep',
    author: 'Matthew Walker, PhD',
    category: 'Modern',
    summary: 'A deep dive into the vital importance of sleep for memory, health, and longevity.',
    targetAudience: 'High performers who think they can "get by" on 6 hours.',
    keyInsight: 'Sleep is the single most effective performance enhancing legal drug.',
    color: 'from-blue-600 to-indigo-900'
  },
  {
    id: 'book-dopamine-nation',
    title: 'Dopamine Nation',
    author: 'Dr. Anna Lembke',
    category: 'Modern',
    summary: 'Understanding the neuroscience of addiction and the "pain-pleasure" balance.',
    targetAudience: 'People who feel addicted to their phone, sugar, or distractions.',
    keyInsight: 'The pursuit of pleasure for its own sake leads to anhedonia.',
    color: 'from-pink-500 to-rose-600'
  },

  // --- STOICISM & ANCIENT WISDOM ---
  {
    id: 'pd-meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    category: 'Philosophy',
    summary: 'The personal reflections of the Roman Emperor on duty, mortality, and the Stoic path.',
    targetAudience: 'Leaders and anyone seeking emotional stability.',
    keyInsight: 'The happiness of your life depends upon the quality of your thoughts.',
    color: 'from-zinc-700 to-zinc-900',
    readUrl: 'https://www.gutenberg.org/ebooks/2680',
    externalSource: 'Project Gutenberg'
  },
  {
    id: 'pd-discourses',
    title: 'Discourses',
    author: 'Epictetus',
    category: 'Philosophy',
    summary: 'Practical Stoic teachings on what we can and cannot control.',
    targetAudience: 'People feeling overwhelmed by external circumstances.',
    keyInsight: 'It is not what happens to you, but how you react to it that matters.',
    color: 'from-slate-600 to-slate-800',
    readUrl: 'https://www.gutenberg.org/ebooks/10661'
  },
  {
    id: 'pd-enchiridion',
    title: 'The Enchiridion',
    author: 'Epictetus',
    category: 'Philosophy',
    summary: 'A short manual of Stoic ethical advice.',
    targetAudience: 'Those seeking a quick reference for Stoic living.',
    keyInsight: 'Control your perception, and you control your world.',
    color: 'from-slate-500 to-slate-700',
    readUrl: 'https://www.gutenberg.org/ebooks/45109'
  },
  {
    id: 'pd-letters-seneca',
    title: 'Moral Letters to Lucilius',
    author: 'Seneca',
    category: 'Philosophy',
    summary: 'Letters covering friendship, death, wealth, and the use of time.',
    targetAudience: 'Anyone pondering the deeper meaning of life.',
    keyInsight: 'We suffer more often in imagination than in reality.',
    color: 'from-stone-600 to-stone-800',
    readUrl: 'https://www.gutenberg.org/ebooks/37099'
  },
  {
    id: 'pd-on-shortness-life',
    title: 'On the Shortness of Life',
    author: 'Seneca',
    category: 'Philosophy',
    summary: 'A profound essay on why we feel time is short and how to use it better.',
    targetAudience: 'Procrastinators and those feeling "time-poor."',
    keyInsight: 'It is not that we have a short time to live, but that we waste a lot of it.',
    color: 'from-stone-700 to-stone-900',
    readUrl: 'https://archive.org/details/seneca-on-the-shortness-of-life'
  },

  // --- CLASSIC PHILOSOPHY ---
  {
    id: 'pd-republic',
    title: 'The Republic',
    author: 'Plato',
    category: 'Philosophy',
    summary: 'A dialogue concerning justice, the soul, and the ideal state.',
    targetAudience: 'Students of ethics and political philosophy.',
    keyInsight: 'The heaviest penalty for declining to rule is to be ruled by someone inferior.',
    color: 'from-blue-900 to-indigo-950',
    readUrl: 'https://www.gutenberg.org/ebooks/1497'
  },
  {
    id: 'pd-ethics-aristotle',
    title: 'Nicomachean Ethics',
    author: 'Aristotle',
    category: 'Philosophy',
    summary: 'The foundation of virtue ethics and human flourishing.',
    targetAudience: 'Seekers of the "Golden Mean."',
    keyInsight: 'Excellence is not an act, but a habit.',
    color: 'from-blue-800 to-slate-900',
    readUrl: 'https://www.gutenberg.org/ebooks/8438'
  },
  {
    id: 'pd-beyond-good-evil',
    title: 'Beyond Good and Evil',
    author: 'Friedrich Nietzsche',
    category: 'Philosophy',
    summary: 'A critique of traditional morality and an invitation to self-creation.',
    targetAudience: 'Independent thinkers looking to challenge their biases.',
    keyInsight: 'He who fights with monsters might take care lest he thereby become a monster.',
    color: 'from-red-950 to-black',
    readUrl: 'https://www.gutenberg.org/ebooks/4363'
  },
  {
    id: 'pd-art-of-war',
    title: 'The Art of War',
    author: 'Sun Tzu',
    category: 'Philosophy',
    summary: 'Strategic principles for conflict, leadership, and mental preparation.',
    targetAudience: 'Anyone facing competition or conflict.',
    keyInsight: 'All warfare is based on deception.',
    color: 'from-emerald-900 to-zinc-950',
    readUrl: 'https://www.gutenberg.org/ebooks/132'
  },
  {
    id: 'pd-analects',
    title: 'The Analects',
    author: 'Confucius',
    category: 'Philosophy',
    summary: 'A collection of sayings and ideas attributed to the Chinese philosopher Confucius.',
    targetAudience: 'Those interested in social harmony and personal ethics.',
    keyInsight: 'The man who moves a mountain begins by carrying away small stones.',
    color: 'from-red-900 to-orange-950',
    readUrl: 'https://www.gutenberg.org/ebooks/3330'
  },

  // --- PSYCHOLOGY FOUNDATIONS ---
  {
    id: 'pd-principles-psych',
    title: 'Principles of Psychology',
    author: 'William James',
    category: 'Psychology',
    summary: 'The classic text that shaped modern psychology.',
    targetAudience: 'Students of the mind and habit.',
    keyInsight: 'Act as if what you do makes a difference. It does.',
    color: 'from-blue-700 to-indigo-950',
    readUrl: 'https://www.gutenberg.org/ebooks/38194'
  },
  {
    id: 'pd-jung-symbols',
    title: 'Psychology of the Unconscious',
    author: 'Carl Jung',
    category: 'Psychology',
    summary: 'Jung\'s breakout work on myths and archetypes.',
    targetAudience: 'Those interested in the deep unconscious.',
    keyInsight: 'Who looks outside, dreams; who looks inside, awakes.',
    color: 'from-indigo-900 to-purple-950',
    readUrl: 'https://www.gutenberg.org/ebooks/62254'
  },
  {
    id: 'pd-freud-dreams',
    title: 'Interpretation of Dreams',
    author: 'Sigmund Freud',
    category: 'Psychology',
    summary: 'The introduction of the unconscious through dream analysis.',
    targetAudience: 'Curious minds about the hidden self.',
    keyInsight: 'Dreams are the royal road to the unconscious.',
    color: 'from-purple-900 to-zinc-950',
    readUrl: 'https://www.gutenberg.org/ebooks/66048'
  },
  {
    id: 'pd-adler-nervous',
    title: 'The Neurotic Constitution',
    author: 'Alfred Adler',
    category: 'Psychology',
    summary: 'Exploring the origins of the "inferiority complex" and individual psychology.',
    targetAudience: 'Those interested in the social roots of personality.',
    keyInsight: 'To be human means to feel inferior.',
    color: 'from-blue-600 to-teal-900',
    readUrl: 'https://www.gutenberg.org/ebooks/61179'
  },

  // --- SELF-MASTERY ---
  {
    id: 'pd-as-man-thinketh',
    title: 'As a Man Thinketh',
    author: 'James Allen',
    category: 'Self-Mastery',
    summary: 'The power of mind to shape character and circumstance.',
    targetAudience: 'Those seeking focus and personal accountability.',
    keyInsight: 'Circumstances do not make the man; they reveal him to himself.',
    color: 'from-cyan-600 to-blue-800',
    readUrl: 'https://www.gutenberg.org/ebooks/4507'
  },
  {
    id: 'pd-self-reliance-emerson',
    title: 'Self-Reliance',
    author: 'Ralph Waldo Emerson',
    category: 'Self-Mastery',
    summary: 'The definitive essay on non-conformity and intuition.',
    targetAudience: 'Trailblazers and soul-searchers.',
    keyInsight: 'Trust thyself: every heart vibrates to that iron string.',
    color: 'from-green-700 to-emerald-900',
    readUrl: 'https://www.gutenberg.org/ebooks/16643'
  },
  {
    id: 'pd-walden',
    title: 'Walden',
    author: 'Henry David Thoreau',
    category: 'Self-Mastery',
    summary: 'Reflections on simple living and solitude.',
    targetAudience: 'Those feeling overwhelmed by modern noise.',
    keyInsight: 'I went to the woods because I wished to live deliberately.',
    color: 'from-emerald-800 to-green-950',
    readUrl: 'https://www.gutenberg.org/ebooks/205'
  },
  {
    id: 'pd-mastery-destiny',
    title: 'The Mastery of Destiny',
    author: 'James Allen',
    category: 'Self-Mastery',
    summary: 'Practical principles for building character and focus.',
    targetAudience: 'Anyone seeking to master their habits.',
    keyInsight: 'The mind is the master weaver.',
    color: 'from-emerald-600 to-teal-800'
  },

  // --- SPIRIT & MINDFULNESS ---
  {
    id: 'pd-prophet',
    title: 'The Prophet',
    author: 'Kahlil Gibran',
    category: 'Spirit',
    summary: 'Poetic wisdom on love, work, and the human condition.',
    targetAudience: 'Seeking meaningful perspective on daily life.',
    keyInsight: 'Your pain is the breaking of the shell that encloses your understanding.',
    color: 'from-amber-600 to-orange-850',
    readUrl: 'https://www.gutenberg.org/ebooks/58585'
  },
  {
    id: 'pd-siddhartha',
    title: 'Siddhartha',
    author: 'Hermann Hesse',
    category: 'Spirit',
    summary: 'The journey of a man seeking enlightenment.',
    targetAudience: 'Seekers of balance and wisdom.',
    keyInsight: 'Wisdom is not communicable.',
    color: 'from-yellow-700 to-amber-900',
    readUrl: 'https://www.gutenberg.org/ebooks/2500'
  },
  {
    id: 'pd-dhammapada',
    title: 'The Dhammapada',
    author: 'Buddha (Trans.)',
    category: 'Spirit',
    summary: 'A collection of the Buddha\'s direct teachings.',
    targetAudience: 'Practitioners of mindfulness and peace.',
    keyInsight: 'Mind is the forerunner of all states.',
    color: 'from-orange-700 to-amber-800',
    readUrl: 'https://www.gutenberg.org/ebooks/2017'
  },
  {
    id: 'pd-tao-te',
    title: 'Tao Te Ching',
    author: 'Laozi',
    category: 'Spirit',
    summary: 'The classic text on living in harmony with the flow of nature.',
    targetAudience: 'High-stress individuals seeking "Wu Wei."',
    keyInsight: 'Nature does not hurry, yet everything is accomplished.',
    color: 'from-emerald-500 to-teal-900',
    readUrl: 'https://www.gutenberg.org/ebooks/216'
  },
  {
    id: 'pd-upanishads',
    title: 'The Upanishads',
    author: 'Various',
    category: 'Spirit',
    summary: 'Classic Sanskrit texts exploring the nature of reality and self.',
    targetAudience: 'Seekers of metaphysical depth.',
    keyInsight: 'You are what your deep, driving desire is.',
    color: 'from-orange-500 to-amber-900',
    readUrl: 'https://www.gutenberg.org/ebooks/6288'
  },

  // --- SCIENCE & HUMAN BLUEPRINT ---
  {
    id: 'pd-origin-species',
    title: 'On the Origin of Species',
    author: 'Charles Darwin',
    category: 'Science',
    summary: 'The foundation of evolutionary biology.',
    targetAudience: 'Those curious about the biological roots of behavior.',
    keyInsight: 'It is not the strongest that survives, but the most adaptable.',
    color: 'from-emerald-800 to-green-950',
    readUrl: 'https://www.gutenberg.org/ebooks/1228'
  },
  {
    id: 'pd-natural-religion',
    title: 'Dialogues Concerning Natural Religion',
    author: 'David Hume',
    category: 'Philosophy',
    summary: 'A philosophical examination of the nature of God and religion based on reason.',
    targetAudience: 'Skeptics and rationalists.',
    keyInsight: 'The world is a great machine, subdivided into an infinite number of lesser machines.',
    color: 'from-zinc-700 to-slate-900',
    readUrl: 'https://www.gutenberg.org/ebooks/4583'
  }
];
