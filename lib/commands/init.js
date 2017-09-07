'use strict';

const async = require('async');
const util  = require('util');
const utils = require('../utils');
const pkg   = require('../../package.json');
const path  = require('path');

const Resource = require('../resource');
const Command = require('./command');

module.exports = class InitCommand extends Command {
  constructor() {
    super('init')
    this.internals.throwOnConfigParseError = false;
    this.internals.exitOnConfigMissing = false;
  }

  /**
   *
   * @param {{
       force: Boolean
     }} argv
   * @returns {Promise.<*>}
   */
  async run(argv={}) {
    let currPkg;
    try {
      currPkg = await utils.getFile(path.resolve(process.cwd(), 'package.json'))
    } catch(e) {
      currPkg = {};
    }
    // @TODO:  prompt for settings
    // 1. print header to new files
    // 2. set project name (default to name in package.json)
    // 3. set supported template engine (default to mustache - soon ejs)
    // 4. etc.
    // skip setup if force option is used
    const RESOURCES = [
      new Resource({
        name: this.configPath,
        test: (stat, filePath) => {
          const isConfigInProject = path.join(this.root, this.configPath) === filePath;
          return stat.isFile() && isConfigInProject;
        },
        contents: {
          name: currPkg.name,
          version: pkg.version,
          engine: this.engine.name
        },
        notExists: make => {
          this.log.info('+ creating template rc');
          return make(this.root);
        }
      }),
      new Resource({
        name: this.templatesDir,
        test: (stat, filePath) => {
          const isTemplateDirInProject = path.join(this.root, this.templatesDir) === filePath;
          return stat.isDirectory() && isTemplateDirInProject;
        },
        notExists: make => {
          this.log.info('+ creating template directory');
          return make(this.root);
        }
      })
    ];

    // @NOTE:  this may not work, might just need to go back to using callbacks here
    return util.promisify(async.each)(RESOURCES, (resource, nextResource) => {
      resource.execTest(argv.force)
        .then(() => nextResource())
        .catch(nextResource);
    });
  }
}
