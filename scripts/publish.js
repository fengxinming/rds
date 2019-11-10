'use strict';

const { join } = require('path');
const { exec } = require('./util');

function publish(arr, getDir) {
  arr.forEach(
    (packageName) => {
      if (name && name !== packageName) {
        return;
      }
      exec(['publish', getDir(packageName), ...args], true);
    }
  );
}

const [, , name, ...args] = process.argv;

const es6packages = [
  'js-linkedmap',
  'properties-like'
];
publish(es6packages, packageName => join(__dirname, '..', 'packages', packageName, 'npm'));

const es5packages = [
  'str-formatter'
];
publish(es5packages, packageName => join(__dirname, '..', 'packages', packageName));
