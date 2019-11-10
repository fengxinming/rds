'use strict';

module.exports = {
  roots: [
    'test'
  ],
  testEnvironment: 'node',
  testRegex: 'test/(.*/)*.*test.js$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*',
    'index.js'
  ]
};
