/*
 * grunt-sprite-builder
 * http://github.com/hollandben/grunt-sprite-builder
 *
 * Copyright (c) 2013 Ben Holland
 * Licensed under the MIT license.
 */

var spritesmith = require('spritesmith');

module.exports = function(grunt) {
    'use strict';

    var httpRegex = new RegExp('http[s]?', 'ig');
    var imageRegex = new RegExp('background-image:[\\s]?url\\(["\']?([\\w\\d\\s!:./\\-\\_]*\\.[\\w?#]+)["\']?\\)[^;]*\;', 'ig');
    var filepathRegex = new RegExp('["\']?([\\w\\d\\s!:./\\-\\_]*\\.[\\w?#]+)["\']?', 'ig');

    grunt.registerMultiTask('spriteBuilder', 'Grunt task that generates a sprite from images referenced in a stylesheet and then updates the references with the new sprite image and positions', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            algorithm: 'binary-tree',
            baseUrl: './',
            engine: 'auto',
            padding: 2,
            notFound: false
        });

        var done = this.async();

        // Collect all background-image references in a given file
        var collectImages = function(srcFile) {
            var images = [];
            var data = grunt.file.read(options.baseUrl + srcFile);


            var files = data.match(imageRegex);

            files.forEach(function(file) {
                // Exit if it contains a http/https
                if (httpRegex.test(file)) {
                    grunt.log.warn(file + ' has been skipped as it\'s an external resource!');
                    return false;
                }

                // Exit if not a PNG
                if (!/\.png/.test(file)) {
                    grunt.log.warn(file + ' has been skipped as it\'s not a PNG!');
                    return false;
                }

                var filepath = options.baseUrl + file.match(filepathRegex)[0].replace(/['"]/g, '');

                if (grunt.file.exists(filepath)) {
                    images.push({
                        ref: file,
                        src: filepath
                    });
                } else {
                    grunt.log.warn(filepath + ' has been skipped as it does not exist!');
                }
            });

            return images;
        };

        var spriteSmithWrapper = function(config, callback) {
            var sprite = 'test-sprite.png';
            var defaultConfig = {
                algorithm: options.algorithm,
                engine: options.engine,
                exportOpts: {
                    format: 'png'
                },
                padding: options.padding
            };

            grunt.util._.defaults(config, defaultConfig);

            spritesmith(config, function(err, result) {
                console.log('RESULT CAME BACK - FUCK YEAH!');

                if (err) {
                    grunt.fatal(err);
                    return callback(err);
                } else {
                    grunt.file.write(sprite, result.image, {
                        encoding: 'binary'
                    });

                    callback();

                    //     var tmpResult = result.coordinates;
                    //     console.log(tmpResult);
                    //     for (var key in result.coordinates) {
                    //         // var newKey = path.join(process.cwd(), key).toLowerCase();
                    //         // imageReplaces[newKey] = tmpResult[key];
                    //         // imageReplaces[newKey].sprite = path.join(process.cwd(), sprite);
                    //     }
                    //     callback(false);
                }
            });
        };

        this.files.forEach(function(file) {
            var src = file.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            var collection = collectImages(src);
            var images = collection.map(function(obj) {
                return obj.src;
            });

            // Process starter
            grunt.util.async.forEach([{
                src: images
            }], spriteSmithWrapper, function(err) {
                if (err) {
                    console.log(err);
                }

                done();
            });
        });
    });
};