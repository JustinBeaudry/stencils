'use strict';

const _ = require('lodash');
const util = require('util');
const utils = require('../utils');
const path = require('path');
const Resource = require('../resource');
const chalk = require('chalk');
const inquirer = require('inquirer');
const Command = require('./command');

module.exports = class UseCommand extends Command {
  constructor() {
    super('use');
  }

  /**
   *
   * @param {{
      verbose: Boolean
      name: String,
      fileName: String,
      force: Boolean
    }}options
   * @returns {Promise.<*>}
   */
  async run(options) {
    // @TODO:  if no options.name display an inquirer prompt to select all files
    // @NOTE:  as-per yargs options.name is not possible to be null here
    let template;
    try {
      template = await this.getTemplate(options.name);
    } catch(e) {
      return Promise.reject(e);
    }
    let meta;
    try {
      meta = await this.getMeta(options.name);
    } catch(e) {
      // @TODO:  if there is no meta file for the template create one
      // otherwise just move on
      if (options.verbose) {
        this.log.error(e);
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
      exists: () => {
        this.log.warn(`file already exists at ${utils.getPath(name)}`);
        return Promise.resolve();
      },
      notExists: async make => {
        // if there is no data in the meta file, we need to add the data
        if (Object.keys(meta.keys).length === 0) {

          // process the file with the template engine and get all the keys and type hints
          let tokens = this.engine.parse(template);
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
              resource.contents = this.engine.render(template, answers)+'\n';
            });
          // if the selected template engine fails with the parse step, exit as stencils cannot continue
        }
        this.log.info(`creating resource ${chalk.bold(name)} at ${chalk.bold(process.cwd())}`);
        return make();
      }
    });
    return resource.execTest(options.force);
  }
}
