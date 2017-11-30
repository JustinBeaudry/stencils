'use strict';

const ejs = require('ejs');
const TemplateEngineInterface = require('./iengine');

module.exports = class TemplateEngineEjs extends TemplateEngineInterface {
  constructor(options) {
    super('ejs', '.ejs', ejs, options);
  }
  /**
   *
   * @description tokenize ejs templates (ejs does not have a method to tokenize template view properties)
   * @param {String} template
   * @returns {Array}
   */
  parse(template) {
    // @TODO:  If a variable is defined in a scriplet, there's no need to return it in the tokens array
    // @NOTE:  this is a very naive approach and needs some more work to support scriplets
    const templateTokenizer = '(<%%|<%=|<%-|<%_|<%#)(.*?)(%%>|%>|-%>)';
    const scriplets = '(<%|%>)';
    // escape any reserved regexp characters
    const delimiter = String(this.options.delimiter || '%').replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    // use a custom or default delimiter
    let REGEX = new RegExp(
      templateTokenizer.replace(/%/g, delimiter)
    );
    let tokens = [];
    let templateToken = REGEX.exec(template);
    while (templateToken) {
      tokens.push(templateToken[2].trim());
      template = template.substr(templateToken.index + templateToken[0].length);
      templateToken = REGEX.exec(template);
    }
    return tokens;
  }
}