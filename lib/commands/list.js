'use strict'

const utils   = require('../utils');
const async   = require('async');
const path    = require('path');
const _       = require('lodash');
const Command = require('./command');

module.exports = class ListCommand extends Command {
  constructor() {
    super('list');
  }
  /**
   *
   * @params {{
      all: Boolean
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
    // Display the engine extension use the all option
    // OR if the templates have duplicate names
    //   (meaning if there are two templates with the same name using different engines)
    if (templates.length === 0) return Promise.resolve();
    let header = 'name';
    let divider = '----';
    // in order heading and options
    if (argv.all) {
      // add engine
      header += '\tengine';
      divider += '\t------';
    }
    // @TODO:  add option to display header
    this.log.info(header);
    this.log.info(divider);
    templates = _.map(templates, file => {
      let engineExt = file.split('.')[1];
      let listItem = `${file.slice(0, -engineExt.length - 1)}`;
      if (argv.all) {
        // engine
        listItem += `\t${engineExt}`;
      }
      return listItem;
    });
    this.log.info(templates.join('\n'));
    return Promise.resolve();
  }
}