"""
Silent Sentinel NLP Engine
Core sentiment and emotion analysis powered by TherapyLlama-8B

ENHANCED FEATURES:
1. Chain-of-Thought reasoning using <think> tags
2. 128K context window for session-wide pattern detection
3. Emotional masking detection
4. Repetition/rumination analysis
5. Unified wellness/risk scoring (see services/wellness_score.py)
"""

from typing import Dict, List, Tuple, Optional
import re
import base64
from services.ollama_client import OllamaClient
from models.schemas import Emotion, EmotionType, MaskingIndicator


# OPTIMIZED: Shorter prompt for faster response
SENTIMENT_SYSTEM_PROMPT = """You are a compassionate mental health sentiment analyzer. Analyze the journal entry and respond with ONLY this JSON (no explanation).

IMPORTANT:
1. "primary_emotion" must match the text's actual emotion.
2. "support_message" must be unique and specific to the user's situation. Do not use generic phrases.

Examples of Good Responses:
User: "I've been in the library for 10 hours and I still don't get this chapter."
Response Support: "It sounds like you've reached your limit for today. Deep learning happens best when the mind is rested."

User: "I see everyone posting pictures of their hangouts and I'm never invited."
Response Support: "Social media only shows the highlights, not the lonely moments everyone has."

User: "I have no idea what I want to do with my life."
Response Support: "It's perfectly okay to still be figuring it out. Many people are."

JSON Format:
{
    "primary_emotion": "joy/sadness/anger/fear/anxiety/hope/neutral",
    "primary_intensity": 0.0-1.0,
    "emotional_tone": -1.0 to 1.0,
    "urgency_level": 0.0-1.0,
    "risk_score": 0-10,
    "support_message": "specific supportive message based on the text"
}"""


SESSION_TREND_PROMPT = """You are analyzing a student's FULL journaling session to detect emotional TRENDS and patterns.

CRITICAL: Use <think> tags to reason about patterns across the ENTIRE session before responding.

In your <think> reasoning, consider:
1. How has the emotional tone evolved across entries?
2. Are there recurring themes or "stuck" thought patterns?
3. Is the student's state improving, declining, or cycling?
4. What coping strategies (if any) are they using?
5. Is this a temporary frustration or a concerning pattern?

Then output JSON:
{
    "session_trend": "improving" | "stable" | "declining" | "cycling",
    "trend_confidence": 0.0-1.0,
    "recurring_themes": ["theme1", "theme2"],
    "risk_trajectory": "decreasing" | "stable" | "increasing",
    "overall_risk_score": 0-10,
    "session_insight": "key insight about their emotional journey",
    "recommended_intervention": "specific suggestion based on patterns"
}"""


MASKING_SYSTEM_PROMPT = """You are an expert at detecting emotional masking in student journal entries.

CRITICAL: Use <think> tags to reason through your analysis before the JSON response.

In your <think> reasoning, look for:
1. Discrepancies between stated feelings and described situations
2. Dismissive language ("just", "only", "a little", "I'm fine")
3. Forced humor or deflection (excessive "lol", "haha")
4. Overly positive framing of negative situations
5. Minimizing language that contradicts the severity of events

Then output JSON:
{
    "masking_detected": true/false,
    "confidence": 0.0-1.0,
    "surface_emotion": "what they're presenting",
    "underlying_emotion": "what they might actually feel",
    "masking_type": "minimizing" | "deflecting" | "forced_positivity" | "none",
    "indicators": ["specific phrases or patterns"],
    "gentle_observation": "a compassionate way to acknowledge their true feelings"
}"""


class NLPEngine:
    """Main NLP engine with Chain-of-Thought reasoning for distress and emotion analysis
    
    PRIVACY: No session data is stored. Each request is processed independently.
    """
    
    def __init__(self):
        self.client = OllamaClient.get_instance()
        self._repetition_threshold = 3
        # PRIVACY: Session context storage DISABLED - no data retention
        # self._session_contexts: Dict[str, List[str]] = {}  # REMOVED
    
    async def analyze_sentiment(
        self, 
        text: str, 
        session_id: Optional[str] = None
    ) -> Dict:
        """
        Fast sentiment analysis - optimized for speed
        
        Args:
            text: Journal entry to analyze
            session_id: Optional session ID
            
        Returns dict with emotions, risk score, and supportive message
        """
        # Enhanced prompt for better variety and specificity
        prompt = f"""Analyze this specific text: "{text[:500]}"

Respond with JSON only.
CRITICAL: The 'support_message' MUST be unique to this specific situation.
- Do NOT use generic phrases like "It's important to remember" or "I understand."
- Reflect the specific content they wrote about.
- If they mentioned a specific event, mention it in your support."""

        response = await self.client.generate(
            prompt=prompt,
            system_prompt=SENTIMENT_SYSTEM_PROMPT,
            temperature=0.7,  # Increased for variety
            max_tokens=256
        )
        
        # PRIVACY: Session context storage DISABLED
        # We do NOT store any text, even temporarily
        # if session_id:
        #     ... storage removed for privacy ...
        
        # Parse response (extract JSON after <think> tags)
        result = self._parse_reasoning_response(response)
        
        try:
            primary_emotion = self._parse_emotion_type(
                result.get("primary_emotion", "neutral")
            )
            primary_intensity = self._clamp(
                result.get("primary_intensity", 0.5), 0, 1
            )
            
            secondary_emotions = []
            for em in result.get("secondary_emotions", []):
                emotion_type = self._parse_emotion_type(em.get("emotion", "neutral"))
                intensity = self._clamp(em.get("intensity", 0.3), 0, 1)
                secondary_emotions.append(Emotion(type=emotion_type, intensity=intensity))
            
            return {
                "primary_emotion": Emotion(type=primary_emotion, intensity=primary_intensity),
                "secondary_emotions": secondary_emotions,
                "emotional_tone": self._clamp(result.get("emotional_tone", 0), -1, 1),
                "urgency_level": self._clamp(result.get("urgency_level", 0), 0, 1),
                "risk_score": self._clamp(result.get("risk_score", 3), 0, 10),
                "reasoning_summary": result.get("reasoning_summary", ""),
                "key_phrases": result.get("key_phrases", []),
                "support_message": result.get("support_message", "You're doing great by expressing yourself.")
            }
        except Exception:
            return self._default_sentiment_result()
    
    async def analyze_session_trends(self, session_id: str) -> Dict:
        """
        DISABLED: Session trend analysis requires storing data, which violates privacy.
        This feature is intentionally disabled.
        """
        return {
            "error": "Session trend analysis is disabled for privacy. Each entry is analyzed independently.",
            "data_stored": False
        }
    
    async def detect_masking(self, text: str) -> MaskingIndicator:
        """
        Detect emotional masking with Chain-of-Thought reasoning
        """
        prompt = f"""Analyze this journal entry for signs of emotional masking:

---
{text}
---

Use <think> tags to reason through any discrepancies you notice."""

        response = await self.client.generate(
            prompt=prompt,
            system_prompt=MASKING_SYSTEM_PROMPT,
            temperature=0.2,
            max_tokens=1024
        )
        
        result = self._parse_reasoning_response(response)
        
        try:
            detected = result.get("masking_detected", False)
            if detected:
                return MaskingIndicator(
                    detected=True,
                    confidence=self._clamp(result.get("confidence", 0.5), 0, 1),
                    surface_emotion=self._parse_emotion_type(
                        result.get("surface_emotion", "joy")
                    ),
                    underlying_emotion=self._parse_emotion_type(
                        result.get("underlying_emotion", "sadness")
                    ),
                    indicators=result.get("indicators", [])
                )
            else:
                return MaskingIndicator(detected=False)
        except Exception:
            return MaskingIndicator(detected=False)

    def analyze_repetition(self, text: str) -> Tuple[bool, List[str]]:
        """Detect repetitive words/phrases indicating rumination"""
        words = text.lower().split()
        
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'must', 'it', 'its', 'this', 'that', 'these',
            'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'you', 'your', 'he',
            'she', 'they', 'them', 'what', 'which', 'who', 'when', 'where', 'why',
            'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
            'some', 'such', 'no', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
            'very', 'just', 'can', 'im', "i'm", 'dont', "don't", 'cant', "can't"
        }
        
        word_counts = {}
        for word in words:
            clean_word = ''.join(c for c in word if c.isalnum())
            if clean_word and clean_word not in stop_words and len(clean_word) > 2:
                word_counts[clean_word] = word_counts.get(clean_word, 0) + 1
        
        repeated = [
            word for word, count in word_counts.items() 
            if count >= self._repetition_threshold
        ]
        
        if len(words) >= 2:
            bigrams = [f"{words[i]} {words[i+1]}" for i in range(len(words)-1)]
            bigram_counts = {}
            for bg in bigrams:
                bigram_counts[bg] = bigram_counts.get(bg, 0) + 1
            repeated_phrases = [
                bg for bg, count in bigram_counts.items()
                if count >= 2 and not all(w in stop_words for w in bg.split())
            ]
            repeated.extend(repeated_phrases)
        
        return len(repeated) > 0, repeated[:5]
    
    def detect_emotional_shift(self, text: str) -> Optional[str]:
        """Detect if emotions shift from beginning to end of text"""
        words = text.split()
        if len(words) < 20:
            return None
        
        mid = len(words) // 2
        first_half = ' '.join(words[:mid])
        second_half = ' '.join(words[mid:])
        
        positive_words = {
            'happy', 'good', 'great', 'better', 'best', 'love', 'wonderful',
            'amazing', 'excited', 'hopeful', 'grateful', 'thankful', 'joy',
            'blessed', 'peaceful', 'calm', 'relaxed', 'confident', 'proud'
        }
        negative_words = {
            'sad', 'bad', 'worse', 'worst', 'hate', 'terrible', 'awful',
            'anxious', 'worried', 'scared', 'angry', 'frustrated', 'alone',
            'lonely', 'tired', 'exhausted', 'stressed', 'overwhelmed', 'hopeless'
        }
        
        def score_section(section: str) -> float:
            section_words = section.lower().split()
            pos = sum(1 for w in section_words if w in positive_words)
            neg = sum(1 for w in section_words if w in negative_words)
            if pos + neg == 0:
                return 0
            return (pos - neg) / (pos + neg)
        
        first_score = score_section(first_half)
        second_score = score_section(second_half)
        diff = second_score - first_score
        
        if diff > 0.3:
            return "improving"
        elif diff < -0.3:
            return "declining"
        else:
            return "stable"
    
    def clear_session(self, session_id: str):
        """DISABLED: No session data is stored, so nothing to clear"""
        pass  # No-op - we don't store anything
    
    def _parse_reasoning_response(self, response: str) -> Dict:
        """
        Parse response that may contain <think> tags followed by JSON
        Extracts the reasoning and the final JSON output
        """
        import json
        
        # Remove think tags content (we can log this for debugging but don't return it)
        think_pattern = r'<think>.*?</think>'
        cleaned = re.sub(think_pattern, '', response, flags=re.DOTALL)
        cleaned = cleaned.strip()
        
        # Try to extract JSON
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Try to find JSON object in the response
            json_match = re.search(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', cleaned, re.DOTALL)
            if json_match:
                try:
                    return json.loads(json_match.group())
                except json.JSONDecodeError:
                    pass
            return {}
    
    def _default_sentiment_result(self) -> Dict:
        """Return default result when parsing fails"""
        return {
            "primary_emotion": Emotion(type=EmotionType.NEUTRAL, intensity=0.5),
            "secondary_emotions": [],
            "emotional_tone": 0,
            "urgency_level": 0,
            "risk_score": 3,
            "reasoning_summary": "",
            "key_phrases": [],
            "support_message": "Thank you for sharing. Your feelings are valid."
        }
    
    def _parse_emotion_type(self, emotion_str: str) -> EmotionType:
        """Convert string to EmotionType enum"""
        emotion_map = {
            'joy': EmotionType.JOY,
            'happy': EmotionType.JOY,
            'happiness': EmotionType.JOY,
            'sadness': EmotionType.SADNESS,
            'sad': EmotionType.SADNESS,
            'anger': EmotionType.ANGER,
            'angry': EmotionType.ANGER,
            'fear': EmotionType.FEAR,
            'scared': EmotionType.FEAR,
            'afraid': EmotionType.FEAR,
            'surprise': EmotionType.SURPRISE,
            'surprised': EmotionType.SURPRISE,
            'disgust': EmotionType.DISGUST,
            'disgusted': EmotionType.DISGUST,
            'anxiety': EmotionType.ANXIETY,
            'anxious': EmotionType.ANXIETY,
            'worried': EmotionType.ANXIETY,
            'hope': EmotionType.HOPE,
            'hopeful': EmotionType.HOPE,
            'neutral': EmotionType.NEUTRAL
        }
        return emotion_map.get(emotion_str.lower(), EmotionType.NEUTRAL)
    
    def _clamp(self, value: float, min_val: float, max_val: float) -> float:
        """Clamp value between min and max"""
        try:
            return max(min_val, min(max_val, float(value)))
        except (ValueError, TypeError):
            return (min_val + max_val) / 2
