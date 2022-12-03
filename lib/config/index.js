'use strict';

const appConfig = {
  jwt: {
    expiresIn: '1h'
  },
  pagination: {
    page: 1,
    limit: 10
  },
  models: {
    rides: {
      count: {
        minimum: 1,
        maximum: 4
      },
      price: {
        minimum: 0,
        maximum: 10000
      }
    },
    users: {
      password: {
        minLength: 6
      }
    }
  }
};

const getConfig = source => {
  return appConfig[source];
};

module.exports = {
  getConfig
};
