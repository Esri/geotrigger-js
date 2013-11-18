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
      all: ['Gruntfile.js', 'geotriggers.js']
    },
    watch: {
      files: ['Gruntfile.js', 'geotriggers.js'],
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
          'geotriggers.min.js': ['geotriggers.js']
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

    karma: {
      test: {
        configFile: 'karma.conf.js'
      },
      watch: {
        configFile: 'karma.conf.js',
        autoWatch: true,
        singleRun: false
      },
      coverage: {
        configFile: 'karma.conf.js',
        preprocessors:{
          'geotriggers.js': 'coverage'
        },
        coverageReporter: {
          type : 'html',
          dir : 'reports/coverage/'
        }
      }
    },

    complexity: {
      generic: {
        src: ['geotriggers.js'],
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

  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('build', ['default', 'uglify']);
  grunt.registerTask('test', ['jasmine_node', 'karma:coverage']);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-karma');

};