'use strict';

const fs    = require('fs');
const path  = require('path');
const util  = require('util');

exports.getPath       = getPath;
exports.checkIfExists = checkIfExists;
exports.getStat       = getStat;
exports.getFiles      = getFiles;
exports.getFile       = getFile;
exports.getFilePath   = getFilePath;

/**
 *
 * @param {String} fileName
 * @param {String} (altPath)
 * @returns {Promise}
 */
async function checkIfExists (fileName, altPath=null) {
  return util.promisify(fs.open)(getPath(fileName, altPath), 'r')
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
    exists = await checkIfExists(fileName, altPath);
  } catch(e) {
    return Promise.reject(e);
  }
  if (!exists) return Promise.reject(new Error('file not found'));
  return util.promisify(fs.stat)(getPath(fileName, altPath));
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
    exists = await checkIfExists(dir, altPath);
  } catch(e) {
    return Promise.reject(e);
  }
  if (!exists) return Promise.reject(new Error('dir not found'));
  return util.promisify(fs.readdir)(getPath(dir, altPath));
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
    exists = await checkIfExists(file, altPath);
  } catch(e) {
    return Promise.reject(e)
  }
  if (!exists) return Promise.reject(new Error('file not found'));
  return util.promisify(fs.readFile)(getPath(file, altPath)).then(file => file.toString());
}

/**
 *
 * @param {String} file
 * @param {String} (altPath)
 */
async function getFilePath(file, altPath=null) {
  let exists;
  try {
    exists = await checkIfExists(file, altPath);
  } catch(e) {
    return Promise.reject(e);
  }
  if (!exists) return Promise.reject(new Error('file not found'));
  return getPath(file, altPath);
}

/**
 *
 * @param {String} name
 * @param {String} (pathName) - defaults to current directory
 * @returns {String}
 */
function getPath(name, pathName) {
  pathName = pathName || process.cwd();
  return path.resolve(pathName, name);
}