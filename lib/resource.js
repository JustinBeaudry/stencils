'use strict';

const _       = require('lodash');
const fs      = require('fs');
const mkdirp  = require('mkdirp');
const util    = require('util');
const utils   = require('./utils')

/**
 * @property {String}             name
 * @property {Function<fs.Stats>} test
 * @property {String|null}        contents
 * @property {Function<Object>}   exists
 * @property {Function<Object>}   notExists
 * @type {Resource}
 */
module.exports = class Resource {
  /**
   *
   * @param {Object}                      options
   * @param {String}                      options.name      - Filename and name of resource. Must be unique.
   * @param {Function<fs.Stats>}          options.test      - Function to test if file exists.
   * @param {String|null}                 options.contents  - If null creates a folder, otherwise creates a file
   * @param {Function<utils.print, make>} options.exists    - Function called if test is successful
   * @param {Function<utils.print, make>} options.notExists - Function called if test is not successful
   */
  constructor(options) {
    options = options || {};
    this.name = options.name || null;
    this.meta = options.meta || null;
    this.contents = options.contents || null
    if (_.isFunction(options.test)) {
      this.test = options.test;
    }
    if (_.isFunction(options.exists)) {
      this.exists = options.exists;
    }
    if (_.isFunction(options.notExists)) {
      this.notExists = options.notExists;
    }
  }

  /**
   * @param {fs.Stats} (stat)
   * @param {String} (filePath)
   * @returns {Boolean}
   */
  test(stat, filePath) {
    return stat.isFile();
  }

  /**
   * @param {Function} (make)
   * @returns {Promise}
   */
  exists(make) {
    return Promise.resolve();
  }

  /**
   * @param {Function} (make)
   * @returns {Promise}
   */
  notExists(make) {
    return Promise.resolve();
  }

  /**
   *
   * @param {String} (type)
   * @returns {Array<String>|String}
   */
  static getType(type) {
    const types = {
      directory: {
        type: 'directory',
        ext: ''
      },
      ruby: {
        type: 'ruby',
        ext: '.rb'
      },
      python: {
        type: 'python',
        ext: '.py'
      },
      javascript: {
        type: 'javascript',
        ext: '.js'
      },
      html: {
        type: 'html',
        ext: '.html'
      },
      css: {
        type: 'css',
        ext: '.css'
      },
      scss: {
        type: 'scss',
        ext: '.scss'
      },
      less: {
        type: 'less',
        ext: '.less'
      },
      markdown: {
        type: 'markdown',
        ext: '.md'
      }
    };
    if (!type) return _.values(types);
    return types[type];
  }

  /**
   *
   * @desc Runs the resource test and calls success if it passes and fail if it does not
   * @param {Boolean} (force)
   * @returns {Promise}
   */
  async execTest(force) {
    let exists;
    try {
      exists = await utils.checkIfExists(this.name);
    } catch(e) {
      return Promise.reject(e);
    }
    let filePath;
    try {
      filePath = await utils.getFilePath(this.name);
    } catch(e) {
    }
    if (force || !exists) {
      return this.notExists.call(this, this.make.bind(this));
    }
    let stat;
    try {
      stat = await utils.getStat(this.name);
    } catch (e) {
      return Promise.reject(e);
    }
    return (
      this.test(stat, filePath) ? this.exists.bind(this) : this.notExists.bind(this)
    )(this.make.bind(this));
  }

  /**
   *
   * @desc Makes a resource with `resource.contents` and `resource.name`. If resource.contents is
           null or undefined make() will create a directory instead.
   * @param {String} (path)
   * @returns {Promise}
   */
  async make(path) {
    // if the resource has a meta object, we need to track that into a meta sidecar file
    if (this.meta) {
      // make another file with the contents as this.meta
      let metaPath = utils.getPath(`${this.name}.meta`);
      let metaContents = JSON.stringify(this.meta, null, 2) + '\n';
      await util.promisify(fs.writeFile)(metaPath, metaContents);
    }
    // if contents is an object stringify it and add whitespace to the end
    if (_.isObject(this.contents)) {
      this.contents = JSON.stringify(this.contents, null, 2) + '\n';
    }
    if (!this.contents) {
      return util.promisify(mkdirp)(utils.getPath(this.name, path));
    } else {
      return util.promisify(fs.writeFile)(utils.getPath(this.name, path), this.contents);
    }
  }
};
