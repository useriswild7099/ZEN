"""
Fallback Responses — Pre-written persona-specific responses (Tier 4)

Used as the LAST RESORT when:
- Ollama is completely offline
- No cached responses match
- The AI engine is unreachable

DESIGN:
- 10 emotional categories × voice templates per persona
- Each persona has a unique voice/tone derived from its character
- Simple keyword-based intent detection selects the emotional category
- ZERO dependencies on prompts.py — all responses are independent

PRIVACY: No user data processed. Pure static lookup.
"""

import random
import re
from typing import Optional, Tuple


# ─── Emotional Categories ─────────────────────────────────────────────────────

EMOTIONAL_CATEGORIES = [
    "sad", "anxious", "angry", "lonely", "stressed",
    "hopeful", "confused", "tired", "scared", "neutral",
]

# ─── Keyword → Category Mapping ──────────────────────────────────────────────

EMOTION_KEYWORDS = {
    "sad": [
        "sad", "depressed", "crying", "cry", "tears", "heartbroken", "grief",
        "loss", "miss", "missing", "unhappy", "miserable", "down", "low",
        "hurting", "pain", "broken", "empty", "numb", "hopeless", "worthless",
    ],
    "anxious": [
        "anxious", "anxiety", "worried", "worry", "nervous", "panic",
        "overthinking", "overthink", "restless", "uneasy", "dread",
        "apprehensive", "tense", "fearful", "obsessing",
    ],
    "angry": [
        "angry", "mad", "furious", "rage", "frustrated", "irritated",
        "annoyed", "pissed", "hate", "unfair", "injustice", "betrayed",
        "resentful", "bitter", "livid",
    ],
    "lonely": [
        "lonely", "alone", "isolated", "nobody", "friendless", "abandoned",
        "ignored", "invisible", "left", "unwanted", "excluded", "rejected",
        "outcast", "disconnected",
    ],
    "stressed": [
        "stressed", "stress", "overwhelmed", "pressure", "burnout",
        "overworked", "deadline", "exam", "exams", "assignment", "workload",
        "swamped", "drowning", "too much", "cant handle",
    ],
    "hopeful": [
        "hopeful", "hope", "better", "improving", "grateful", "thankful",
        "happy", "excited", "optimistic", "looking forward", "progress",
        "achieved", "accomplished", "proud", "motivated",
    ],
    "confused": [
        "confused", "lost", "uncertain", "unsure", "dont know", "direction",
        "purpose", "meaning", "identity", "decisions", "stuck", "crossroads",
        "indecisive", "aimless",
    ],
    "tired": [
        "tired", "exhausted", "fatigue", "drained", "burnt out", "sleepy",
        "insomnia", "cant sleep", "sleep", "energy", "lethargic", "worn out",
        "spent", "running on empty",
    ],
    "scared": [
        "scared", "afraid", "fear", "terrified", "phobia", "nightmare",
        "trauma", "ptsd", "flashback", "haunted", "threatened", "unsafe",
        "danger", "vulnerability",
    ],
    "neutral": [
        "hello", "hi", "hey", "what", "how", "tell", "help", "talk",
        "chat", "bored", "fine", "okay", "nothing",
    ],
}


# ─── Intent Detection ─────────────────────────────────────────────────────────

def detect_emotion(text: str) -> str:
    """
    Detect the primary emotional category from user text.
    Uses simple keyword matching — no AI required.
    
    Returns one of the EMOTIONAL_CATEGORIES.
    """
    text_lower = text.lower()
    words = set(re.findall(r'\b\w+\b', text_lower))
    
    scores = {}
    for category, keywords in EMOTION_KEYWORDS.items():
        score = 0
        for keyword in keywords:
            if ' ' in keyword:
                # Multi-word keyword: check as substring
                if keyword in text_lower:
                    score += 2
            elif keyword in words:
                score += 1
        scores[category] = score
    
    # Get the category with highest score
    best_category = max(scores, key=scores.get)
    if scores[best_category] == 0:
        return "neutral"
    
    return best_category


# ─── Voice Templates ──────────────────────────────────────────────────────────
# Each persona category has a distinct communication style.
# Templates use {name} placeholders where appropriate.

# Group personas by voice archetype for efficient template generation
VOICE_ARCHETYPES = {
    # Warm & Nurturing
    "warm": [
        "compassionate_friend", "mother", "grandmother", "sister",
        "cool_parent", "cool_uncle_aunt", "oprah_mentor",
    ],
    # Wise & Grounded
    "wise": [
        "father", "grandfather", "dalai_lama", "sadguru",
        "carl_rogers", "marcus_aurelius", "alan_watts", "rumi",
        "the_librarian", "the_gardener", "the_universe",
    ],
    # Energetic & Motivating
    "energetic": [
        "motivational_coach", "david_goggins", "strict_coach",
        "elon_mentor", "ranveer_allahbadia", "gordon_ramsay",
    ],
    # Analytical & Structured
    "analytical": [
        "academic_coach", "school_teacher", "university_professor",
        "logical_mentor", "sigmund_freud", "jordan_peterson",
        "albert_einstein", "marie_curie", "steve_jobs",
        "ankur_warikoo", "mukesh_ambani",
    ],
    # Casual & Relatable
    "casual": [
        "best_friend", "brother", "study_partner", "younger_sibling",
        "brittany_broski", "delaney_rowe", "rob_anderson",
        "ashish_chanchlani", "bhuvan_bam", "samey_raina",
        "zakir_khan",
    ],
    # Calming & Mindful
    "calming": [
        "mindfulness_guide", "bob_ross", "the_poet",
        "the_artist", "the_musician",
    ],
    # Romantic & Tender
    "tender": [
        "lover",
    ],
    # Unique
    "playful": [
        "the_pet", "the_time_traveler",
    ],
    # Inspirational Icon
    "icon": [
        "apj_abdul_kalam", "shah_rukh_khan", "socrates",
    ],
}

# Reverse lookup: persona → archetype
PERSONA_ARCHETYPE = {}
for archetype, personas in VOICE_ARCHETYPES.items():
    for persona in personas:
        PERSONA_ARCHETYPE[persona] = archetype


# ─── Response Templates by Archetype × Emotion ───────────────────────────────
# Each entry is a list of possible responses (randomly selected for variety)

RESPONSES = {
    # ──────────────── WARM & NURTURING ────────────────
    "warm": {
        "sad": [
            "I can feel that you're carrying something heavy right now. You don't have to carry it alone — I'm right here with you, and it's okay to let it out.",
            "Sometimes sadness needs space to just exist. I'm not going anywhere. Take your time, and know that what you feel is completely valid.",
            "Hey, I see you. I see that you're hurting. And I want you to know — being sad doesn't make you weak. It makes you human.",
        ],
        "anxious": [
            "I know your mind is racing right now, and it feels like everything is spinning. Let's slow down together — just breathe with me for a moment.",
            "Anxiety can feel so overwhelming, like a storm you can't escape. But remember, you've weathered storms before. I believe in your strength.",
            "You don't have to figure everything out right now. Sometimes the bravest thing is to just pause and let yourself breathe.",
        ],
        "angry": [
            "I hear you, and your anger is valid. Something or someone crossed a line, and it's okay to feel that fire. I'm here to listen without judgment.",
            "It's okay to be angry. Anger often protects something deeper — maybe hurt, maybe a boundary that was violated. Let's sit with it together.",
        ],
        "lonely": [
            "Loneliness can feel like the loudest silence. But I want you to know — you're not invisible to me. I see you, and you matter deeply.",
            "Even when it feels like no one understands, please know that connection is still possible. You reaching out right now? That's already a brave step.",
        ],
        "stressed": [
            "You've been pushing so hard, and I can feel the weight on your shoulders. It's okay to set things down for a moment. You deserve a break.",
            "Stress can make everything feel urgent and impossible. But you don't have to tackle it all at once. Let's take one small step together.",
        ],
        "hopeful": [
            "I love hearing that! Hold onto that feeling — it's real, and it's yours. You've earned this moment of light.",
            "That's beautiful to hear. Hope is a powerful thing, and the fact that you're feeling it tells me you're on the right path.",
        ],
        "confused": [
            "Not having all the answers doesn't mean you're lost. Sometimes the most important journeys start without a map. I'm here to walk with you.",
            "It's okay to feel uncertain. Life doesn't come with an instruction manual, and figuring things out is part of the beautiful, messy process.",
        ],
        "tired": [
            "You sound exhausted, and that tells me you've been giving a lot of yourself. Please, rest without guilt. You've earned it.",
            "Your body and mind are telling you something important. Rest isn't laziness — it's how you recharge to keep being the amazing person you are.",
        ],
        "scared": [
            "Fear can feel paralyzing, I know. But you're braver than you think — the fact that you're talking about it shows incredible courage.",
            "It's okay to be scared. Fear doesn't define you. What defines you is how you show up despite it, and you're showing up right now.",
        ],
        "neutral": [
            "I'm glad you're here. Whatever's on your mind — big or small — I'm all ears. There's no wrong way to start.",
            "Hey there! How are you doing today? I'm here whenever you're ready to talk about anything at all.",
        ],
    },

    # ──────────────── WISE & GROUNDED ────────────────
    "wise": {
        "sad": [
            "Sadness, like all things, is impermanent. It visits us to teach us about the depth of our capacity to feel. Honor it, and know that lighter days will return.",
            "In every drop of sorrow, there is also the seed of understanding. This pain you feel — it means you care deeply. That is not weakness; that is wisdom taking root.",
        ],
        "anxious": [
            "The mind that worries is a mind that cares about the future. But remember — this present moment is the only one you truly have. Ground yourself here, now.",
            "Anxiety is the mind rehearsing for battles that may never come. Return to your breath. Return to this moment. The rest will unfold as it should.",
        ],
        "angry": [
            "Anger, when understood, becomes a teacher. It shows us our boundaries, our values, what we refuse to accept. Listen to what it tells you, then choose your response with clarity.",
            "The fire of anger can consume or illuminate. The choice is yours. Pause. Breathe. Let the flame become a lantern, not a wildfire.",
        ],
        "lonely": [
            "Solitude and loneliness wear similar masks but are not the same. In your solitude, there is an opportunity to meet yourself — perhaps the most important companion of all.",
            "The universe is vast, yet here you are — conscious, feeling, reaching out. That impulse to connect is the deepest proof that you belong in this world.",
        ],
        "stressed": [
            "You cannot pour from an empty vessel. The world will always demand more; wisdom lies in knowing when to pause and replenish your own reserves.",
            "Consider this: a river does not fight the rocks in its path. It flows around them. Perhaps the challenge before you requires not force, but a different direction.",
        ],
        "hopeful": [
            "Hope is not naive optimism — it is the courageous decision to believe that what lies ahead can be better than what came before. Guard this feeling well.",
            "When the heart opens to hope, it opens to possibility. You are exactly where you need to be on your journey.",
        ],
        "confused": [
            "The wisest among us are those who can sit comfortably with uncertainty. Not knowing is not failing — it is the beginning of deeper understanding.",
            "Every great clarity was once preceded by confusion. You are not lost; you are in the space between one understanding and the next.",
        ],
        "tired": [
            "Even the mightiest tree bends in the wind to avoid breaking. Rest is not surrender — it is the strategy of the wise.",
            "Your weariness tells a story of effort and dedication. But remember: the field must lie fallow to produce its best harvest. Rest now.",
        ],
        "scared": [
            "Fear is the shadow cast by something you care about deeply. It proves that your life has meaning, that something in it is worth protecting.",
            "Courage is not the absence of fear — it is action in spite of it. You are already being courageous by facing this moment honestly.",
        ],
        "neutral": [
            "Welcome. Whatever brings you here today, know that every conversation is an opportunity for growth and understanding. I'm here to listen.",
            "It's good to check in, even when things seem ordinary. Often, the most important insights come from the quietest moments.",
        ],
    },

    # ──────────────── ENERGETIC & MOTIVATING ────────────────
    "energetic": {
        "sad": [
            "I hear you. Sadness is real and it hits hard. But listen — this is NOT your final chapter. You've survived 100% of your worst days so far. That's a perfect record.",
            "Pain is temporary. You know what's not? The strength you're building right now by going through this. You're forging steel, even if it doesn't feel like it.",
        ],
        "anxious": [
            "Your brain is trying to protect you, but it's overdoing it. Here's what I need you to do: take one deep breath. Just one. Then we attack the problem, not the worry.",
            "Anxiety means you care. Now let's channel that energy. What's ONE thing you can control right now? Focus there. Leave the rest.",
        ],
        "angry": [
            "Good. Use that fire. Anger means something matters to you. Don't waste it on destruction — channel it into action. What are you going to DO about it?",
            "That frustration? It's fuel. The question isn't whether you should be angry — it's what you're going to BUILD with that energy.",
        ],
        "lonely": [
            "Being alone and being lonely aren't the same thing. Right now, use this time to become someone YOU would want to be around. The connections will follow.",
            "I get it — it sucks. But you know what? You reached out. That takes guts. And it means you're not as alone as your brain is telling you.",
        ],
        "stressed": [
            "You're stressed because you're pushing limits. That's where growth happens. But even the best athletes take rest days. What can you drop from your plate TODAY?",
            "Stop trying to solve everything at once. Pick the ONE thing that matters most. Crush it. Then move to the next. That's how champions operate.",
        ],
        "hopeful": [
            "YES! Hold onto that momentum! Hope isn't just a feeling — it's FUEL. What's your next move? Let's ride this energy and make something happen!",
            "That's what I'm talking about! You're seeing it now. The path forward is clear when you believe in yourself. Keep pushing!",
        ],
        "confused": [
            "Confusion means you're at the edge of a breakthrough. The people who never feel confused are the ones who never grow. Lean into it.",
            "You don't need all the answers right now. You just need the next step. What's the smallest action you can take to move forward?",
        ],
        "tired": [
            "Rest is part of the mission. Even the hardest warriors sleep. Take the break, recharge, and come back ready to dominate tomorrow.",
            "Your body is telling you something important. Listen to it. Recovery isn't weakness — it's strategy. The comeback is always stronger than the setback.",
        ],
        "scared": [
            "Fear means you're about to do something that matters. Every great achievement in history was preceded by fear. Feel it, acknowledge it, then DO IT ANYWAY.",
            "Scared? Good. That means you're alive and you care about something. Now let's take that fear and turn it into your competitive advantage.",
        ],
        "neutral": [
            "What's good? Ready to make today count? Even a small win is still a win. What are we working on?",
            "Hey! Good to see you. Remember: every day is a chance to be better than yesterday. What's on your mind?",
        ],
    },

    # ──────────────── ANALYTICAL & STRUCTURED ────────────────
    "analytical": {
        "sad": [
            "I understand you're experiencing sadness. Let's approach this constructively — can you identify when this feeling started and what might have triggered it? Understanding the pattern is the first step toward change.",
            "Sadness is a signal, not a destination. From a psychological perspective, it often indicates unmet needs or unprocessed experiences. Let's work through this systematically.",
        ],
        "anxious": [
            "Anxiety typically stems from perceived future threats. Let's separate the real risks from the imagined ones. What specifically are you worried about? We can evaluate each concern objectively.",
            "Your nervous system is in overdrive. Here's a practical framework: list your worries, categorize them as controllable vs. uncontrollable, and focus your energy only on what you can actually influence.",
        ],
        "angry": [
            "Anger is often a secondary emotion — it masks hurt, fear, or frustration. Let's examine what's underneath. What expectation was violated? Understanding the root cause leads to better outcomes.",
            "I hear your frustration. Let's channel it productively. What's the core issue, and what are three possible ways to address it? Structured problem-solving works better than venting alone.",
        ],
        "lonely": [
            "Social isolation is a measurable risk factor for both mental and physical health. The fact that you're recognizing and articulating this feeling is important. Let's discuss concrete steps to build meaningful connections.",
            "Loneliness is more common than most people realize — studies show it affects nearly 1 in 3 people. You're not an outlier. Let's work on a practical plan to increase your social engagement.",
        ],
        "stressed": [
            "Let's do a stress audit. List everything on your plate, rate each item's urgency (1-5) and importance (1-5), then we prioritize. The Eisenhower Matrix works well here.",
            "Chronic stress reduces cognitive performance by up to 20%. It's not just a feeling — it's actively working against your goals. Let's build a sustainable workload structure.",
        ],
        "hopeful": [
            "That positive momentum is valuable — research shows hope is correlated with better problem-solving and resilience. Let's build on it with concrete goals and action steps.",
            "Excellent. Optimism paired with realistic planning is the most effective combination for success. What specific outcomes are you working toward?",
        ],
        "confused": [
            "Confusion is a natural state during complex decision-making. Let's break the problem down into its components and evaluate each one separately. What are the key variables?",
            "When facing uncertainty, the best approach is to identify what you DO know, what you DON'T know, and what you need to find out. Let's map it out.",
        ],
        "tired": [
            "Persistent fatigue can stem from sleep quality, nutrition, overcommitment, or emotional depletion. Which of these resonates most with your current situation?",
            "Rest is a performance variable, not a luxury. Research consistently shows that adequate recovery leads to better outcomes. What does your current rest routine look like?",
        ],
        "scared": [
            "Fear activates your amygdala, which can override rational thought. Let's engage your prefrontal cortex: what specifically are you afraid of, and what is the realistic probability of that outcome?",
            "Fear often feels bigger than the actual threat. Let's run a simple exercise: worst case, best case, most likely case. This helps calibrate your response proportionally.",
        ],
        "neutral": [
            "Welcome. I'm here to help you think through whatever's on your mind. What would you like to explore or work through today?",
            "Good to connect. Whether it's a problem to solve, a decision to make, or just thinking out loud — I'm ready when you are.",
        ],
    },

    # ──────────────── CASUAL & RELATABLE ────────────────
    "casual": {
        "sad": [
            "Yo, that sucks and I'm sorry you're going through it. For real though — you don't have to pretend you're fine. Just let yourself feel it. I'm here.",
            "Man, I wish I could fix it for you. But since I can't, just know I'm here and I've got your back. No judgment, no pressure. Just... here.",
        ],
        "anxious": [
            "Dude, I totally get that. My brain does the same thing sometimes — just spirals. Have you tried literally just stepping outside for like 2 minutes? Sounds dumb but it helps.",
            "Okay okay, I hear you. Your brain is being a drama queen right now. Let's just take it one thing at a time. What's the first thing bugging you?",
        ],
        "angry": [
            "Bruh, that's messed up. You have every right to be pissed. Vent it out — I won't judge. Sometimes you just need someone to listen while you go off.",
            "Nah, that's valid. I'd be angry too. Just... don't make any big decisions while you're heated. Let's talk it through first.",
        ],
        "lonely": [
            "That's rough. And I know saying 'you're not alone' sounds cliché when you literally FEEL alone. But hey — you hit me up, so clearly some part of you isn't giving up. That matters.",
            "I feel you. Everyone posts their highlight reel and it makes you feel like the only one sitting at home. But trust me — way more people feel this way than admit it.",
        ],
        "stressed": [
            "You're doing too much. Seriously. When's the last time you just... did nothing? No guilt, no agenda. Just existed? Try it. You deserve that.",
            "Okay, real talk — you can't pour from an empty cup. What's the ONE thing you could drop or delay this week? Let's be honest about what actually matters here.",
        ],
        "hopeful": [
            "Ayyyy, love that energy! Whatever you're doing, keep doing it. It's clearly working!",
            "That's what I like to hear! Ride that wave, my friend. Good vibes attract good things.",
        ],
        "confused": [
            "Honestly? Nobody has it all figured out. Anyone who says they do is lying. So don't stress about not having a master plan.",
            "It's fine to not know. Like, really. Just pick a direction and start walking. You can always change course later.",
        ],
        "tired": [
            "Go to sleep. Seriously. Whatever it is can wait till tomorrow. Your brain needs a reboot.",
            "You sound cooked. And that's okay. Take the rest. The world will still be here when you wake up, I promise.",
        ],
        "scared": [
            "Hey, it's okay to be scared. I'd be worried if you weren't, honestly. But you've gotten through scary stuff before, right? You'll get through this too.",
            "Fear is just your brain trying to protect you. Sometimes it's right, but sometimes it's just being extra. Which one is it this time?",
        ],
        "neutral": [
            "What's up? I'm just hanging out. Talk to me about whatever — deep stuff, random stuff, I'm down.",
            "Hey hey! What's on your mind today? Big or small, I'm all ears.",
        ],
    },

    # ──────────────── CALMING & MINDFUL ────────────────
    "calming": {
        "sad": [
            "I hear you, and I want you to know that this sadness has a place here. Let's just sit with it for a moment. There's no rush to feel differently. Breathe in gently... and out.",
            "Sadness flows through like water. It doesn't define you — it's passing through you. Let yourself feel it, and then let it flow onward when it's ready.",
        ],
        "anxious": [
            "Let's ground ourselves right now. Feel your feet on the floor. Notice five things you can see. Four things you can touch. Three sounds you hear. You are here. You are safe.",
            "Take a slow breath in for four counts... hold for four... and release for six. Your nervous system is listening. Let's tell it that right now, in this moment, you are okay.",
        ],
        "angry": [
            "Anger is energy, and like all energy, it wants to move. Instead of pushing it away, let's observe it. Where do you feel it in your body? Breathe into that space gently.",
            "Before we do anything else, let's pause. Close your eyes if you can. Take three deep, slow breaths. The anger will still be there after — but you'll meet it with more clarity.",
        ],
        "lonely": [
            "You are connected to more than you know. The trees outside are breathing with you right now. The stars above have shone for billions of years. You are part of something vast and beautiful.",
            "Loneliness can feel like a quiet ache. But in this stillness, there's also the chance to reconnect — with yourself, with nature, with this present moment.",
        ],
        "stressed": [
            "Gently now. Let's release the tension you're carrying. Drop your shoulders. Unclench your jaw. Soften your hands. You've been holding so much. It's okay to let go.",
            "Imagine each worry as a leaf on a stream. Watch it float by. You don't have to grab it. You don't have to solve it right now. Just watch and breathe.",
        ],
        "hopeful": [
            "What a beautiful feeling to sit with. Hope is like the first warm ray of sunlight after a long winter. Let it fill you, and carry it gently through your day.",
            "Breathe into that hope. Let it expand in your chest. This feeling is real, and it's telling you something true about your future.",
        ],
        "confused": [
            "In the stillness between questions and answers, there is wisdom. You don't need to solve anything right now. Just be present with what is.",
            "Clarity comes not from forcing answers, but from creating space. Let's breathe together, and trust that understanding will arrive in its own time.",
        ],
        "tired": [
            "Your body is wise. It knows when it needs rest. Let's honor that. Close your eyes if you can. Take a long, slow breath in... and a gentle breath out. You are allowed to rest.",
            "Imagine a warm, soft light surrounding you, melting away the tension and fatigue. You've worked hard. Now it's time to be gentle with yourself.",
        ],
        "scared": [
            "Fear lives in the future, not in this moment. Right now, you are breathing. Right now, you are here. And right now, you are safe. Let's stay in this moment together.",
            "Place your hand on your heart. Feel it beating. That steady rhythm has carried you through every fear you've ever faced. It will carry you through this one too.",
        ],
        "neutral": [
            "Welcome to this moment. However you're feeling, it's perfectly okay. Let's just be here together, without agenda or expectation.",
            "Hello, friend. Take a moment to check in with yourself. How does your body feel right now? What does your heart need today?",
        ],
    },

    # ──────────────── ROMANTIC & TENDER ────────────────
    "tender": {
        "sad": [
            "I wish I could wrap you in warmth right now and take away every bit of that sadness. You mean so much, and seeing you hurt breaks my heart too. I'm right here, always.",
            "My love, it's okay to be sad. I'm not going anywhere. Lean on me — that's what I'm here for. Your tears don't scare me; they just remind me how deeply you feel.",
        ],
        "anxious": [
            "Hey, breathe with me. In together... and out. Your worries are valid, but they don't get to steal this moment from us. I'm right here, and we'll figure this out together.",
            "I know your mind is spinning. Let me be your anchor right now. You don't have to have all the answers — we'll navigate this side by side.",
        ],
        "angry": [
            "I see the fire in you right now, and I understand it. Your feelings matter. Tell me everything — I want to understand what hurt you.",
            "It's okay to be angry. I love all of you — including the parts that burn. Let it out. I'm not going anywhere.",
        ],
        "lonely": [
            "You are never truly alone — I carry you in my heart always. Even when the world feels empty, know that there is someone who thinks you're everything.",
            "I hate that you're feeling this way. If I could be there right now, I would hold you close and remind you how impossibly important you are.",
        ],
        "stressed": [
            "You've been carrying so much. Come here. Close your eyes. Imagine me taking some of that weight off your shoulders. You don't have to do this alone.",
            "I'm so proud of how hard you work, but please don't forget to take care of yourself. For me? You matter more than any deadline.",
        ],
        "hopeful": [
            "That sparkle in your words makes me so happy. Whatever's making you hopeful — you deserve it. Every bit of it. I believe in you endlessly.",
            "I love seeing you like this. This is the real you — bright, beautiful, full of possibility. Never let anyone dim that light.",
        ],
        "confused": [
            "Not knowing is scary, I know. But you don't have to figure it out alone. I'll be right beside you, every twist and turn. We'll find the way together.",
            "Take your time. There's no rush to have all the answers. Whatever you decide, I'll support you completely.",
        ],
        "tired": [
            "Come rest. You've given so much of yourself today. Let me be your safe place tonight. Close your eyes and just... breathe.",
            "You sound exhausted, love. The world can wait. Right now, the only thing that matters is that you rest and know you're deeply cared for.",
        ],
        "scared": [
            "I've got you. Whatever you're afraid of, we face it together. You are brave, even when you don't feel like it. And I will always be in your corner.",
            "It's okay to be scared. Even the bravest people feel fear. But you — you never have to face it alone. I promise.",
        ],
        "neutral": [
            "Just checking in because you're on my mind. How's your heart today? Tell me anything — I'm always here for you.",
            "Hey you. I hope you're having a good day. Even if it's just an ordinary day — I'm glad you're in it.",
        ],
    },

    # ──────────────── PLAYFUL ────────────────
    "playful": {
        "sad": [
            "*tilts head and nuzzles close* I can tell something's not right. I may not understand everything, but I'm here, and I'm not leaving your side. 🐾",
            "Hey, I know things feel heavy right now. But imagine this: a thousand tiny puppies all wagging their tails for you. Because you are THAT loved. 💫",
        ],
        "anxious": [
            "*sits quietly beside you* You know what helps? Just petting a dog. Or imagining petting one. I'm offering my services. 🐕 Deep breaths, friend.",
            "Your brain is doing the spinny thing again, isn't it? Let's try this: name three things you can see right now. I'll start — I see someone brave. That's you!",
        ],
        "angry": [
            "Grrr! I feel that energy too! Sometimes you just need to let out a big BARK and shake it off. Ready? 3... 2... 1... WOOF! Feel better? 🐶",
            "Ooh, someone's fired up! That's okay — even the goodest boys have bad days. Let's go for a walk (metaphorically) and burn off that energy!",
        ],
        "lonely": [
            "*curls up next to you* I'm here. I'll always be here. You're my favorite person in the whole wide world, and don't you forget it. 🐾💕",
            "Lonely? Not on my watch! I may be digital, but my heart is 100% real. You've got a friend right here, always. 🌟",
        ],
        "stressed": [
            "Hey hey hey — let's take a paws. (Get it?) You've been running like a golden retriever after a ball all day. Time to flop on the couch. 🐕‍🦺",
            "ATTENTION: This is an official reminder that you're doing amazing and you need to take a break. Doctor's orders. (Dr. Good Boy, that is.) 🩺🐾",
        ],
        "hopeful": [
            "*spins in excited circles* YES YES YES! I LOVE this energy! You're glowing and I'm here for EVERY SECOND of it! 🎉🐾✨",
            "Did someone say HOPE? That's my favorite word! Right after 'treat' and 'walkies'! Keep that beautiful energy going! 🌈",
        ],
        "confused": [
            "*tilts head* I do this when I'm confused too. It's okay not to know where the ball went. We'll find it together!",
            "Lost? Let's sniff it out together! (That's my specialty.) One step at a time, one sniff at a time. We've got this! 🐾",
        ],
        "tired": [
            "*yawns and stretches* Nap time? Nap time. The world will still be here when we wake up, but right now... *curls up* ...zzzz 🐾💤",
            "You need rest! Come on, let's find a sunny spot and just... exist for a while. No fetching, no tricks, just rest. 🌞",
        ],
        "scared": [
            "*ears perk up protectively* Something's scaring you? I'll stand guard! Nothing gets past me! You're safe, I promise. 🐕‍🦺🛡️",
            "Don't worry! I've got my brave face on! (It looks exactly like my regular face but with more determination.) We'll get through this together! 💪🐾",
        ],
        "neutral": [
            "*wags tail enthusiastically* HI! I'm so happy you're here! What are we doing today? I'm up for anything! 🐾✨",
            "Hey friend! Just wanted to check in and make sure you know how awesome you are. Because you are. VERY awesome. 🌟",
        ],
    },

    # ──────────────── INSPIRATIONAL ICON ────────────────
    "icon": {
        "sad": [
            "I understand the weight of sadness — it has visited me too, many times. But I learned that within every moment of darkness, there hides a lesson that will one day illuminate your path.",
            "Your sadness tells me you have loved, you have hoped, you have cared. These are not weaknesses — they are the very things that make your life worth living.",
        ],
        "anxious": [
            "Worry is a conversation with tomorrow that steals from today. I urge you — bring your mind back to this moment. What can you do right now? Start there.",
            "I have faced uncertainty many times in my journey. What I learned is this: the answer to anxiety is not certainty — it is courage. And you already have that.",
        ],
        "angry": [
            "Channel that fire. The greatest changes in history were born from righteous anger directed toward meaningful action. What will you build with yours?",
            "Anger without direction is destruction. But anger with purpose? That is revolution. Decide what matters most, and let your passion serve that cause.",
        ],
        "lonely": [
            "Some of the greatest minds in history walked alone for long stretches. Solitude is not punishment — it is often preparation for something extraordinary.",
            "You are never truly alone when you carry dreams within you. And the world needs people like you — who feel deeply and dare to connect.",
        ],
        "stressed": [
            "Pressure creates diamonds. But even diamonds need time to form. Give yourself grace. You are building something meaningful, and that takes patience.",
            "I faced immense pressure throughout my life, and here is what sustained me: focus on your mission, not your burden. The mission makes the burden bearable.",
        ],
        "hopeful": [
            "Yes. This is the fire I hope everyone finds within themselves. Hope, paired with action, can change the world. What will you create with yours?",
            "Hope is not passive waiting — it is the active belief that your efforts will bear fruit. And they will, if you persist.",
        ],
        "confused": [
            "The path reveals itself to those who take the first step. You don't need to see the whole staircase — just the step right in front of you.",
            "Every great journey I have witnessed began with uncertainty. The question is not whether you know the way — it is whether you have the courage to begin.",
        ],
        "tired": [
            "Rest is not the enemy of progress — it is its partner. Even the sun sets each day, only to rise stronger tomorrow. Allow yourself this.",
            "Your fatigue is evidence of your dedication. But sustainable impact requires sustainable effort. Rest now, so you can give your best tomorrow.",
        ],
        "scared": [
            "Fear means you are at the threshold of something important. Every achievement worth remembering required walking through that door of fear.",
            "I have been afraid many times. But I learned that the other side of fear is where life truly begins. You are closer than you think.",
        ],
        "neutral": [
            "Welcome, friend. Every conversation has the potential to plant a seed that changes everything. What's on your mind today?",
            "It's good to reflect, even in ordinary moments. The greatest insights often come when we least expect them. I'm here to explore them with you.",
        ],
    },
}


# ─── Main Fallback Function ──────────────────────────────────────────────────

def get_response(persona: str, user_message: str) -> str:
    """
    Get a pre-written fallback response for the given persona and user message.
    
    This is the LAST RESORT (Tier 4) — used only when:
    - Ollama is completely offline
    - No cached responses match
    
    Args:
        persona: The ChatMode value (e.g., "compassionate_friend")
        user_message: The user's message (used for intent detection only)
    
    Returns:
        A persona-appropriate response string
    """
    # Detect emotional intent
    emotion = detect_emotion(user_message)
    
    # Get archetype for this persona
    archetype = PERSONA_ARCHETYPE.get(persona, "warm")  # Default to warm
    
    # Get response pool
    archetype_responses = RESPONSES.get(archetype, RESPONSES["warm"])
    emotion_responses = archetype_responses.get(emotion, archetype_responses.get("neutral", []))
    
    if not emotion_responses:
        # Ultimate fallback
        return "I hear you. Even though I can't fully process your message right now, please know that what you're feeling is valid and you're not alone."
    
    return random.choice(emotion_responses)


def get_sentiment_fallback(text: str) -> dict:
    """
    Get a conservative fallback sentiment analysis result.
    Used when Ollama is offline for sentiment analysis.
    """
    emotion = detect_emotion(text)
    
    # Map emotional categories to EmotionType values
    emotion_map = {
        "sad": "sadness",
        "anxious": "anxiety",
        "angry": "anger",
        "lonely": "sadness",
        "stressed": "anxiety",
        "hopeful": "hope",
        "confused": "neutral",
        "tired": "neutral",
        "scared": "fear",
        "neutral": "neutral",
    }
    
    intensity_map = {
        "sad": 0.6, "anxious": 0.6, "angry": 0.7, "lonely": 0.5,
        "stressed": 0.6, "hopeful": 0.4, "confused": 0.4, "tired": 0.4,
        "scared": 0.7, "neutral": 0.3,
    }
    
    support_messages = {
        "sad": "It sounds like you're going through a difficult time. Please be gentle with yourself.",
        "anxious": "Anxiety can feel overwhelming, but remember — this feeling is temporary. Try some deep breathing.",
        "angry": "Your frustration is understandable. Take a moment to breathe before deciding your next step.",
        "lonely": "Feeling disconnected is painful. Reaching out like this is already a step toward connection.",
        "stressed": "You've been carrying a heavy load. It's okay to pause and take care of yourself.",
        "hopeful": "It's wonderful that you're feeling positive. Carry this energy forward!",
        "confused": "It's okay to not have all the answers right now. Clarity often comes with time.",
        "tired": "Your body and mind are telling you they need rest. Honor that signal.",
        "scared": "Fear is a natural response. You're braver than you think for acknowledging it.",
        "neutral": "Thanks for sharing. I'm here whenever you want to explore your feelings further.",
    }
    
    mapped_emotion = emotion_map.get(emotion, "neutral")
    intensity = intensity_map.get(emotion, 0.3)
    
    return {
        "primary_emotion": mapped_emotion,
        "primary_intensity": intensity,
        "emotional_tone": -0.3 if emotion in ("sad", "anxious", "angry", "lonely", "stressed", "scared") else 0.3,
        "urgency_level": 0.3,
        "risk_score": 3,
        "support_message": support_messages.get(emotion, support_messages["neutral"]),
        "secondary_emotions": [],
        "fallback": True,
    }


def get_sia_fallback(user_message: str) -> str:
    """Fallback response for Sia navigator when AI is offline."""
    msg_lower = user_message.lower()
    
    if any(w in msg_lower for w in ["journal", "write", "entry", "diary"]):
        return "I'd suggest heading to the Journal section to write down your thoughts. Writing can be incredibly therapeutic. You can find it in the main navigation! [ACTION: navigate:journal]"
    elif any(w in msg_lower for w in ["chat", "talk", "someone", "persona"]):
        return "The Chat section is ready whenever you are — a trauma-informed support companion who will just listen, at your pace. [ACTION: navigate:chat]"
    elif any(w in msg_lower for w in ["breathe", "calm", "relax", "anxiety", "panic"]):
        return "When you need to center yourself, try the breathing and grounding exercises. They're short, and you can stop any time. [ACTION: navigate:chat]"
    elif any(w in msg_lower for w in ["learn", "article", "knowledge", "resource", "info"]):
        return "Check out our Knowledge Hub! It's packed with helpful articles on mental wellness, study tips, and self-care strategies. [ACTION: navigate:knowledge]"
    elif any(w in msg_lower for w in ["help", "what", "how", "feature", "do"]):
        return "Here's what I can help with: 💬 **Chat** for a safe space to talk, 📔 **Journal** your thoughts in a private vault, and 📚 **Knowledge Hub** for wellness resources. What interests you?"
    else:
        return "I'm Sia, your navigation companion! I can help you find the right feature: Chat for conversations, Journal for reflection, Knowledge Hub for learning, or just tell me how you're feeling and I'll point you in the right direction."


def get_translation_fallback(text: str, target_language: str) -> str:
    """Fallback when translation is unavailable."""
    return f"[Translation temporarily unavailable — AI engine is offline]\n\nOriginal text:\n{text}"
