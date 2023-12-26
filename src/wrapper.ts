import type { RequestHandler } from 'express';

/**
 * Wrapper
 *
 * Used in wrapping request handlers to handle errors. It also
 * have the functionality to "just return" the value you want
 * instead of using the response's methods.
 *
 * @example
 * ```ts
 * app
 *   .get(
 *     '/foo',
 *     wrapper(middlewareThatMightThrowAnError),
 *     wrapper(function () {
 *       ...
 *       if (condition) throw SomeError(message)
 *       ...
 *       return 'Hello, World!';
 *     }, ...)
 *   );
 * ```
 */

export const wrapper = function wrapper(
  ...requestHandlers: NestedArray<RequestHandler>
): RequestHandler[] {
  const wrappedRequestHandlers: RequestHandler[] = [];

  for (const requestHandler of requestHandlers) {
    if (Array.isArray(requestHandler)) {
      wrappedRequestHandlers.push(...wrapper(...requestHandler));

      continue;
    }

    const wrappedRequestHandler: RequestHandler =
      async function wrappedRequestHandler(request, response, next) {
        try {
          const data = await Promise.resolve(
            requestHandler(request, response, next),
          );
          if (data !== undefined) {
            if (typeof data === 'object') {
              response.json(data);
            } else {
              response.send((data as unknown)?.toString());
            }
            return;
          }
        } catch (error: unknown) {
          if (!response.headersSent) next(error);
        }
      };

    wrappedRequestHandlers.push(wrappedRequestHandler);
  }

  return wrappedRequestHandlers;
};

type NestedArray<T> = Array<T> | Array<NestedArray<T>>;
