FROM node:18-slim

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn

COPY . /app

ENV MYSQL_USER_DEV=user
ENV MYSQL_DATABASE_DEV=bc_api
ENV MYSQL_DATABASE_PASSWORD_DEV=12345678
ENV MYSQL_HOST_DEV=rc1b-7b2fwwwg4xcbzkjg.mdb.yandexcloud.net
ENV MYSQL_PORT_DEV=3306
ENV JWT_SECRET=G-KaPdSg
ENV COOKIE_SECRET=cRfUjXn2
ENV STAGE=dev

CMD NODE_ENV=production yarn fastify start -l info /app/app.js

EXPOSE 3000
