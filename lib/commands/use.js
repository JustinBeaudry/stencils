'use strict';

const _ = require('lodash');
const util = require('util');
const utils = require('../utils');
const path = require('path');
const Resource = require('../resource');
const chalk = require('chalk');
const inquirer = require('inquirer');

module.exports = async function use(options) {
  // @TODO:  if no options.name display an inquirer prompt to select all files
  let template;
  try {
    template = await utils.getTemplate(options.templatesDir, options.name, options.ext);
  } catch(e) {
    return Promise.reject(e);
  }
  let meta;
  try {
    meta = await utils.getMeta(options.templatesDir, options.name, options.ext);
  } catch(e) {
    // @TODO:  if there is no meta file for the template create one
    // otherwise just move on
    if (options.verbose) {
      utils.print.error(e);
    }
  }
  // data should come from the meta file.
  // if there is no meta file at all for the template we can't do much right now
  if (!meta) {
    // @TODO:  start partial add flow to capture file meta data and data for template population
    return Promise.reject(new Error('template file missing meta file. remove template and then add via the cli'));
  }

  let name = (options.fileName || options.name) + meta.file.ext;
  let resource = new Resource({
    name: name,
    test: stat => stat.isFile(),
    exists: print => {
      print.warn(`file already exists at ${utils.getPath(name)}`);
      return Promise.resolve();
    },
    notExists: async (print, make) => {
      // if there is no data in the meta file, we need to add the data
      if (Object.keys(meta.keys).length === 0) {
        // process the file with the template engine and get all the keys and type hints
        let tokens = options.engine.parse(template);
        // @TODO:  update the meta file with the keys so we don't have to parse every-time
        // (md5 file and meta to tell if keys need to be re-parsed)
        // now that we have tokens of the template variables we need to figure out what kind of data this is for
        let prompts = [];
        _.each(tokens, token => {
          prompts.push({
            type: 'input',
            name: token,
            message: `Enter data for ${token}`
          });
        });
        await inquirer
          .prompt(prompts)
          .then(answers => {
            // @TODO: this is gross, change to something more semantic
            resource.contents = options.engine.engine.render(template, answers)+'\n';
          });
        // if the selected template engine fails with the parse step, exit as stencils cannot continue
      }
      print.info(`creating resource ${chalk.bold(name)} at ${chalk.bold(process.cwd())}`);
      return make();
    }
  });
  return resource.run(options.force);
}