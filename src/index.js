'use strict';
/**
 *
 * nitewatch main file
 *
 * @file   index.js
 * @author Jared Grady
 *
**/
const exec = require('child_process').exec;
const fs = require('fs');
const md5 = require('md5');

/**
 * Adds a file to the watch list and
 * begins observing.
 * Once a file change is noticed, the
 * passed scripts is executed.
 *
 * @param {string} file
 * @param {array} scripts
 *
**/
const watchFile = function (file, scripts) {
	let md5Hash = null;
	let wait = false;

	fs.watch(file, (event, filename) => {
		if (filename && !wait) {
			wait = setTimeout(() => {
				wait = false;
			}, 100);

			const md5Cur = md5(fs.readFileSync(file));
			if (md5Cur !== md5Hash) {
				md5Hash = md5Cur;
				console.log(`${filename} modified. Running user scripts`);

				scripts.forEach(script => {
					if (script) {
						exec(script, (error, stdout, stderr) => {
							if (stdout.length > 0) console.log(`${stdout}`);
							if (stderr.length > 0) console.log(`${stderr}`);

							if (error !== null) {
								console.log(`exec error: ${error}`);
							}
						});
					} else {
						console.log(`Could not run script: ${script}`);
					}
				});
			}
		}
	});
};

/**
 * Checks if the current file should be ignored
 *
 * @param {string} file
 * @param {string} dir
 * @param {array}  ignore
 *
**/
const validFile = function (file, dir, ignore) {
	if (!file) return false;
	if (fs.lstatSync(`${dir}/${file}`).isDirectory()) return false;
	if (ignore.includes(file)) return false;
	return true;
};

/**
 * If a user created yml is in the isDirectory
 * use it to define options for nitewatch
**/
const parseYml = function (path) {
	const yaml = require("js-yaml");
	let opts = null;

	try {
		opts = yaml.safeLoad(fs.readFileSync(path));
	} catch (e) {
		console.log("Unable to read .nitewatch.yml. Using default options instead.");
		return opts;
	}

	console.log("Found .nitewatch.yml. Reading options...");
	return opts;
};

/**
 * Checks the options for the nitewatch
 *
 * @param {object} options
 * @return {object}
**/
const parseOptions = function (options) {
	let dirs = null;
	let ignore = null;
	let scripts = null;
	let yaml = `${process.cwd()}/.nitewatch.yml`;

	if (!options) {
		if (fs.existsSync(yaml)) {
			options = parseYml(yaml);
		} else {
			console.log("No user options provided and no .nitewatch.yml was found. Using default options.");
		}
	}

	if ("yaml" in options) {
		if (fs.existsSync(yaml)) {
			let yamlOptions = parseYml(options.yaml);

			if (yamlOptions) {
				if ("ignore" in yamlOptions) options.ignore = yamlOptions.ignore;
				if ("dirs" in yamlOptions) options.dirs = yamlOptions.dirs;
				if ("scripts" in yamlOptions) options.scripts = yamlOptions.scripts;
			}
		} else {
			console.log(`Could not find .nitewatch.yaml in ${options.yaml}. Using default options.`);
		}
	}

	if (options) {
		if ("dirs" in options) dirs = options.dirs;
		if ("ignore" in options) ignore = options.ignore;
		if ("scripts" in options) scripts = options.scripts;
	}

	return {
		dirs: dirs || [process.cwd()],
		ignore: ignore || [],
		scripts: scripts || [],
	};
};

/**
 * Main function, begins watching files
 * for changes.
 *
 * @param {optional} userOptions
 *
**/
const watch = function (userOptions = null) {
	process.title = "nitewatch";
	const options = parseOptions(userOptions);

	console.log("Starting nitewatch and listening for file changes...");
	options.dirs.forEach(dir => {
		fs.readdir(dir, (err, files) => {
			if (options.ignore.includes(dir)) return;
			files.forEach(file => {
				if (validFile(file, dir, options.ignore)) {
					watchFile(`${dir}/${file}`, options.scripts);
				}
			});
		});
	});
};

module.exports.watch = watch;
module.exports.validFile = validFile;
module.exports.parseOptions = parseOptions;
module.exports.parseYml = parseYml;
