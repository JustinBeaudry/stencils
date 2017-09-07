'use strict';

const _     = require('lodash');
const chalk = require('chalk');

module.exports = {
  trace: msg => console.trace(
    chalk.white(
      formatLogMsg(
        msg
      )
    )
  ),
  info: msg => console.info(
    chalk.white(
      formatLogMsg(
        msg
      )
    )
  ),
  warn: msg => console.warn(
    chalk.yellow(
      formatLogMsg(
        msg
      )
    )
  ),
  error: msg => console.error(
    chalk.red(
      formatLogMsg(
        msg
      )
    )
  )
};

function formatLogMsg(msg) {
  if (_.isObject(msg) || _.isArray(msg)) return JSON.stringify(msg, null, 2);
  if (_.isUndefined(msg) || _.isNull(msg)) return '';
  return msg;
}
