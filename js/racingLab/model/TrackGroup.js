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
  var RangeWithValue = require( 'DOT/RangeWithValue' );

  /**
   * @constructor
   */
  function TrackGroup( elapsedTimeProperty ) {

    PropertySet.call( this, {
      miles:        50,
      milesRange:   new RangeWithValue( 1, 250 ),
      hours:        1,
      hoursRange:   new RangeWithValue( 1, 20 ),
      rate:         50,
      carFinished:  false
    } );

    //var self = this;

    // seperate number line model
    //this.numberline = new NumberLine();

    this.elapsedTimeProperty = elapsedTimeProperty;
    this.elapsedTimeProperty.link( function( value, oldValue ) {
      console.log('Time: ' + value.toFixed(2));
    } );

    this.milesProperty.link( function( value, oldValue ) {
      console.log('Miles: ' + value);
    } );

    this.hoursProperty.link( function( value, oldValue ) {
      console.log('Hours: ' + value);
    } );

    this.rateProperty.link( function( value, oldValue ) {
      console.log('Rate: ' + value.toFixed(2));
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
     *
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
