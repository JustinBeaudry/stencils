'use strict';

module.exports = class TemplateEngineInterface {
  /**
   *
   * @param {String} name
   * @param {String} extension
   * @param {Object} source
   */
  constructor(name, extension, source) {
    this.name = name;
    this.ext = extension || null;
    this.source = source || null;
  }

  render(template, data) {
    return this.source.render(template, data);
  }

  parse() {
    throw new Error('not implemented');
  }
};

