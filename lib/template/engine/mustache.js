'use strict';

const mustache = require('mustache');
const TemplateEngineInterface = require('./iengine');

module.exports = class TemplateEngineMustache extends TemplateEngineInterface {
  constructor() {
    super('mustache', '.mst', mustache);
  }

  render(template, data) {
    mustache.parse(template);
    this.engine.render(template, data);
  }
}
