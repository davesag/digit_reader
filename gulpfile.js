"use strict";

let gulp = require('gulp-help')(require('gulp'));
let mocha = require('gulp-mocha');
let gutil = require('gulp-util');
let jshint = require('gulp-jshint');
let source = require('vinyl-source-stream');
let complexity = require('gulp-complexity');
let uglify = require('gulp-uglify');
let buffer = require('vinyl-buffer');
let istanbul = require('gulp-istanbul');

let allSrcFiles = [
  './lib/**/*.js'
];

let allSrc = gulp.src(allSrcFiles);
let allSrcInclTests = gulp.src(Array.from(new Set(allSrcFiles, ['./test/**/*.js'])));

gulp.task('default', ['help']);

gulp.task('hint',
  'Runs the JSLinter on your code.',
  function() {  
    return allSrcInclTests
      .pipe(jshint({
        node: true,
        esnext: true
      })).pipe(jshint.reporter('default'));
  }
);

gulp.task('complexity',
  'Runs cyclometric complexity tests on your code.',
  function() {  
    return allSrc
    .pipe(complexity({breakOnErrors: false}));
  }
);

gulp.task('test',
  'Runs the unit tests and calculates code coverage', 
  function(next) {
    allSrc
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function(){
      gulp.src(['test/unit/**/*_test.js'], { read: false })
      .pipe(mocha({ reporter: 'spec' }))
      .on('error', gutil.log)
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({ thresholds: { global: 85 } }))
      .on('end', next);
    });
  }
);

gulp.task('qa',
  'Runs JSLinter, Complexity analysis, and the tests with code coverage',
  ['hint', 'complexity', 'test']
);

gulp.task('qt',
  'Runs the unit tests without coverage and with the fail-fast option turned on.', 
  function() {
    return gulp.src(['test/unit/**/*_test.js'], { read: false })
    .pipe(mocha({ reporter: 'spec', bail: true }))
    .on('error', gutil.log);
  }
);
