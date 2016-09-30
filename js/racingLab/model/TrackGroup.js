// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URNumberLine = require( 'UNIT_RATES/common/model/URNumberLine' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Property = require( 'AXON/Property' );

  // constants
  var MAX_MILES = 200;    // This is the fixed distance of the track (and top number line axis) in miles

  /**
   * @constructor
   */
  function TrackGroup( elapsedTimeProperty, flagArrowsVisibleProperty ) {

    PropertySet.call( this, {
      miles:              100,                            // used in rate adjustment spinner
      milesRange:         new RangeWithValue( 20, 100 ),  // used in rate adjustment spinner
      hours:              1,                              // used in rate adjustment spinner
      hoursRange:         new RangeWithValue( 1, 10 ),    // used in rate adjustment spinner
      rate:               200,                            // the unit rate for the track
      carFinished:        false,                          // flag set when the car passes the finish point
      numberLineMaxHours: 1,                              // the number line's maximum bottom value
      trackPixelLength:   600,                            // the length of the track in pixels
      trackMiles:         MAX_MILES,                      // the length of the track in miles
      trackHours:         1                               // the length of the track in hours
    } );

    var self = this;

    this.elapsedTimeProperty = elapsedTimeProperty;
    this.flagArrowsVisibleProperty = flagArrowsVisibleProperty;

    // seperate number line model w/ top/bottom ranges - (note: top number line (miles) is fixed at MAX_MILES)
    this.numberline = new URNumberLine( this.rateProperty, new Property( MAX_MILES ), this.numberLineMaxHoursProperty, {
      markerTopDecimals:          0,
      markerBottomDecimals:       2,
      markerTopHighPrecision:     1,
      markerBottomHighPrecision:  2
    } );

    // Adjust the number line hours to match the track (note: track distance is fixed in this sim, it's always MAX_MILES)
    this.rateProperty.link( function( rate, oldRate ) {
      self.numberLineMaxHoursProperty.value =  MAX_MILES / rate;
    } );

    // Adjust the max track hours based on a change in the rate
    Property.lazyMultilink( [ this.trackMilesProperty, this.rateProperty ], function( miles, rate ) {
      self.trackHoursProperty.value =  miles / rate;
    } );

    // Check elapsed time to see if the car has finished
    this.elapsedTimeProperty.link( function( value, oldValue ) {
      self.carFinishedProperty.value = ( value >= self.trackHoursProperty.value );
    } );
  }

  unitRates.register( 'TrackGroup', TrackGroup );

  return inherit( PropertySet, TrackGroup, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Resets the finished flag for the track
     * @public
     */
    restart: function() {
      this.carFinishedProperty.reset();
    },

    /**
     * Resets the model to it's initial state
     * @public
     */
    reset: function() {
      this.numberline.reset();
      this.milesProperty.reset();
      this.milesRangeProperty.reset();
      this.hoursProperty.reset();
      this.hoursRangeProperty.reset();
      this.rateProperty.reset();
      this.numberLineMaxHoursProperty.reset();
      this.trackPixelLengthProperty.reset();
      this.trackMilesProperty.reset();
      this.trackHoursProperty.reset();
      this.carFinishedProperty.reset();
    }

  } ); // inherit

} ); // define
