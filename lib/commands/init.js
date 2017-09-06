'use strict';

const async = require('async');
const util = require('util');
const utils = require('../utils');
const pkg = require('../../package.json');
const path = require('path');
const Resource = require('../resource');
const Command = require('./command');

module.exports = class InitCommand extends Command {
  constructor() {
    super('init')
    this.internals.throwOnConfigParseError = false;
    this.internals.throwOnConfigMissing = false;
  }

  async run(options) {
    options = options || {};

    let currPkg;
    try {
      currPkg = await utils.getFile(path.resolve(process.cwd(), 'package.json'))
    } catch(e) {
      return Promise.reject(new Error('package.json not found. navigate to project root.'));
    }

    // @TODO:  prompt for settings
    // 1. print header to new files
    // 2. set project name (default to name in package.json)
    // 3. set supported template engine (default to mustache - soon ejs)
    // 4. etc.
    const RESOURCES = [
      new Resource({
        name: this.configPath,
        test: stat => stat.isFile(),
        contents: {
          name: currPkg.name,
          version: pkg.version,
          engine: this.internals.DEFAULT_ENGINE
        },
        exists: Promise.resolve(),
        notExists: make => {
          this.log.info('+ creating template rc');
          return make();
        }
      }),
      new Resource({
        name: this.templatesDir,
        test: stat => stat.isDirectory(),
        exists: Promise.resolve(),
        notExists: make => {
          this.log.info('+ creating template directory');
          return make();
        }
      })
    ];

    // @NOTE:  this may not work, might just need to go back to using callbacks here
    return util.promisify(async.each)(RESOURCES, (resource, nextResource) => {
      resource.execTest(options.force)
        .then(() => nextResource())
        .catch(nextResource);
    });
  }
}
