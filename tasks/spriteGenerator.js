/*
 * grunt-sprite-generator
 * http://github.com/hollandben/grunt-sprite-generator
 *
 * Copyright (c) 2013 Ben Holland
 * Licensed under the MIT license.
 */

var path 		= require('path');
var spritesmith = require('spritesmith');

module.exports = function(grunt) {
    'use strict';

    var httpRegex = new RegExp('http[s]?', 'ig');
    var imageRegex = new RegExp('background-image:[\\s]?url\\(["\']?([\\w\\d\\s!:./\\-\\_]*\\.[\\w?#]+)["\']?\\)[^;]*\;', 'ig');
    var filepathRegex = new RegExp('["\']?([\\w\\d\\s!:./\\-\\_]*\\.[\\w?#]+)["\']?', 'ig');

    grunt.registerMultiTask('spriteGenerator', 'Grunt task that generates a sprite from images referenced in a stylesheet and then updates the references with the new sprite image and positions', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            algorithm: 'binary-tree',
            baseUrl: './',
            engine: 'auto',
            padding: 2
        });

        var done = this.async();

        // Collect all background-image references in a given file
        var collectImages = function(files) {
            var images = [];
            var found = false;

            files.forEach(function(srcFile) {
                var data = grunt.file.read(options.baseUrl + srcFile);
                var references = data.match(imageRegex);

                // If references are found
                if (references) {
                    references.forEach(function(file) {
                        // Exit if it contains a http/https
                        if (httpRegex.test(file)) {
                            grunt.verbose.warn(file + ' has been skipped as it\'s an external resource!');
                            return false;
                        }
    
                        // Exit if not a PNG
                        if (!/\.png/.test(file)) {
                            grunt.verbose.warn(file + ' has been skipped as it\'s not a PNG!');
                            return false;
                        }
    
                        var filepath;
                        var imagePath = file.match(filepathRegex)[0].replace(/['"]/g, '');
    
                        if(imagePath[0] === '/') {
                        	filepath = options.baseUrl + imagePath;
                        } else {
                        	filepath = path.resolve(srcFile.substring(0, srcFile.lastIndexOf("/")), imagePath);
                        }
    
                        if (grunt.file.exists(filepath)) {
                            images[filepath] = file;
                            found = true;
                        } else {
                            grunt.verbose.warn(filepath + ' has been skipped as it does not exist!');
                        }
                    });
                }
            });

            return found ? images : found;
        };

        var spriteSmithWrapper = function(config, callback) {
            var dest = options.dest;
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

                if (err) {
                    grunt.fatal(err);
                    return callback(err);
                } else {
                    grunt.file.write(dest, result.image, {
                        encoding: 'binary'
                    });

                   grunt.log.writeln('Sprite', dest, 'has been created');

                    var tmpResult = result.coordinates;
                    var coords = [];

                    for(var key in tmpResult) {
                        coords[key] = {
                            x: tmpResult[key].x,
                            y: tmpResult[key].y
                        };
                    }

                    callback(false, coords);
                }
            });
        };

        var updateReferences = function(filepath, spritePath, arr) {
            var data = grunt.file.read(filepath);
	    var filePathParts = filepath.split('/');
	    var spritePathParts = spritePath.split('/');
	    var spritePathToWrite = ".";
	    var j = 0;
	    for (var i = 0; i < filePathParts.length-1; i++) {
		if(filePathParts[i] && spritePathParts[i] && filePathParts[i]==spritePathParts[i]){
		    j = i+1;
		} else {
		    spritePathToWrite += "/.."
		}
	    }
	
	    for(;j<spritePathParts.length;j++){
		spritePathToWrite+= "/" + spritePathParts[j];
	    }
			
            arr.forEach(function(obj) {
                data = data.replace(obj.ref, 'background-image: url(\''+ spritePathToWrite +'\');\n    background-position: -'+ obj.coords.x +'px -'+ obj.coords.y +'px;');
            });

            grunt.file.write(filepath, data);
            grunt.log.writeln('File', filepath, 'has been updated');
        };


        this.files.forEach(function(file) {
            var fileDest = file.dest;

            // Basic cache busting
            for(var prop in options) {
                fileDest = fileDest.replace(new RegExp('{'+ prop +'}','g'), options[prop]);
            }

            options.dest = options.baseUrl + fileDest;

            if(file.src.length < 1) {
                grunt.fatal('No source files were found');
            }

            var src = file.src.filter(function(filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            // Process starter
            var collection = collectImages(src);

            if(!collection) {
                grunt.log.warn('No images were found so a sprite was not generated');
                done();
                return false;
            }

            grunt.util.async.mapSeries([{
                src: grunt.util._.keys(collection)
            }], spriteSmithWrapper, function(err, results) {
                if (err) {
                    console.log(err);
                }

                src.forEach(function(file) {
                    var refs = [];

                    results.forEach(function(result, i) {
                        grunt.util._.keys(result).map(function(key) {
                            refs.push({
                                src: key,
                                ref: collection[key],
                                coords: {
                                    x: result[key].x,
                                    y: result[key].y
                                }
                            });
                        });
                    });

                    updateReferences(file, fileDest, refs);
                });

                done();
            });
        });
    });
};
