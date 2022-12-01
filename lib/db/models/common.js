'use strict';

const { randomUUID } = require('node:crypto');
const { getConfig } = require('../../config');
const { CommonError } = require('../../errors');

module.exports = class CommonModel {
  // TODO: Думаю от этого можно избавиться
  #QUERIES = {
    count: (knex, query) => knex.count(query),
    select: (knex, query) => {
      if (Array.isArray(query)) {
        return knex.select(...query);
      }
      if (typeof query === 'string') {
        return knex.select(query);
      }
      throw new CommonError(`[CommonModel]: Invalid select input: ${query}`);
    },
    where: (knex, query) => knex.where(query),
    orderBy: (knex, query) => {
      if (Array.isArray(query) && typeof query[0] === 'string') {
        return knex.orderBy(...query);
      }
      if (Array.isArray(query) && query?.column) {
        return knex.orderBy(...query);
      }
      throw new CommonError(`[CommonModel]: Invalid orderBy input: ${query}`);
    },
    first: (knex, value = false) => (value ? knex.first() : knex),
    limit: (knex, query) => knex.limit(query),
    offset: (knex, query) => knex.offset(query),
    join: (knex, query) => {
      if (Array.isArray(query)) {
        return knex.join(...query);
      }
      throw new new CommonError(`[CommonModel]: Invalid join input: ${query}`)();
    }
  };

  constructor(knex, table) {
    if (!knex) {
      throw new new CommonError(`[CommonModel]: No Knex set up!`)();
    }
    if (!table) {
      throw new new CommonError('[CommonModel]: No table set up!')();
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

  async findMany(query, { pagination } = {}) {
    const { limit, offset, page } = this.#getPagination(pagination);
    const paginationQuery = limit ? { limit, offset } : {};
    const [data, [{ total } = {}] = []] = await Promise.all([
      this.#buildRequest({ ...paginationQuery, ...query }).then(this.#toJSON),
      pagination &&
        this.#buildRequest({ ...query, select: '', count: '* as total' }).then(
          this.#toJSON
        )
    ]);
    return pagination ? { data, total, limit, page } : data;
  }

  async remove(id) {
    const model = this.knex(this.table);
    return model.where({ id }).del();
  }

  knexQuery() {
    return this.knex(this.table);
  }

  async #buildRequest(query) {
    const model = this.knex(this.table);
    const queries = Object.entries(query);
    if (!queries.length) {
      throw new new CommonError(
        `[CommonModel]: Query must be specified. Supported queries: ${Object.keys(
          this.#QUERIES
        )}`
      )();
    }
    let request = model;
    queries.forEach(([key, value]) => {
      if (!this.#QUERIES[key]) {
        throw new new CommonError(`[CommonModel]: Query not supported: ${key}`)();
      }
      request = this.#QUERIES[key](request, value);
    });
    console.log('SQL: ', request.toSQL().toNative());
    return request;
  }

  #getPagination(pagination) {
    if (!pagination) return {};
    const { limit: defaultLimit, page: defaultPage } = getConfig('pagination');
    const limit = pagination?.limit ? pagination.limit : defaultLimit;
    const page = pagination?.page ? pagination.page : defaultPage;
    const offset = (page - 1) * limit;
    return { limit, offset, page };
  }

  #toJSON(res) {
    if (Array.isArray(res)) {
      return res.map(raw => ({ ...raw }));
    }
    if (typeof res === 'object') {
      return { ...res };
    }
    return res;
  }
};
