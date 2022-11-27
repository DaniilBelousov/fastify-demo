'use strict';

module.exports = class CommonService {
  constructor(app, model) {
    if (!app.ready) throw new Error(`No Fastify set up`);
    this.app = app;
    const { knex } = this.app;
    if (!knex) {
      throw new Error(`No Knex set up!`);
    }
    this.knex = knex;
  }
};
