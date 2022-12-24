const path = require('node:path');
const fs = require('node:fs/promises');
const { exec } = require('child_process');
const AutoLoad = require('@fastify/autoload');
const yaml = require('js-yaml');

const root = `${__dirname}/..`;
const CONTAINER_ID = 'bbag27gdge2s0itjora7';
const SERVICE_ACC_ID = 'ajeco9rh82sgukcdhbe4';

const writeYmlApi = async apiJson => {
  const { paths } = apiJson;
  const nextPaths = Object.entries(paths).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [key]: Object.keys(value).reduce(
        (p, k) => ({
          ...p,
          [k]: {
            'x-yc-apigateway-integration': {
              type: 'serverless_containers',
              container_id: CONTAINER_ID,
              service_account_id: SERVICE_ACC_ID,
              http_headers: {
                'Content-Type': 'application/json'
              }
            }
          }
        }),
        {}
      )
    }),
    {}
  );

  await fs.writeFile(
    `${__dirname}/api.yml`,
    yaml.dump({ ...apiJson, paths: nextPaths }),
    err => console.log(err)
  );
  exec(
    'yc serverless api-gateway update --id $(echo $API_GATEWAY_ID) --spec=./scripts/api.yml',
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
};

module.exports.options = {};

module.exports = async function (app, opts) {
  await app.register(require('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'tEST',
        description: 'TEST',
        version: '1'
      }
    }
  });

  app.register(AutoLoad, {
    dir: path.join(root, 'plugins'),
    options: Object.assign({}, opts)
  });

  app.register(AutoLoad, {
    dir: path.join(root, 'routes'),
    options: Object.assign({}, opts)
  });

  app.ready().then(async () => {
    const apiJson = await app.swagger();
    console.log(apiJson);
    await writeYmlApi(apiJson);
  });
};
