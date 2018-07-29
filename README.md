# nitewatch [![travis Status](https://travis-ci.org/TheFenderStory/nitewatch.svg?branch=master)](https://travis-ci.org/TheFenderStory/nitewatch) [![dependencies Status](https://david-dm.org/thefenderstory/nitewatch/status.svg)](https://david-dm.org/thefenderstory/nitewatch) [![devDependencies Status](https://david-dm.org/thefenderstory/nitewatch/dev-status.svg)](https://david-dm.org/thefenderstory/nitewatch?type=dev)
nitewatch monitors files within your project for changes and then automatically runs scripts or commands 
you have to defined. For example, nitewatch can automatically recompile code in a project when a file is modified,
sparing you the overhead and letting you focus on writing code.

## Notice
nitewatch is under active development and breaking changes may occur. Use with caution.

## Install

Install globally
```
$ npm install -g nitewatch
```

Or within a project 
```
$ npm install nitewatch --save
```

## Usage
nitewatch can be run within another script:
```js
const nitewatch = require("nitewatch");
   
let options = {
  ignore: ["example", "example2"],
	scripts: ["example_script"],
};
    
nitewatch.watch(options);     
```

nitewatch can also be ran from the command line when installed globally
```
nitewatch -d app test -s "echo Hello World!" --ignore "logs"
```

If a .nitewatch.yml is found in the directory when nitewatch is run or a path to a yaml is supplied with the -y option
nitewatch will use the yaml defined options.

## options
From the command line:
```
-d, --dirs: list of directories to watch
-i, --ignore: list of files and directories to ignore
-s, --scripts: list of scripts or commands to run on file change
-y, --yaml: path to yaml file for options
```

In code:
```js   
let options = {
  ignore: ["example", "example2"],
	scripts: ["example_script"],
  dirs: ["app", "test", "."],
};
```

Using .nitewatch.yml
```yaml
dirs:
    - ./
    - src
    - test
ignore:
    - test
    - node_modules
    - README.md
scripts:
    - echo hi
```

## License

MIT © Jared Grady
