'use strict';

const path = require('path');
const opn = require('opn');
const utils = require('../utils');

/**
 *
 * @param {Object} options
 * @returns {Promise}
 */
module.exports = async function open(options) {
  const fileName = options.name + options.ext;
  const filePath = utils.getPath(path.join(options.templatesDir, fileName))
  utils.print.info(`opening ${fileName}`);
  return opn(filePath, {
    app: options.application
  });
};
