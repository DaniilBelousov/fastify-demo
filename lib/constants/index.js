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

// Error messages
const MESSAGE_SYSTEM_ERROR = 'Server error. Please try again later.';
const MESSAGE_BAD_REQUEST = 'Bad request';
const MESSAGE_UNAUTHORIZED = 'User not authorized';
const MESSAGE_FORBIDDEN = 'Request forbidden';
const MESSAGE_NOT_FOUND = 'Not found';

// Errors
const ERROR_SYSTEM_ERROR = 'SystemError';
const ERROR_BAD_REQUEST = 'BadRequest';
const ERROR_UNAUTHORIZED = 'Unauthorized';
const ERROR_FORBIDDEN = 'Forbidden';
const ERROR_NOT_FOUND = 'NotFound';

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
  MESSAGE_SYSTEM_ERROR,
  MESSAGE_BAD_REQUEST,
  MESSAGE_UNAUTHORIZED,
  MESSAGE_FORBIDDEN,
  MESSAGE_NOT_FOUND,
  ERROR_SYSTEM_ERROR,
  ERROR_BAD_REQUEST,
  ERROR_UNAUTHORIZED,
  ERROR_FORBIDDEN,
  ERROR_NOT_FOUND
};
