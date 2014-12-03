//

jest.autoMockOff();

var index = require('../build/index.js');

describe('indexHtml', function() {
  it('includes minified assets when invoked as dist', function() {
    var distHtml = index.render("a.js", "b.css");
    expect(distHtml).toContain('<script type="text/javascript" src="a.js"');
    expect(distHtml).toContain('<link href="b.css"');
  });
});
