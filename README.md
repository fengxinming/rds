# corie-redis

[![npm package](https://nodei.co/npm/corie-redis.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/corie-redis)

> Note: [ioredis](https://github.com/coopernurse/node-pool) 连接池

> 如果该插件对您的开发有所帮助，请五星好评哦！^_^ ^_^ ^_^

---

## 目录

  - [Installation](#installation)
  - [Usage](#usage)
  - [Examples](#examples)

---

## Installation

```bash
npm install --save corie-redis

# or

cnpm install --save corie-redis
```

---

## Usage

```javascript

const logFactory = require('corie-redis');

// './corie-redis.json' will turn into `${process.cwd()}/corie-redis.json`
logFactory.configure('./corie-redis.json');

const logger = logFactory.getLogger('app');
logger.info('hello world');

```

### logFactory.configure( opts )

| Param | Type | Description |
| --- | --- | --- |
| [ opts ] | `Object` | Set a JSON Object as configuration for `corie-redis` |
| [ opts ] | `String` | Set a JSON file path as configuration for `corie-redis` |

### logFactory.getLogger( name )

| Param | Type | Description |
| --- | --- | --- |
| [ name ] | `String` | A name of writer instance |

### writeLine.addLayout( name, serializerGenerator )

| Param | Type | Description |
| --- | --- | --- |
| [ name ] | `String` | A name of serializer generator |
| [ serializerGenerator ] | `Function` | serialize content when you call function write |

### writeLine.addAppender( name, config )

| Param | Type | Description |
| --- | --- | --- |
| [ name ] | `String` | A name of writer instance |
| [ config ] | `Object` | A options of new appender |

### How to configure: 
```javascript

{
  "appenders": {
    "app": {                   // logFactory.getLogger('app'), Any name if you want
      "type": "file",          // file or dateFile
      "filename": "./logs/app.log", // default: "winston.log". Filename to be used to log to. This filename can include the %DATE% placeholder which will include the formatted datePattern at that point in the filename
      "maxSize": 0.            // default: 0, it can be 1048576, 1024k, 5m, 1g. maximum capacity in a file.
      "rotationFormat": false. // default: false, if rotate to create log files
      "zippedArchive": false,  // default: false. A boolean to define whether or not to gzip archived log files
      "maxFiles": null,        // default: null. Maximum number of logs to keep. If not set, no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix
      "eol": os.EOL            // default: os.EOL, split each logs
      "tailable": false        // default: false, insert a number into filename like "file1.log"
    },
    
    // logFactory.getLogger('http'), Any name if you want
    "http": {
      "type": "dateFile",           // file or dateFile
      "filename": "./logs/http.log", // default: "winston.log.%DATE%". Filename to be used to log to. This filename can include the %DATE% placeholder which will include the formatted datePattern at that point in the filename
      "datePattern": "YYYY-MM-DD",  // A string representing the moment.js date format to be used for rotating. The meta characters used in this string will dictate the frequency of the file rotation. For example, if your datePattern is simply 'HH' you will end up with 24 log files that are picked up and appended to every day
      "maxSize": 0.                 // default: 0. Maximum size of the file after which it will rotate. This can be a number of bytes, or units of kb, mb, and gb. If using the units, add 'k', 'm', or 'g' as the suffix. The units need to directly follow the number
      "maxFiles": null,             // default: null.  Maximum number of logs to keep. If not set, no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix. 
      "zippedArchive": false,       // default: false. A boolean to define whether or not to gzip archived log files
      "stream": null,               // default: null. Write directly to a custom stream and bypass the rotation capabilities
    }
  },
  "categories": {
    "default": {                 // must exist
      "appenders": ["error"],
      "level": "ERROR"
    },
    "app": {
      "appenders": ["app"],
      "level": "INFO"
    },
    "info": {
      "appenders": ["app"],
      "level": "INFO",
      "layout": {
        "type": "json",           // default: basic
        "meta": null,             // default: undefined
        "onlyMessage": true,      // default: false. if you only log the message you will give
        "stack": false,           // default: true. you can choose if you wanna log the stack of an Error or not
        "loggerName": false       // default: true. you can choose if you wanna log the name of current logger
        "props": false            // default: true. you can choose if you wanna log all of properties of an Error
      }
    },
    "http": {
      "appenders": ["http"],
      "level": "INFO",
      "layout": {
        "type": "basic"           // default: basic
      }
    }
  }
}

```

---

## Examples

### Follow below links to learn more

  - [Simple and Koa](https://github.com/fengxinming/corie/tree/master/examples)
