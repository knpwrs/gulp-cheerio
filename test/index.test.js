describe('gulp-cheerio tests', function () {
  var gc = require('../');
  it('should be foo', function () {
    expect(gc).to.be.ok;
    gc.should.equal('foo');
  });
});
