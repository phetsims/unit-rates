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
  var RacingLabConstants = require( 'UNIT_RATES/racingLab/RacingLabConstants' );

  /**
   * @constructor
   */
  function RacingLabModel() {

    PropertySet.call( this, {
      running: false,
      timer: 0.0
    } );

    this.runningProperty.link( function( value, oldValue ) {
    } );

  }

  unitRates.register( 'RacingLabModel', RacingLabModel );

  return inherit( PropertySet, RacingLabModel, {

    /**
     * {number} dt - time step
     * @public
     */
    step: function( dt ) {
      if ( this.running && dt < 1 ) {
        var elapsedHours =  ( dt * RacingLabConstants.TIME_DT_FACTOR );
        this.timerProperty.value += elapsedHours;
      }
    }


  } ); // inherit

} ); // define
