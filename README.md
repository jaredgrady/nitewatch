# nitewatch [![travis Status](https://travis-ci.org/TheFenderStory/nitewatch.svg?branch=master)](https://travis-ci.org/TheFenderStory/nitewatch) [![dependencies Status](https://david-dm.org/thefenderstory/nitewatch/status.svg)](https://david-dm.org/thefenderstory/nitewatch) [![devDependencies Status](https://david-dm.org/thefenderstory/nitewatch/dev-status.svg)](https://david-dm.org/thefenderstory/nitewatch?type=dev)
nitewatch monitors files within your project for changes and then automatically runs scripts or commands
you have to defined. For example, nitewatch can automatically recompile code in a project when a file is modified,
sparing you the overhead and letting you focus on writing code.

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

const userOpts = {
    ignoredFiles: {"test.js": true},
    ignoredDirs: {"node_modules": true},
    scripts: ["echo Hello World"],
};

nitewatch.watch(options);     
```

nitewatch can also be ran from the command line when installed globally
```
nitewatch -y "test" -s "./test.sh" -i "test.js" -d "node_modules" "logs"
```
nitewatch can also be ran on specific files and directories with the watch command
```
nitewatch watch src test.js -d .* node_modules
```

If a .nitewatch.yml is found in the directory when nitewatch is run or a path to a yaml is supplied with the -y option
nitewatch will use the yaml defined options.

## options
nitewatch will ignore files and directories specified in options. Entries can be
file or directory names or patterns.

From the command line:
```
-d, --dirs: list of directories to ignore
-i, --ignore: list of files to ignore
-s, --scripts: list of scripts or commands to run on file change
-y, --yaml: path to yaml file for options
```

Using .nitewatch.yml
```yaml
ignoreFiles:
    - ".eslintrc"
    - ".git"
    - ".gitignore"
    - "*.log"

ignoredDirectories:
    - node_modules
    - .git
    - test

scripts:
    - echo "Hello World!"
```

## License

MIT © Jared Grady
