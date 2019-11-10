'use strict';

const { RedisPool } = require('../index');

describe('测试 ioredis-conn-pool', () => {
  let pool;
  let client;

  beforeAll(() => {
    pool = new RedisPool({
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
  });

  beforeEach(async () => {
    client = await pool.getConnection();
  });

  it('测试获取数据', async () => {
    client.set('test', 'test redis');
    await expect(client.get('test')).resolves.toBe('test redis');
  });

  it('测试删除数据', async () => {
    client.del('test');
    await expect(client.get('test')).resolves.toBeNull();
  });

  it('测试异常情况', async () => {
    await pool.disconnect(client);
    await expect(pool.release(client)).rejects.toThrow('Resource not currently part of this pool');
    client = null;
  });

  afterEach(async () => {
    if (client) {
      await pool.release(client);
    }
  });

  afterAll(() => {
    return pool.end();
  });
});
