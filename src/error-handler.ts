import type { ErrorRequestHandler } from 'express';
import createHttpError, { HttpError, InternalServerError } from 'http-errors';

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
  return [
    ...errorRequestHandlers,
    function (error, _request, response, next) {
      if (!(error instanceof HttpError) && error instanceof Error) {
        if ('statusCode' in error && typeof error.statusCode === 'number') {
          error = createHttpError(error.statusCode, error.message);
        } else {
          error = new InternalServerError(error.message);
        }
      }

      if (error instanceof HttpError) {
        const responseData: ErrorHandlerResponse = {
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
    },
  ];
};

export interface ErrorHandlerResponse {
  statusCode: number;
  message: string;
  error: string;
}
