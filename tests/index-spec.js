//

jest.autoMockOff();

var index = require('../build/index.js');

describe('index', function() {
  it('fails', function() {
    expect(index).toNotBe(null);
  });
});
