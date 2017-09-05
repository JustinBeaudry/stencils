'use strict';

const path = require('path');
const moment = require('moment');
const Resource = require('../resource');

/**
 *
 * @param {Object} options
 */
module.exports = async function create(options) {
  const pathName = path.join(options.templatesDir, options.name + options.extension);
  const resource = new Resource({
    name: pathName,
    test: stat => stat.isFile(),
    contents: `/**\n  Generated on ${moment()}\n**/\n`,
    exists: (print) => {
      print.warn('~ template exists');
    },
    notExists: (print, make) => {
      print.info(`+ creating ${pathName}`);
      return make();
    }
  });
  return resource.run();
}