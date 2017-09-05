'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const util = require('util');

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
exports.getTemplates = getTemplates;
exports.getTemplate = getTemplate;
exports.getMeta = getMeta;
exports.print = print;

async function checkIfExists (fileName) {
  return new Promise((resolve, reject) => {
    fs.open(getPath(fileName), 'r', err => {
      const isNotExistent = err && err.code === 'ENOENT';
      // check if there's an error and that the file exists before rejecting with an err
      if (err && !isNotExistent) return reject(err);
      resolve(!isNotExistent)
    });
  });
}

async function getStat(fileName) {
  let exists;
  try {
    exists = await checkIfExists(fileName);
  } catch(e) {
    return e;
  }
  if (!exists) return new Error('file not found');
  return util.promisify(fs.stat)(getPath(fileName));
}

async function getFiles(dir) {
  let exists;
  try {
    exists = await checkIfExists(dir);
  } catch(e) {
    return e;
  }
  if (!exists) return new Error('dir not found');
  return util.promisify(fs.readdir)(getPath(dir)).then(file => file.toString());
}

async function getFile(file) {
  let exists;
  try {
    exists = await checkIfExists(file);
  } catch(e) {
    return e
  }
  if (!exists) return Promise.reject(new Error('file not found'));
  return util.promisify(fs.readFile)(getPath(file)).then(file => file.toString());
}

async function getTemplates(templatesDir, templateExt) {
  let files;
  try {
    files = await getFiles(templatesDir);
  } catch(e) {
    return e;
  }
  if (!files) return Promise.reject(new Error('no templates found'));

  return files
    .filter(file => path.extname(file) === templateExt)
    .map(file => `+ ${file.slice(0, -4)}`);
}

async function getTemplate(templatesDir, template, templateExt) {
  let file;
  let pathName = path.join(templatesDir, template + templateExt);
  try {
    file = await getFile(pathName);
  } catch(e) {
    return Promise.reject(e);
  }
  if (!file) return Promise.reject(new Error('template not found'));

  return file;
}

async function getMeta(templatesDir, template, templateExt) {
  let file;
  try {
    file = await getTemplate(templatesDir, template, templateExt + '.meta');
  } catch(e) {
    return Promise.reject(e);
  }
  try {
    file = JSON.parse(file);
  } catch(e) {
    return Promise.reject(e);
  }
  return file;
}

function getMsgTemplate(msg) {
  return `${msg}`;
}

function getPath(name) {
  return path.resolve(process.cwd(), name);
}