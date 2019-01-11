'use strict';

const EventEmitter = require('events');
const Redis = require('ioredis');
const genericPool = require('generic-pool');
const { getConsole } = require('corie-logger');

const defaultLogger = getConsole('corie-redis-client');

const defaultPool = {
  min: 2,
  max: 10
};

class RedisPool extends EventEmitter {

  constructor(options) {
    super();

    const {
      pool,
      redis,
      logger = defaultLogger
    } = options;

    const factory = {
      create: () => new Promise((resolve, reject) => {
        const ioredis = new Redis(redis);
        ioredis.on('error', (e) => {
          logger.error('ioredis error', e);
          this.emit('error', e);
          reject(e);
        });
        ioredis.on('connect', () => {
          logger.info('connected to redis with ioredis');
        });
        ioredis.on('ready', () => {
          logger.info('ready for all ioredis connections');
          resolve(ioredis);
        });
        ioredis.on('reconnecting', () => {
          logger.info('reconnected to redis with ioredis');
        });
      }),
      destroy: ioredis => new Promise((resolve) => {
        ioredis.on('close', (e) => {
          if (e) {
            logger.error('close an ioredis connection error, cause: ', e);
          } else {
            logger.info('closed an ioredis connection');
          }
          resolve(ioredis);
        });
        ioredis.on('end', (e) => {
          if (e) {
            logger.error('end an ioredis connections error, cause: ', e);
          } else {
            logger.info('ended an ioredis connections');
          }
          resolve(ioredis);
        });
        try {
          // Unhandled promise rejection sometimes
          ioredis.disconnect();
        } catch (e) {
          logger.error('disconnect an ioredis connections error, cause: ', e);
        }
      })
    };

    this.logger = logger;
    this.options = options;
    this.pool = genericPool.createPool(factory, Object.assign({}, defaultPool, pool));
  }

  getConnection(priority) {
    return this.pool.acquire(priority);
  }

  release(client) {
    return this.pool.release(client);
  }

  destroy(client) {
    return this.pool.destroy(client);
  }

  end() {
    return this.pool.drain()
      .then(() => this.pool.clear())
      .then((res) => {
        this.logger.info('ended all ioredis connections');
        return res;
      });
  }

}

RedisPool.Redis = Redis;

module.exports = RedisPool;
