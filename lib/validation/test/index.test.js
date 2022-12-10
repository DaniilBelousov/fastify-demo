'use-strict';

const { readdir } = require('node:fs').promises;
const { addSchemas } = require('../index');

test('should successfully add schemas', async () => {
  const schemasCount = (await readdir(`${__dirname}/../schemas`)).length;
  const app = {
    addSchema: jest.fn().mockReturnThis()
  };

  await addSchemas(app);

  expect(app.addSchema).toBeCalledTimes(schemasCount);
});
