'use strict';

const Redis = require('ioredis');

class Factory {

  constructor(options) {
    Object.assign(this, options);
  }

  create() {
    const { redis: redisOptions, context, logger } = this;
    return new Promise(function createRedis(resolve, reject) {
      const ioredis = new Redis(redisOptions);
      ioredis
        .on('error', function (e) {
          logger.error(e);
          context.emit('error', e, ioredis);
          reject(e);
        })
        .on('connect', function () {
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
