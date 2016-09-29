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
  var MAX_MILES = 100;

  /**
   * @constructor
   */
  function TrackGroup( elapsedTimeProperty, flagArrowsVisibleProperty ) {

    PropertySet.call( this, {
      miles:              100,                            // used in rate adjustment spinner
      milesRange:         new RangeWithValue( 20, 100 ),  // used in rate adjustment spinner
      hours:              1,                              // used in rate adjustment spinner
      hoursRange:         new RangeWithValue( 1, 10 ),    // used in rate adjustment spinner
      rate:               100,                            // teh starting rate - based on the above spinner defaults
      carFinished:        false,
      numberLineMaxHours: 1,
      trackPixelLength:   600,
      trackMiles:         MAX_MILES,
      trackHours:         1
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

    // Adjust the number line hours to match the track (note: track miles is fixed in this sim)
    this.rateProperty.link( function( rate, oldRate ) {
      self.numberLineMaxHoursProperty.value =  MAX_MILES / rate;
    } );

    // Adjust the max track hours
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
     *
     * @public
     */
    restart: function() {
      this.carFinishedProperty.reset();
    },

    /**
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
