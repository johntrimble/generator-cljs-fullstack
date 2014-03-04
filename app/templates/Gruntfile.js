// Significant portions of this file come from the following:
// https://github.com/yeoman/generator-webapp/blob/master/app/templates/Gruntfile.js
'use strict';

function buildCljsbuildCommandString(
  leinProfile, 
  buildType,
  target) {

  var p = leinProfile ? 'with-profile ' + leinProfile : '';
  var cmd = 'lein ' + p + ' cljsbuild ' + buildType + ' ' + target;
  if( 'production' === leinProfile ) {
    // This is a hack. We don't use actual extern files when building 
    // for production, which causes warnings, which seems to cause Grunt 
    // to bail out on this task due to warnings. I'm not entirely sure
    // if this is the reason, but redirecting standard error seems to 
    // resolve the issue for the time being.
    cmd += ' 2>&1'
  }
  return cmd  
}

function createConfig() {
  var config = {
    app: 'app',
    dist: 'dist',
    distClient: 'dist/public',
    distServer: 'dist',
    // cljsbuild's target directory for dumping server JS data
    generatedServerDir: 'target/server',
    generatedServerTestDir: 'target/test/server',
    // cljsbuild's target directory for dumping client JS data
    generatedClientDir: 'target/public',
    generatedClientTestDir: 'target/test/client'
  };

  // cljsbuild's artifact for the main client JS
  config.generatedClientMainJs = config.generatedClientDir + '/scripts/' + 'main.js';

  // cljsbuild's artifact for the client tests
  config.generatedClientTestMainJs = config.generatedClientTestDir + '/' + 'main.js';

  // cljsbuild's artifact for the main server JS
  config.generatedServerMainJs = config.generatedServerDir + '/' + 'main.js';

  // cljsbuild's artifact for the main server test
  config.generatedServerTestMainJs = config.generatedServerTestDir + '/' + 'main.js';

  return config;
}

module.exports = function (grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    config: createConfig(),

    watch: {
      js: {
        files: ['<%%= config.app %>/scripts/{,*/}*.js',
                '<%%= config.generatedClientMainJs %>'],
        options: {
          livereload: true
        }
      },
      serverJs: {
        files: ['<%%= config.generatedServerMainJs %>'],
        options: {
          livereload: true
        }
      },
      clientTest: {
        files: ['<%%= config.generatedClientTestMainJs %>'],
        tasks: ['bgShell:clientTest'],
        options: {
          livereload: false
        }
      },
      serverTest: {
        files: ['<%%= config.generatedServerTestMainJs %>'],
        tasks: ['bgShell:serverTest'],
        options: {
          livereload: false
        }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      compass: {
          files: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
          tasks: ['compass:server', 'autoprefixer']
      },
      styles: {
          files: ['<%%= config.app %>/styles/{,*/}*.css'],
          tasks: ['newer:copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%%= connect.options.livereload %>'
        },
        files: [
          '<%%= config.app %>/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%%= config.app %>/images/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
        ]
      }
		},

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      proxies: [
        {
          context: '/api',
          host: 'localhost',
          port: 4000,
          https: false,
          changeOrigin: false,
          xforward: false
        }
      ],
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%%= config.app %>',
            '<%%= config.generatedClientDir %>'
          ],
          middleware: function (connect, options) {
            if( !Array.isArray(options.base) ) {
                options.base = [options.base];
            }

            // Setup the proxy
            var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];
            console.log(middlewares);
            // Serve static files.
            options.base.forEach(function(base) {
                middlewares.push(connect.static(base));
            });

            return middlewares;
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%%= config.distClient %>',
          livereload: false
        }
      }
    },

    // Empties folders to start fresh
    clean: {
        dist: {
            files: [{
                dot: true,
                src: [
                    'target',
                    '.tmp',
                    '<%%= config.dist %>/*',
                    '!<%%= config.dist %>/.git*'
                ]
            }]
        },
        server: '.tmp'
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%%= config.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%%= config.app %>/images',
        javascriptsDir: '<%%= config.app %>/scripts',
        fontsDir: '<%%= config.app %>/styles/fonts',
        importPath: '<%%= config.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false
      },
      dist: {
        options: {
          generatedImagesDir: '<%%= config.distClient %>/images/generated'
        }
      },
      server: {
        options: {
            debugInfo: true
        }
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    'bower-install': {
      app: {
        html: '<%%= config.app %>/index.html',
        ignorePath: '<%%= config.app %>/'
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
        options: {
            dest: '<%%= config.distClient %>'
        },
        html: '<%%= config.app %>/index.html'
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
        options: {
            assetsDirs: ['<%%= config.distClient %>']
        },
        html: ['<%%= config.distClient %>/{,*/}*.html'],
        css: ['<%%= config.distClient %>/styles/{,*/}*.css']
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%%= config.distClient %>',
          src: '{,*/}*.html',
          dest: '<%%= config.distClient %>'
        }]
      }
    },

    bgShell: {
      nodeServer: {
        cmd: './node_modules/.bin/supervisor -w <%%= config.generatedServerMainJs %> -n -- <%%= config.generatedServerMainJs %>',
        bg: true,
        stdout: true,
        stderr: true
      },
      cljsBuildOnceServer: {
        cmd: buildCljsbuildCommandString(null, 'once', 'server'),
        bg: false,
        fail: true
      },
      cljsBuildOnceServerTest: {
        cmd: buildCljsbuildCommandString(null, 'once', 'server-test'),
        bg: false,
        fail: true
      },
      cljsBuildOnceServerDist: {
        cmd: buildCljsbuildCommandString('production', 'once', 'server'),
        bg: false,
        fail: true
      },
      cljsBuildOnceClient: {
        cmd: buildCljsbuildCommandString(null, 'once', 'client'),
        bg: false,
        fail: true
      },
      cljsBuildOnceClientTest: {
        cmd: buildCljsbuildCommandString(null, 'once', 'client-test'),
        bg: false,
        fail: true
      },
      cljsBuildOnceClientDist: {
        cmd: buildCljsbuildCommandString('production', 'once', 'client'),
        bg: false,
        fail: true
      },
      cljsBuildAutoServer: {
        cmd: buildCljsbuildCommandString(null, 'auto', 'server'),
        bg: true,
        stdout: true,
        stderr: true
      },
      cljsBuildAutoServerTest: {
        cmd: buildCljsbuildCommandString(null, 'auto', 'server-test'),
        bg: true,
        stdout: true,
        stderr: true
      },
      cljsBuildAutoClient: {
        cmd: buildCljsbuildCommandString(null, 'auto', 'client'),
        bg: true,
        stdout: true,
        stderr: true
      },
      cljsBuildAutoClientTest: {
        cmd: buildCljsbuildCommandString(null, 'auto', 'client-test'),
        bg: true,
        stdout: true,
        stderr: true
      },
      clientTest: {
        cmd: function() {
          // Polyfills for PhantomJS
          var phantomPolyfills = [
            "scripts/phantomjs-shims.js"
          ];

          // External JavaScript dependencies (e.g. JQuery, React, ...)
          var deps = [
            "app/bower_components/react/react.js",
            grunt.config('config.generatedClientTestMainJs')
          ];

          var phantom = './node_modules/.bin/phantomjs';

          var testRunner = 'scripts/phantomjs-specljs-runner.js'

          var cmd = [phantom, testRunner].concat(
            phantomPolyfills, 
            deps).join(' ');

          console.log(cmd);

          return cmd;
        },
        bg: false,
        stdout: true,
        stderr: true,
        fail: true
      },
      serverTest: {
        cmd: function() {
          var cmd = ['node', grunt.config('config.generatedServerTestMainJs')].join(' ');
          return cmd;
        },
        bg: false,
        stdout: true,
        stderr: true,
        fail: true
      }
    },

    exec: {
      npm: {
        cmd: 'npm install'
      },
      bower: {
        cmd: './node_modules/bower/bin/bower install'
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.app %>',
          dest: '<%%= config.distClient %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*',
            'bower_components/' + (this.includeCompass ? 'sass-' : '') + 'bootstrap/' + (this.includeCompass ? 'fonts/' : 'dist/fonts/') +'*.*'
          ]
        },
        {
          expand: true,
          dot: true,
          cwd: '<%%= config.generatedClientDir %>',
          dest: '<%%= config.distClient %>',
          src: [
            '**/*'
          ]
        },
        {
          expand: true,
          dot: true,
          cwd: '<%%= config.generatedServerDir %>',
          dest: '<%%= config.distServer %>',
          src: [
            '**/*'
          ]
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%%= config.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'compass:server', 
        'copy:styles', 
        'bgShell:cljsBuildOnceServer', 
        'bgShell:cljsBuildOnceClient'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'compass',
        'copy:styles',
        'bgShell:cljsBuildOnceServerDist', 
        'bgShell:cljsBuildOnceClientDist'
      ]
    }
  });
 
  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    var withTests = grunt.option('with-tests');
    var tasks = [].concat(
      [ 'clean:server',
        'concurrent:server',
        'bgShell:cljsBuildAutoClient',
        'bgShell:cljsBuildAutoServer'],

      withTests? [
        'bgShell:cljsBuildAutoClientTest',
        'bgShell:cljsBuildAutoServerTest']
        : [],

      [ 'bgShell:nodeServer',
        'autoprefixer',
        'configureProxies:server',
        'connect:livereload',
        'watch'])

    grunt.task.run(tasks);
  });

  grunt.registerTask('generatePackageJson', function() {
    // This is an ugly bit of code to generate the package.json for the 
    // distribution. Basically, it just copies the existing package.json and 
    // updates the start script setting to point to the correct file.
    var path = require('path');
    var dist = grunt.config('config.dist');
    var distServer = grunt.config('config.distServer');
    var generatedServerDir = grunt.config('config.generatedServerDir');
    var generatedServerMainJs = grunt.config('config.generatedServerMainJs');
    var mainJsRelative = path.relative(generatedServerDir, generatedServerMainJs);
    var distServerRelative = path.relative(dist, distServer);
    var mainServerPath = path.join(distServerRelative, mainJsRelative);
    var pkg = grunt.file.readJSON('package.json');
    delete pkg.devDependencies;
    pkg.scripts.start = 'node ' + mainServerPath;
    var targetPkgPath = path.join(dist, 'package.json');
    grunt.file.write(targetPkgPath, JSON.stringify(pkg, undefined, 2));
  });

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',
    'usemin',
    'htmlmin',
    'generatePackageJson'
  ]);

  grunt.registerTask('test', [
    'clean:dist',
    'bgShell:cljsBuildOnceClientTest',
    'bgShell:clientTest',
    'bgShell:cljsBuildOnceServerTest',
    'bgShell:serverTest'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
}