Stencils
=============

A simple CLI tool for writing and generating templates for projects. Template CLI is a simplified yeoman.

## Getting Started

### Installation

```javascript
  npm i -g stencils
```

### Template rc file

Each project requires a `.stplrc` file, and `.templates` directory to be located in your projects root.</br>
Projects should always be initialized with `stpl init`.

### Setting up project templates
   
At it's core Stencils is just a CLI over a template engine.<br/>
It uses a structured filesystem format to store the templates in the project.

New templates can be added via the cli with `stpl add templateName`.<br/>
It's important to add new templates via the cli so that the files have their appropriate meta files.
 
### Listing project templates 

`stpl ls` will list all available templates

### Editing templates

Since templates are just text files any text editor can edit them.<br/>
For convenience you can open the files via `stpl open templateName`<br/> 
Or specify an application with `stpl open -a WebStorm templateName`
 
### Creating project files from templates

Once there are templates available to use run `stpl use templateName`

```bash
  stpl use service
```

The command above will create a file based on the template at `.templates/service.ext`.<br/>

## Roadmap

* `0.5.0`   - support for meta files and template reading for data population
* `0.8.0`   - support for groups (defaults to local)
* `1.0.0`   - release candidate
