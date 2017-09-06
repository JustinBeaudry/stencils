'use strict';

module.exports = class TemplateEngineInterface {
  /**
   *
   * @param {String} name
   * @param {String} extension
   * @param {Object} engine
   */
  constructor(name, extension, engine) {
    this.name = name;
    this.ext = extension || null;
    // @TODO: rename this to lib or something else, engine.engine is just gross
    this.source = engine || null;
  }

  render(template, data) {
    return this.source.render(template, data);
  }

  parse() {
    throw new Error('not implemented');
  }
};

