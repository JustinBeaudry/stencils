'use strict';

module.exports = class TemplateEngineInterface {
  /**
   *
   * @param {String} name
   * @param {String} extension
   * @param {Object} source
   * @param {Object} options
   */
  constructor(name=null, extension=null, source=null, options={}) {
    this.name = name;
    this.ext = extension;
    this.options = options;
    this.source = source;
  }

  render(template, data) {
    return this.source.render(template, data, this.options);
  }

  parse() {
    throw new Error('not implemented');
  }
};

