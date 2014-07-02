describe('gulp-cheerio tests', function () {
  var gc = require('../'),
      cheerio = require('cheerio'),
      FakeFile = require('gulp-util').File,
      Stream = require('stream');

  beforeEach(function () {
    this.originalContent = 'foo';
    this.bufferFile = new FakeFile({
      path: this.originalContent,
      contents: new Buffer(this.originalContent)
    });
  });

  it('should be a function', function () {
    gc.should.be.a('function');
  });

  it('should accept a fn as the the ops', function () {
    var runSpy = sinon.spy();
    var stream = gc(runSpy);
    stream.write(this.bufferFile);
    runSpy.should.be.calledOnce;
  });

  it('should accept custom parser options', function () {
    sinon.spy(cheerio, 'load');
    var fake$ = {
      html: sinon.stub.returns(this.originalContent)
    };
    var ops = {};
    var stream = gc({
      run: sinon.spy(),
      parserOptions: ops
    });
    stream.write(this.bufferFile);
    cheerio.load.should.be.calledWith(this.originalContent, ops);
    cheerio.load.restore();
  });

  it('should accept a custom cheerio', function () {
    var fake$ = {
      html: sinon.stub().returns(this.originalContent)
    };
    var fakeCheerio = {
      load: sinon.stub().returns(fake$)
    };
    var runSpy = sinon.spy();
    var stream = gc({
      cheerio: fakeCheerio,
      run: runSpy
    });
    stream.write(this.bufferFile);
    runSpy.should.be.calledOnce;
    runSpy.should.be.calledWith(fake$);
  });

  it('should handle errors from the run function', function () {
    var error = new Error('foo');
    var stream = gc({
      // Not using stub so run function has proper length
      run: function ($, done) {
        done(error);
      }
    });
    var errorSpy = sinon.spy();
    stream.on('error', errorSpy);
    stream.write(this.bufferFile);
    errorSpy.should.be.calledOnce;
    errorSpy.should.be.calledWith(error);
  });

  it('should fail when passed a stream', function () {
    var streamFile = new FakeFile({
      path: 'bar',
      contents: new Stream()
    });
    var stream = gc(),
        errorSpy = sinon.spy();
    stream.on('error', errorSpy);
    stream.write(streamFile);
    errorSpy.should.be.calledOnce;
    errorSpy.should.be.calledWith(sinon.match.instanceOf(Error));
  });

  it('should return an unmodified stream when passed a null file', function () {
    var nullFile = new FakeFile({
      path: 'baz'
    });
    var stream = gc(),
        spy = sinon.spy();
    sinon.spy(cheerio, 'load');
    stream.on('data', spy);
    stream.write(nullFile);
    spy.should.be.calledOnce;
    spy.should.be.calledWith(nullFile);
    cheerio.load.should.not.be.called;
    cheerio.load.restore();
  });

  it('should return an unmodified stream when there is no `run` function', function () {
    var stream = gc(),
        spy = sinon.spy();
    sinon.spy(cheerio, 'load');
    stream.on('data', spy);
    stream.write(this.bufferFile);
    spy.should.be.calledOnce;
    spy.should.be.calledWith(this.bufferFile);
    cheerio.load.should.not.be.called;
    cheerio.load.restore();
  });

  it('should work for multiple files', function () {
    var stream = gc(),
        spy = sinon.spy();
    stream.on('data', spy);
    for (var i = 0; i < 3; i++) {
      stream.write(this.bufferFile);
    }
    spy.should.be.calledThrice;
  });

  it('should work in XML mode', function () {
    var runSpy = sinon.spy(),
        fake$ = {
          xml: sinon.stub().returns('xml'),
          html: sinon.stub().returns('html')
        };
    sinon.stub(cheerio, 'load').returns(fake$);
    var stream = gc({
      run: runSpy,
      parserOptions: {
        xmlMode: true
      }
    });
    stream.write(this.bufferFile);
    fake$.xml.should.be.calledOnce;
    fake$.html.should.not.be.called;
    runSpy.should.be.calledOnce;
    cheerio.load.restore();
  });

  // Create some similar tests: one with a callback and the other with no callback
  [{
    name: 'should load via cheerio and pass the cheerio object to the run function (no callback)',
    conf: {run: sinon.spy()},
    match: sinon.match.falsy
  }, {
    name: 'should load via cheerio and pass the cheerio object to the run function (callback)',
    // Not using stub so length property is set correctly
    conf: {run: sinon.spy(function ($, done) { done(); })},
    match: sinon.match.func
  }, {
    name: 'should load via cheerio and pass the cheerio object to the run function (function as config, no callback)',
    conf: sinon.spy(),
    match: sinon.match.falsy
  }, {
    name: 'should load via cheerio and pass the cheerio object to the run function (function as config, callback)',
    conf: sinon.spy(function ($, done) { done(); }),
    match: sinon.match.func
  }].forEach(function (test) {
    it(test.name, function () {
      // Testing variables
      var html = 'HTML Content',
          $ = {
            html: sinon.spy(function () {
              return html;
            })
          },
          stream = gc(test.conf),
          dataSpy = sinon.spy();
      // Stub cheerio's load
      sinon.stub(cheerio, 'load').returns($);
      // Spy on data stream
      stream.on('data', dataSpy);
      // Write "file" through stream
      stream.write(this.bufferFile);
      // Assertions
      cheerio.load.should.be.calledOnce;
      cheerio.load.should.be.calledWith(this.originalContent);
      dataSpy.should.be.calledWith(this.bufferFile, sinon.match.falsy);
      this.bufferFile.contents.toString().should.equal(html);
      $.html.should.be.calledOnce;
      var runner = typeof test.conf === 'function' ? test.conf : test.conf.run;
      runner.should.be.calledOnce;
      runner.should.be.calledWith($, test.match);
      // Restore cheerio's load
      cheerio.load.restore();
    });
  });
});
