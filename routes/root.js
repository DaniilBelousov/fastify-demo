'use strict';

module.exports = async function (app, opts) {
  app.get('/', async function (request, reply) {
    return { root: true };
  });
};
