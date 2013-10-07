# grunt-sprite-generator [![Build Status](https://travis-ci.org/hollandben/grunt-sprite-generator.png?branch=master)](https://travis-ci.org/hollandben/grunt-sprite-generator)

> Grunt task that generates a sprite from images referenced in a stylesheet and then updates the references with the new sprite image and positions

If you spot any problems or have questions, then please open a new issue :)

## Getting Started
This plugin requires Grunt `0.4` and PhantomJS

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sprite-generator --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sprite-generator');
```

## The "spriteGenerator" task

### Overview
In your project's Gruntfile, add a section named `spriteGenerator` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  spriteGenerator: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.algorithm
Type: `String`
Default value: `binary-tree`

A string value that is used to define the packing algorithm. The available options are: `top-down`, `diagonal`, `alt-diagonal`, `binary-tree`.

#### options.padding
Type: `Number`
Default value: `2`

The padding used between images

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  spriteGenerator: {
    options: {},
    files: {
      'dest/default_options.png': ['src/default_options.css']
    },
  },
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  spriteGenerator: {
    options: {
      algorithm: 'binary-tree',
      padding: 10
    },
    files: {
      'dest/default_options.png': ['src/default_options.css']
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
