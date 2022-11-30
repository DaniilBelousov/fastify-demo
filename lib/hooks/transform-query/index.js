'user strict';

const { QueryTransformer } = require('./query-transformer');

const transformQuery = (schemaName, options = {}) =>
  async function (request, reply) {
    const { query = {} } = request;
    const { byUserId = false } = options;
    const customSchema = require(`${__dirname}/schemas/${schemaName}`);
    const userId = request.userId;
    const nextSchema = byUserId
      ? { ...customSchema, userId: { type: 'where', field: 'userId' } }
      : customSchema;
    const nextQuery = byUserId ? { ...query, userId } : query;
    const transformer = new QueryTransformer(nextQuery, nextSchema);
    const sqlQuery = transformer.buildSqlQuery();
    console.log('Knex query:', sqlQuery);
    request.sqlQuery = sqlQuery;
  };

module.exports = { transformQuery };
