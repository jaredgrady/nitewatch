'use strict';
/**
 *
 * Test cases for nitewatch
 *
 * @file   test.js
 * @author Jared Grady
 *
**/
const assert = require("assert");
const path = require('path');
const nitewatch = require(path.resolve(__dirname, "..", "src", "nitewatch.js"));
const Options = require(path.resolve(__dirname, "..", "src", "options.js"));

describe('parseYaml tests', function() {
	describe('#options.parseYaml(".")', function() {
		it('Should parse the yaml in tests and build the correct options', function() {
			let options = new Options(path.join(__dirname));
			console.log(options);
			assert.ok(options.ignoredFiles["src/testhelper.js"]);
			assert.ok(options.ignoredDirs["node_modules"]);
		});
	});

	describe('#options.parseYaml("../")', function() {
		it('Should use default options since yaml cannot be found', function() {
			let options = new Options(path.join(__dirname + "../"));
			assert.equal(Object.keys(options.ignoredFiles), 0);
			assert.equal(Object.keys(options.ignoredDirs), 0);
		});
	});
});

describe('nitewatch tests', function() {
	let opts = new Options();
	opts.parseYaml(path.join(__dirname));

	describe('#nitewatch.isIgnoredDir("test", ignoredDirs, ignoredDirsGlobs)', function() {
		it('Should return true because test is in ignored directories', function() {
			assert.ok(nitewatch.isIgnoredDir("test", opts.ignoredDirs, opts.ignoredDirsGlobs));
		});
	});

	describe('#nitewatch.isIgnoredDir("test", ignoredDirs, ignoredDirsGlobs)', function() {
		it('Should return false because src is not ignored', function() {
			assert.ok(!nitewatch.isIgnoredDir("src", opts.ignoredDirs, opts.ignoredDirsGlobs));
		});
	});

	describe('#nitewatch.isIgnoredFile(".eslintrc", ignoredDirs, ignoredDirsGlobs)', function() {
		it('Should return true because .eslintrc is an ignored file', function() {
			assert.ok(!nitewatch.isIgnoredFile("src", opts.ignoredFiles, opts.ignoredFilesGlobs));
		});
	});

	describe('#nitewatch.isIgnoredFile("test", ignoredFiles, ignoredFilesGlobs)', function() {
		it('Should return false because index.js is not an ignored file', function() {
			assert.ok(!nitewatch.isIgnoredFile("index.js", opts.ignoredFiles, opts.ignoredFilesGlobs));
		});
	});

	describe('#nitewatch.isIgnoredFile("*.json", ignoredFiles, ignoredFilesGlobs)', function() {
		it('Should return true because package.json should match the pattern', function() {
			assert.ok(nitewatch.isIgnoredFile("package.json", opts.ignoredFiles, opts.ignoredFilesGlobs));
		});
	});
});

