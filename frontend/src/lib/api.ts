/**
 * API Client for ZenGuard Backend
 * Handles all communication with the sentiment analysis API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export interface Emotion {
  type: string;
  intensity: number;
}

export interface MaskingIndicator {
  detected: boolean;
  confidence: number;
  surface_emotion?: string;
  underlying_emotion?: string;
  indicators: string[];
}

export interface Intervention {
  type: string;
  title: string;
  description: string;
  priority: number;
}

export interface AnalysisResponse {
  wellness_score: number;
  confidence: number;
  primary_emotion: Emotion;
  secondary_emotions: Emotion[];
  emotional_intensity: number;
  masking: MaskingIndicator;
  repetition_detected: boolean;
  emotional_shift: string | null;
  mood_seed_stage: string;
  mood_color: string;
  recommended_interventions: Intervention[];
  supportive_message: string;
  data_stored: boolean;
}

export interface QuickCheckResponse {
  emotional_tone: string;
  intensity: number;
  suggestion: string | null;
}

export interface SessionTrendsResponse {
  session_trend: string;
  trend_confidence: number;
  recurring_themes: string[];
  risk_trajectory: string;
  overall_risk_score: number;
  session_insight: string;
  recommended_intervention: string;
}

/** Helper to fetch with timeout */
async function fetchWithTimeout(resource: URL | string | Request, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 30000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  
  clearTimeout(id);
  return response;
}

class SentimentClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Check if the API is available
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Shorter timeout for health check
      const response = await fetchWithTimeout(`${this.baseUrl}/health`, { timeout: 10000 });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Perform full sentiment analysis on journal entry
   */
  async analyzeEntry(
    text: string,
    sessionId?: string
  ): Promise<AnalysisResponse> {
    const response = await fetchWithTimeout(`${this.baseUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        session_id: sessionId,
      }),
      timeout: 60000 // 60s timeout for heavy AI work
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Quick check for real-time feedback while typing
   */
  async quickCheck(text: string): Promise<QuickCheckResponse> {
    const response = await fetchWithTimeout(`${this.baseUrl}/api/quick-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
      timeout: 15000 // 15s timeout
    });

    if (!response.ok) {
      throw new Error(`Quick check failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get session trends analysis
   */
  async getSessionTrends(sessionId: string): Promise<SessionTrendsResponse> {
    const response = await fetchWithTimeout(
      `${this.baseUrl}/api/session/${sessionId}/trends`,
      { timeout: 30000 }
    );

    if (!response.ok) {
      throw new Error(`Trend analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Clear session data
   */
  async clearSession(sessionId: string): Promise<void> {
    await fetchWithTimeout(`${this.baseUrl}/api/session/${sessionId}`, {
      method: 'DELETE',
      timeout: 10000
    });
  }

  // --- JOURNAL VAULT API ---

  async checkVaultStatus(): Promise<boolean> {
    try {
      const response = await fetchWithTimeout(`${this.baseUrl}/api/journal/vault_status`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.is_initialized === true;
    } catch {
      return false;
    }
  }

  async setupVault(password: string): Promise<boolean> {
    const response = await fetchWithTimeout(`${this.baseUrl}/api/journal/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return response.ok;
  }

  async unlockVault(password: string): Promise<boolean> {
    const response = await fetchWithTimeout(`${this.baseUrl}/api/journal/unlock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    
    if (!response.ok) {
      try {
        const data = await response.json();
        throw new Error(data.detail || 'Incorrect password.');
      } catch (e: any) {
        throw new Error(e.message || 'Incorrect password.');
      }
    }
    return true;
  }

  async getJournalEntries(password: string): Promise<any[]> {
    const response = await fetchWithTimeout(`${this.baseUrl}/api/journal/entries/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (!response.ok) return [];
    const data = await response.json();
    // Rehydrate string dates back to Date objects
    return data.entries.map((e: any) => ({
      ...e,
      date: new Date(e.date)
    }));
  }

  async saveJournalEntry(password: string, entry: any): Promise<boolean> {
    const response = await fetchWithTimeout(`${this.baseUrl}/api/journal/entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Send date as string for JSON serialization
      body: JSON.stringify({ password, entry: { ...entry, date: entry.date.toISOString() } })
    });
    return response.ok;
  }
}

// Export singleton instance
export const sentimentClient = new SentimentClient();

// ============ CHAT API ============

export interface ChatMode {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category?: string;
  color?: string;
  image?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  response: string;
  mode: string;
  data_stored: boolean;
  /** True when response came from cache or pre-written fallback (AI offline) */
  fallback_used?: boolean;
  /** 1=primary model, 2=fallback model, 3=cache, 4=pre-written */
  fallback_tier?: number | null;
}

class ChatClient {
  private baseUrl: string;
  private modesCache: ChatMode[] | null = null;
  private modesCacheTime: number = 0;
  private readonly CACHE_TTL = 1000 * 60 * 60; // 1 hour

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Get available chat modes with robust offline fallback and 0ms TTFB caching
   */
  async getModes(): Promise<ChatMode[]> {
    // Return from cache if fresh (drastically reduces TTFB and layout shift)
    if (this.modesCache && Date.now() - this.modesCacheTime < this.CACHE_TTL) {
      return this.modesCache;
    }

    try {
      // Try local/cloud Next.js route or backend
      const endpoint = typeof window !== 'undefined' && !window.location.hostname.includes('127.0.0.1') && !window.location.hostname.includes('localhost')
        ? '/api/modes'
        : `${this.baseUrl}/api/modes`;
        
      const response = await fetchWithTimeout(endpoint, { timeout: 4000 });
      if (response.ok) {
        const data = await response.json();
        if (data.modes && data.modes.length > 0) {
          this.modesCache = data.modes;
          this.modesCacheTime = Date.now();
          return data.modes;
        }
      }
    } catch {
      // Backend or network offline — fallback smoothly to complete embedded list
    }

    // Comprehensive fallback for Vercel / offline operation
    const { ALL_CHAT_MODES } = await import('@/lib/constants/modes');
    this.modesCache = ALL_CHAT_MODES;
    this.modesCacheTime = Date.now();
    return ALL_CHAT_MODES;
  }

  /**
   * Get available installed Ollama models
   */
  async getModels(): Promise<{ models: string[]; active?: string }> {
    const { DEFAULT_AI_MODELS } = await import('@/lib/constants/modes');
    try {
      const endpoint = typeof window !== 'undefined' && !window.location.hostname.includes('127.0.0.1') && !window.location.hostname.includes('localhost')
        ? '/api/models'
        : `${this.baseUrl}/api/models`;
      const response = await fetchWithTimeout(endpoint, { timeout: 4000 });
      if (response.ok) {
        const data = await response.json();
        if (data.models && data.models.length > 0) {
          return data;
        }
      }
    } catch {
      // Return default model suite on Vercel / offline
    }
    return { models: DEFAULT_AI_MODELS, active: DEFAULT_AI_MODELS[0] };
  }

  /**
   * Send a chat message
   */
  async sendMessage(
    message: string,
    mode: string,
    history: ChatMessage[],
    model?: string
  ): Promise<ChatResponse> {
    const response = await fetchWithTimeout(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        mode,
        history,
        model,
      }),
      timeout: 60000 // 60s timeout for AI response
    });

    if (!response.ok) {
      throw new Error(`Chat failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Clear chat (client-side confirmation)
   */
  async clearChat(): Promise<void> {
    await fetchWithTimeout(`${this.baseUrl}/api/chat/clear`, {
      method: 'DELETE',
      timeout: 10000
    });
  }
}

// Export singleton instance
export const chatClient = new ChatClient();

