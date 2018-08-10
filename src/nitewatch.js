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
let running = false;

class Nitewatch {
	/**
	 * Checks if the directory should be ignored
	 *
	 * @param {String} dir
	 * @param {object} ignoredDirs
	 * @param {array} ignoredDirsGlobs
	 *
	**/
	static isIgnoredDir(dir, ignoredDirs, ignoredDirsGlobs) {
		if (dir in ignoredDirs) return true;

		for (let glob of ignoredDirsGlobs) {
			if (match(dir, glob)) return true;
		}
		return false;
	}

	/**
	 * Checks if the file should be ignored
	 *
	 * @param {String} file
	 * @param {object} ignoredFiles
	 * @param {array} ignoredFilesGlobs
	 *
	**/
	static isIgnoredFile(file, ignoredFiles, ignoredFilesGlobs) {
		if (file in ignoredFiles) return true;

		for (let glob of ignoredFilesGlobs) {
			if (match(file, glob)) return true;
		}
		return false;
	}

	/**
	 * Executes user scripts when a file is changed
	 *
	 * @param {array} scripts
	 *
	**/
	static execScripts(scripts) {
		running = true;
		scripts.forEach(script => {
			if (script) {
				exec(script, (error, stdout, stderr) => {
					// if (stdout.length > 0) console.log(`${stdout}`);
					// if (stderr.length > 0) console.log(`${stderr}`);
					if (stdout.length > 0) console.log(`${stdout.trim()}`);
					if (stderr.length > 0) console.log(`${stderr.trim()}`);

					if (error !== null) {
						console.log(`exec error: ${error}`);
					}
					running = false;
				});
			} else {
				console.log(`Could not run script: ${script.trim()}`);
			}
		});
	}

	/**
	 * Sets up the file listener and begins
	 * watching for file changes
	 *
	 * @param {string} basedir
	 * @param {String} file
	 * @param {array} scripts
	 *
	**/
	static watchFile(filepath, hash, scripts) {
		let md5Hash = hash;
		let wait = false;

		fs.watch(filepath, (event, filename) => {
			if (filename && !wait) {
				wait = setTimeout(() => {
					wait = false;
				}, 100);
				if (!running) {
					const md5Cur = md5(fs.readFileSync(filepath));
					if (md5Cur !== md5Hash) {
						md5Hash = md5Cur;
						console.log(`${filename} modified. Running user scripts`);
						Nitewatch.execScripts(scripts);
					}
				}
			}
		});
	}

	/**
	 * Recursively walk through file tree and adds files
	 * for watching.
	 *
	 * @param {String} dir
	 * @param {Options} opts
	 *
	**/
	static walkDir(dir, opts) {
		walk.walk(dir, function (basedir, file, stat, next) {
			let fullpath = path.join(basedir, file);
			if (stat.isDirectory()) {
				if (!Nitewatch.isIgnoredDir(file, opts.ignoredDirs, opts.ignoredDirsGlobs)) {
					Nitewatch.walkDir(fullpath, opts);
				}
			} else {
				if (!Nitewatch.isIgnoredFile(file, opts.ignoredFiles, opts.ignoredFilesGlobs)) {
					Nitewatch.watchFile(fullpath, md5(fs.readFileSync(fullpath)), opts.scripts);
				}
			}
		}, function (err) {
			if (err) console.log(err);
		});
	}

	/**
	 * Watches the passed in list of files or directories
	 * for changes.
	 *
	 * @param {array} files
	 * @param {optional} userOpts
	 *
	**/
	static watchFiles(files, userOpts = null) {
		let options = new Options(userOpts);
		console.log("Starting nitewatch and listening for file changes...");
		for (let file of files) {
			fs.lstat(file, function (err, stat) {
				if (err) {
					console.log(`No such file or directory: ${file}`);
				} else {
					if (stat.isFile()) {
						Nitewatch.watchFile(path.join(process.cwd(), file), options.scripts);
					} else if (stat.isDirectory()) {
						Nitewatch.walkDir(path.join(process.cwd(), file), options);
					}
				}
			});
		}
	}

	/**
	 * Main function, begins watching files
	 * for changes.
	 *
	 * @param {optional} userOpts
	 *
	**/
	static watch(userOpts = null) {
		let options = new Options(userOpts);
		console.log("Starting nitewatch and listening for file changes...");
		Nitewatch.walkDir(options.workingDir, options);
	}
}

module.exports = Nitewatch;
