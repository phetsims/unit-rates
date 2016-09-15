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
      trackPixelLength:   600
    } );

    // seperate number line model w/ top/bottom ranges
    this.numberline = new URNumberLine( this.rateProperty, 200, 1, {
      markerTopDecimals:    0,
      markerBottomDecimals: 2
    } );

    this.elapsedTimeProperty       = elapsedTimeProperty;
    this.flagArrowsVisibleProperty = flagArrowsVisibleProperty;
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
