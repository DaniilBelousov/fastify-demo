/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const { TABLE_AUTH_TOKENS, TABLE_USERS } = require('../../constants');

exports.up = function (knex) {
  return knex.schema.hasTable(TABLE_AUTH_TOKENS).then(exists => {
    if (!exists) {
      return knex.schema.createTable(TABLE_AUTH_TOKENS, table => {
        table.uuid('refreshToken').primary();
        table.uuid('userId');
        table.foreign('userId').references('id').inTable(TABLE_USERS);
        table.timestamp('expiredAt', { precision: 6 }).defaultTo(knex.fn.now(6));
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
