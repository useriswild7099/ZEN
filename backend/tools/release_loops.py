"""
Release & Reflect Loops - 30 mood-based journaling experiences
Each loop has: visual release animation, AI reflection, data log, and cool-down activity
"""

from typing import Literal
from dataclasses import dataclass

MoodCategory = Literal['anxious', 'angry', 'sad', 'overwhelmed', 'numb', 'hopeful']
VisualType = Literal['shatter', 'shrink', 'crumple', 'erase', 'fog', 'burn', 'slash', 'crack', 'implode', 'evaporate', 'rain', 'fade', 'sink', 'drift', 'ripple', 'stack_blow', 'dim', 'spiral', 'crumble', 'reset', 'camouflage', 'reverse', 'glitch', 'sludge', 'void_float', 'sparkles', 'bloom', 'beam', 'clasp', 'heart']
CoolDownType = Literal['breathing', 'prompt', 'visual', 'action', 'silence', 'grounding']

RELEASE_LOOPS = {
    # ===== CATEGORY 1: ANXIOUS (Wind Icon) =====
    "exam_panic": {
        "name": "Exam Panic",
        "category": "anxious",
        "icon": "💨",
        "visual": {
            "type": "shatter",
            "description": "Text vibrates rapidly, shatters into dust particles, drifts off-screen"
        },
        "reflection": "The pressure to perform is loud right now, but your worth is not defined by a grade.",
        "dataLog": {"color": "#FFEB3B", "tag": "Academic Pressure"},
        "coolDown": {
            "type": "prompt",
            "content": "Unclench your jaw",
            "duration": 10
        }
    },
    "social_anxiety": {
        "name": "Social Anxiety",
        "category": "anxious",
        "icon": "💨",
        "visual": {
            "type": "shrink",
            "description": "Words shrink until invisible, like a whisper fading away"
        },
        "reflection": "Social interactions can be draining. It is okay to retreat and recharge your battery.",
        "dataLog": {"color": "#FFEB3B", "tag": "Social"},
        "coolDown": {
            "type": "visual",
            "content": "Close your eyes. Visualize a quiet room.",
            "duration": 15
        }
    },
    "financial_stress": {
        "name": "Financial Stress",
        "category": "anxious",
        "icon": "💨",
        "visual": {
            "type": "crumple",
            "description": "Text turns into paper receipt, crumples into ball, tossed into bin"
        },
        "reflection": "Money stress feels like survival stress. You are carrying a heavy load today.",
        "dataLog": {"color": "#FF9800", "tag": "Finance"},
        "coolDown": {
            "type": "grounding",
            "content": "Find 3 blue things in the room",
            "duration": 20
        }
    },
    "imposter_syndrome": {
        "name": "Imposter Syndrome",
        "category": "anxious",
        "icon": "💨",
        "visual": {
            "type": "erase",
            "description": "Text is scrubbed away by virtual eraser until screen is clean"
        },
        "reflection": "That voice saying 'you don't belong' is fear, not fact.",
        "dataLog": {"color": "#FFEB3B", "tag": "Self-Doubt"},
        "coolDown": {
            "type": "prompt",
            "content": "Name one thing you did well today",
            "duration": 15
        }
    },
    "future_dread": {
        "name": "Future Dread",
        "category": "anxious",
        "icon": "💨",
        "visual": {
            "type": "fog",
            "description": "Text blurs into thick fog, fog clears to reveal blank canvas"
        },
        "reflection": "The future is a lot to hold. Let's just focus on getting through the next hour.",
        "dataLog": {"color": "#9C27B0", "tag": "Uncertainty"},
        "coolDown": {
            "type": "breathing",
            "content": "Box Breathing: In 4, Hold 4, Out 4",
            "duration": 24
        }
    },

    # ===== CATEGORY 2: ANGRY (Fire Icon) =====
    "roommate_conflict": {
        "name": "Roommate Conflict",
        "category": "angry",
        "icon": "🔥",
        "visual": {
            "type": "burn",
            "description": "Text glows hot orange, catches fire, burns into grey ash"
        },
        "reflection": "Living with others tests patience. Your frustration is valid boundary work.",
        "dataLog": {"color": "#F44336", "tag": "Living Situation"},
        "coolDown": {
            "type": "action",
            "content": "Squeeze your fists tight for 5 seconds. Now release.",
            "duration": 10
        }
    },
    "unfair_grade": {
        "name": "Unfair Grade",
        "category": "angry",
        "icon": "🔥",
        "visual": {
            "type": "slash",
            "description": "Text slashed through with red lines, then shredded vertically"
        },
        "reflection": "It hurts when your effort isn't seen or rewarded the way it should be.",
        "dataLog": {"color": "#F44336", "tag": "Injustice"},
        "coolDown": {
            "type": "action",
            "content": "Tap to punch (virtual punching bag)",
            "duration": 15
        }
    },
    "betrayal": {
        "name": "Betrayal",
        "category": "angry",
        "icon": "🔥",
        "visual": {
            "type": "crack",
            "description": "Text cracks like glass and falls to bottom of screen"
        },
        "reflection": "Broken trust is a wound. It makes sense that you want to protect yourself right now.",
        "dataLog": {"color": "#795548", "tag": "Relationship"},
        "coolDown": {
            "type": "breathing",
            "content": "Deep breath. Imagine blowing out a candle.",
            "duration": 10
        }
    },
    "self_frustration": {
        "name": "Self-Frustration",
        "category": "angry",
        "icon": "🔥",
        "visual": {
            "type": "implode",
            "description": "Text implodes into a single black dot, which vanishes"
        },
        "reflection": "Be gentle with yourself. You are learning, not failing.",
        "dataLog": {"color": "#FF9800", "tag": "Self-Criticism"},
        "coolDown": {
            "type": "action",
            "content": "Put your hand over your heart",
            "duration": 10
        }
    },
    "general_irritability": {
        "name": "General Irritability",
        "category": "angry",
        "icon": "🔥",
        "visual": {
            "type": "evaporate",
            "description": "Text bubbles up like boiling water and evaporates"
        },
        "reflection": "Some days, everything feels like sandpaper. It's okay to just be done with today.",
        "dataLog": {"color": "#F44336", "tag": "Mood Swing"},
        "coolDown": {
            "type": "silence",
            "content": "15 seconds of silence",
            "duration": 15
        }
    },

    # ===== CATEGORY 3: SAD (Cloud Icon) =====
    "homesickness": {
        "name": "Homesickness",
        "category": "sad",
        "icon": "☁️",
        "visual": {
            "type": "rain",
            "description": "Text turns into blue ink drops and rains down the screen"
        },
        "reflection": "Missing home is just love with nowhere to go right now.",
        "dataLog": {"color": "#2196F3", "tag": "Homesick"},
        "coolDown": {
            "type": "visual",
            "content": "A warm cup of tea steaming",
            "duration": 10
        }
    },
    "breakup_rejection": {
        "name": "Breakup/Rejection",
        "category": "sad",
        "icon": "☁️",
        "visual": {
            "type": "fade",
            "description": "Text fades slowly, letter by letter, from left to right"
        },
        "reflection": "This kind of loss changes your landscape. Take it one breath at a time.",
        "dataLog": {"color": "#2196F3", "tag": "Grief"},
        "coolDown": {
            "type": "action",
            "content": "Wrap your arms around yourself. Squeeze.",
            "duration": 10
        }
    },
    "academic_failure": {
        "name": "Academic Failure",
        "category": "sad",
        "icon": "☁️",
        "visual": {
            "type": "sink",
            "description": "Text sinks to bottom of screen and dissolves into water"
        },
        "reflection": "A bad result is an event, not a definition of who you are.",
        "dataLog": {"color": "#2196F3", "tag": "Academics"},
        "coolDown": {
            "type": "prompt",
            "content": "Look out a window. Find the sky.",
            "duration": 15
        }
    },
    "loneliness": {
        "name": "Loneliness",
        "category": "sad",
        "icon": "☁️",
        "visual": {
            "type": "drift",
            "description": "Text drifts apart like dandelion seeds in the wind"
        },
        "reflection": "Solitude can feel heavy. You are brave for sitting with it.",
        "dataLog": {"color": "#9C27B0", "tag": "Isolation"},
        "coolDown": {
            "type": "prompt",
            "content": "Text one friend a simple emoji. No words needed.",
            "duration": 15
        }
    },
    "just_cried": {
        "name": "I Just Cried",
        "category": "sad",
        "icon": "☁️",
        "visual": {
            "type": "ripple",
            "description": "Screen ripples like a pond, washing the words away"
        },
        "reflection": "Tears are the body's way of releasing the pressure valve. Let them flow.",
        "dataLog": {"color": "#2196F3", "tag": "Release"},
        "coolDown": {
            "type": "prompt",
            "content": "Drink some water",
            "duration": 10
        }
    },

    # ===== CATEGORY 4: OVERWHELMED (Heart Icon) =====
    "too_many_deadlines": {
        "name": "Too Many Deadlines",
        "category": "overwhelmed",
        "icon": "❤️",
        "visual": {
            "type": "stack_blow",
            "description": "Text piles into stack, gentle wind blows stack away"
        },
        "reflection": "You are one person. You can only do one thing at a time.",
        "dataLog": {"color": "#FF9800", "tag": "Workload"},
        "coolDown": {
            "type": "prompt",
            "content": "Pick ONE small task to do. Forget the rest for now.",
            "duration": 15
        }
    },
    "sensory_overload": {
        "name": "Sensory Overload",
        "category": "overwhelmed",
        "icon": "❤️",
        "visual": {
            "type": "dim",
            "description": "Screen slowly dims to black, hiding text in darkness"
        },
        "reflection": "The world is too loud right now. You have permission to disconnect.",
        "dataLog": {"color": "#F44336", "tag": "Sensory"},
        "coolDown": {
            "type": "silence",
            "content": "30 seconds of void mode",
            "duration": 30
        }
    },
    "decision_paralysis": {
        "name": "Decision Paralysis",
        "category": "overwhelmed",
        "icon": "❤️",
        "visual": {
            "type": "spiral",
            "description": "Text spins into spiral and disappears into center"
        },
        "reflection": "There is no 'perfect' choice. Any step forward is a good step.",
        "dataLog": {"color": "#FFEB3B", "tag": "Indecision"},
        "coolDown": {
            "type": "visual",
            "content": "Coin flip animation",
            "duration": 5
        }
    },
    "burnout": {
        "name": "Burnout",
        "category": "overwhelmed",
        "icon": "❤️",
        "visual": {
            "type": "crumble",
            "description": "Text crumbles like dry earth"
        },
        "reflection": "You cannot pour from an empty cup. Rest is productive.",
        "dataLog": {"color": "#795548", "tag": "Exhaustion"},
        "coolDown": {
            "type": "prompt",
            "content": "Lie down for 1 minute",
            "duration": 60
        }
    },
    "everything_wrong": {
        "name": "Everything is Wrong",
        "category": "overwhelmed",
        "icon": "❤️",
        "visual": {
            "type": "reset",
            "description": "Giant Reset button descends and squashes the text"
        },
        "reflection": "When the big picture is scary, focus on the small picture. Like your breathing.",
        "dataLog": {"color": "#212121", "tag": "Crisis"},
        "coolDown": {
            "type": "breathing",
            "content": "4-7-8 Breathing",
            "duration": 38
        }
    },

    # ===== CATEGORY 5: NUMB (Neutral Face Icon) =====
    "apathy": {
        "name": "Apathy",
        "category": "numb",
        "icon": "😐",
        "visual": {
            "type": "camouflage",
            "description": "Text turns grey and fades into background color"
        },
        "reflection": "Feeling 'nothing' is often a shield against feeling 'too much'.",
        "dataLog": {"color": "#9E9E9E", "tag": "Dissociation"},
        "coolDown": {
            "type": "action",
            "content": "Rub your palms together until they get warm",
            "duration": 15
        }
    },
    "auto_pilot": {
        "name": "Auto-Pilot",
        "category": "numb",
        "icon": "😐",
        "visual": {
            "type": "reverse",
            "description": "Text types itself backward and deletes"
        },
        "reflection": "You've been running on survival mode. It makes sense you're tired.",
        "dataLog": {"color": "#9E9E9E", "tag": "Routine"},
        "coolDown": {
            "type": "action",
            "content": "Stretch your arms up high",
            "duration": 10
        }
    },
    "disconnection": {
        "name": "Disconnection",
        "category": "numb",
        "icon": "😐",
        "visual": {
            "type": "glitch",
            "description": "Text breaks into pixels (glitch effect) and vanishes"
        },
        "reflection": "It feels like you're watching your life through a glass wall today.",
        "dataLog": {"color": "#9E9E9E", "tag": "Derealization"},
        "coolDown": {
            "type": "grounding",
            "content": "Touch 3 different textures near you",
            "duration": 20
        }
    },
    "boredom_stuck": {
        "name": "Boredom/Stuck",
        "category": "numb",
        "icon": "😐",
        "visual": {
            "type": "sludge",
            "description": "Text slowly sinks off bottom of screen like heavy sludge"
        },
        "reflection": "Stagnation is uncomfortable, but it often precedes a shift.",
        "dataLog": {"color": "#795548", "tag": "Stuck"},
        "coolDown": {
            "type": "action",
            "content": "Stand up and shake your body",
            "duration": 15
        }
    },
    "deep_void": {
        "name": "The Void",
        "category": "numb",
        "icon": "😐",
        "visual": {
            "type": "void_float",
            "description": "Text floats into starry deep space background, drifts away forever"
        },
        "reflection": "Sending these thoughts into the void. They are gone now.",
        "dataLog": {"color": "#212121", "tag": "Void"},
        "coolDown": {
            "type": "visual",
            "content": "White noise for 20 seconds",
            "duration": 20
        }
    },

    # ===== CATEGORY 6: HOPEFUL (Sparkle Icon) =====
    "small_win": {
        "name": "Small Win",
        "category": "hopeful",
        "icon": "✨",
        "visual": {
            "type": "sparkles",
            "description": "Text transforms into golden sparkles/fireflies and flies up"
        },
        "reflection": "Grab onto this feeling. You earned this moment.",
        "dataLog": {"color": "#4CAF50", "tag": "Achievement"},
        "coolDown": {
            "type": "prompt",
            "content": "Smile for 10 seconds (it tricks the brain!)",
            "duration": 10
        }
    },
    "gratitude": {
        "name": "Gratitude",
        "category": "hopeful",
        "icon": "✨",
        "visual": {
            "type": "bloom",
            "description": "Text turns into flower that blooms and fades gently"
        },
        "reflection": "Noticing the good things is a superpower.",
        "dataLog": {"color": "#4CAF50", "tag": "Gratitude"},
        "coolDown": {
            "type": "prompt",
            "content": "Think of one person you appreciate",
            "duration": 15
        }
    },
    "clarity": {
        "name": "Clarity",
        "category": "hopeful",
        "icon": "✨",
        "visual": {
            "type": "beam",
            "description": "Text becomes beam of light and shoots upward"
        },
        "reflection": "It sounds like the fog has lifted. Enjoy the view.",
        "dataLog": {"color": "#03A9F4", "tag": "Insight"},
        "coolDown": {
            "type": "prompt",
            "content": "Write down one keyword from your entry to keep",
            "duration": 15
        }
    },
    "connection": {
        "name": "Connection",
        "category": "hopeful",
        "icon": "✨",
        "visual": {
            "type": "clasp",
            "description": "Text turns into two hands clasping, then fades"
        },
        "reflection": "Shared burden is half a burden. Glad you connected today.",
        "dataLog": {"color": "#E91E63", "tag": "Social"},
        "coolDown": {
            "type": "prompt",
            "content": "Send a 'Thinking of you' text",
            "duration": 15
        }
    },
    "self_love": {
        "name": "Self-Love",
        "category": "hopeful",
        "icon": "✨",
        "visual": {
            "type": "heart",
            "description": "Text turns into heart, beats once, and dissolves"
        },
        "reflection": "Being kind to yourself is the hardest and most important work.",
        "dataLog": {"color": "#E91E63", "tag": "Self-Care"},
        "coolDown": {
            "type": "prompt",
            "content": "Give yourself a high five in the mirror (or mentally)",
            "duration": 10
        }
    }
}

# Category definitions for UI
MOOD_CATEGORIES = {
    "anxious": {"name": "Anxious", "icon": "💨", "color": "#FFEB3B"},
    "angry": {"name": "Angry", "icon": "🔥", "color": "#F44336"},
    "sad": {"name": "Sad", "icon": "☁️", "color": "#2196F3"},
    "overwhelmed": {"name": "Overwhelmed", "icon": "❤️", "color": "#FF9800"},
    "numb": {"name": "Numb", "icon": "😐", "color": "#9E9E9E"},
    "hopeful": {"name": "Hopeful", "icon": "✨", "color": "#4CAF50"}
}

def get_loops_by_category(category: str) -> list:
    """Get all loops for a specific mood category"""
    return [
        {"id": key, **value}
        for key, value in RELEASE_LOOPS.items()
        if value["category"] == category
    ]

def get_loop_by_id(loop_id: str) -> dict:
    """Get a specific loop by ID"""
    if loop_id in RELEASE_LOOPS:
        return {"id": loop_id, **RELEASE_LOOPS[loop_id]}
    return None
