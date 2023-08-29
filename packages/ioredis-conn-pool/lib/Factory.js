'use strict';

const Redis = require('ioredis');

class Factory {

  constructor(options) {
    Object.assign(this, options);
  }

  create() {
    const { redis: redisOptions, context, logger } = this;
    return new Promise(function createRedis(resolve, reject) {
      let ioredis = new Redis(redisOptions);
      let isConnectedOnStart = false;
      ioredis
        .on('error', function (e) {
          if (!isConnectedOnStart) {
            ioredis.quit();
            ioredis = null;
          }
          logger.error(e);
          context.emit('error', e, ioredis);
          reject(e);
        })
        .on('connect', function () {
          isConnectedOnStart = true;
          context.emit('connect', ioredis);
        })
        .on('ready', function () {
          context.emit('ready', ioredis);
          resolve(ioredis);
        })
        .on('reconnecting', function () {
          context.emit('reconnecting', ioredis);
        });
    });
  }

  destroy(ioredis) {
    const { context, logger } = this;
    return new Promise((resolve) => {
      ioredis
        .on('close', function (e) {
          if (e) {
            logger.error(e);
          }
          context.emit('close', e, ioredis);
        })
        .on('end', function () {
          context.emit('disconnected', ioredis);
          resolve(ioredis);
        })
        .disconnect();
    });
  }

}

module.exports = Factory;
