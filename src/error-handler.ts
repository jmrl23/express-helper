import type { ErrorRequestHandler } from 'express';
import { HttpError, InternalServerError } from 'http-errors';

/**
 * Error handler
 *
 * Use custom error handler.
 *
 * @example
 * ```ts
 * const withCustomErrorHandler: ErrorRequestHandler = (...) => {...};
 * const withAnotherCustomErrorHandler: ErrorRequestHandler = (...) => {...};
 *
 * // should always be placed at the very bottom
 * app.use(
 *   // custom 404 error
 *   wrapper((request) => {
 *     throw new BadRequest(`Cannot ${request.method} ${request.path}`);
 *   }),
 *   // error handlers
 *   errorHandler(
 *     withCustomErrorHandler,
 *     withAnotherCustomErrorHandler
 *   )
 * );
 * ```
 */

export const errorHandler = function errorHandler(
  ...errorRequestHandlers: ErrorRequestHandler[]
): ErrorRequestHandler[] {
  return [...errorRequestHandlers, finalErrorHandler];
};

const finalErrorHandler: ErrorRequestHandler = function (
  error,
  _request,
  response,
  next,
) {
  if (!(error instanceof HttpError) && error instanceof Error) {
    error = new InternalServerError(error.message);
  }

  if (error instanceof HttpError) {
    const responseData = {
      statusCode: error.statusCode,
      message: error.message,
      error: error.constructor.name,
    };

    if (error.statusCode > 499) {
      console.error(error.stack ?? error);
    }

    return response.status(error.statusCode).json(responseData);
  }

  next(error);
};
