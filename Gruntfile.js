module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
        browser: true,
        globals: {
          console: true,
          XDomainRequest: true,
          XMLHttpRequest: true,
          module: true,
          define: true,
          require: true,
          exports: true
        }
      },
      all: ['Gruntfile.js', 'src/**/*.js']
    },
    watch: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      tasks: 'default'
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '*   https://github.com/geoloqi/geoloqi-js-2\n' +
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Licensed MIT\n' +
        '*/\n\n'
      },
      dist: {
        files: {
          'dist/geotriggers.min.js': ['src/**/*.js']
        }
      },
      versioned: {
        files: {
          'dist/versions/geotriggers-<%= pkg.version %>.min.js': ['src/**/*.js']
        }
      }
    },
    jasmine: {
      src: 'src/**/*.js',
      options: {
        specs: 'spec/*Spec.js',
        helpers: 'spec/*Helpers.js'
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'jasmine']);
  grunt.registerTask('build', ['default', 'uglify']);
  grunt.registerTask('test', ['jasmine']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
};