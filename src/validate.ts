import { type ClassConstructor, plainToInstance } from 'class-transformer';
import { validate as _validate } from 'class-validator';
import { wrapper } from './wrapper';
import { BadRequest, InternalServerError } from 'http-errors';

/**
 * Validate
 *
 * Validate request's params, body, or query base on a DTO class.
 *
 * @example
 * ```ts
 * // Dto class
 * class UserLoginDto {..}
 *
 * app.use(express.json());
 *
 * app.post(
 *   '/user/login',
 *   validate('BODY', UserLoginDto),
 *   wrapper(function (request) {
 *     const data = request.body;
 *     ...
 *   }),
 * );
 *
 * // error handler
 * app.use(errorHandler());
 * ```
 */

export const validate = function validate<T extends object>(
  target: ValidateTarget,
  dtoClass: ClassConstructor<T>,
) {
  const [callback] = wrapper(async function (request, _response, next) {
    const map: Record<ValidateTarget, unknown> = {
      PARAMS: request.params,
      BODY: request.body ?? {},
      QUERY: request.query,
    };
    const targetObject = map[target];
    const instance = plainToInstance(dtoClass, targetObject);
    const [validationError] = await _validate(instance, {
      stopAtFirstError: true,
    });

    if (target === 'BODY' && request.body === undefined) {
      throw new InternalServerError(
        'Cannot parse `request.body`, kindly use `express.json`',
      );
    }

    if (validationError) {
      for (const key in validationError.constraints) {
        const message = validationError.constraints[key];
        throw new BadRequest(message);
      }
    }

    map[target] = instance;
    next();
  });

  return callback;
};

export type ValidateTarget = 'PARAMS' | 'BODY' | 'QUERY';
