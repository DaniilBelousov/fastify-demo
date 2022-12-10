'use strict';

const { randomUUID } = require('node:crypto');
const { getConfig } = require('../../config');
const { CommonError, ValidationError } = require('../../errors');
const { compileSchema } = require('../model-validation');

module.exports = class CommonModel {
  constructor(knex, table, creationSchema = '') {
    if (!knex) {
      throw new CommonError(`[CommonModel]: No Knex set up!`);
    }
    if (!table) {
      throw new CommonError('[CommonModel]: No table set up!');
    }
    this.knex = knex;
    this.table = table;
    if (creationSchema) {
      const schema = require(`${__dirname}/../schemas/${creationSchema}`);
      this.validate = compileSchema(schema);
    }
  }

  async create(data) {
    const model = this.knex(this.table);
    const id = randomUUID();
    const nextData = { ...data, id };
    this.checkIsValid(nextData);
    await model.insert(nextData);
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
    await model.where({ id }).del();
  }

  knexQuery() {
    return this.knex(this.table);
  }

  checkIsValid(data) {
    if (this.validate) {
      const valid = this.validate(data);
      if (!valid) {
        const [{ message, instancePath }] = this.validate.errors;
        const field = instancePath.split('/').pop();
        throw new ValidationError({ message: `${field} ${message}` });
      }
    }
  }

  async #buildRequest(query) {
    let request = this.knex(this.table);
    const queries = Object.entries(query);
    console.log('SQL: ', request.toSQL().toNative());
    queries.forEach(([key, value]) => {
      if (Array.isArray(value)) {
        request = request[key](...value);
        return;
      }
      if (typeof value === 'boolean') {
        request = request[key]();
        return;
      }
      request = request[key](value);
    });
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
    if (!res) return res;
    if (Array.isArray(res)) {
      return res.map(raw => ({ ...raw }));
    }
    return { ...res };
  }
};
