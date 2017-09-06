'use strict';

const ejs = require('ejs');
const TemplateEngineInterface = require('./iengine');

module.exports = class TemplateEngineEjs extends TemplateEngineInterface {
  constructor(options) {
    super('ejs', '.ejs', ejs, options);
  }
  // use the default render function
  parse(template) {
    // ejs does not have a method to tokenize template view properties
    // so this needs to be done manually here

    const DEFAULT_REGEXP = '(<%%|<%=|<%-|<%_|<%#|<%)(.*?)(%%>|%>|-%>)';
    // escape reserved RegExp characters
    const RESERVED_CHARS = /[|\\{}()[\]^$+*?.]/g;
    const DEFAULT_DELIMITER = '%';
    // set the delimiter based on this.options, provided during instantiation
    const delimiter = String(this.options.delimiter || DEFAULT_DELIMITER).replace(RESERVED_CHARS, '\\$&');

    // dynamically create regexp
    let REGEX = DEFAULT_REGEXP;
    REGEX = REGEX.replace(/%/g, delimiter);
    REGEX = new RegExp(REGEX);

    let tokens = [];
    let result = REGEX.exec(template);
    while (result) {
      tokens.push(result[2].trim());
      template = template.substr(result.index + result[0].length);
      result = REGEX.exec(template);
    }
    return tokens;
  }
}