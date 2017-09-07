'use strict';

// each command is called from cli context and is passed a single namespace of options
// the purpose of this command is to make it easier to do things like getTemplates or getMeta files
// without having to pass around configuration to utilities.

const _     = require('lodash');
const utils = require('../utils');
const path  = require('path');
const chalk = require('chalk');

const Mustache = require('../template/mustache');
const Ejs = require('../template/ejs');

/**
 * @type {Command}
 */
module.exports = class Command {
  /**
   *
   * @param {String} name
   * @returns {Promise.<*>}
   */
  constructor(name) {
    this.log = utils.print;
    // @TODO:  add this.root for process.cwd()
    this.name = name;
    this.templatesDir = '.stencils';
    this.configPath = '.stlrc';
    this.engine = null;
    this.chalk = chalk;
    this.internals = {
      verbose: false,
      throwOnConfigMissing: true,
      throwOnConfigParseError: true,
      engines: {},
      DEFAULT_ENGINE: 'ejs'
    };
  }

  /**
   *
   * @param {Object} options
   * @returns {Promise.<*>}
   */
  async execute(options) {
    // 1. get the config file for the project
    let config;
    try {
      config = await this.getConfig();
    } catch(e) {
      this.log.error(e.message);
      return;
    }
    // 2. set internal engines
    // need to do this at execute time so that we can take into account the project config
    this.internals.engines = {
      mustache: new Mustache(options.mustache),
      ejs: new Ejs(options.ejs),
    };
    // 3. extend options with file
    let runOptions = {};
    // order of merging is cli -> config -> default
    if (config) {
      // if there is an undefined engine value (from cli), remove it so it doesn't override config value
      if (!options.engine) delete options.engine;
      Object.assign(runOptions, config, options);
    } else {
      Object.assign(runOptions, options);
    }
    // 4. get and set a template engine
    if (!runOptions.engine) runOptions.engine = this.internals.DEFAULT_ENGINE;
    let engine;
    try {
      engine = await this.getEngine(runOptions.engine);
    } catch(e) {
      this.log.error(e.message);
      return;
    }
    this.engine = engine;
    // 5. run the command
    return this.run(runOptions)
      .then(msg => {
        if (msg) {
          this.log.info(msg);
        }
      })
      .catch(err => {
        this.log.warn(`${this.chalk.bold.red('ERROR')} running command ${this.chalk.bold.cyan(this.name)}`);
        this.log.info('Please report issues @ https://github.com/JustinBeaudry/stencils/issues/new\n');
        this.log.error(`${err.stack}\n`);
      });
  }

  /**
   * @private
   * @desc internal function called to run command, must be implemented by extended command class
   * @param {Object} options
   * @returns {Promise.<void>}
   */
  async run(options) {
    throw new Error('not implemented');
  }

  /**
   *
   * @param {String} engineName
   * @returns {Promise.<TemplateEngineInterface>}
   */
  async getEngine(engineName) {
    const engine = this.internals.engines[engineName];
    if (!engine) return Promise.reject(new Error(`unsupported engine requested:  ${engineName}`));
    return Promise.resolve(engine);
  }

  /**
   *
   * @desc returns an array of template names
   * @returns {Promise.<Array<String>|Error>}
   */
  async getTemplateNames() {
    let files;
    try {
      files = await utils.getFiles(this.templatesDir);
    } catch(e) {
      return Promise.reject(e);
    }
    if (!files) return Promise.reject(new Error('template files not found'));
    // get template engine names by extension
    const templateEngineNames = {};
    return _.chain(files)
      .filter(file => path.extname(file) !== '.meta')
      .each(file => {
        Object.keys(this.internals.engines).forEach(key => {
          if (file.slice(-4) === this.internals.engines[key].ext) {
            if (!templateEngineNames[file.slice(-4)]) {
              templateEngineNames[file.slice(-4)] = this.internals.engines[key].name;
            }
         }
        });
      })
      .map(file => `+ ${file.slice(0, -4)} [${templateEngineNames[file.slice(-4)]}]`).value();
  }

  /**
   * @desc returns a template by name
   * @param {String} templateName
   * @returns {Promise.<String|Error>}
   */
  async getTemplate(templateName) {
    let file;
    let pathName = path.join(this.templatesDir, templateName + this.engine.ext);
    try {
      file = await utils.getFile(pathName);
    } catch(e) {
      return Promise.reject(e);
    }
    if (!file) return Promise.reject(new Error('template file not found'));
    return file;
  }

  /**
   * @desc returns a templates meta file object
   * @param {String} templateName
   * @returns {Promise.<Object|Error>}
   */
  async getMeta(templateName) {
    let file;
    let pathName = path.join(this.templatesDir, `${templateName}${this.engine.ext}.meta`);
    try {
      file = await utils.getFile(pathName);
    } catch(e) {
      return Promise.reject(e);
    }
    if (!file) return Promise.reject(new Error('meta file not found'));
    // the meta file is actually a JSON file
    try {
      file = JSON.parse(file);
    } catch(e) {
      return Promise.reject(e);
    }
    return file;
  }

  /**
   * @desc returns the projects config file
   * @returns {Promise.<Object|Error|null>}
   */
  async getConfig() {
    let file;
    try {
      file = await utils.getFile(this.configPath);
    } catch(e) {
      if (this.internals.throwOnConfigMissing) {
        return Promise.reject(new Error(`not a stencils project. ${this.chalk.bold.cyan('stpl init')} to initialize project for use with stencils.`));
      }
    }
    try {
      file = JSON.parse(file);
    } catch(e) {
      if (this.internals.throwOnConfigParseError) {
        return Promise.reject(new Error(`error parsing ${this.configPath} file`))
      }
    }
    return file;
  }
}