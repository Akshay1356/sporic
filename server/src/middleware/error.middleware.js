import { AppError } from '../utils/errors.js';
import { errorResponse } from '../utils/response.js';

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('💥 Error caught by handler:', err);

  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode, err.code, err.details);
  }

  // Handle Prisma Known Request Errors
  if (err.code === 'P2002') {
    const target = err.meta?.target ? ` (${err.meta.target})` : '';
    return errorResponse(res, `A unique constraint violation occurred${target}.`, 409, 'DUPLICATE_ENTRY');
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 'The requested record could not be found.', 404, 'RECORD_NOT_FOUND');
  }

  // Generic 500
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return errorResponse(res, message, 500, 'INTERNAL_SERVER_ERROR', err.stack);
}
