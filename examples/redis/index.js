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

(async function (pool) {
  let client;
  try {
    client = await pool.getConnection();
    client.set('test', 'test redis');
    const result = await client.get('test');
    console.log(result);
    client.del('test');
  } catch (e) {
    console.error(e);
  } finally {
    if (client) {
      pool.release(client);
    }
  }
})(pool);
