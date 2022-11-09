const { readdir } = require('node:fs').promises;

const addSchemas = async app => {
  const schemas = await readdir(`${__dirname}/schemas`);
  schemas.map(schemaFile => {
    const schema = require(`${__dirname}/schemas/${schemaFile}`);
    app.addSchema(schema);
  });
};

module.exports = { addSchemas };
