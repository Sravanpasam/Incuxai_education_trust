/**
 * Centralized error handling middleware.
 * Catches all unhandled errors and returns a consistent JSON error response.
 */
export function errorHandler(err, req, res, _next) {
  console.error('[ErrorHandler]', err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
}

/**
 * Helper: create an Error with a custom HTTP status code.
 */
export function createError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}
