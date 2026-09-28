"""
Pydantic Models/Schemas for API Request/Response
All models are designed for stateless, privacy-first processing
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum


class EmotionType(str, Enum):
    JOY = "joy"
    SADNESS = "sadness"
    ANGER = "anger"
    FEAR = "fear"
    SURPRISE = "surprise"
    DISGUST = "disgust"
    NEUTRAL = "neutral"
    ANXIETY = "anxiety"
    HOPE = "hope"


class InterventionType(str, Enum):
    BREATHING = "breathing"
    GROUNDING = "grounding"
    MEMORY_BOX = "memory_box"
    AFFIRMATION = "affirmation"
    MUSIC = "music"
    JOURNALING = "journaling"


class Emotion(BaseModel):
    """Single emotion with intensity"""
    type: EmotionType
    intensity: float = Field(ge=0, le=1, description="Emotion intensity from 0 to 1")
    
    
class MaskingIndicator(BaseModel):
    """Emotional masking detection result"""
    detected: bool = False
    confidence: float = Field(default=0, ge=0, le=1)
    surface_emotion: Optional[EmotionType] = None
    underlying_emotion: Optional[EmotionType] = None
    indicators: List[str] = []


class Intervention(BaseModel):
    """Recommended self-care intervention"""
    type: InterventionType
    title: str
    description: str
    priority: int = Field(ge=1, le=5, description="1 = highest priority")


class AnalysisRequest(BaseModel):
    """
    Request for sentiment analysis
    Note: Text should be pre-obfuscated on client side
    """
    text: str = Field(
        min_length=1,
        max_length=10000,
        description="Journal entry text (should be obfuscated)"
    )
    session_id: Optional[str] = Field(
        default=None,
        description="Anonymous session ID for trend tracking within session only"
    )


class AnalysisResponse(BaseModel):
    """Full sentiment analysis response"""
    # Wellness Score (inverted risk - higher is better)
    wellness_score: float = Field(ge=0, le=100, description="Overall wellness 0-100")
    confidence: float = Field(ge=0, le=1, description="Analysis confidence")
    
    # Emotional Analysis
    primary_emotion: Emotion
    secondary_emotions: List[Emotion] = []
    emotional_intensity: float = Field(ge=0, le=1)
    
    # Pattern Detection
    masking: MaskingIndicator
    repetition_detected: bool = False
    emotional_shift: Optional[str] = None  # "improving", "declining", "stable"
    
    # Mood Visualization Data
    mood_seed_stage: str = Field(
        description="Plant growth stage: withered, seedling, growing, blooming, flourishing"
    )
    mood_color: str = Field(description="Hex color for mood visualization")
    
    # Interventions
    recommended_interventions: List[Intervention] = []
    supportive_message: str
    
    # Privacy Confirmation
    data_stored: bool = False  # Always False


class QuickCheckRequest(BaseModel):
    """Lightweight request for real-time feedback while typing"""
    text: str = Field(min_length=1, max_length=2000)


class QuickCheckResponse(BaseModel):
    """Lightweight response for real-time feedback"""
    emotional_tone: str  # "positive", "neutral", "concerning"
    intensity: float = Field(ge=0, le=1)
    suggestion: Optional[str] = None


class PersonalityCategory(str, Enum):
    """Categories for AI personalities"""
    GENERAL = "general"
    FAMILY = "family"
    EDUCATION = "education"
    FRIEND = "friend"
    DATING = "dating"
    SPIRITUAL = "spiritual"
    PSYCHOLOGY = "psychology"
    ENTREPRENEUR = "entrepreneur"
    FAMOUS = "famous"
    INDIAN_STARS = "indian_stars"
    PHILOSOPHERS = "philosophers"
    SCIENTISTS = "scientists"
    TOUGH_LOVE = "tough_love"
    CREATIVE = "creative"
    ARCHETYPES = "archetypes"


class ChatMode(str, Enum):
    """AI chat persona modes"""
    # General (existing)
    COMPASSIONATE_FRIEND = "compassionate_friend"
    ACADEMIC_COACH = "academic_coach"
    MINDFULNESS_GUIDE = "mindfulness_guide"
    MOTIVATIONAL_COACH = "motivational_coach"
    
    # Family
    MOTHER = "mother"
    FATHER = "father"
    SISTER = "sister"
    BROTHER = "brother"
    COOL_PARENT = "cool_parent"
    COOL_UNCLE_AUNT = "cool_uncle_aunt"
    GRANDMOTHER = "grandmother"
    GRANDFATHER = "grandfather"
    YOUNGER_SIBLING = "younger_sibling"
    THE_PET = "the_pet"

    # Education
    SCHOOL_TEACHER = "school_teacher"
    UNIVERSITY_PROFESSOR = "university_professor"

    # Friend
    BEST_FRIEND = "best_friend"
    STUDY_PARTNER = "study_partner"
    
    # Dating
    LOVER = "lover"

    # Spiritual
    DALAI_LAMA = "dalai_lama"
    SADGURU = "sadguru"

    # Psychology
    CARL_ROGERS = "carl_rogers"
    SIGMUND_FREUD = "sigmund_freud"
    OPRAH_MENTOR = "oprah_mentor"

    # Entrepreneur
    LOGICAL_MENTOR = "logical_mentor"
    MUKESH_AMBANI = "mukesh_ambani"
    ELON_MENTOR = "elon_mentor"

    # Famous
    BRITTANY_BROSKI = "brittany_broski"
    DELANEY_ROWE = "delaney_rowe"
    ROB_ANDERSON = "rob_anderson"

    # Indian Stars
    ASHISH_CHANCHLANI = "ashish_chanchlani"
    BHUVAN_BAM = "bhuvan_bam"
    SAMEY_RAINA = "samey_raina"
    SHAH_RUKH_KHAN = "shah_rukh_khan"
    ZAKIR_KHAN = "zakir_khan"
    RANVEER_ALLAHBADIA = "ranveer_allahbadia"
    ANKUR_WARIKOO = "ankur_warikoo"

    # Philosophers
    MARCUS_AURELIUS = "marcus_aurelius"
    SOCRATES = "socrates"
    ALAN_WATTS = "alan_watts"
    RUMI = "rumi"

    # Scientists
    ALBERT_EINSTEIN = "albert_einstein"
    APJ_ABDUL_KALAM = "apj_abdul_kalam"
    MARIE_CURIE = "marie_curie"
    STEVE_JOBS = "steve_jobs"

    # Tough Love
    DAVID_GOGGINS = "david_goggins"
    JORDAN_PETERSON = "jordan_peterson"
    STRICT_COACH = "strict_coach"
    GORDON_RAMSAY = "gordon_ramsay"

    # Creative
    THE_POET = "the_poet"
    THE_ARTIST = "the_artist"
    THE_MUSICIAN = "the_musician"
    BOB_ROSS = "bob_ross"

    # Archetypes
    THE_LIBRARIAN = "the_librarian"
    THE_GARDENER = "the_gardener"
    THE_TIME_TRAVELER = "the_time_traveler"
    THE_UNIVERSE = "the_universe"


class WellnessScoreInfo(BaseModel):
    """
    Unified wellness/risk score attached to every chat turn and journal entry.
    Identical contract everywhere so numbers are comparable.
    """
    wellness_score: float = Field(ge=0, le=100, description="0-100, higher is better")
    risk_score: float = Field(ge=0, le=100, description="0-100, higher is worse")
    band: str = Field(description="thriving | steady | strained | at_risk | crisis")
    flagged: bool = Field(description="True when band is at_risk or crisis")
    confidence: float = Field(ge=0, le=1)
    distress_signals: int = 0
    protective_signals: int = 0
    somatic_signals: int = 0
    masking_detected: bool = False
    crisis_detected: bool = False
    crisis_category: str = "none"


class ChatMessage(BaseModel):
    """Single chat message"""
    role: str = Field(description="'user' or 'assistant'")
    content: str


class ChatRequest(BaseModel):
    """Request for chat endpoint"""
    message: str = Field(min_length=1, max_length=5000)
    # Retained for wire compatibility only. The server always answers as the
    # single trauma-informed companion regardless of this value.
    mode: str = "saathi"
    session_id: Optional[str] = None
    history: List[ChatMessage] = []
    model: Optional[str] = None


class ChatResponse(BaseModel):
    """Response from chat endpoint"""
    response: str
    mode: str
    data_stored: bool = False
    fallback_used: bool = False
    fallback_tier: Optional[int] = None  # 1=primary, 2=fallback model, 3=cache, 4=pre-written
    # Which model actually generated the reply (None when a fallback tier was used).
    model_used: Optional[str] = None
    # Language the reply was locked to for this turn, so the frontend can
    # verify the mirror actually held instead of assuming it did.
    reply_language: Optional[str] = None
    # --- added: unified scoring + safety routing ---
    score: Optional[WellnessScoreInfo] = None
    crisis_detected: bool = False
    crisis_response_used: bool = False
    helpline_surfaced: bool = False
    score_synced: bool = False
    persona_notice: Optional[str] = None


class SiaRequest(BaseModel):
    """Request for Sia Navigational Assistant"""
    message: str = Field(min_length=1, max_length=2000)
    context: Optional[str] = Field(default="general", description="Current page or search context")
    history: List[ChatMessage] = []


class SiaResponse(BaseModel):
    """Response from Sia Assistant"""
    response: str
    suggested_action: Optional[str] = None  # e.g., "navigate:knowledge", "open:journal"
    action_payload: Optional[str] = None    # e.g., "sleep-hygiene" (article id)
    data_stored: bool = False
    fallback_used: bool = False


class TranslationRequest(BaseModel):
    """Request for on-demand content translation"""
    text: str = Field(min_length=1)
    target_language: str = Field(description="Target language name or code")


class TranslationResponse(BaseModel):
    """Response from translation engine"""
    translated_text: str
    detected_language: Optional[str] = None
    data_stored: bool = False
    fallback_used: bool = False


# ── Sahayak opt-in sync (score only) ────────────────────────────────────────

class SyncConsentRequest(BaseModel):
    """User explicitly opts in to sharing their SCORE with a Sahayak reviewer."""
    session_id: Optional[str] = None
    opt_in: bool = True


class SyncConsentResponse(BaseModel):
    opted_in: bool
    scope: str = "score_only"
    session_ref: Optional[str] = None
    # Restates the boundary so the UI can display exactly what leaves the device.
    shared_fields: List[str] = [
        "session_ref", "wellness_score", "risk_score", "band",
        "flagged", "crisis_detected", "confidence", "source",
    ]
    never_shared: List[str] = [
        "chat messages", "journal text", "prompts", "names", "incident details",
    ]
    data_stored: bool = False


class SahayakIngestRequest(BaseModel):
    """
    Reviewer-facing ingest payload.

    This model intentionally has NO field capable of carrying conversation or
    journal content. Extra fields are rejected so a future caller cannot
    smuggle transcript text into the reviewer store.
    """
    session_ref: str = Field(max_length=128)
    wellness_score: float = Field(ge=0, le=100)
    risk_score: float = Field(ge=0, le=100)
    band: str
    flagged: bool
    crisis_detected: bool
    confidence: float = Field(ge=0, le=1)
    source: str = "chat"
    client: str = "zenguard-ai"
    schema_version: int = 1

    model_config = {"extra": "forbid"}


class SahayakCase(BaseModel):
    """One reviewable case row in the Sahayak dashboard."""
    id: int
    session_ref: str
    wellness_score: float
    risk_score: float
    band: str
    flagged: bool
    crisis_detected: bool
    source: str
    created_at: float
    status: str = "open"          # open | acknowledged | closed
    reviewer_note: Optional[str] = None


class SahayakCaseList(BaseModel):
    total: int
    open_flagged: int
    cases: List[SahayakCase] = []


class SahayakStatusUpdate(BaseModel):
    status: str = Field(pattern="^(open|acknowledged|closed)$")
    reviewer_note: Optional[str] = Field(default=None, max_length=2000)

