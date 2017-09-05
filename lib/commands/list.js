'use strict'

const utils = require('../utils');
const path = require('path');

/**
 *
 * @param {object} options
 * @returns {Promise}
 */
module.exports = async function list(options) {
  let templates = [];
  try {
    templates = await utils.getTemplates(options.templatesDir, options.ext);
  } catch(e) {
    return e;
  }
  utils.print.info(templates.join('\n'));
  utils.print.info('------------------');
  utils.print.info(`${templates.length} template(s)`)
};