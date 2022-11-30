'use strict';

class QueryTransformer {
  #DEFAULT_ORDER = 'desc';
  #DEFAULT_TRANSFORMERS = {
    sort: (_, value) => this.#transformSort(_, value),
    where: (key, value) => this.#transformWhere(key, value)
  };

  constructor(query, customSchema) {
    this.query = query;
    this.customSchema = customSchema;
    this.sqlQuery = new Map();
  }

  buildSqlQuery() {
    const entries = Object.entries(this.query);
    if (!entries.length) return {};
    entries.forEach(([key, value]) => {
      const { type: transformType, field } = this.customSchema[key] || {};
      const transform =
        this.#DEFAULT_TRANSFORMERS[key] || this.#DEFAULT_TRANSFORMERS[transformType];
      if (!transform) return;
      transform(field, value);
    });
    return Object.fromEntries(this.sqlQuery);
  }

  #transformSort(_, value) {
    const [field, order] = value.split(':');
    const nextOrder = order || this.#DEFAULT_ORDER;
    this.sqlQuery.set('orderBy', [field, nextOrder]);
  }

  #transformWhere(key, value) {
    const prevValue = this.sqlQuery.get('where');
    this.sqlQuery.set('where', { ...prevValue, [key]: value });
  }
}

module.exports = {
  QueryTransformer
};
