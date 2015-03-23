jest.dontMock('../Details');
jest.dontMock('../Details-Collapsible');
jest.dontMock('../Details-Dates');
jest.dontMock('classnames');

var d3 = require('d3');

describe('Details', function() {
  var React = require('react/addons');
  var Details = require('../Details');
  var TestUtils = React.addons.TestUtils;

  var aprilFools = new Date('2015-04-01T04:00:00.000Z');
  var viewBounds = {
    leftEdge: {
      datetime: aprilFools,
      timezone: 'US/Eastern'
    },
    rightEdge: {
      datetime: d3.time.hour.utc.offset(aprilFools, 24),
      timezone: 'Pacific/Honolulu'
    }
  };

  var renderedDetails = TestUtils.renderIntoDocument(
    <Details alone={false}
      viewBounds={viewBounds}
      viewBoundsMask={'D MMMM YYYY, HH:mm'} />
  );

  var renderedDetailsLg = TestUtils.renderIntoDocument(
    <Details alone={true}
      viewBounds={viewBounds}
      viewBoundsMask={'D MMMM YYYY, HH:mm'} />
  );

  it('is a zipline Details React element', function() {
    expect(TestUtils.isCompositeComponentWithType(renderedDetails, Details)).toBe(true);
  });

  it('has the Details--regular class by default (i.e., when `alone` is false)', function() {
    var detailsReg = TestUtils.findRenderedDOMComponentWithClass(renderedDetails, 'Details--regular');
    expect(TestUtils.isDOMComponent(detailsReg)).toBe(true);
  });

  it('has the Details--large class when `alone` is true', function() {
    var detailsLg = TestUtils.findRenderedDOMComponentWithClass(renderedDetailsLg, 'Details--large');
    expect(TestUtils.isDOMComponent(detailsLg)).toBe(true);
  });

  it('displays the viewBounds according to the provided viewBoundsMask', function() {
    var bounds = TestUtils.scryRenderedDOMComponentsWithClass(renderedDetails, 'ViewBounds');
    var left = bounds[0], right = bounds[1];
    expect(TestUtils.isDOMComponent(left)).toBe(true);
    expect(TestUtils.isDOMComponent(right)).toBe(true);
    expect(left.getDOMNode().textContent).toEqual('from  1 April 2015, 00:00 EDT');
    expect(right.getDOMNode().textContent).toEqual('1 April 2015, 18:00 HST  to');
  });
});