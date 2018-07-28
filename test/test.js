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
const nitewatch = require("../src/index.js");

describe('validFile tests', function() {
	describe('#validFile("test.js", ".", ["test.js"])', function() {
		it('Should return false if the file is ignored', function() {
			assert.equal(nitewatch.validFile("test.js", `${process.cwd()}/test`, ["test.js"]), false);
		});
	});

	describe('#validFile("test.js", ".", ["example"])', function() {
		it('Should return true if the file should be watched', function() {
			assert.equal(nitewatch.validFile("test.js", `${process.cwd()}/test`, ["example"]), true);
		});
	});
});

describe('parseOptions tests', function() {
	describe('#parseOptions({vals})', function() {
		it('Should return options set by the user via an options object', function() {
			let options = nitewatch.parseOptions({
				ignore: ["example", "example2"],
				scripts: ["example_script"],
			});
			assert.equal(options.ignore[0], "example");
			assert.equal(options.ignore[1], "example2");
			assert.equal(options.scripts[0], "example_script");
			assert.equal(options.dirs[0], process.cwd());
		});
	});

	describe('#parseOptions()', function() {
		it('Should return options set by the user via an options object', function() {
			let options = nitewatch.parseOptions();
			assert.equal(options.ignore.length, 3);
			assert.equal(options.scripts.length, 1);
			assert.equal(options.dirs[0], "./");
		});
	});
});

describe('parseYml tests', function() {
	describe('#parseYml(path)', function() {
		it('Should read in .nitewatch.yml and parse options from it', function() {
			let options = nitewatch.parseYml("./.nitewatch.yml");
			assert.equal(options.dirs.includes("src"), true);
			assert.equal(options.ignore.includes("test"), true);
			assert.equal(options.scripts.includes("echo hi"), true);
		});
	});
});