'use strict';

const ejs = require('ejs');
const TemplateEngineInterface = require('./iengine');

module.exports = class TemplateEngineMustache extends TemplateEngineInterface {
  constructor() {
    super('ejs', '.ejs', ejs);
  }

  render(template, data) {
    this.engine.render(template, data);
  }
}
