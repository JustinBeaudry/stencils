'use strict';

const Command = require('./command');

module.exports = class GetCommand extends Command {
  constructor() {
    super('get');
  }

  /**
   *
   * @param {{
       param: String
     }} options
   * @returns {Promise.<void>}
   */
  async run(options={}) {
    // print config file option to console if it exists in config
    let config;
    try {
      config = await this.getConfig();
    } catch(e) {
      return Promise.reject(e);
    }
    let param = config[options.param];
    if (param) {
      this.log.info(`~ ${param}`);
    }
  }
}
