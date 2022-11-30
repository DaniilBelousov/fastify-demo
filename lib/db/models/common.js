'use strict';

const { randomUUID } = require('node:crypto');
const { getConfig } = require('../../config');

module.exports = class CommonModel {
  #QUERIES = {
    count: (knex, query) => knex.count(query),
    select: (knex, query) => knex.select(query),
    where: (knex, query) => knex.where(query),
    orderBy: (knex, query) => {
      if (Array.isArray(query) && typeof query[0] === 'string') {
        return knex.orderBy(...query);
      }
      if (Array.isArray(query) && query?.column) {
        return knex.orderBy(...query);
      }
      throw Error('[CommonModel]: Invalid order by input');
    },
    first: (knex, value = false) => (value ? knex.first() : knex),
    limit: (knex, query) => knex.limit(query),
    offset: (knex, query) => knex.offset(query)
  };

  constructor(knex, table) {
    if (!knex) {
      throw new Error(`[CommonModel]: No Knex set up!`);
    }
    if (!table) {
      throw new Error('[CommonModel]: No table set up!');
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
        this.#buildRequest({ ...query, select: '', count: 'id AS total' }).then(
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
