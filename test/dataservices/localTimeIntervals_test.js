var _ = require('lodash');
var d3 = require('d3');
var moment = require('moment-timezone');

/* global describe, it */

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var DateTriggerFilter = require('../../src/dataservices/DateTriggerFilter');
var localTimeIntervalsMaker = require('../../src/dataservices/localTimeIntervals');

// because jshint doesn't like .to.be.true
/* jshint expr: true */

describe('localTimeIntervalsMaker', function() {
  var offsetIntervals = new DateTriggerFilter([
      {
        type: 'offsetInterval',
        time: '2014-12-31T20:00:00-08:00',
        start: '2014-12-31T20:00:00-08:00',
        end: '2015-03-08T12:25:00-08:00',
        offsetFromUTC: -8.0,
        timezone: 'US/Pacific'
      },
      {
        type: 'offsetInterval',
        time: '2015-03-08T12:25:00-08:00',
        start: '2015-03-08T12:25:00-08:00',
        end: '2015-03-15T12:00:00-07:00',
        offsetFromUTC: -7.0,
        timezone: 'US/Pacific'
      },
      {
        type: 'offsetInterval',
        time: '2015-03-15T12:00:00-07:00',
        start: '2015-03-15T12:00:00-07:00',
        end: '2015-04-01T12:00:00-06:00',
        offsetFromUTC: -6.0,
        timezone: 'US/Mountain'
      },
      {
        type: 'offsetInterval',
        time: '2015-04-01T12:00:00-06:00',
        start: '2015-04-01T12:00:00-06:00',
        end: '2015-11-01T09:00:00-07:00',
        offsetFromUTC: -7.0,
        timezone: 'US/Pacific'
      },
      {
        type: 'offsetInterval',
        time: '2015-11-01T09:00:00-07:00',
        start: '2015-11-01T09:00:00-07:00',
        end: '2015-11-15T16:20:00-08:00',
        offsetFromUTC: -8.0,
        timezone: 'US/Pacific'
      },
      {
        type: 'offsetInterval',
        time: '2015-11-15T16:20:00-08:00',
        start: '2015-11-15T16:20:00-08:00',
        end: '2015-12-02T05:05:00+01:00',
        offsetFromUTC: 1.0,
        timezone: 'Europe/Budapest'
      },
      {
        type: 'offsetInterval',
        time: '2015-12-02T05:05:00+01:00',
        start: '2015-12-02T05:05:00+01:00',
        end: '2015-12-05T10:35:00-10:00',
        offsetFromUTC: -10.0,
        timezone: 'Pacific/Honolulu'
      }
    ]);

  it('exports a function', function() {
    assert.isFunction(localTimeIntervalsMaker);
  });

  it('makes a function', function() {
    assert.isFunction(localTimeIntervalsMaker());
  });

  describe('localTimeIntervals', function() {
    var localTimeIntervals = localTimeIntervalsMaker(offsetIntervals, {step: 6});

    it('produces an array of objects with a `time`, `duration`, and `localHour`', function() {
      var newYears = new Date('2015-01-01T08:00:00.000Z');
      var sixes = [0,6,12,18];
      _.each(localTimeIntervals([
        newYears,
        d3.time.week.utc.offset(newYears, 1)
      ]), function(d) {
        assert.isNumber(d.time);
        assert.isNumber(d.duration);
        assert.isNumber(d.localHour);
        expect(_.includes(sixes, d.localHour));
      });
    });

    it('produces an empty array if no intersection between bounds and offsetIntervals', function() {
      var newYears2014 = new Date('2014-01-01T08:00:00.000Z');
      expect(localTimeIntervals([
        newYears2014,
        d3.time.week.utc.offset(newYears2014, 1)
      ])).to.deep.equal([]);
    });

    it('produces `time` values representing step intervals in local timezone', function() {
      var newYears = new Date('2015-01-01T08:00:00.000Z');
      var sixes = [0,6,12,18];
      _.each(localTimeIntervals([
        newYears,
        d3.time.day.utc.offset(newYears, 2)
      ]), function(d) {
        expect(_.includes(sixes, moment(d.time).tz('US/Pacific').hour())).to.be.true;
      });
    });

    it('produces a foreshortened duration for Spring Forward interval', function() {
      var justBeforeSpringForward = new Date('2015-03-08T08:00:00.000Z');
      var justAfterSpringForward = new Date('2015-03-09T07:00:00.000Z');
      var res = localTimeIntervals([
        justBeforeSpringForward,
        justAfterSpringForward
      ]);
      expect(res.length).to.equal(6);
      expect(res[0].duration).to.equal(216e5);
      expect(res[1].duration).to.equal(18e6);
      expect(res[2].duration).to.equal(216e5);
      expect(res[3].duration).to.equal(51e5);
      expect(res[4].duration).to.equal(165e5);
      expect(res[5].duration).to.equal(216e5);
    });

    it('produces a lengthened duration for Fall Back interval', function() {
      var justBeforeFallBack = new Date('2015-11-01T07:00:00.000Z');
      var justAfterFallBack = new Date('2015-11-01T16:00:00.000Z');
      var res = localTimeIntervals([
        justBeforeFallBack,
        justAfterFallBack
      ]);
      expect(res.length).to.equal(3);
      expect(res[0].duration).to.equal(216e5);
      expect(res[1].duration).to.equal(252e5);
      expect(res[2].duration).to.equal(72e5);
    });

    it('produces a foreshortened interval as appropriate when changing timezones', function() {
      var justBeforeMountain = new Date('2015-03-15T00:00:00-07:00');
      var justAfterMountain = new Date('2015-03-16T00:00:00-06:00');
      var res = localTimeIntervals([
        justBeforeMountain,
        justAfterMountain
      ]);
      expect(res.length).to.equal(5);
      expect(res[0].duration).to.equal(216e5);
      expect(res[1].duration).to.equal(216e5);
      expect(res[2].duration).to.equal(216e5);
      expect(res[3].duration).to.equal(18e6);
      expect(res[4].duration).to.equal(216e5);
    });

    it('produces a lengthened interval as appropriate when changing timezones', function() {
      var justBeforePacific = new Date('2015-04-01T00:00:00-06:00');
      var justAfterPacific = new Date('2015-04-02T00:00:00-07:00');
      var res = localTimeIntervals([
        justBeforePacific,
        justAfterPacific
      ]);
      expect(res.length).to.equal(6);
      expect(res[0].duration).to.equal(216e5);
      expect(res[1].duration).to.equal(216e5);
      expect(res[2].duration).to.equal(216e5);
      expect(res[3].duration).to.equal(36e5);
      expect(res[4].duration).to.equal(216e5);
      expect(res[5].duration).to.equal(216e5);
    });

    it('deals with timezone changes that are greater than the defined interval step, lose time', function() {
      var justBeforeBudapest = new Date('2015-11-15T08:00:00.000Z');
      var justAfterBudapest = new Date('2015-11-16T23:00:00.000Z');
      var res = localTimeIntervals([
        justBeforeBudapest,
        justAfterBudapest
      ]);
      expect(res.length).to.equal(8);
      expect(res[0].duration).to.equal(216e5);
      expect(res[1].duration).to.equal(216e5);
      expect(res[2].duration).to.equal(216e5);
      expect(res[3].duration).to.equal(156e5);
      expect(res[4].duration).to.equal(168e5);
      expect(res[5].duration).to.equal(216e5);
      expect(res[6].duration).to.equal(216e5);
      expect(res[7].duration).to.equal(216e5);
    });

    it('deals with timezone changes that are greater than the defined interval step, gain time', function() {
      var justBeforeHawaii = new Date('2015-12-01T23:00:00.000Z');
      var justAfterHawaii = new Date('2015-12-03T10:00:00.000Z');
      var res = localTimeIntervals([
        justBeforeHawaii,
        justAfterHawaii
      ]);
      expect(res.length).to.equal(7);
      expect(res[0].duration).to.equal(216e5);
      expect(res[1].duration).to.equal(183e5);
      expect(res[2].duration).to.equal(213e5);
      expect(res[3].duration).to.equal(216e5);
      expect(res[4].duration).to.equal(216e5);
      expect(res[5].duration).to.equal(216e5);
      expect(res[6].duration).to.equal(216e5);
    });
  });
});