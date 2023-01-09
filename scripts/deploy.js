const { execSync } = require('child_process');

const {
  MYSQL_USER_DEV,
  MYSQL_DATABASE_DEV,
  MYSQL_DATABASE_PASSWORD_DEV,
  MYSQL_HOST_DEV,
  MYSQL_PORT_DEV,
  JWT_SECRET,
  COOKIE_SECRET,
  STAGE,
  CONTAINER_REGISTRY_ID,
  CONTAINER_NAME,
  IMAGE_URL
} = process.env;

execSync(
  `
  docker build \
  -f ./Dockerfile \
  -t cr.yandex/${CONTAINER_REGISTRY_ID}/fastify-app \
  --build-arg MYSQL_USER_DEV=${MYSQL_USER_DEV} \
  --build-arg MYSQL_DATABASE_DEV=${MYSQL_DATABASE_DEV} \
  --build-arg MYSQL_DATABASE_PASSWORD_DEV=${MYSQL_DATABASE_PASSWORD_DEV} \
  --build-arg MYSQL_HOST_DEV=${MYSQL_HOST_DEV} \
  --build-arg MYSQL_PORT_DEV=${MYSQL_PORT_DEV} \
  --build-arg JWT_SECRET=${JWT_SECRET} \
  --build-arg COOKIE_SECRET=${COOKIE_SECRET} \
  --build-arg STAGE=${STAGE} \
  .
`,
  { stdio: 'inherit' }
);
execSync('yarn yc-push-container', { stdio: 'inherit' });
execSync(
  `
  yc serverless container revision deploy \
  --container-name ${CONTAINER_NAME} \
  --image ${IMAGE_URL} \
  --cores 1 \
  --memory 512MB \
  --concurrency 1 \
  --execution-timeout 30s \
  --service-account-id ${SERVICE_ACCOUNT_ID}
`,
  { stdio: 'inherit' }
);
