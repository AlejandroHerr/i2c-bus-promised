// @flow

/**
 * Class representing an error ocurred inside the Bus.
 *
 * @extends {Error}
 */
export default class BusError extends Error {
  code: string;
  causeError: ?Error;

  constructor(message: string, code: string, causeError: ?Error = null) {
    super(message);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = 'BusError';

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    this.code = code;
    this.causeError = causeError;
  }
}
