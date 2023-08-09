import * as classTransformer from './vendors/class-transformer';
import * as classValidator from './vendors/class-validator';
import * as httpErrors from './vendors/http-errors';

export const vendors = { classTransformer, classValidator, httpErrors };

export * from './error-handler';
export * from './register-controllers';
export * from './wrapper';
export * from './validate';
