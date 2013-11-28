/*
 * grunt-sprite-generator
 * http://github.com/hollandben/grunt-sprite-generator
 *
 * Copyright (c) 2013 Ben Holland
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>'],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        copy: {
            tests: {
                expand: true,
                cwd: 'test/fixtures/',
                src: '**',
                dest: 'tmp/'
            }
        },

        // Configuration to be run (and then tested).
        spriteGenerator: {
            options: {},
            default_options: {
                files: {
                    '/tmp/default_options.png': ['tmp/default_options.css']
                }
            },
            absolute_path: {
                files: {
                    '/tmp/absolute_path.png': ['tmp/absolute_path.css']
                }
            },
            multiple_imports: {
                files: {
                    '/tmp/multiple_imports.png': ['tmp/multiple_imports_1.css', 'tmp/multiple_imports_2.css']
                }
            },
            algorithm: {
                options: {
                    algorithm: 'diagonal'
                },
                files: {
                    '/tmp/algorithm_diagonal.png': ['tmp/algorithm_diagonal.css']
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copy', 'spriteGenerator', 'nodeunit']);

    grunt.registerTask('run', ['clean', 'copy', 'spriteGenerator']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};