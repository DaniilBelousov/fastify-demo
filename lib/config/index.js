'use strict';

const appConfig = {
  jwt: {
    expiresIn: '1h'
  }
};

const getConfig = source => {
  return appConfig[source];
};

module.exports = {
  getConfig
};
