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
        '*   Copyright (c) <%= grunt.template.today("yyyy") %> Environmental Systems Research Institute, Inc.\n' +
        '*   Apache License' +
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
      coverage: {
        src: 'src/**/*.js',
        options: {
          specs: 'spec/*Spec.js',
          helpers: 'spec/*Helpers.js',
          keepRunner: true,
          template: require('grunt-template-jasmine-istanbul'),
          templateOptions: {
            coverage: 'reports/coverage/coverage.json',
            report: 'reports/coverage',
            thresholds: {
              lines: 75,
              statements: 75,
              branches: 75,
              functions: 90
            }
          }
        }
      }
    },
    jasmine_node: {
      options: {
        forceExit: true,
        match: '.',
        matchall: false,
        extensions: 'js',
        specNameMatcher: '.*Spec',
        helperNameMatcher: '.*Helpers',
        useHelpers: true
      },
      all: ['spec/']
    },
    complexity: {
      generic: {
        src: ['src/**/*.js'],
        options: {
          jsLintXML: 'reports/complexity.xml', // create XML JSLint-like report
          errorsOnly: false, // show only maintainability errors
          cyclomatic: 3,
          halstead: 8,
          maintainability: 100
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'test', 'complexity']);
  grunt.registerTask('build', ['default', 'uglify']);
  grunt.registerTask('test', ['jasmine_node','jasmine']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-complexity');

};