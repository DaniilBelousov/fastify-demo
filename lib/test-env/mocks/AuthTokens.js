'use strict';

const { randomUUID } = require('node:crypto');

const getTokenExpirationDate = () => {
  const TOKEN_EXPIRATION_MONTHS = 6;
  const date = new Date();
  date.setMonth(date.getMonth() + TOKEN_EXPIRATION_MONTHS);
  return date.toISOString().slice(0, 19).replace('T', ' ');
};

module.exports = [
  {
    refreshToken: randomUUID(),
    userId: randomUUID(),
    expiredAt: getTokenExpirationDate()
  },
  {
    refreshToken: randomUUID(),
    userId: randomUUID(),
    expiredAt: getTokenExpirationDate()
  },
  {
    refreshToken: randomUUID(),
    userId: randomUUID(),
    expiredAt: getTokenExpirationDate()
  }
];
