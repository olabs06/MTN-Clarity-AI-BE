import { v4 as uuidv4 } from 'uuid';

type Language = 'EN' | 'PIDGIN' | 'HA' | 'YO' | 'IG';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface SKChatRequest {
  sessionId: string;
  message: string;
  history?: Array<{ role: string; content: string }>;
}

interface FrontendChatResponse {
  id: string;
  role: 'ai';
  text: string;
  timestamp: string;
  suggestions: string[];
  actions: Array<{ type: string; payload: Record<string, unknown> }>;
}

/**
 * Transform a frontend chat request into the format expected by the Semantic Kernel API.
 * Enriches the message with language tags so the SK knows which language to respond in.
 */
export function chatRequestToSK(
  message: string,
  language: Language,
  sessionId: string,
  recentMessages?: ChatMessage[]
): SKChatRequest {
  // Prepend language instruction for the SK model
  const langTag = language !== 'EN' ? `[RESPOND_IN:${language}] ` : '';
  const enrichedMessage = `${langTag}${message}`;

  const history = recentMessages?.map((m) => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.text,
  }));

  return {
    sessionId,
    message: enrichedMessage,
    history,
  };
}

/**
 * Transform a Semantic Kernel response into the shape expected by the frontend.
 */
export function skResponseToFrontend(
  skResponse: { message?: string; text?: string; suggestions?: string[] },
  suggestions: string[] = [],
  actions: Array<{ type: string; payload: Record<string, unknown> }> = []
): FrontendChatResponse {
  return {
    id: uuidv4(),
    role: 'ai',
    text: skResponse.message || skResponse.text || '',
    timestamp: new Date().toISOString(),
    suggestions: skResponse.suggestions || suggestions,
    actions,
  };
}

/**
 * Transform plan data from the catalog/SK format into the shape expected by the frontend.
 * The catalog uses `monthlyPrice` while the frontend expects `monthlyCost`.
 */
export function planCatalogToFrontend(plan: Record<string, unknown>): Record<string, unknown> {
  return {
    id: plan.id,
    name: plan.name,
    category: plan.category,
    monthlyCost: plan.monthlyPrice || plan.monthlyCost,
    dataGB: plan.dataGB,
    callMinutes: plan.callMinutes,
    smsCount: plan.smsCount,
    validityDays: plan.validityDays,
    activationCode: plan.activationCode,
    summary: plan.summary,
    features: plan.features,
    bestFor: plan.bestFor,
    limitations: plan.limitations,
    competitors: plan.competitors,
    upsellTo: plan.upsellTo || null,
    matchScore: plan.matchScore ?? 0,
  };
}
