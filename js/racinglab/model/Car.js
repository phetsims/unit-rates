// Copyright 2017, University of Colorado Boulder

/**
 * Model of a car in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var Rate = require( 'UNIT_RATES/common/model/Rate' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @constructor
   */
  function Car() {

    // @public rate of this car, in miles per hour
    this.rate = new Rate( 100, 1 );

    // @public the car's distance from the starting line, in miles
    this.distancePropery = new Property( 0 );
  }

  unitRates.register( 'Car', Car );

  return inherit( Object, Car, {

    // @public
    reset: function() {
      this.rate.reset();
      this.distancePropery.reset();
    },

    // @public
    step: function( dt ) {
      this.distancePropery.value = this.distancePropery.value + 1; //TODO implement Car.step, this is temporary
    }
  } );
} );