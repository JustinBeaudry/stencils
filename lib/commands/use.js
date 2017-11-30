'use strict';

const _         = require('lodash');
const async     = require('async');
const util      = require('util');
const utils     = require('../utils');
const path      = require('path');
const Resource  = require('../resource');
const inquirer  = require('inquirer');
const Command   = require('./command');

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
    }} argv
   * @returns {Promise.<*>}
   */
  async run(argv) {
    // @TODO:  if no argv.name display an inquirer prompt to select all files
    // @NOTE:  as-per yargs argv.name is not possible to be null here
    let template;
    try {
      template = await this.getTemplate(argv.name);
    } catch(e) {
      return Promise.reject(e);
    }
    let meta;
    try {
      meta = await this.getMeta(argv.name);
    } catch(e) {
      // @TODO:  if there is no meta file for the template create one
      // otherwise just move on
      if (argv.verbose) {
        this.log.error(e);
      }
    }
    // if there is no meta file at all for the template we can't do much right now
    if (!meta) {
      // @TODO:  start partial add flow to capture file meta data and data for template population
      return Promise.reject(new Error('template file missing meta file. remove template and then add via the cli'));
    }

    if (Array.isArray(template)) {
      template.unshift({
        template: null,
        meta: meta,
        dir: true
      });
      return new Promise((resolve, reject) => {
        async.each(template, t => {
          return this.createResource(argv.name, t.template, t.meta, argv.force, t.dir ? null : argv.name);
        }, err => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
    return this.createResource(argv.name, template, meta, argv.force);
  }

  createResource(fileName, template, meta, force, subDir) {
    const commandContext = this;
    let name = fileName + meta.file.ext;
    if (subDir) {
      name = path.join(subDir, name);
    }

    return new Resource({
      name: name,
      exists: () => {
        this.log.warn(`file already exists at ${utils.getPath(name)}`);
        return Promise.resolve();
      },
      notExists: async function(make) {
        // if there is no data in the meta file, we need to add the data
        if (Object.keys(meta.keys).length === 0) {
          // process the file with the template engine and get all the keys and type hints
          // if it's a directory, don't bother tokenizing
          let tokens;
          if (template) {
            tokens = commandContext.engine.parse(template);
          }
          // @TODO:  update the meta file with the keys so we don't have to parse every-time
          // (md5 file and meta to tell if keys need to be re-parsed)
          // now that we have tokens of the template variables we need to figure out what kind of data this is for
          if (tokens) {
            let prompts = _.chain(tokens)
              .uniq()
              .map(token => {
                return {
                  type: 'input',
                  name: token,
                  message: `Enter data for ${token}`
                };
              })
              .value();
            inquirer
              .prompt(prompts)
              .then(answers => {
                this.contents = commandContext.engine.render(template, answers)+'\n';
              });
            // if the selected template engine fails with the parse step, exit as stencils cannot continue
          } else {
            console.log('\n\n\n\n ======================================= template ====================================\n', template, '\n\n\n\n\n');
            
            this.contents = template;
          }
        }
        commandContext.log.info(`creating resource ${commandContext.chalk.bold(name)} at ${commandContext.chalk.bold(commandContext.root)}`);
        return make(commandContext.root);
      }
    }).execTest(force);
  }
}
