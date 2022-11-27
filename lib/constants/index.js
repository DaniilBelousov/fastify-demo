'use strict';

const TABLE_AUTH_TOKENS = 'AuthTokens';
const TABLE_USERS = 'Users';
const TABLE_RIDES = 'Rides';

const WHITE_LIST = ['/sign-up', '/sign-in', '/refresh'];

module.exports = {
  TABLE_AUTH_TOKENS,
  TABLE_USERS,
  WHITE_LIST,
  TABLE_RIDES
};
