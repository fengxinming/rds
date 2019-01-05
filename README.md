# corie-redis-client

[![npm package](https://nodei.co/npm/corie-redis-client.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/corie-redis-client)

> Note: [ioredis](https://github.com/coopernurse/node-pool) 连接池

> 如果该插件对您的开发有所帮助，请五星好评哦！^_^ ^_^ ^_^

---

## 目录

  - [安装](#安装)
  - [使用](#使用)
  - [示例](#示例)

---

## 安装

```bash
npm install --save corie-redis-client

# or

cnpm install --save corie-redis-client
```

---

## 使用

```javascript

'use strict';

const RedisPool = require('../../index');

const pool = new RedisPool({
  redis: {
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    password: 'auth'
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

```

---

## 示例

  - [简单示例](https://github.com/fengxinming/corie-redis-client/tree/master/examples)
