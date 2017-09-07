'use strict';

const ejs = require('ejs');
const TemplateEngineInterface = require('./iengine');

module.exports = class TemplateEngineEjs extends TemplateEngineInterface {
  constructor(options) {
    super('ejs', '.ejs', ejs, options);
  }
  // use the TemplateEngineInterface render function
  parse(template) {
    // ejs does not have a method to tokenize template view properties
    // so this needs to be done manually here
    const templateTokenizer = '(<%%|<%=|<%-|<%_|<%#|<%)(.*?)(%%>|%>|-%>)';
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