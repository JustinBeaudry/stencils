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

```bash
  stpl use service
```

## Roadmap

* `0.5.0-alpha`   - ~~support for meta files and template reading for data population~~
* `0.7.0-alpha`   - ~~add command class and extend each command from class (will be used to hold some option)~~
* `0.8.0-alpha`   - centralize logging to use bunyan
* `0.10.0-alpha`  - change default engine to ejs
* `0.20.0-alpha`  - support for directory type templates
* `0.30.0-alpha`  - support for groups (defaults to local)
* `0.35.0-alpha`  - add bash auto completion support
* `0.50.0-alpha`  - update help text and cli output text
* `0.80.0-alpha`  - unit and integration tests
* `0.90.0-alpha`  - contributor guide
* `0.91.0-beta`   - beta release
* `1.0.0-rc1`     - release candidate
* `1.0.0`         - public release

## Feature Ideas

* remote templates
* core templates (pre-established templates) using the groups feature TBD in `0.30.0-alpha`

## Want to help or have an idea?<br/>
[Create feature request ticket](https://github.com/JustinBeaudry/stencils/issues/new?labels=feature%20request)
or
[Email](beaudry.justin@gmail.com)