'use strict';

const spawn = require('cross-spawn');

function exec(args, sync) {
  return (sync ? spawn.sync : spawn)('npm', args, { stdio: 'inherit', env: process.env });
}

module.exports = {
  exec
};
