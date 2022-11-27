'use strict';

const { randomUUID } = require('node:crypto');

module.exports = class CommonModel {
  constructor(knex, table) {
    if (!knex) {
      throw new Error(`No Knex set up!`);
    }
    if (!table) {
      throw new Error('No table set up!');
    }
    this.knex = knex;
    this.table = table;
  }

  async create(data) {
    const model = this.knex(this.table);
    const id = randomUUID();
    await model.insert({ ...data, id });
    return id;
  }

  async findOne(id) {
    const model = this.knex(this.table);
    return model.where({ id }).first();
  }

  async knexQuery() {
    return this.knex(this.table);
  }

  async remove(id) {
    const model = this.knex(this.table);
    return model.where({ id }).del();
  }
};
