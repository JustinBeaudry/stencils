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
     }} argv
   * @returns {Promise.<*>}
   */
  async run(argv={}) {
    let template;
    let exists;
    try {
      exists = await utils.checkIfExists(argv.name);
    } catch(e) {
      return Promise.reject(e);
    }
    if (!exists) return Promise.resolve();
    try {
      template = await this.getTemplate(argv.name);
    } catch(e) {
      return Promise.reject(e);
    }
    this.log.info(`${argv.name} template:\n`);
    this.log.info(template);
  }
}
