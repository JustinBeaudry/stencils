'use strict';

const _           = require('lodash');
const configKeys  = require('../config_keys');
const Resource    = require('../resource');
const Command     = require('./command');

module.exports = class SetCommand extends Command {
  constructor() {
    super('set');
  }

  /**
   *
   * @param {{
       param: String,
       value: String
     }} argv
   * @returns {Promise.<void>}
   */
  async run(argv={}) {
    let config;
    try {
      config = await this.getConfig();
    } catch(e) {
      return Promise.reject(e);
    }
    if (configKeys.indexOf(argv.param) === -1) {
      return Promise.reject(new Error('invalid param'));
    }
    try {
      argv.value = JSON.parse(argv.value);
    } catch(e) {
      if (argv.verbose) {
        this.log.error(e);
      }
      // we don't need to do anything if it's not JSON
    }
    if (_.isEqual(config[argv.param], argv.value)) return Promise.resolve();
    let engineNames = _.chain(this.internals.engines).map('name').values().value();
    if (argv.param === 'engine' && engineNames.indexOf(argv.value) === -1) {
      this.log.error(`unsupported engine: ${argv.value}`);
      this.log.warn(`stencils only supports the following engines: ${engineNames.join(', ')}`);
      this.log.warn('if you would like additional engines, please add a feature request or pr ;-)');
      return Promise.resolve();
    }
    config[argv.param] = argv.value;
    return new Resource({
      name: this.configPath,
      contents: config,
      exists: make => {
        this.log.info('+ updating config file');
        return make(this.root);
      }
    }).execTest();
  }
}