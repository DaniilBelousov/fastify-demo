'use strict';
const { randomUUID } = require('node:crypto');

module.exports = class UsersService {
  constructor(app) {
    if (!app.ready) throw new Error(`No Fastify set up`);
    this.app = app;
    const { knex } = this.app;
    if (!knex) {
      throw new Error(`No Knex set up!`);
    }
    this.table = 'Users';
  }

  async create(userData) {
    const {
      app: { knex },
      table
    } = this;
    const id = randomUUID();
    await knex(table).insert({ id, ...userData });
  }

  async getList() {
    const {
      app: { knex },
      table
    } = this;
    return knex(table).select('*');
  }
};
