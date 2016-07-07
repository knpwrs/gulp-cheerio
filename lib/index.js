var through = require('through2').obj,
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

module.exports = function (ops) {
  ops = ops || {};
  var cheerio = ops.cheerio || require('cheerio');

  return through(function (file, encoding, done) {
    if (file.isNull()) return done(null, file);
    if (file.isStream()) return done(new PluginError('gulp-cheerio', 'Streaming not supported.'));
    var run = typeof ops === 'function' ? ops : ops.run;
    if (run) {
      //use for *.jsp page
      //set cheerio setting:decodeEntities
      //<% and %> change to <? ande ?>
      //remove<%-- and --%>
      ops.parserOptions={};
      ops.parserOptions.decodeEntities=false;
      var $ = file.cheerio = file.cheerio || cheerio.load(file.contents.toString().replace(/\<\%\-\-[\s\S]*?\-\-\%\>/g,"").replace(/<\%/g,"<?").replace(/%>/g,"?>"), ops.parserOptions);
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
      //change <? and ?> to <% and %>
      file.contents = new Buffer(ops.parserOptions && ops.parserOptions.xmlMode ? $.xml() : $.html().replace(/<\?/g,"<%").replace(/\?>/g,"%>"));
      done(err, file);
    }
  });
};
