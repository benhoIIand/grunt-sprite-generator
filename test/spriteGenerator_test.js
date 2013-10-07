'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.spriteGenerator = {

  setUp: function(done) {
    // setup here if necessary
    done();
  },

  default_options: function(test) {
    test.expect(2);

    var actual, expected;

    actual = grunt.file.read('tmp/default_options.png');
    expected = grunt.file.read('test/expected/default_options.png');
    test.equal(actual, expected, 'should generate a sprite from the default options.');

    actual = grunt.file.read('tmp/default_options.css');
    expected = grunt.file.read('test/expected/default_options.css');
    test.equal(actual, expected, 'should generate and replace the correct css properties.');

    test.done();
  },

  absolute_path: function(test) {
    test.expect(2);

    var actual, expected;

    actual = grunt.file.read('tmp/absolute_path.png');
    expected = grunt.file.read('test/expected/absolute_path.png');
    test.equal(actual, expected, 'should generate a sprite with absolute paths.');

    actual = grunt.file.read('tmp/absolute_path.css');
    expected = grunt.file.read('test/expected/absolute_path.css');
    test.equal(actual, expected, 'should generate and replace the correct css properties.');

    test.done();
  },

  multiple_imports: function(test) {
    test.expect(3);

    var actual, expected;

    actual = grunt.file.read('tmp/multiple_imports.png');
    expected = grunt.file.read('test/expected/multiple_imports.png');
    test.equal(actual, expected, 'should generate a sprite from multiple imports.');

    actual = grunt.file.read('tmp/multiple_imports_1.css');
    expected = grunt.file.read('test/expected/multiple_imports_1.css');
    test.equal(actual, expected, 'should generate and replace the correct css properties.');

    actual = grunt.file.read('tmp/multiple_imports_2.css');
    expected = grunt.file.read('test/expected/multiple_imports_2.css');
    test.equal(actual, expected, 'should generate and replace the correct css properties.');

    test.done();
  },

  algorithm: function(test) {
    test.expect(2);

    var actual, expected;

    actual = grunt.file.read('tmp/algorithm_diagonal.png');
    expected = grunt.file.read('test/expected/algorithm_diagonal.png');
    test.equal(actual, expected, 'should generate a sprite with a chosen algorithm.');

    actual = grunt.file.read('tmp/algorithm_diagonal.css');
    expected = grunt.file.read('test/expected/algorithm_diagonal.css');
    test.equal(actual, expected, 'should generate and replace the correct css properties.');

    test.done();
  }

};