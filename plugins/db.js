'use strict';

const fp = require('fastify-plugin');
const { connect } = require('../lib/db');
const { Users, AuthTokens, Rides } = require('../lib/db/models');

const connector = async app => {
  const knex = connect;
  const models = {
    Users: new Users(knex),
    AuthTokens: new AuthTokens(knex),
    Rides: new Rides(knex)
  };
  app.decorate('knex', knex);
  app.decorate('models', models);
};

module.exports = fp(connector);
