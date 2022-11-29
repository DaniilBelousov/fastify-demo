'use strict';

const appConfig = {
  jwt: {
    expiresIn: '1h'
  },
  pagination: {
    page: 1,
    limit: 10
  }
};

const getConfig = source => {
  return appConfig[source];
};

module.exports = {
  getConfig
};
