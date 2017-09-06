'use strict';

const path = require('path');
const opn = require('opn');
const utils = require('../utils');
const Command = require('./command');

module.exports = class OpenCommand extends Command {
  constructor() {
    super('open');
  }

  /**
   *
   * @param {{
       name: String,
       application: String
   * }} options
   */
  async run(options={}) {
    let exists;
    const fileName = options.name + this.engine.ext;
    const filePath = utils.getPath(path.join(this.templatesDir, fileName))
    try {
      exists = await utils.checkIfExists(filePath);
    } catch(e) {
      return Promise.reject(e);
    }
    if (!exists) return Promise.resolve();
    this.log.info(`opening ${fileName}`);
    return opn(filePath, {
      app: options.application
    });
  }
}
