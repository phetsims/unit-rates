// Copyright 2016, University of Colorado Boulder

/**
 * TODO document, https://github.com/phetsims/unit-rates/issues/64
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );

  // sim modules
  var OLDURNumberLine = require( 'UNIT_RATES/old/common/model/OLDURNumberLine' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  var MAX_MILES = 200;    // This is the fixed distance of the track (and top number line axis) in miles

  /**
   * @constructor
   */
  function OLDTrackGroup( elapsedTimeProperty, flagArrowsVisibleProperty ) {

    //TODO these Properties look like they should be constants
    this.milesRangeProperty = new Property( new Range( 20, 100 ) ); // used in rate adjustment spinner
    this.hoursRangeProperty = new Property( new Range( 1, 10 ) ); // used in rate adjustment spinner
    this.numberLineMaxHoursProperty = new Property( 1 ); // the number line's maximum bottom value
    this.trackHoursProperty = new Property( 1 ); // the length of the track in hours

    this.milesProperty = new Property( 100 ); // used in rate adjustment spinner
    this.hoursProperty = new Property( 1 ); // used in rate adjustment spinner

    //TODO derive from milesProperty and hoursProperty?
    this.rateProperty = new Property( 200 ); // the unit rate for the track

    this.carFinishedProperty = new Property( false ); // flag set when the car passes the finish point
    this.trackPixelLengthProperty = new Property( 600 ); // the length of the track in pixels
    this.trackMilesProperty = new Property( MAX_MILES ); // the length of the track in miles

    var self = this;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.elapsedTimeProperty = elapsedTimeProperty;
    this.flagArrowsVisibleProperty = flagArrowsVisibleProperty;

    // separate number line model w/ top/bottom ranges - (note: top number line (miles) is fixed at MAX_MILES)
    this.numberline = new OLDURNumberLine( this.rateProperty, new Property( MAX_MILES ), this.numberLineMaxHoursProperty, {
      markerTopDecimals: 0,
      markerBottomDecimals: 2,
      markerTopHighPrecision: 1,
      markerBottomHighPrecision: 2
    } );

    // Adjust the number line hours to match the track (note: track distance is fixed in this sim, it's always MAX_MILES)
    this.rateProperty.link( function( rate, oldRate ) {
      self.numberLineMaxHoursProperty.value = MAX_MILES / rate;
    } );

    // Adjust the max track hours based on a change in the rate
    Property.lazyMultilink( [ this.trackMilesProperty, this.rateProperty ], function( miles, rate ) {
      self.trackHoursProperty.value = miles / rate;
    } );

    // Check elapsed time to see if the car has finished
    this.elapsedTimeProperty.link( function( value, oldValue ) {
      self.carFinishedProperty.value = ( value >= self.trackHoursProperty.value );
    } );
  }

  unitRates.register( 'OLDTrackGroup', OLDTrackGroup );

  return inherit( Object, OLDTrackGroup, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Resets the finished flag for the track
     *
     * @public
     */
    restart: function() {
      this.carFinishedProperty.reset();
    },

    // @public
    reset: function() {

      this.numberline.reset();

      // reset Properties
      this.milesProperty.reset();
      this.milesRangeProperty.reset();
      this.hoursProperty.reset();
      this.hoursRangeProperty.reset();
      this.rateProperty.reset();
      this.carFinishedProperty.reset();
      this.numberLineMaxHoursProperty.reset();
      this.trackPixelLengthProperty.reset();
      this.trackMilesProperty.reset();
      this.trackHoursProperty.reset();
    }

  } ); // inherit

} ); // define
