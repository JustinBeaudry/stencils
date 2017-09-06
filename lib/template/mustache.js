'use strict';

const _ = require('lodash');
const mustache = require('mustache');
const TemplateEngineInterface = require('./iengine');

module.exports = class TemplateEngineMustache extends TemplateEngineInterface {
  constructor(options) {
    super('mustache', '.mst', mustache, options);
    if (this.options.tags && Array.isArray(this.options.tags)) {
      mustache.tags = this.options.tags;
    }
  }

  render(template, data) {
    mustache.parse(template);
    return this.source.render(template, data);
  }

  parse(template) {
    let parsedTemplate = new this.source.Writer().parse(template);
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
    return _.uniq(tokens);
  }
}
