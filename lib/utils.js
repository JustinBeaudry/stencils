'use strict';

const fs    = require('fs');
const path  = require('path');
const chalk = require('chalk');
const util  = require('util');

const print = {
  trace: msg => console.trace(
    chalk.white(msg)
  ),
  info: msg => console.info(
    chalk.white(msg)
  ),
  warn: msg => console.warn(
    chalk.yellow(msg)
  ),
  error: msg => console.error(
    chalk.red(msg)
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
 * @param {String} (altPath)
 * @returns {Promise}
 */
async function checkIfExists (fileName, altPath=null) {
  return util.promisify(fs.open)(altPath ? altPath : getPath(fileName), 'r')
    .catch(err => {
      const isNotExistent = err && err.code === 'ENOENT' || false;
      // check if there's an error and that the file exists before rejecting with an err
      if (err && !isNotExistent) return err;
      return !isNotExistent;
    })
}

/**
 *
 * @desc get fs.Stats object of fileName
 * @param {String} fileName
 * @param {String} (altPath) - alternative file path
 * @returns {Promise.<fs.Stats|Error>}
 */
async function getStat(fileName, altPath=null) {
  let exists;
  try {
    exists = await checkIfExists(fileName);
  } catch(e) {
    return Promise.reject(e);
  }
  if (!exists) return Promise.reject(new Error('file not found'));
  return util.promisify(fs.stat)(altPath ? altPath : getPath(fileName));
}

/**
 *
 * @desc get a directory from the filesystem
 * @param {String} dir
 * @param {String} (altPath) - alternative file path
 * @returns {Promise.<Array<String>|Error>}
 */
async function getFiles(dir, altPath=null) {
  let exists;
  try {
    exists = await checkIfExists(dir);
  } catch(e) {
    return Promise.reject(e);
  }
  if (!exists) return Promise.reject(new Error('dir not found'));
  return util.promisify(fs.readdir)(altPath ? altPath : getPath(dir));
}

/**
 *
 * @desc get a file from the filesystem
 * @param {String} file
 * @param {String} (altPath) - alternative file path
 * @returns {Promise.<String|Error>}
 */
async function getFile(file, altPath=null) {
  let exists;
  try {
    exists = await checkIfExists(file);
  } catch(e) {
    return e
  }
  if (!exists) return Promise.reject(new Error('file not found'));
  return util.promisify(fs.readFile)(altPath ? altPath : getPath(file)).then(file => file.toString());
}

function getPath(name) {
  return path.resolve(process.cwd(), name);
}