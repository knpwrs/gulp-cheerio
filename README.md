# gulp-cheerio

[![Build Status](https://travis-ci.org/KenPowers/gulp-cheerio.svg?branch=0.6.2)](https://travis-ci.org/KenPowers/gulp-cheerio) [![Coverage Status](https://coveralls.io/repos/KenPowers/gulp-cheerio/badge.svg?branch=0.6.2)](https://coveralls.io/r/KenPowers/gulp-cheerio?branch=0.6.2)

This is a plugin for [gulp][gulp] which allows you to manipulate HTML and XML files
using [cheerio][cheerio].

# BREAKING CHANGES IN 0.6.x

The main `run` function passed to cheerio now receives either two or three
arguments (`$, file[, done]`) instead of one or two arguments (`$[, done]`).
Make sure you update your build scripts accordingly. See the usage examples
below.

Additionally, cheerio is no longer a `peerDependency` because peer
dependencies are being deprecated. See [npm/npm#6565][npm].

# Usage

There are two ways to use `gulp-cheerio`: synchronous and asynchronous. See
the following usage examples:

```js
var gulp = require('gulp'),
    cheerio = require('gulp-cheerio');

gulp.task('sync', function () {
  return gulp
    .src(['src/*.html'])
    .pipe(cheerio(function ($, file) {
      // Each file will be run through cheerio and each corresponding `$` will be passed here.
      // `file` is the gulp file object
      // Make all h1 tags uppercase
      $('h1').each(function () {
        var h1 = $(this);
        h1.text(h1.text().toUpperCase());
      });
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('async', function () {
  return gulp
    .src(['src/*.html'])
    .pipe(cheerio(function ($, file, done) {
      // The only difference here is the inclusion of a `done` parameter.
      // Call `done` when everything is finished. `done` accepts an error if applicable.
      done();
    }))
    .pipe(gulp.dest('dist/'));
});
```

Additional options can be passed by passing an object as the main argument
with your function as the `run` option:

```js
var gulp = require('gulp'),
    cheerio = require('gulp-cheerio');

gulp.task('sync', function () {
  return gulp
    .src(['src/*.html'])
    .pipe(cheerio({
      run: function ($, file) {
        // Each file will be run through cheerio and each corresponding `$` will be passed here.
        // `file` is the gulp file object
        // Make all h1 tags uppercase
        $('h1').each(function () {
          var h1 = $(this);
          h1.text(h1.text().toUpperCase());
        });
      }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('async', function () {
  return gulp
    .src(['src/*.html'])
    .pipe(cheerio({
      run: function ($, file, done) {
        // The only difference here is the inclusion of a `done` parameter.
        // Call `done` when everything is finished. `done` accepts an error if applicable.
        done();
      }
    }))
    .pipe(gulp.dest('dist/'));
});
```

If you want to use [custom parser options][cpo] simply use the `parserOptions`
option:

```js
cheerio({
  run: function () {},
  parserOptions: {
    // Options here
  }
})
```

When the xmlMode option is set to true cheerio's $.xml() method will be used to render:

```js
cheerio({
  run: function () {},
  parserOptions: {
    xmlMode: true
  }
})
```

This module includes cheerio version `0.*`. If you want to use your own
special build / version of `cheerio`, you can pass it in as an option:

```js
cheerio({
  cheerio: require('my-cheerio') // special version of `cheerio`
})
```

As of version `0.4.0` the parsed `$` object returned from `cheerio.load(...)`
is cached to gulp's `file` object as `file.cheerio`. `gulp-cheerio` will look
for `file.cheerio` before attempting to use `cheerio.load(...)`. This means
that if you use `gulp-cheerio` multiple times in the same stream or with
another plugin that supports caching cheerio in this fashion (such as
[`gulp-svgstore`][gulpsvg]) each file will only be parsed once.

# License

**The MIT License**

Copyright (c) 2014 Kenneth Powers

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


  [gulp]: http://gulpjs.com/ "gulp.js"
  [cheerio]: https://github.com/MatthewMueller/cheerio "cheerio"
  [cpo]: https://github.com/cheeriojs/cheerio#loading "Cheerio Load Options"
  [gulpsvg]: https://github.com/w0rm/gulp-svgstore "gulp-svgstore"
  [npm]: https://github.com/npm/npm/issues/6565 "npm issue 6565"
