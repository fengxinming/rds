'use strict';

const { join } = require('path');

module.exports = {
  roots: [
    'test'
  ],
  testEnvironment: 'node',
  testRegex: 'test/(.*/)*.*test.js$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'index.js'
  ],
  moduleNameMapper: {
    '^ioredis-conn-pool$': join(__dirname, '..', 'ioredis-conn-pool')
  }
};
