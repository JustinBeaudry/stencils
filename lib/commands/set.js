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
     }} options
   * @returns {Promise.<void>}
   */
  async run(options={}) {
    let config;
    try {
      config = await this.getConfig();
    } catch(e) {
      return Promise.reject(e);
    }
    if (configKeys.indexOf(options.param) === -1) {
      return Promise.reject(new Error('invalid param'));
    }
    try {
      options.value = JSON.parse(options.value);
    } catch(e) {
      if (options.verbose) {
        this.log.error(e);
      }
      // we don't need to do anything if it's not JSON
    }
    if (_.isEqual(config[options.param], options.value)) return Promise.resolve();
    let engineNames = _.chain(this.internals.engines).map('name').values().value();
    if (options.param === 'engine' && engineNames.indexOf(options.value) === -1) {
      this.log.error(`unsupported engine: ${options.value}`);
      this.log.warn(`stencils only supports the following engines: ${engineNames.join(', ')}`);
      this.log.warn('if you would like additional engines, please add a feature request or pr ;-)');
      return Promise.resolve();
    }
    config[options.param] = options.value;
    const resource = new Resource({
      name: this.configPath,
      test: stat => stat.isFile(),
      contents: config,
      exists: make => {
        this.log.info('+ updating config file');
        return make();
      }
    });
    return resource.execTest();
  }
}