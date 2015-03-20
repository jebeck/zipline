jest.dontMock('../Chrome');
jest.dontMock('classnames');

var _ = require('lodash');

describe('Chrome', function() {
  var React = require('react/addons');
  var Chrome = require('../Chrome');
  var TestUtils = React.addons.TestUtils;

  var renderedChrome = TestUtils.renderIntoDocument(
    <Chrome large={false}
      onClickFastBack={_.noop}
      onClickFastForward={_.noop}
      onClickLeft={_.noop}
      onClickRight={_.noop} />
  );

  it('is a zipline Chrome React element', function() {
    expect(TestUtils.isCompositeComponentWithType(renderedChrome, Chrome)).toBe(true);
  });

  it('has the Chrome--regular class by default (i.e., when `large` is false)', function() {
    var chromeReg = TestUtils.findRenderedDOMComponentWithClass(renderedChrome, 'Chrome--regular');
    expect(TestUtils.isDOMComponent(chromeReg)).toBe(true);
  });
});