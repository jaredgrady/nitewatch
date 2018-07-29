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
const path = require('path');
const commandLineArgs = require('command-line-args');
const nitewatch = require(path.resolve(__dirname, "../src/index.js"));

const options = commandLineArgs([
	{ name: 'scripts', alias: 's', type: String, multiple: true},
	{ name: 'ignoredfiles', alias: 'i', type: String, multiple: true},
	{ name: 'ignoreddirs', alias: 'd', type: String, multiple: true},
	{ name: 'yaml', alias: 'y', type: String }
]);
if (Object.keys(options).length > 0) {
	let ignoreFiles = {};
	let ignoreDirs = {};

	if ("ignoredfiles" in options) {
		for (let file of options.ignoredfiles) {
			ignoreFiles[file] = true;
		}
	}

	if ("ignoreddirs" in options) {
		for (let dir of options.ignoreddirs) {
			ignoreDirs[dir] = true;
		}
	}

	const userOpts = {
		ignoredFiles: ignoreFiles,
		ignoredDirs: ignoreDirs,
		scripts: [],
	};

	if ("scripts" in options) {
		userOpts.scripts = options.scripts;
	}

	if ("yaml" in options) userOpts["yamlPath"] = options.yaml;
	nitewatch.watch(userOpts, process.cwd());
} else {
	nitewatch.watch(null, process.cwd());
}
