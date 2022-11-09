'use strict';

const knex = require('knex');

const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PORT, MYSQL_HOST } = process.env;

module.exports.connect = knex({
  client: 'mysql',
  connection: {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    database: MYSQL_DATABASE
  },
  log: {
    warn(message) {
      console.log(message);
    },
    error(message) {
      console.log(message);
    },
    deprecate(message) {
      console.log(message);
    },
    debug(message) {
      console.log(message);
    }
  }
});
