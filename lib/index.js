var through = require('through2').obj,
    PluginError = require('plugin-error');

module.exports = function (ops) {
  ops = ops || {};
  var cheerio = ops.cheerio || require('cheerio');

  return through(function (file, encoding, done) {
    if (file.isNull()) return done(null, file);
    if (file.isStream()) return done(new PluginError('gulp-cheerio', 'Streaming not supported.'));
    var run = typeof ops === 'function' ? ops : ops.run;
    if (run) {
      var $ = file.cheerio = file.cheerio || cheerio.load(file.contents.toString(), ops.parserOptions);
      if (run.length > 2) {
        run($, file, next);
      } else {
        run($, file);
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
