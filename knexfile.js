// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const { MYSQL_DATABASE, MYSQL_HOST, MYSQL_PORT, MYSQL_USER } = process.env;
console.log({ MYSQL_DATABASE, MYSQL_HOST, MYSQL_PORT, MYSQL_USER });
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      database: MYSQL_DATABASE,
      user: MYSQL_USER,
      password: '',
      host: MYSQL_HOST,
      port: MYSQL_PORT
    },
    migrations: {
      directory: './lib/db/migrations'
    }
  }
};
