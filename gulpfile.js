var gulp = require('gulp'),
    path = require('path'),
    mocha = require('gulp-spawn-mocha');

gulp.task('test', function () {
  return test().on('error', function (up) {
    throw up;
  });
});

gulp.task('default', function () {
  gulp.watch('{lib,test}/*', test);
  return test();
});

function test() {
  return gulp.src(['test/*.test.js'], {
    read: false
  }).pipe(mocha({
    R: 'spec',
    r: path.join(__dirname, 'test', 'setup.js')
  })).on('error', console.warn.bind(console));
}
