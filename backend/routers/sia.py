"""
Sia Router - Smart Navigational Assistant
Handles Sia's proactive and reactive navigational guidance.

FALLBACK: When Ollama is offline, returns hardcoded navigation
suggestions based on keyword matching.
"""

from fastapi import APIRouter, HTTPException
from typing import Optional
import re
import logging

from models.schemas import SiaRequest, SiaResponse, ChatMessage
from services.ollama_client import OllamaClient, OllamaUnavailableError
from services.fallback_responses import get_sia_fallback
from privacy.text_obfuscator import TextObfuscator
from prompts import SIA_SYSTEM_PROMPT

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize services
ollama_client = OllamaClient.get_instance()
text_obfuscator = TextObfuscator()

@router.post("/sia", response_model=SiaResponse)
async def sia_assistant(request: SiaRequest):
    """
    Sia - Your intelligent navigational companion.
    
    Privacy: Ephemeral processing, no data stored.
    FALLBACK: Returns keyword-based navigation suggestions when AI is offline.
    """
    try:
        # Obfuscate for privacy
        obfuscated_message = text_obfuscator.obfuscate(request.message)
        
        # Build conversation context
        conversation = ""
        for msg in request.history:
            role = "User" if msg.role == "user" else "Assistant"
            conversation += f"{role}: {msg.content}\n\n"
        
        conversation += f"User: {obfuscated_message}\n\nAssistant:"
        
        # ── Try live AI ──
        try:
            response_text = await ollama_client.generate(
                prompt=conversation,
                system_prompt=SIA_SYSTEM_PROMPT,
                temperature=0.7,
                max_tokens=300
            )
        except OllamaUnavailableError:
            # ── Fallback: keyword-based navigation ──
            logger.warning("[Sia] AI offline, using fallback")
            fallback_text = get_sia_fallback(request.message)
            
            # Parse potential actions from fallback
            action_match = re.search(r'\[ACTION:\s*([^:\]]+)(?::([^\]]+))?\]', fallback_text)
            suggested_action = None
            action_payload = None
            if action_match:
                suggested_action = action_match.group(1).strip()
                action_payload = action_match.group(2).strip() if action_match.group(2) else None
                fallback_text = re.sub(r'\[ACTION:.*?\]', '', fallback_text).strip()
            
            return SiaResponse(
                response=fallback_text,
                suggested_action=suggested_action,
                action_payload=action_payload,
                data_stored=False,
                fallback_used=True,
            )
        
        # Parse potential actions from the response
        # Using [ACTION: type:payload] format
        action_match = re.search(r'\[ACTION:\s*([^:\]]+)(?::([^\]]+))?\]', response_text)
        
        suggested_action = None
        action_payload = None
        
        if action_match:
            suggested_action = action_match.group(1).strip()
            action_payload = action_match.group(2).strip() if action_match.group(2) else None
            # Clean the tag from the user-facing response
            response_text = re.sub(r'\[ACTION:.*?\]', '', response_text).strip()
            
        return SiaResponse(
            response=response_text,
            suggested_action=suggested_action,
            action_payload=action_payload,
            data_stored=False,
            fallback_used=False,
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sia failed: {str(e)}")
