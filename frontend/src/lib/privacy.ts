/**
 * Privacy Layer - Client-Side PII Scrubbing
 * All sensitive data is removed BEFORE any network request
 */

// PII detection patterns
const PII_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  // Email addresses
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi, replacement: '[EMAIL]' },
  // Phone numbers (various formats)
  { pattern: /\b(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: '[PHONE]' },
  // Social Security Numbers
  { pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, replacement: '[SSN]' },
  // Credit card numbers
  { pattern: /\b(?:\d{4}[-\s]?){4}\b/g, replacement: '[CARD]' },
  // URLs
  { pattern: /https?:\/\/[^\s]+/gi, replacement: '[URL]' },
  // Dates (various formats)
  { pattern: /\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}[-/]\d{1,2}[-/]\d{1,2})\b/g, replacement: '[DATE]' },
  // Street addresses (basic)
  { pattern: /\b\d+\s+[A-Za-z]+\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln)\b/gi, replacement: '[ADDRESS]' },
];

// Name patterns (contextual)
const NAME_CONTEXTS = [
  /my name is\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/gi,
  /i'm\s+([A-Z][a-z]+)/gi,
  /call me\s+([A-Z][a-z]+)/gi,
  /this is\s+([A-Z][a-z]+)/gi,
  /signed,?\s+([A-Z][a-z]+)/gi,
];

/**
 * Scrub PII from text before sending to server
 */
export function scrubPII(text: string): string {
  let result = text;

  // Apply all PII patterns
  for (const { pattern, replacement } of PII_PATTERNS) {
    result = result.replace(pattern, replacement);
  }

  // Scrub names in context
  for (const contextPattern of NAME_CONTEXTS) {
    result = result.replace(contextPattern, (match, name) => {
      return match.replace(name, '[NAME]');
    });
  }

  return result;
}

/**
 * Check if text contains potential PII
 */
export function detectPII(text: string): { hasPII: boolean; types: string[] } {
  const detectedTypes: string[] = [];

  // Check each pattern
  const patternNames = ['Email', 'Phone', 'SSN', 'Credit Card', 'URL', 'Date', 'Address'];
  
  PII_PATTERNS.forEach((item, index) => {
    if (item.pattern.test(text)) {
      detectedTypes.push(patternNames[index]);
    }
  });

  // Check name contexts
  for (const contextPattern of NAME_CONTEXTS) {
    if (contextPattern.test(text)) {
      if (!detectedTypes.includes('Name')) {
        detectedTypes.push('Name');
      }
      break;
    }
  }

  return {
    hasPII: detectedTypes.length > 0,
    types: detectedTypes,
  };
}

/**
 * Generate anonymous session ID
 * Uses crypto API for true randomness
 */
export function generateSessionId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Privacy-safe wrapper for API calls
 * Automatically scrubs PII before sending
 */
export function prepareText(text: string): { 
  scrubbed: string; 
  piiDetected: boolean; 
  piiTypes: string[] 
} {
  const detection = detectPII(text);
  const scrubbed = scrubPII(text);

  return {
    scrubbed,
    piiDetected: detection.hasPII,
    piiTypes: detection.types,
  };
}
