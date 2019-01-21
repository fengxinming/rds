'use strict';

const RedisPool = require('../../index');

const pool = new RedisPool({
  redis: {
    port: 19000,
    host: '10.57.22.211',
    password: 'tongdun123',
    keyPredix: 'talos_open_'
  },
  pool: {
    // 默认最小连接数为2，最大连接数为10，根据实际需要设置
    min: 2,
    max: 10
  }
});

pool
  .on('connect', () => {
    console.log('connect');
  })
  .on('ready', () => {
    console.log('ready');
  })
  .on('error', (e) => {
    console.log('异常', e);
  })
  .on('close', () => {
    console.log('close');
  })
  .on('reconnecting', () => {
    console.log('reconnecting');
  })
  .on('end', () => {
    console.log('end');
  })
  .on('disconnected', () => {
    console.log('disconnected');
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
    console.log('saved successfully', result);

    // delete something from redis
    client.del('test');
    console.log('deleted successfully', result);

  } catch (e) {

    // caught an error
    console.error(e);

  } finally {

    // finally release redis client to pool
    if (client) {
      await pool.release(client);
      console.log('released');
    }

  }

  // close connection with redis
  await pool.end();
  console.log('closed all connections');
}

todo();
