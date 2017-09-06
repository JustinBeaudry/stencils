'use strict';

const ejs = require('ejs');
const TemplateEngineInterface = require('./iengine');

module.exports = class TemplateEngineEjs extends TemplateEngineInterface {
  constructor() {
    super('ejs', '.ejs', ejs);
  }
  // use the default render function
  parse(template) {
    // @TODO:  add support for all native ejs options here, including custom delimiter
    const REGEX = /(<%%|<%=|<%-|<%_|<%#|<%)(.*?)(%%>|%>|-%>)/
    // ejs does not have a method to tokenize template view properties
    // so this needs to be done manually here
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