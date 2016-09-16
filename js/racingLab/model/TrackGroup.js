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
      miles:              200,
      milesRange:         new RangeWithValue( 20, 200 ),
      hours:              1,
      hoursRange:         new RangeWithValue( 1, 10 ),
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

    // make the track hours the same as the rate spinner hours (note: track miles is fixed in this sim)
    this.hoursProperty.lazyLink( function( value, oldValue ) {
      self.trackHoursProperty.value = value;
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
