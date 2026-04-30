import rateLimit from 'express-rate-limit';

// Global API rate limiter: 60 requests per minute per IP
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per `window` (here, per minute)
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Stricter rate limiter for auth endpoints: 5 requests per minute per IP
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many authentication attempts, please try again later.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat endpoint limiter: 30 requests per minute per IP
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many chat requests, please slow down.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
