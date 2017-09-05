'use strict';

const async = require('async');
const util = require('util');
const pkg = require('../../package.json');
const Resource = require('../resource');

module.exports = async function init(options) {
  options = options || {};

  const RESOURCES = [
    new Resource({
      name: options.configFilePath,
      test: stat => stat.isFile(),
      contents: {
        version: pkg.version,
        engine: 'mustache'
      },
      exists: Promise.resolve,
      notExists: (print, make) => {
        print.info('+ creating template rc');
        return make();
      }
    }),
    new Resource({
      name: options.templatesDir,
      test: stat => stat.isDirectory(),
      exists: Promise.resolve,
      notExists: (print, make) => {
        print.info('+ creating template directory');
        return make();
      }
    })
  ];

  return new Promise((resolve, reject) => {
    async.each(RESOURCES, (resource, nextResource) => {
      resource
        .run(options.force)
        .then(() => nextResource())
        .catch(nextResource);
    }, err => {
      if (err) reject(err);
      resolve();
    });
  });
}