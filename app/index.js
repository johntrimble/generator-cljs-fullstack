'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var _ = require('underscore.string')


var CljsFullstackGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = yeoman.file.readJSON(path.join(__dirname, '../package.json'));

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.npmInstall();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    console.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    console.log(chalk.magenta('You\'re using the fantastic Cljs Full Stack generator.'));

    // var prompts = [{
    //   type: 'confirm',
    //   name: 'someOption',
    //   message: 'Would you like to enable this option?',
    //   default: true
    // }];

    // this.prompt(prompts, function (props) {
    //   this.someOption = props.someOption;

    //   done();
    // }.bind(this));
    done();
  },

  gruntfile: function() {
    this.template('Gruntfile.js');
  },

  packageJSON: function() {
    this.template('_package.json', 'package.json');
  },

  git: function() {
    this.copy('gitignore', '.gitignore');
  },

  bower: function() {
    this.copy('bowerrc', '.bowerrc');
    this.copy('_bower.json', 'bower.json');
  },

  editorConfig: function() {
    this.copy('editorconfig', '.editorconfig');
  },

  mainStylesheet: function() {
    this.copy('main.scss', 'app/styles/main.scss')
  },

  writeIndex: function() {
    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
    this.indexFile = this.engine(this.indexFile, this);

    // wire Bootstrap plugins
    var bs = 'bower_components/sass-bootstrap/js/';
    this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
      bs + 'affix.js',
      bs + 'alert.js',
      bs + 'dropdown.js',
      bs + 'tooltip.js',
      bs + 'modal.js',
      bs + 'transition.js',
      bs + 'button.js',
      bs + 'popover.js',
      bs + 'carousel.js',
      bs + 'scrollspy.js',
      bs + 'collapse.js',
      bs + 'tab.js'
    ]);

    // add main.js
    var mainJsScript = '    <script src="scripts/main.js"></script>\n';
    this.indexFile = this.append(this.indexFile, 'body', mainJsScript);
  },

  scripts: function() {
    this.mkdir('scripts');
    ['phantomjs-shims.js', 
     'phantomjs-specljs-runner.js'].forEach(
      function(i) {
        this.copy(i, 'scripts/' + i);
      }, this);
  },

  readme: function() {
    this.template('_README.md', 'README.md');
  },

  cljs: function() {
    this.template('project.clj');

    var name = _.slugify(this.appname);
    ['src/client/' + name + '/client',
     'src/client-bootstrap/' + name + '/client',
     'src/server/' + name + '/server',
     'src/server-bootstrap/' + name + '/server',
     'src/common/' + name,
     'test/client/' + name + '/client',
     'test/server/' + name + '/server'].forEach(
      function(i){
        this.mkdir(i);
      }, this);

    // client files
    this.template('client-bootstrap.cljs', 
      'src/client-bootstrap/' + name + '/client/bootstrap.cljs');
    this.template('client-core.cljs',
      'src/client/' + name + '/client/core.cljs');
    this.template('client-test.cljs', 
      'test/client/' + name + '/client/client-test.cljs');

    // server files
    this.template('server-bootstrap.cljs', 
      'src/server-bootstrap/' + name + '/server/bootstrap.cljs');
    this.template('server-core.cljs', 
      'src/server/' + name + '/server/core.cljs');
    this.template('handlers.cljs', 
      'src/server/' + name + '/server/handlers.cljs');
    this.template('server-test.cljs', 
      'test/server/' + name + '/server/server-test.cljs');
    this.template('specljs-runner.cljs', 
      'test/server/specljs-runner.cljs');

    // common files
    this.template('util.cljs',
      'src/common/' + name + 'util.cljs');
  },

  app: function () {
    ['app', 'app/scripts', 'app/styles'].forEach(function(i) {
      this.mkdir(i);
    }, this);

    this.write('app/index.html', this.indexFile);
  },

  install: function () {
    if (this.options['skip-install']) {
      return;
    }

    var done = this.async();
    this.installDependencies({
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install'],
      callback: done
    });
  }
});

module.exports = CljsFullstackGenerator;