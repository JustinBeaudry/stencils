'use strict';

const utils = require('../utils');

/**
 *
 * @param {Object} options
 * @returns {Promise}
 */
module.exports = async function print(options) {
  let template;
  try {
    template = await utils.getTemplate(options.templatesDir, options.name, options.ext);
  } catch(e) {
    return e;
  }
  utils.print.info(`${options.name} template:\n`);
  utils.print.info(template);
};
