#!/usr/bin/env node
'use strict';

const pkg = require('../package.json');
const _ = require('lodash');
const yargs = require('yargs');
const utils = require('../lib/utils');
const path = require('path');
const chalk = require('chalk');

const Mustache = require('../lib/template/engine/mustache');
const Ejs = require('../lib/template/engine/ejs');

let options = {
  configFilePath: '.stplrc',
  templatesDir: '.templates',
  engine: 'mustache'
};

const ENGINES = {
  mustache: new Mustache(),
  ejs: new Ejs(),
};

yargs
  .option('verbose', {
    alias: 'v',
    describe: 'output additional logging',
    default: false
  })
  .option('engine', {
    alias: 'e',
    describe: 'override the template rendering engine.',
    default: 'mustache'
  })
  .option('extension', {
    alias: 'ext',
    describe: 'override template extension',
    default: ENGINES.mustache.extension
  })
  .command([
      'init',
      'i'
    ],
    'init a project with a .tmplrc file, and .templates dir',
    yargs => {
      yargs.option('force', {
        alias: 'f',
        describe: 'force new rc file and templates directory.'
      })
    },
    argv => command(require('../lib/commands/init'), argv).catch(utils.print.error)
  )
  .command([
      'add <name>',
      'a'
    ],
    'add a blank template file',
    _.noop,
    argv => command(require('../lib/commands/add'), argv).catch(utils.print.error)
  )
  .command([
      'use <name> [fileName]',
      'u'
    ],
    'create a file from a template',
    yargs => {
      yargs.option('force', {
        alias: 'f',
        describe: 'force overwrite of file creation'
      })
    },
    argv => command(require('../lib/commands/use'), argv).catch(utils.print.error)
  )
  .command([
      'list',
      'ls',
      'l'
    ],
    'list all templates',
    _.noop,
    argv => command(require('../lib/commands/list'), argv).catch(utils.print.error)
  )
  .command([
      'open <name>',
      'o'
    ],
    'open template file',
    yargs => {
      yargs
        .option('application', {
          alias: 'a',
          describe: 'application to open file with',
          default: 'Sublime Text'
        })
    },
    argv => command(require('../lib/commands/open'), argv).catch(utils.print.error)
  )
  .command([
      'print <name>',
      'p'
    ],
    'print template to console',
    _.noop,
    argv => command(require('../lib/commands/print'), argv).catch(utils.print.error)
  )
  .usage('$0 <cmd> [args]')
  // @TODO:  add bash auto-complete
  .help()
  .wrap(70)
  .version(pkg.version)
  .argv

async function command(commandFn, argv) {
  const engine = ENGINES[argv.engine];
  if (!engine) return new Error(`unsupported engine requested:  ${argv.engine}`);

  argv.engine = engine;
  argv.extension = engine.extension;

  let file;
  let opts = {};
  try {
    file = await utils.getFile(options.configFilePath);
  } catch(e) {
    // prevent calls to init from not continuing
    if (argv._.indexOf('init') === -1) {
      utils.print.warn(`not a stencils project. ${chalk.bold.cyan('stpl init')} to initialize project for use with stencils.`);
      return Promise.resolve();
    }
  }
  try {
    file = JSON.parse(file);
  } catch(e) {
    if (argv._.indexOf('init') === -1) {
      utils.print.error('error parsing .stplrc file');
      return Promise.reject();
    }
  }

  if (file) {
    Object.assign(opts, options, file, argv);
  } else {
    Object.assign(opts, options, argv);
  }

  if (options.verbose) {
    utils.print.info(`\n${pkg.name}@v${pkg.version}\n`);
  }

  return commandFn(opts);
}

