Template CLI
=============

A simple tool for writing and generating templates for projects. Template CLI is a simplified yeoman.

## Getting Started

### Template RC file

Each project requires a `.tmplrc` file, and `.templates` directory to be located in your projects root.<br/>
You can create it yourself or via the cli with `tmpl init` or `tmpl i`. <br/>
The RC file serves as a configuration file for the Template CLI. 

### Setting up Project Templates
   
At it's core Template CLI is just a CLI over the mst template engine.<br/>
It uses a structured filesystem format to store the templates in the project.

New templates can be added manually in `.templates/entity.mst`.

e.g. `.templates/service.mst`, `.templates/model.mst`, `.templates/component.mst`  

or via the cli with `tmpl create templateName`.
 
### Creating Project Templates

With a library of templates ready to be used `tmpl new` is your friend. Let's start with an example.

```bash
  tmpl use service
```

The command above will render the mustache template at `.templates/service.mst`.<br/>
The keys included that file will display a specific type of interface for entering information.

## License

Copyright 2017 Justin Beaudry

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.