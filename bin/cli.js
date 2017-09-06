#!/usr/bin/env node
'use strict';

const pkg = require('../package.json');
const _ = require('lodash');
const yargs = require('yargs');

const COMMANDS = {
  Init: require('../lib/commands/init'),
  Add: require('../lib/commands/add'),
  Use: require('../lib/commands/use'),
  List: require('../lib/commands/list'),
  Open: require('../lib/commands/open'),
  Print: require('../lib/commands/print')
};

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
  .option('extension', {
    alias: 'ext',
    describe: 'override template extension'
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
    argv => new COMMANDS.Init().execute(argv)
  )
  .command([
      'add <name>',
      'a'
    ],
    'add a blank template file',
    _.noop,
    argv => new COMMANDS.Add().execute(argv)
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
    argv => new COMMANDS.Use().execute()
  )
  .command([
      'list',
      'ls',
      'l'
    ],
    'list all templates',
    _.noop,
    argv => new COMMANDS.List().execute(argv)
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
    argv => new COMMANDS.Open().execute(argv)
  )
  .command([
      'print <name>',
      'p'
    ],
    'print template to console',
    _.noop,
    argv => new COMMANDS.Print().execute(argv)
  )
  .usage('$0 <cmd> [args]')
  // @TODO:  add bash auto-complete
  .help()
  .wrap(70)
  .version(pkg.version)
  .argv
