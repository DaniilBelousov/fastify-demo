/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const { TABLE_RIDES, TABLE_USERS } = require('../../constants');

exports.up = function (knex) {
  return knex.schema.hasTable(TABLE_RIDES).then(exists => {
    if (!exists) {
      return knex.schema.createTable(TABLE_RIDES, table => {
        table.uuid('id').primary();
        table.uuid('userId');
        table.foreign('userId').references('id').inTable(TABLE_USERS);
        table.integer('count');
        table.string('fromAddress');
        table.string('fromLocation');
        table.string('fromRegion');
        table.string('toLocation');
        table.string('toAddress');
        table.string('toRegion');
        table.string('comment');
        table.json('options');
        table.json('payment');
        table.integer('price');
        table.timestamp('date', { precision: 6 });
        table.timestamp('updatedAt', { precision: 6 }).defaultTo(knex.fn.now(6));
        table.timestamp('createdAt', { precision: 6 }).defaultTo(knex.fn.now(6));
      });
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
