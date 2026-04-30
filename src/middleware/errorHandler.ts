import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[Error] ${err.name}: ${err.message}`);
  
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err,
      },
    });
    return;
  }

  // Handle Mongoose cast errors (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    res.status(400).json({
      error: {
        code: 'INVALID_ID',
        message: 'Invalid resource identifier format',
      },
    });
    return;
  }

  // Handle Mongoose duplicate key errors
  if ((err as any).code === 11000) {
    res.status(409).json({
      error: {
        code: 'DUPLICATE_RESOURCE',
        message: 'Resource already exists',
      },
    });
    return;
  }

  // Fallback for unexpected errors
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred on the server',
    },
  });
};
