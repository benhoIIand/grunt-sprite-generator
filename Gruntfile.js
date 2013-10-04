/*
 * grunt-sprite-builder
 * http://github.com/hollandben/grunt-sprite-builder
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
        spriteBuilder: {
            default_options: {
                options: {},
                files: {
                    '/tmp/default_options.png': ['tmp/default_options.css']
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
    grunt.registerTask('test', ['clean', 'copy', 'spriteBuilder', 'nodeunit']);

    grunt.registerTask('run', ['clean', 'copy', 'spriteBuilder']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};