'use strict';

const {
  STAGE,
  MYSQL_USER_DEV,
  MYSQL_USER_TEST,
  MYSQL_PORT_DEV,
  MYSQL_PORT_TEST,
  MYSQL_HOST_DEV,
  MYSQL_HOST_TEST,
  MYSQL_DATABASE_DEV,
  MYSQL_DATABASE_TEST
} = process.env;

const db = {
  dev: {
    host: MYSQL_HOST_DEV,
    port: MYSQL_PORT_DEV,
    user: MYSQL_USER_DEV,
    database: MYSQL_DATABASE_DEV
  },
  test: {
    host: MYSQL_HOST_TEST,
    port: MYSQL_PORT_TEST,
    user: MYSQL_USER_TEST,
    database: MYSQL_DATABASE_TEST
  }
};

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
  },
  db: {
    ...db[STAGE]
  }
};

const getConfig = source => {
  return appConfig[source];
};

module.exports = {
  getConfig
};
