'use strict';

const _ = require('lodash');
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

  parse(template) {
    let parsedTemplate = new this.engine.Writer().parse(template);
    // mustache returns an array of arrays
    // the first element is the text itself.
    // for the rest of the elements we want to find the `name` keyed items
    let tokens = [];
    _.each(parsedTemplate, templ => {
      _.each(templ, t => {
        if (t === 'name') {
          tokens.push(templ[1]);
        }
      });
    });
    // dedupe key entries
    return _.uniq(tokens);
  }
}
