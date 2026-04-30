import { chatRequestToSK, skResponseToFrontend } from '../utils/transformers';
import { getAiResponse as mockChatResponse } from './chatService';

// The base URL of the Semantic Kernel C#/.NET API
const SK_API_URL = process.env.SK_API_URL || 'http://localhost:5050';

/**
 * Checks if the Semantic Kernel API is reachable
 */
async function isSKAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    // We expect a /health or similar endpoint on the SK side
    const response = await fetch(`${SK_API_URL}/health`, { 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Sends a message to the AI.
 * First tries the real SK API. If it fails or is unavailable, falls back to the mock.
 */
export async function chat(
  sessionId: string,
  message: string,
  language: 'EN' | 'PIDGIN' | 'HA' | 'YO' | 'IG',
  context: Record<string, unknown>
): Promise<any> {
  
  const skAvailable = await isSKAvailable();

  if (skAvailable) {
    try {
      const skPayload = chatRequestToSK(message, language, sessionId, context.recentMessages as any[]);
      
      const response = await fetch(`${SK_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skPayload)
      });

      if (!response.ok) {
        throw new Error(`SK API returned ${response.status}`);
      }

      const skData = await response.json();
      return skResponseToFrontend(skData as any);
      
    } catch (error) {
      console.warn('SK API request failed, falling back to mock:', error);
      // Fall through to mock
    }
  } else {
    console.log('SK API unavailable, using mock chat service');
  }

  // --- Fallback Mock Implementation ---
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockResp = mockChatResponse(message, language);
  
  return skResponseToFrontend(
    { text: mockResp.text }, 
    mockResp.suggestions,
    // Add mock action payload if we detect a plan intent
    message.toLowerCase().includes('switch') ? [{ type: 'plan_change', payload: { planId: 'pulse-plus' } }] : []
  );
}
