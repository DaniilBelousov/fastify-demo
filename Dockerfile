FROM node:18-slim

WORKDIR /app

COPY package.json /app
COPY yarn.lock /app

RUN yarn

COPY . /app

ARG MYSQL_USER_DEV
ARG MYSQL_DATABASE_DEV
ARG MYSQL_DATABASE_PASSWORD_DEV
ARG MYSQL_HOST_DEV
ARG MYSQL_PORT_DEV
ARG JWT_SECRET
ARG COOKIE_SECRET
ARG STAGE

ENV MYSQL_USER_DEV=${MYSQL_USER_DEV}
ENV MYSQL_DATABASE_DEV=${MYSQL_DATABASE_DEV}
ENV MYSQL_DATABASE_PASSWORD_DEV=${MYSQL_DATABASE_PASSWORD_DEV}
ENV MYSQL_HOST_DEV=${MYSQL_HOST_DEV}
ENV MYSQL_PORT_DEV=${MYSQL_PORT_DEV}
ENV JWT_SECRET=${JWT_SECRET}
ENV COOKIE_SECRET=${COOKIE_SECRET}
ENV STAGE=${STAGE}

RUN cat ~/.bashrc

CMD NODE_ENV=production yarn fastify start -l info /app/app.js