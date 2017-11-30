'use strict'

const path      = require('path');
const inquirer  = require('inquirer');
const rimraf    = require('rimraf');
const util      = require('util')
const Command   = require('./command');

/**
  *
  * @module clear
  *
**/

module.exports = class ClearCommand extends Command {
  constructor() {
    super('clear');
  }
  /**
   *
   * @params {{      
     }} argv
   * @returns {Promise.<*>}
   */
  async run(argv={}) {
    let force = argv.force;
    if (!force) {
      try {
        force = await ClearCommand.prompt(argv.template);
      } catch(e) {
        return Promise.reject(e);
      }
    }
    if (!force) return Promise.resolve();
    const template = argv.template ? `${argv.template}${this.engine.ext}*` : '/*';
    const dir = path.join(this.base, this.templatesDir, template);
    return util.promisify(rimraf)(dir);
  }

  static async prompt(template) {
    let message = '';
    if (template) {
      message = `Are you sure you want to remove ${template} template?`;
    } else {
      message = 'Are you sure you want to remove all templates?';
    }
    return inquirer.prompt([
      {
        type: 'confirm',
        name: 'force',
        message: message,
      }
    ])
    .then(answers => answers.force);
  }
}
