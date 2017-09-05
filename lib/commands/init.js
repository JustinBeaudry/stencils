'use strict';

const async = require('async');
const util = require('util');
const utils = require('../utils');
const pkg = require('../../package.json');
const path = require('path');
const Resource = require('../resource');

module.exports = async function init(options) {
  options = options || {};

  let currPkg;
  try {
    currPkg = require(path.resolve(process.cwd(), 'package.json'))
  } catch(e) {
    return Promise.reject(new Error('package.json not found. navigate to project root.'));
  }

  // @TODO:  prompt for settings
  // 1. print header to new files
  // 2. set project name (default to name in package.json)
  // 3. set supported template engine (default to mustache - soon ejs)
  // 4. etc.
  const RESOURCES = [
    new Resource({
      name: options.configFilePath,
      test: stat => stat.isFile(),
      contents: {
        name: currPkg.name,
        version: pkg.version,
        engine: 'mustache'
      },
      exists: Promise.resolve(),
      notExists: (print, make) => {
        print.info('+ creating template rc');
        return make();
      }
    }),
    new Resource({
      name: options.templatesDir,
      test: stat => stat.isDirectory(),
      exists: Promise.resolve(),
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