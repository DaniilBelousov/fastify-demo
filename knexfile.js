// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const { getConfig } = require('./lib/config');

const { database, user, host, port, password, ssl } = getConfig('db');

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      database,
      user,
      password,
      host,
      port,
      ssl
    },
    migrations: {
      directory: './lib/db/migrations'
    }
  }
};
