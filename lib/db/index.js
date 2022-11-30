'use strict';

const knex = require('knex');

const { MYSQL_DATABASE, MYSQL_USER, MYSQL_PORT, MYSQL_HOST } = process.env;

const TYPE_CASTS = {
  TINY: {
    check: field => field.length == 1,
    convert: field => field.string() == '1'
  },
  JSON: {
    convert: field => JSON.parse(field.string())
  },
  TIMESTAMP: {
    convert: field => {
      const t = field.string().split(/[- :]/);
      const utcDate = Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);
      return new Date(utcDate).toISOString();
    }
  }
};

module.exports.connect = knex({
  client: 'mysql',
  connection: {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    user: MYSQL_USER,
    database: MYSQL_DATABASE,
    typeCast: (field, next) => {
      const cast = TYPE_CASTS[field.type];
      if (cast) {
        const { check, convert } = cast;
        if (check && !check(field)) {
          return next();
        }
        return convert(field);
      }
      return next();
    }
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
