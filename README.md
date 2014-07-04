# gulp-cheerio

[![Build Status](https://travis-ci.org/KenPowers/gulp-cheerio.png)](https://travis-ci.org/KenPowers/gulp-cheerio)

This is a plugin for [gulp][gulp] which allows you to manipulate HTML and XML files
using [cheerio][cheerio].

# Usage

There are two ways to use `gulp-cheerio`: synchronous and asynchronous. See
the following usage examples:

```javascript
var gulp = require('gulp'),
    cheerio = require('gulp-cheerio');

gulp.task('sync', function () {
  return gulp
    .src(['src/*.html'])
    .pipe(cheerio({
      run: function ($) {
        // Each file will be run through cheerio and each corresponding `$` will be passed here.
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
      run: function ($, done) {
        // The only difference here is the inclusion of a `done` parameter.
        // Call `done` when everything is finished. `done` accepts an error if applicable.
        done();
      }
    }))
    .pipe(gulp.dest('dist/'));
});
```

If `run` is the only option you are passing then you may simply pass a function:

```javascript
var gulp = require('gulp'),
    cheerio = require('gulp-cheerio');

gulp.task('sync', function () {
  return gulp
    .src(['src/*.html'])
    .pipe(cheerio(function ($) {
      // Each file will be run through cheerio and each corresponding `$` will be passed here.
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
    .pipe(cheerio(function ($, done) {
      // The only difference here is the inclusion of a `done` parameter.
      // Call `done` when everything is finished. `done` accepts an error if applicable.
      done();
    }))
    .pipe(gulp.dest('dist/'));
});
```

If you want to use [custom parser options][cpo] simply use the `parserOptions`
option:

```
cheerio({
  run: function () {},
  parserOptions: {
    // Options here
  }
})
```

When the xmlMode option is set to true cheerio's $.xml() method will be used to render:

```
cheerio({
  run: function () {},
  parserOptions: {
    xmlMode: true
  }
})
```

Currently, `gulp-cheerio` uses `cheerio` `~0.14.0`. If you want to use your
own version of `cheerio` you can pass it in as an option:

```javascript
cheerio({
  cheerio: require('cheerio') // local version of `cheerio`
})
```

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
