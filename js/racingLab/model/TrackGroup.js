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

  /**
   * @constructor
   */
  function TrackGroup( elapsedTimeProperty, flagArrowsVisibleProperty ) {

    PropertySet.call( this, {
      miles:              200,                            // used in rate adjustment spinner
      milesRange:         new RangeWithValue( 20, 200 ),  // used in rate adjustment spinner
      hours:              1,                              // used in rate adjustment spinner
      hoursRange:         new RangeWithValue( 1, 10 ),    // used in rate adjustment spinner
      rate:               200,
      carFinished:        false,
      trackPixelLength:   600,
      trackMiles:         200,
      trackHours:         1
    } );

    var self = this;

    // seperate number line model w/ top/bottom ranges
    this.numberline = new URNumberLine( this.rateProperty, this.trackMilesProperty, this.trackHoursProperty, {
      markerTopDecimals:          0,
      markerBottomDecimals:       2,
      markerTopHighPrecision:     1,
      markerBottomHighPrecision:  2
    } );

    this.elapsedTimeProperty       = elapsedTimeProperty;
    this.flagArrowsVisibleProperty = flagArrowsVisibleProperty;

    // Adjust the number line hours to match the track (note: track miles is fixed in this sim)
    this.rateProperty.lazyLink( function( rate, oldRate ) {
      self.trackHoursProperty.value =  self.trackMilesProperty.value / rate;
    } );
  }

  unitRates.register( 'TrackGroup', TrackGroup );

  return inherit( PropertySet, TrackGroup, {

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
      this.milesProperty.reset();
      this.milesRangeProperty.reset();
      this.hoursProperty.reset();
      this.hoursRangeProperty.reset();
      this.rateProperty.reset();
      this.carFinishedProperty.reset();
    }

  } ); // inherit

} ); // define
