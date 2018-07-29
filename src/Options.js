'use strict';
/**
 *
 * nitewatch options class
 *
 * @file   Options.js
 * @author Jared Grady
 *
**/
const fs = require('fs');
const path = require('path');

class Options {
	constructor() {
		this.ignoredFiles = {};
		this.ignoredFilesGlobs = [];
		this.ignoredDirs = {};
		this.ignoredDirsGlobs = [];
		this.scripts = [];
	}

	userObjOptions(options) {
		this.ignoreFiles = options.ignoreFiles;
		this.ignoredDirs = options.ignoredDirs;
		this.scripts = options.scripts;
	}

	setUserIgnoredFiles(files) {
		this.ignoreFiles = files;
	}

	setUserIgnoredDirs(dirs) {
		this.ignoredDirs = dirs;
	}

	setUserScripts(scripts) {
		this.scripts = scripts;
	}

	parseYaml(yamlPath) {
		const yaml = require("js-yaml");
		let opts = null;

		try {
			opts = yaml.safeLoad(fs.readFileSync(path.join(yamlPath, ".nitewatch.yml")));
		} catch (e) {
			console.log(`Unable to read ${path.join(yamlPath, ".nitewatch.yml")}. Using default options instead.`);
			return opts;
		}

		console.log("Found .nitewatch.yml. Reading options...");
		for (let file of opts.ignoreFiles) {
			this.ignoredFiles[file] = true;
			this.ignoredFilesGlobs.push(file);
		}

		for (let dir of opts.ignoredDirectories) {
			this.ignoredDirs[dir] = true;
			this.ignoredDirsGlobs.push(dir);
		}

		for (let script of opts.scripts) {
			this.scripts.push(script);
		}
	}
}

module.exports = Options;
