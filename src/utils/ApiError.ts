export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: Record<string, unknown>;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(400, 'VALIDATION_ERROR', message, details);
  }

  static unauthorized(message = 'Authentication required'): ApiError {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static tokenExpired(): ApiError {
    return new ApiError(401, 'TOKEN_EXPIRED', 'Access token has expired');
  }

  static forbidden(message = 'Access denied'): ApiError {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(resource = 'Resource'): ApiError {
    return new ApiError(404, 'NOT_FOUND', `${resource} not found`);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, 'CONFLICT', message);
  }

  static tooManyRequests(): ApiError {
    return new ApiError(429, 'RATE_LIMIT_EXCEEDED', 'Too many requests, please try again later');
  }

  static internal(message = 'An unexpected error occurred'): ApiError {
    return new ApiError(500, 'INTERNAL_ERROR', message);
  }
}
