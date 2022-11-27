'use strict';

const fp = require('fastify-plugin');

const { JWT_SECRET } = process.env;

module.exports = fp(async function (app, opts) {
  app.register(require('@fastify/jwt'), {
    secret: JWT_SECRET,
    cookie: {
      cookieName: 'token',
      signed: false
    }
  });
});
