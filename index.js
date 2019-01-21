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
        ioredis
          .on('error', (e) => {
            logger.error('ioredis error', e);
            this.emit('error', e, ioredis);
            reject(e);
          })
          .on('connect', () => {
            logger.info('connected to redis with ioredis');
            this.emit('connect', ioredis);
          })
          .on('ready', () => {
            logger.info('ready for all redis connections');
            this.emit('ready', ioredis);
            resolve(ioredis);
          })
          .on('reconnecting', () => {
            logger.info('reconnected to redis with ioredis');
            this.emit('reconnecting', ioredis);
          });
      }),
      destroy: ioredis => new Promise((resolve) => {
        ioredis
          .on('close', (e) => {
            if (e) {
              logger.error('close an ioredis connection error, cause: ', e);
            } else {
              logger.info('closed an ioredis connection');
            }
            this.emit('close', ioredis, e);
            resolve(ioredis);
          })
          .on('end', (e) => {
            if (e) {
              logger.error('end an ioredis connections error, cause: ', e);
            } else {
              logger.info('ended an ioredis connections');
            }
            this.emit('end', ioredis, e);
            resolve(ioredis);
          })
          .disconnect();
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
        this.emit('disconnected');
        return res;
      });
  }

  disconnect() {
    return this.end();
  }

}

RedisPool.Redis = Redis;

module.exports = RedisPool;
