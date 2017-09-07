'use strict';

// each command is called from cli context and is passed a single namespace of options
// the purpose of this command is to make it easier to do things like getTemplates or getMeta files
// without having to pass around configuration to utilities.

const _     = require('lodash');
const utils = require('../utils');
const log   = require('../log');
const path  = require('path');
const chalk = require('chalk');
const os    = require('os');

const Mustache  = require('../template/mustache');
const Ejs       = require('../template/ejs');

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
    this.log = log;
    this.root = process.cwd();
    this.currDir = this.root;
    this.name = name;
    this.templatesDir = '.stencils';
    this.configPath = '.stlrc';
    this.engine = null;
    this.chalk = chalk;
    this.internals = {
      verbose: false,
      exitOnConfigMissing: true,
      throwOnConfigParseError: true,
      engines: {},
      DEFAULT_ENGINE: 'ejs'
    };
  }

  /**
   *
   * @param {Object} argv - cli arguments
   * @returns {Promise.<*>}
   */
  async execute(argv) {
    // 1. get the config file for the project
    let config;
    try {
      config = await this.getConfig();
    } catch(e) {
      this.log.error(e.message);
      if (this.internals.exitOnConfigMissing) {
        return Promise.resolve();
      }
    }
    // 2. set internal engines
    this.internals.engines = {
      mustache: new Mustache(argv.mustache),
      ejs: new Ejs(argv.ejs),
    };
    // 3. extend argv with rc config
    let runOptions = {};
    // remove all undefined values from argv
    argv = _.chain(argv)
      .keys()
      .without(null, undefined)
      .zipObject(_.values(argv))
      .value()

    if (config) {
      // order of merging is cli -> rc config -> default
      Object.assign(runOptions, config, argv);
    } else {
      Object.assign(runOptions, argv);
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
      // all errors should bubble up to the commands run method
      // this allows us to capture and log all errors
      .catch(err => {
        this.log.info();
        this.log.warn(`${this.chalk.bold.red('ERROR')} running command ${this.chalk.bold.cyan(this.name)}`);
        this.log.info('Report issues -> https://github.com/JustinBeaudry/stencils/issues/new?labels=bug\n');
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
    return files.filter(file => path.extname(file) !== '.meta');
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
   * @desc returns the projects config file.
           called recursively until it finds a config file or hits the users' home directory
   * @returns {Promise.<Object|Error|null>}
   */
  async getConfig() {
    let projectConfig;
    let rootConfig;
    try {
      rootConfig = await utils.getFile(this.configPath, os.homedir());
    } catch(e) {
      // no root config, just continue
    }
    try {
      projectConfig = await utils.getFile(this.configPath, this.currDir);
    } catch(e) {
      if (this.root !== os.homedir()) {
        // try to change the directory
        let couldChangeDir = true;
        try {
          process.chdir('../');
        } catch(e) {
          // directory probably doesn't exist
          couldChangeDir = false;
        }
        if (couldChangeDir) {
          this.currDir = process.cwd();
          return this.getConfig();
        }
      }
      if (this.internals.exitOnConfigMissing) {
        return Promise.reject(new Error(`not a stencils project. ${this.chalk.bold.cyan('stpl init')} to initialize project for use with stencils.`));
      }
    }
    try {
      projectConfig = JSON.parse(projectConfig);
    } catch(e) {
      if (this.internals.throwOnConfigParseError) {
        return Promise.reject(new Error(`error parsing ${this.configPath} file`))
      }
    }
    if (rootConfig) {
      try {
        rootConfig = JSON.parse(rootConfig);
      } catch(e) {
        // root config isn't parseable
        return Promise.reject(new Error('root config is malformed'));
      }
      // merge root config and project config where root config always wins
      Object.assign(projectConfig, rootConfig);
    }
    return projectConfig;
  }
}