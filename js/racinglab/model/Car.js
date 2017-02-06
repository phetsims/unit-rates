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
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @constructor
   */
  function Car() {

    // @public speed of this car, in miles per hour
    this.speedProperty = new Property( 100 );

    // @public the car's distance from the starting line, in miles
    this.distancePropery = new Property( 0 );
  }

  unitRates.register( 'Car', Car );

  return inherit( Object, Car, {

    // @public
    reset: function() {
      this.speedProperty.reset();
      this.distancePropery.reset();
    },

    // @public
    step: function( dt ) {
      this.distancePropery.value = this.distancePropery.value + 1; //TODO implement Car.step, this is temporary
    }
  } );
} );