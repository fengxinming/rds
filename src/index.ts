import genericPool from 'generic-pool';
import Redis from 'ioredis';

import { logger as defaultLogger } from './logger';
import type { ILogger, PoolOptions, RedisOptions, RedisPoolOptions } from './types';

function createPool(
  redisOptions: RedisOptions | undefined,
  poolOptions: PoolOptions,
  context: RedisPool
): genericPool.Pool<Redis> {
  return genericPool.createPool({
    create(): Promise<Redis> {
      return new Promise((resolve, reject) => {
        const ioredis = new Redis(redisOptions as any);

        const onError = (e: Error) => {
          context.logger.error('Create redis connection error.', e);
          ioredis.disconnect();
          reject(e);
        };

        // When lazyConnect is enabled, ioredis will not emit ready events until after the ioredis gets a command
        if (redisOptions?.lazyConnect) {
          context.logger.info( 'Lazy connection enabled, skipping ready check.');
          resolve(ioredis);
        }

        ioredis
          .once('error', onError)
          .once('ready', () => {
            ioredis.off('error', onError);
            if (ioredis.options.enableReadyCheck) {
              context.logger.info('Redis Server is ready.');
            }
            else {
              context.logger.info('The connection is established to the Redis server.');
            }
            resolve(ioredis);
          });
      });
    },

    destroy(ioredis: Redis): Promise<void> {
      return new Promise((resolve) => {
        ioredis
          .once('end', () => {
            context.logger.info('No more reconnections will be made.');
            resolve();
          })
          .disconnect();
      });
    }
  }, poolOptions);
}

/**
 * A pool of redis connections.
 *
 * @class RedisPool
 * @extends EventEmitter
 * @param {RedisPoolOptions} options - The options for the pool.
 * @param {RedisOptions} options.redis - The options for the redis client.
 * @param {PoolOptions} options.pool - The options for the pool.
 * @param {ILogger} options.logger - The logger to use.
 * @example
 * ```ts
  const pool = new RedisPool({
    redis: {
      host: '127.0.0.1', // Redis host
      port: 6379, // Redis port
      name: 'test',
      password: 'B213547b69b13224',
      keyPrefix: 'test_'
    },
    pool: {
      // Set the pool's size
      min: 2,
      max: 10
    }
  });

  async function todo() {
    let client;
    try {

      // get a connection for redis
      client = await pool.getConnection();

      // save something to redis
      client.set('test', 'test redis');

      // get something from redis
      const result = await client.get('test');
      console.info('saved successfully', result);

      // delete something from redis
      client.del('test');
      console.info('deleted successfully', result);
    }
    catch (e) {
      // caught an error
      console.error(e);
    }
    finally {
      // finally release redis client to pool
      if (client) {
        await pool.release(client);
        console.info('released');
      }
    }

    // close connection with redis
    await pool.end();
  }

  todo();
 * ```
 */
class RedisPool {
  static defaults = {
    pool: {
      min: 2,
      max: 10
    },
    customLogger: defaultLogger
  };

  logger: ILogger;
  pool: genericPool.Pool<Redis>;
  constructor(opts: Partial<RedisPoolOptions>) {
    const options = Object.assign({}, RedisPool.defaults, opts);

    this.logger = options.customLogger;
    this.pool = createPool(
      options.redis,
      options.pool,
      this
    );
  }

  /**
   * Get a connection from the pool
   */
  getConnection(priority?: number): Promise<Redis> {
    return this.pool.acquire(priority);
  }

  /**
   * Release a redis connection
   */
  release(client: Redis): Promise<void> {
    return this.pool.release(client);
  }

  /**
   * Close a redis connection
   */
  disconnect(client: Redis): Promise<void> {
    return this.pool.destroy(client);
  }

  /**
   * Close all connections
   */
  end(): Promise<void> {
    return this.pool.drain()
      .then(() => this.pool.clear())
      .then(() => {
        this.logger.info('Disconnected all Redis connections.');
      });
  }
}

export {
  Redis,
  RedisPool
};

export * from './types';
