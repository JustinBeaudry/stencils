Stencils
=============

**DISCLAIMER:  This is an alpha project and as such has not settled on a stable API.<br/>**

A simple CLI tool for writing and generating templates for projects; a simplified yeoman.

## Getting Started

### Installation

```javascript
  npm i -g stencils
```

### Template rc file

Each project requires a `.stlrc` file, and `.stencils` directory to be located in your projects root.</br>
Projects should always be initialized with `stl init`.

### Setting up project templates
   
At it's core Stencils is just a CLI over a template engine.<br/>
It uses a structured filesystem format to store the templates in the project.

New templates can be added via the cli with `stl add templateName`.<br/>
It's important to add new templates via the cli so that the files have their appropriate meta files.
 
### Listing project templates 

`stl ls` will list all available templates

### Editing templates

Since templates are just text files any text editor can edit them.<br/>
For convenience you can open the files via `stl open templateName`<br/> 
Or specify an application with `stl open -a WebStorm templateName`
 
### Creating project files from templates

Once there are templates available to use run `stl use templateName`

### Template Engine settings

Stencils supports Ejs and Mustache out-of-the-box, but defaults to ejs.<br/>
Each of these template engines can be configured in the `.stlrc` file.

For example with ejs:
```javascript
  {
    "version": "0.8.5-alpha",
    "engine": "ejs",
    "ejs": {
      "delimiter": "@" 
    }
  }
```

or with mustache
```javascript
  {
    "version": "0.8.5-alpha",
    "engine": "mustache",
    "mustache": {
      "tags": ["<%", "%>"] 
    }
  }
```
the default engine can be overridden at run-time by passing the `--engine` flag with the name of the engine.

```bash
 stl add service --engine mustache
```

The order of operations for how stencils decides which engine to use is from left to right, where left has the most authority
cli -> config -> default

It's important to note that files added with different engines are considered different templates and will be displayed</br>
with their appropriate engine when running `stl ls`

## Roadmap

* `0.5.0-alpha`   - ~~support for meta files and template reading for data population~~
* `0.7.0-alpha`   - ~~add command class and extend each command from class (will be used to hold some option)~~
* `0.8.0-alpha`   - ~~change default engine to ejs~~
* `0.8.5-alpha`   - ~~support ejs/mustache options (including custom delimiter/tags)~~
* `0.9.0-alpha`   - support user level rc file, support rc file find up (similar to .npmrc behavior)
* `0.20.0-alpha`  - unit and integration tests
* `0.30.0-alpha`  - support for directory type templates
* `0.40.0-alpha`  - support for groups (defaults to local)
* `0.45.0-alpha`  - get jsdoc working
* `0.50.0-alpha`  - add bash auto completion support
* `0.54.0-alpha`  - update help text and cli output text
* `0.56.0-alpha`  - simplify README
* `0.58.0-beta`   - beta release
* `1.0.0-rc1`     - release candidate
* `1.0.0`         - public release

## Feature Ideas

* remote templates
* core templates (pre-established templates) using the groups feature TBD in `0.30.0-alpha`
* symlink templates

## Want to help or have an idea?<br/>
[Create feature request ticket](https://github.com/JustinBeaudry/stencils/issues/new?labels=feature%20request)
or
[Email](beaudry.justin@gmail.com)