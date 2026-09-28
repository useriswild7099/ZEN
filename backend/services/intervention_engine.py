"""
Intervention Engine
Selects and prioritizes self-care interventions based on emotional state
"""

from typing import List, Optional
from models.schemas import Intervention, InterventionType, EmotionType, Emotion


class InterventionEngine:
    """
    Selects appropriate interventions based on detected emotional state
    """
    
    # Intervention templates
    INTERVENTIONS = {
        InterventionType.BREATHING: Intervention(
            type=InterventionType.BREATHING,
            title="4-7-8 Breathing",
            description="A calming breathing technique: breathe in for 4 seconds, hold for 7, exhale for 8. Let's do it together.",
            priority=1
        ),
        InterventionType.GROUNDING: Intervention(
            type=InterventionType.GROUNDING,
            title="5-4-3-2-1 Grounding",
            description="Ground yourself in the present moment by noticing 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
            priority=2
        ),
        InterventionType.MEMORY_BOX: Intervention(
            type=InterventionType.MEMORY_BOX,
            title="Memory Box",
            description="Take a moment to recall a happy memory. Picture it vividly - where were you? Who was there? How did it feel?",
            priority=3
        ),
        InterventionType.AFFIRMATION: Intervention(
            type=InterventionType.AFFIRMATION,
            title="Gentle Reminder",
            description="You are doing your best, and that is enough. This feeling is temporary, and you have overcome difficult times before.",
            priority=4
        ),
        InterventionType.JOURNALING: Intervention(
            type=InterventionType.JOURNALING,
            title="Continued Reflection",
            description="Would you like to explore these feelings further? Sometimes writing more can help clarify our thoughts.",
            priority=5
        ),
        InterventionType.MUSIC: Intervention(
            type=InterventionType.MUSIC,
            title="Calming Sounds",
            description="Take a moment to listen to some soothing sounds. Let the music wash over you.",
            priority=4
        )
    }
    
    # Emotion to intervention mapping
    EMOTION_INTERVENTIONS = {
        EmotionType.ANXIETY: [InterventionType.BREATHING, InterventionType.GROUNDING, InterventionType.MUSIC],
        EmotionType.FEAR: [InterventionType.GROUNDING, InterventionType.BREATHING, InterventionType.AFFIRMATION],
        EmotionType.SADNESS: [InterventionType.MEMORY_BOX, InterventionType.AFFIRMATION, InterventionType.MUSIC],
        EmotionType.ANGER: [InterventionType.BREATHING, InterventionType.GROUNDING, InterventionType.JOURNALING],
        EmotionType.DISGUST: [InterventionType.BREATHING, InterventionType.AFFIRMATION],
        EmotionType.NEUTRAL: [InterventionType.JOURNALING, InterventionType.AFFIRMATION],
        EmotionType.JOY: [InterventionType.MEMORY_BOX],
        EmotionType.HOPE: [InterventionType.JOURNALING],
        EmotionType.SURPRISE: [InterventionType.BREATHING]
    }
    
    # Supportive messages by emotion
    SUPPORT_MESSAGES = {
        EmotionType.ANXIETY: [
            "It's okay to feel anxious. Your body is trying to protect you. Let's help it calm down together.",
            "Anxiety can feel overwhelming, but you're not alone in this. Take one breath at a time.",
            "Your worries are valid, and it's brave of you to acknowledge them. Let's work through this gently."
        ],
        EmotionType.FEAR: [
            "Fear is a natural response. You're safe right now, in this moment.",
            "It takes courage to face our fears, even just by acknowledging them. You're doing great.",
            "Whatever you're afraid of, remember: you've survived difficult things before."
        ],
        EmotionType.SADNESS: [
            "It's okay to feel sad. Your emotions are valid, and it's healthy to acknowledge them.",
            "Sadness can feel heavy, but it won't last forever. Be gentle with yourself.",
            "Thank you for sharing what you're going through. You don't have to carry this alone."
        ],
        EmotionType.ANGER: [
            "Anger often tells us something important about our boundaries. It's okay to feel this way.",
            "Your frustration is understandable. Let's find a healthy way to release some of this energy.",
            "It's brave to acknowledge anger instead of pushing it down. Let's work through it together."
        ],
        EmotionType.NEUTRAL: [
            "Thank you for taking time to reflect. Every moment of self-awareness matters.",
            "Even quiet moments of journaling help us understand ourselves better.",
            "You're doing something valuable by checking in with yourself."
        ],
        EmotionType.JOY: [
            "It's wonderful to hear positive feelings! Savoring happy moments helps build resilience.",
            "Your joy is beautiful. Take a moment to really feel it.",
            "Celebrating good moments, even small ones, is so important. Well done!"
        ],
        EmotionType.HOPE: [
            "Hope is a powerful feeling. Hold onto it - it will guide you through difficult times.",
            "Your optimism is a strength. It takes courage to look forward with hope.",
            "Hope lights the way forward. You're on the right path."
        ]
    }
    
    def get_interventions(
        self,
        primary_emotion: Emotion,
        wellness_score: float,
        masking_detected: bool = False,
        high_intensity: bool = False
    ) -> List[Intervention]:
        """
        Get prioritized list of interventions based on emotional state
        """
        interventions = []
        
        # Get base interventions for this emotion
        emotion_type = primary_emotion.type
        suggested_types = self.EMOTION_INTERVENTIONS.get(
            emotion_type, 
            [InterventionType.BREATHING, InterventionType.AFFIRMATION]
        )
        
        # If masking detected, add affirmation to help validate true feelings
        if masking_detected:
            if InterventionType.AFFIRMATION not in suggested_types:
                suggested_types.insert(0, InterventionType.AFFIRMATION)
        
        # If high intensity, prioritize calming interventions
        if high_intensity or primary_emotion.intensity > 0.7:
            if InterventionType.BREATHING not in suggested_types:
                suggested_types.insert(0, InterventionType.BREATHING)
        
        # If very low wellness, prioritize grounding
        if wellness_score < 30:
            if InterventionType.GROUNDING not in suggested_types:
                suggested_types.insert(0, InterventionType.GROUNDING)
        
        # Build intervention list
        for int_type in suggested_types[:3]:  # Max 3 interventions
            if int_type in self.INTERVENTIONS:
                intervention = self.INTERVENTIONS[int_type].model_copy()
                # Adjust priority based on wellness score
                if wellness_score < 30:
                    intervention.priority = min(1, intervention.priority - 1)
                interventions.append(intervention)
        
        return interventions
    
    def get_supportive_message(
        self,
        primary_emotion: Emotion,
        masking_detected: bool = False,
        ai_message: Optional[str] = None
    ) -> str:
        """
        Get a supportive message for the user
        """
        # If AI provided a message, prefer it
        if ai_message and len(ai_message) > 10:
            return ai_message
        
        # Get emotion-specific message
        import random
        emotion_type = primary_emotion.type
        messages = self.SUPPORT_MESSAGES.get(
            emotion_type,
            ["Thank you for sharing. Your feelings matter."]
        )
        
        message = random.choice(messages)
        
        # Add masking acknowledgment if detected
        if masking_detected:
            message += " Remember, it's okay to not be okay. You don't have to hide how you truly feel."
        
        return message
