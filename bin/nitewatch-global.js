#!/usr/bin/env node
/**
 *
 * nitewatch global file
 *
 * @file   index.js
 * @author Jared Grady
 *
**/
'use strict';
const commandLineArgs = require('command-line-args');
const nitewatch = require("../src/index.js");
const options = commandLineArgs([
  { name: 'scripts', alias: 's', type: String, multiple: true},
  { name: 'ignore', alias: 'i', type: String, multiple: true },
  { name: 'dirs', alias: 'd', type: String, multiple: true },
  { name: 'yaml', alias: 'y', type: String }
]);

if (Object.keys(options).length > 0) {
  nitewatch.watch(options);
} else {
  nitewatch.watch();
}
