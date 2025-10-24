import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import { RedisPool } from '../src/index';

describe.each([
  {
    lazyConnect: false,
    name: 'lazyConnect: false',
  },
  {
    lazyConnect: true,
    name: 'lazyConnect: true',
  },
])('测试 ioredis-conn-pool $name', ({ lazyConnect }) => {
  let pool;
  let client;

  beforeAll(() => {
    pool = new RedisPool({
      redis: {
        // sentinels: [{
        //   host: 'localhost',
        //   port: 26379
        // }],
        host: '127.0.0.1', // Redis host
        port: 6379, // Redis port
        name: 'test',
        password: 'B213547b69b13224',
        keyPrefix: 'test_',
        lazyConnect,
      },
      pool: {
        // 默认最小连接数为2，最大连接数为10，根据实际需要设置
        min: 2,
        max: 10,
      },
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
    await expect(pool.release(client)).rejects.toThrow(
      'Resource not currently part of this pool'
    );
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
