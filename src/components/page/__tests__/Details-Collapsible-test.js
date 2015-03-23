jest.dontMock('../Details-Collapsible');

describe('Details-Collapsible', function() {
  var React = require('react/addons');
  var Collapsible = require('../Details-Collapsible');
  var Dates = require('../Details-Dates');
  var TestUtils = React.addons.TestUtils;

  var header = 'Hello, world';

  var renderedCollapsible = TestUtils.renderIntoDocument(
    <Collapsible header={header}
      toCollapse={<Dates />} />
  );

  it('is a zipline Details-Collapsible element', function() {
    expect(TestUtils.isCompositeComponentWithType(renderedCollapsible, Collapsible)).toBe(true);
  });

  it('renders the header passed to it', function() {
    var renderedh3 = TestUtils.findRenderedDOMComponentWithTag(renderedCollapsible, 'h3');
    expect(TestUtils.isDOMComponent(renderedh3)).toBe(true);
    expect(renderedh3.getDOMNode().textContent).toEqual(header + ' ');
  });

  it('renders a minus icon when the collapsible container is (default) open', function() {
    var renderedIcon = TestUtils.findRenderedDOMComponentWithClass(renderedCollapsible, 'icon-subtract');
    expect(TestUtils.isDOMComponent(renderedIcon)).toBe(true);
  });

  it('sets the height of the collapsible container to 0 on click of the minus icon', function() {
    var renderedIcon = TestUtils.findRenderedDOMComponentWithClass(renderedCollapsible, 'icon-subtract');
    var clickableIcon = renderedIcon.getDOMNode();
    TestUtils.Simulate.click(clickableIcon);
    expect(renderedCollapsible.state.height).toEqual(0);
  });

  it('renders a plus icon when the collapsible container is closed', function() {
    var renderedIcon = TestUtils.findRenderedDOMComponentWithClass(renderedCollapsible, 'icon-add');
    expect(TestUtils.isDOMComponent(renderedIcon)).toBe(true);
  });

  it('sets the height of the collapsible container to fullHeight on click of the plus icon', function() {
    var renderedIcon = TestUtils.findRenderedDOMComponentWithClass(renderedCollapsible, 'icon-add');
    var clickableIcon = renderedIcon.getDOMNode();
    TestUtils.Simulate.click(clickableIcon);
    expect(renderedCollapsible.state.height).toEqual(100);
  });
});