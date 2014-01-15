var es = require('event-stream'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

module.exports = function (ops) {
  ops = ops || {};
  var cheerio = ops.cheerio || require('cheerio');

  return es.map(function (file, done) {
    if (file.isNull()) return done(null, file);
    if (file.isStream()) return done(new PluginError('gulp-cheerio', 'Streaming not supported.'));
    if (ops.run) {
      var $ = cheerio.load(file.contents.toString());
      if (ops.run.length > 1) {
        ops.run($, next);
      } else {
        ops.run($);
        next();
      }
    } else {
      done(null, file);
    }
    function next(err) {
      file.contents = new Buffer($.html());
      done(err, file);
    }
  });
};


