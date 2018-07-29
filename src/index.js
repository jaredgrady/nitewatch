'use strict';
/**
 *
 * nitewatch main file
 *
 * @file   index.js
 * @author Jared Grady
 *
**/
const path = require('path');
process.title = "nitewatch";
module.exports.watch = require(path.resolve(__dirname, 'nitewatch.js')).watch;