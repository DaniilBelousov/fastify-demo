'use strict';

const { randomUUID } = require('node:crypto');
const { getConfig } = require('../../config');
const { CommonError } = require('../../errors');

module.exports = class CommonModel {
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
    let request = model;
    queries.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        request = request[key](...value);
        return;
      }
      request = request[key](value);
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
