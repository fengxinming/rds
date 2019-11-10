'use strict';

const EventEmitter = require('events');
const Redis = require('ioredis');
const genericPool = require('generic-pool');
const Logger = require('clrsole');
const Factory = require('./lib/Factory');
const pkg = require('./package.json');

const defaultLogger = Logger.getLogger(pkg.name, { level: 'ALL' });

class RedisPool extends EventEmitter {

  constructor(options) {
    super();
    options = this.options = Object.assign({}, RedisPool.defaults, options);

    const { logger, redis, pool } = options;
    this.logger = logger;
    this.options = options;
    this.pool = genericPool.createPool(
      new Factory({
        logger,
        redis,
        context: this
      }),
      pool
    );
  }

  /**
   * 获取 redis 链接
   * @param {Number} priority
   */
  getConnection(priority) {
    return this.pool.acquire(priority);
  }

  /**
   * 释放指定的连接
   * @param {Redis} client
   */
  release(client) {
    return this.pool.release(client);
  }

  /**
   * 关闭指定的连接
   * @param {Redis} client
   */
  disconnect(client) {
    return this.pool.destroy(client);
  }

  /**
   * 关闭所有连接
   */
  end() {
    return this.pool.drain()
      .then(() => this.pool.clear())
      .then((res) => {
        this.logger.info('disconnected all ioredis connections.');
        this.emit('end');
        return res;
      });
  }

}

RedisPool.defaults = {
  pool: {
    min: 2,
    max: 10
  },
  logger: defaultLogger
};

module.exports = {
  RedisPool,
  Redis
};
