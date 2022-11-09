'use strict';

const fp = require('fastify-plugin');
const { connect } = require('../lib/db');

const connector = async app => {
  const db = connect();
  app.decorate('knex', db);
};

module.exports = fp(connector);
