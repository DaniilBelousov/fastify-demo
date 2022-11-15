'use strict';

const { scrypt, randomBytes } = require('node:crypto');

const hash = password =>
  new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex');
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });

const verify = (password, hash) =>
  new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      resolve(key == derivedKey.toString('hex'));
    });
  });

module.exports = {
  hash,
  verify
};
