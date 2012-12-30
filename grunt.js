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
      },
      version: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'versions/terraformer-<%= meta.version %>.min.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/geoloqi.min.js'
      },
      version: {
        src: ['<banner:meta.banner>', 'src/terraformer.js'],
        dest: 'versions/terraformer-<%= meta.version %>.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint jasmine jasmine_node'
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
        XMLHttpRequest: true,
        jQuery: true,
        dojo: true,
        module: true,
        define: true,
        require: true,
        exports: true
      }
    },
    uglify: {},
    jasmine: {
      all: {
        src:['spec/SpecRunner.html'],
        errorReporting: true,
        timeout: 20000
      }
    },
    jasmine_node: {
      spec: "./spec/spec/GeoloqiSpec.js",
      projectRoot: ".",
      requirejs: false,
      forceExit: true,
      jUnit: {
        report: false,
        savePath : "./build/reports/jasmine/",
        useDotNotation: true,
        consolidate: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint jasmine_node jasmine concat min concat:version min:version');
  grunt.registerTask('build', 'lint jasmine_node jasmine concat min');
  grunt.registerTask('version', 'lint jasmine_node jasmine concat:version min:version');
  grunt.registerTask('node', 'lint jasmine_node');
  grunt.registerTask('browser', 'lint jasmine');

  grunt.loadNpmTasks('grunt-jasmine-task');
  grunt.loadNpmTasks('grunt-jasmine-node');

};