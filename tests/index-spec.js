//

jest.autoMockOff();

var index = require('../src/javascripts/index.js');

describe('index', function() {
  it('fails', function() {
    expect(index).toNotBe(null);
  });
});
