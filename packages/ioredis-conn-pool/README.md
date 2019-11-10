# ioredis-conn-pool

[![npm package](https://nodei.co/npm/ioredis-conn-pool.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/ioredis-conn-pool)

> Note: A redis pool client

---

[![NPM version](https://img.shields.io/npm/v/ioredis-conn-pool.svg?style=flat)](https://npmjs.org/package/ioredis-conn-pool) 
[![NPM Downloads](https://img.shields.io/npm/dm/ioredis-conn-pool.svg?style=flat)](https://npmjs.org/package/ioredis-conn-pool)

## Table of contents

  - [Installation](#Installation)
  - [Usage](#Usage)
  - [Examples](#Examples)

---

## Installation

```bash
npm install --save ioredis-conn-pool

# or

cnpm install --save ioredis-conn-pool
```

---

## Usage

```javascript

'use strict';

const { RedisPool } = require('ioredis-conn-pool');

const pool = new RedisPool({
  redis: {
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    password: 'auth'
  },
  pool: {
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
  process.on('SIGINT', () => {
    server.close(() => {
      pool.end()
        .catch(e => e)
        .then(() => {
          setTimeout(() => process.exit(), 500)
        });
    });
  });
}

todo();

```

---

## Examples

  - [redis](examples)

