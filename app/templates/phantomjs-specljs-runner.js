#!/usr/bin/env phantomjs
var p = require('webpage').create();
var sys = require('system');

p.onConsoleMessage = function (x) {
  console.log(x);
};

for( var i=0; i < phantom.args.length; i++ ) {
  p.injectJs(phantom.args[i]);
}

var result = p.evaluate(function () {
  specljs.run.standard.armed = true;
  return specljs.run.standard.run_specs(
     cljs.core.keyword("color"), true
  );
});

phantom.exit(result);
