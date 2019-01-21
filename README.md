# corie-redis-client

[![npm package](https://nodei.co/npm/corie-redis-client.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/corie-redis-client)

> Note: [ioredis](https://github.com/coopernurse/node-pool) pool

---

## Table of contents

  - [Installation](#Installation)
  - [Usage](#Usage)
  - [Examples](#Examples)
  - [Release History](#ReleaseHistory)

---

## Installation

```bash
npm install --save corie-redis-client

# or

cnpm install --save corie-redis-client
```

---

## Usage

```javascript

'use strict';

const RedisPool = require('corie-redis-client');

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
  await pool.end();
  console.log('closed');
}

todo();

```

---

## Examples

  - [redis](https://github.com/fengxinming/corie-redis-client/tree/master/examples)

## ReleaseHistory

### 1.0.2

  - changed default logger to `corie-logger`

### 1.0.3

  - fixed unhandledRejection
  - added events
