'use strict';

const Logger = require('clrsole');
const { RedisPool } = require('../index');

const logger = new Logger('example');

const pool = new RedisPool({
  redis: {
    sentinels: [{
      host: '10.59.44.155',
      port: 26379
    }],
    name: 'test',
    password: 'B213547b69b13224',
    keyPrefix: 'talos_open_'
  },
  pool: {
    // 默认最小连接数为2，最大连接数为10，根据实际需要设置
    min: 2,
    max: 10
  }
});

pool
  .on('connect', () => {
    logger.info('connecting');
  })
  .on('ready', () => {
    logger.info('connected');
  })
  .on('error', (e) => {
    logger.error('error', e);
  })
  .on('close', () => {
    logger.info('close');
  })
  .on('disconnected', () => {
    logger.info('disconnected');
  })
  .on('reconnecting', () => {
    logger.info('reconnecting');
  })
  .on('end', () => {
    logger.info('closed all');
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
    logger.info('saved successfully', result);

    // delete something from redis
    client.del('test');
    logger.info('deleted successfully', result);

  } catch (e) {

    // caught an error
    console.error(e);

  } finally {

    // finally release redis client to pool
    if (client) {
      await pool.release(client);
      logger.info('released');
    }

  }

  // close connection with redis
  await pool.end();
  logger.info('closed all connections');
}

todo();
