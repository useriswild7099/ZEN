"""
Sentiment Analysis API Router
Handles all emotion analysis endpoints

FALLBACK: When Ollama is offline, returns conservative keyword-based
analysis using fallback_responses.get_sentiment_fallback().
"""

from fastapi import APIRouter, HTTPException
from typing import Optional
import logging

from models.schemas import (
    AnalysisRequest,
    AnalysisResponse,
    QuickCheckRequest,
    QuickCheckResponse,
    MaskingIndicator,
    Emotion,
    EmotionType,
    Intervention,
    InterventionType,
)
from services.nlp_engine import NLPEngine
from services.risk_scorer import RiskScorer
from services.intervention_engine import InterventionEngine
from services.ollama_client import OllamaUnavailableError
from services.fallback_responses import get_sentiment_fallback
from privacy.text_obfuscator import TextObfuscator

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize services (singletons)
nlp_engine = NLPEngine()
risk_scorer = RiskScorer()
intervention_engine = InterventionEngine()
text_obfuscator = TextObfuscator()


@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_sentiment(request: AnalysisRequest):
    """
    Full sentiment analysis with interventions
    
    Privacy: No data is stored. Processing is ephemeral.
    OPTIMIZED: Single AI call for faster response
    FALLBACK: Returns keyword-based analysis when Ollama is offline.
    """
    try:
        # Additional server-side obfuscation (defense in depth)
        obfuscated_text = text_obfuscator.obfuscate(request.text)
        
        # ── Try live AI analysis ──
        try:
            sentiment_result = await nlp_engine.analyze_sentiment(
                text=obfuscated_text,
                session_id=request.session_id
            )
        except (OllamaUnavailableError, Exception) as ai_err:
            # ── Fallback: keyword-based sentiment ──
            logger.warning(f"[Sentiment] AI offline, using fallback: {ai_err}")
            return _build_fallback_analysis(request.text)
        
        # Analyze patterns locally (fast, no AI needed)
        repetition_detected, repeated_words = nlp_engine.analyze_repetition(obfuscated_text)
        emotional_shift = nlp_engine.detect_emotional_shift(obfuscated_text)
        
        # Create default masking indicator (skip slow AI analysis)
        masking = MaskingIndicator(detected=False)
        
        # Calculate wellness score
        wellness_result = risk_scorer.calculate_wellness_score(
            primary_emotion=sentiment_result["primary_emotion"],
            secondary_emotions=sentiment_result["secondary_emotions"],
            emotional_tone=sentiment_result["emotional_tone"],
            masking=masking,
            repetition_detected=repetition_detected,
            emotional_shift=emotional_shift,
            urgency_level=sentiment_result["urgency_level"],
            risk_score_from_ai=sentiment_result.get("risk_score")
        )
        
        # Get interventions
        interventions = intervention_engine.get_interventions(
            primary_emotion=sentiment_result["primary_emotion"],
            wellness_score=wellness_result["wellness_score"],
            masking_detected=masking.detected,
            high_intensity=sentiment_result["primary_emotion"].intensity > 0.7
        )
        
        # Get supportive message
        supportive_message = intervention_engine.get_supportive_message(
            primary_emotion=sentiment_result["primary_emotion"],
            masking_detected=masking.detected,
            ai_message=sentiment_result.get("support_message")
        )
        
        return AnalysisResponse(
            wellness_score=wellness_result["wellness_score"],
            confidence=wellness_result["confidence"],
            primary_emotion=sentiment_result["primary_emotion"],
            secondary_emotions=sentiment_result["secondary_emotions"],
            emotional_intensity=sentiment_result["primary_emotion"].intensity,
            masking=masking,
            repetition_detected=repetition_detected,
            emotional_shift=emotional_shift,
            mood_seed_stage=wellness_result["mood_seed_stage"],
            mood_color=wellness_result["mood_color"],
            recommended_interventions=interventions,
            supportive_message=supportive_message,
            data_stored=False  # Privacy guarantee
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


def _build_fallback_analysis(text: str) -> AnalysisResponse:
    """
    Build a conservative AnalysisResponse using keyword-based sentiment
    detection when the AI engine is completely offline.
    """
    fb = get_sentiment_fallback(text)
    
    # Map string emotion to EmotionType enum
    emotion_str = fb.get("primary_emotion", "neutral")
    try:
        emotion_type = EmotionType(emotion_str)
    except ValueError:
        emotion_type = EmotionType.NEUTRAL
    
    primary = Emotion(type=emotion_type, intensity=fb.get("primary_intensity", 0.3))
    
    # Conservative wellness score based on emotion
    negative_emotions = {EmotionType.SADNESS, EmotionType.ANGER, EmotionType.FEAR, EmotionType.ANXIETY}
    if emotion_type in negative_emotions:
        wellness_score = max(30.0, 60.0 - (primary.intensity * 40))
        mood_stage = "seedling"
        mood_color = "#6B7280"  # Gray
    elif emotion_type in {EmotionType.JOY, EmotionType.HOPE}:
        wellness_score = min(90.0, 60.0 + (primary.intensity * 30))
        mood_stage = "blooming"
        mood_color = "#10B981"  # Green
    else:
        wellness_score = 55.0
        mood_stage = "growing"
        mood_color = "#8B5CF6"  # Purple
    
    # Basic intervention for negative states
    interventions = []
    if emotion_type in negative_emotions:
        interventions.append(Intervention(
            type=InterventionType.BREATHING,
            title="Deep Breathing Exercise",
            description="Take 4 slow breaths: inhale for 4 counts, hold for 4, exhale for 6.",
            priority=1
        ))
    
    return AnalysisResponse(
        wellness_score=wellness_score,
        confidence=0.4,  # Lower confidence for fallback
        primary_emotion=primary,
        secondary_emotions=[],
        emotional_intensity=primary.intensity,
        masking=MaskingIndicator(detected=False),
        repetition_detected=False,
        emotional_shift=None,
        mood_seed_stage=mood_stage,
        mood_color=mood_color,
        recommended_interventions=interventions,
        supportive_message=fb.get("support_message", "I'm here for you. Take a moment to breathe."),
        data_stored=False,
    )


@router.post("/quick-check", response_model=QuickCheckResponse)
async def quick_check(request: QuickCheckRequest):
    """
    Lightweight real-time feedback while typing
    Uses simpler analysis for faster response
    """
    try:
        text = request.text
        
        # Quick sentiment indicators
        positive_words = {
            'happy', 'good', 'great', 'better', 'love', 'wonderful',
            'amazing', 'excited', 'hopeful', 'grateful', 'thankful',
            'peaceful', 'calm', 'relaxed', 'confident'
        }
        negative_words = {
            'sad', 'bad', 'worse', 'hate', 'terrible', 'awful',
            'anxious', 'worried', 'scared', 'angry', 'frustrated',
            'lonely', 'tired', 'exhausted', 'stressed', 'overwhelmed'
        }
        
        words = text.lower().split()
        pos_count = sum(1 for w in words if w in positive_words)
        neg_count = sum(1 for w in words if w in negative_words)
        
        total = pos_count + neg_count
        if total == 0:
            tone = "neutral"
            intensity = 0.3
        elif pos_count > neg_count:
            tone = "positive"
            intensity = min(1.0, pos_count / max(1, len(words)) * 5)
        else:
            tone = "concerning"
            intensity = min(1.0, neg_count / max(1, len(words)) * 5)
        
        # Generate suggestion for concerning tone
        suggestion = None
        if tone == "concerning" and intensity > 0.5:
            suggestion = "Take a deep breath. It's okay to feel this way."
        
        return QuickCheckResponse(
            emotional_tone=tone,
            intensity=intensity,
            suggestion=suggestion
        )
        
    except Exception:
        return QuickCheckResponse(
            emotional_tone="neutral",
            intensity=0.3,
            suggestion=None
        )


@router.get("/session/{session_id}/trends")
async def get_session_trends(session_id: str):
    """
    Get emotional trends for the current session
    Uses the full 128K context window for pattern detection
    FALLBACK: Returns stable defaults when AI is offline.
    """
    try:
        try:
            trends = await nlp_engine.analyze_session_trends(session_id)
        except (OllamaUnavailableError, Exception):
            logger.warning("[Trends] AI offline, returning defaults")
            trends = {
                "session_trend": "stable",
                "trend_confidence": 0.3,
                "recurring_themes": [],
                "risk_trajectory": "stable",
                "overall_risk_score": 3,
                "session_insight": "Trend analysis is temporarily unavailable. The AI engine is offline.",
                "recommended_intervention": "Try some deep breathing or journaling while the AI engine reconnects.",
            }
        
        if "error" in trends:
            return {"message": trends["error"], "data": None}
        
        return {
            "session_trend": trends.get("session_trend", "stable"),
            "trend_confidence": trends.get("trend_confidence", 0.5),
            "recurring_themes": trends.get("recurring_themes", []),
            "risk_trajectory": trends.get("risk_trajectory", "stable"),
            "overall_risk_score": trends.get("overall_risk_score", 3),
            "session_insight": trends.get("session_insight", ""),
            "recommended_intervention": trends.get("recommended_intervention", ""),
            "data_stored": False
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trend analysis failed: {str(e)}")


@router.delete("/session/{session_id}")
async def clear_session(session_id: str):
    """
    Clear session context (for user privacy control)
    """
    nlp_engine.clear_session(session_id)
    return {"message": "Session cleared successfully", "session_id": session_id}
