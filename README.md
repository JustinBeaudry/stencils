Stencils
=============

A simple CLI tool for writing and generating templates for projects. Template CLI is a simplified yeoman.

## Getting Started

### Installation

```javascript
  npm i -g stencils
```

### Template rc file

Each project requires a `.tmplrc` file, and `.templates` directory to be located in your projects root.</br>
Projects should always be initialized with `stpl init` or `stpl i`

### Setting up project templates
   
At it's core Template CLI is just a CLI over a template engine.<br/>
It uses a structured filesystem format to store the templates in the project.

New templates can be added manually in `.templates/entity.ext`.

e.g. `.templates/service.ext`, `.templates/model.ext`, `.templates/component.ext`  

or via the cli with `stpl create templateName`.
 
### Creating project files from templates

With a library of templates ready to be used `tmpl use` is your friend. Let's start with an example.

```bash
  stpl use service
```

The command above will create a file based on the template at `.templates/service.ext`.<br/>