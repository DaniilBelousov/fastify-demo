'use strict';

const TABLE_AUTH_TOKENS = 'AuthTokens';
const TABLE_USERS = 'Users';
const TABLE_RIDES = 'Rides';

const WHITE_LIST = ['/sign-up', '/sign-in', '/refresh'];

// Error codes
const CODE_SYSTEM_ERROR = 'system-error';
const CODE_BAD_REQUEST = 'bad-request';
const CODE_UNAUTHORIZED = 'unauthorized';
const CODE_FORBIDDEN = 'forbidden';
const CODE_NOT_FOUND = 'not-found';
const CODE_INVALID_EMAIL = 'invalid-email';
const CODE_INVALID_PASSWORD = 'invalid-password';
const CODE_VALIDATION_ERROR = 'validation-error';

// Error messages
const MESSAGE_SYSTEM_ERROR = 'Server error. Please try again later.';
const MESSAGE_BAD_REQUEST = 'Bad request';
const MESSAGE_VALIDAtiON_ERROR = 'Validation error';
const MESSAGE_UNAUTHORIZED = 'User not authorized';
const MESSAGE_FORBIDDEN = 'Request forbidden';
const MESSAGE_NOT_FOUND = 'Not found';
const MESSAGE_ALREADY_EXISTS = 'User already exists';
const MESSAGE_USER_NOT_FOUND = 'User not found';
const MESSAGE_INCORRECT_PASSWORD = 'Incorrect password';
const MESSAGE_REFRESH_TOKEN_EXPIRED = 'Refresh token has been expired';

// Ajv error messages
const MESSAGE_INVALID_EMAIL = 'Invalid email';
const MESSAGE_INVALID_PASSWORD = 'Invalid password';

// Errors
const ERROR_SYSTEM_ERROR = 'SystemError';
const ERROR_BAD_REQUEST = 'BadRequest';
const ERROR_UNAUTHORIZED = 'Unauthorized';
const ERROR_FORBIDDEN = 'Forbidden';
const ERROR_NOT_FOUND = 'NotFound';
const ERROR_VALIDATION = 'ValidationError';

module.exports = {
  TABLE_AUTH_TOKENS,
  TABLE_USERS,
  WHITE_LIST,
  TABLE_RIDES,
  CODE_SYSTEM_ERROR,
  CODE_BAD_REQUEST,
  CODE_UNAUTHORIZED,
  CODE_FORBIDDEN,
  CODE_NOT_FOUND,
  CODE_INVALID_EMAIL,
  CODE_INVALID_PASSWORD,
  CODE_VALIDATION_ERROR,
  MESSAGE_SYSTEM_ERROR,
  MESSAGE_BAD_REQUEST,
  MESSAGE_UNAUTHORIZED,
  MESSAGE_FORBIDDEN,
  MESSAGE_NOT_FOUND,
  MESSAGE_VALIDAtiON_ERROR,
  MESSAGE_ALREADY_EXISTS,
  MESSAGE_USER_NOT_FOUND,
  MESSAGE_INCORRECT_PASSWORD,
  MESSAGE_REFRESH_TOKEN_EXPIRED,
  MESSAGE_INVALID_EMAIL,
  MESSAGE_INVALID_PASSWORD,
  ERROR_SYSTEM_ERROR,
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_FORBIDDEN,
  ERROR_VALIDATION,
  ERROR_NOT_FOUND
};
