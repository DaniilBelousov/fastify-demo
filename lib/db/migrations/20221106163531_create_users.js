/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const { TABLE_USERS } = require('../../constants');

exports.up = function (knex) {
  return knex.schema.hasTable(TABLE_USERS).then(exists => {
    if (!exists) {
      return knex.schema.createTable(TABLE_USERS, table => {
        table.uuid('id', { primaryKey: true });
        table.string('password');
        table.string('email');
        table.string('name');
        table.string('lastName');
        table.string('phoneNumber');
        table.boolean('privacyPolicyAccepted').defaultTo(false);
        table.boolean('termsOfUseAccepted').defaultTo(false);
        table.timestamp('createdAt', { precision: 6 }).defaultTo(knex.fn.now(6));
        table.timestamp('updatedAt', { precision: 6 }).defaultTo(knex.fn.now(6));
      });
    }
  });
};

exports.down = function (knex) {};
