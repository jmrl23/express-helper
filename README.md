# Express Helper

Helper functions for building express application

## Features

- [errorHandler](#error-handler)
- [registerControllers](#register-controllers)
- [wrapper](#wrapper)
- [validate](#validate)
- [vendors](#vendors)

## Usage

### error-handler

Add custom error handlers.

- Syntax: `errorHandler(...customErrorHandlers)`

```ts
  const withCustomErrorHandler: ErrorRequestHandler = (...) => {...};
  const withAnotherCustomErrorHandler: ErrorRequestHandler = (...) => {...};

  // should always be placed at the very bottom
  app.use(
    // custom 404 error
    wrapper((request) => {
      throw new BadRequest(`Cannot ${request.method} ${request.path}`);
    }),
    // error handlers
    errorHandler(withCustomErrorHandler, withAnotherCustomErrorHandler)
 );
```

### register-controllers

Automatic register controllers on a selected directory.

- Syntax: `registerControllers(absoluteDirPath, basePath, callback)`

**Rules**:

- Filename should be in `[name].controller.{ts|js}` format
  - example: `foo.controller.ts`
- Nested directory is allowed
- If the file named as `index.controller`, its base path
  will be based on its location
  - example: `src/controllers/foo/bar/index.controller.ts` -> `http://localhost:3001/foo/bar`

```ts
const targetDirectory = path.join(__dirname, './controllers');

app.use(registerControllers(targetDirectory));
```

### wrapper

Used in wrapping request handlers that might throw an error,
also used in making shorter code by just returning the value
itself instead of using the actual response object's method.
It also accepts async callbacks. Returns an array, is some
cases you can spread it.

- Syntax: `wrapper(...requestHandlers)`

```ts
const app = express();

app
  .get(
    '/foo',
    wrapper(middlewareThatMightThrowAnError),
    wrapper(function () {
      ...
      if (condition) throw SomeError(message)
      ...
      return 'Hello, World!';
    }, ...)
  );
```

### validate

Validate request object's `query`, `body`, or `params`.

- Syntax: `validate(target, dtoClass)`
  - target's valid values are `QUERY`, `BODY`, and `PARAMS`

```ts
import { validate, vendors } from '@jmrl23/express-helper';

const { IsString, Length } = vendors.classValidator;

class UserLoginDto {
  @IsString()
  @Length(1, 30)
  readonly username: string;
  @IsString()
  @Length(1)
  readonly password: string;
}

// usage of `express.json` is required in validating the `request.body`
app.use(express.json());

app.post(
  '/user/login',
  // validate `request.body`
  validate('BODY', UserLoginDto),
  wrapper(function (request) {
    const data = request.body;
    // process data
  }),
);
```

### vendors

Use installed package that are already installed to prevent redundancy.

- Available packages
  - [class-transformer](https://www.npmjs.com/package/class-transformer)
  - [class-validator](https://www.npmjs.com/package/class-validator)
  - [http-errors](https://www.npmjs.com/package/http-errors)

```ts
import { vendors } from '@jmrl23/express-helper';

const { BadRequest } = vendors.httpErrors;

// use `BadRequest` from package `http-errors`
throw new BadRequest('LOL');
```
