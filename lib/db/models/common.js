'use strict';

const { randomUUID } = require('node:crypto');

module.exports = class CommonModel {
  #QUERIES = {
    select: (knex, query) => knex.select(query),
    where: (knex, query) => knex.where(query),
    orderBy: (knex, query) => {
      console.log(query);
      console.log(Array.isArray(query) && typeof query[0] === 'string');
      if (Array.isArray(query) && typeof query[0] === 'string') {
        return knex.orderBy(...query);
      }
      if (Array.isArray(query) && query?.column) {
        return knex.orderBy(...query);
      }
      throw Error('[CommonModel]: Invalid order by input');
    }
  };

  constructor(knex, table) {
    if (!knex) {
      throw new Error(`[CommonModel]: No Knex set up!`);
    }
    if (!table) {
      throw new Error('[CommonModel]:No table set up!');
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

  async findMany(query) {
    const model = this.knex(this.table);
    const queries = Object.entries(query);
    if (!queries.length) {
      throw new Error(
        `[CommonModel]: Query must be specified. Supported queries: ${Object.keys(
          this.#QUERIES
        )}`
      );
    }
    let request = model;
    queries.forEach(([key, value]) => {
      if (!this.#QUERIES[key]) {
        throw new Error(`[CommonModel]: Query not supported: ${key}`);
      }
      request = this.#QUERIES[key](request, value);
    });
    return request;
  }

  async remove(id) {
    const model = this.knex(this.table);
    return model.where({ id }).del();
  }

  knexQuery() {
    return this.knex(this.table);
  }
};
