'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const util = require('util');

// @TODO:  centralize logging into a logger class using bunyan
const print = {
  trace: msg => console.trace(
    getMsgTemplate(chalk.white(msg))
  ),
  info: msg => console.info(
    getMsgTemplate(chalk.white(msg))
  ),
  warn: msg => console.warn(
    getMsgTemplate(chalk.yellow(msg))
  ),
  error: msg => console.error(
    getMsgTemplate(chalk.underline.red(msg))
  )
};

exports.getPath = getPath;
exports.checkIfExists = checkIfExists;
exports.getStat = getStat;
exports.getFiles = getFiles;
exports.getFile = getFile;
exports.print = print;

/**
 *
 * @param {String} fileName
 * @param {String} (_path)
 * @returns {Promise}
 */
async function checkIfExists (fileName, _path) {
  // @TODO:  refactor to use util.promisify
  return new Promise((resolve, reject) => {
    // read-only on the file
    fs.open(_path ? _path : getPath(fileName), 'r', err => {
      const isNotExistent = err && err.code === 'ENOENT';
      // check if there's an error and that the file exists before rejecting with an err
      if (err && !isNotExistent) return reject(err);
      resolve(!isNotExistent)
    });
  });
}

/**
 *
 * @desc get fs.Stats object of fileName
 * @param {String} fileName
 * @param {String} (_path)
 * @returns {Promise.<fs.Stats|Error>}
 */
async function getStat(fileName, _path) {
  let exists;
  try {
    exists = await checkIfExists(fileName);
  } catch(e) {
    return Promise.reject(e);
  }
  if (!exists) return Promise.reject(new Error('file not found'));
  return util.promisify(fs.stat)(_path ? _path : getPath(fileName));
}

/**
 *
 * @desc get a directory from the filesystem
 * @param {String} dir
 * @param {String} (_path)
 * @returns {Promise.<Array<String>|Error>}
 */
async function getFiles(dir, _path) {
  let exists;
  try {
    exists = await checkIfExists(dir);
  } catch(e) {
    return Promise.reject(e);
  }
  if (!exists) return Promise.reject(new Error('dir not found'));
  return util.promisify(fs.readdir)(_path ? _path : getPath(dir)).then(file => file.toString());
}

/**
 *
 * @desc get a file from the filesystem
 * @param {String} file
 * @param {String} (_path)
 * @returns {Promise.<String|Error>}
 */
async function getFile(file, _path) {
  let exists;
  try {
    exists = await checkIfExists(file);
  } catch(e) {
    return e
  }
  if (!exists) return Promise.reject(new Error('file not found'));
  return util.promisify(fs.readFile)(_path ? _path : getPath(file)).then(file => file.toString());
}

function getMsgTemplate(msg) {
  return `${msg}`;
}

function getPath(name) {
  return path.resolve(process.cwd(), name);
}