"""
Dynamic Risk Scoring Engine
Calculates wellness scores based on multiple emotional indicators

The algorithm weighs:
- Emotional intensity and valence
- Masking detection confidence
- Repetition patterns (rumination)
- Emotional trajectory
- Urgency markers
"""

from typing import Dict, Optional
from models.schemas import Emotion, EmotionType, MaskingIndicator


class RiskScorer:
    """
    Calculate dynamic risk/wellness scores
    
    Wellness Score: 0-100 (higher = better mental state)
    Based on inverse of risk factors
    """
    
    # Emotion base risk weights (0-1 scale, 1 = concerning)
    EMOTION_RISK_WEIGHTS = {
        EmotionType.JOY: 0.0,
        EmotionType.HOPE: 0.1,
        EmotionType.SURPRISE: 0.2,
        EmotionType.NEUTRAL: 0.3,
        EmotionType.SADNESS: 0.6,
        EmotionType.ANGER: 0.5,
        EmotionType.DISGUST: 0.4,
        EmotionType.FEAR: 0.7,
        EmotionType.ANXIETY: 0.7,
    }
    
    # Intervention thresholds
    INTERVENTION_THRESHOLD = 40  # Wellness below this triggers intervention
    HIGH_RISK_THRESHOLD = 25
    
    def __init__(self):
        # Scoring weights - sum should equal 1.0
        self.weights = {
            "intensity": 0.25,
            "emotion_type": 0.20,
            "masking": 0.15,
            "repetition": 0.15,
            "trajectory": 0.15,
            "urgency": 0.10
        }
    
    def calculate_wellness_score(
        self,
        primary_emotion: Emotion,
        secondary_emotions: list,
        emotional_tone: float,
        masking: MaskingIndicator,
        repetition_detected: bool,
        emotional_shift: Optional[str],
        urgency_level: float,
        risk_score_from_ai: Optional[float] = None
    ) -> Dict:
        """
        Calculate comprehensive wellness score
        
        Returns:
            Dict with wellness_score, confidence, risk_factors, and mood_stage
        """
        risk_factors = {}
        
        # 1. Intensity Factor (higher intensity of negative = higher risk)
        emotion_risk = self.EMOTION_RISK_WEIGHTS.get(primary_emotion.type, 0.3)
        intensity_score = primary_emotion.intensity * emotion_risk
        risk_factors["intensity"] = intensity_score
        
        # 2. Emotion Type Factor
        type_score = emotion_risk
        risk_factors["emotion_type"] = type_score
        
        # 3. Masking Factor (masking indicates hidden distress)
        if masking.detected:
            masking_score = masking.confidence * 0.8  # Masking is a concerning sign
        else:
            masking_score = 0
        risk_factors["masking"] = masking_score
        
        # 4. Repetition Factor (rumination is concerning)
        repetition_score = 0.6 if repetition_detected else 0
        risk_factors["repetition"] = repetition_score
        
        # 5. Trajectory Factor
        trajectory_score = {
            "improving": 0.0,
            "stable": 0.3,
            "declining": 0.8,
            None: 0.3
        }.get(emotional_shift, 0.3)
        risk_factors["trajectory"] = trajectory_score
        
        # 6. Urgency Factor
        urgency_score = urgency_level
        risk_factors["urgency"] = urgency_score
        
        # Calculate weighted risk
        weighted_risk = sum(
            risk_factors[key] * self.weights[key]
            for key in self.weights
        )
        
        # If AI provided a risk score, blend it in
        if risk_score_from_ai is not None:
            ai_risk_normalized = risk_score_from_ai / 10  # Convert 0-10 to 0-1
            weighted_risk = (weighted_risk * 0.6) + (ai_risk_normalized * 0.4)
        
        # Convert risk (0-1) to wellness (0-100)
        # Invert and scale: low risk = high wellness
        wellness_score = max(0, min(100, (1 - weighted_risk) * 100))
        
        # Calculate confidence based on data quality
        confidence = self._calculate_confidence(
            primary_emotion.intensity,
            bool(secondary_emotions),
            masking.confidence if masking.detected else 0.5,
            emotional_shift is not None
        )
        
        # Determine mood seed stage
        mood_stage = self._get_mood_stage(wellness_score)
        mood_color = self._get_mood_color(wellness_score)
        
        return {
            "wellness_score": round(wellness_score, 1),
            "confidence": round(confidence, 2),
            "risk_factors": risk_factors,
            "mood_seed_stage": mood_stage,
            "mood_color": mood_color,
            "needs_intervention": wellness_score < self.INTERVENTION_THRESHOLD,
            "high_risk": wellness_score < self.HIGH_RISK_THRESHOLD
        }
    
    def _calculate_confidence(
        self,
        intensity: float,
        has_secondary: bool,
        masking_confidence: float,
        has_shift_data: bool
    ) -> float:
        """Calculate confidence in the analysis"""
        # More data points = higher confidence
        base = 0.5
        
        # Higher intensity emotions are easier to detect
        base += intensity * 0.2
        
        # Multiple emotions provide more signal
        if has_secondary:
            base += 0.1
        
        # Masking analysis adds confidence
        base += masking_confidence * 0.1
        
        # Shift detection adds confidence
        if has_shift_data:
            base += 0.1
        
        return min(0.95, base)
    
    def _get_mood_stage(self, wellness_score: float) -> str:
        """Convert wellness score to plant growth metaphor"""
        if wellness_score >= 80:
            return "flourishing"
        elif wellness_score >= 60:
            return "blooming"
        elif wellness_score >= 40:
            return "growing"
        elif wellness_score >= 20:
            return "seedling"
        else:
            return "withered"
    
    def _get_mood_color(self, wellness_score: float) -> str:
        """Get hex color for mood visualization"""
        if wellness_score >= 80:
            return "#4ECDC4"  # Vibrant teal
        elif wellness_score >= 60:
            return "#7EC8A3"  # Fresh green
        elif wellness_score >= 40:
            return "#F7DC6F"  # Warm yellow
        elif wellness_score >= 20:
            return "#E8B87C"  # Soft orange
        else:
            return "#E87C8A"  # Gentle rose (not harsh red)
    
    def get_intervention_priority(self, wellness_score: float) -> int:
        """
        Get intervention priority (1-5, 1 = highest priority)
        """
        if wellness_score < 20:
            return 1
        elif wellness_score < 35:
            return 2
        elif wellness_score < 50:
            return 3
        elif wellness_score < 65:
            return 4
        else:
            return 5
