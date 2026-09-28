import { 
  LucideIcon, 
  Sprout, Scale, Activity, BrainCircuit, 
  Sun, Wind, Shield, Moon, PenTool, Coffee, Zap, Eraser,
  Thermometer, BookType, Hand, Snowflake, Flame, ArrowLeftRight,
  Siren, ClipboardCheck, Glasses, Mountain, Megaphone, VenetianMask,
  CloudLightning, CloudRain, Eye, BatteryWarning, Crosshair, MoonStar, CloudSun, Timer,
  GraduationCap, Hourglass, HeartCrack, Fingerprint, Puzzle, Home, Briefcase, Waypoints, Pill, HeartHandshake,
  Smartphone, Wallet, Link, MessageCircleHeart,
  ShieldAlert, CircleStop,
  Brain, Microscope, Radio, Flashlight, Split,
  BookOpen, Users, Target, Clock, Battery, Smile, Frown, Meh, TrendingUp, Anchor, Map
} from 'lucide-react';

export type KnowledgeCategory = 
  | 'Foundation' 
  | 'Daily Practices' 
  | 'Regulation' 
  | 'Recognition' 
  | 'Condition Base' 
  | 'Life Problems' 
  | 'Performance'
  | 'Crisis Support'
  | 'Micro-Learning';

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: KnowledgeCategory;
  subcategory?: string;
  summary: string;
  content: string;
  icon: LucideIcon;
  readTime: string;
  isCrisis?: boolean;
  supportLink?: boolean;
}

export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  // 1. FOUNDATION
  {
    id: 'foundation-meaning',
    title: 'What is Mental Wellness?',
    category: 'Foundation',
    summary: 'Understanding that mental health is more than just the absence of illness.',
    readTime: '3 min',
    icon: Sprout,
    content: `
      Mental wellness is a positive state of mental health. It's more than just the absence of mental illness; it's the presence of mental, emotional, and social well-being.

      ### Key Pillars:
      1. **Emotional Balance**: Being aware of your emotions and being able to manage them effectively.
      2. **Psychological Resilience**: The ability to bounce back from life's challenges and adapt to change.
      3. **Social Connection**: Feeling a sense of belonging and support from others.

      ### Why it Matters:
      When you are mentally well, you can realize your full potential, cope with the stresses of life, work productively, and make meaningful contributions to your community.
    `
  },
  {
    id: 'foundation-myths',
    title: 'Mental Health: Myths vs. Facts',
    category: 'Foundation',
    summary: 'Debunking common misconceptions about mental health and well-being.',
    readTime: '4 min',
    icon: Scale,
    content: `
      Misconceptions about mental health can prevent people from seeking help. Let's look at the facts.

      ### Myth #1: Mental health problems are rare.
      **Fact**: 1 in 4 people will experience a mental health problem in any given year.

      ### Myth #2: Mental health problems are a sign of weakness.
      **Fact**: Mental health conditions are biological and psychological realities, similar to physical health conditions like diabetes. They have nothing to do with being "weak" or "lazy."

      ### Myth #3: You can't do anything for someone with a mental health problem.
      **Fact**: Support from friends and family is one of the most important factors in recovery. Simply being there and listening makes a massive difference.
    `
  },

  {
    id: 'foundation-gut-brain',
    title: 'The Gut-Brain Connection',
    category: 'Foundation',
    summary: 'How your stomach acts as a "second brain" to regulate mood.',
    readTime: '4 min',
    icon: Activity,
    content: `
      Did you know 95% of your serotonin is produced in your gut, not your brain?

      ### The Vagus Nerve Highway:
      Your gut and brain are connected by the Vagus Nerve. Stress signals travel down, and gut health signals travel up.

      ### Feeding Your Mood:
      - **Probiotics**: Fermented foods (yogurt, kimchi) support healthy bacteria.
      - **Prebiotics**: Fiber-rich foods (garlic, onions, bananas) feed that bacteria.
      - **Sugar**: High sugar intake promotes "bad" bacteria that can increase inflammation and anxiety.
    `
  },
  {
    id: 'foundation-neuroplasticity',
    title: 'Neuroplasticity 101',
    category: 'Foundation',
    summary: 'The hopeful science of how your brain rewires itself.',
    readTime: '3 min',
    icon: BrainCircuit,
    content: `
      "Neurons that fire together, wire together."

      ### What it Means:
      Your brain is not fixed. Every time you think a thought or practice a behavior, you strengthen that neural pathway.

      ### The Path in the Grass:
      Imagine walking through tall grass. The first time is hard. The 100th time, there is a clear path.
      - **Anxiety** is a well-worn path.
      - **Calm** is a new path you are building. It takes effort at first, but eventually, it becomes the default.
    `
  },

  // 2. DAILY PRACTICES
  {
    id: 'self-care-basics',
    title: 'The Self-Care Foundation',
    category: 'Daily Practices',
    subcategory: 'Self-Care Education',
    summary: 'Practical strategies to stabilize your daily routine and prevent burnout.',
    readTime: '5 min',
    icon: Sun,
    content: `
      Self-care isn't just about bubble baths; it's about the consistent habits that keep your baseline high.

      ### The "Big Three":
      1. **Sleep Hygiene**: Going to bed and waking up at the same time every day. Your brain cleans itself of toxins only during deep sleep.
      2. **Physical Connection**: Movement releases endorphins and reduces cortisol. Even a 10-minute walk counts.
      3. **Nutrition**: What you eat affects your gut microbiome, which is directly linked to your mood through the "Gut-Brain Axis."

      ### Burnout Prevention:
      Set "Hard Boundaries" between work/study and rest. Learn to say "No" without explanation.
    `
  },
  {
    id: 'mindfulness-breathing',
    title: 'Controlled Breathing Techniques',
    category: 'Daily Practices',
    subcategory: 'Mindfulness',
    summary: 'Structural learning for calming your nervous system in seconds.',
    readTime: '3 min',
    icon: Wind,
    content: `
      Breathing is the only part of your autonomic nervous system that you can consciously control. By changing your breath, you signal to your brain that you are safe.

      ### Box Breathing (The Navy SEAL method):
      - Inhale for 4 seconds.
      - Hold for 4 seconds.
      - Exhale for 4 seconds.
      - Hold for 4 seconds.
      Repeat 4 times.

      ### 4-7-8 Breathing (The Natural Tranquilizer):
      - Inhale through your nose for 4.
      - Hold your breath for 7.
      - Exhale forcefully through your mouth for 8.
    `
  },
  {
    id: 'habit-boundaries',
    title: 'Setting Healthy Boundaries',
    category: 'Daily Practices',
    subcategory: 'Self-Care',
    summary: 'Learning to protect your energy through physical and emotional boundaries.',
    readTime: '4 min',
    icon: Shield,
    content: `
      Boundaries are the "rules of engagement" for how people can treat you. Without them, we often feel resentful and drained.

      ### Types of Boundaries:
      1. **Physical**: Your personal space and physical touch.
      2. **Emotional**: Separating your feelings from others'. You are not responsible for "fixing" everyone's bad mood.
      3. **Time**: Protecting your resting hours from work or demanding friends.

      ### Essential Phrases:
      - "I'm not in a place to hold space for that right now. Can we talk about it tomorrow?"
      - "I'd love to help, but I've reached my limit for today."
      - "I prefer not to discuss that topic."
    `
  },
  {
    id: 'habit-sleep-hygiene',
    title: 'Digital Detox & Sleep Hygiene',
    category: 'Daily Practices',
    subcategory: 'Self-Care',
    summary: 'Optimizing your recovery cycles for better mental health.',
    readTime: '5 min',
    icon: Moon,
    content: `
      Your brain does its most important "maintenance work" while you sleep. Poor sleep is a leading contributor to anxiety and depression.

      ### The Sleep Stack:
      - **Blue Light**: The "blue light" from phones tricks your brain into thinking it's daytime, suppressing melatonin. Stop scrolling 1 hour before bed.
      - **Temperature**: A cool room (around 18°C) is optimal for deep sleep.
      - **Consistency**: Your "Circadian Rhythm" loves a schedule. Wake up at the same time even on weekends.

      ### The 10-3-2-1 Rule:
      - **10 hours** before bed: No more caffeine.
      - **3 hours** before bed: No more food or alcohol.
      - **2 hours** before bed: No more work.
      - **1 hour** before bed: No more screens.
    `
  },

  {
    id: 'practice-journaling-types',
    title: 'Journaling for Clarity',
    category: 'Daily Practices',
    subcategory: 'Reflection',
    summary: 'Different writing styles for different emotional needs.',
    readTime: '4 min',
    icon: PenTool,
    content: `
      Writing isn't just recording the day; it's a tool for processing.

      ### 1. Braindump (for Overwhelm):
      Write fast. No grammar, no punctuation. Just get the chaos out of your head onto the paper. Burn it afterwards if you want.

      ### 2. Gratitude (for Negativity):
      List 3 specific things. "Coffee" is vague. "The warmth of the mug in my cold hands" is specific. Specificity drives the emotion.

      ### 3. Bullet Journaling (for Order):
      Use symbols to track mood, habits, and tasks. Great for seeing patterns over time.
    `
  },
  {
    id: 'practice-doing-nothing',
    title: 'The Art of Doing Nothing',
    category: 'Daily Practices',
    subcategory: 'Rest',
    summary: 'Why "productive boredom" is essential for mental health.',
    readTime: '3 min',
    icon: Coffee,
    content: `
      In a world of constant stimulation, doing nothing feels like a sin. But it's a biological necessity.

      ### The Default Mode Network (DMN):
      When you stop focusing on tasks, your brain switches to the DMN. This is where creativity, empathy, and self-reflection happen.

      ### How to Practice:
      Sit for 5 minutes without your phone. Look out a window. Let your mind wander. Ideally, do this *without* guilt. You aren't wasting time; you are recharging your cognitive battery.
    `
  },

  {
    id: 'practice-flow-state',
    title: 'Triggering Flow State',
    category: 'Daily Practices',
    subcategory: 'Productivity',
    summary: 'How to engineer deep focus and lose track of time.',
    readTime: '5 min',
    icon: Zap,
    content: `
      Flow is that magical state where work feels effortless. You can't force it, but you can invite it.

      ### The Flow Triggers:
      1. **High Consequence**: Your brain pays attention when it thinks it matters. Set a scary deadline.
      2. **Rich Environment**: Novelty drives dopamine. Change your workspace.
      3. **Challenge/Skills Ratio**: The task must be hard enough to stretch you, but not so hard it breaks you. (The "Goldilocks Zone").
    `
  },
  {
    id: 'practice-perfectionism',
    title: 'Perfectionism Paralysis',
    category: 'Daily Practices',
    subcategory: 'Mindset',
    summary: 'Moving from "Perfect or Nothing" to "Good Enough."',
    readTime: '4 min',
    icon: Eraser,
    content: `
      Perfectionism isn't about high standards; it's about fear. Fear of judgment, fear of failure, fear of shame.

      ### The "B-" Standard:
      Aim for B- work. Ironically, when you lower the bar, you reduce the anxiety, which usually results in A+ work anyway.

      ### "Ship It":
      An imperfect essay submitted is worth more than a perfect essay that exists only in your head.
    `
  },

  // 3. STRESS & EMOTION REGULATION
  {
    id: 'stress-biology',
    title: 'Understanding Stress Biology',
    category: 'Regulation',
    subcategory: 'Stress Awareness',
    summary: 'What happens in your body when you feel stressed?',
    readTime: '4 min',
    icon: Thermometer,
    content: `
      Stress is a biological response to a perceived threat. In moderate amounts, it can be helpful (eustress). In high amounts, it becomes distress.

      ### The Stress Types:
      1. **Acute Stress**: Short-term, usually related to an upcoming event (like an exam).
      2. **Chronic Stress**: Long-term stress that feels never-ending (like financial issues or relationship strain).

      ### Stress vs. Anxiety:
      Stress is usually a response to an **external** trigger. Anxiety is an **internal** response that persists even after the trigger is gone.
    `
  },
  {
    id: 'emotion-vocabulary',
    title: 'The Power of Naming',
    category: 'Regulation',
    subcategory: 'Emotion Understanding',
    summary: 'Expanding your emotional vocabulary to better manage mood swings.',
    readTime: '3 min',
    icon: BookType,
    content: `
      There is a saying in psychology: "Name it to tame it." When you can accurately label an emotion, you engage your prefrontal cortex, which helps calm the emotional amygdala.

      ### Beyond "Good" or "Bad":
      Instead of saying "I'm stressed," try to be more precise:
      - Is it **Overwhelm**? (Too much to do)
      - Is it **Anxiety**? (Fear of something future)
      - Is it **Frustration**? (Blocked from a goal)
      - Is it **Exhaustion**? (Out of physical/mental energy)

      Each of these requires a different solution.
    `
  },

  {
    id: 'reg-54321',
    title: 'The 5-4-3-2-1 Technique',
    category: 'Regulation',
    subcategory: 'Grounding',
    summary: 'A classic sensory grounding tool for high anxiety.',
    readTime: '2 min',
    icon: Hand,
    content: `
      Use your senses to anchor yourself in the present moment.

      - **5** things you can **see**. (Look for small details).
      - **4** things you can **feel**. (Fabric of your chair, air on skin).
      - **3** things you can **hear**. (Traffic, computer fan).
      - **2** things you can **smell**. (Coffee, soap).
      - **1** thing you can **taste**. (Gum, or just focus on your mouth).
    `
  },
  {
    id: 'reg-cold-water',
    title: 'Cold Water Therapy',
    category: 'Regulation',
    subcategory: 'Physiology',
    summary: 'Using temperature to reset your nervous system.',
    readTime: '3 min',
    icon: Snowflake,
    content: `
      Cold exposure stimulates the Vagus Nerve, forcing your body to shift from "Fight or Flight" to "Rest and Digest."

      ### The Dive Reflex:
      Fill a bowl with ice water. Hold your breath and dip your face in for 30 seconds. This triggers an ancient mammalian reflex that instantly slows your heart rate.

      ### The Cold Shower:
      End your shower with 30 seconds of cold water. Focus on controlling your breath—don't gasp. This builds resilience to stress signals.
    `
  },

  {
    id: 'reg-tipp',
    title: 'T.I.P.P. Skills (Crisis)',
    category: 'Regulation',
    subcategory: 'DBT Distress Tolerance',
    summary: 'A biological hack for when emotions are at a 10/10.',
    readTime: '4 min',
    icon: Flame,
    content: `
      When emotional intensity hits a "breaking point," you can't think your way out. You have to use your body.

      ### T - Temperature:
      Splash ice-cold water on your face. This triggers the Dive Reflex, slowing your heart rate immediately.

      ### I - Intense Exercise:
      Do jumping jacks or run in place for 60 seconds. Burn off the cortisol.

      ### P - Paced Breathing:
      Slow your exhale to be longer than your inhale (4 in, 6 out).

      ### P - Paired Muscle Relaxation:
      Tense every muscle in your body hard, then release.
    `
  },
  {
    id: 'reg-opposite-action',
    title: 'Opposite Action',
    category: 'Regulation',
    subcategory: 'CBT Behavior',
    summary: 'Changing your emotion by changing your action.',
    readTime: '3 min',
    icon: ArrowLeftRight,
    content: `
      Every emotion has an "urge." Anger wants to attack. Sadness wants to withdraw. Fear wants to avoid.

      ### The Hack:
      Do the EXACT opposite of the urge, and the emotion will change.

      - **Sadness**: Urge = stay in bed. Action = go for a walk.
      - **Fear**: Urge = avoid the email. Action = open it immediately.
      - **Anger**: Urge = yell. Action = speak gently.
    `
  },

  // 4. MENTAL DISTRESS RECOGNITION
  {
    id: 'distress-signals',
    title: 'Early Warning Signals',
    category: 'Recognition',
    summary: 'How to recognize when you or a friend might be entering a period of distress.',
    readTime: '4 min',
    icon: Siren,
    content: `
      Distress often shows up in small changes before it becomes a crisis.

      ### Behavioral Signs:
      - Withdrawing from friends and family.
      - Changes in eating or sleeping habits.
      - Loss of interest in hobbies you usually love.

      ### Cognitive Changes:
      - Memory issues or difficulty concentrating.
      - Constant "racing thoughts" or rumination.
      - Increased irritability or mood swings.
    `
  },
  {
    id: 'distress-checkin',
    title: 'The Emotional Check-In',
    category: 'Recognition',
    summary: 'A simple non-clinical screening to assess your current overwhelm levels.',
    readTime: '2 min',
    icon: ClipboardCheck,
    content: `
      Self-awareness is the first step to regulation. Ask yourself these gentle questions:

      1. **Physical**: Is my jaw clenched? Are my shoulders up to my ears?
      2. **Emotional**: Have I felt unusually irritable or "brittle" today?
      3. **Cognitive**: Can I focus on a single task for 10 minutes, or is my mind jumping?
      4. **Interest**: Do I actually want to do the things I usually enjoy?

      If you answer "Yes" to most of these, it's a sign to shift from "Performance Mode" to "Recovery Mode."
    `
  },

  {
    id: 'rec-distortions',
    title: 'Cognitive Distortions',
    category: 'Recognition',
    subcategory: 'CBT',
    summary: 'Common lies our brains tell us.',
    readTime: '5 min',
    icon: Glasses,
    content: `
      Cognitive distortions are biased ways of thinking that reinforce negative emotions.

      ### 1. All-or-Nothing Thinking:
      "If I get a B, I'm a total failure." Life is rarely black and white; it's mostly grey.

      ### 2. Catastrophizing:
      "He didn't text back; he must hate me." Jumping to the worst possible conclusion without evidence.

      ### 3. Emotional Reasoning:
      "I feel stupid, so I must be stupid." Feelings are real, but they are not facts.
    `
  },
  {
    id: 'rec-anger-iceberg',
    title: 'The Anger Iceberg',
    category: 'Recognition',
    subcategory: 'Emotional Intelligence',
    summary: 'What lies beneath the surface of anger?',
    readTime: '3 min',
    icon: Mountain,
    content: `
      Anger is often a "secondary emotion." It's the tip of the iceberg that we show the world because it feels safer than what's underneath.

      ### Beneath the Surface:
      - **Fear**: "I'm angry you're late" might really be "I was scared you got hurt."
      - **Shame**: "I'm angry at this criticism" might be "I feel ashamed I made a mistake."
      - **Hurt**: "I'm angry you forgot" might be "I feel unimportant."

      Next time you're angry, ask: "What am I protecting?"
    `
  },

  {
    id: 'rec-inner-critic',
    title: 'The Inner Critic',
    category: 'Recognition',
    subcategory: 'Self-Talk',
    summary: 'Distinguishing between "feedback" and "shame."',
    readTime: '4 min',
    icon: Megaphone,
    content: `
      We all have a voice in our head. Is yours a coach or a bully?

      ### The Difference:
      - **Constructive Feedback**: "You messed up that questions. Let's study that topic more." (Specific, Actionable, Future-focused).
      - **The Bully**: "You're so stupid. You always mess up." (Vague, Permanent, Identity-focused).

      ### The Technique:
      Give your critic a name (e.g., "Gertrude"). When she starts yelling, say: "Thanks for the input, Gertrude, but I've got this."
    `
  },
  {
    id: 'rec-imposter-cycle',
    title: 'The Imposter Cycle',
    category: 'Recognition',
    subcategory: 'Identity',
    summary: 'Breaking the loop of "Success -> Luck -> Anxiety."',
    readTime: '5 min',
    icon: VenetianMask,
    content: `
      Imposter Syndrome isn't just a feeling; it's a cycle.

      ### The Loop:
      1. **Task Assigned**: Anxiety spikes. "I can't do this."
      2. **Over-Preparation**: You work 3x harder than necessary.
      3. **Success**: You ace it.
      4. **Discounting**: "I only did well because I over-worked. I'm still a fraud."

      ### Breaking It:
      Acknowledge your role in your wins. "I did well because I am capable," not just because you suffered.
    `
  },

  // 5. CONDITION KNOWLEDGE BASE
  {
    id: 'condition-anxiety',
    title: 'Understanding Anxiety',
    category: 'Condition Base',
    summary: 'Common symptoms, myths, and basic coping strategies for anxiety.',
    readTime: '6 min',
    icon: CloudLightning,
    supportLink: true,
    content: `
      Anxiety is more than just "worrying too much." It is a physiological state of high alertness.

      ### Common Symptoms:
      - Physical: Racing heart, shortness of breath, "butterflies" in the stomach.
      - Mental: Excessive worry about future events, difficulty sleeping.

      ### Misconception:
      "People with anxiety just need to calm down."
      **Fact**: Anxiety is a biological state; you can't just "switch it off." It requires tools and sometimes professional support to manage.

      ### Basic Coping:
      Focus on grounding (5-4-3-2-1) and limiting caffeine, which can mimic anxiety symptoms.
    `
  },
  {
    id: 'condition-depression',
    title: 'Understanding Depression',
    category: 'Condition Base',
    summary: 'Recognizing the signs of low mood and loss of interest.',
    readTime: '6 min',
    icon: CloudRain,
    supportLink: true,
    content: `
      Depression is not just "feeling sad." It is often described as a "lack of vitality" or an emotional numbness.

      ### Core Indicators:
      1. **Anhedonia**: Loss of interest or pleasure in almost all activities.
      2. **Low Energy**: Even small tasks (like brushing teeth) feel like climbing a mountain.
      3. **Negative Filter**: Only seeing past mistakes and future failures.

      ### Small Steps:
      When in a depressive episode, the goal is not "recovery" in one day. The goal is "Non-Zero Days" – doing one tiny thing (like drinking a glass of water) to maintain a sense of agency.
    `
  },
  {
    id: 'condition-social-anxiety',
    title: 'Understanding Social Anxiety',
    category: 'Condition Base',
    summary: 'Recognizing the fear of judgment and social evaluation.',
    readTime: '5 min',
    icon: Eye,
    content: `
      Social anxiety is not just "shyness." It is an intense fear of being judged, evaluated, or embarrassed in public.

      ### The "Spotlight Effect":
      People with social anxiety often believe everyone is watching and judging them. In reality, most people are too busy thinking about themselves to notice your minor slips.

      ### Exposure Strategy:
      Don't avoid social situations entirely – this confirms to your brain that they are "dangerous." Instead, try **Micro-Exposure**:
      - Ask a stranger for the time.
      - Say hi to one new person.
      - Make eye contact while walking.

      As you do these, your brain slowly learns that the "danger" isn't real.
    `
  },
  {
    id: 'condition-exhaustion',
    title: 'Emotional Exhaustion & Burnout',
    category: 'Condition Base',
    summary: 'Recognizing when you have run out of "emotional gas."',
    readTime: '5 min',
    icon: BatteryWarning,
    content: `
      Emotional exhaustion happens when the demands placed on you exceed your internal resources for a prolonged period.

      ### Key Signs:
      - **Flattened Emotions**: Feeling "meh" about things that used to excite you.
      - **Irritability**: Small things feel like personal attacks.
      - **Physical Fatigue**: Sleeping doesn't make you feel rested.

      ### The Cure: **Passive vs Active Rest**
      - **Passive Rest**: Sleeping, watching TV (good for physical energy).
      - **Active Rest**: Doing a hobby, walking in nature, engaging in art (essential for emotional energy).
    `
  },

  {
    id: 'cond-adhd-focus',
    title: 'ADHD & The Dopamine Hunt',
    category: 'Condition Base',
    subcategory: 'Neurodivergence',
    summary: 'Managing attention when your brain is hungry for stimulation.',
    readTime: '5 min',
    icon: Crosshair,
    content: `
      ADHD isn't a deficit of attention; it's a difficulty in *regulating* attention.

      ### Chase the Dopamine (Constructively):
      - **Gamification**: Turn chores into a game with rewards.
      - **Body Doubling**: Work alongside someone else (even virtually). The social pressure helps you stay on task.

      ### The "Now / Not Now" Time Blindness:
      To an ADHD brain, there are only two times: Now and Not Now. Use visible timers (like analog clocks) to make time "real."
    `
  },
  {
    id: 'cond-insomnia',
    title: 'Insomnia & Biological Clocks',
    category: 'Condition Base',
    subcategory: 'Sleep',
    summary: 'Why "trying" to sleep keeps you awake.',
    readTime: '5 min',
    icon: MoonStar,
    content: `
      Sleep is a shy cat. If you chase it, it runs. You have to sit quietly and let it come to you.

      ### Paradoxical Intention:
      If you can't sleep, try to stay awake. Keep your eyes open in the dark. Removing the *pressure* to sleep often relaxes the brain enough to drift off.

      ### The 20-Minute Rule:
      If you haven't slept in 20 minutes, get out of bed. Do something boring in low light. Only return to bed when sleepy. This teaches your brain that Bed = Sleep, not Bed = Worry.
    `
  },

  {
    id: 'cond-sad',
    title: 'Seasonal Affective Disorder',
    category: 'Condition Base',
    subcategory: 'Depression',
    summary: 'Managing mood dips during low-light seasons.',
    readTime: '4 min',
    icon: CloudSun,
    content: `
      If you feel like a bear who wants to hibernate in winter, it's biology. Less sunlight means less serotonin.

      ### Interventions:
      - **Light Therapy**: Use a 10,000 lux lamp for 20 mins every morning.
      - **Morning Walks**: Get outside within 30 mins of waking up, even if it's cloudy.
      - **Vitamin D**: Supplementing (with doctor advice) can replace what the sun isn't giving you.
    `
  },
  {
    id: 'cond-high-functioning-anxiety',
    title: 'High-Functioning Anxiety',
    category: 'Condition Base',
    subcategory: 'Anxiety',
    summary: 'When "success" is just anxiety in a trench coat.',
    readTime: '5 min',
    icon: Timer,
    content: `
      On the outside: You're organized, punctual, high-achieving.
      On the inside: You're drowning.

      ### The Cost:
      You are running on cortisol, not passion. Eventually, the engine will blow (burnout).

      ### The Shift:
      Practice "dropping the ball" on small things. Send an email with a typo. Be 2 minutes late. Prove to your nervous system that the world won't end.
    `
  },

  // 6. LIFE PROBLEMS
  {
    id: 'academic-stress',
    title: 'Managing Academic Pressure',
    category: 'Life Problems',
    subcategory: 'Student Life',
    summary: 'Handling exam anxiety, fear of failure, and concentration issues.',
    readTime: '5 min',
    icon: GraduationCap,
    content: `
      For many students, academic performance is the primary source of stress.

      ### The Fear of Failure:
      Often, the fear isn't about the grade itself, but what the grade "means" about your worth. Remind yourself: **Your GPA is not your worth.**

      ### Tactics:
      - **The 25/5 Rule**: Work for 25 minutes, rest for 5.
      - **Process vs. Outcome**: Focus on the action you are taking *now* (reading one page) rather than the final exam.
    `
  },
  {
    id: 'academic-procrastination',
    title: 'Beating Procrastination',
    category: 'Life Problems',
    subcategory: 'Student Life',
    summary: 'Why we delay and how to break the cycle.',
    readTime: '4 min',
    icon: Hourglass,
    content: `
      Procrastination is usually not a time-management problem; it's an **emotion-management** problem. We avoid tasks because they make us feel anxious, bored, or incompetent.

      ### The "5-Minute Rule":
      Tell yourself you will only do the task for 5 minutes. Usually, the hardest part is starting. Once you start, the "Zeigarnik Effect" (the brain's desire to finish a started task) kicks in.

      ### Break it Down:
      "Write Essay" is too big. "Open Word Document" is a task. "Type the Title" is a task. Make it so small that it's impossible to fail.
    `
  },
  {
    id: 'social-breakups',
    title: 'Handling Relationship Stress',
    category: 'Life Problems',
    subcategory: 'Relationships',
    summary: 'Coping with breakups, friend conflicts, and social pressure.',
    readTime: '6 min',
    icon: HeartCrack,
    content: `
      Relationships are our biggest source of joy and our biggest source of stress.

      ### Breakups & Loss:
      Grief is not linear. It's perfectly normal to feel "okay" one day and devastated the next. Treat yourself with the same compassion you would show a houseplant – give yourself time, space, and basic care.

      ### Conflict Resolution:
      Use "I" statements instead of "You" statements.
      - **Instead of**: "You never listen to me!"
      - **Try**: "I feel unheard when I'm sharing my day and you're on your phone."

      This reduces defensiveness and keeps the focus on the connection.
    `
  },
  {
    id: 'identity-worth',
    title: 'Identity & Self-Doubt',
    category: 'Life Problems',
    subcategory: 'Identity',
    summary: 'Overcoming "Imposter Syndrome" and building self-worth.',
    readTime: '5 min',
    icon: Fingerprint,
    content: `
      Especially in university, we often compare our "insides" to everyone else's "outsides."

      ### Imposter Syndrome:
      The feeling that you've "fooled" everyone into thinking you're competent. Remind yourself: **Competence is a skill you build, not a trait you're born with.**

      ### Self-Compassion vs. Self-Criticism:
      Research shows that being kind to yourself after a mistake actually makes you **more** likely to improve than being harsh. Criticism triggers "threat mode," which shuts down the learning centers of your brain.
    `
  },
  {
    id: 'social-loneliness',
    title: 'Navigating Social Loneliness',
    category: 'Life Problems',
    subcategory: 'Relationships',
    summary: 'Understanding the difference between being alone and being lonely.',
    readTime: '4 min',
    icon: Puzzle,
    content: `
      Loneliness is the gap between the social connection you have and the connection you want.

      ### Fact:
      You can be in a room full of people and still feel lonely. Connection is about being **seen** and **known**, not just being present.

      ### Strategies:
      - **Digital Detox**: Social media often increases loneliness by showing "highlight reels" of others.
      - **Micro-Connections**: A 30-second chat with a barista or a neighbor can actually boost mood more than you think.
    `
  },
  {
    id: 'social-family-dynamics',
    title: 'Family Dynamics & Boundaries',
    category: 'Life Problems',
    subcategory: 'Relationships',
    summary: 'Navigating conflict and communication challenges within the family.',
    readTime: '6 min',
    icon: Home,
    content: `
      Family relationships are often our deepest and most complex. Navigating them requires a balance of empathy and personal boundaries.

      ### Common Challenges:
      - **Role Expectations**: Feeling pressured to stay in a "role" you've outgrown.
      - **Shared Trauma**: Navigating history that affects current communication.
      - **Enmeshment**: Difficulty separating your own emotions from those of family members.

      ### Communication Strategies:
      - **"I" Statements**: Focus on your feelings rather than blaming others.
      - **Emotional Distance**: Recognizing that you can love someone without absorbing their emotional state.
      - **The "Broken Record" Technique**: Calmly repeating a boundary until it is heard without escalating into an argument.
    `
  },
  {
    id: 'workplace-burnout-pro',
    title: 'Workplace Stress & Burnout',
    category: 'Life Problems',
    subcategory: 'Professional Life',
    summary: 'Managing pressure, performance anxiety, and professional boundaries.',
    readTime: '6 min',
    icon: Briefcase,
    content: `
      Professional stress is a leading cause of mental health decline. Burnout isn't just "being tired"; it's a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress.

      ### The Burnout Signs:
      1. **Exhaustion**: Feeling drained and unable to cope.
      2. **Cynicism**: Feeling alienated from activities and irritable with coworkers.
      3. **Reduced Performance**: Difficulty concentrating and lack of creativity.

      ### Recovery Steps:
      - **Audit Your Time**: Identify "energy vampires" in your schedule.
      - **Set Hard Stops**: When you leave work, actually leave. No checking emails or Slack.
      - **Active Recovery**: Engaging in hobbies that have nothing to do with your career.
    `
  },
  {
    id: 'life-transitions-adjustment',
    title: 'Life Transitions & Adjustment',
    category: 'Life Problems',
    subcategory: 'Adaptation',
    summary: 'Support during change, uncertainty, and major personal shifts.',
    readTime: '5 min',
    icon: Waypoints,
    content: `
      Change, even positive change, is stressful. Relocating, starting a new job, or ending a chapter requires significant cognitive and emotional energy.

      ### The Transition Curve:
      - **The Ending**: Acknowledging what you are leaving behind.
      - **The Neutral Zone**: The "in-between" time where things feel confusing or uncertain.
      - **The New Beginning**: Finding your footing in the new reality.

      ### Coping Tools:
      - **Routine Anchors**: Keep small, familiar habits (like a morning coffee ritual) consistent during big shifts.
      - **Patience**: Give your brain 3-6 months to fully adjust to a major life change.
    `
  },
  {
    id: 'habit-substance-awareness',
    title: 'Habit & Substance Awareness',
    category: 'Life Problems',
    subcategory: 'Health Habits',
    summary: 'Understanding dependency, coping mechanisms, and pathways to change.',
    readTime: '7 min',
    icon: Pill,
    supportLink: true,
    content: `
      Sometimes we turn to substances or repetitive habits to "numb out" or cope with underlying pain. Understanding the function of the habit is the first step toward change.

      ### The Cycle of Choice:
      - **The Trigger**: The feeling or event that leads to the urge.
      - **The Action**: The habit itself (scrolling, drinking, smoking, etc.).
      - **The Reward**: The temporary relief or dopamine hit.

      ### Shifting the Pattern:
      - **Urge Surfing**: Learning to wait out a craving like a wave, knowing it will peak and then recede.
      - **Replacement**: Finding a healthier way to get the same "reward" (e.g., a cold shower for a dopamine hit, or journaling for emotional release).
    `
  },
  {
    id: 'grief-loss-processing',
    title: 'Loneliness, Grief & Loss',
    category: 'Life Problems',
    subcategory: 'Emotional Health',
    summary: 'Processing difficult emotions and building resilience after loss.',
    readTime: '6 min',
    icon: HeartHandshake,
    content: `
      Grief is a natural response to loss, and it doesn't just apply to death. We grieve for lost relationships, lost opportunities, and lost versions of ourselves.

      ### The Truth About Grief:
      Grief is not a linear process of "five stages." It's more like a ball in a box with a pain button. Initially, the ball is huge and hits the button constantly. Over time, the ball gets smaller, hitting the button less often—but it still hurts just as much when it does.

      ### Gentle Steps:
      - **Permission to Feel**: Don't force yourself to "move on" before you are ready.
      - **Ritual**: Creating a small way to honor what was lost.
      - **Connection**: Sharing your memories or pain with someone who can listen without trying to "fix" it.
    `
  },
  {
    id: 'caregiver-support-guides',
    title: 'Support for Caregivers',
    category: 'Life Problems',
    subcategory: 'Support Systems',
    summary: 'Guidance for those supporting someone facing mental health challenges.',
    readTime: '5 min',
    icon: HeartHandshake,
    content: `
      Supporting a loved one with mental health challenges is a noble but exhausting task. You cannot pour from an empty cup.

      ### Caregiver Burnout:
      Watch for feelings of resentment, fatigue, and losing your own sense of self. These are signals that you need more support.

      ### How to Support Effectively:
      1. **Listen Without Fixing**: Often, your presence is more valuable than your advice.
      2. **Maintain Boundaries**: You are a supporter, not a clinician. Ensure they have professional help so the weight isn't all on you.
      3. **Your Own Space**: Ensure you have segments of your life that have nothing to do with caregiving.
    `
  },

  {
    id: 'life-digital-overwhelm',
    title: 'Taming Digital Overwhelm',
    category: 'Life Problems',
    subcategory: 'Modern Life',
    summary: 'Reclaiming your attention from the attention economy.',
    readTime: '4 min',
    icon: Smartphone,
    content: `
      Your phone is a slot machine designed to keep you pulling the lever.

      ### Notification Audit:
      Turn off *all* non-human notifications. If it's not a text from a real person, check it on *your* terms, not the app's terms.

      ### Greyscale Mode:
      Turn your phone screen to black and white. Without the colorful candy-crush colors, Instagram becomes boring very quickly.
    `
  },
  {
    id: 'life-financial-anxiety',
    title: 'Coping with Financial Anxiety',
    category: 'Life Problems',
    subcategory: 'Stress',
    summary: 'Separating your self-worth from your net worth.',
    readTime: '6 min',
    icon: Wallet,
    content: `
      Money stress triggers primal survival fears. It tells the brain "we might not survive."

      ### Exposure Therapy for Money:
      AVOIDANCE fuels anxiety. Check your bank account every morning, even if it's scary. The monster in the closet is less scary when you turn the lights on.

      ### The "Enough" Point:
      Define what is "enough" for today. Food? Shelter? Safety? Ground yourself in the immediate reality of your safety, rather than the catastrophic "what ifs" of the future.
    `
  },

  {
    id: 'life-attachment-styles',
    title: 'Attachment Styles 101',
    category: 'Life Problems',
    subcategory: 'Relationships',
    summary: 'Why you love (and fight) the way you do.',
    readTime: '6 min',
    icon: Link,
    content: `
      Your attachment style is your blueprint for connection, formed in childhood.

      ### The Styles:
      - **Anxious**: "I'm scared you'll leave." Craves closeness, needs reassurance.
      - **Avoidant**: "I'm scared you'll smother me." Craves independence, pulls away when things get deep.
      - **Secure**: "I'm okay, you're okay." Comfortable with intimacy and space.

      ### The Dance:
      Anxious and Avoidant people often attract each other, creating a "Push-Pull" dynamic. Awareness is the first step to breaking the cycle.
    `
  },
  {
    id: 'life-nvc',
    title: 'Non-Violent Communication',
    category: 'Life Problems',
    subcategory: 'Conflict',
    summary: 'A 4-step framework for difficult conversations.',
    readTime: '5 min',
    icon: MessageCircleHeart,
    content: `
      Conflict often comes from unmet needs expressed as judgments.

      ### The Framework (OFNR):
      1. **Observation**: "When you didn't call..." (Fact, not judgment).
      2. **Feeling**: "...I felt worried and unimportant..." (Emotion, not blame).
      3. **Need**: "...because I need reassurance and reliability." (Core human need).
      4. **Request**: "Would you be willing to text me if you're going to be late?" (Specific, actionable).
    `
  },

  // 7. CRISIS & EMERGENCY
  {
    id: 'crisis-overwhelmed',
    title: 'If You Feel Overwhelmed Right Now',
    category: 'Crisis Support',
    summary: 'Immediate stabilization steps for when you hit a breaking point.',
    readTime: '2 min',
    icon: ShieldAlert,
    isCrisis: true,
    supportLink: true,
    content: `
      If you are feeling completely overwhelmed, stop everything.

      ### Immediate Protocol:
      1. **Breathe**: Take 3 very slow, deep breaths.
      2. **Senses**: Splash cold water on your face. This triggers the "Mammalian Dive Reflex," which instantly slows your heart rate.
      3. **Delay**: Promise yourself you won't make any big decisions or take any impulsive actions for the next 1 hour. Just exist.

      ### Help Pathways:
      If you feel you cannot keep yourself safe, please reach out now. You don't have to carry this alone.
    `
  },
  {
    id: 'crisis-panic',
    title: 'Panic Attack Stabilization',
    category: 'Crisis Support',
    summary: 'How to ride out the wave of an intense panic attack.',
    readTime: '3 min',
    icon: CircleStop,
    isCrisis: true,
    supportLink: true,
    content: `
      A panic attack is like a "false alarm" in your brain's fire-detection system. It is terrifying, but it is not dangerous.

      ### The "Wave" Method:
      - **Acknowledge**: "I am having a panic attack. It feels terrible, but I am safe."
      - **Don't Fight**: Trying to stop a panic attack often makes it worse. Imagine riding it like a wave.
      - **Grounding**: Focus on the feeling of your feet on the floor. Describe 3 objects in the room in extreme detail (color, texture, shape).

      The peak usually lasts less than 10 minutes. It *will* pass.
    `
  },

  // 8. MICRO-LEARNING CAPSULES
  {
    id: 'capsule-overthinking',
    title: 'Why Overthinking Happens',
    category: 'Micro-Learning',
    summary: 'A 30-second read on the "analytical loop."',
    readTime: '30s',
    icon: Brain,
    content: `
      Overthinking is your brain's attempt to "solve" a problem that usually doesn't have an immediate logical solution. It's like a car engine revving in neutral – lots of energy, but no movement. The cure to overthinking isn't more thinking; it's **action** or **distraction**.
    `
  },
  {
    id: 'capsule-stress-brain',
    title: 'Stress & Your Hippocampus',
    category: 'Micro-Learning',
    summary: 'How chronic stress impacts your memory center.',
    readTime: '30s',
    icon: Microscope,
    content: `
      Chronic stress releases cortisol, which can actually shrink the hippocampus – the part of your brain responsible for learning and memory. The good news? Regular exercise and meditation can reverse this effect by boosting BDNF, a "Miracle-Gro" for your brain cells.
    `
  },
  {
    id: 'capsule-triggers',
    title: 'Understanding Triggers',
    category: 'Micro-Learning',
    summary: 'Why small things sometimes cause big reactions.',
    readTime: '30s',
    icon: Radio,
    content: `
      An emotional trigger is a bridge between the present and a past memory. When someone's tone of voice or a specific smell makes you "irrationally" angry or scared, your brain thinks it's protecting you from a past threat. Identifying the trigger doesn't stop the feeling, but it gives you back your power to choose your response.
    `
  },
  {
    id: 'capsule-spotlight',
    title: 'The Spotlight Effect',
    category: 'Micro-Learning',
    subcategory: 'Social Psychology',
    summary: 'Why you think everyone is watching you (they aren\'t).',
    readTime: '30s',
    icon: Flashlight,
    content: `
      We walk through life feeling like the main character in a movie with a spotlight on us. But everyone else is the main character in *their* movie. They aren't thinking about your awkward wave; they are thinking about their own awkward wave.
    `
  },
  {
    id: 'capsule-decision-fatigue',
    title: 'Decision Fatigue',
    category: 'Micro-Learning',
    subcategory: 'Productivity',
    summary: 'Why choosing dinner is hard at 8 PM.',
    readTime: '30s',
    icon: Split,
    content: `
      Willpower is a finite battery. Every choice you make drains it. By 8 PM, the battery is dead. Automate small choices (what to wear, what to eat for breakfast) to save your battery for the big stuff.
    `
  },

  // 9. STUDENT SURVIVAL GUIDE (WAVE 3)
  {
    id: 'student-exam-anxiety',
    title: 'Exam Anxiety Hacks',
    category: 'Life Problems',
    subcategory: 'Academic Performance',
    summary: 'Performing under pressure when your mind goes blank.',
    readTime: '5 min',
    icon: BookOpen,
    content: `
      Your brain treats an exam like a saber-toothed tiger. It shuts down the "thinking" part (prefrontal cortex) and activates the "running" part (amygdala).

      ### The Reset Button:
      When you stare at a question and nothing makes sense, look up. Focus on a distant object (a clock, a window). This disengages the hyper-focus panic loop.

      ### The "Brain Dump":
      As soon as the exam starts, write down every formula, date, or fact you are afraid of forgetting. Now you don't have to hold them in your working memory.
    `
  },
  {
    id: 'student-pomodoro',
    title: 'The Pomodoro Technique',
    category: 'Life Problems',
    subcategory: 'Study Skills',
    summary: 'Focus is a muscle, not a gift.',
    readTime: '3 min',
    icon: Timer,
    content: `
      You cannot study for 4 hours straight. You can only "sit" for 4 hours.

      ### The Method:
      1. **Set a Timer**: 25 minutes. No phone, no tabs, just work.
      2. **Short Break**: 5 minutes. Stand up, stretch, look away.
      3. **Repeat**: After 4 cycles, take a longer break (15-30 mins).

      This works because 25 minutes feels "survivable" to your procrastinating brain.
    `
  },
  {
    id: 'student-failure',
    title: 'Reframing Failure',
    category: 'Condition Base',
    subcategory: 'Resilience',
    summary: 'First Attempt In Learning (FAIL).',
    readTime: '4 min',
    icon: TrendingUp,
    content: `
      School teaches us that 'F' is bad. Life teaches us that 'F' is data.

      ### The Scientist Mindset:
      A scientist doesn't cry when an experiment fails. They say, "Interesting. That didn't work. What variables can I change?"
      Treat your grades as feedback on your *methods*, not a judgment of your *soul*.
    `
  },
  {
    id: 'social-fomo',
    title: 'Dealing with FOMO',
    category: 'Life Problems',
    subcategory: 'Social Dynamics',
    summary: 'The Joy of Missing Out (JOMO).',
    readTime: '4 min',
    icon: Smartphone,
    content: `
      Fear Of Missing Out stems from the belief that "everyone else is having more fun than me."

      ### The Reality Check:
      Social media is a highlight reel. You are comparing your "behind-the-scenes" bloopers to everyone else's "best-of" trailer.

      ### Practice JOMO:
      Intentionally skip one event to do something purely for yourself. Feel the relief of *not* having to perform socially.
    `
  },
  {
    id: 'social-boundaries',
    title: 'Setting Boundaries',
    category: 'Life Problems',
    subcategory: 'Relationships',
    summary: 'Saying no to others is saying yes to yourself.',
    readTime: '5 min',
    icon: Shield,
    content: `
      "No" is a complete sentence.

      ### Types of Boundaries:
      - **Time**: "I can't hang out tonight, I need to recharge."
      - **Emotional**: "I can't listen to venting right now, I'm at capacity."
      - **Physical**: "Please don't touch my stuff."

      People who get angry at your boundaries are the ones who benefited from you having none.
    `
  },
  {
    id: 'social-conflict',
    title: 'Roommate Conflicts',
    category: 'Life Problems',
    subcategory: 'Social Dynamics',
    summary: 'Living together without falling apart.',
    readTime: '5 min',
    icon: Home,
    content: `
      Passive aggression is the mold that rots roommate relationships.

      ### The "Cleaning" Talk:
      Don't say "You're messy." Say, "I feel stressed when dishes pile up. Can we agree on a 'dishes done by midnight' rule?"

      ### Pick Your Battles:
      Is this annoying, or is it a dealbreaker? If it's just annoying, buy earplugs. If it's a dealbreaker, have the conversation.
    `
  },
  {
    id: 'future-uncertainty',
    title: 'Career Uncertainty',
    category: 'Life Problems',
    subcategory: 'Future Self',
    summary: 'You don\'t need a 10-year plan.',
    readTime: '5 min',
    icon: Map,
    content: `
      The job you will have in 10 years might not even exist yet.

      ### The Lighthouse Method:
      Don't try to map the whole ocean. Just look for the next lighthouse. What is the *next* right step? An internship? A class? A conversation?
      Action cures fear. Take one small step, and the next lighthouse will become visible.
    `
  },
  {
    id: 'future-gap-year',
    title: 'The "Behind" Feeling',
    category: 'Life Problems',
    subcategory: 'Future Self',
    summary: 'Everyone runs their own race.',
    readTime: '4 min',
    icon: Clock,
    content: `
      "I should have graduated by now." "They are all making money already."

      ### Comparison is the Thief of Joy:
      Life is not a linear track. Some people sprint and burn out. Some walk and keep going forever.
      You are not "behind." You are exactly where *you* are.
    `
  },
  {
    id: 'care-sleep-revenge',
    title: 'Revenge Bedtime Procrastination',
    category: 'Daily Practices',
    subcategory: 'Sleep Hygiene',
    summary: 'Stealing time from tomorrow.',
    readTime: '4 min',
    icon: Moon,
    content: `
      We stay up late because it's the only time we feel "in control" of our lives.

      ### The Trade-off:
      You are stealing happiness from your future self to pay for a moment of freedom now.
      Try to build "freedom" into your day (even 15 mins) so you don't feel the desperate need to reclaim it at 1 AM.
    `
  },
  {
    id: 'care-digital-detox',
    title: 'The 24-Hour Dopamine Fast',
    category: 'Daily Practices',
    subcategory: 'Digital Health',
    summary: 'Resetting your reward system.',
    readTime: '6 min',
    icon: Battery,
    content: `
      Our brains are fried by cheap dopamine (likes, scrolls, sugar).

      ### The Protocol:
      For 24 hours: No screens. No sugar. No music.
      It will be boring. That is the point. Boredom resets your baseline. Suddenly, reading a book or walking outside feels interesting again.
    `
  },
  {
    id: 'care-body-neutrality',
    title: 'Body Neutrality',
    category: 'Daily Practices',
    subcategory: 'Self-Image',
    summary: 'Your body is an instrument, not an ornament.',
    readTime: '5 min',
    icon: Users,
    content: `
      "Loving" your body every day is a high bar. Try "respecting" it.

      ### Instrument > Ornament:
      Instead of "Does my stomach look flat?", ask "Can my legs carry me up this hill? Can my arms hug my friend?"
      Shift the focus from how you *look* to what you can *do*.
    `
  },
  {
    id: 'care-gratitude-science',
    title: 'The Science of Gratitude',
    category: 'Daily Practices',
    subcategory: 'Positive Psychology',
    summary: 'Rewiring the brain for positivity.',
    readTime: '3 min',
    icon: Smile,
    content: `
      Gratitude isn't just "being nice." It's a cognitive training program.

      ### The "Three Good Things" Exercise:
      Every night, write down 3 things that went well and *why*.
      After 21 days, your brain starts scanning the world for positives instead of threats. It's biological reprogramming.
    `
  },

  // 10. PERFORMANCE & MASTERY
  {
    id: 'performance-burnout-prevention',
    title: 'Executive Burnout Prevention',
    category: 'Performance',
    subcategory: 'Executive Wellness',
    summary: 'High-stakes stress management for corporate leaders.',
    readTime: '6 min',
    icon: Briefcase,
    content: `
      In high-pressure corporate environments, stress is often wear like a badge of honor. But chronic stress is the enemy of high performance.

      ### The High-Performance Recovery:
      Elite athletes don't train 24/7; they train hard and recover harder. Corporate athletes must do the same.
      - **Oscillation**: Work in 90-minute blocks followed by 10 minutes of complete disconnection.
      - **Strategic Boringness**: Reduce decision fatigue by automating low-stakes choices.

      ### Emotional Regulation for Leaders:
      "The mood of the leader is the mood of the team." If you are caffeinated and anxious, your team will be too. Practice calm as a skill.
    `
  },
  {
    id: 'performance-stoicism',
    title: 'Modern Stoicism for Men',
    category: 'Performance',
    subcategory: 'Modern Stoicism',
    summary: 'Building an unshakeable mind in a chaotic world.',
    readTime: '7 min',
    icon: Target,
    content: `
      Stoicism isn't about suppressing emotion; it's about the "Dichotomy of Control."

      ### The Dichotomy of Control:
      - **Internal**: Your thoughts, your actions, your intentions. (Focus 100% here).
      - **External**: The economy, other people's opinions, the weather. (Accept these as they are).

      ### The Pre-Mortem:
      Visualizing everything that could go wrong before it happens. This isn't pessimism; it's preparation. When you've already visualized the failure, the actual event loses its power to panic you.
    `
  },
  {
    id: 'performance-discipline-habit',
    title: 'The Discipline Architecture',
    category: 'Performance',
    subcategory: 'High Performance',
    summary: 'Moving beyond motivation to reliable systems.',
    readTime: '5 min',
    icon: Anchor,
    content: `
      Motivation is a feeling. Discipline is a structure. Feelings are unreliable; structures are not.

      ### The Consistency Chain:
      Don't aim for 100% intensity once a week. Aim for 80% intensity every single day.
      - **Identity-Based Habits**: Don't say "I'm trying to work out." Say "I am an athlete." Your brain works hard to align your actions with your identity.
      - **The 2-Minute Rule**: If a habit is too hard to start, make the first 2 minutes incredibly easy.
    `
  },
  {
    id: 'performance-deep-work',
    title: 'Deep Work Mastery',
    category: 'Performance',
    subcategory: 'Productivity',
    summary: 'Reclaiming cognitive power in a distracted age.',
    readTime: '6 min',
    icon: BrainCircuit,
    content: `
      Deep work is the ability to focus without distraction on a cognitively demanding task. It’s a superpower in the 21st century.

      ### The Deep Work Protocol:
      1. **Physical Environment**: No phone in the room. No open social media tabs.
      2. **Pre-defined Duration**: Know EXACTLY when you will end before you start.
      3. **Shutdown Ritual**: At the end of the day, explicitly say "Work is done." This stops the "Zeigarnik Effect" from causing evening anxiety.
    `
  },
  {
    id: 'performance-longevity-health',
    title: 'The Longevity Mindset',
    category: 'Daily Practices',
    subcategory: 'Bio-Optimization',
    summary: 'Biological foundations for long-term high performance.',
    readTime: '6 min',
    icon: Activity,
    content: `
      High-value men view their health as their primary asset. Without the body, the mind has no platform to perform.

      ### Key Levers:
      - **Blood Glucose Stability**: Spikes and crashes lead to brain fog. Focus on protein and complex fats.
      - **Sleep as Performance**: 7-9 hours is non-negotiable for cognitive cleanup.
      - **Strength Training**: Essential for hormonal balance and metabolic health.

      Health is not a destination; it's a constant optimization process.
    `
  },
  {
    id: 'performance-masculine-growth',
    title: 'The Path of Mastery',
    category: 'Performance',
    subcategory: 'Personal Growth',
    summary: 'Building value, purpose, and character.',
    readTime: '7 min',
    icon: Mountain,
    content: `
      Growth is painful. Comfort is the enemy of character.

      ### The Three Pillars of Value:
      1. **Competence**: Becoming undeniable at what you do.
      2. **Accountability**: Taking 100% responsibility for your successes and failures.
      3. **Purpose**: Aligning your work with a cause larger than your own comfort.

      True value is built in the "dark intervals" where no one is watching.
    `
  },
  {
    id: 'performance-negotiation-stress',
    title: 'High-Stakes Negotiation Calm',
    category: 'Performance',
    subcategory: 'Professional Skills',
    summary: 'Maintaining emotional control during critical meetings.',
    readTime: '5 min',
    icon: Users,
    content: `
      In a negotiation, the person who cares less (or appears to) has the power.

      ### Tactical Empathy:
      Listen more than you speak. Use "Mirrors" and "Labels" to understand the other side's fear. Once the fear is named, it loses its power.

      ### The Physiological Anchor:
      If you feel your heart rate spiking, press your tongue to the roof of your mouth. This subtly engages the parasympathetic nervous system to keep you appearing calm.
    `
  },
  {
    id: 'performance-fatherhood-leadership',
    title: 'The Leadership of the Home',
    category: 'Life Problems',
    subcategory: 'Family Dynamics',
    summary: 'Balancing corporate ambition with family presence.',
    readTime: '6 min',
    icon: Home,
    content: `
      Many high-achieving men succeed at the office but feel like they are failing at home. Presence is the highest form of leadership.

      ### The "Transition Zone":
      Don't walk through the front door still ruminating on a spreadsheet. Sit in your car for 2 minutes. Breathe. Explicitly decide to be a father and a partner.
      Your family needs your attention more than they need your provision.
    `
  },

  // 7. DEEP DIVE / ADVANCED PROTOCOLS
  {
    id: 'perf-dopamine-detox',
    title: 'The Dopamine Detox (Huberman Protocol)',
    category: 'Performance',
    subcategory: 'Neuroscience',
    summary: 'A 24-hour protocol to reset your brain\'s reward pathways.',
    readTime: '7 min',
    icon: Zap,
    content: `
      **Source**: Dr. Andrew Huberman (Huberman Lab) & Dr. Anna Lembke (Dopamine Nation)

      In a world of constant cheap dopamine (scrolling, sugar, notifications), our baseline for pleasure rises. This means "normal" activities—like reading, walking, or working—feel painfully boring. This isn\'t a discipline problem; it\'s a **dopamine deficit** problem.

      ### The Science of Tolerance:
      When you flood your brain with high spikes of dopamine, your brain tries to maintain balance (homeostasis) by down-regulating receptors. The result? You need *more* stimulation just to feel okay, and when you stop, you feel *below baseline* (pain).

      ### The 24-Hour Reset Protocol:
      For one full day, you will remove all "high-dopamine" inputs to resensitize your receptors.

      **The "NO" List:**
      - No social media or scrolling.
      - No video games.
      - No processed sugar / junk food.
      - No music with lyrics (instrumental is okay).
      - No pornography or masturbation.

      **The "YES" List:**
      - Walking.
      - Reading physical books.
      - Journaling.
      - Meditating.
      - Drinking water/tea.
      - Sitting with boredom.

      ### Why Boredom is the Goal:
      Boredom is not a bug; it\'s a feature. When you allow yourself to be bored, your dopamine baseline resets. By the end of 24 hours, "boring" things will start to feel interesting again.
    `
  },
  {
    id: 'perf-deep-work',
    title: 'Deep Work & Flow States',
    category: 'Performance',
    subcategory: 'Productivity',
    summary: 'The Cal Newport protocol for elite cognitive focus.',
    readTime: '6 min',
    icon: Target,
    content: `
      **Source**: Cal Newport (Deep Work) & Mihaly Csikszentmihalyi (Flow)

      "Deep Work" is the ability to focus without distraction on a cognitively demanding task. It is a superpower in the 21st century.

      ### Deep vs. Shallow Work:
      - **Shallow Work**: Emails, meetings, slack messages. Low value, easy to replicate.
      - **Deep Work**: Coding, writing, strategic thinking. High value, hard to replicate.

      ### The Rules of Engagement:
      1. **Ritualize the Start**: Don\'t wait for "inspiration." Create a ritual (e.g., clear desk, pour coffee, put on headphones) that signals to your brain: "We are going deep."
      2. **Embrace Boredom**: If you switch tabs the moment you feel stuck, you break the neural circuit of focus. **Stay with the struggle.** The struggle *is* the neurplasticity happening.
      3. **Quit Social Media**: It fragments your attention span permanently.

      ### The Shutdown Ritual:
      Deep work is exhausting. You cannot do it for 8 hours. 4 hours is the elite limit. When you are done, have a strict "Shutdown Ritual" (e.g., close laptop, say "Shutdown Complete"). This releases your brain from the open loops of work functionality.
    `
  },
  {
    id: 'reg-cbt-reframing',
    title: 'Advanced Cognitive Reframing',
    category: 'Regulation',
    subcategory: 'CBT',
    summary: 'Moving beyond "positive thinking" to realistic thinking.',
    readTime: '5 min',
    icon: Brain,
    content: `
      **Source**: Dr. David Burns (Feeling Good) & Beck Institute

      Reframing isn't about lying to yourself ("Everything is great!"). It's about correcting the distortions that make reality look worse than it is.

      ### 1. Socratic Questioning:
      Put your negative thought on trial.
      - **Thought**: "I'm going to fail this exam."
      - **Evidence For**: "I missed two lectures."
      - **Evidence Against**: "I have studied for 3 days. I passed all previous quizzes. The material is familiar."
      - **Verdict**: "I am unprepared for 10% of the material, but prepared for 90%." (This is more accurate and less paralyzed).

      ### 2. The "Best / Worst / Likely" Technique:
      When spiraling about a future event:
      - **What is the WORST outcome?** (I fail. I retake the class. It costs money.) -> *Is it survivable? Yes.*
      - **What is the BEST outcome?** (I get an A+.)
      - **What is the MOST LIKELY outcome?** (I get a B or C.)

      Usually, the "Most Likely" scenario is boringly manageable.
    `
  },
  {
    id: 'daily-sleep-architecture',
    title: 'Sleep Architecture Deep Dive',
    category: 'Daily Practices',
    subcategory: 'Sleep Science',
    summary: 'Understanding cyclical recovery for maximum energy.',
    readTime: '6 min',
    icon: Moon,
    content: `
      **Source**: Dr. Matthew Walker (Why We Sleep) & National Sleep Foundation

      Sleep is not a uniform block of "off" time. It is a complex architectural structure of 90-minute cycles.

      ### The Two States:
      1. **NREM (Deep Sleep)**: Physical restoration. Your brain cleans out toxins (beta-amyloid). This happens mostly in the *first half* of the night.
      2. **REM (Dream Sleep)**: Emotional and memory processing. This is therapy at night. This happens mostly in the *second half* of the night.

      ### Why 6 Hours Isn't Enough:
      If you sleep 6 hours instead of 8, you don't lose "25% of your sleep." You lose **60-90% of your REM sleep**, because REM is back-loaded. This leads to irritability and anxiety the next day.

      ### The Caffeine Half-Life:
      Caffeine has a half-life of ~6 hours. If you have a coffee at 4 PM, 50% of it is still in your brain at 10 PM. It might not stop you from *falling* asleep, but it will block you from entering *Deep Sleep*. 
      **Rule**: No caffeine after 12 PM.
    `
  },
  {
    id: 'life-social-battery',
    title: 'The Social Battery Manager',
    category: 'Life Problems',
    subcategory: 'Relationships',
    summary: 'Managing energy economies for Introverts & Ambiverts.',
    readTime: '4 min',
    icon: Battery,
    content: `
      **Source**: Susan Cain (Quiet) & Psychology Today

      Think of your social energy like a bank account, not an infinite well.

      ### Introvert vs. Extrovert:
      It's not about shyness. It's about stimulation.
      - **Extroverts** have a low baseline arousal; they need social input to feel "normal."
      - **Introverts** have a high baseline arousal; social input pushes them into "overwhelm."

      ### Managing the Battery:
      1. **Scheduled Recovery**: If you have a party on Saturday night, schedule "Do Nothing" time on Sunday morning. Put it in the calendar.
      2. **The "Irish Goodbye"**: It is socially acceptable to leave a large gathering without saying goodbye to every single person. Find the host, say thanks, and leave. Prolonged goodbyes drain 20% of the night's energy.
      3. **Energy Vampires**: Notice who leaves you feeling drained vs. energized. Minimize exposure to people who treat you like an emotional dumping ground.
    `
  },

  // 8. BATCH 2 EXPANSION (Requested)
  {
    id: 'daily-atomic-habits',
    title: 'Atomic Habits & Identity',
    category: 'Daily Practices',
    subcategory: 'Habit Formation',
    summary: 'Building habits by changing who you are, not just what you do.',
    readTime: '6 min',
    icon: TrendingUp,
    content: `
      **Source**: James Clear (Atomic Habits)

      Most people try to change habits by focusing on the *outcome* ("I want to lose 10kg"). The superior way is to focus on *identity*.

      ### The Identity Shift:
      - **Outcome**: "I'm trying to quit smoking." (Implies you are a smoker trying to do something hard).
      - **Identity**: "I'm not a smoker." (Implies smoking contradicts who you are).

      ### The 1% Rule:
      Improving by 1% every day for a year makes you 37x better.
      - **Habit Stacking**: "After [CURRENT HABIT], I will [NEW HABIT]."
      - Example: "After I pour my coffee, I will meditate for 1 minute."

      ### Environment Design:
      Motivation is overrated; environment implies design. If you want to play guitar, buy a stand and put it in the middle of the living room. If you want to eat less sugar, hide the cookies on the top shelf.
    `
  },
  {
    id: 'life-four-horsemen',
    title: 'The Four Horsemen of Conflict',
    category: 'Life Problems',
    subcategory: 'Relationships',
    summary: 'The 4 behaviors that predict relationship collapse.',
    readTime: '7 min',
    icon: ShieldAlert,
    content: `
      **Source**: Dr. John Gottman (The Gottman Institute)

      Dr. Gottman can predict divorce with 93% accuracy by watching a couple argue for 5 minutes. He looks for these "Four Horsemen":

      ### 1. Criticism (vs. Complaint):
      - **Criticism**: "You never think about anyone but yourself." (Attack on character).
      - **Complaint**: "I was scared when you were late and didn't call." (Statement of feeling/fact).

      ### 2. Contempt (The Killer):
      Eye-rolling, sarcasm, mocking. This is the single biggest predictor of divorce. It signals disgust.
      - **Antidote**: Build a culture of appreciation.

      ### 3. Defensiveness:
      "I wouldn't have shouted if you hadn't done X!"
      - **Antidote**: Take responsibility for *part* of the problem. "You're right, I was late."

      ### 4. Stonewalling:
      Shutting down, looking away, leaving the room. physiological flooding.
      - **Antidote**: Physiological self-soothing (take a 20-min break, then return).
    `
  },
  {
    id: 'reg-physiological-sigh',
    title: 'The Physiological Sigh',
    category: 'Regulation',
    subcategory: 'Breathwork',
    summary: 'The fastest way to reduce stress in real-time.',
    readTime: '3 min',
    icon: Wind,
    content: `
      **Source**: Dr. Andrew Huberman (Huberman Lab) & Jack Feldman

      When you are stressed, the air sacs (alveoli) in your lungs collapse, raising carbon dioxide levels. This signals "THREAT" to the brain.

      ### The Protocol:
      You do this naturally when you cry or are about to sleep. You can do it voluntarily to hijack your nervous system.

      1. **Double Inhale**: Inhale deeply through the nose. Then, strictly at the top, take a second, shorter inhale to fully inflate the lungs.
      2. **Long Exhale**: Exhale fully through the mouth (making a "sigh" sound) for twice as long as the inhale.

      ### Why it Works:
      The double inhale pops open the collapsed alveoli. The long exhale offloads maximum carbon dioxide. Do this 2-3 times, and your heart rate *must* slow down. It is mechanical, not psychological.
    `
  },
  {
    id: 'found-zone2-cardio',
    title: 'Zone 2 Training: The Mental Engine',
    category: 'Condition Base',
    subcategory: 'Physical Health',
    summary: 'The link between mitochondrial health and mood stability.',
    readTime: '6 min',
    icon: Activity,
    content: `
      **Source**: Dr. Peter Attia (Outlive)

      We often separate "mental health" from "physical health." This is a mistake. Your brain is a physical organ that demands massive energy.

      ### What is Zone 2?
      It is steady-state cardio where you can maintain a conversation, but you cannot sing.
      - **Heart Rate**: Roughly 180 minus your age.
      - **Mechanism**: This trains your mitochondria to burn fat for fuel instead of glucose.

      ### The Antidepressant Effect:
      Zone 2 exercise releases **BDNF** (Brain-Derived Neurotrophic Factor), which acts like "Miracle-Gro" for new neurons. It specifically targets the hippocampus (memory/mood), which shrinks during depression.
      **Prescription**: 3-4 sessions of 45 minutes per week.
    `
  },
  {
    id: 'life-vulnerability-loop',
    title: 'The Vulnerability Loop',
    category: 'Life Problems',
    subcategory: 'Connection',
    summary: 'Why "staying strong" destroys trust.',
    readTime: '5 min',
    icon: HeartHandshake,
    content: `
      **Source**: Dr. Brené Brown (Daring Greatly)

      We think vulnerability is weakness in ourselves, but we see it as courage in others.

      ### The Myth of Self-Reliance:
      We try to "go it alone" to avoid being a burden. But this denies others the chance to support us, creating distance.

      ### The Loop:
      1. **Signal**: Person A admits a mistake or a fear. ("I'm actually really struggling with this.")
      2. **Response**: Person B does NOT judge, but matches the vulnerability. ("Me too. I feel lost sometimes.")
      3. **Result**: Trust increases.

      ### The Marble Jar:
      Trust is built in small moments—like marbles in a jar. Remembering a name, asking about a sick parent, admitting a small error. You cannot build trust with one grand gesture; it requires a thousand small moments of vulnerability.
    `
  }
];

export interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  summary: string;
  targetAudience: string;
  keyInsight: string;
  color: string; // CSS gradient class
  readUrl?: string; // Direct link to Gutenberg/Standard Ebooks
  category: 'Modern' | 'Philosophy' | 'Psychology' | 'Self-Mastery' | 'Spirit' | 'Science';
  externalSource?: string; // e.g. "Project Gutenberg"
}
