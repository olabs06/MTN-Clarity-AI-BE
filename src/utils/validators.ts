import { ApiError } from './ApiError';

const VALID_LANGUAGES = ['EN', 'PIDGIN', 'HA', 'YO', 'IG'] as const;

export function validateChatMessage(body: Record<string, unknown>): void {
  if (!body.message || typeof body.message !== 'string' || !body.message.trim()) {
    throw ApiError.badRequest('Message is required and must be a non-empty string');
  }

  if (body.language && !VALID_LANGUAGES.includes(body.language as typeof VALID_LANGUAGES[number])) {
    throw ApiError.badRequest(`Invalid language. Must be one of: ${VALID_LANGUAGES.join(', ')}`);
  }
}

export function validatePlanComparison(body: Record<string, unknown>): void {
  if (!body.planIds || !Array.isArray(body.planIds) || body.planIds.length < 2) {
    throw ApiError.badRequest('planIds must be an array with at least 2 plan IDs');
  }

  for (const id of body.planIds) {
    if (typeof id !== 'string') {
      throw ApiError.badRequest('Each planId must be a string');
    }
  }
}

export function validateSavingsCalculation(body: Record<string, unknown>): void {
  if (!body.currentPlanId || typeof body.currentPlanId !== 'string') {
    throw ApiError.badRequest('currentPlanId is required and must be a string');
  }
  if (!body.targetPlanId || typeof body.targetPlanId !== 'string') {
    throw ApiError.badRequest('targetPlanId is required and must be a string');
  }
  if (body.currentPlanId === body.targetPlanId) {
    throw ApiError.badRequest('currentPlanId and targetPlanId must be different');
  }
}

export function validateLoginInput(body: Record<string, unknown>): void {
  if (!body.email || typeof body.email !== 'string') {
    throw ApiError.badRequest('Email or phone number is required');
  }
  if (!body.password || typeof body.password !== 'string') {
    throw ApiError.badRequest('Password is required');
  }
}

export function validateRegisterInput(body: Record<string, unknown>): void {
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
    throw ApiError.badRequest('Name is required and must be at least 2 characters');
  }
  if (!body.email || typeof body.email !== 'string') {
    throw ApiError.badRequest('Email is required');
  }
  if (!body.password || typeof body.password !== 'string' || (body.password as string).length < 6) {
    throw ApiError.badRequest('Password is required and must be at least 6 characters');
  }
  if (body.phoneNumber && typeof body.phoneNumber !== 'string') {
    throw ApiError.badRequest('Phone number must be a string');
  }
}
