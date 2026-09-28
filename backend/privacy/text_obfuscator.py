"""
Text Obfuscator - Privacy Layer
Server-side text obfuscation for defense in depth

Note: Primary obfuscation should happen client-side.
This is an additional layer of protection.
"""

import re
from typing import List, Tuple


class TextObfuscator:
    """
    Obfuscates potentially identifying information in text
    while preserving emotional content for analysis
    """
    
    def __init__(self):
        # Patterns for PII detection
        self.patterns = [
            # Email addresses
            (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', '[EMAIL]'),
            # Phone numbers (various formats)
            (r'\b(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b', '[PHONE]'),
            # Social Security Numbers
            (r'\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b', '[SSN]'),
            # Dates (various formats)
            (r'\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b', '[DATE]'),
            # Credit card numbers
            (r'\b(?:\d{4}[-\s]?){4}\b', '[CARD]'),
            # URLs
            (r'https?://[^\s]+', '[URL]'),
            # Student IDs (common format)
            (r'\b[A-Z]{2,3}\d{6,8}\b', '[ID]'),
        ]
        
        # Common name patterns (less aggressive to preserve context)
        self.name_indicators = [
            'my name is', "i'm called", 'call me', 'this is',
            'signed', 'from:', 'love,', 'sincerely,'
        ]
        
        # Institutioal names to generalize
        self.institution_patterns = [
            (r'\b[A-Z][a-z]+ (?:University|College|School|Academy|Institute)\b', '[SCHOOL]'),
            (r'\b[A-Z][a-z]+ (?:Hospital|Clinic|Medical Center)\b', '[HOSPITAL]'),
            (r'\b[A-Z][a-z]+ (?:High|Middle|Elementary)\b', '[SCHOOL]'),
        ]
    
    def obfuscate(self, text: str) -> str:
        """
        Obfuscate PII while preserving emotional content
        
        Args:
            text: Input text (may already be client-obfuscated)
            
        Returns:
            Text with remaining PII replaced by tokens
        """
        result = text
        
        # Apply PII patterns
        for pattern, replacement in self.patterns:
            result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
        
        # Apply institution patterns
        for pattern, replacement in self.institution_patterns:
            result = re.sub(pattern, replacement, result)
        
        # Generalize specific numbers (addresses, room numbers)
        result = re.sub(r'\b\d{3,5}\b', '[NUM]', result)
        
        return result
    
    def detect_pii(self, text: str) -> List[Tuple[str, str]]:
        """
        Detect potential PII in text without modifying it
        
        Returns:
            List of (pattern_type, matched_text) tuples
        """
        findings = []
        
        for pattern, pattern_name in self.patterns:
            matches = re.findall(pattern, text, flags=re.IGNORECASE)
            for match in matches:
                findings.append((pattern_name, match))
        
        return findings
    
    def get_privacy_score(self, text: str) -> float:
        """
        Calculate a privacy score (0-1)
        Higher = more PII detected = higher privacy risk
        """
        findings = self.detect_pii(text)
        if not findings:
            return 0.0
        
        # More findings = higher risk
        word_count = len(text.split())
        if word_count == 0:
            return 0.0
        
        # Risk increases with PII density
        pii_density = len(findings) / word_count
        return min(1.0, pii_density * 10)
