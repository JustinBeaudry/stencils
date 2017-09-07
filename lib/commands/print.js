'use strict';

const utils   = require('../utils');
const Command = require('./command');

module.exports = class PrintCommand extends Command {
  constructor() {
    super('print');
  }

  /**
   *
   * @param {{
       name: String
     }} options
   * @returns {Promise.<*>}
   */
  async run(options={}) {
    let template;
    let exists;
    try {
      exists = await utils.checkIfExists(options.name);
    } catch(e) {
      return Promise.reject(e);
    }
    if (!exists) return Promise.resolve();
    try {
      template = await this.getTemplate(options.name);
    } catch(e) {
      return Promise.reject(e);
    }
    this.log.info(`${options.name} template:\n`);
    this.log.info(template);
  }
}
