// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const { getConfig } = require('./lib/config');

const { database, user, host, port } = getConfig('db');

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database,
      user,
      password: '',
      host,
      port
    },
    migrations: {
      directory: './lib/db/migrations'
    }
  }
};
