import { AppError } from '../utils/errors.js';
import { errorResponse } from '../utils/response.js';

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('💥 Error caught by handler:', err);

  if (err instanceof AppError) {
    return errorResponse(res, err.message, err.statusCode, err.code, err.details);
  }

  // Handle raw Postgres constraint errors surfaced by the pg driver / Drizzle
  if (err.code === '23505') {
    return errorResponse(res, 'A unique constraint violation occurred.', 409, 'DUPLICATE_ENTRY');
  }

  if (err.code === '23503') {
    return errorResponse(res, 'This action references a record that does not exist.', 409, 'FOREIGN_KEY_VIOLATION');
  }

  // Generic 500
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return errorResponse(res, message, 500, 'INTERNAL_SERVER_ERROR', err.stack);
}
