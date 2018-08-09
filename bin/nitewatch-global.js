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
const nitewatch = require(path.resolve(__dirname, '../src/index.js'));

const options = [
	{name: 'command', type: String, multiple: true, defaultOption: true},
	{name: 'scripts', alias: 's', type: String, multiple: true},
	{name: 'ignoredfiles', alias: 'i', type: String, multiple: true},
	{name: 'ignoreddirs', alias: 'd', type: String, multiple: true},
	{name: 'yaml', alias: 'y', type: String}];

function main() {
	const args = commandLineArgs(options);
	let userOpts = {};

	if ("scripts" in args) userOpts.scripts = args.scripts;
	if ("ignoredfiles" in args) userOpts.ignoreFiles = args.ignoredfiles;
	if ("ignoreddirs" in args) userOpts.ignoredDirs = args.ignoreddirs;

	if ("yaml" in args) userOpts = args.yaml;

	if ("command" in args) {
		if (args.command[0] === 'watch') {
			nitewatch.watchFiles(args.command.slice(1), userOpts);
			return;
		}
	}
	nitewatch.watch(userOpts);
}

main();