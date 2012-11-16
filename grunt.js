/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '2.0.0alpha1',
      banner: '/*! Geoloqi JS - <%= meta.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   https://github.com/geoloqi/geoloqi-js-2\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Licensed MIT */'
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js']
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', 'src/geoloqi.js'],
        dest: 'dist/geoloqi.min.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/geoloqi.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint jasmine'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef:  true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        console: true,
        XDomainRequest: true,
        jQuery: true,
        dojo: true
      }
    },
    uglify: {},
    jasmine: {
      all: {
        src:['spec/SpecRunner.html'],
        errorReporting: true,
        timeout: 20000
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint jasmine concat min');

  grunt.loadNpmTasks('grunt-jasmine-task');

};
