Template CLI
=============

A simple tool for writing and generating templates for projects. Template CLI is a simplified yeoman.

## Getting Started

### Template rc file

Each project requires a `.tmplrc` file, and `.templates` directory to be located in your projects root.</br>
Projects should always be initialized with `tmpl init` or `tmpl i`

### Setting up project templates
   
At it's core Template CLI is just a CLI over a template engine.<br/>
It uses a structured filesystem format to store the templates in the project.

New templates can be added manually in `.templates/entity.ext`.

e.g. `.templates/service.ext`, `.templates/model.ext`, `.templates/component.ext`  

or via the cli with `tmpl create templateName`.
 
### Creating project files from templates

With a library of templates ready to be used `tmpl use` is your friend. Let's start with an example.

```bash
  tmpl use service
```

The command above will create a file based on the template at `.templates/service.ext`.<br/>