#!/usr/bin/env node

var rosetta = require('rosetta');
var fmt = require('util').format;

var config = process.argv[2];

try {
  var example = rosetta.compile([fmt('example/rosetta/%s.rose', config)], {
    jsFormat: 'commonjs',
    cssFormat: 'less',
    jsOut: 'example/util/colors.js',
    cssOut: 'example/less/colors.less'
  });
  rosetta.writeFiles(example);
  var zipline = rosetta.compile([fmt('src/rosetta/%s.rose', config)], {
    jsFormat: 'commonjs',
    cssFormat: 'less',
    jsOut: 'src/util/colors.js',
    cssOut: 'src/less/colors.less'
  });
  rosetta.writeFiles(zipline);
  var activity = rosetta.compile([fmt('activity/rosetta/%s.rose', config)], {
    jsFormat: 'commonjs',
    cssFormat: 'less',
    jsOut: 'activity/util/colors.js',
    cssOut: 'activity/less/colors.less'
  });
  rosetta.writeFiles(activity);
  var diabetes = rosetta.compile([fmt('diabetes/rosetta/%s.rose', config)], {
    jsFormat: 'commonjs',
    cssFormat: 'less',
    jsOut: 'diabetes/util/colors.js',
    cssOut: 'diabetes/less/colors.less'
  });
  rosetta.writeFiles(diabetes);
}
catch (e) {
  if (e instanceof rosetta.RosettaError) {
    console.error(rosetta.formatError(e));
  }
  else {
    throw e;
  }
}