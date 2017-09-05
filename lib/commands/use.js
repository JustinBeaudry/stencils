'use strict';

const util = require('util');
const utils = require('../utils');
const path = require('path');
const Resource = require('../resource');
const chalk = require('chalk');

module.exports = async function use(options) {
  // if no options.name display an inquirer prompt to select all files
  let template;
  try {
    template = await utils.getTemplate(options.templatesDir, options.name, options.ext);
  } catch(e) {
    return e;
  }
  options.data = {
    name: 'test'
  };
  let name = (options.fileName || options.name) + '.js';
  let resource = new Resource({
    // @TODO:  abstract file type
    name: name,
    test: stat => stat.isFile(),
    contents: options.engine.render(template, options.data),
    exists: print => {
      print.warn(`file already exists at ${utils.getPath(name)}`);
      return Promise.resolve();
    },
    notExists: (print, make) => {
      print.info(`creating resource ${chalk.bold(name)} at ${chalk.bold(process.cwd())}`);
      return make();
    }
  });
  return resource.run(options.force);
}