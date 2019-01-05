'use strict';

const EventEmitter = require('events');
const Redis = require('ioredis');
const genericPool = require('generic-pool');

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
      logger = console
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
          logger.info('connected with ioredis');
        });
        ioredis.on('ready', () => {
          logger.info('ready for all connections');
          resolve(ioredis);
        });
        ioredis.on('reconnecting', () => {
          logger.info('reconnected with ioredis');
        });
      }),
      destroy: ioredis => new Promise((resolve) => {
        ioredis.on('close', (e) => {
          logger.error('closed a connection', e);
          resolve(ioredis);
        });
        ioredis.on('end', (e) => {
          logger.error('closed all connections', e);
          resolve(ioredis);
        });
        ioredis.disconnect();
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
    return this.pool.drain().then(() => this.pool.clear());
  }

}

RedisPool.Redis = Redis;

module.exports = RedisPool;
