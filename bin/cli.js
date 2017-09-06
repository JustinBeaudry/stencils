#!/usr/bin/env node

/**
 *
 * Stencils CLI
 * Copyright 2017 Justin Beaudry (beaudry.justin@gmail.com)
 *
 * Licensed under MIT License
 *
 * SEE LICENSE.md
 */

'use strict';

/**
 * @file cli
 * @author Justin Beaudry <beaudry.justin@gmail.com>
 * @project Stencils CLI
 * @license {@link https://opensource.org/licenses/MIT}
 */

/**
 *
 * Stencils CLI
 *
 * @module cli
 * @public
 *
 */

const pkg = require('../package.json');
const _ = require('lodash');
const yargs = require('yargs');

const InitCommand = require('../lib/commands/init');
const AddCommand = require('../lib/commands/add');
const UseCommand = require('../lib/commands/use');
const ListCommand = require('../lib/commands/list');
const OpenCommand = require('../lib/commands/open');
const PrintCommand = require('../lib/commands/print');

const init = new InitCommand();
const add = new AddCommand();
const use = new UseCommand();
const list = new ListCommand();
const open = new OpenCommand();
const print = new PrintCommand();

yargs
  .option('verbose', {
    alias: 'v',
    describe: 'output additional logging',
    default: false
  })
  .option('engine', {
    alias: 'e',
    describe: 'override the template rendering engine.'
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
    argv => init.execute(argv)
  )
  .command([
      'add <name>',
      'a'
    ],
    'add a blank template file',
    _.noop,
    argv => add.execute(argv)
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
    argv => use.execute(argv)
  )
  .command([
      'list',
      'ls',
      'l'
    ],
    'list all templates',
    _.noop,
    argv => list.execute(argv)
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
    argv => open.execute(argv)
  )
  .command([
      'print <name>',
      'p'
    ],
    'print template to console',
    _.noop,
    argv => print.execute(argv)
  )
  .usage('$0 <cmd> [args]')
  // @TODO:  add bash auto-complete - 0.60.0-alpha
  .help()
  .wrap(70)
  .version(pkg.version)
  .argv
