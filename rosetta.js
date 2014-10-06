#!/usr/bin/env node

var rosetta = require('rosetta');

try {
  var zipline = rosetta.compile(['src/rosetta/rising-tide.rose'], {
    jsFormat: 'commonjs',
    cssFormat: 'less',
    jsOut: 'src/util/colors.js',
    cssOut: 'src/less/colors.less'
  });
  rosetta.writeFiles(zipline);
  var diabetes = rosetta.compile(['diabetes/rosetta/colors.rose'], {
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