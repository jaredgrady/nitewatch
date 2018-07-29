'use strict';
/**
 *
 * nitewatch
 *
 * @file   index.js
 * @author Jared Grady
 *
**/
const exec = require('child_process').exec;
const fs = require('fs');
const match = require('minimatch');
const md5 = require('md5');
const path = require('path');
const Options = require(path.resolve(__dirname, 'Options.js'));
const walk = require('fs-walk');

/**
 * Checks if the directory should be ignored
 *
 * @param {String} dir
 * @param {object} ignoredDirs
 * @param {array} ignoredDirsGlobs
 *
**/
const isIgnoredDir = function (dir, ignoredDirs, ignoredDirsGlobs) {
	if (dir in ignoredDirs) return true;

	for (let glob of ignoredDirsGlobs) {
		if (match(dir, glob)) return true;
	}
	return false;
};

/**
 * Checks if the file should be ignored
 *
 * @param {String} file
 * @param {object} ignoredFiles
 * @param {array} ignoredFilesGlobs
 *
**/
const isIgnoredFile = function (file, ignoredFiles, ignoredFilesGlobs) {
	if (file in ignoredFiles) return true;

	for (let glob of ignoredFilesGlobs) {
		if (match(file, glob)) return true;
	}
	return false;
};

/**
 * Executes user scripts when a file is changed
 *
 * @param {array} scripts
 *
**/
const execScripts = function (scripts) {
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
};

/**
 * Sets up the file listener and begins
 * watching for file changes
 *
 * @param {string} basedir
 * @param {String} file
 * @param {array} scripts
 *
**/
const watchFile = function (basedir, file, scripts) {
	let md5Hash = null;
	let wait = false;

	fs.watch(path.join(basedir, file), (event, filename) => {
		if (filename && !wait) {
			wait = setTimeout(() => {
				wait = false;
			}, 100);

			const md5Cur = md5(fs.readFileSync(path.join(basedir, file)));
			if (md5Cur !== md5Hash) {
				md5Hash = md5Cur;
				console.log(`${filename} modified. Running user scripts`);
				execScripts(scripts);
			}
		}
	});
};

/**
 * Recursively walk through file tree and adds files
 * for watching.
 *
 * @param {String} dir
 * @param {Options} opts
 *
**/
const walkDir = function (dir, opts) {
	walk.walk(dir, function (basedir, file, stat, next) {
		if (stat.isDirectory()) {
			if (!isIgnoredDir(file, opts.ignoredDirs, opts.ignoredDirsGlobs)) {
				walkDir(path.join(basedir, file), opts);
			}
		} else {
			if (!isIgnoredFile(file, opts.ignoredFiles, opts.ignoredFilesGlobs)) {
				watchFile(basedir, file, opts.scripts);
			}
		}
	}, function (err) {
		if (err) console.log(err);
	});
};

/**
 * Generate the options object for the runtime
 *
 * @param {object} userOpts
 * @param {String} cwd
 *
**/
const genOptions = function (userOpts, cwd) {
	const options = new Options();
	if (userOpts) {
		if ("yamlPath" in userOpts) {
			options.parseYaml(userOpts.yamlPath);
		}

		if (Object.keys(userOpts.ignoredFiles).length > 0) {
			options.setUserIgnoredFiles(userOpts.ignoredFiles);
		}

		if (Object.keys(userOpts.ignoredDirs).length > 0) {
			options.setUserIgnoredDirs(userOpts.ignoredDirs);
		}

		if (userOpts.scripts.length > 0) {
			options.setUserScripts(userOpts.scripts);
		}
	} else {
		options.parseYaml(cwd);
	}
	return options;
};

/**
 * Main function, begins watching files
 * for changes.
 *
 * @param {optional} userOptions
 *
**/
exports.watch = function (userOpts, cwd) {
	const options = genOptions(userOpts, cwd);
	walkDir(cwd, options);
	console.log("Starting nitewatch and listening for file changes...");
};

exports.test = {
	isIgnoredDir: isIgnoredDir,
	isIgnoredFile: isIgnoredFile,
};