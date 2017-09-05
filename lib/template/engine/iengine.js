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
    this.extension = extension || null;
    this.engine = engine || null;
  }

  render(template, data) {
    return this.engine.render(template, data);
  }
};

