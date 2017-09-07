'use strict'

const _       = require('lodash');
const Command = require('./command');

module.exports = class ListCommand extends Command {
  constructor() {
    super('list');
  }

  /**
   *
   * @params {{

     }} argv
   * @returns {Promise.<*>}
   */
  async run(argv={}) {
    let templates = [];
    try {
      templates = await this.getTemplateNames();
    } catch(e) {
      return Promise.reject(e);
    }
    if (!argv.all) {
      this.log.info(templates.map(file => {
        return file.slice(0, -this.engine.ext.length)
      }).join('\n'));
      return;
    }
    const templateEngineNames = {};
    templates = _.chain(templates)
      .each(file => {
        Object.keys(this.internals.engines).forEach(key => {
          if (file.slice(-this.engine.ext.length) === this.internals.engines[key].ext) {
            if (!templateEngineNames[file.slice(-this.engine.ext.length)]) {
              templateEngineNames[file.slice(-this.engine.ext.length)] = this.internals.engines[key].name;
            }
          }
        });
      })
      .map(file => {
        return `${file.slice(0, -this.engine.ext.length)} [${templateEngineNames[file.slice(-4)]}]`;
      })
      .value();
    this.log.info(templates.join('\n'));
  }
}