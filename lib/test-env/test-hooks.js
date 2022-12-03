'use strict';

const { TABLE_USERS, TABLE_RIDES, TABLE_AUTH_TOKENS } = require('../../lib/constants');

const { STAGE } = process.env;

const onTestEnd = async ({ knex }) => {
  if (STAGE === 'test') {
    await knex(TABLE_RIDES).del();
    await knex(TABLE_AUTH_TOKENS).del();
    await knex(TABLE_USERS).del();
    await knex.destroy();
  }
};

module.exports = { onTestEnd };
