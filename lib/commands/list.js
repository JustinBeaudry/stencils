'use strict'

const Command = require('./command');

module.exports = class ListCommand extends Command {
  constructor() {
    super('list');
  }

  async run() {
    let templates = [];
    try {
      templates = await this.getTemplateNames();
    } catch(e) {
      return Promise.reject(e);
    }
    this.log.info(templates.join('\n'));
    this.log.info('------------------');
    this.log.info(`${templates.length} template(s)`)
  }
}