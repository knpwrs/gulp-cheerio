var es = require('event-stream'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

module.exports = function (ops) {
  ops = ops || {};
  var cheerio = ops.cheerio || require('cheerio');

  return es.map(function (file, done) {
    if (file.isNull()) return done(null, file);
    if (file.isStream()) return done(new PluginError('gulp-cheerio', 'Streaming not supported.'));
    var run = typeof ops === 'function' ? ops : ops.run;
    if (run) {
      var $ = cheerio.load(file.contents.toString(), ops.parserOptions);
      if (run.length > 1) {
        run($, next);
      } else {
        run($);
        next();
      }
    } else {
      done(null, file);
    }
    function next(err) {
      file.contents = new Buffer(ops.parserOptions && ops.parserOptions.xmlMode ? $.xml() : $.html());
      done(err, file);
    }
  });
};
