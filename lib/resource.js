'use strict';

const _ = require('lodash');
const fs = require('fs');
const mkdirp = require('mkdirp');
const utils = require('./utils')

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
    this.test = options.test || _.noop;
    this.contents = options.contents || null
    this.exists = _.isFunction(options.exists) ? options.exists : _.noop;
    this.notExists = _.isFunction(options.notExists) ? options.notExists : _.noop;
  }

  /**
   *
   * @desc Runs the resource test and calls success if it passes and fail if it does not
   * @param {Boolean} (force
   * @returns {Promise}
   */
  async run(force) {
    let exists;
    try {
      exists = await utils.checkIfExists(this.name);
    } catch(e) {
      return e;
    }
    if (force || !exists) {
      return this.notExists(utils.print, this.make.bind(this));
    }
    let stat = await utils.getStat(this.name);
    return (
      this.test(stat) ? this.exists : this.notExists
    )(utils.print, this.make.bind(this));
  }

  /**
   *
   * @desc Makes a resource with `resource.contents` and `resource.name`. If resource.contents is
           null or undefined make() will create a directory instead.
   * @returns {Promise}
   */
  async make() {
    return new Promise((resolve, reject) => {
      let args = [utils.getPath(this.name), err => {
        if (err) reject(err);
        resolve();
      }];
      if (!this.contents) {
        mkdirp.apply(null, args);
        return;
      } else if (_.isObject(this.contents)) {
        args.splice(1, 0, `${JSON.stringify(this.contents, null, 2)}\n`);
      } else {
        args.splice(1, 0, this.contents);
      }
      fs.writeFile.apply(null, args);
    });
  }
};
