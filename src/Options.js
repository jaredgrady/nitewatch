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
	constructor(userOpts) {
		this.ignoredFiles = {};
		this.ignoredFilesGlobs = [];
		this.ignoredDirs = {};
		this.ignoredDirsGlobs = [];
		this.scripts = [];
		this.workingDir = process.cwd();

		if (typeof userOpts === 'string' || userOpts instanceof String) {
			this.parseYaml(userOpts);
		} else if (userOpts) {
			this.setOptions(userOpts);
		} else {
			this.parseYaml(process.cwd());
		}
	}

	/**
	 * setter for ignoredFiles
	 *
	 * @param {array} files
	 *
	**/
	setIgnoredFiles(files) {
		for (let file of files) {
			this.ignoredFiles[file] = true;
			this.ignoredFilesGlobs.push(file);
		}
	}

	/**
	 * setter for ignoredDirs
	 *
	 * @param {array} dirs
	 *
	**/
	setIgnoredDirs(dirs) {
		for (let dir of dirs) {
			this.ignoredDirs[dir] = true;
			this.ignoredDirsGlobs.push(dir);
		}
	}

	/**
	 * setter for scripts
	 *
	 * @param {array} scripts
	 *
	**/
	setScripts(scripts) {
		for (let script of scripts) {
			this.scripts.push(script);
		}
	}

	/**
	 * Sets all options from the passed object
	 *
	 * @param {object} opts
	 *
	**/
	setOptions(opts) {
		if ("ignoreFiles" in opts) this.setIgnoredFiles(opts.ignoreFiles);
		if ("ignoredDirs" in opts) this.setIgnoredDirs(opts.ignoredDirs);
		// for backwards compatibility
		if ("ignoredDirectories" in opts) this.setIgnoredDirs(opts.ignoredDirectories);
		if ("scripts" in opts) this.setScripts(opts.scripts);
		if ("workingDir" in opts) this.workingDir = opts.workingDir;
	}

	/**
	 * Checks to see if a yaml file is present at the passed yamlPath
	 * and parses it for options
	 *
	 * @param {string} yamlPath
	 *
	**/
	parseYaml(yamlPath) {
		const yaml = require("js-yaml");
		let opts = null;

		try {
			opts = yaml.safeLoad(fs.readFileSync(path.join(yamlPath, ".nitewatch.yml")));
		} catch (e) {
			console.log(`Unable to read ${path.join(yamlPath, ".nitewatch.yml")}. Using default options instead.`);
			return;
		}

		console.log("Found .nitewatch.yml. Reading options...");
		this.setOptions(opts);
	}
}

module.exports = Options;
