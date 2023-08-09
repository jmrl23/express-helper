import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { Router } from 'express';

/**
 * Register controllers
 *
 * Automatic register controllers on a selected directory.
 *
 * Rules:
 *  - Filename should be in `[name].controller.{ts|js}` format
 *    - example: `foo.controller.ts`
 *  - Nested directory is allowed
 *  - If the file named as `index.controller`, its base path
 *    will be based on its location
 *    - example: `src/controller/foo/bar/index.controller.ts` -> `http://localhost:3001/foo/bar`
 *
 * @example
 * ```ts
 * const targetDirectory = path.join(__dirname, './controllers');
 *
 * app.use(registerControllers(targetDirectory));
 * ```
 */

export const registerControllers = function registerControllers(
  dir: string,
  basePath = '/',
  callback: RegisterControllersCallback = () => {},
): Router {
  if (!statSync(dir).isDirectory()) {
    throw new Error(`Invalid directory ${dir}`);
  }

  if (basePath === '/') {
    basePath = '';
  }

  const mainController = Router();
  const files = scanFilesFromDirectory(dir);
  const controllerIdentifierPattern = /\.controller\.(ts|js)$/gi;
  const filteredFiles = files.filter((file) =>
    file.match(controllerIdentifierPattern),
  );
  const registeredControllers: RegisteredController[] = [];

  for (const file of filteredFiles) {
    const controllerName = getControllerName(
      basePath,
      dir,
      controllerIdentifierPattern,
      file,
    );
    const _module = require(file);
    const controller = _module?.controller ?? {};

    if (Object.getPrototypeOf(controller).toString() !== Router.toString())
      continue;

    registeredControllers.push({ filePath: file, controller: controllerName });
    mainController.use(controllerName, controller);
  }

  callback(registeredControllers);

  return mainController;
};

function scanFilesFromDirectory(dir: string) {
  const files: string[] = [];

  for (const file of readdirSync(dir)) {
    const filePath = join(dir, file);

    if (statSync(filePath).isDirectory()) {
      files.push(...scanFilesFromDirectory(filePath));

      continue;
    }

    files.push(filePath);
  }

  return files;
}

function getControllerName(
  basePath: string,
  directory: string,
  identifierPattern: RegExp,
  filePath: string,
) {
  const controllerName =
    basePath +
    filePath
      .replace(directory, '')
      .replace(identifierPattern, '')
      .replace(/\\/g, '/')
      .replace(/\/index$/i, '/');

  if (controllerName !== '/') {
    return controllerName.replace(/\/$/g, '');
  }

  return controllerName;
}

export type RegisteredController = {
  filePath: string;
  controller: string;
};
export type RegisterControllersCallback = (
  registeredControllers: RegisteredController[],
) => void;
